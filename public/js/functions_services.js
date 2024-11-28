$(document).ready(function() {
    function attachEventHandlers() {
        // Gestionnaire pour le bouton "Supprimer"
        $('.delete-btn').on('click', function() {
            const id = $(this).data('id');
            if (confirm('Êtes-vous sûr de vouloir supprimer ce service?')) {
                $.ajax({
                    url: `/services/api/${id}`, // Assure-toi que l'URL est correcte
                    method: 'DELETE',
                    success: function() {
                        alert('Service supprimé.');
                        loadData(); // Recharger les données après la suppression
                    },
                    error: function(error) {
                        console.error('Erreur lors de la suppression du service:', error);
                    }
                });
            }
        });
    }

    function loadData() {
        $.ajax({
            url: '/services/api',
            method: 'GET',
            success: function(data) {
                // Mettre à jour le tableau avec les nouvelles données
                const tbody = $('table.datatables-basic tbody');
                tbody.empty();
                data.forEach(service => {
                    tbody.append(`
                        <tr data-id="${service.Depart_PK}">
                            <td>${service.Depart_PK}</td>
                            <td>${service.Departement}</td>
                            <td>
                                <button class="btn btn-danger delete-btn" data-id="${service.Depart_PK}">Delete</button>
                            </td>
                        </tr>
                    `);
                });
                attachEventHandlers(); // Réattacher les gestionnaires d'événements
            },
            error: function(error) {
                console.error('Erreur lors du chargement des données:', error);
            }
        });
    }

    // Charger les données au démarrage
    loadData();
});
