var fs = require('fs');

//Convertendo binario em arquivo
function base64_decode(base64str,fileName){
  var bitmap = new Buffer (base64str, 'base64');
  fs.writeFileSync('src/temp/'+fileName+'',bitmap, 'binary');
}

//Convertendo arquivo em binário
function base64_encode(fileName){
  var bitmap = fs.readFileSync('src/temp/'+fileName+'');
  return new Buffer (bitmap).toString('base64');
}