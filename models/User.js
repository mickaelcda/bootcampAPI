const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Merci de renseigner un nom']
    },
    email: {
        type: String,
        required: [true, 'Merci de renseigner un email'],
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Merci d'entrer un email valide"]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    motDePasse: {
        type: String,
        required: [true, 'Merci de renseigner un mot de passe'],
        minlength: 6,
        select: false  //pour ne pas retourner le pw ds la reponse
    },
    resetPasswordToken: String,
    resetPasswordToken: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//crypter le mdp avec bcrypt 
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

//signer et retourner le token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

//comparer mot de passe user au pw hasher en bdd
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.motDePasse)
}

module.exports = mongoose.model('User', UserSchema);  