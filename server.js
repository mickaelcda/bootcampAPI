const express = require('express');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./midddleware/error');

//Chargement des variables d'environement
dotenv.config({ path: './config/config.env' });

//Connexion a la BDD
connectDB();

//route fichier
const bootcamps = require('./routes/bootcamps');


const app = express();



// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Dev log middleware
if(process.env.NODE_ENV === 'developpement') {
    app.use(morgan('dev'));
}

//chargement des routes 
app.use('/api/v1/bootcamps', bootcamps);

//errorHandler
app.use(errorHandler);

const server = app.listen(PORT,
    () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

//gerer les promesse asynchrone rejeté
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`.red);
    //fermer le serveur et sortir du process
    server.close(() => process.exit(1));
})