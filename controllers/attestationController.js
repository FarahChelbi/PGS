const Attestation = require('../models/attestationModel');
const User = require('../models/userModel');
const { formatDate } = require('../models/userModel'); // Importer la fonction formatDate
const ReferenceModel = require('../models/userModel');

exports.generateAttestation = async (req, res) => {
    try {
        const typeAttestation = req.body.typeAttestation;

        // Obtenir le numéro de référence avant son utilisation
        const referenceNumber = await ReferenceModel.getNextReference();

        let pdfBuffer;

        if (typeAttestation === 'travail') {
            const matricule = req.body.id || req.query.id;
            const dateEmbauche = req.body.date_embauche;

            if (!matricule) {
                return res.status(400).json({ error: 'Matricule de l\'employé est requis' });
            }

            try {
                const employee = await User.getEmployeeByMatricule(matricule);

                if (employee) {
                    //employee.titulaire = titulaire;
                    employee.dateEmbauche = formatDate(dateEmbauche);
                    //employee.Date_naiss = formatDate(employee.Date_naiss);

                    pdfBuffer = await Attestation.createWorkAttestationPDF(employee, referenceNumber);

                    res.set({
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename=attestation_travail_${employee.Nom}_${employee.Prenom}_${referenceNumber}.pdf`
                    });

                    res.send(pdfBuffer);
                } else {
                    console.error('Employé non trouvé avec le matricule:', matricule);
                    res.status(404).json({ error: 'Employé non trouvé' });
                }
            } catch (error) {
                console.error('Erreur lors de la génération de l\'attestation de travail:', error);
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        } else if (typeAttestation === 'stage') {
            const dateDebut = formatDate(req.body.date_debut);
            const dateFin = formatDate(req.body.date_fin);
            const gender = req.body.gender;
            const dateNaissance = formatDate(req.body.date_naissance);
            const cin = req.body.cin;
            const lieuCin = req.body.lieu_cin;
            const dateCin = formatDate(req.body.date_cin);
            const nom = req.body.nom;
            const prenom = req.body.prenom;

            try {
                const stagiaire = {
                    Nom: nom,
                    Prenom: prenom,
                    Gender: gender,
                    Date_naiss: dateNaissance,
                    CIN: cin,
                    Lieu_CIN: lieuCin,
                    Date_CIN: dateCin,
                    Date_debut: dateDebut,
                    Date_fin: dateFin
                };

                pdfBuffer = await Attestation.createInternshipAttestationPDF(stagiaire, referenceNumber);

                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename=attestation_stage_${stagiaire.Nom}_${stagiaire.Prenom}_${referenceNumber}.pdf`
                });

                res.send(pdfBuffer);
            } catch (error) {
                console.error('Erreur lors de la génération de l\'attestation de stage:', error);
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        } else if (typeAttestation === 'salaire') {
            const matricule = req.body.id;
            const salaireAnnuelBrut = req.body.salaire_annuel_brut;
            const salaireMensuelBrut = req.body.salaire_mensuel_brut;
            const salaireMensuelNet = req.body.salaire_mensuel_net;
            const titulaire = req.body.titulaire ? true : false;


            if (!matricule) {
                return res.status(400).json({ error: 'Matricule de l\'employé est requis' });
            }

            try {
                const employee = await User.getEmployeeByMatricule(matricule);

                if (employee) {
                    employee.titulaire = titulaire;
                    const salaryData = {
                        salaireAnnuelBrut: salaireAnnuelBrut,
                        salaireMensuelBrut: salaireMensuelBrut,
                        salaireMensuelNet: salaireMensuelNet
                    };

                    pdfBuffer = await Attestation.createSalaryAttestationPDF(employee, salaryData, referenceNumber);

                    res.set({
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename=attestation_salaire_${employee.Nom}_${employee.Prenom}_${referenceNumber}.pdf`
                    });

                    res.send(pdfBuffer);
                } else {
                    console.error('Employé non trouvé avec le matricule:', matricule);
                    res.status(404).json({ error: 'Employé non trouvé' });
                }
            } catch (error) {
                console.error('Erreur lors de la génération de l\'attestation de salaire:', error);
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        } else {
            res.status(400).json({ error: 'Type d\'attestation non pris en charge' });
        }
    } catch (error) {
        console.error('Erreur générale lors de la génération de l\'attestation:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
