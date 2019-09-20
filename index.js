var url = 'https://opendata.aragon.es/dataset/80efd5b6-88b0-432e-a3da-ec58095bf1ed/resource/2acdf8bb-b37d-4a68-8c05-2fe0233d0e08/download/instalaciones-deportivas-del-gobierno-de-aragn.json';

const express = require('express');
const https = require('https');
const app = express();



function getResponseFromServer(){
  /* https callout type get, we return the final response from the callout */
  return https.get(url, (resp, finalResponse) =>{
    
    let data;

    /* block that is executed when the response gets data from the external service */
    resp.on('data', (chunk) =>{
        data += chunk;
    });

    /* that is executed when the response ends, and we get all the body */
    resp.on('end', () =>{
      return data;
    });

  }).on("error", (err)=>{
    console.log( 'ERROR :: '  + err );
    return err;
  });

}

app.get('/getNames', (req, res) => {
  var finalResponse = getResponseFromServer();
  res.send(finalResponse);
});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
