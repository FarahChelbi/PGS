const Contrat = require('../models/contratModel');
const pool = require('../config/database');

exports.listContratsJSON = async (req, res) => {
    try {
        const contrats = await Contrat.getAllContrats();
        res.json(contrats);
    } catch (error) {
        console.error('Error fetching contrats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Liste des utilisateurs pour la vue
exports.getAllContrats = async () => {
    try {
        const contrats = await Contrat.getAllContrats();
        return contrats;
        
    } catch (error) {
        console.error('Error fetching contrats:', error);
        throw new Error('Internal Server Error');
    }
};
// Récupérer les matricules
exports.getMatricules = async (req, res) => {
    try {
        const matricules = await Contrat.getMatricules();
        res.json(matricules);
    } catch (error) {
        console.error('Erreur lors de la récupération des matricules:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};


// Ajouter un contrat
exports.addContrat = async (req, res) => {
    const { matricule, contrat, date_debut, integration, date_fin } = req.body;

    try {
        const newContrat = await Contrat.addContrat(matricule, contrat, date_debut, integration, date_fin);

        // Redirection vers la liste des contrats après l'ajout
        res.redirect('/contrats'); // Assurez-vous que cette route affiche la liste des contrats
    } catch (error) {
        console.error('Erreur lors de l\'ajout du contrat:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.updateContrat = async (req, res) => {
    const id = parseInt(req.body.contrat_id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid contract ID' });
    }

    const data = {
        contrat: req.body.contrat,
        date_debut: req.body.date_debut,
        integration: req.body.integration,
        date_fin: req.body.date_fin
    };

    try {
        const updatedContrat = await Contrat.updateContratById(id, data);
        if (updatedContrat) {
            res.json(updatedContrat);
        } else {
            res.status(404).json({ error: 'Contrat not found' });
        }
    } catch (error) {
        console.error('Error updating contrat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



exports.deleteContrat = async (req, res) => {
    const { id } = req.params;
    try {
        await Contrat.deleteContratById(id);
        res.status(200).json({ message: 'Contrat supprimé avec succès' });
    } catch (error) {
        console.error('Error deleting contrat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.listContratsExpirantDans3Semaines = async () => {
    try {
        const contratsExp = await Contrat.getContratsExpirantDans3Semaines();
        console.log('Contrats expirant dans 3 semaines:', contratsExp); 
       // res.render('contrats_expires', { contrats });
       return contratsExp;
    } catch (error) {
        console.error('Error fetching contrats:', error);
        res.status(500).send('Internal Server Error');
    }

};




