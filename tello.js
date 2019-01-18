console.log("Let's program the Tello!");

const dgram = require('dgram');
const tello = dgram.createSocket('udp4');

var PORT = 8889;
var VIDEO_PORT = 11111;
var HOST =  '192.168.10.1';


function sendCommand(command_message){
  var command = new Buffer(command_message);
  tello.send(command, 0, command.length, PORT, HOST, function(err, bytes){
    if(err) throw err;
  });
}

tello.on('error', (err) => {
  console.log(`tello error:\n${err.stack}`);
  tello.close();
});

tello.on('message', (msg, rinfo) => {
  console.log(`got: ${msg}`);
});

tello.on('listening', () => {
  const address = tello.address();
  console.log(`tello listening ${address.address}:${address.port}`);
});

tello.bind(PORT);

var command_message = new Buffer('command');
var battery_message = new Buffer('battery?');

sendCommand'command');
console.log("Tello battery level")
sendCommand('battery?');

process.on('uncaughtException', () => tello.close())

// Command Lne Application
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

var video = null;
var video_stream = ""
rl.setPrompt('');
rl.prompt();
rl.on('line', function(line) {
    if (line === "close") rl.close();
    else if (line === 'streamon'){
    
      video = dgram.createSocket("udp4");
      video.on('message', (msg, rinfo) => {
        video_stream = video_stream + msg;
      });
      video.on('listening', () => {
        const address = video.address();
        console.log(`video listening ${address.address}:${address.port}`);
      });
      video.bind(VIDEO_PORT);
    
    } else if (line === 'streamoff'){
      console.log('recorded video stream')
      video.close();
    }

    sendCommand(line);
    rl.prompt();
}).on('close',function(){
    tello.close();
    process.exit(0);
});

var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function(key){

  if (key == '\u001B\u005B\u0041') {
      process.stdout.write('up\n'); 
  }
  if (key == '\u001B\u005B\u0043') {
      process.stdout.write('right\n'); 
  }
  if (key == '\u001B\u005B\u0042') {
      process.stdout.write('down\n'); 
  }
  if (key == '\u001B\u005B\u0044') {
      process.stdout.write('left\n'); 
  }

  if (key == '\u0003') { process.exit(); }    // ctrl-c
});

