const pool = require('../config/database');

const getAllServices = async () => {
    const result = await pool.query('SELECT * FROM "DIM_DEPARTEMENTS"');
    return result.rows;
};

const deleteServiceById = async (id) => {
    await pool.query('DELETE FROM "DIM_DEPARTEMENTS" WHERE "Depart_PK" = $1', [id]);
};

const addService = async (serviceData) => {
    const {
        departement
    } = serviceData;

    try {
        console.log('Préparation de l\'insertion avec les données:', {
            departement
        });

        const maxResult = await pool.query('select max("Depart_PK") as max_pk from "DIM_DEPARTEMENTS"');
        const maxPK = maxResult.rows[0].max_pk || 0;
        const newPK = maxPK + 1;
        console.log('Nouvelle clé primaire pour l\'ajout:', newPK);
        await pool.query(
            `insert into "DIM_DEPARTEMENTS"
            ("Depart_PK", "Departement") values ($1, $2)`,
            [newPK, departement]
        );
        console.log("Insertion réussie");
    }catch(error) {
        console.error('Erreur lors de l\'insertion du service:', error);
        throw error;
    }
};



module.exports = {
    getAllServices,
    deleteServiceById,
    addService,

};