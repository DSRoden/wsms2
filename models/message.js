'use strict';

function Message(o){
	this.senderId = o.senderId;
	this.receiverId = o.receiverId;
	this.content = o.content || 'No content';
	this.liked = false;
	this.created_at = new Date();
}

Object.defineProperty(Message, 'collection', {
  get: function(){return global.mongodb.collection('messages');}
});


Message.type = function(user, body, cb){
	//new message is coming in from a user
	console.log('user sending message', user);
	console.log('body from message', body);
	var incomingMessage = {};
	incomingMessage.senderId = user._id;
	incomingMessage.content = body.Body;
	var newMessage = new Message(incomingMessage);

	//find the previous message
	Message.collection.find().limit(1).sort({$natural:-1}).toArray(function(err, message){
		if(err){
			console.log('error in looking up message collection', err);
			console.log('results of look up when error occured', message);
			cb('error in looking up messages', err)
		}
		receiverId = user._id,
		senderId = message.senderId;
		//take current user id and add it to the message as receiver id
		Message.colection.update({"senderId" : senderId} , {$set: {"receiverId" : receiverId}}, function(){
			//then save the new message
			Message.save(newMessage, function(){
				//then call back with the previous messag object
				cb(previousMessage);
			})
		});
	});
};



module.exports = Message;
