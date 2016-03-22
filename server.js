/* 
 * Simple Node.js API
 */

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var fs = require("fs");




app.get('/listTasks', function (req, res) {
   fs.readFile( __dirname + "/" + "tasks.json", 'utf8', function (err, data) {
       //console.log( data );
       res.setHeader('Content-Type', 'application/json');
       res.write( data );
       res.end();
   });
  
});

app.post('/createTask', function(req, res) {
    
    var tasks = require(__dirname + "/" + "tasks.json");
    
    var taskName = req.body.taskName; // get post parameter Name
    tasks[taskName] = false; // add it to JSON
    
    //console.log(taskName);
    
    var tasksJSON = JSON.stringify(tasks);
    
    fs.writeFile( __dirname + "/" + "tasks.json" , tasksJSON, function (err) {
      console.log(err);
    });

    res.status(200);
    res.send("done");
});

app.post('/completeTask', function(req, res) {
    
    var tasks = require(__dirname + "/" + "tasks.json");
    
    var taskName = req.body.taskName; // get post parameter Name
     
    if ( tasks.hasOwnProperty(taskName) ){ // if task exist
        
        tasks[taskName] = true; // update object
    
        var tasksJSON = JSON.stringify(tasks);

        fs.writeFile( __dirname + "/" + "tasks.json" , tasksJSON, function (err) {
          console.log(err);
        });
        
        res.send("Completed");
        
    } else {
        
        res.send("Task doesn't exist");
    }
});


var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  //console.log("Example app listening at http://%s:%s", host, port);

});



fs.readFile( __dirname + "/" + "public/index.html", function (err, html) {
    if (err) {
        throw err; 
    }
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8082);
    
});