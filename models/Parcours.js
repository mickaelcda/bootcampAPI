const mongoose = require('mongoose');

const ParcoursSchema = new mongoose.Schema({
    titre: {
        type: String,
        trim: true,
        required: [true, 'Merci de renseigner un titre pour ce cours']
    },
    description: {
        type: String,
        required: [true, 'Merci de renseigner une description']
    },
    nbSemaine: {
        type: String,
        require: [true, 'Merci de renseigner une duree']
    },
    frais: {
        type: Number,
        required: [true, 'Merci de rensigner un prix pour le cours']
    },
    niveaux: {
        type: String,
        required: [true, 'Merci de rensigner le niveau requis pour ce cours'],
        enum: ['débutant', 'intermediaire', 'avancé']
    },
    financable: {
        type: Boolean,
        default: false
    },
    dateCreation: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    }
});

ParcoursSchema.statics.getAverageCost = async function (bootcampId) {
    // console.log('calculer moyenne cost '.blue);

    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: 'bootcamp',
                coutMoyen: { $avg: '$frais' }
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            coutMoyen: Math.ceil(obj[0].coutMoyen / 10) * 10
        });
    } catch(err) {
        console.error(err);
    }
}

// moyenne cout apres sauvegarde 
ParcoursSchema.post('save', async function () {
    this.constructor.getAverageCost(this.bootcamp);
});
    
// moyenne cout avant effacement 
ParcoursSchema.pre('remove', async function () {
    this.constructor.getAverageCost(this.bootcamp);
});



module.exports = mongoose.model('Parcours', ParcoursSchema);

