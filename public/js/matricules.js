document.addEventListener('DOMContentLoaded', function() {
    const matriculeSelect = document.getElementById('collapsible-matricule-employee');

    // Ajouter une option par défaut
    const defaultOption = document.createElement('option');
    defaultOption.value = ''; // Valeur vide pour la première option
    defaultOption.textContent = 'Numéro de la matricule'; // Texte affiché
    defaultOption.disabled = true; // Option non sélectionnable
    defaultOption.selected = true; // Marquer comme sélectionné par défaut
    matriculeSelect.appendChild(defaultOption);

    fetch('http://localhost:3000/contrats/matricules')
        .then(response => response.json())
        .then(data => {
            console.log('Données reçues:', data); // Ajoutez ceci pour voir les données dans la console
            data.forEach(matricule => {
                const option = document.createElement('option');
                option.value = matricule;
                option.textContent = matricule;
                matriculeSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des matricules:', error);
        });
});
