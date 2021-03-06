/**
 * New node file
 */
var winston = require('winston');
var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://54.183.4.162:27017/Mystique";

var bcrypt = require('bcrypt');
const saltRounds = 10;
var passport = require('passport');
var mq_client = require('../rpc/client');
//require('./routes/passport')(passport);

exports.checkLogin = function(req,res,next){
	console.log(req.param("username"));
	var msg_payload = {"username":req.param("username"),"password":req.param("password")};
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		if(results.json_responses.statusCode==200)
		{
			req.session.username=results.json_responses.user.user_email;
			res.send(results.json_responses);
		}
		else{
			res.send(results.json_responses);
		}
	});
};

exports.checkLogin_fetch = function(req,res,next){
	var msg_payload = {"username":req.session.username};
	mq_client.make_request('login_fetch_queue',msg_payload, function(err,results){
		if(results.json_responses.statusCode==200)
		{
			req.session.username=results.json_responses.user.user_email;
			console.log(results);
			res.send(results.json_responses);
		}
		else{
			res.send(results.json_responses);
		}
	});
};



exports.registeruser = function(req,res,next){
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(req.param("password"), salt);
	var msg_payload = {"first_name":req.param("first_name"),"last_name":req.param("last_name"),"email":req.param("email"),"password":hash};
	mq_client.make_request('register_queue',msg_payload, function(err,results){
		res.send(results.json_responses);
	});
};



exports.fetchproducts_all=function(req,res,next){
	var msg_payload={};
	mq_client.make_request('fetchproducts_all_queue',msg_payload,function(err,results) {
           res.send(results.json_responses); 
            });
};

exports.fetchproducts=function(req,res,next){
	var msg_payload={"category":req.param("category")};
	mq_client.make_request('fetchproducts_queue',msg_payload,function(err,results){
		console.log(results.json_responses);
		res.send(results.json_responses);
	});
};


exports.add_to_cart=function(req,res,next){
	var msg_payload={"username":req.session.username,"product":req.param("product")};
	console.log(req.session.username);
	mq_client.make_request('add_to_cart_queue',msg_payload,function(err,results){
		console.log(results.json_responses);
		res.send(results.json_responses);
	});
};

exports.remove_from_cart=function(req,res,next){
	var msg_payload={"username":req.session.username,"product":req.param("product")};
	console.log(req.session.username);
	mq_client.make_request('remove_from_cart_queue',msg_payload,function(err,results){
		console.log(results.json_responses);
		res.send(results.json_responses);
	});
};

exports.payment=function(req,res,next){
	
	var msg_payload={"username":req.session.username,"order":req.param("order"),"category":req.param("category")};
	if(req.param("category")=="orders"){
		mq_client.make_request('payment_queue_1',msg_payload,function(err,results){
			console.log(results.json_responses);
			res.send(results.json_responses);
		});
	}
	else{
		mq_client.make_request('payment_queue_2',msg_payload,function(err,results){
			console.log(results.json_responses);
			res.send(results.json_responses);
		});
	}
};
