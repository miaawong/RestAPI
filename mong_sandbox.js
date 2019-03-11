'use strict';

const mongoose = require('mongoose');

//connecting to mongoose db server 
mongoose.connect('mongodb://localhost:27017/sandbox');

const db = mongoose.connection;

db.on('error', (err) => {
    console.log('uh oh there was an error!', err);
});

//listen for open event 
// using 'once' method to listen for it, it is like the 'on' method
// except it fires its handler the first time the event occurs. not everytime (like 'on')
db.once('open', () => {
    console.log('db connection successful');
    // all db communication goes here 
    const Schema = mongoose.Schema;

    const AnimalSchema = new Schema({
        // we can set a default animal 
        type: { type: String, default: 'goldfish' },
        color: { type: String, default: 'tiny' },
        size: String,
        mass: { type: Number, default: .0006 },
        name: { type: String, default: 'Fishie' }
    });
    //pre save hook 
    // cannot use arrow function for mongoose hooks, 
    //arrow functions aren't rebindable, but mongoose wats to
    // rebind 'this' to be the document being saved. 
    // so you have to use anon function instead 
    AnimalSchema.pre('save', function (next) {
        if (this.mass >= 100) {
            this.size = "big";
        } else if (this.mass >= 5 && this.mass < 100) {
            this.size = 'medium';
        } else {
            this.size = 'small';
        }
        next();
    });
    //create a model, which will create and save our doc objs. 
    // mongoose will pluralize the string we supply as the first param here
    // this will map to a collection in the mongodb whenever we save the doc. 
    AnimalSchema.statics.findSize = function (size, callback) {
        // this === Animal 
        return this.find({ size: size }, callback);
    }

    // instance method, 'this' value points to instances of the document itself.
    AnimalSchema.methods.findSameColor = function (callback) {
        //this = document
        return this.model('Animal').find({ color: this.color }, callback);
    }
    const Animal = mongoose.model('Animal', AnimalSchema);

    const elephant = new Animal({
        type: 'elephant',
        color: 'gray',
        mass: 5000,
        name: 'Ellie'

    });

    const animal = new Animal({}); //goldfish 

    const whale = new Animal({
        type: "whale",
        mass: 180000,
        name: 'Figgy'
    });

    const animalData = [
        {
            type: 'mouse',
            color: 'gray',
            mass: 0.035,
            name: 'Marv'
        },
        {
            type: 'nutria',
            color: 'brown',
            mass: 6.35,
            name: 'Gretchen'
        },
        {
            type: 'wolf',
            color: 'gray',
            mass: 45,
            name: 'Iris'
        },
        elephant,
        animal,
        whale
    ]

    // remove all docs in db 
    Animal.remove({}, (err) => {
        //saving it to the db 
        // have to make sure default is saved before connection closed. 
        if (err) console.error(err);
        Animal.create(animalData, (err, animals) => {
            if (err) console.error(err);
            Animal.findOne({ type: 'elephant' }, (err, elephant) => {
                elephant.findSameColor((err, animals) => {
                    if (err) console.error(err);
                    animals.forEach((animal) => {
                        console.log(animal.name + ' the ' + animal.color + " " + animal.type + " is a " + animal.size + '-size animal.');
                    });
                    db.close(() => {
                        console.log('db connection off');
                    });
                });
            });
        });
    });
}); 