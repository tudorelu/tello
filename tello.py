'''
Updated Tello Command and Video Stream Wrapper

Authored by Tudor Barbulescu

'''
import threading 
import socket
import sys
import time
import platform 

class Tello:

    def __init__(self):
        """ Wrapper For controlling the Tello
        """

        self.local_address = ''
        
        self.tello_address = '192.168.10.1'
        self.command_port = 8889
        self.video_port = 11111 

        # Set up UDP socket for receiving information about drone
        self.command_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.command_socket.bind((self.local_address, 9000))

        # Set up UDP socket for receiving video
        self.video_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.video_socket.bind((self.local_address, 11111))

        self.command_address = (self.tello_address, self.command_port)

        self.receive_command_thread = None
        self.receive_video_thread = None

    def _receive_command_thread(self):
        """ Listen for responses from the Tello. Runs as thread.
        """
        while True:
            try:
                data, ip = self.command_socket.recvfrom(1518)
                print(data.decode(encoding="utf-8"))
            except socket.error as exc:
                print ("Caught exception socket.error : %s" % exc)

    def _receive_video_thread(self):
        """ Listens for video streaming (raw h264) from the Tello. Runs as a thread.
        """
        while True:
            try:
                data, ip = self.video_socket.recvfrom(2048)
                print (data)
            except socket.error as exc:
                print ("Caught exception socket.error : %s" % exc)

    def _start_command_thread(self):
        """ Starts the command thread if it's not already running
        """
        if self.receive_command_thread is None or self.receive_command_thread.Event().is_set():
            self.receive_command_thread = threading.Thread(target=self._receive_command_thread)
            self.receive_command_thread.daemon = True
            self.receive_command_thread.start()

    def _start_video_thread(self):
        """ Starts the video thread if it's not already running
        """
        if self.receive_video_thread is None or self.receive_video_thread.Event().is_set():
            self.receive_video_thread = threading.Thread(target=self._receive_video_thread)
            self.receive_video_thread.daemon = True
            self.receive_video_thread.start()
            
    def start(self):
        """ Starts ability to send commands to drone via command line
        """
        print ('\r\n\r\nTello Python3 Demo.\r\n')
        print ('Tello: command takeoff land flip forward back left right \r\n       up down cw ccw speed speed?\r\n')
        print ('end -- quit demo.\r\n')

        self._start_command_thread()
        
        while True: 
            try:
                # Find python version number
                python_version = int(str(platform.python_version()).partition('.')[0])
                msg = input("") if python_version == 3 else raw_input("");

                if not msg: 
                    break

                if msg == 'streamon':
                    self._start_video_thread()

                if 'end' in msg:
                    print ('...')
                    self.command_socket.close() 
                    self.video_socket.close()  
                    break

                # Send data
                msg = msg.encode(encoding="utf-8") 
                sent = self.command_socket.sendto(msg, self.command_address)

            except KeyboardInterrupt:
                print ('\n . . .\n')
                self.command_socket.close()
                self.video_socket.close()  
                break

def Main():
    drone = Tello()
    drone.start()

if __name__ == '__main__':
    Main()