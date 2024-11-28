$(document).ready(function() {
    let contratData = []; // Variable globale pour stocker les données des contrats

    // Fonction pour charger les données depuis l'API
    function loadData(searchTerm = '') {
        $.ajax({
            url: 'http://localhost:3000/contrats/api', // URL correcte pour récupérer les données JSON
            method: 'GET',
            success: function(response) {
                console.log('Response received:', response); // Debug: Vérifie le format des données
                const tableBody = $('.datatables-basic tbody');
                tableBody.empty(); // Effacer les lignes existantes

                // Assure-toi que response est un tableau
                if (Array.isArray(response)) {
                    contratData = response; // Stocker les données dans la variable globale

                    // Filtrer les données selon le terme de recherche
                    const searchTermLower = searchTerm.toLowerCase();
                    const filteredData = response.filter(row => {
                        const matriculeMatch = row.Matricule.toLowerCase().startsWith(searchTermLower);
                        const contratMatch = row.CONTRAT ? row.CONTRAT.toLowerCase().startsWith(searchTermLower) : false;
                        const integrationMatch = row.PERIODE_D_INTEGRATION ? row.PERIODE_D_INTEGRATION.toLowerCase().startsWith(searchTermLower) : false;
                        return matriculeMatch || contratMatch || integrationMatch;
                    });

                    // Afficher les résultats filtrés dans la table
                    filteredData.forEach(row => {
                        const newRow = `
                            <tr data-id="${row.Cont_PK}">
                                <td>${row.Matricule}</td>
                                <td>${row.CONTRAT}</td>
                                <td>${row.DATE_DE_DEBUT}</td>
                                <td>${row.PERIODE_D_INTEGRATION}</td>
                                <td>${row.FIN__CONTRAT_PERIODE_D_ESSAI}</td>
                                <td>
                                    <button class="btn btn-secondary details-btn edit-btn" href="javascript:;" data-id="${row.Cont_PK}">Modifier</button>
                                    <button class="btn btn-danger delete-btn" data-id="${row.Cont_PK}">Delete</button>
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
        $('.cancel-btn').on('click', function() {
            $('.card-details').hide();
            $('#layout-navbar').show();
            $('.card-datatable').show();
            window.scrollTo(0, scrollPosition); // Restaurer la position de défilement
        });

        $(document).off('click', '.edit-btn').on('click', '.edit-btn', function() {
            const id = $(this).data('id');
            const contrat = contratData.find(e => e.Cont_PK === id);
        
            if (contrat) {
                $('#edit-contrat-id').val(contrat.Cont_PK);
                $('#edit-contrat').val(contrat.CONTRAT);
                $('#edit-date-debut').val(contrat.DATE_DE_DEBUT);
                $('#edit-integration').val(contrat.PERIODE_D_INTEGRATION);
                $('#edit-date-fin').val(contrat.FIN__CONTRAT_PERIODE_D_ESSAI);
        
                $('.card-datatable').hide();
                $('.card-edit').show();
                $('#layout-navbar').hide();
            } else {
                console.error('Contrat non trouvé pour l\'ID:', id);
            }
        });

        // Gestionnaire pour le formulaire d'édition
        $('#edit-contrat-form').off('submit').on('submit', function(e) {
            e.preventDefault();
        
            const formData = {
                contrat_id: $('#edit-contrat-id').val(),  // Assurez-vous que l'ID est bien là
                contrat: $('#edit-contrat').val(),
                date_debut: $('#edit-date-debut').val(),
                integration: $('#edit-integration').val(),
                date_fin: $('#edit-date-fin').val(),
            };
            
            console.log('Données du formulaire:', formData);
        
            $.ajax({
                url: `http://localhost:3000/contrats/update-contrat/${formData.contrat_id}`,
                method: 'PUT',
                data: formData,
                success: function(response) {
                    alert('Données modifiées avec succès');
                    loadData();
                    $('.card-edit').hide();
                    $('.card-datatable').show();
                    $('#layout-navbar').show();
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
            if (confirm('Êtes-vous sûr de vouloir supprimer ce contrat?')) {
                $.ajax({
                    url: `http://localhost:3000/contrats/api/${id}`, // Assure-toi que l'URL est correcte
                    method: 'DELETE',
                    success: function() {
                        alert('Contrat supprimé.');
                        loadData(); // Recharger les données après la suppression
                        //$('.card-details').hide();
                        $('#layout-navbar').show();
                        $('.card-datatable').show();
                    },
                    error: function(error) {
                        console.error('Erreur lors de la suppression du contrat:', error);
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
            if (confirm('Êtes-vous sûr de vouloir supprimer ce contrat?')) {
                $.ajax({
                    url: `http://localhost:3000/contrats/api/${id}`, // Assure-toi que l'URL est correcte
                    method: 'DELETE',
                    success: function() {
                        alert('Contrat supprimé.');
                        loadData(); // Recharger les données après la suppression
                        //$('.card-details').hide();
                        $('#layout-navbar').show();
                        $('.card-datatable').show();
                    },
                    error: function(error) {
                        console.error('Erreur lors de la suppression du contrat :', error);
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
