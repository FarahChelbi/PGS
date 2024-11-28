const pool = require('../config/database');

const getAllContrats = async () => {
    const result = await pool.query(`
        SELECT 
                c."Cont_PK",
                e."Matricule" AS "Matricule",
                c."CONTRAT",
                c."DATE_DE_DEBUT",
                c."PERIODE_D_INTEGRATION",
                c."FIN__CONTRAT_PERIODE_D_ESSAI"
            FROM 
                "DIM_CONTRATS" c
            JOIN 
                "DIM_EMPLOYEES" e ON c."FK_Empl" = e."Empl_PK"
    `);
    return result.rows;
};

const getMatricules = async () => {
    try {
        const result = await pool.query('SELECT "Matricule" FROM "DIM_EMPLOYEES"');
        return result.rows.map(row => row.Matricule);
    } catch (error) {
        console.error('Erreur lors de la récupération des matricules:', error);
        throw new Error('Erreur interne du serveur');
    }
};
/*
const addContrat = async (matricule, type_contrat, date_debut, integration, date_fin) => {
    try {
        // Étape 1: Vérifier si le Matricule existe dans DIM_EMPLOYEES
        const employeeResult = await pool.query('SELECT "Empl_PK" FROM "DIM_EMPLOYEES" WHERE "Matricule" = $1', [matricule]);

        if (employeeResult.rows.length === 0) {
            throw new Error('Matricule non trouvé');
        }

        const emplPk = employeeResult.rows[0].Empl_PK;

        // Étape 2: Obtenir la valeur maximale actuelle de Cont_PK
        const maxResult = await pool.query('SELECT MAX("Cont_PK") AS max_pk FROM "DIM_CONTRATS"');
        const maxPK = maxResult.rows[0].max_pk || 0; // Si aucune valeur, commencer à 0

        const newPK = maxPK + 1;

        // Étape 3: Insérer le contrat dans la table DIM_CONTRATS
        const insertContratQuery = `
            INSERT INTO "DIM_CONTRATS" 
            ("Cont_PK", "FK_Empl", "CONTRAT", "DATE_DE_DEBUT", "PERIODE_D_INTEGRATION", "FIN__CONTRAT_PERIODE_D_ESSAI")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`;

        const contratResult = await pool.query(insertContratQuery, [newPK, emplPk, type_contrat, date_debut, integration, date_fin]);

        return contratResult.rows[0];
    } catch (error) {
        console.error('Erreur lors de l\'ajout du contrat:', error);
        throw new Error('Erreur interne du serveur');
    }
};

*/
const addContrat = async (matricule, type_contrat, date_debut, integration, date_fin) => {
    try {
        // Étape 1: Vérifier si le Matricule existe dans DIM_EMPLOYEES
        const employeeResult = await pool.query('SELECT "Empl_PK", "Matricule" FROM "DIM_EMPLOYEES" WHERE "Matricule" = $1', [matricule]);

        if (employeeResult.rows.length === 0) {
            throw new Error('Matricule non trouvé');
        }

        const emplPk = employeeResult.rows[0].Empl_PK;

        // Étape 2: Obtenir la valeur maximale actuelle de Cont_PK
        const maxResult = await pool.query('SELECT MAX("Cont_PK") AS max_pk FROM "DIM_CONTRATS"');
        const maxPK = maxResult.rows[0].max_pk || 0; // Si aucune valeur, commencer à 0

        const newPK = maxPK + 1;

        // Étape 3: Insérer le contrat dans la table DIM_CONTRATS
        const insertContratQuery = `
            INSERT INTO "DIM_CONTRATS" 
            ("Cont_PK", "FK_Empl", "CONTRAT", "DATE_DE_DEBUT", "PERIODE_D_INTEGRATION", "FIN__CONTRAT_PERIODE_D_ESSAI", "Matricule")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`;

        const contratResult = await pool.query(insertContratQuery, [newPK, emplPk, type_contrat, date_debut, integration, date_fin, matricule]);

        return contratResult.rows[0];
    } catch (error) {
        console.error('Erreur lors de l\'ajout du contrat:', error);
        throw new Error('Erreur interne du serveur');
    }
};



const updateContratById = async (id, data) => {
    const {
        contrat, date_debut, integration, date_fin
    } = data;

    try {
        const result = await pool.query(
            `UPDATE "DIM_CONTRATS"
            SET "CONTRAT" = $1, "DATE_DE_DEBUT" = $2, "PERIODE_D_INTEGRATION" = $3, "FIN__CONTRAT_PERIODE_D_ESSAI" = $4
            WHERE "Cont_PK" = $5
            RETURNING *`,
            [contrat, date_debut, integration, date_fin, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating contrat:', error.message); // Affiche l'erreur dans les logs serveur
        throw new Error('Error updating contrat: ' + error.message);
    }
};


const deleteContratById = async (id) => {
    await pool.query('DELETE FROM "DIM_CONTRATS" WHERE "Cont_PK" = $1', [id]);
};


/*
const getContratsExpirantDans3Semaines = async () => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM (
                SELECT 
                    c."Cont_PK", 
                    e."Matricule", 
                    c."CONTRAT", 
                    c."DATE_DE_DEBUT", 
                    c."PERIODE_D_INTEGRATION", 
                    c."FIN__CONTRAT_PERIODE_D_ESSAI",
                    
                    CASE 
                        WHEN c."FIN__CONTRAT_PERIODE_D_ESSAI" ~ '^\d{4}-\d{2}-\d{2}$' THEN 
                            TO_TIMESTAMP(c."FIN__CONTRAT_PERIODE_D_ESSAI", 'YYYY-MM-DD')
                        WHEN c."FIN__CONTRAT_PERIODE_D_ESSAI" ~ '^\d{2}/\d{2}/\d{4}$' THEN 
                            TO_TIMESTAMP(c."FIN__CONTRAT_PERIODE_D_ESSAI", 'DD/MM/YYYY')
                        ELSE 
                            NULL
                    END AS "expiry_timestamp"
                FROM "DIM_CONTRATS" c
                JOIN "DIM_EMPLOYEES" e ON c."FK_Empl" = e."Empl_PK"
                WHERE c."FIN__CONTRAT_PERIODE_D_ESSAI" NOT LIKE '%Pas de PE%'
            ) AS subquery
            WHERE "expiry_timestamp" BETWEEN NOW() AND NOW() + INTERVAL '3 weeks';
        `);

        console.log('Résultat de la requête:', result.rows);  // Pour vérifier le résultat de la requête
        return result.rows;
    } catch (error) {
        console.error('Error fetching contrats:', error);
        throw new Error('Internal Server Error');
    }
};
*/
const getContratsExpirantDans3Semaines = async () => {
    try {
        const query = `
            SELECT *
            FROM (
                SELECT 
                    c."Cont_PK", 
                    e."Matricule", 
                    c."CONTRAT", 
                    c."DATE_DE_DEBUT", 
                    c."PERIODE_D_INTEGRATION", 
                    c."FIN__CONTRAT_PERIODE_D_ESSAI",
                    -- Conversion des dates au format YYYY-MM-DD ou DD/MM/YYYY en timestamp
                    CASE 
                        WHEN c."FIN__CONTRAT_PERIODE_D_ESSAI" ~ '^\\d{4}-\\d{2}-\\d{2}$' THEN 
                            TO_TIMESTAMP(c."FIN__CONTRAT_PERIODE_D_ESSAI", 'YYYY-MM-DD')
                        WHEN c."FIN__CONTRAT_PERIODE_D_ESSAI" ~ '^\\d{2}/\\d{2}/\\d{4}$' THEN 
                            TO_TIMESTAMP(c."FIN__CONTRAT_PERIODE_D_ESSAI", 'DD/MM/YYYY')
                        ELSE 
                            NULL
                    END AS "expiry_timestamp"
                FROM "DIM_CONTRATS" c
                JOIN "DIM_EMPLOYEES" e ON c."FK_Empl" = e."Empl_PK"
                WHERE c."FIN__CONTRAT_PERIODE_D_ESSAI" IS NOT NULL
                  AND c."FIN__CONTRAT_PERIODE_D_ESSAI" NOT LIKE '%Pas de PE%'
                  AND c."FIN__CONTRAT_PERIODE_D_ESSAI" NOT LIKE '-'
            ) AS subquery
            WHERE "expiry_timestamp" BETWEEN NOW() AND NOW() + INTERVAL '3 weeks';
        `;

        console.log('Executing query:', query); // Affiche la requête exécutée

        const result = await pool.query(query);
        
        console.log('Résultat de la requête:', result.rows);  // Pour vérifier le résultat de la requête
        return result.rows;
    } catch (error) {
        console.error('Error fetching contrats:', error);
        throw new Error('Internal Server Error');
    }
};







module.exports = {
    getAllContrats,
    getMatricules,
    addContrat,
    updateContratById,
    deleteContratById,
   getContratsExpirantDans3Semaines,
    
};