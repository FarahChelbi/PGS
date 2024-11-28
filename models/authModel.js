const pool = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Nombre de rounds pour le hashage


const checkEmailExists = async (email) => {
    const result = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    return result.rows.length > 0;
};


const registerUser = async (email, hashedPassword) => {
    const result = await pool.query(
        'INSERT INTO utilisateurs (email, mdp) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
    );
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    return result.rows[0];
};

module.exports = {
    checkEmailExists,
    registerUser,
    findUserByEmail,
};
