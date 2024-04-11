const express = require("express");
const router = express.Router();
const Favoritos = require("../models/Favorito.model");

const Recetas = require("../models/Receta.model");
const Usuarios = require("../models/Usuario.model");

//POST=>Agregar una receta a favoritos relacionada con un usuario
router.post('/:usuarioId/recetas/:recetasId', async (req, res) => {
    try {
      const { usuarioId, recetasId } = req.params;
  
      // Crear un nuevo documento de favoritos con los IDs proporcionados
      const nuevoFavorito = new Favoritos({
        isFavorite: true,
        recetasId: recetasId,
        usuarioId: usuarioId
      });
  
      // Guardar el nuevo favorito en la base de datos
      const favoritoGuardado = await nuevoFavorito.save();
  
      // Utilizar populate para obtener los detalles completos de la receta y el usuario
      const favoritoPopulado = await Favoritos.findById(favoritoGuardado._id)
        .populate('recetasId')
        .populate('usuarioId');
  
      // Devolver la respuesta con el favorito populado
      res.status(201).json(favoritoPopulado);
    } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso
      res.status(500).json({ error: 'Error al añadir la receta a favoritos' });
    }
});
//GET => para obtener todos los favoritos
router.get("/", (req, res, next) => {
    Favoritos.find({})
      .then((favoritos) => {
        console.log("Receta recuperada ->", favoritos);
        res.status(200).json(favoritos);
      })
      .catch((error) => {
        next(error)
      });
  });
  

router.get('/:usuarioId/recetas/:recetasId', async (req, res) => {
  try {
    const { usuarioId, recetasId } = req.params;

    // Buscar el favorito en la base de datos utilizando los IDs proporcionados
    const favorito = await Favoritos.findOne({ usuarioId, recetasId })
      .populate('recetasId') // Populate para obtener los detalles completos de la receta
      .populate('usuarioId'); // Populate para obtener los detalles completos del usuario

    // Verificar si se encontró el favorito
    if (!favorito) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }

    // Devolver el favorito encontrado
    res.status(200).json(favorito);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el favorito' });
  }
});


// //DEL => eliminar favorito por Id de favorito
// router.delete("/:favoritosId", async (req, res, next) => {
//     try {
//       await Favoritos.findByIdAndDelete(req.params.favoritosId);
//       res.status(202).json({ message: "favorito borrado" });
//     } catch (error) {
//       next(error);
//     }
//   });
  
module.exports = router;
