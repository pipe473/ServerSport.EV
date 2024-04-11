const router = require("express").Router();

const User = require("../models/Usuario.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const {
  isTokenValid,
  //isUserAdmin,
} = require("../middlewares/auth.middlewares");

// POST "/api/auth/signup" => recibir info del usuario y crear documento en la DB
router.post("/signup", async (req, res, next) => {
  const {email, password, name } = req.body;
  console.log(email, password, name);

  // deberiamos validar datos del usuario
  if (!email || !password) {
    res.status(400).json({ message: "email y password son obligatorios" });
    return; // detener la ejecucion de la ruta
  }

  // que la contraseña sea lo suficiente fuerte
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

  if (passwordRegex.test(password) === false) {
    res
      .status(400)
      .json({
        message:
          "password debe contener min 8 caracteres, 1 mayuscula y 1 minuscula y 1 número",
      });
    return; // detener la ejecucion de la ruta
  }

  try {
    // validar que el usuario no existe en la DB
    const foundUser = await User.findOne({ email: email });
    if (foundUser !== null) {
      // el usuario ya existe
      res.status(400).json({ message: "correo de usuario ya registrado" });
      return; // detener la ejecucion de la ruta
    }

    // cifrar la contraseña
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log(hashPassword);

    // crear el usuario en la DB
    await User.create({
      name,
      email,
      password: hashPassword,
    });

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

// POST "/api/auth/login" => validar las credenciales del usuario y enviar un Token
router.post("/login", async (req, res, next) => {
  const { email, password, name } = req.body;
  console.log(email, password, name);

  if (!email || !password) {
    res.status(400).json({ message: "email y password son obligatorios" });
    return; // detener la ejecucion de la ruta
  }

  try {
    // validar que el usuario no existe en la DB
    const foundUser = await User.findOne({ email: email });
    console.log(foundUser);
    if (foundUser === null) {
      // el usuario no existe
      res.status(400).json({ message: "usuario no registrado" });
      return; // detener la ejecucion de la ruta
    }

    // comprobar si la contraseña es correcta
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    console.log(isPasswordCorrect);
    if (isPasswordCorrect === false) {
      res.status(400).json({ message: "contraseña no valida" });
      return; // detener la ejecucion de la ruta
    }

    // creamos el Token y lo enviamos al cliente
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      name: foundUser.name,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d", // el token funcionara por 7 días
    });

    res.status(200).json({ authToken: authToken });
  } catch (error) {
    next(error);
  }
});

 // DELETE "/api/auth/usurioId =>elimina una usuario por id
 router.delete("/:usurioId", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.usurioId);
    res.status(202).json({ message: "usuario borrada" });
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => validar el token e indicar al cliente que el usuario está autenticado
router.get("/verify", isTokenValid, (req, res, next) => {
  console.log(req.payload);

  // enviar payload al cliente
  res.json(req.payload);
});



router.get("/perfil", isTokenValid, async(req, res, next) => {
  console.log(req.headers);
  console.log(req.payload._id); // TODA RUTA QUE USE EL isTokenValid TIENE ACCESO A ESTO PARA SABER QUIEN ES EL USUARIO LOGEADO (EL USUARIO QUE ESTÁ HACIENDO LA LLAMADA)
  try {
    const response = await User.findById(loggedId);
    console.log(response);
    res.status(200).json({ data: "data privada", response });
  } catch (error) {
    next(error);
  }
});

 // PUT "/api/auth/usurioId =>edita una usuario por id
 router.put("/:usurioId", async (req, res, next) => {
  const { 
    name,
    email,
  } = req.body;
  try {
    const response = await User.findByIdAndUpdate(
      req.params.usurioId,{
        name,
        email,
      }, { new: true });
      console.log(response);
      
      
    res.status(202).json({ message: "usuario editado", response });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
