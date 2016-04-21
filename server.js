const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient

var db;

MongoClient.connect('mongodb://rory:mohawk@ds013951.mlab.com:13951/mohawk-demo', (err, database) => {//Connects to mongodb database hosted on mongolabs
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {//Sends the main page to the client
	res.sendFile(__dirname + '/index.html');
})

app.get('/app/patients', (req, res) => {//Retrieve all patients
	var cursor = db.collection('quotes').find().toArray(function(err,results){
		res.send(results);
	});
})

app.get('/app/patient', (req, res) => {//Retrieve single patient
	var query = {cardNumber: req.query.cardNumber};
	db.collection('quotes', function(err, collection){
		collection.findOne(query, function(err, item){
			res.send(item);
		});
	});
})


app.post('/app/patient', (req, res) => {//Submit single patient
	req.body._id = req.body.cardNumber;
	db.collection('quotes').save(req.body, (err, result) => {
		if(err) return console.log(err);
		console.log('Saved to database');
		res.redirect('/');
	})
})
console.log('Running');