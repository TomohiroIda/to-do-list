var http = require('http');

http.createSerever(function (request, response){
response.writeHead(200, {'Content-Type': 'text/plain'});
respomse.end('Hello World\n');
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');

~                                                                                                                                                                
~                                                                                                                                                                
~                                                     
