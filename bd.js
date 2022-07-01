
const mongoose= require('mongoose');
const url= 'mongodb+srv://adi:adi@cluster0.il6jt.mongodb.net/ChatBot?retryWrites=true&w=majority'

exports.establecer = mongoose.connect(url,{
    useNewUrlParser: true, useUnifiedTopology: true 
 })
 .then(function(){console.log("Conexión establecida con la BD")})
 .catch(function(error){ console.log("Error al conectarse a la BD:" + error)});