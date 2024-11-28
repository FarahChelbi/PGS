const pool = require('../config/database');

const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM "DIM_EMPLOYEES"');
    return result.rows;
};

const deleteUserById = async (id) => {
    await pool.query('DELETE FROM "DIM_EMPLOYEES" WHERE "Empl_PK" = $1', [id]);
};

const getMaxEmplPK = async () => {
    const result = await pool.query('SELECT COALESCE(MAX("Empl_PK"), 0) AS max_pk FROM "DIM_EMPLOYEES"');
    return result.rows[0].max_pk;
};
/*

const addUser = async (userData) => {
    const {
        matricule, nom, prenom, sexe, diplome, date_depart, motif,
        cin, cnss, fonction, societe, tel, date_naiss, lieu, etat_civil,date_titularisation
    } = userData;

    const telInt = tel ? parseInt(tel, 10) : null;

    try {
        // Log avant la requête SQL
        console.log('Préparation de l\'insertion avec les données:', {
            matricule, nom, prenom, sexe, diplome, date_depart, motif,
            cin, cnss, fonction, societe, telInt, date_naiss, lieu, etat_civil,date_titularisation
        });

        const maxResult = await pool.query('SELECT MAX("Empl_PK") AS max_pk FROM "DIM_EMPLOYEES"');
        const maxPK = maxResult.rows[0].max_pk || 0;
        const newPK = maxPK + 1;

        // Log de la nouvelle clé primaire
        console.log('Nouvelle clé primaire pour l\'ajout:', newPK);

        await pool.query(
            `INSERT INTO "DIM_EMPLOYEES" 
            ("Empl_PK", "Matricule", "Nom", "Prenom", "Sexe", "Diplome", "Date_depart", 
             "Motif", "N_Cin", "N_CNSS", "Fonction", "Societe", "N_Tel", 
             "Date_naiss", "LIEU", "ETAT_CIVIL","Date_titularisation")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
            [newPK, matricule, nom, prenom, sexe, diplome, date_depart, motif,
            cin, cnss, fonction, societe, telInt, date_naiss, lieu, etat_civil]
        );

        // Log après l'insertion réussie
        console.log('Insertion réussie');
    } catch (error) {
        // Log des erreurs SQL
        console.error('Erreur lors de l\'insertion de l\'employé:', error);
        throw error;
    }
};
*/
const addUser = async (userData) => {
    const {
        matricule, nom, prenom, sexe, diplome, date_depart, motif,
        cin, cnss, fonction, societe, tel, date_naiss, lieu, etat_civil, date_titularisation,n_enf
    } = userData;

    // Conversion de tel en entier, si nécessaire
    const telInt = tel && !isNaN(parseInt(tel, 10)) ? parseInt(tel, 10) : null;

    try {
        // Log avant la requête SQL
        console.log('Préparation de l\'insertion avec les données:', {
            matricule, nom, prenom, sexe, diplome, date_depart, motif,
            cin, cnss, fonction, societe, telInt, date_naiss, lieu, etat_civil, date_titularisation, n_enf
        });

        // Récupération de la valeur maximale pour "Empl_PK" et calcul de la nouvelle clé primaire
        const maxResult = await pool.query('SELECT MAX("Empl_PK") AS max_pk FROM "DIM_EMPLOYEES"');
        const maxPK = maxResult.rows[0].max_pk || 0;
        const newPK = maxPK + 1;

        // Log de la nouvelle clé primaire
        console.log('Nouvelle clé primaire pour l\'ajout:', newPK);

        // Exécution de la requête d'insertion
        const result = await pool.query(
            `INSERT INTO "DIM_EMPLOYEES" 
            ("Empl_PK", "Matricule", "Nom", "Prenom", "Sexe", "Diplome", "Date_depart", 
             "Motif", "N_Cin", "N_CNSS", "Fonction", "Societe", "N_Tel", 
             "Date_naiss", "LIEU", "ETAT_CIVIL", "Date_titularisation","N_enf")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
            [newPK, matricule || null, nom || null, prenom || null, sexe || null, diplome || null, date_depart || null, 
             motif || null, cin || null, cnss || null, fonction || null, societe || null, telInt, 
             date_naiss || null, lieu || null, etat_civil || null, date_titularisation || null, n_enf || null]
        );

        // Log après l'insertion réussie
        console.log('Insertion réussie:', result);
    } catch (error) {
        // Log des erreurs SQL
        console.error('Erreur lors de l\'insertion de l\'employé:', error);
        throw error;
    }
};






const getEmployeeById = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM "DIM_EMPLOYEES" WHERE "Empl_PK" = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        throw new Error('Error retrieving employee: ' + error.message);
    }
};

// Fonction pour mettre à jour un employé
const updateEmployeeById = async (id, data) => {
    const {
        matricule, nom, prenom, sexe, diplome, date_depart, motif,
        cin, cnss, fonction, societe, tel, date_naiss, lieu, etat_civil,date_titularisation, n_enf
    } = data;

    try {
        const telValue = tel === '' ? null : parseInt(tel, 10);
        
        const result = await pool.query(
            `UPDATE "DIM_EMPLOYEES"
            SET "Matricule" = $1, "Nom" = $2, "Prenom" = $3, "Sexe" = $4, "Diplome" = $5, "Date_depart" = $6, 
                "Motif" = $7, "N_Cin" = $8, "N_CNSS" = $9, "Fonction" = $10, "Societe" = $11, "N_Tel" = $12,
                "Date_naiss" = $13, "LIEU" = $14, "ETAT_CIVIL" = $15,"Date_titularisation" = $16, "N_enf" = $17
            WHERE "Empl_PK" = $18
            RETURNING *`,
            [matricule, nom, prenom, sexe, diplome, date_depart, motif, cin, cnss, fonction, societe, telValue, date_naiss, lieu, etat_civil,date_titularisation, n_enf,id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Error updating employee: ' + error.message);
    }
};



const getEmployeeByMatricule = async (matricule) => {
    try {
        const result = await pool.query('SELECT * FROM "DIM_EMPLOYEES" WHERE "Matricule" = $1', [matricule]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        throw new Error('Error retrieving employee: ' + error.message);
    }
};

const formatDate1 = (dateString) => {
    //console.log('Chaîne de date reçue:', dateString);

    if (!dateString) {
        return 'Date invalide';
    }

    // Extraire le jour, le mois et l'année de la chaîne
    const dateParts = dateString.split(' ');
    if (dateParts.length < 6) {
        return 'Date invalide';
    }

    const day = dateParts[2];
    const monthString = dateParts[1];
    const year = dateParts[5];

    // Convertir le mois en nombre
    const monthNames = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    const month = monthNames[monthString];
    if (!month) {
        return 'Date invalide';
    }

    // Formater la date au format DD/MM/YYYY
    return `${day.padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
};
function formatDate(dateString) {
    // Créer un objet Date à partir de la chaîne
    const date = new Date(dateString);
    
    // Extraire le jour, le mois et l'année
    const jour = String(date.getDate()).padStart(2, '0');
    const mois = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const annee = date.getFullYear();

    // Formater en DD/MM/YYYY
    return `${jour}/${mois}/${annee}`;
}


const getNextReference = async () => {
    const currentYear = new Date().getFullYear();
    
    try {
        await pool.query('BEGIN'); // Démarrer la transaction

        // Vérifier et obtenir le numéro de référence actuel pour l'année en cours
        const result = await pool.query(
            'SELECT "reference_number" FROM "attestation_references" WHERE "year" = $1 FOR UPDATE',
            [currentYear]
        );

        if (result.rows.length === 0) {
            // Si l'année n'existe pas, initialiser le numéro de référence à 0
            await pool.query(
                'INSERT INTO "attestation_references" ("year", "reference_number") VALUES ($1, $2)',
                [currentYear, 0]
            );
            await pool.query('COMMIT'); // Valider la transaction
            return 1;
        }

        // Récupérer le numéro de référence actuel
        let currentReference = result.rows[0].reference_number;

        // Vérifiez si la valeur est bien un nombre
        if (isNaN(currentReference)) {
            throw new Error('Current reference is not a number');
        }

        // Incrémenter le numéro de référence
        const newReference = parseInt(currentReference, 10) + 1;

        // Mettre à jour la base de données avec le nouveau numéro de référence
        await pool.query(
            'UPDATE "attestation_references" SET "reference_number" = $1 WHERE "year" = $2',
            [newReference, currentYear]
        );
        await pool.query('COMMIT'); // Valider la transaction

        return newReference;
    } catch (error) {
        await pool.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
        console.error('Error getting next reference:', error);
        throw new Error('Error getting next reference');
    }
};


function convertirNombreEnLettres(nombre) {
    const unite = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
    const dizaine = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt"];
    const dizaineAvecUnite = ["", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];

    if (nombre === 0) return "zéro";

    let lettres = "";

    if (Math.floor(nombre / 1000000) > 0) {
        lettres += convertirNombreEnLettres(Math.floor(nombre / 1000000)) + " million ";
        nombre %= 1000000;
    }

    if (Math.floor(nombre / 1000) > 0) {
        lettres += convertirNombreEnLettres(Math.floor(nombre / 1000)) + " mille ";
        nombre %= 1000;
    }

    if (Math.floor(nombre / 100) > 0) {
        if (Math.floor(nombre / 100) === 1) {
            lettres += "cent ";
        } else {
            lettres += convertirNombreEnLettres(Math.floor(nombre / 100)) + " cent ";
        }
        nombre %= 100;
    }

    if (nombre > 0) {
        if (nombre < 10) {
            lettres += unite[nombre];
        } else if (nombre < 20) {
            lettres += dizaineAvecUnite[nombre - 10];
        } else if (nombre <30)
            {
                lettres+="vingt"
                if(nombre===21)
                    lettres+="-et-un"
                else if(nombre < 25)
                    lettres+="-"+ unite[nombre % 10];
                else
                lettres+= unite[nombre % 10];
    
            }else if (nombre <40)
                {
                    lettres+="trente"
                    if(nombre===31)
                        lettres+=" et un"
                    else if(nombre < 37)
                        lettres+="-"+ unite[nombre % 10];
                    else
                    lettres+= unite[nombre % 10];
        
                }
        else if (nombre < 70) {
            lettres += dizaine[Math.floor(nombre / 10)];
            if (nombre % 10 > 0) {
                lettres += "-" + unite[nombre % 10];
            }
        } else if (nombre < 80) {
            /*if (nombre !== 80) {
                lettres += "-" + unite[nombre % 10];
            }*/
            let lettres2 = "soixante-dix";
            if(nombre===70){
                lettres += "soixante-dix";

            }
            else if (nombre===71){
                lettres += "soixante et onze";
            }
            else {
                lettres += "soixante " + dizaineAvecUnite[nombre % 10];

            }
        } else {
            if (nombre === 80) {
                lettres += "quatre-vingts";
            } else if (nombre < 90) {
                if(nombre === 81){
                    lettres += "quatre vingt et un";
                }
                else {
                    lettres += "quatre vingt " + unite[nombre % 10];
                }
            } else {
                //lettres += "-quatre-vingt";
                if (nombre === 90) {
                    lettres += "quatre-vingt-dix";
                } else {
                    if(nombre === 91)
                        {
                            lettres += "quatre-vingt-onze";
                        }
                        else{
                            lettres += "quatre vingt " + dizaineAvecUnite[nombre % 10];
                        }
                    
                }
            }
        }
    }

    return lettres.trim();
}




module.exports = {
    getAllUsers,
    deleteUserById,
    addUser,
    getEmployeeById,
    updateEmployeeById,
    convertirNombreEnLettres,
    getNextReference,
    formatDate,
    getEmployeeByMatricule,
    
};