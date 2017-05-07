//loading the 'login' angularJS module

var login = angular.module('login', ['ui.router','ngRoute','ngResource']);

//to store session data
var order_total=0;
var display_name='';
var session_owner='';
login.config(function($stateProvider, $urlRouterProvider, $locationProvider,$routeProvider) {
		$locationProvider.html5Mode(true);
		$stateProvider.state('login', {	
			url : '/',
			views: {
	            'header': {
	                templateUrl : 'templates/header.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/navbar.html',
	            },
	            'content': {
	                templateUrl : 'templates/login.html',
	            },
			}
		}).state('index',{
			url : '/index',
			controller: 'login',
			params : {USER: null},
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/index.html',
	            },
			}
		});
		$urlRouterProvider.otherwise('/');
});
//defining the login controller
login.controller('login', function($scope,$http,$state) {
	$scope.invalid_data = true;
	$scope.valid_data = true;
	$scope.invalid_product=true;
	$scope.valid_product=true;
	$scope.invalid_login = true;
	$scope.validlogin = true;
	$scope.invalid_bid = true;
	$scope.valid_bid = true;
	$scope.category_list=["electronics","clothes","sports","kitchen","mobile","laptop","garden","home","living","media"];
	
	
	$scope.register = function() {
		$scope.invalid_data_message="";
		$http({
			method : "POST",
			url : '/registeruser',
			data : {
				"first_name" : $scope.first_name,
				"last_name" : $scope.last_name,
				"email":$scope.email,
				"password" : $scope.password,
			}
		}).success(function(data) {
			if (data.statusCode == 200) {
				console.log(data);
				$scope.valid_data = false;
				$scope.invalid_data = true;
			}
			else{
				$scope.invalid_data = false;
				$scope.valid_data = true;
				$scope.invalid_data_message="Hey There was some problem in registration.";
			} 
		}).error(function(error) {
			$scope.invalid_data = false;
			$scope.valid_data = true;
		});
	};
	
	
	
	$scope.submit = function() {
		/*$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(data) {
			console.log(data);
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.validlogin = true;
			}
			else{
				$scope.validlogin = false;
				$scope.invalid_login = true;
				console.log(data.display_name+"\t"+data.session_owner);
				display_name=data.display_name;
				session_owner=data.session_owner;
				$scope.session_owner=session_owner;
				$scope.display_name=display_name;
				$state.go('/index');
			} 
		}).error(function(error) {
			$scope.validlogin = true;
			$scope.invalid_login = true;
		});*/
	};
});