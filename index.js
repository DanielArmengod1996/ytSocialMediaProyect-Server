  // API: https://www.pue.es/cursos/salesforce/tech-talk-cta
  //var url = 'https://www.el-tiempo.net/api/json/v1/provincias';
  var CODPROV = '';
  var ID = '';




  var option3 = 
  {
    url : `https://www.el-tiempo.net/api/json/v1/provincias/${CODPROV}/municipios/${ID}/weather`,
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
  app.get('/getWeather', (req, wsRes) => {
    var responseBody;
    var option1 = 
    {
      url : 'https://www.el-tiempo.net/api/json/v1/provincias',
      headers: {
        'User-Agent':'request'
      }
    };

    doGetRequest(option1).then(function(dataOption1){

      /* request for the province code*/
      const finalResponse = dataOption1;
      //console.log(finalResponse);
      const provincia = req.query.provincia;
      responseBody = prepareResponse( finalResponse, provincia );
      //return wrappedResponse;
    }).then(function(data){
      // we instance the codprov to get the info from the weather
      
      CODPROV = responseBody[0].codigoProvincia;

      var option2 = 
      {
        url : `https://www.el-tiempo.net/api/json/v1/provincias/${CODPROV}/municipios`,
        headers: {
          'User-Agent':'request'
        }
      };

      /* call to get the response with the cod prov */
      doGetRequest(option2).then(function(dataOption2){
        // request to get the id from the municipie
        //console.log('DATA OPTION 2 : ' + dataOption2);
        console.log(dataOption2);
        responseBody = extractAllDataFromProvince(dataOption2);

      }).then(function(data){
        
        /* final response */
        wsRes.setHeader('Access-Control-Allow-Origin', '*');
        wsRes.setHeader('content-type', 'application/json');
        //console.log('responseBody :: ' + responseBody);
        wsRes.send( responseBody );

        doGetRequest(option3).then(function(dataOption3){
          // request to get the weather from the province with the id
          //console.log('DATA OPTION 3: ' + dataOption3 );
        });

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


  //50
  //to
  //8120

  function extractAllDataFromProvince(responseBody){
    console.log('entro a ejecutar este bucle');
    for (var i = 40; i < 8120; i++) {
      var str = i.toString();
      responseBody = responseBody.replace(`"${str}":`, '');
    }
    responseBody = responseBody.replace('{{', '[{');
    responseBody = responseBody.replace('}}', '}]');
    return responseBody;
  }