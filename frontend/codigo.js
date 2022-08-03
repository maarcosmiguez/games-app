// localStorage.clear();

//------------------------------------------------------
//URL
let url = "http://localhost:3000";

// API NO UTILIZADA POR CORS
// let url_games = "https://www.freetogame.com/api/games";

//GLOBALS
let juegosCargados;
let juegosGuardados;
let juegoEncontrado = [];


// DOM---------

//------------------------------------------------------
//ELEMENTOS
let txtUser = document.querySelector("#txt_user");
let txtPass = document.querySelector("#txt_pass");
let txtBuscar = document.querySelector("#txt_buscar");
let txtNombre = document.querySelector("#txt_nombre");
let txtEdad = document.querySelector("#txt_edad");
let txtProfesion = document.querySelector("#txt_profesion");
let video = document.querySelector(".video");
let txtR = document.querySelector("#txt_user_r");
let txtP = document.querySelector("#txt_pass_r");
let btR = document.querySelector("#bt_register");
//------------------------------------------------------
// BOTONES
let btLoguear = document.querySelector("#bt_loguear");
// let btMostrar = document.querySelector("#bt_mostrar");
let btBuscar = document.querySelector("#bt_buscar");
let btIngresar = document.querySelector("#bt_ingresar");
let bt_mostrarListaJuegos = document.querySelector("#bt_mostrarListaJuegos");
let bt_ocultarLista = document.querySelector("#bt_ocultar");
let bt_Register = document.querySelectorAll(".register");
let bt_SignUp = document.querySelectorAll(".signUp");

//------------------------------------------------------
// CONTENEDORES
let divFiltrado = document.querySelector("#resultadoBusqueda");
let divDatos = document.querySelector("#datos");
let guardados = document.querySelector("#guardados");
let divGames = document.querySelector("#div-games");
let divLista = document.querySelector("#lista");
let userNav = document.querySelector("#userNav");
let userDataMob = document.querySelector(".userDataMob");
let divRegister = document.querySelector("#divRegister");
let divSignUp = document.querySelector("#divSignUp");
let divInfo = document.querySelector("#info");
let ocultarDiv = document.querySelector(".ocultarDiv");
//-------------------------------------------------
//EVENTOS
btLoguear.addEventListener("click", ingresarApp);
bt_mostrarListaJuegos.addEventListener("click", cargarJuegos);
bt_ocultarLista.addEventListener("click", ocultarLista);
// btMostrar.addEventListener("click", mostrarLosJuegos);

bt_Register.forEach((e) => {
  e.addEventListener("click", mostrarRegistro, ocultarSignUp);
});
bt_SignUp.forEach((e) => {
  e.addEventListener("click", mostrarSignUp, ocultarRegistro);
});

txtBuscar.addEventListener("keyup", buscarJuego);
btBuscar.addEventListener("click", resetBusqueda);
btR.addEventListener("click", crearUsuario);

initApp();

//-------------------------------------------------
// FUNCIONES

function initApp() {
  if (document.getElementById("state1")) {
    const countUp = new CountUp("state1", document.getElementById("state1").getAttribute("countTo"));
    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }
  }
  if (document.getElementById("state2")) {
    const countUp1 = new CountUp("state2", document.getElementById("state2").getAttribute("countTo"));
    if (!countUp1.error) {
      countUp1.start();
    } else {
      console.error(countUp1.error);
    }
  }
  if (document.getElementById("state3")) {
    const countUp2 = new CountUp("state3", document.getElementById("state3").getAttribute("countTo"));
    if (!countUp2.error) {
      countUp2.start();
    } else {
      console.error(countUp2.error);
    }
  }

  if (document.querySelector(".datepicker-1")) {
    flatpickr(".datepicker-1", {}); // flatpickr
  }

  if (document.querySelector(".datepicker-2")) {
    flatpickr(".datepicker-2", {}); // flatpickr
  }
}

// LOGIN / REGISTER
function mostrarRegistro() {
  divRegister.classList.remove("hide");
  divRegister.style.display = "block";
  divSignUp.classList.add("hide");
  divSignUp.style.display = "none";
}

function mostrarSignUp() {
  divRegister.classList.add("hide");
  divRegister.style.display = "none";
  divSignUp.classList.remove("hide");
  divSignUp.style.display = "block";
}

function ocultarRegistro() {
  divRegister.classList.add("hide");
  divRegister.style.display = "none";
}

function ocultarSignUp() {
  divSignUp.classList.add("hide");
  divSignUp.style.display = "none";
}

// REGISTRO
function crearUsuario() {
  let rV = txtR.value;
  let rP = txtP.value;

  fetch(`${url}/Usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: rV,
      pass: rP,
    }),
  })
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (datos.id_valido === false) {
        console.log(error);
      } else {
        let nuevoUsuario = datos.datosUsuario.nombreUsuario;
        let nuevoIdUsuario = datos.datosUsuario.id;
        localStorage.setItem("nombreUsuario", nuevoUsuario);
        localStorage.setItem("idUsuario", nuevoIdUsuario);
        console.log("hola, user");
        welcomeUserNav();
        newRegisterToast();
        userDataMob.innerHTML = `${localStorage.getItem("nombreUsuario")}´s profile`;
        divInfo.style.display = "block";
        ocultarRegistro();
        ocultarSignUp();
        divGames.classList.remove("hide");
        divDatos.style.display = "flex";
        bt_ocultarLista.classList.add("hide");
        divLista.classList.remove("hide");
        divLista.style.display = "block";
        juegosCargados = datos.datosJuego;
        console.log(juegosCargados);
        mostrarLosJuegos(juegosCargados);
      }
    });
}

// INGRESO
function ingresarApp() {
  let userIngresado = txtUser.value;
  let passIngresada = txtPass.value;
  console.log(userIngresado, passIngresada);
  fetch(`${url}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: userIngresado,
      pass: passIngresada,
    }),
  })
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      console.log(datos);
      if (datos.id_valido === false) {
        alert("usuario no valido");
      } else {
        let nombre = datos.datosUsuario.nombreUsuario;
        let id_usuario = datos.datosUsuario.id;
        //---------------------------------------
        localStorage.setItem("nombreUsuario", nombre);
        localStorage.setItem("idUsuario", id_usuario);
        //-----------------------------------------

        welcomeUserNav();
        newUserToast();
        userDataMob.innerHTML = `${localStorage.getItem("nombreUsuario")}´s profile`;
        divInfo.style.display = "block";
        divGames.classList.remove("hide");
        bt_ocultarLista.classList.remove("hide");
        divLista.classList.remove("hide");
        divDatos.style.display = "flex";
        juegosCargados = datos.datosJuegos;
        console.log(juegosCargados);
        mostrarLosJuegos(juegosCargados);
      }
      // aca aun lo guarda
      console.log(juegosCargados);
    });

}

console.log(juegosCargados);
console.log(juegosGuardados);

userEntro();

function userEntro() {
  if (localStorage.idUsuario) {
    console.log("ya definido usuario");
    divInfo.style.display = "block";
    divLista.classList.remove("hide");
    divDatos.style.display = "flex";
    ocultarRegistro();
    ocultarSignUp();
    welcomeUserNav();
  }
}

function welcomeUserNav() {
  video.classList.remove("hide");
  ocultarRegistro();
  ocultarSignUp();
  divInfo.style.display = "block";
  newUserNavInfo();
  let btCerrar = document.querySelector("#bt_cerrar");
  btCerrar.addEventListener("click", cerrarSesion);
}

function newUserNavInfo() {
  userNav.innerHTML = `<li class="nav-item mx-2 d-flex align-items">
<a class="nav-link ps-2 d-flex justify-content-between text-dark cursor-pointer align-items-center signUp" role="button"> Welcome, ${localStorage.getItem("nombreUsuario")}</a>
<a><input type="button" id="bt_cerrar" value="cerrar session" class="btn bg-secondary text-white mb-0 ml-1" /></a>
</li>`;
}

function newUserToast() {
  let myAlert = document.querySelector(".toast-ingreso");
  // newUserNavInfo();
  let bsAlert = new bootstrap.Toast(myAlert);
  bsAlert.show();
}

function newRegisterToast() {
  let myNewAlert = document.querySelector(".toast-registro");
  // newUserNavInfo();
  let bsNewAlert = new bootstrap.Toast(myNewAlert);
  bsNewAlert.show();
}

function cerrarSesion() {
  localStorage.clear();
  video.classList.add("hide");
  divLista.classList.add("hide");
  divInfo.style.display = "none";
  document.querySelector("#divSignUp").style.display = "block";
  divSignUp.classList.remove("hide");
  newNav();
  console.log(juegosCargados);
  juegosCargados = [];
}

function newNav() {
  video.classList.add("hide");
  userNav.innerHTML = `<li class="nav-item mx-2">
  <a class="nav-link ps-2 d-flex justify-content-between text-dark cursor-pointer align-items-center signUp" role="button"> Sign In </a>
</li>
<li class="nav-item dropdown mx-2">
  <a class="nav-link ps-2 d-flex justify-content-between text-dark cursor-pointer align-items-center register" href="#">
    Register Free
    <i class="fa text-xs text-secondary ms-2 fa-arrow-right" aria-hidden="true"></i>
  </a>
</li>`;
}

function ocultarLista() {
  divDatos.style.display = "none";
  divGames.classList.add("hide");
  bt_ocultarLista.classList.add("hide");
  ocultarDiv.classList.add("hide");

}

function mostrarLosJuegos(juegosCargados) {
  console.log(juegosCargados);
  ocultarDiv.classList.remove("hide");
  divDatos.classList.remove("hide");
  divDatos.innerHTML = "";
  juegosCargados.forEach((element) => {
    divDatos.innerHTML += `
  <article> 
  <div class="card shadow-1 m-4" style="width: 35vh; height: 25vh; background: rgb(11 18 35 / 82%) url(${element.img}) no-repeat center center">
   <div class="card-body d-flex flex-column justify-content-center">

  <div class="d-flex w-100 justify-content-center gp-1">
  <a href="${element.link}" " target="_blank">
  <input type="button" class="probar
  btn bg-dark text-white"
  value="Probar">
  </a>
  
  <input data-idEliminar="${element._id}" type="button" class="eliminar
  btn bg-danger text-white" value="Eliminar">
  </div>
  </article>
  </div>
  </div>
  </article>`;
  });

  let bts_eliminar = document.querySelectorAll(".eliminar");
  bts_eliminar.forEach((element) => {
    element.addEventListener("click", eliminarJuego);
  });
}

function resetBusqueda() {
  divFiltrado.classList.add("hide");
  btBuscar.classList.add("hide");
  return;
}

//ELIMINAR
function eliminarJuego() {
  console.log(this.getAttribute("data-idEliminar"));
  let idEliminar = this.getAttribute("data-idEliminar");
  let posicionEliminar = juegosCargados.findIndex((juego) => juego._id === idEliminar);
  console.log(posicionEliminar);
  juegosCargados.splice(posicionEliminar, 1);
  mostrarLosJuegos(juegosCargados);

  fetch(`${url}/juegos/${idEliminar}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      console.log(datos);
    });
}

// CARGA TODOS LOS JUEGOS
function cargarJuegos() {
  divGames.classList.remove("hide");
  bt_ocultarLista.classList.remove("hide");
  divGames.style.display = "flex";
  switchBtn();

  divGames.innerHTML = "";

  // MOSTRAR TODOS
  games.forEach((element) => {
    divGames.innerHTML += `<article> 
  <div class="card shadow-1 m-4" style="width: 20rem;">
      <img class="card-img-top" src="${element.thumbnail}" alt="Card image cap">
       <div class="card-body">
      <h5 data-id="${element.id}" class="card-title">${element.title}</h5>
      <p class="card-text">${element.short_description}</p>
      
      <a href="${element.game_url}" target="_blank">
      <input type="button" class="probar
      btn bg-dark text-white"
      value="Probar">
      </a>

      <input data-idAgregar="${element.id}" data-imgAgregar="${element.thumbnail}" data-urlAgregar="${element.game_url}" data-nombreAgregar="${element.title}" type="button" class="agregar
      btn bg-danger text-white" value="Agregar a lista">
      </article>
    </div>
  </div>
</article>`;

    let bts_agregar = document.querySelectorAll(".agregar");
    bts_agregar.forEach((element) => {
      element.addEventListener("click", ingresarJuego);
    });
  });
}

// FILTRA JUEGOS POR PALABRA
function buscarJuego() {
  let textoIngresadoBuscar = txtBuscar.value;
  console.log(textoIngresadoBuscar);
  let juegoEncontrado = games.filter((game) => game.title.includes(textoIngresadoBuscar));
  divFiltrado.classList.remove("hide");
  divFiltrado.innerHTML = "";
  console.log(juegoEncontrado);
  btBuscar.classList.remove("hide");

  juegoEncontrado.forEach((element) => {
    divFiltrado.innerHTML += `<article> 
  <div class="card shadow-1 m-4" style="width: 20rem;">
      <img class="card-img-top" src="${element.thumbnail}" alt="Card image cap">
       <div class="card-body">
      <h5 data-id="${element.id}" class="card-title">${element.title}</h5>
      <p class="card-text">${element.short_description}</p>
      
      <a href="${element.game_url}" target="_blank">
      <input type="button" class="probar
      btn bg-dark text-white"
      value="Probar">
      </a>

      <input data-idAgregar="${element.id}" data-imgAgregar="${element.thumbnail}" data-urlAgregar="${element.game_url}" data-nombreAgregar="${element.title}" type="button" class="agregar
      btn bg-danger text-white" value="Agregar a lista">
      </article>
    </div>
  </div>
</article>`;
  });

  let bts_agregar = document.querySelectorAll(".agregar");
  bts_agregar.forEach((element) => {
    element.addEventListener("click", ingresarJuego);
  });
}

function switchBtn() {
  bt_mostrarListaJuegos.classList.add("yaCargados");
  let nuevoBtn = document.querySelector(".yaCargados");
  nuevoBtn.value = "Ocultar juegos";
  nuevoBtn.addEventListener("click", resetBtn);
  function resetBtn() {
    divGames.style.display = "none";
    nuevoBtn.value = "Mostrar todos los juegos";
    bt_mostrarListaJuegos.classList.remove("yaCargados");
    bt_mostrarListaJuegos.addEventListener("click", cargarJuegos);
  }
}

// GUARDAR DATOS DE JUEGO SELECCIONADO
function ingresarJuego() {
  let urlAgregar = this.getAttribute("data-urlAgregar");
  let imgAgregar = this.getAttribute("data-imgAgregar");
  let nombreAgregar = this.getAttribute("data-nombreAgregar");

  // mostrarLosJuegos(juegosCargados);

  fetch(`${url}/juegos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: nombreAgregar,
      img: imgAgregar,
      link: urlAgregar,
      id_Usuario: localStorage.getItem("idUsuario"),
    }),
  })
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      juegosCargados.push(datos);
      mostrarLosJuegos(juegosCargados);
    });
}
