'use strict';

var Message = require('./message.js');

function User(o){
	this.number = o.From;
	this.messagesSent = [];
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});


User.incoming = function(body, cb){
	console.log('body from user.questionnaire>>>>>>>>>>>', body);
	// User.collection.drop();
	
	// console.log('from >>>>>>>>>>>>>>>>>', from);
	var from = body.From,
		reply;

	//show all users
	// User.collection.find().toArray(function(err, response){
	// 	console.log('response', response);
	// 	cb();
	// });
	User.collection.findOne({number: from}, function(err, user){
	    if(user){
	    	Message.type(user, body, function(messageObject){
	    		console.log('oobject returning from message into user', messageObject);
	    		//reply = messageObject.content;
    			cb(messageObject);	    	 
	    	});
	    } else {
	    	var user = new User(body);
	    	User.collection.save(user, function(err, user){
	    		//console.log('user object returned after being saved', user);
	    		Message.type(user, body, function(messageObject){
	    			reply = messageObject.content;
	    			cb(reply);
	    		})
	    	});
	  	}
    });
};



module.exports = User;
