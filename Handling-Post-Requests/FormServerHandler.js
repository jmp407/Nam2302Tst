var http = require('http');
var splitter = require('./splitter.js');

var prefHTML =
  '<html><head><title>Post Set Point Example</title></head>' +
  '<body>' +
//  '<form action="http://10.0.0.4:8337/" method="POST">' + Don't need the action....
  '<form method="POST">';
var inptHTML = 
  'Set Point: <input type="text" name="SetPoint" value=70.0><br>' +
  'Plant on/off: <input type="text" name="PonOff" value="off"><br>';
var postHTML = 
  '<input type="submit" value="Send">' +
  '</form>' +
  '</body></html>';
var pageHTML = prefHTML + inptHTML + postHTML ;

 
http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    console.log('POSTed: ' + body);
 
    if (body != '')
    {
        var hash = splitter.formValues(body);
 
         console.log("input1 = " + hash["SetPoint"]);
         console.log("input2 = " + hash["PonOff"]);
         
         inptHTML = 
  'Set Point: <input type="text" name="SetPoint" value=' + hash["SetPoint"] + '><br>' +
  'Plant on/off: <input type="text" name="PonOff" value=' + hash["PonOff"] + '><br>';
        pageHTML = prefHTML + inptHTML + postHTML ;
         res.writeHead(200);
         res.write(pageHTML);
         res.write('The set point and relay position is ' + hash["SetPoint"] + ', ' + hash["PonOff"] + '.');
         res.end('Thats all folks');
         return;
    }
 
    res.writeHead(200);
    res.end(pageHTML);
  });
}).listen(8337);
