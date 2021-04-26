console.log('Conexion javascript establecida')

var obtener = localStorage.getItem("Sesion");

inicio()

function inicio(){
    if (obtener == "") {
    } else if (obtener == null) {
    } else {
      var temporal = obtener
  
      if(document.getElementById("sesion") != null){
        obtener = `<i class="fas fa-user"></i>${obtener}`;
        document.getElementById("sesion").innerHTML = obtener;
      }
        
    }
    
  }

function loginJSON() {
    let Username = document.getElementById("Username").value;
    let Contrasena = document.getElementById("Contrasena").value;
    let flag = null;
    let sesion
    if ((Contrasena.length == 0) & (Username.length == 0)) {
        alert("Ambos campos vacios");
    } else if (Username.length == 0) {
        alert("Campo usuario vacio");
    } else if (Contrasena.length == 0) {
        alert("Campo contraseña vacio");
    } else {
        fetch("../json/usuarios.json")
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                data.forEach(function (validar) {
                    if (validar.usuario == Username) {
                        if (validar.contraseña == Contrasena) {
                            sesion = `${validar.nombre} ${validar.apellido}`;
                            almacenar = `${validar.logeo}`
                            localStorage.setItem("logeo", almacenar);
                            flag = true;
                            localStorage.setItem("Sesion", sesion);
                            alert(`Bienvenido ${sesion}`)
                            location.href = "../index.html"
                        } else {
                            alert("contraseña incorrecta");
                            flag = true;
                        }
                    }
                });
                if (flag == null) {
                    alert("Usuario no encontrado");
                }
            })
            .catch(function (error) {
                alert(error);
            });
    }
}

function cerrarSesion() {
    document.getElementById("sesion").innerHTML = `<i class="fas fa-user"></i>Username`;
    localStorage.removeItem("Sesion");
    localStorage.removeItem("logeo");
    location.href = "html/Login.html";
}
