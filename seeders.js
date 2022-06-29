const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
//chargement des variables d'environement
dotenv.config({ path: './config/config.env' });

//chargement des modeles
const Bootcamp = require('./models/Bootcamp');
const Parcours = require('./models/Parcours');

//connexion a la DB 
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})

//lire les fichier JSON
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`, 'utf-8'));
//lire les fichier JSON
const parcours = JSON.parse(fs.readFileSync(`${__dirname}/data/parcours.json`, 'utf-8'));


//Importer en BDD
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Parcours.create(parcours);
        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

//effacer les donnees 
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Parcours.deleteMany();
        console.log('Data destroyed...'.red.inverse);
        process.exit()
    } catch (err) {
        console.error(err);
    }
}

// charger les donnees de data/ vers mongoose
// ou les supprimer de la dbb
// node seeders -i   ou node seeders -d ds le terminal
//node[0] / seeders[1] / -i[2] 

if (process.argv[2] ==='-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}

  

  