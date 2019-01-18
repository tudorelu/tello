
/*
  var stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  stdin.on('data', function(key){
    if (key == '\u001B\u005B\u0041') {
        process.stdout.write('up\n'); 
    }
    else if (key == '\u001B\u005B\u0043') {
        process.stdout.write('right\n'); 
    }
    else if (key == '\u001B\u005B\u0042') {
        process.stdout.write('down\n'); 
    }
    else if (key == '\u001B\u005B\u0044') {
        process.stdout.write('left\n'); 
    }
    else if (key == '\u0003') { process.exit(); }    // ctrl-c
  });
*/

/*


const dgram = require('dgram');

class Tello {
  
  constructor() {
    console.log("Let's program the Tello!");
    this.tello_port = 8889;
    this.video_port = 11111;
    this.host =  '192.168.10.1';

    this.tello_socket = null;
    this.video_socket = null;
    this.video_stream = "";

  }
  
  initCommandStream(){

    this.tello_socket = dgram.createSocket('udp4');

    this.tello_socket.on('error', (err) => {
      console.log(`tello error:\n${err.stack}`);
      this.tello_socket.close();
    });

    this.tello_socket.on('message', (msg, rinfo) => {
      console.log(`got: ${msg}`);
    });

    this.tello_socket.on('listening', () => {
      const address = this.tello_socket.address();
      console.log(`tello listening ${address.address}:${address.port}`);
    });

    this.tello_socket.bind(this.tello_port);
  }

  startVideoStream(){

    this.video_socket = dgram.createSocket('udp4');
    
    this.video_socket.on('message', (msg, rinfo) => {
      this.video_stream = this.video_stream + msg;
    });

    this.video_socket.on('listening', () => {
      const address = this.video_socket.address();
      console.log(`video listening ${address.address}:${address.port}`);
    });
  
    this.video_socket.bind(this.video_port);    
  }
  
  sendCommand(command_message){
    var command = new Buffer(command_message);
    this.tello_socket.send(command, 0, command.length, this.tello_port, this.host, function(err, bytes){
      if(err) throw err;
    });
  }
  
  start(){

    this.initCommandStream();

    // Sends the Initialisation command and requests battery level
    this.sendCommand('command');
    this.sendCommand('battery?');

    var readline = require('readline');
    var rl = readline.createInterface(process.stdin, process.stdout);


    let that = this;
    rl.setPrompt('');
    rl.prompt();
    rl.on('line', function(line) {
    
      if (line === "close") rl.close();
      else if (line === 'streamon') that.startVideoStream()
      else if (line === 'streamoff'){
        console.log('recorded video stream')
        that.video_socket.close();
      }

      that.sendCommand(line);
      rl.prompt();
      })
    .on('close',function(){
      this.tello_socket.close();
      process.exit(0);
    });
  }
}

var drone = new Tello();

drone.start()

process.on('uncaughtException', () => drone.tello_socket.close())  
*/