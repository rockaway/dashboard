/**
 * Index.js
 * This is the demo server 
 *
 * @license GPL-3.0, https://opensource.org/licenses/GPL-3.0
 * @author  Lok Kek Wee
 */
var fs = require('fs');
// file is included here:
eval(fs.readFileSync('./demo/js/widget.js')+'');
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.use('/static',express.static(__dirname + '/static'));
app.use('/demo',express.static(__dirname + '/demo'));

io.on('connection', function(socket){
  console.log(new Date().toUTCString()+': New client connected (id=' + socket.id + ').');
  //console.log(socket);
  clients.push(socket);
  //When submit event arrives
  socket.on('submit', function(message){
    console.log(new Date().toUTCString()+': data received: '+message);
    try {
      var w = new Widget(JSON.parse(message));
      console.log(w);
      io.emit('widget', w);
      
    } catch (e) {
      console.log(e);
      io.emit('widget', new Widget({"type":WIDGET_ALERT,"data":{"message":e.message}}));
    }    
	
  });
  
  // When socket disconnects, remove it from the list:
  socket.on('disconnect', function() {
     var index = clients.indexOf(socket);
     if (index != -1) {
        clients.splice(index, 1);
        console.info(new Date().toUTCString()+': Client disconnected (id=' + socket.id + ').');
     }
   });
   
});

//Every 10 second, sends a message to a random client:
//var timer = setInterval(function() {
//    var randomClient;
//    if (clients.length > 0) {
//        randomClient = Math.floor(Math.random() * clients.length);
//        var autogenMesssage = 'AUTO GENERATED MESSAGE '+new Date().toUTCString();
//        console.log(autogenMesssage);
//        clients[randomClient].emit('widget', new Widget({"type":WIDGET_ALERT,"data":{"message":autogenMesssage}}) );
//        clients[randomClient].emit('widget', new Widget({"type":WIDGET_PIECHART,"data":[{"key":"Cat1","value":randomNumber(10)},{"key":"Cat2","value":randomNumber(20)},{"key":"Cat3","value":randomNumber(30)}]}) );
//    }
//}, 10000);
/* later */
//clearInterval(timer);

app.get('/example/pieChart', function(req, res){
  res.sendfile('pieChart.html');
});
app.get('/example/barChart', function(req, res){
  res.sendfile('barChart.html');
});
app.get('/example/svgBarchart', function(req, res){
  res.sendfile('svgBarChart.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

