const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./midddleware/error');
const path = require('path');
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000;
//Chargement des variables d'environement
dotenv.config({ path: './config/config.env' });

//Connexion a la BDD
connectDB();

//route fichier
const bootcamps = require('./routes/bootcamps');
const parcours = require('./routes/parcours');
const auth = require('./routes/auth');

const app = express();

// Body Parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//cookie paerser
app.use(cookieParser())

//Dev log middleware
if(process.env.NODE_ENV === 'developpement') {
    app.use(morgan('dev'));
}

//Upload fichier
app.use(fileupload());

//Mettre le dossier en statique 
app.use(express.static(path.join(__dirname, 'public')))

//chargement des routes 
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/parcours', parcours);
app.use('/api/v1/auth', auth);

//errorHandler
app.use(errorHandler);

const server = app.listen(PORT,
    () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

//gerer les promesse asynchrone rejeté
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`.red);
    //fermer le serveur et sortir du process
    // server.close(() => process.exit(1));
})