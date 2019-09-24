// API: https://www.pue.es/cursos/salesforce/tech-talk-cta
//var url = 'https://www.el-tiempo.net/api/json/v1/provincias';

var option1 = 
{
  url : 'https://www.el-tiempo.net/api/json/v1/provincias',
  headers: {
    'User-Agent':'request'
  }
};

// init node-modules
const express = require('express');
const request = require('request');



//instances
const app = express();



/**
 * @description webservice method type 'get'
 */
app.get('/getNames', (req, wsRes) => {
  doGetRequest(option1).then(function(data){
    const finalResponse = data;
    console.log(finalResponse);
    const provincia = req.query.provincia;
    const wrappedResponse = prepareResponse( finalResponse, provincia );
    const responseBody = JSON.stringify(wrappedResponse);
    wsRes.setHeader('Access-Control-Allow-Origin', '*');
    wsRes.setHeader('content-type', 'application/json');
    
    wsRes.send( responseBody );
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
      if( element.NOMBRE_PROVINCIA.toUpperCase().includes( nombreProvincia.toUpperCase() ) ){
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





function doGetRequest(option){
  return new Promise(function(resolve, reject){
  
  request.get(option, function(err, resp, body){
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }

    });

  });
 
}