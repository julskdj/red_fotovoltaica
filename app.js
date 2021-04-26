// 1 - Invocamos a Express y socket.io
const http = require('http');
const SocketIo = require('socket.io');

const express = require('express');
const app = express();

const server = http.createServer(app);
const io = SocketIo.listen(server);

app.use(require('./routes/routes')) 

//EVENTOS MYSQL
const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const ora = require('ora'); // cool spinner
const spinner = ora({
	text: '🛸 Waiting for database events... 🛸',
	color: 'blue',
	spinner: 'dots2'
});

//5 - Establecemos el motor de plantillas
app.set('view engine', 'ejs');

//Comunicacion con arduino
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();

//2 - Para poder capturar los datos del formulario (sin urlencoded nos devuelve "undefined")
app.use(express.urlencoded({ extended: false }));
app.use(express.json());//además le decimos a express que vamos a usar json
 
//3- Invocamos a dotenv 
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//4 -seteamos el directorio de assets
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecemos el motor de plantillas
app.set('view engine', 'ejs');

//6 -Invocamos a bcrypt
const bcrypt = require('bcryptjs');

//7- variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const nodemailer = require('nodemailer');

// 8 - Invocamos a la conexion de la DB
const connection = require('./database/db');
const conet1 = require('./database/db')

//mysql events 
const program = async () => {
	
	const instance = new MySQLEvents(conet1, {
	  startAtEnd: true 
	});
  
	await instance.start();
	//EVENTOS DE INSERT DE TEMPERATURA
	instance.addTrigger({
	  name: 'temperatura updates from table placa at probar',
	  expression: 'probando.temp.temperatura',
	  statement: MySQLEvents.STATEMENTS.INSERT, // 
	  onEvent: e => {
		  //console.log(e);
		  connection.query('SELECT * FROM temp ORDER BY id DESC LIMIT 1', function (err,filas){
			  if (err) {
				  throw err;
			  } else{
				  
				console.log(filas[0].temperatura)

				  if(filas[0].temperatura > 50){
					  //Detener funcion
					  
				  }

				  io.emit('arduino:data', {
					value: filas[0].temperatura.toString()
				  });
			  }
		  })
		
		}
	});

	//EVENTOS DE INSERT DE HUMEDAD
	instance.addTrigger({
		name: 'humedad updates from table placa at probar',
		expression: 'probando.hume.humedad',
		statement: MySQLEvents.STATEMENTS.INSERT, // you can choose only insert for example MySQLEv
		onEvent: e => {
			//console.log(e);
			connection.query('SELECT * FROM hume ORDER BY id DESC LIMIT 1', function (err,filas){
				if (err) {
					throw err;
				} else{
					  
					io.emit('arduino:hume', {
					  value: filas[0].humedad.toString()
					});
				}
			})
		  
		  }
	  });
	  //EVENTOS DE INSERT DE SENSACION TERMICA
	  instance.addTrigger({
		name: 'Sensacion termica updates from table placa at probar',
		expression: 'probando.termica.sensacion',
		statement: MySQLEvents.STATEMENTS.INSERT, // you can choose only insert for example MySQLEv
		onEvent: e => {
			//console.log(e);
			connection.query('SELECT * FROM termica ORDER BY id DESC LIMIT 1', function (err,filas){
				if (err) {
					throw err;
				} else{
					console.log(filas[0].sensacion)
  
					io.emit('arduino:sens', {
					  value: filas[0].sensacion.toString()
					});
				}
			})
		  
		  }
	  });
  
	instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
	instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
  };
  
  program()
	.then(spinner.start.bind(spinner))
	.catch(console.error);


/*const mySerial = new SerialPort('COM4', {
	baudRate: 9600
  });

  mySerial.pipe(parser);

  mySerial.on('open', function () {
	console.log('Opened Port.');
  });
  
  mySerial.on('data', function (data) {
	console.log(data.toString());
	io.emit('arduino:data', {
	  value: data.toString()
	});
  });
  
  mySerial.on('err', function (data) {   
	console.log(err.message);
  }); */

function cadenaAleatoria() {
	let longitud = 16;
	let caracteres = "0123456789abcdefghijklmnopqrstuvwxyz";

	let cadena = "";
	let max = caracteres.length - 1;
	for (let i = 0; i < longitud; i++) {
		cadena += caracteres[Math.floor(Math.random() * (max + 1))];
	}
	return cadena;
}

module.exports = app

app.set('port', process.env.PORT || 3000)

server.listen(app.get('port'), (req, res) => {
	console.log('SERVER RUNNING IN http://localhost:3000');
});