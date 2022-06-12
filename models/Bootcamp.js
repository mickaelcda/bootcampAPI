const mongoose = require('mongoose');


const BootcampSchema = mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Merci de renseigner le nom'],
        unique: true, 
        trim: true,
        maxlength: [50,'Le nombre de charactère ne peux exeder 50'],
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Merci de completer la description'],
        maxlength: [500,'Le nombre de charactère ne peux exeder 500'],
    },
    siteWeb: {
        type: String,
            match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "Merci d'entrer une URL utilisant HTPP ou HTTPS"],
    },
    telephone: {
        type: String,
        maxlength: [20 , 'le numero ne peux exceder 20 charactères' ]
    },
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Merci d'entrer un email valide"]
    },
    adresse: {
        type: String,
        required: [true , "merci de renseigner une adresse valide"]
    },
    localisation: {
        //GeoJSON
        type: {
            type :String,
            enum: ['point'],     
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    carriere: {
        type: [String],
        required: true,
        enum: [
            'Developpement Web',
            'Developpement Mobile',
            'UI/UX',
            'Data Science',
            'Business',
            'Autre'
        ]
    },
    formationEval: {
        type: Number,
        min: [1, 'La note minimum est de 1'],
        max: [10, 'La note maximum est de 10']
    },
    formationCout: Number,
    photo: {
        type: String,
        default: "no-picture.jpg"
    },
    hebergement: {
        type: Boolean,
        default : false
    },
    aideEmploi: {
        type: Boolean,
        default : false
    },
    garantieEmploi: {
        type: Boolean,
        default : false
    },
    fongecif: {
        type: Boolean,
        default : false
    },
    dateCreation: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('Bootcamp', BootcampSchema);