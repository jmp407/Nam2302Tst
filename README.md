node-am2302
===========

A working repository for testing this module for node.js.
This is a wrapped version of am2302.cc using node.gyp
It also requires wiringPi.
I wanted to make it work with googlecreativelab/coder but have not 
been successful yet.

jmp

Script descriptions:
  test4.js //tried this in coder but kept hanging, but it does read
    the DHT22 when node is run as root on the console.

Useful Raspberry Pi console commands:
  # cat /proc/meminfo
    MemTotal:         234968 kB
    MemFree:           56840 kB
    ..

How to log data to a file:
  http://stackoverflow.com/questions/2496710/writing-files-in-nodejs  and scroll down for links to node.js
    
