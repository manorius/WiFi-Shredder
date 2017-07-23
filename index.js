// Lines 2-8 loading Dependancies most importantly printer, johnny-five and express that control the Dot matrix printer, arduino and server respectively
var printer = require("printer");
var util = require("util");
var five = require("johnny-five");
var child_process = require('child_process');
var app = require('express')(); // Express App include
var http = require('http').Server(app); // http server
var bodyParser = require("body-parser"); // Body parser for fetch posted data

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json()); // Body parser use JSON data

// Line 15 The external file 'faces' containes Kaomojis or Japanese emoticons that are displayed along with the name of the discovered SSID name
var faces = require('./faces');

fs = require('fs'),
    path = require('path'),
    filename = ""

var imageData;

filename = path.resolve(process.cwd(), filename);

var fNo = 0;

// Lines 29-43 Is the configuration of the dotmatric printer
var printOptions = [{
    "orientation-requested": 6,
    "media": "Custom.21x2cm",
    "cpi": 10,
    "lpi": 4
}, {
    "orientation-requested": 6,
    "media": "Custom.21x4cm",
    "ppi": 300
}, {
    "orientation-requested": 6,
    "media": "Custom.21x9cm",
    "cpi": 3,
    "lpi": 1
}]


// Lines 47 - 61 Is the Function that prints the stuff send to the printer
function printLine(txt, printOptions, type) {
    printer.printDirect({
        data: txt // or simple String: "some text"
            ,
        type: type // type: RAW, TEXT, PDF, JPEG, .. depends on platform
            ,
        options: printOptions,
        success: function(jobID) {
            console.log("sent to printer with ID: " + jobID);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

var previousSSID = "";
var SSIDs = [];

// Lines 68 - 91 Receives the captured data from the WiFi antenna, traces it and then sends it to the printer
// SERVER COMMUNICATION
app.post('/', function(req, res) {
    res.send('received');

    var ssid = req.body.SSID;
    console.log(ssid + " " + SSIDs.indexOf(ssid));
    if (ssid != "" && previousSSID != ssid) {

        previousSSID = ssid;
        SSIDs.push(previousSSID);

        // TRACE RESULTS
        ssid = (ssid.length > 23) ? ssid.substr(0, 23) : new Array(Math.floor((23 - ssid.length) * 0.5)).join(' ') + ssid;
        var face = faces.face[Math.round(Math.random() * faces.face.length)];
        face = new Array(Math.floor((23 - face.length) * 0.5)).join(' ') + face;

        // FINAL OUTPUT
        var trace = "\n" + face + "\n" + ssid + "\n";
        console.log(trace);

        printLine(trace, printOptions[2], "TEXT");
    }


});

port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port)

var p = printer.getPrinter("EPSON_LQ_590");

console.log(p.options['printer-state'];

// HERE STARTS THE ARDUINO CODE THAT DETECTS THE PRINTING RATE AND TURNS THE SHREDDING MACHINE ON AND OFF   
        var board = new five.Board();

        var sensorValue = 0;
        var highValue = 0;
        var lowValue = 0;
        var holes = 0;
        var lastDebounceTime = 0; // the last time the output pin was toggled
        var debounceDelay = 50; // the debounce time; increase if the output flickers

        board.on("ready", function() {

            var relay = new five.Pin(13);
            setTimeout(function() {
                relay.write(0)
            }, 1000);


            var sensor = new five.Sensor("A0");
            
            // IF THE PRINTING RATE IS TOO HIGH YOU CAN ALSO USE A SIMPLE INTERVAL FOR TURNING THE SHREDDING MACHINE ON AND OFF  
            setInterval(function() {
                relay.write(1);
                // STOP SHREDER IN 11SEC
                setTimeout(function() {
                    relay.write(0)
                }, 10000);


            }, 5000);

            // ELSE USE THE CODE BELLOW TO COUNT THE PAPER HOLES PASSED THROUGH THE INFRARED DETECTOR IN ORDER TO TURN THE 
            // SHREDDING MACHINE ON AND OFF

            //     sensor.scale(0, 1023).on("change", function() {

            //         sensorValue = this.value;
            //         console.log(sensorValue);
            //         
            //         if (sensorValue > 300) {

            //             highValue++;
            //             lowValue = 0;
            //             lastDebounceTime = new Date().getMilliseconds();
            //         } else if (sensorValue < 300) {

            //             if ((new Date().getMilliseconds() - lastDebounceTime) > debounceDelay) {
            //                 if (lowValue == 0) {
            //                     // ADD A HOLE
            //                     holes++;
            //                     console.log(holes+" -  modulo 10 >"+holes % 10);
            //                     // ACTIVATE THE SHREDER EVERY 10 HOLES
            //                     // IT SHREDS APROXIMATELY 14 HOLES PER 3 SEC APROX 5 HOLE EVERY 1 SEC

            //                     /*if (holes % 6 == 0) {
            //                         // START SHREDER
            //                         relay.write(1);
            //                         // STOP SHREDER IN 11SEC
            //                         setTimeout(function() {
            //                             relay.write(0)
            //                         }, 2000);

            //                     }
            // */
            //                 }
            //                 lowValue++;
            //                 highValue = 0;
            //             }
            //         }

            //     });
        })