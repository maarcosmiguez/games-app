const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let juegoSchema = new schema({
  nombre: String,
  img: String,
  link: String,
  id_Usuario: String,
});
let Juego = mongoose.model("juego", juegoSchema);

module.exports = Juego;
