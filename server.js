const rpio = require('rpio');

var pin = 12;
rpio.open(pin, rpio.OUTPUT, rpio.LOW);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function onoff() {
    while (true) {
        console.log("On");
      /* On for 1 second */
      rpio.write(pin, rpio.HIGH);
      await sleep(1000);
    
      console.log("Off");
      /* Off for half a second (500ms) */
      rpio.write(pin, rpio.LOW);
      await sleep(1000);
    }
}

//onoff();

var range = 1024;       /* LEDs can quickly hit max brightness, so only use */
var max = 128;          /*   the bottom 8th of a larger scale */
var clockdiv = 8;       /* Clock divider (PWM refresh rate), 8 == 2.4MHz */
var interval = 5;       /* setInterval timer, speed of pulses */
var times = 5;          /* How many times to pulse before exiting */

/*
 * Enable PWM on the chosen pin and set the clock and range.
 */
var options = {
    gpiomem: false          /* Use /dev/gpiomem */
};
rpio.init(options);
rpio.open(pin, rpio.PWM);
rpio.pwmSetClockDivider(clockdiv);
rpio.pwmSetRange(pin, range);

/*
 * Repeatedly pulse from low to high and back again until times runs out.
 */
var direction = 1;
var data = 0;
var pulse = setInterval(function() {
        rpio.pwmSetData(pin, data);
        if (data === 0) {
                direction = 1;
                // if (times-- === 0) {
                //         clearInterval(pulse);
                //         rpio.open(pin, rpio.INPUT);
                //         return;
                // }
        } else if (data === max) {
                direction = -1;
        }
        data += direction;
}, interval, data, direction, times);