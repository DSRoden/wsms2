'use strict';

var bluemix = require('../config/bluemix'),
  	watson = require('watson-developer-cloud'),
  	extend = require('util')._extend;
  	//dummy_text = require('../mobydick.txt');

    
// if bluemix credentials exists, then override local
var credentials = extend({
    version: 'v2',
    url: '<url>',
    username: '<username>',
    password: '<password>'
}, bluemix.getServiceCreds('personality_insights')); // VCAP_SERVICES


var personalityInsights = new watson.personality_insights(credentials);


function User(o){
	this.number = o.From;
	this.insights = {}; 
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});


User.questionnaire = function(body, cb){
	// console.log('body from user.questionnaire>>>>>>>>>>>', body);
	var from = body.From;
	// console.log('from >>>>>>>>>>>>>>>>>', from);
	 var reply;

	// User.collection.find().toArray(function(err, response){
	// 	console.log('response', response);
	// 	cb();
	// });

	User.collection.findOne({number: from}, function(err, user){
		//console.log(user);
		console.log('insights object>>>>>>>', user.insights);
		console.log('insights tree>>>>>>>>>>>>>>', user.insights.tree);
		console.log('insights tree children>>>>>>>>>>>>>>>>>>>', user.insights.tree.children);
		console.log('insights personality>>>>>>>>>>>>>>>>>>>>>>>>', user.insights.tree.children[0].children);
		console.log('insights needs>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', user.insights.tree.children[1].children);
		console.log('insights values>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', user.insights.tree.children[2].children);
		cb('checking user object');
	});

	// //User.collection.drop();
	// User.collection.findOne({number: from}, function(err, user){
	//     if(user){
	//     		reply = 'user exists'; 
	//     		var text = "Call me Ishmael. Some years ago-never mind how long precisely-having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the water part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off-then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me. There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs-commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme  downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there.";
	// 			getInsights({text: text}, function(insights){
	// 				user.insights = insights;
	// 				User.collection.save(user, function(){
	// 					cb(reply);
	// 				});
	// 			});	    	 
	//     } else {
	//     	var user = new User(body);
	//     	reply = 'saving new number';
	//     	User.collection.save(user, cb(reply));
	//   	}
 //    });
};



module.exports = User;


//private functions

function getInsights(text, cb){
	personalityInsights.profile(text, function(err, profile) {
    if (err) {
      if (err.message){
        err = { error: err.message };
        console.log('error in getInsights function', err);
      }
      cb ('error');
    }
    else
      cb(profile);
  });
}

