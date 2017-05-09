//loading the 'login' angularJS module

var login = angular.module('login', ['ui.router','ngRoute','ngResource','ngCookies']);

//to store session data
var display_name='';
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
	            	templateUrl : 'templates/navbar.html'
	            },
	            'content': {
	                templateUrl : 'templates/index.html',
	            },
			}
		});
		$urlRouterProvider.otherwise('/');
});
//defining the login controller
login.controller('login', function($scope,$http,$state,$window, $cookies, $cookieStore) {
	console.log($scope.current_user);
	$scope.current_user=$cookieStore.get('user');
	console.log($scope.current_user);
	$scope.invalid_data = true;
	$scope.valid_data = true;
	$scope.invalid_login = true;
	$scope.valid_login = true;	
	
	$scope.init=function(){
		console.log("call is here");
		$http({
			method : "POST",
			url : '/fetchproducts_all',
			data : {
			}
		}).success(function(data) {
			if (data.statusCode == 200) {
				console.log(data.products);
				$scope.products=data.products;
			}
			else{
				
			} 
		}).error(function(error) {
			
		});
		
	}
	
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
		$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(data) {
			console.log(data);
			if (data.statusCode == 200) {
				console.log(data.user.first_name);
				$cookieStore.put('user',data.user);
				$scope.valid_login = false;
				$scope.invalid_login = true;
				display_name=data.user.first_name;
				$scope.session_owner=data.user.email;
				$scope.display_name=display_name;
				$scope.login_modal=true;
				$window.location.assign('/index');
			}
			else{
				$scope.invalid_login = false;
				$scope.validlogin = true;
			} 
		}).error(function(error) {
			$scope.validlogin = true;
			$scope.invalid_login = false;
		});
	};
	
	$scope.fetchproducts=function(category){
		console.log("test");
		console.log(category);
		$http({
			method : "POST",
			url : '/fetchproducts',
			data : {
				"category":category
			}
		}).success(function(data) {
			if (data.statusCode == 200) {
				if(data.products[0])
				{
					$scope.products=data.products[0].products;
				}
			}
			else{
				
			} 
		}).error(function(error) {
			
		});
	};
	
	$scope.add_to_cart=function(x){
		console.log(x);
	}
	
});