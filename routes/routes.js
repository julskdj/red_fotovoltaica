const express = require("express");
const app = express();

//2 - Para poder capturar los datos del formulario (sin urlencoded nos devuelve "undefined")
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //además le decimos a express que vamos a usar json

//3- Invocamos a dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

//4 -seteamos el directorio de assets
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

//6 -Invocamos a bcrypt
const bcrypt = require("bcryptjs");

//7- variables de session
const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// 8 - Invocamos a la conexion de la DB
const connection = require("../database/db");

//Invocamos el metodo para enviar correos
const transporter = require("../mail/mail");
//Invocamos la funcion de cadena aleatoria
const cadenaAleatoria = require("../functions/functions");

//Invocamos la funcion para escribir archivos
const fs = require('fs');

////////////////////RUTAS///////////////////////////////////////////////////

//Obtener datos por medio de post

app.post("/prueba2", (req, res, next) => {
  /* let url = req.url;
  url = url.substring(url.indexOf('?') + 1);
  const params = url.split('&');
  let text = '';
    
  params.forEach(param => {
    let object = param.split('=');
    text += object[0] + ' : ' + object[1] + '<br/>'; 
  }); */

  res.send(`<h1>Tus datos son: <br/>
    Nombre: ${req.query.nombre} <br/>
    Apellido: ${req.query.apellido} </h1>`);
  console.log(req.query);
});

app.get("/prueba", (req, res, next) => {
  /* let url = req.url;
  url = url.substring(url.indexOf('?') + 1);
  const params = url.split('&');
  let text = '';
    
  params.forEach(param => {
    let object = param.split('=');
    text += object[0] + ' : ' + object[1] + '<br/>'; 
  }); */
  res.send(`<h1>Tus datos son: <br/>
    Nombre: ${req.query.nombre} <br/>
    Apellido: ${req.query.apellido} </h1>`);

  console.log(req.query);
});

app.get("/insetar/:temp", (req, res, next) => {
  const guardar = req.params.temp;
  console.log(guardar);
  connection.query(
    "INSERT INTO temp SET ?",
    { temperatura: guardar },
    async (error, results) => {
      console.log("Dato insertado");
    }
  );
  res.send(guardar);
});

app.get("/login", (req, res) => {
  let ip = req.socket.remoteAddress;
  let conten = "Nuevo acceso, ip: " + ip.substring(7);
  console.log(conten);
  res.render("login");
});



//11 - Metodo para la autenticacion
app.post("/auth", async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHash = await bcrypt.hash(pass, 8);
  if (user && pass) {
    connection.query("SELECT * FROM users WHERE user = ?", [user], async (error, results, fields) => {
      if (
        results.length == 0 ||
        !(await bcrypt.compare(pass, results[0].pass))
      ) {
        res.render("login", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "USUARIO y/o PASSWORD incorrectas",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "login",
        });

        //Mensaje simple y poco vistoso
        //res.send('Incorrect Username and/or Password!');
      } else {
        //creamos una var de session y le asignamos true si INICIO SESSION
        req.session.loggedin = true;
        req.session.rol = results[0].rol;
        req.session.name = results[0].name;
        req.session.pass = pass;
        res.render("login", {
          alert: true,
          alertTitle: "Conexión exitosa",
          alertMessage: "¡LOGIN CORRECTO!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "inicio",
        });
      }
      res.end();
    }
    );
  } else {
    res.send("Please enter user and Password!");
    res.end();
  }
});

//12 - Método para controlar que está auth en todas las páginas
app.get("/", (req, res) => {
  let ip = req.socket.remoteAddress;
  let conten = "Nuevo acceso, ip: " + ip.substring(7);
  console.log(conten);

  if (req.session.loggedin) {
    res.render("login", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("login", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

app.get("/inicio", (req, res) => {
  if (req.session.loggedin) {
    res.render("inicio", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("inicio", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

app.post("/encenderled1", (req, res, next) => {
  connection.query("UPDATE leds SET ?", { Led: 1 }, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Led Encendido");
    }
  });

  if (req.session.loggedin) {
    res.render("inicio", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("inicio", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }

  res.end();
});

app.post("/apagarled1", (req, res, next) => {
  connection.query("UPDATE leds SET ?", { Led: 0 }, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Led Encendido");
    }
  });

  if (req.session.loggedin) {
    res.render("inicio", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("inicio", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

app.post("/encenderled2", (req, res, next) => {
  connection.query("UPDATE ledno2 SET ?", { Led2: 1 }, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Led Encendido");
    }
  });

  if (req.session.loggedin) {
    res.render("inicio", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("inicio", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

app.post("/apagarled2", (req, res, next) => {
  connection.query("UPDATE ledno2 SET ?", { Led2: 0 }, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Led Encendido");
    }
  });

  if (req.session.loggedin) {
    res.render("inicio", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("inicio", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

app.post("/encenderled3", (req, res, next) => {
  connection.query("UPDATE led3 SET ?", { Led3: 1 }, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Led Encendido");
    }
  });

  if (req.session.loggedin) {
    res.render("inicio", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("inicio", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

app.post("/apagarled3", (req, res, next) => {
  connection.query("UPDATE led3 SET ?", { Led3: 0 }, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Led Encendido");
    }
  });

  if (req.session.loggedin) {
    res.render("inicio", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("inicio", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

app.post("/encenderred", (req, res, next) => {
  connection.query(
    "UPDATE relecontrol SET ?",
    { rele: 0 },
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Led Encendido");
      }
    }
  );

  if (req.session.loggedin) {
    res.render("inicio", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("inicio", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

app.post("/apagarred", (req, res, next) => {
  connection.query(
    "UPDATE relecontrol SET ?",
    { rele: 1 },
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Led Encendido");
      }
    }
  );

  if (req.session.loggedin) {
    res.render("inicio", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("inicio", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

app.get("/estadisticas", (req, res, next) => {

  var temperatura

  connection.query("Select Avg(temperatura) as tempe from temp order by temperatura desc limit 7", async (error, results, fields) => {


    connection.query("Select Avg(humedad) as humd from hume order by humedad desc limit 7", async (error2, results2, fields2) => {

      connection.query("Select Avg(sensacion) as sensa from termica order by sensacion desc limit 7", async (error3, results3, fields3) => {


        //console.log(results[0].tempe)
        const archivo = './public/archives/prueba.json';
        const consulta = `[{
  "temp": ${results[0].tempe},
  "hume": ${results2[0].humd},
  "sensa": ${results3[0].sensa}
}]`

        fs.writeFile(archivo, consulta, (err) => {

          if (err) {
            console.log(err)
          }
        });
      });
    });
  });


  if (req.session.loggedin) {
    res.render("estadisticas", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("estadisticas", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
});


app.get("/graficos", (req, res, next) => {
  if (req.session.loggedin) {
    res.render("graficos", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("graficos", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});


//función para limpiar la caché luego del logout
app.use(function (req, res, next) {
  if (!req.user)
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
});

//Logout
//Destruye la sesión.
app.get("/logout", function (req, res) {
  req.session.destroy(() => {
    res.redirect("/login"); // siempre se ejecutará después de que se destruya la sesión
  });
});

app.get("/usuarios", (req, res, next) => {

  connection.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    
    if (req.session.loggedin) {
      res.render("usuarios", {
        login: true,
        name: req.session.name,
        rol: req.session.rol,
        results: results,
      });
    } else {
      res.render("usuarios", {
        login: false,
        name: "Debe iniciar sesión",
        results: results,
      });
    }
      
    
  })

});

app.get("/register", (req, res) => {
  let ip = req.socket.remoteAddress;
  let conten = ".   Nuevo acceso, ip: " + ip.substring(7);
  console.log(conten);

  if (req.session.loggedin) {
    res.render("register", {
      login: true,
      name: req.session.name,
      rol: req.session.rol,
    });
  } else {
    res.render("register", {
      login: false,
      name: "Debe iniciar sesión",
    });
  }
  res.end();
});

//10 - Método para la REGISTRACIÓN
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const rol = req.body.rol;
  const password = req.body.password;
  const email = req.body.email;
  const codigo_placa = cadenaAleatoria();

  connection.query(
    "SELECT * FROM users WHERE user = ?",
    [username],
    async (error, results, fields) => {
      if (results.length == 0) {
        res.render("register2", {
          alert: true,
          alertTitle: "Registration",
          alertMessage: "¡Successful Registration!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "usuarios",
        });

        connection.query(
          "INSERT INTO placa SET ?",
          { codigo_placa: codigo_placa },
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log("ok");
            }
          }
        );
        let passwordHash = await bcrypt.hash(password, 8);
        connection.query(
          "INSERT INTO users SET ?",
          {
            user: username,
            name: name,
            email: email,
            rol: rol,
            pass: passwordHash,
            codigo_placa_: codigo_placa,
          },
          async (error, results) => {
            if (error) {
              console.log(error);
            } else {
              let mensaje = `Usted se ha registrado correctamente. \nNombre Completo: ${name}\nUsuario: ${username}\nContraseña: ${password}\nCorreo: ${email}
					\nrol: ${rol}
					`;

              let mailOptions = {
                from: "julioasjd@gmail.com",
                to: email,
                subject: "Asunto Del Correo",
                text: mensaje,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email enviado: " + info.response);
                  console.log("Email send to: " + email);
                }
              });
              //res.redirect('/');
            }
          }
        );

        //Mensaje simple y poco vistoso
        //res.send('Incorrect Username and/or Password!');
      } else {
        //creamos una var de session y le asignamos true si INICIO SESSION
        res.render("register2", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "USUARIO y/o PASSWORD Ya existen",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "register",
        });
      }
      res.end();
    }
  );
});

app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM users WHERE id=?', [id], (err, results) => {
    if (err) throw err;
      
    

    if (req.session.loggedin) {
      res.render("edit", {
        login: true,
        name: req.session.name,
        rol: req.session.rol,
        user:results[0],
      });
    } else {
      res.render("edit", {
        login: false,
        name: "Debe iniciar sesión",
        user:results[0],
      });
    }
    res.end();

  });
})

const crud = require('../functions/crud');
app.post('/update', crud.update);


app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/usuarios');
    }
  })
});

app.use(function (req, res, next) {
  res.status(404).render("404");
});

module.exports = app;
