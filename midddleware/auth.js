const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//proteger les routes 
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) {
    //     token = req.headers.token
    // }

    //verifier que le token existe 
    if (!token) {
        return next(new ErrorResponse('Accès non autorisé pour cette route', 401))
    }

    try {
        //verifier le token via son payload 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse('Accès non autorisé pour cette route', 401))
    }
});  

//Autoriser l'acces a certain role 
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`Permission ${req.user.role} insufisante pour acceder a cette route`, 403));   
        }
        next();
    }
}