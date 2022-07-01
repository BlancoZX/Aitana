const mongoose= require('mongoose');
const Schema= mongoose.Schema;
//const mongoosePaginate=require('mongoose-paginate-v2');
const url= 'mongodb+srv://adi:adi@cluster0.il6jt.mongodb.net/ChatBot?retryWrites=true&w=majority'
const servicioSchema= new Schema(
   {
      nombre : String,
      location : String,
      telefono: String,
      email:String,
      horario:String,
      sigua:String,
      web:String
   }
)
//userSchema.plugin(mongoosePaginate);
 
module.exports = mongoose.model('servicios',servicioSchema);