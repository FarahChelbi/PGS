$(document).ready(function() {
    let employeeData = []; // Variable globale pour stocker les données des employés

    // Fonction pour charger les données depuis l'API
    function loadData(searchTerm = '') {
        $.ajax({
            url: 'http://localhost:3000/users/api', // URL correcte pour récupérer les données JSON
            method: 'GET',
            success: function(response) {
                console.log('Response received:', response); // Debug: Vérifie le format des données
                const tableBody = $('.datatables-basic tbody');
                tableBody.empty(); // Effacer les lignes existantes

                // Assure-toi que response est un tableau
                if (Array.isArray(response)) {
                    employeeData = response; // Stocker les données dans la variable globale

                    // Filtrer les données selon le terme de recherche
                    const searchTermLower = searchTerm.toLowerCase();
                    const filteredData = response.filter(row => {
                        const matriculeMatch = row.Matricule && row.Matricule.toLowerCase().indexOf(searchTermLower) === 0;
                        const nomMatch = row.Nom && row.Nom.toLowerCase().indexOf(searchTermLower) === 0;
                        const prenomMatch = row.Prenom && row.Prenom.toLowerCase().indexOf(searchTermLower) === 0;
                        const fonctionMatch = row.Fonction ? row.Fonction.toLowerCase().indexOf(searchTermLower) === 0 : false;
                        return matriculeMatch || nomMatch || prenomMatch || fonctionMatch;
                    });

                    // Afficher les résultats filtrés dans la table
                    filteredData.forEach(row => {
                        const newRow = `
                            <tr data-id="${row.Empl_PK}">
                                <td>${row.Matricule}</td>
                                <td>${row.Nom}</td>
                                <td>${row.Prenom}</td>
                                <td>${row.Societe}</td>
                                <td>${row.Fonction}</td>
                                <td>
                                
                                    <button class="btn btn-secondary details-btn">Détails</button>
                                    <button class="btn btn-danger delete-btn" data-id="${row.Empl_PK}">Supp</button>
                                
                                </td>
                            </tr>
                        `;
                        tableBody.append(newRow);
                    });

                    // Réattacher les gestionnaires d'événements pour les boutons "Détails" et "Delete"
                    attachEventHandlers();
                } else {
                    console.error('Data is not an array:', response);
                }
            },
            error: function(error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        });
    }

    // Fonction pour attacher les gestionnaires d'événements aux boutons
    function attachEventHandlers() {
        $(document).off('click', '.details-btn').on('click', '.details-btn', function() {
            scrollPosition = window.scrollY; 
            const row = $(this).closest('tr');
            const id = row.data('id');
            const employee = employeeData.find(e => e.Empl_PK === id);

            if (employee) {
                $('#employee-details').html(`
                    <div id="employee-details" class="container mt-4">
    <!-- Détails de l'employé -->
    <div class="row mb-3">
        <div class="col-md-6">
            <label class="form-label">Matricule</label>
            <input type="text" value="${employee.Matricule}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Nom</label>
            <input type="text" value="${employee.Nom}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Prénom</label>
            <input type="text" value="${employee.Prenom}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Sexe</label>
            <input type="text" value="${employee.Sexe}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Diplôme</label>
            <input type="text" value="${employee.Diplome}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Date de départ</label>
            <input type="text" value="${employee.Date_depart}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Motif</label>
            <input type="text" value="${employee.Motif}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">N° CIN</label>
            <input type="text" value="${employee.N_Cin}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">N° CNSS</label>
            <input type="text" value="${employee.N_CNSS}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Date de naissance</label>
            <input type="text" value="${employee.Date_naiss}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Lieu</label>
            <input type="text" value="${employee.LIEU}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Etat civil</label>
            <input type="text" value="${employee.ETAT_CIVIL}" class="form-control" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Date de titularisation</label>
            <input type="text" value="${employee.Date_titularisation}" class="form-control" readonly />
        </div>
         <div class="col-md-6">
            <label class="form-label">Nombre d'enfants</label>
            <input type="text" value="${employee.N_enf}" class="form-control" readonly />
        </div>
    </div>
    <!-- Boutons -->
    <div class="text-center mt-4">
    <button class="btn btn-primary text-white me-2 mb-2 edit-btn" data-id="${employee.Empl_PK}">
            <i class="fas fa-pencil-alt me-2"></i> Modifier
        </button>
        <a class="btn btn-danger text-white me-2 mb-2 delete-btn" href="javascript:;" data-id="${employee.Empl_PK}">
            <i class="fas fa-trash-alt me-2"></i> Supprimer
        </a>
        

        <a class="btn btn-secondary text-white mb-2 cancel-btn" href="javascript:;">
            <i class="fas fa-arrow-left me-2"></i> Retour
        </a>
    </div>
</div>

                `);

                $('#layout-navbar').hide();
                $('.card-datatable').hide();
                $('.card-details').show();

                // Réattacher les gestionnaires d'événements pour le bouton "Supprimer" dans les détails
                attachDetailEventHandlers();
            }
        });

        $('.cancel-btn').on('click', function() {
            $('.card-details').hide();
            $('#layout-navbar').show();
            $('.card-datatable').show();
            window.scrollTo(0, scrollPosition); // Restaurer la position de défilement
        });

        $(document).off('click', '.edit-btn').on('click', '.edit-btn', function() {
            const id = $(this).data('id');
            const employee = employeeData.find(e => e.Empl_PK === id);
    
            if (employee) {
                $('#edit-employee-id').val(employee.Empl_PK);
                $('#edit-matricule').val(employee.Matricule);
                $('#edit-nom').val(employee.Nom);
                $('#edit-prenom').val(employee.Prenom);
                $('#edit-sexe').val(employee.Sexe);
                $('#edit-diplome').val(employee.Diplome);
                $('#edit-date-depart').val(employee.Date_depart);
                $('#edit-motif').val(employee.Motif);
                $('#edit-cin').val(employee.N_Cin);
                $('#edit-cnss').val(employee.N_CNSS);
                $('#edit-fonction').val(employee.Fonction);
                $('#edit-societe').val(employee.Societe);
                $('#edit-tel').val(employee.N_Tel || ''); 
                $('#edit-date-naiss').val(employee.Date_naiss);
                $('#edit-lieu').val(employee.LIEU);
                $('#edit-etat-civil').val(employee.ETAT_CIVIL);
                $('#edit-date-titularisation').val(employee.ETAT_CIVIL);
                $('#edit-n-enf').val(employee.N_enf);
    
                $('.card-details').hide();
                $('.card-edit').show();
            }
        });
    
        // Gestionnaire pour le formulaire d'édition
        $('#edit-employee-form').off('submit').on('submit', function(e) {
            e.preventDefault();
    
            const formData = {
                Empl_PK: $('#edit-employee-id').val(),
                matricule: $('#edit-matricule').val(),
                nom: $('#edit-nom').val(),
                prenom: $('#edit-prenom').val(),
                sexe: $('#edit-sexe').val(),
                diplome: $('#edit-diplome').val(),
                date_depart: $('#edit-date-depart').val(),
                motif: $('#edit-motif').val(),
                cin: $('#edit-cin').val(),
                cnss: $('#edit-cnss').val(),
                fonction: $('#edit-fonction').val(),
                societe: $('#edit-societe').val(),
                tel: ($('#edit-tel').val() || null), 
                date_naiss: $('#edit-date-naiss').val(),
                lieu: $('#edit-lieu').val(),
                etat_civil: $('#edit-etat-civil').val(),
                date_titularisation: $('#edit-date-titularisation').val(),
                lieu: $('#edit-n-enf').val()
            };
    
            $.ajax({
                url: `http://localhost:3000/users/update-employee/${$('#edit-employee-id').val()}`,
                method: 'PUT',
                data: formData,
                success: function(response) {
                    alert('Données modifiées avec succès');
                    loadData();
                    $('.card-edit').hide();
                    $('.card-datatable').show();
                    $('#layout-navbar').show();
                    $('.card-details').hide();
                    window.scrollTo(0, scrollPosition); 
                },
                error: function(err) {
                    console.error('Erreur lors de la modification:', err);
                    alert('Erreur lors de la modification des données');
                }
            });
        });
    

        // Assure-toi que ce gestionnaire est attaché
        $('.delete-btn').on('click', function() {
            const id = $(this).data('id');
            if (confirm('Êtes-vous sûr de vouloir supprimer cet employé?')) {
                $.ajax({
                    url: `http://localhost:3000/users/api/${id}`, // Assure-toi que l'URL est correcte
                    method: 'DELETE',
                    success: function() {
                        alert('Employé supprimé.');
                        loadData(); // Recharger les données après la suppression
                        $('.card-details').hide();
                        $('#layout-navbar').show();
                        $('.card-datatable').show();
                    },
                    error: function(error) {
                        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
                    }
                });
            }
        });

        
    }

    // Fonction pour attacher les gestionnaires d'événements spécifiques à la vue des détails
    function attachDetailEventHandlers() {
        // Réattache le gestionnaire d'événements pour le bouton "Supprimer" dans les détails
        $('.delete-btn').off('click').on('click', function() {
            const id = $(this).data('id');
            if (confirm('Êtes-vous sûr de vouloir supprimer cet employé?')) {
                $.ajax({
                    url: `http://localhost:3000/users/api/${id}`, // Assure-toi que l'URL est correcte
                    method: 'DELETE',
                    success: function() {
                        alert('Employé supprimé.');
                        loadData(); // Recharger les données après la suppression
                        $('.card-details').hide();
                        $('#layout-navbar').show();
                        $('.card-datatable').show();
                    },
                    error: function(error) {
                        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
                    }
                });
            }
        });
        $(document).off('click', '.cancel-btn').on('click', '.cancel-btn', function() {
            $('.card-edit').hide();
            $('.card-datatable').show();
            $('.card-details').hide();
            $('#layout-navbar').show();
            window.scrollTo(0, scrollPosition); 
        });
      
    }
    

    // Gestionnaire pour la barre de recherche
    $('#search-input').on('input', function() {
        const searchTerm = $(this).val();
        loadData(searchTerm);
    });

    // Charger les données au démarrage
    loadData();
});
