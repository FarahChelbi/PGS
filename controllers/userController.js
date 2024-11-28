const User = require('../models/userModel');
const pool = require('../config/database');

// Liste des utilisateurs en JSON pour l'API
exports.listUsersJSON = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Liste des utilisateurs pour la vue
exports.getAllUsers = async () => {
    try {
        const users = await User.getAllUsers();
        return users;
        
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Internal Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.deleteUserById(id);
        res.status(200).json({ message: 'Employé supprimé avec succès' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addUser = async (req, res) => {
    console.log('Requête reçue pour ajouter un utilisateur:', req.body);

    try {
        // Log des données avant l'appel à la fonction addUser
        console.log('Données reçues pour ajout:', req.body);

        await User.addUser(req.body);
        

        // Log après l'insertion réussie
        console.log('Utilisateur ajouté avec succès');
        res.redirect('/users');
    } catch (error) {
        // Log des erreurs lors de l'ajout
        console.error('Erreur lors de l\'ajout de l\'employé:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





exports.updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Log des données avant l'appel à la fonction updateUserById
        console.log('Données reçues pour modification:', req.body);

        await User.updateUserById(id, req.body);

        // Log après la mise à jour réussie
        console.log('Utilisateur mis à jour avec succès');
        res.redirect('/users');  // Redirection vers la page des utilisateurs après la mise à jour
    } catch (error) {
        // Log des erreurs lors de la mise à jour
        console.error('Erreur lors de la mise à jour de l\'employé:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getEmployee = async (req, res) => {
    const employeeId = req.params.id;
    try {
        const employee = await User.getEmployeeById(employeeId);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error retrieving employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller pour mettre à jour un employé
exports.updateEmployee = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    try {
        const updatedEmployee = await User.updateEmployeeById(id, data);
        if (updatedEmployee) {
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



