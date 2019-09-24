// API: https://www.pue.es/cursos/salesforce/tech-talk-cta
//var url = 'https://www.el-tiempo.net/api/json/v1/provincias';

var options = 
{
  hostname : 'www.el-tiempo.net',
  path: '/api/json/v1/provincias',
  agent: false
};

// init node-modules
const express = require('express');
const https = require('https');



//instances
const app = express();



/**
 * @description webservice method type 'get'
 */
app.get('/getNames', (req, wsRes) => {
  var finalResponse;
  https.get(options, (res)=>{
    
    const provincia = req.query.provincia;
    console.log(provincia);
    var data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log( finalResponse );

      responseBody = data;

      finalResponse = prepareResponse( responseBody, provincia );

      var responseBody = JSON.stringify( finalResponse );
    
      wsRes.setHeader('Access-Control-Allow-Origin', '*');
      wsRes.setHeader('content-type', 'application/json');
      
      wsRes.send( responseBody );

    });

  });

});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
/**
 * @description function that is established to listen in port 8080
 */
app.listen(PORT, () => {
  console.log('The server has been launched');
  console.log('============================');
  console.log('|========= HELLO ==========|');
  console.log('============================');
  console.log(`Server listening on port ${PORT}...`);
});



/**
 * @description prepare response to client
 * @param {*} responseBody 
 * @param {*} res 
 */
function prepareResponse(jsonText, nombreProvincia){
  var lstCodigoProvincia = new Array();
  var responseBody = JSON.parse( jsonText );
  if( responseBody ){
    responseBody.forEach(element => {
      if( element.NOMBRE_PROVINCIA.includes( nombreProvincia ) ){
        lstCodigoProvincia.push( new WrpResponse( element.CODPROV, element.NOMBRE_PROVINCIA ) );
      }
    });

  }
  return lstCodigoProvincia;

}


class WrpResponse{
  constructor(codigoProvincia, nombreProvincia){
    this.codigoProvincia = codigoProvincia;
    this.nombreProvincia = nombreProvincia;
  }
}






