var express = require('express');
var cors = require('cors')
const logger = require('morgan');
const {WebhookClient} = require('dialogflow-fulfillment');
const dfff =require('dialogflow-fulfillment')
var app = express();


//Conexion a BD
const mongoose= require('mongoose');
const conectar= require('./bd')

//models
//const UserModel = require('./models/user');
const EdificioModel = require('./models/edificios');
const ServicioModel = require('./models/servicios');

app.use(express.json())
app.use(cors())
app.use(logger('dev'));
app.use(express.static('public'))


const path=require('path');
const { platform } = require('os');
app.get("/",function(req,res){
  console.log("dd"+path.resolve(__dirname,'home.html'))
  res.sendFile(path.resolve(__dirname,'home.html'))
})


app.post("/webhook",express.json(),function(req,res){

    const agent = new WebhookClient({ request:req, response:res });
    async function  Servicios(agent){

      if(agent.parameters.servicios!=null)
      tipo_servicio=agent.parameters.servicios;
      else
      tipo_servicio=agent.parameters.edificios;
  
      await ServicioModel.findOne({"nombre":tipo_servicio}).then(async (data)=>{

        if(data==null)
        agent.add("No se ha encontrado la información solicitada. Por favor reformule su pregunta.")
        else if(agent.parameters.infodeseada=="location"){
          var id = mongoose.Types.ObjectId(data.location);
          await  EdificioModel.findById(id).then((edi)=>{
           console.log("Entro en edificios")
            if(tipo_servicio=="Tarjeta Universitaria"){
  
                  agent.add("Para obtener su "+ tipo_servicio+ " deberá de diriguirse al "+edi.nombre+"\n");
                  var respuesta = {
                    "richContent": [
                      [
                        {
                          "type": "chips",
                          "options": [
                            {
                              "link": edi.maps,
                              "text": "Ubicación Google Maps"
                            }
                          ]
                        }
                      ]
                    ]
                  }
                agent.add(new dfff.Payload(agent.UNSPECIFIED,respuesta,{sendAsMessage:true,rawPayload:true}));
  
            }
            else
            {
             
              if(data.sigua!=""){
                var respuesta = {
                  "richContent": [
                    [
                      {
                        "type": "chips",
                        "options": [ {
                          "link": edi.maps,
                          "text": "Ubicación Google Maps"
                        },
                          {
                            "link": data.sigua,
                            "text": "Ubicación Exacta  Sigua"
                          }
                        ]
                      }
                    ]
                  ]
                }
  
              }else{
                var respuesta = {
                  
                  "richContent": [
                    [
                      {
                        "type": "chips",
                        "options": [
                          {
                            "link": edi.maps,
                            "text": "Ubicación Google Maps"
                          }
                        ]
                      }
                    ]
                  ]
                }
  
              }
      
  
                agent.add(tipo_servicio+ " se encuentra en "+edi.nombre+"\n");
                agent.add(new dfff.Payload(agent.UNSPECIFIED,respuesta,{sendAsMessage:true,rawPayload:true}));
            }
           
            
  
            });
  
            
        }
        else if(agent.parameters.infodeseada=="telefono")
        agent.add(tipo_servicio+ "\n "+ "Teléfono de contacto "+data.telefono);
        else if(agent.parameters.infodeseada=="web"){
          var respuesta = {     
            "richContent": [
              [
                {
                  "type": "chips",
                  "options": [
                    {
                      "link": data.web,
                      "text": "Página Web"
                    }
                  ]
                }
              ]
            ]
          }
          agent.add(tipo_servicio);
          agent.add(new dfff.Payload(agent.UNSPECIFIED,respuesta,{sendAsMessage:true,rawPayload:true}));
        }
        else if(agent.parameters.infodeseada=="email")
        agent.add(tipo_servicio+ "\n "+ "Correo de contacto " +data.email);
        else if(agent.parameters.infodeseada=="horario"){
          agent.add(tipo_servicio+ "\n "+ "Horario: "+data.horario);
        }
      
    
      })
     
    }
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }




  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Bibliotecas/Facultades',Servicios);
  intentMap.set('Servicios',Servicios);
  agent.handleRequest(intentMap);
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);

})


app.listen(3000, function () {
    console.log("El servidor express está en el puerto 3000");
    conectar.establecer;
 });