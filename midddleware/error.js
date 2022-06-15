const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    
    let error = { ...err };

    error.message = err.message;
    
    //log en console 
    console.log(error);
    console.log(err.name);

    //erreur identifiant (key) en BDD 
    if (err.name === 'CastError') {
        const message = `Ressource introuvable, l'id ${error.value} n'existe pas `;
        error = new ErrorResponse(message, 404);
    }

    //Dupliquer une cle unique en BDD 
    if (err.code === 11000) {
        let val = Object.values(error.keyValue);
        const message = `Ce champs existe deja : ${val}`;
        error = new ErrorResponse(message, 400);
    }

    //erreur de validation en BDD
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        succes: false,
        error: error.message || "Erreur serveur"
    });

    
};
    
module.exports = errorHandler;