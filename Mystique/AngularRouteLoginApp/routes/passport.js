/**

 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require('./mongo');
var mongoURL = "mongodb://13.56.16.227:27017/SpartanUnited";

module.exports = function(passport) {
	console.log("hey call is here at passportjs");
    passport.use('login', new LocalStrategy(function(username, password, done) {
    	console.log(username+"\t"+password);
    	mongo.connect(mongoURL,function(){
    		console.log("Connected to mongo at:"+mongoURL);
    		var coll=mongo.collection('userinfo');
    		
    		process.nextTick(function(){
    			coll.findOne({cx_email:username,cx_password:password},function(err,user){
 
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


