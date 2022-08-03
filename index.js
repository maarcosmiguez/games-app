//REQUIRE
const express = require("express");
const app = express();
require("dotenv").config();
let userDB = process.env.DB_USER;
let passDB = process.env.DB_PASS;
const port = process.env.PORT || 3000;

//-------------------------------
//CORS
const cors = require("cors");
app.use(cors());

//-------------------------------
//MONGOOSE
const mongoose = require("mongoose");

//mongoose.connect(`mongodb+srv://${userDB}:${passDB}@clase.5njfa.mongodb.net/base_clase?retryWrites=true&w=majority`);
mongoose.connect(`mongodb+srv://${userDB}:${passDB}@cluster0.prwz0.mongodb.net/clase-mongo?retryWrites=true&w=majority`);

// El mio: `mongodb+srv://${userDB}:${passDB}@cluster0.prwz0.mongodb.net/?retryWrites=true&w=majority`

let db = mongoose.connection;
db.once("open", () => console.log("Conectado"));

//-------------------------------
//MODELOS
let Juego = require("./models/Juego");
let Usuario = require("./models/Usuario");

//-------------------------------

app.use(express.json());
//para poder acceder a los datos enviados por el body de post y put

//--------------------------------------

//ENRUTAMIENTO O DIRECCIONAMIENTO
//GET Peticiones de informacion
app.use("/", express.static("frontend"));

/* app.get("/", (req, res) => {
    res.send("hola entraste a la raiz");
}) */
let id_valido = false;
app.post("/", (req, res) => {
  let userRecibido = req.body.user;
  let passRecibido = req.body.pass;

  console.log(userRecibido, passRecibido);

  Usuario.findOne({ user: userRecibido, pass: passRecibido }, (err, unUsuario) => {
    if (err) {
      return console.log(err);
    } else if (unUsuario === null) {
      //el usuario no es valido
      id_valido = false;
      res.json({
        id_valido: false,
      });
    } else {
      id_valido = true;
      console.log(unUsuario);
      console.log(unUsuario._id);
      Juego.find({ id_Usuario: unUsuario._id }, (err, juegos) => {
        if (err) {
          return console.log(err);
        } else {
          console.log(juegos);
          res.json({
            datosUsuario: {
              id_valido: true,
              id: unUsuario._id,
              nombreUsuario: unUsuario.user,
            },
            datosJuegos: juegos,
          });
        }
      });
    }
  });
});

// Registro user

app.post("/Usuarios", (req, res) => {
  console.log(req.body);
  console.log(req.body.nombre);

  let nuevoUsuario = new Usuario({
    user: req.body.user,
    pass: req.body.pass,
  });

  nuevoUsuario.save((err, Usuario) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        datosUsuario: {
          id_valido: true,
          id: Usuario._id,
          nombreUsuario: nuevoUsuario.user,
        },
      });
    }
  });
});

//------------------------------------------
//middleware inahabilitar de aca para adelante a menos que este logueado

app.use((req, res, next) => {
  if (id_valido) {
    next();
  } else {
    res.statusCode = 401;
    res.json({
      mensaje: "no autorizado",
    });
  }
});
//DIRECIONAMIENTO DE CERRAR
app.get("/cerrar", (req, res) => {
  id_valido = false;
  res.json({
    mensaje: "sesion cerrada",
  });
});
//------------------------------------------
//DIRECCIONAMIENTO JUEGOS
app.get("/juegos", (req, res) => {
  Juego.find((err, juegos) => {
    if (err) {
      return console.log(err);
    } else {
      console.log(juegos);
      res.json(juegos);
    }
  });
});

//------------------------------------------
//peticion con envio de parametros
//http://localhost:3000/juegos/3
app.get("/juegos/:id", (req, res) => {
  let idBuscar = req.params.id;
  console.log(idBuscar);
  Juego.findOne({ _id: idBuscar }, (err, juegos) => {
    if (err) {
      return console.log(err);
    } else {
      console.log(juegos);
      res.json(juegos);
    }
  });
});

////////////////////////////////////////////////////////////

//Peticiones POST PUT DELETE
//------------------------------------------
app.post("/juegos", (req, res) => {
  console.log(req.body);
  console.log(req.body.nombre);

  let game = new Juego({
    nombre: req.body.nombre,
    img: req.body.img,
    link: req.body.link,
    id_Usuario: req.body.id_Usuario,
  });

  game.save((err, juego) => {
    if (err) {
      console.log(err);
    } else {
      res.json(juego);
    }
  });
});

// //------------------------------------------

// app.put("/juegos", (req, res) => {
//   console.log(req.body);
//   //------------------
//   let idModificar = req.body.id;
//   let nombreModificar = req.body.nombre;
//   let edadModificar = parseInt(req.body.edad);
//   let profesionModificar = req.body.profesion;
//   //------------------------------------

//   Juego.findByIdAndUpdate(
//     idModificar,
//     {
//       nombre: nombreModificar,
//       edad: edadModificar,
//       profesion: profesionModificar,
//     },
//     (err, juego) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(juego);
//         res.json(juego);
//       }
//     }
//   );
// });
//------------------------------------------
app.delete("/juegos/:idEliminar", (req, res) => {
  console.log(req.params.idEliminar);
  let idEliminar = req.params.idEliminar;
  console.log(idEliminar);
  Juego.findByIdAndDelete(idEliminar, (err, juego) => {
    if (err) {
      console.log(err);
    } else {
      res.json(juego);
    }
  });
});

//MIDDLEWARE DE ERROR 404
app.use((req, res, next) => {
  res.statusCode = 404;
  res.send("la pagina solicitada no existe");
});

//---------------------------------------------------------------
app.listen(port, () => {
  console.log(`Probar app en http:localhost:${port}`);
});
