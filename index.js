var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/car_garage.db');
const bodyParser = require('body-parser');

var express = require('express');
var restapi = express();

restapi.use(bodyParser.urlencoded({ extended: false }));
restapi.use(bodyParser.json());

restapi.get('/users', function(req, res){
    db.all("SELECT * FROM users", function(err, rows){
        res.json({ "users" : rows });
    });
});

restapi.get('/cars', function(req, res){
    db.all("SELECT * FROM cars", function(err, rows){
        res.json({ "cars" : rows });
    });
});

restapi.get('/inspections', function(req, res){
    db.all("SELECT * FROM inspections", function(err, rows){
        res.json({ "inspections" : rows });
    });
});


restapi.get('/inspectionsByCar/:carId', function(req, res){
    db.all("select cars.brand, cars.model, inspections.dateTimestamp, inspections.km from cars left join inspections on inspections.carId = cars.id where cars.id = ?",
	    req.params.carId, function(err, rows){
        res.json({ "inspectionsByCar" : rows });
    });
});

restapi.get('/inspectionsByUsername/:userId', function(req, res){
    db.all("select users.username, cars.brand, cars.model, inspections.dateTimestamp, inspections.km from users JOIN cars on cars.userId = users.id JOIN inspections on inspections.carId = cars.id where users.username = ?",
            req.params.userId, function(err, rows){
        res.json({ "inspectionsByUsername" : rows });
    });
});

restapi.post('/users', function (req, res) {
  var username = req.body.username;
  var passwrd = req.body.passwrd;  
  var email = req.body.email;
  var params = [username, passwrd, email]
  db.run("INSERT INTO users (username, passwrd, email) VALUES (?, ?, ?)",
  params, function (error, results, fields) {
    if (error) {
        res.status(500);
        console.log(error);
        res.end("Incorrect format. Need username, passwrd y email");
    }
    else{
       res.status(202);
       console.log("Row '" + params + "' inserted."); // Auto increment id
       res.end("Row inserted successfully");
    }
  });
});

restapi.post('/cars', function (req, res) {
  var userId = req.body.userId;
  var brand = req.body.brand;
  var model = req.body.model;
  var params = [userId, brand, model]
  db.run("INSERT INTO cars (userId, brand, model) VALUES (?, ?, ?)",
  params, function (error, results, fields) {
    if (error) {
	res.status(500);
    	console.log(error);
	res.end("Incorrect format. Need userId, brand and model");
    }
    else{
       res.status(202);
       console.log("Row '" + params + "' inserted."); // Auto increment id
       res.end("Row inserted successfully");
    }
  });
});

restapi.post('/inspections', function (req, res) {
  var carId = req.body.carId;
  var dateTimestamp = req.body.dateTimestamp;
  var km = req.body.km;
  var params = [carId, dateTimestamp, km]
  db.run("INSERT INTO inspections (carId, dateTimestamp, km) VALUES (?, ?, ?)",
  params, function (error, results, fields) {
    if (error) {
        res.status(500);
        console.log(error);
        res.end("Incorrect format. Need carId, dateTimestamp and km");
    }
    else{
       res.status(202);
       console.log("Row '" + params + "' inserted."); // Auto increment id
       res.end("Row inserted successfully");
    }
  });
});

restapi.listen(3000);

console.log("Server lintening on port 3000");
