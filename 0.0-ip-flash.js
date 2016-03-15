"use strict";

var Gpio = require('onoff').Gpio, // Constructor function for Gpio objects.
  led = new Gpio(21, 'out');         // Export GPIO #14 as an output.


var os = require('os');
var ifaces = os.networkInterfaces();
var ipNumbers = []; 
var flashCount = 10; 

Object.keys(ifaces).forEach(function (ifname) {
	var alias = 0;

	ifaces[ifname].forEach(function (iface) {
		if ('IPv4' !== iface.family || iface.internal !== false) {
			// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
			return;
		}

		if (alias >= 1) {
			// this single interface has multiple ipv4 addresses
			console.log("multiple ipv4 addresses"); 
			console.log(ifname + ':' + alias, iface.address);
		} else {
			// this interface has only one ipv4 adress
			console.log("single ipv4 addresses"); 
			console.log(ifname, iface.address);
			console.log(iface);
			ipNumbers = iface.address.split('.');
			startBlink();  
		}
		++alias;
	});
});


function startBlink() { 
	if(flashCount<=0) { 
		led.unexport(); 
	} else {
		flashCount--; 
		blink(ipNumbers[3] * 2); 
	}

}


// Toggle the state of the LED on GPIO #14 every 200ms 'count' times.
// Here asynchronous methods are used. Synchronous methods are also available.



function blink(count) {
  if (count <= 0) {

	setTimeout(startBlink, 1000); 
	return;
    //return led.unexport();
  }

  led.read(function (err, value) { // Asynchronous read.
    if (err) {
      throw err;
    }

    led.write(value ^ 1, function (err) { // Asynchronous write.
      if (err) {
        throw err;
      }
    });
  });

  setTimeout(function () {
    blink(count - 1);
  }, 300);
}