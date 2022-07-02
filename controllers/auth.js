const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../midddleware/async");

//@desc     Enregister un utilisateur
//@route    GET /api/v1/auth/register
//@access   Public
exports.register = asyncHandler(async (req, res, next) => {
    const { nom, email, motDePasse, role } = req.body;
    const user = await User.create({
        nom,
        email,
        motDePasse,
        role
    });

    //Creer le token
    // const token = user.getSignedJwtToken();
    sendTokenRresponse(user, 200, res);

    res.status(200).json({
        success: true,
        data: user,
        token
    })
});

//@desc     login utilisateur
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, motDePasse } = req.body;

    //valider email et mot de passe
    if (!email || !motDePasse) {
        return next(new ErrorResponse('merci de fournir un email et un mot de passe', 400))
    };

    //verifier l utilisateur 
    const user = await User.findOne({ email }).select('+motDePasse');

    if (!user) {
        return next(new ErrorResponse('Utilisateur introuvable', 401))
    }
    //User on appelle le model user on appelle une methode

    //verifier si le mdp correspond 
    const isMatch = await user.matchPassword(motDePasse);

    if (!isMatch) {
        return next(new ErrorResponse('Le mot de passe ne correspond pas', 401));
    }

    sendTokenRresponse(user, 200, res);

  
});

//recuperer le token depuis le model, creer un cookie et envoyer le token en reponse 
const sendTokenRresponse = (user, statusCode, res) => {
    //Creer le token 
    const token = user.getSignedJwtToken();
    
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
};

//@desc     Recuperer l utilisateur connecté
//@route    GET /api/v1/auth/me
//@access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    });
});

