const connection = require('../database/db');
const bcrypt = require("bcryptjs");


exports.update = async (req, res)=>{
    const id = req.body.id;
    const username = req.body.username;
    const rol = req.body.rol;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    let passwordHash = await bcrypt.hash(password, 8);
    connection.query('UPDATE users SET ? WHERE id = ?',[{user:username,name:name, email:email,pass:passwordHash ,rol:rol}, id], async (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect('/usuarios');         
        }
});
};