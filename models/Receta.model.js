const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const recetaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        
    },
    pasos: {
        type: [String],
        required: true
    },
    ingredientes: {
        type: [String],
        required: true
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        // type: mongoose.Schema.Types.Mixed, 
    },
    
});




const Receta = model("Receta", recetaSchema);

module.exports = Receta;