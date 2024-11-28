const bcrypt = require('bcrypt');
const authModel = require('../models/authModel');

const saltRounds = 10;

// Fonction pour l'enregistrement
exports.register = async (req, res) => {
    const { email, mdp } = req.body;

    try {
        // Vérifier si l'email est déjà utilisé
        const emailExists = await authModel.checkEmailExists(email);

        if (emailExists) {
            return res.status(409).json({ error: 'Email déjà utilisé' });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(mdp, saltRounds);

        // Enregistrer l'utilisateur
        const newUser = await authModel.registerUser(email, hashedPassword);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Fonction pour la connexion
exports.login = async (req, res) => {
    const { email, mdp } = req.body;

    try {
        // Trouver l'utilisateur par email
        const user = await authModel.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Comparer le mot de passe fourni avec le mot de passe haché
        const match = await bcrypt.compare(mdp, user.mdp);

        if (match) {
            // Connexion réussie
            res.status(200).json({ message: 'Connexion réussie' });
        } else {
            res.status(401).json({ error: 'Mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
