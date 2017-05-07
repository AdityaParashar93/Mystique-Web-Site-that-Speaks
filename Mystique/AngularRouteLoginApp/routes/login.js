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
	// These two variables come from the form on
	// the views/login.hbs page
	var username = req.param("username");
	var password = req.param("password");
	console.log(username+"\t"+password);
	console.log('info', "Basic:: " + username+"\t"+password);
	
	req.session.username=req.param("username");
	console.log("\nsession data "+req.session.username);
	var msg_payload = {"username":username,"password":password};
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		console.log("hey we got the response");
		console.log(results);
		res.send(results.json_responses);
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