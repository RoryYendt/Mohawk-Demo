const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient

var db;

MongoClient.connect('mongodb://rory:mohawk@ds013951.mlab.com:13951/mohawk-demo', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

app.get('/app/patients', (req, res) => {
	var cursor = db.collection('quotes').find().toArray(function(err,results){
		res.send(results);
	});
})

app.get('/app/patient', (req, res) => {
	var query = {cardNumber: req.query.cardNumber};
	db.collection('quotes', function(err, collection){
		collection.findOne(query, function(err, item){
			res.send(item);
		});
	});
})


app.post('/app/patient', (req, res) => {
	req.body._id = req.body.cardNumber;
	console.log(req.body);
	db.collection('quotes').save(req.body, (err, result) => {
		if(err) return console.log(err);
		console.log('Saved to database');
		res.redirect('/');
	})
})
console.log('May Node be with you');