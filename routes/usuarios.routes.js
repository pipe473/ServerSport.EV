const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Usuarios = require ("../models/Usuario.model")

const { isTokenValid } = require("../middlewares/auth.middlewares");

router.get("/:id", isTokenValid, async (req, res, next) => {
  try {
    const response = await Usuarios.findById(req.params.id).select({
      name: 1,
      email: 1,
    });
    console.log(response);
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}),



module.exports = router;