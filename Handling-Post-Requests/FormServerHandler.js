var http = require('http');
var splitter = require('./splitter.js');
 
var postHTML =

  '<html><head><title>Post Set Point Example</title></head>' +
  '<body>' +
/*
  '<form method="post">' +
  'Your Fist Name: <input name="first_name"><br>' +
  'Your Last Name: <input name="last_name"><br>' +
  '<input type="submit">' +
  '</form>' +
*/
//  '<form action="http://10.0.0.4:8337/" method="POST">' + Don't need the action....
  '<form method="POST">' +
  'Set Point: <input type="text" name="SetPoint" value=70.0><br>' +
  'Plant on/off: <input type="text" name="PonOff" value="off"><br>' +
  '<input type="submit" value="Send">' +
  '</form>' +
  '</body></html>';

 
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
 
         res.writeHead(200);
         res.write(postHTML);
         res.write('The set point and relay position is ' + hash["SetPoint"] + ', ' + hash["PonOff"] + '.');
         res.end('Thats all folks');
         return;
    }
 
    res.writeHead(200);
    res.end(postHTML);
  });
}).listen(8337);
