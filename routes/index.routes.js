const router = require("express").Router();


// control de todas nuestros archivos de rutas

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)


//RECETAS
const recetasRoutes = require("./recetas.routes")
router.use("/recetas", recetasRoutes)


//OPINIONES
const opinionesRoutes = require ("./opiniones.routes")
router.use("/opiniones", opinionesRoutes )

//USUARIOS
const usuariosRoutes = require ("./usuarios.routes")
router.use("/usuarios", usuariosRoutes )

//FAVORITOS 
// const favoritosRoutes = require ("./favoritos.routes")
// router.use("/favoritos", favoritosRoutes)

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);


module.exports = router;