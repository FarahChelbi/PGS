const Service = require('../models/serviceModel');
const pool = require('../config/database');

exports.listServicesJSON = async (req, res) => {
    try {
        const services = await Service.getAllServices();
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllServices = async () => {
    try {
        const services = await Service.getAllServices();
        return services;
        
    } catch (error) {
        console.error('Error fetching services:', error);
        throw new Error('Internal Server Error');
    }
};

exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        await Service.deleteServiceById(id);
        res.status(200).json({ message: 'Service supprimé avec succès' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addService = async (req, res) => {
    console.log('Requête reçue pour ajouter un service:', req.body); 
    try {
        console.log('Données reçues pour ajout:', req.body);
        await Service.addService(req.body);
        console.log('Service ajouté avec succès');
        
        res.redirect('/services');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du service:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};