const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async(req = request, res = response) => {

  const { limite = 5, desde = 0 } = req.query;

  // Ejecutar las promesas en simultáneo 
  const [ total, usuarios ] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true })
     .skip(Number(desde))
     .limit(Number(limite))
  ])

  res.json({
    total,
    usuarios
  });
};

const usuariosPut = async(req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate( id, resto );

  res.json(usuario);
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosDelete = async(req, res = response) => {

  const { id } = req.params;
  // Borrar de BD
  // const usuario = await Usuario.findByIdAndDelete( id ); 
  // Borra de la app pero queda en BD : 
  const usuario = await Usuario.findByIdAndUpdate( id, { estado: false })

  res.json(usuario);
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - controller",
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
