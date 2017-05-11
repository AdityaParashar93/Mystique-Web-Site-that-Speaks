var winston = require('winston');
var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://54.183.4.162:27017/Mystique";
var bcrypt = require('bcrypt');
const saltRounds = 10;

exports.handle_register_request=function(msg,callback){
	var res={};
	var json_responces;
	mongo.connect(mongoURL,function(connection){
		var coll=mongo.collection('Mystique');
		process.nextTick(function(){
			coll.update({doctype:"users"},
					{$push:{users:{first_name:msg.first_name,
						last_name:msg.last_name,
						user_email:msg.email,
						user_password:msg.password,
						contact_number:"",
						address:"",
						cc_number:"",
						cc_type:"",
						cc_expiry:"",
						orders:[],
						subscription_orders:[],
						cart:[]}}},function(err,user)
			{

				if(err) {
					connection.close();
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else {
					connection.close();
					res.json_responses={"statusCode":200,"user":user};
					callback(null, res);
				}
		});
		});
	});
}


exports.handle_request_checkLogin = function(msg, callback){
	var res={};
	var json_responses;
	console.log(msg);
	mongo.connect(mongoURL,function(connection){
		var coll=mongo.collection('Mystique');
		process.nextTick(function(){
			coll.findOne({doctype:"users"},{users:{$elemMatch:{
				user_email:msg.username,
				}}},function(err,user)
			{
				if(err) {
					connection.close();
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }
				else {
					console.log(user);
					if(bcrypt.compareSync(msg.password,user.users[0].user_password)){
						connection.close();
						res.json_responses={"statusCode":200,user:user.users[0]};
						callback(null, res);
					}
					else{
						connection.close();
						res.json_responses={"statusCode":405};
						callback(null, res);
					}
				}
		});
		});
	});
};
exports.handle_request_checkLogin_fetch = function(msg, callback){
	var res={};
	var json_responses;
	mongo.connect(mongoURL,function(connection){
		console.log(msg.username);
		var coll=mongo.collection('Mystique');
		process.nextTick(function(){
			coll.findOne({doctype:"users"},{users:{$elemMatch:{
				user_email:msg.username,
				}}},function(err,user)
			{
				if(err) {
					connection.close();
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }
				else {
						connection.close();
						console.log(user);
						res.json_responses={"statusCode":200,user:user.users[0]};
						callback(null, res);
				}
		});
		});
	});
};
exports.handle_fetchproducts_all=function(msg,callback){
	var res={};
	var json_responses;
	console.log("call is here");
	mongo.connect(mongoURL,function(connection){
		var coll=mongo.collection('Mystique');	
		process.nextTick(function(){
			coll.findOne({doctype:"products"},function(err,user)
			{

				if(err) {
					connection.close();
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }
				else {
					connection.close();
					console.log("response send");
					res.json_responses={"statusCode":200,"products":user.products};
					callback(null, res);
				}
		});
		});
	});
	
}
exports.handle_fetchproducts=function(msg,callback){
	var res={};
	var json_responses;
	mongo.connect(mongoURL,function(connection){
		var coll=mongo.collection('Mystique');
		process.nextTick(function(){
			coll.aggregate([
				{$match:{"doctype":"products"}},
				{$unwind:"$products"},
				{$match:{"products.productcategory":msg.category}},
				{$group:{_id:null,"products":{$push:"$products"}}}
				],function(err,user){
				if(err) {
					connection.close();
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }
				else {
					connection.close();
					res.json_responses={"statusCode":200,"products":user};
					callback(null, res);
				}
		});
		});
	});
}


exports.handle_add_to_cart=function(msg,callback){
	var res={};
	var json_responses;
	mongo.connect(mongoURL,function(connection){
		var coll=mongo.collection('Mystique');
		process.nextTick(function(){
			coll.update({ doctype: "users", "users.user_email":msg.username},
			{ "$push": { 'users.$.cart': msg.product } }
			,function(err,user){
				if(err) {
					connection.close();
					console.log(err);
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					console.log("did not find");
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }
				else {
					console.log(user);
					coll.findOne({doctype:"users"},{users:{$elemMatch:{
						user_email:msg.username,
						}}},function(err,user)
					{
						if(err) {
							connection.close();
							res.json_responses={"statusCode":401};
							callback(null, res);
			            }

						else if(!user) {
							connection.close();
							res.json_responses={"statusCode":405};
							callback(null, res);
			            }
						else {
								connection.close();
								res.json_responses={"statusCode":200,user:user.users[0]};
								callback(null, res);
						}
				});
				}
		});
		});
	});
}


exports.handle_remove_from_cart=function(msg,callback){
	var res={};
	var json_responses;
	mongo.connect(mongoURL,function(connection){
		var coll=mongo.collection('Mystique');
		process.nextTick(function(){
			coll.findOneAndUpdate({ doctype: "users", "users.user_email":msg.username},
			{ "$pull": { 'users.$.cart': {"productid":msg.product.productid} } }
			,function(err,user){
				if(err) {
					connection.close();
					console.log(err);
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					console.log("did not find");
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }
				else {
					console.log(user);
					coll.findOne({doctype:"users"},{users:{$elemMatch:{
						user_email:msg.username,
						}}},function(err,user)
					{
						if(err) {
							connection.close();
							res.json_responses={"statusCode":401};
							callback(null, res);
			            }

						else if(!user) {
							connection.close();
							res.json_responses={"statusCode":405};
							callback(null, res);
			            }
						else {
								connection.close();
								res.json_responses={"statusCode":200,user:user.users[0]};
								callback(null, res);
						}
				});
				}
		});
		});
	});
}


exports.handle_payment_1=function(msg,callback){
	var res={};
	var json_responses;
	var category="users.$."+msg.category;
	console.log(category);
	mongo.connect(mongoURL,function(connection){
		var coll=mongo.collection('Mystique');
		process.nextTick(function(){
			coll.update({ doctype: "users", "users.user_email":msg.username},
			{ "$push": { "users.$.orders": msg.order } }
			,function(err,user){
				if(err) {
					connection.close();
					console.log(err);
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					console.log("did not find");
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }
				else {
					console.log(user);
					coll.update({ doctype: "users", "users.user_email":msg.username},
							{ "$set": { 'users.$.cart':[] } });
					coll.findOne({doctype:"users"},{users:{$elemMatch:{
						user_email:msg.username,
						}}},function(err,user)
					{
						if(err) {
							connection.close();
							res.json_responses={"statusCode":401};
							callback(null, res);
			            }

						else if(!user) {
							connection.close();
							res.json_responses={"statusCode":405};
							callback(null, res);
			            }
						else {
								connection.close();
								res.json_responses={"statusCode":200,user:user.users[0]};
								console.log(user);
								callback(null, res);
						}
				});
				}
		});
		});
	});
}


exports.handle_payment_2=function(msg,callback){
	var res={};
	var json_responses;
	var category="users.$."+msg.category;
	console.log(category);
	mongo.connect(mongoURL,function(connection){
		var coll=mongo.collection('Mystique');
		process.nextTick(function(){
			coll.update({ doctype: "users", "users.user_email":msg.username},
			{ "$push": { "users.$.subscription_orders": msg.order } }
			,function(err,user){
				if(err) {
					connection.close();
					console.log(err);
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					console.log("did not find");
					res.json_responses={"statusCode":405};
					callback(null, res);
	            }
				else {
					console.log(user);
					coll.update({ doctype: "users", "users.user_email":msg.username},
							{ "$set": { 'users.$.cart':[] } });
					coll.findOne({doctype:"users"},{users:{$elemMatch:{
						user_email:msg.username,
						}}},function(err,user)
					{
						if(err) {
							connection.close();
							res.json_responses={"statusCode":401};
							callback(null, res);
			            }

						else if(!user) {
							connection.close();
							res.json_responses={"statusCode":405};
							callback(null, res);
			            }
						else {
								connection.close();
								res.json_responses={"statusCode":200,user:user.users[0]};
								console.log(user);
								callback(null, res);
						}
				});
				}
		});
		});
	});
}