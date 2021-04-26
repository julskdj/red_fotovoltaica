//En pruebas


//Invocamos el metodo para enviar correos
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'julioasjd@gmail.com',
        pass: 'Zte2256789'
    }
});

module.exports = transporter


