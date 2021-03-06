/*jshint node:true*/


var express = require('express'),
    cfenv = require('cfenv'),
    app = express(),
    appEnv = cfenv.getAppEnv(),
	mongo = require('mongodb').MongoClient,
	server,
	mongoUrl,
	services = appEnv.services,
	db,
	bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	users = require('./controllers/users.js');

	//default mongo connection
	// if(services['mongodb-2.4']){
	// 	mongoUrl = services['mongodb-2.4'][0].credentials.url;
	// }

	//mongo lab service connection 
	if(services['mongolab']){
		mongoUrl = services['mongolab'][0].credentials.uri;
	}

	//connect to mongo
	mongo.connect(mongoUrl, function(err, db){
		if(err){ 
			console.log('failed to connect to db>>>>>>', err);
		} else {
			global.mongodb = db;
		}
	});

	app.post('/receive', users.incoming);
	
app.listen(appEnv.port || 3000, appEnv.bind || 'localhost', function() {
	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

