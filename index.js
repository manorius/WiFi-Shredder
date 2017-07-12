var printer = require("printer");
var util = require("util");

var five = require("johnny-five");
var child_process = require('child_process');
var app   = require('express')(); // Express App include
var http = require('http').Server(app); // http server
var bodyParser = require("body-parser"); // Body parser for fetch posted data

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

// REMOVE ALL QUEUED PRINT JOBS 
/*child_process.execFile('/usr/bin/cancel', ['-a', '-'], function(err, result) {
    console.log(result)
});*/

var faces = require('./faces');

fs = require('fs'),
path = require('path'),
filename = "26am.jpg"

var imageData;

filename = path.resolve(process.cwd(), filename);

var fNo = 0;
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
    "orientation-requested": 6,"media": "Custom.21x9cm","cpi": 3,"lpi": 1}]



function printLine(txt, printOptions, type) {
    printer.printDirect({
        data: txt /*+" Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum"*/ // or simple String: "some text"
        //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
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

// SERVER COMMUNICATION
app.post('/',function(req,res){
 res.send('received');
    //rate = parseInt(req.query.rate,10);
var ssid = req.body.SSID;
console.log(ssid+" "+SSIDs.indexOf(ssid));
    if( ssid!="" && previousSSID!=ssid /*&& SSIDs.indexOf(ssid)==-1*/ ) {
        
        previousSSID = ssid;
        SSIDs.push(previousSSID);

    // TRACE RESULTS
        ssid = ( ssid.length > 23 )? ssid.substr(0,23):new Array(Math.floor((23-ssid.length)*0.5)).join(' ')+ssid;
       // var mac  = req.body.mac; mac  = new Array(Math.floor((23-mac.length)*0.5)).join(' ')+mac;
        var face = faces.face[Math.round(Math.random() * faces.face.length)]; face = new Array(Math.floor((23-face.length)*0.5)).join(' ')+face;
    
        // FINAL OUTPUT
        var trace = "\n"+face+/*"\n"+mac+*/"\n"+ssid+"\n";
       console.log(trace);

  printLine(trace, printOptions[2], "TEXT");
    }


//    console.log(req.query.address);
    //echo -e "\aHello, world!" > /dev/usb/lp1
    

});

port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port)

/*
// PRINTING IMAGES
fs.readFile(filename, function(err, data){
  if(err) {
    console.error('err:' + err);
    return;
  }
  imageData = data;
  //console.log('data type is: '+typeof(data) + ', is buffer: ' + Buffer.isBuffer(data));
printLine(imageData,printOptions[1]);
});*/

var p = printer.getPrinter("EPSON_LQ_590");

console.log(p.options['printer-state'] /*printer.correctPrinterinfo(p)*/ /*printer.getPrinterDriverOptions("EPSON_LQ_590")*/ );
// setInterval(function() {
//    printLine(faces.face[Math.round(Math.random() * faces.face.length)]+/*SSID*/ " --> MANCRIS s000sd sdd s", printOptions[2], "TEXT")
// }, 10000);
//printLine("                   "+faces.face[Math.round(Math.random() * faces.face.length)], {"orientation-requested": 6,"media": "Custom.21x6cm","cpi": 5,"lpi": 1}, "TEXT")

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
    setInterval(function(){
relay.write(1);
                        // STOP SHREDER IN 11SEC
                        setTimeout(function() {
                            relay.write(0)
                        }, 10000);


    },5000);
//     sensor.scale(0, 1023).on("change", function() {

//         sensorValue = this.value;
// //console.log(sensorValue);
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
