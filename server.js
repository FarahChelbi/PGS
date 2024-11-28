    const express = require('express');
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    const path = require('path');



    const indexRoutes = require('./routes/index');
    const userRoutes = require('./routes/users');
    const contratRoutes = require('./routes/contrats');
    const serviceRoutes = require('./routes/services');
    const authRoutes = require('./routes/auth');
    const contratExpRoutes = require('./routes/contrats_expires');
    const attestationRoutes = require('./routes/attestation');
    

    // Configuration du moteur de vues
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    // Middleware pour servir les fichiers statiques
    app.use(express.static(path.join(__dirname, 'public')));

    // Utilisation des routes
    app.use('/', indexRoutes);
    app.use('/users', userRoutes);
    app.use('/contrats', contratRoutes)
    app.use('/services', serviceRoutes);
    app.use('/auth', authRoutes);
    app.use('/contrats_expires', contratExpRoutes);
    app.use('/', attestationRoutes);

    app.get('/', (req, res) => {
        res.render('index', { port: PORT }); // Passer le port au template
    });

    app.use((req, res, next) => {
        console.log(`Request URL: ${req.url}`);
        console.log(`Request Method: ${req.method}`);
        console.log('Request Body:', req.body);
        next();
    });

    // Démarrer le serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
