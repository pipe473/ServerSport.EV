const express = require("express");
const router = express.Router();

const Recetas = require("../models/Receta.model");
const Usuarios = require("../models/Usuario.model");
const Opiniones = require ("../models/Opiniones.model");

//POST "/api/recetas => ruta para crera receta"
router.post("/", async (req, res, next) => {
  console.log(req.body);

  const { 
    nombre,
    imagen,
    pasos,
    ingredientes,
    creadoPor,
     Opiniones,
  } = req.body;

  try {

    const usuario = await Usuarios.findById(creadoPor);
    if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const response = await Recetas.create({
      nombre,
      imagen,
      pasos,
      ingredientes,
      creadoPor,
      Opiniones,
    });

    res.status(201).json({ message: "receta creada!", response });
  } catch (error) {
    next(error);
  }
});

//GET "/api/recetas =>ruta para obtener todas las recetas
router.get("/", (req, res, next) => {
 Recetas.find({})
.populate("creadoPor")
    .then((recetas) => {
      console.log("Receta recuperada ->", recetas);
      res.status(200).json(recetas);
    })
    .catch((error) => {
      next(error)
    });
});

//GET"/api/recetas/usuarioId =>ruta para obtener todas las recetas de un usuario
router.get("/porUsuario/:usuarioId", async (req, res) => {
  // console.log("patata");
  
  try {
    const usuarioId = req.params.usuarioId;

    // Buscar todas las recetas creadas por el usuario con el ID proporcionado
    const response = await Recetas.find({ creadoPor: usuarioId })
    console.log(response);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//GET "/api/recetas/recetasId" => obtener una receta especifico por id
router.get("/:recetasId", async (req, res, next) => {
  console.log("patata");
  
  try {
    const recetasId = req.params.recetasId;
    console.log(recetasId);
    

    const response = await Recetas.findById(recetasId)
    // const response = await Recetas.find({ _id: recetasId })
    console.log(response);    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});


  //PUT "api/recetas/recetaId => actualiza/ modificar  receta por id
  router.put("/porReceta/:recetasId", async (req, res, next) => {
    const { 
      nombre,
      imagen,
      pasos,
      ingredientes,
      creadoPor,
      Opiniones,
      FavoritosBy,
    } = req.body;
  
  
    try {
      const response = await Recetas.findByIdAndUpdate(
        req.params.recetasId,
        {
          nombre,
          imagen,
          pasos,
          ingredientes,
          creadoPor,
          Opiniones,
          FavoritosBy,
        },
        { new: true }
      );
      res.status(202).json(response);
    } catch (error) {
      next(error);
    }
  });

  // DELETE "/api/recetas/recetasId =>elimina una receta por id
  router.delete("/:recetasId", async (req, res, next) => {
    try {
      await Recetas.findByIdAndDelete(req.params.recetasId);
      res.status(202).json({ message: "receta borrada" });
    } catch (error) {
      next(error);
    }
  });





module.exports = router;

