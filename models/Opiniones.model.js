const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const opinionSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    comentario: {
        type: String,
        required: true
    },
    valoracion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    
    recetaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receta',
        required: true
    }
});

const Opiniones = model("Opiniones", opinionSchema);

module.exports = Opiniones;