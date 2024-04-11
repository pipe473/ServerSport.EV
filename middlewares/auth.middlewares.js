const jwt = require("jsonwebtoken");


//toda la autenticazion de los heders 
function isTokenValid(req, res, next) {
  try {
    // intentar recibir el token
    console.log(req.headers.authorization);

    // validarlo
    const tokenArr = req.headers.authorization.split(" ");
    console.log(tokenArr);

    const token = tokenArr[1];

    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    console.log(payload);

    req.payload = payload//identifica el usuario logado
    // dar acceso a cualquier ruta que use este middleware a saber QUIEN está haciendo la llamada

    next() 
  } catch (error) {
    res.status(401).json({ errorMessage: "Token no valido o expirado" });
  }
}

// function isUserAdmin(req, res, next) {

//   if (req.payload.role === "admin") {
//     next() // continua con la ruta
//   } else {
//     res.status(401).json("no eres un admin, fuera de aqui")
//   }

// }

module.exports = {
  isTokenValid,
  //isUserAdmin
}