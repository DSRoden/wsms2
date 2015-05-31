'use strict';

function Message(o){

}

Object.defineProperty(Message, 'collection', {
  get: function(){return global.mongodb.collection('messages');}
});


Message.type = function(user, body, cb){
	console.log('body from user.questionnaire>>>>>>>>>>>', body);
	// User.collection.drop();
	
	// console.log('from >>>>>>>>>>>>>>>>>', from);
	var from = body.From;
	var reply = 'coming back from message.type function';
	cb(reply);
};



module.exports = Message;
