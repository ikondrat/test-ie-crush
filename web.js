/* globals require, console */
const http = require('http'),
      https = require('https'),
      fs = require('fs'),
      hostname = '127.0.0.1',
      portHttp = '80',
      portHttps = '443';
      
const getExternal = (resource, onResponse, onError) => {
  http.get(resource, function(resp){
    resp.on('data', onResponse);
  }).on("error", onError);
};

const routeRequest = (req, res) => {
  res.statusCode = 200;
  let fileName = req.url;
  if (fileName === '/' || fileName === '/itineraries/') {
    fileName = '/index.html';
  }
  if (fileName.match('/api')) {
    return getExternal({
      host: 'fti-app.nezasa.com',
      port: 443,
      path: fileName
    }, (resp) => {
      var a = 1;
    }, (data) => {
      
      var t = 123;

    });
  } else {
    let contentType = "text/html";

    if (fileName.match(/\.js/)) {
      contentType = "text/javascript";
    }
    if (fileName.match(/\.css/)) {
      contentType = "text/css";
    }
    fs.readFile('.' + fileName, function (err, html) {
      console.log('request: ' + fileName);
      if (err) {
          // throw err; 
          res.writeHeader(400, {"Content-Type": contentType});  
          res.write('not found');  
      } else {
        res.writeHeader(200, {"Content-Type": contentType});  
        res.write(html);  
      }
      res.end();  
      
    });
  }

  
};

const options = {
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt')
};

const serverHttp = http.createServer(routeRequest);
const serverHttps = https.createServer(options, routeRequest);

serverHttp.listen(portHttp, hostname, () => {
  console.log(`Server running at http://${hostname}:${portHttp}/`); // eslint-disable-line no-console
});

serverHttps.listen(portHttps, hostname, () => {
  console.log(`Server running at https://${hostname}:${portHttps}/`); // eslint-disable-line no-console
});