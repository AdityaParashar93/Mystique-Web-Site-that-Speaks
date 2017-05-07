/**

 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require('./mongo');
var mongoURL = "mongodb://54.183.4.162:27017/Mystique";

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {
    	console.log(username+"\t"+password);
    	mongo.connect(mongoURL,function(){
    		console.log("Connected to mongo at:"+mongoURL);
    		var coll=mongo.collection('Mystique');
    		
    		process.nextTick(function(){
    			coll.aggregate(
    					{$match:{doctype:"users"}},
    					{$unwind:"$users"},
    					{$match:{"users.user_email":username,
    						"users.user_password":password}},function(err,user){ 
    			if(err) {
                    return done(err);
                }

    			else if(!user) {
                    return done(null, false);
                }

    			else {
    				console.log(user.cx_display);
    				console.log(user.cx_email);
    				return done(null, user);
    			}
    		});
    		});
    	});
    }));
};

       /* mongo.connect(loginDatabase, function(connection) {

            var loginCollection = mongo.connectToCollection('userinfo', connection);
            var whereParams = {
                username:username,
                password:password
            }

            process.nextTick(function(){
                loginCollection.findOne(whereParams, function(error, user) {

                    if(error) {
                        return done(err);
                    }

                    if(!user) {
                        return done(null, false);
                    }

                    if(user.password != password) {
                        done(null, false);
                    }

                    connection.close();
                    console.log(user.username);
                    done(null, user);
                });
            });
        });
    }));*/


