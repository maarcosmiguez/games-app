const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let usuarioSchema = new schema({
  user: String,
  pass: String,
});
let Usuario = mongoose.model("usuario", usuarioSchema);

module.exports = Usuario;
