const PDFDocument = require('pdfkit');
const { convertirNombreEnLettres } = require('./userModel');

// Fonction pour générer l'attestation de travail
exports.createWorkAttestationPDF = (employee, referenceNumber) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 72 
            });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Sauter quelques lignes pour l'espacement
            doc.moveDown(5);

            // Ajouter "Référence" en haut à gauche
            doc.fontSize(10)
               .font('Helvetica-Bold')
               .text(`Référence : ${referenceNumber}/${new Date().getFullYear()}`, {
                align: 'left'
               });

            // Sauter quelques lignes pour l'espacement
            doc.moveDown(7);

            // Ajouter "Tunis," suivi de la date du jour en bas à droite
            const currentDate = new Date().toLocaleDateString('fr-FR');
            doc.fontSize(10)
               .text(`Tunis, ${currentDate}`, {
                    align: 'right'
               });

            // Sauter quelques lignes pour l'espacement
            doc.moveDown(4);

            // Ajouter le titre en gras
            doc.fontSize(13)
               .font('Helvetica-Bold')
               .text('ATTESTATION DE TRAVAIL', {
                    align: 'center'
               });

            // Ajouter les lignes de soulignement plus épaisses
            const titleWidth = 166; // Largeur des lignes
            const titleX = doc.page.width / 2 - titleWidth / 2; // Position X centrée
            const titleY = doc.y ; // Position Y juste en dessous du titre

            // Première ligne de soulignement
            doc.lineWidth(1) // Épaisseur de la ligne
               .moveTo(titleX, titleY)
               .lineTo(titleX + titleWidth, titleY)
               .stroke();

            // Deuxième ligne de soulignement, très proche de la première
            doc.lineWidth(1) // Épaisseur de la ligne
               .moveTo(titleX, titleY + 3)
               .lineTo(titleX + titleWidth, titleY + 3)
               .stroke();

            // Revenir à la police normale pour le reste du texte
            doc.font('Helvetica').fontSize(10);

            // Déterminer la salutation et les ajustements en fonction du sexe
            const sexe = employee.Sexe.trim().toUpperCase();
            const salutation = sexe === 'F' ? 'Madame' : 'Monsieur';
            const dateOfBirth = sexe === 'F' ? 'née' : 'né';
            const genderEmploye = sexe === 'F' ? 'employée' : 'employé';
            const genderInterest = sexe === 'F' ? 'intéressée' : 'intéressé';

            // Sauter quelques lignes avant de continuer avec le contenu
            doc.moveDown(4);

            // Créer le contenu du PDF avec les informations de l'employé
            const titulaireText = employee.titulaire ? 'titulaire ' : '';
            doc.font('Helvetica').text('Nous soussignés, société ', { continued: true });

           // Écrire "PGS INTERNATIONAL TUNISIE" en gras
doc.font('Helvetica-Bold')
.text('PGS INTERNATIONAL TUNISIE', {
    align: 'left',
    continued: true // Pour ne pas faire de retour à la ligne
});
// Récupérer la date d'embauche depuis l'objet employee
const dateEmbauche = employee.dateEmbauche;
/*
console.log('Date from database:', employee.Date_naiss);
const formattedDateNaissance = formatDate(employee.Date_naiss);
console.log('Formatted date:', formattedDateNaissance);
*/
// Ajouter le reste du texte en normal
doc.font('Helvetica').text(', sise à 12 Rue Ala Farabi, Z.I Saint Gobain, 2014 Megrine, attestons par la présente que :\n\n') ;
// Ajouter le salutation avec le nom et prénom en gras, suivi par la suite du texte
doc.font('Helvetica')
   .text(`${salutation} `, { continued: true })
   .font('Helvetica-Bold')
   .text(`${employee.Nom} ${employee.Prenom},`, { continued: true })
   .font('Helvetica')
   .text(` titulaire de la Carte d’Identité Nationale N°` , { continued: true })
   .font('Helvetica-Bold')
   .text(`${employee.N_Cin}, `, { continued: true })
   .font('Helvetica')
   .text(`${dateOfBirth} le `, { continued: true })
   .font('Helvetica-Bold')
   .text(`${employee.Date_naiss}`, { continued: true })  
   .font('Helvetica')
   .text(' à ', { continued: true })
   .font('Helvetica-Bold')
   .text(`${employee.LIEU}`, { continued: true })
   .font('Helvetica')
   .text(`, est `, { continued: true })
   .font('Helvetica')
   .text(`${genderEmploye} au sein de notre société depuis le ` , { continued: true })
   .font('Helvetica-Bold')
   .text(`${dateEmbauche} `, { continued: true })
   .font('Helvetica')
   .text(`en qualité de ` , { continued: true })
   .font('Helvetica-Bold')
   .text(`${employee.Fonction}.`);

// Ajouter le reste du texte en normal
doc.font('Helvetica').text(`.\n\nCette attestation est délivrée à la demande de l’${genderInterest} pour servir et valoir ce que de droit.`);


            // Sauter 3 lignes pour la signature
            doc.moveDown(5);

            // Ajouter "SERVICES RESSOURCES" à droite
            doc.fontSize(10)
               .font('Helvetica-Bold');

            const servicesText = 'SERVICES RESSOURCES';
            const servicesWidth = doc.widthOfString(servicesText); // Largeur de "SERVICES RESSOURCES"
            const xPosition = doc.page.width - servicesWidth - 75; // Position X ajustée à droite

            doc.text(servicesText, xPosition);

            // Sauter une ligne
            doc.moveDown(0.5);

            // Ajouter "HUMAINES" centré horizontalement sous "SERVICES RESSOURCES"
            const humainesText = 'HUMAINES';
            const humainesWidth = doc.widthOfString(humainesText); // Largeur de "HUMAINES"
            doc.text(humainesText, xPosition + (servicesWidth - humainesWidth) / 2);
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

// Fonction pour générer l'attestation de stage
exports.createInternshipAttestationPDF = (stagiaire, referenceNumber) => {
    return new Promise((resolve, reject) => {
        try {
            //const { Nom, Prenom, Gender, Date_naiss, CIN, Lieu_CIN, Date_CIN, Date_debut, Date_fin } = stagiaire;

            // Vérifiez les données
        console.log('Données stagiaire :', stagiaire);
        console.log('Numéro de référence :', referenceNumber);
            const doc = new PDFDocument({
                size: 'A4',
                margin: 72 
            });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Sauter quelques lignes pour l'espacement
            doc.moveDown(7);

            // Ajouter "Référence" en haut à gauche
            doc.fontSize(10)
                .font('Helvetica-Bold')
                .text(`Référence : ${referenceNumber}/${new Date().getFullYear()}`, {
                    align: 'left'
                });

            // Sauter quelques lignes pour l'espacement
            doc.moveDown(7);

            // Ajouter "Tunis," suivi de la date du jour en bas à droite
            const currentDate = new Date().toLocaleDateString('fr-FR');
            doc.fontSize(10)
                .text(`Tunis, ${currentDate}`, {
                    align: 'right'
                });

            // Sauter quelques lignes pour l'espacement
            doc.moveDown(4);

            // Ajouter le titre en gras
            doc.fontSize(13)
                .font('Helvetica-Bold')
                .text('ATTESTATION DE STAGE', {
                    align: 'center'
                });

            // Ajouter les lignes de soulignement plus épaisses
            const titleWidth = 166;
            const titleX = doc.page.width / 2 - titleWidth / 2;
            const titleY = doc.y;

            doc.lineWidth(1)
                .moveTo(titleX, titleY)
                .lineTo(titleX + titleWidth, titleY)
                .stroke();

            doc.lineWidth(1)
                .moveTo(titleX, titleY + 3)
                .lineTo(titleX + titleWidth, titleY + 3)
                .stroke();

            doc.font('Helvetica').fontSize(10);

            // Déterminer la salutation et les ajustements en fonction du sexe
            const sexe = stagiaire.Gender.trim().toUpperCase();
            const salutation = sexe === 'F' ? 'Madame' : 'Monsieur';
            const dateOfBirth = sexe === 'F' ? 'née' : 'né';
            const genderInterest = sexe === 'F' ? 'intéressée' : 'intéressé';

            doc.moveDown(4);

            doc.font('Helvetica').text('Nous soussignés, société ', { continued: true });
            doc.font('Helvetica-Bold').text('PGS INTERNATIONAL TUNISIE', {
                align: 'left',
                continued: true
            });
            doc.font('Helvetica').text(', sise à 12 Rue Ala Farabi, Z.I Saint Gobain, 2014 Megrine, attestons par la présente que :\n\n');
            doc.font('Helvetica')//bzbz
                .text(`${salutation}`, { continued: true })
                .font('Helvetica-Bold')
                .text(` ${stagiaire.Nom} ${stagiaire.Prenom}`, { continued: true })
                .font('Helvetica')
                .text(`, ${dateOfBirth} le `, { continued: true })
                .font('Helvetica')
                .text(`${stagiaire.Date_naiss}, `, { continued: true })
                .font('Helvetica')
                .text(`titulaire de la Carte d’Identité Nationale N° `, { continued: true })
                .font('Helvetica-Bold')
                .text(`${stagiaire.CIN}, `, { continued: true })
                .font('Helvetica')
                .text(`délivrée à `, { continued: true })
                .font('Helvetica-Bold')
                .text(`${stagiaire.Lieu_CIN} `, { continued: true })
                .font('Helvetica')
                .text(`le `, { continued: true })
                .font('Helvetica-Bold')
                .text(`${stagiaire.Date_CIN}`, { continued: true })
                .font('Helvetica')
                .text(`, a effectué un stage au sein de notre unité d’étude du `, { continued: true })
                .font('Helvetica-Bold')
                .text(`${stagiaire.Date_debut} `, { continued: true })
                .font('Helvetica')
                .text(`au `, { continued: true })
                .font('Helvetica-Bold')
                .text(`${stagiaire.Date_fin}.`);

            doc.font('Helvetica').text(`\n\nCette attestation est délivrée à la demande de l’${genderInterest} pour servir et valoir ce que de droit.`);

            doc.moveDown(5);

            doc.fontSize(10)
                .font('Helvetica-Bold');

            const servicesText = 'SERVICES RESSOURCES';
            const servicesWidth = doc.widthOfString(servicesText);
            const xPosition = doc.page.width - servicesWidth - 75;

            doc.text(servicesText, xPosition);

            doc.moveDown(0.5);

            const humainesText = 'HUMAINES';
            const humainesWidth = doc.widthOfString(humainesText);
            doc.text(humainesText, xPosition + (servicesWidth - humainesWidth) / 2);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

exports.createSalaryAttestationPDF = (employee, salaryData, referenceNumber) => {
    return new Promise((resolve, reject) => {
        try {
                        
            const doc = new PDFDocument({
                size: 'A4',
                margin: 72 
            });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Sauter quelques lignes pour l'espacement
            doc.moveDown(5);

            // Ajouter "Référence" en haut à gauche
            doc.fontSize(10)
               .font('Helvetica-Bold')
               .text(`Référence : ${referenceNumber}/${new Date().getFullYear()}`, {
                    align: 'left'
               });

            // Sauter quelques lignes pour l'espacement
            doc.moveDown(7);

            // Ajouter "Tunis," suivi de la date du jour en bas à droite
            const currentDate = new Date().toLocaleDateString('fr-FR');
            doc.fontSize(10)
               .text(`Tunis, ${currentDate}`, {
                    align: 'right'
               });

            // Sauter quelques lignes pour l'espacement
            doc.moveDown(4);

            // Ajouter le titre en gras
            doc.fontSize(13)
               .font('Helvetica-Bold')
               .text('ATTESTATION DE SALAIRE', {
                    align: 'center'
               });

            // Ajouter les lignes de soulignement sous le titre
            const titleWidth = 180;
            const titleX = doc.page.width / 2 - titleWidth / 2;
            const titleY = doc.y;

            doc.lineWidth(1)
               .moveTo(titleX, titleY)
               .lineTo(titleX + titleWidth, titleY)
               .stroke();

            doc.lineWidth(1)
               .moveTo(titleX, titleY + 3)
               .lineTo(titleX + titleWidth, titleY + 3)
               .stroke();

            // Sauter quelques lignes avant de continuer avec le contenu
            doc.moveDown(4);
            // Déterminer la salutation et les ajustements en fonction du sexe
            const sexe = employee.Sexe.trim().toUpperCase();
            const salutation = sexe === 'F' ? 'Madame' : 'Monsieur';
            const genderEmploye = sexe === 'F' ? 'employée' : 'employé';
            const genderInterest = sexe === 'F' ? 'intéressée' : 'intéressé';
            const titulaireText = employee.titulaire ? 'titulaire ' : '';
            const salaireAnnuelBrut = convertirNombreEnLettres(salaryData.salaireAnnuelBrut);
            const salaireMensuelBrut = convertirNombreEnLettres(salaryData.salaireMensuelBrut);
            const salaireMensuelNet = convertirNombreEnLettres(salaryData.salaireMensuelNet);
            

            // Ajouter le contenu de l'attestation
            doc.font('Helvetica').fontSize(10);

            doc.font('Helvetica').text('Nous soussignés, société ', { continued: true });
            doc.font('Helvetica-Bold').text('PGS INTERNATIONAL TUNISIE', {
                align: 'left',
                continued: true
            });
            doc.font('Helvetica').text(', sise à 12 Rue Ala Farabi, Z.I Saint Gobain, 2014 Megrine, attestons par la présente que :\n\n');
            doc.font('Helvetica')
                .text(`${salutation} `, { continued: true })
//bzbz
            // Ajouter le nom et prénom de l'employé en gras
            doc.font('Helvetica-Bold')
               .text(`${employee.Prenom} ${employee.Nom}`, {
                    continued: true
               })
               .font('Helvetica')
               .text(` ${genderEmploye} ${titulaireText}en qualité de `, { continued: true })
               .font('Helvetica-Bold')
               .text(`${employee.Fonction}`, { continued: true })
               .font('Helvetica')
               .text(`, percevra une rémunération annuelle brute de `, { continued: true })
               .font('Helvetica-Bold')
               .text(`${salaireAnnuelBrut} (${salaryData.salaireAnnuelBrut} DT)`, { continued: true })
               .font('Helvetica')
               .text(`, correspondant à une rémunération mensuelle brute de `, { continued: true })
               .font('Helvetica-Bold')
               .text(`${salaireMensuelBrut} (${salaryData.salaireMensuelNet} DT)`, { continued: true })
               .font('Helvetica')
               .text(`, ceci correspond à une rémunération mensuelle nette de `, { continued: true })
               .font('Helvetica-Bold')
               .text(`${salaireMensuelNet} (${salaryData.salaireMensuelNet} DT).`, { continued: true });

            doc.font('Helvetica')
               .text(`\n\nCette attestation est délivrée à la demande de ${genderInterest} pour servir et valoir ce que de droit.`);

            // Sauter 3 lignes pour la signature
            doc.moveDown(5);

            // Ajouter "SERVICES RESSOURCES" à droite
            doc.fontSize(10)
               .font('Helvetica-Bold');

            const servicesText = 'SERVICES RESSOURCES';
            const servicesWidth = doc.widthOfString(servicesText);
            const xPosition = doc.page.width - servicesWidth - 75;

            doc.text(servicesText, xPosition);

            // Sauter une ligne
            doc.moveDown(0.5);

            // Ajouter "HUMAINES" centré horizontalement sous "SERVICES RESSOURCES"
            const humainesText = 'HUMAINES';
            const humainesWidth = doc.widthOfString(humainesText);
            doc.text(humainesText, xPosition + (servicesWidth - humainesWidth) / 2);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
