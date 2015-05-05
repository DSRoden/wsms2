'use strict';

var Promise = require('bluebird');
var twilio = require('twilio');
var twilio_client = new twilio.RestClient(process.env.accountSID, process.env.authToken);
var twilio_post = Promise.promisify(twilio_client.sms.messages.post);


var User = require('../models/user');

exports.questionnaire = function(req, res){
	User.questionnaire(req.body, function(reply){
		console.log('reply>>>>>>>>>>', reply);
		var from = req.body.From;
		return twilio_post({
	          to: from,
	          from: '+18452336666',
	          body: reply
	        }).then(function(message) {
	            console.log('Success sent');
	            console.log(message);
	        });
   });
};

