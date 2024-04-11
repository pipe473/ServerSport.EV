const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const usuarioSchema = new Schema(
  {
    
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "name is required."],
     },
     recetas: { type: mongoose.Schema.Types.ObjectId, ref: 'Receta' },
  },
  {
    timestamps: true,
  }
);

const Usuario = model("Usuario", usuarioSchema);

module.exports = Usuario;
