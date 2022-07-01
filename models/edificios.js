const mongoose= require('mongoose');
const Schema= mongoose.Schema;
//const mongoosePaginate=require('mongoose-paginate-v2');
const url= 'mongodb+srv://adi:adi@cluster0.il6jt.mongodb.net/ChatBot?retryWrites=true&w=majority'
const edificioSchema= new Schema(
   {
      nombre : String,
      maps : String,
  
   }
)
//userSchema.plugin(mongoosePaginate);
 
module.exports = mongoose.model('edificios',edificioSchema);