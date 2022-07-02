const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema(
  {
    nom: {
        type: String,
        required: [true, 'Merci de renseigner le champ nom'],
        unique: true, 
        trim: true, //supprimes les epsaces des 2 cotes de la chaine
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
        required: [true , "Merci de renseigner le champ adresse"]
    },
    location: {
        //GeoJSON
        type: {
            type :String,
            enum: ['Point'],     
        },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
        adresseComplete: String,
        numeroVoie: String,
        rue: String, 
        ville: String,
        codePostal: String,
        pays: String
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
    coutMoyen: Number,
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
        default: Date.now
        },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        }
   
    }, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Creation du bootcamp slug a partir du nom
BootcampSchema.pre('save', function(next) {
    this.slug = slugify(this.nom ,{lower: true})
    next();
})

//Geocode & creation des champs localisation
BootcampSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.adresse);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        adresseComplete: this.adresse,
        rue: loc[0].streetName,
        ville: loc[0].city,
        numeroVoie: loc[0].streetNumber,
        codePostal: loc[0].zipcode,
        pays: loc[0].country,
    }

    this.adresse = undefined;
    next()
});

//effacement en cascade des parcours quand le bootcamp est supprimé
BootcampSchema.pre('remove', async function (next) {
    console.log(`Parcours supprimé depuis bootcamp ${this.id}`)
    await this.model('Parcours').deleteMany({ bootcamp: this._id });
    next();
});

//reverse populate avec schema 
BootcampSchema.virtual('parcours', {
    ref: 'Parcours',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);    