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
		}).state('cart',{
			url : '/cart',
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
	                templateUrl : 'templates/cart.html',
	            },
			}
		}).state('checkout',{
			url : '/checkout',
			controller: 'login',
			params : {USER: null},
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'content': {
	                templateUrl : 'templates/checkout.html',
	            },
			}
		});
		$urlRouterProvider.otherwise('/');
});
//defining the login controller
login.controller('login', function($scope,$http,$state,$window, $cookies, $cookieStore) {
	$scope.current_user=$cookieStore.get('user');
	console.log($scope.current_user);
	$scope.cart_length=$scope.current_user.cart.length;
	$scope.invalid_data = true;
	$scope.valid_data = true;
	$scope.invalid_login = true;
	$scope.valid_login = true;
	$scope.product_quantity=1;
	$scope.current_order=$cookieStore.get('current_order');
	$scope.init=function(){
		$http({
			method : "POST",
			url : '/fetchproducts_all',
			data : {
			}
		}).success(function(data) {
			if (data.statusCode == 200) {
				console.log(data);
				$scope.products=data.products;
			}
			else{
				
			} 
		}).error(function(error) {
			
		});
	}
	
	$scope.init_header1=function(){
		console.log("call is here");
		$http({
			method : "POST",
			url : '/checklogin_fetch',
			data : {
			}
		}).success(function(data) {
			console.log(data);
			if (data.statusCode == 200) {
				console.log(data);
				$cookieStore.put('user',data.user);
				console.log("checking:"+$scope.current_user);
				$scope.current_user=data.user;
				console.log("checking:"+$scope.current_user);
				$scope.valid_login = false;
				$scope.invalid_login = true;
				$scope.current_user=data.user;
				$scope.display_name=display_name;
				$scope.cart_length=$scope.current_user.cart.length;
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
			if (data.statusCode == 200) {
				$cookieStore.put('user',data.user);
				console.log("checking:"+$scope.current_user);
				$scope.current_user=data.user;
				console.log("checking:"+$scope.current_user);
				$scope.valid_login = false;
				$scope.invalid_login = true;
				$scope.current_user=data.user;
				$scope.display_name=display_name;
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
		$http({
			method : "POST",
			url : '/add_to_cart',
			data : {
				"product":x
			}
		}).success(function(data) {
			if(data.statusCode==200){
				$scope.current_user=data.user;
				$cookieStore.put('user',data.user);
				$scope.current_user=data.user;
				$scope.cart_length=$scope.current_user.cart.length;
			}
			else{
				
			}
		}).error(function(error) {
			
		});
	}
	
	$scope.order_total=0;
	$scope.order_total_tax=0;

	$scope.prepare_cart_products=function(x){
		x.product_quantity=1;
		x.product_total=x.productcost;
		$scope.order_total=$scope.order_total+x.product_total;
		$scope.order_total_tax=Math.round($scope.order_total*1.05);
	};
	
	
	$scope.update_cart=function(x){
		$scope.order_total=$scope.order_total-x.product_total;
		x.product_total=(x.productcost*x.product_quantity);
		$scope.order_total=$scope.order_total+x.product_total;
		$scope.order_total_tax=Math.round($scope.order_total*1.05);
	}
	
	
	$scope.removed_cart=$scope.current_user.cart;
	$scope.remove_cart=function(x){
		$scope.order_total=0;
		$scope.order_total_tax=0;
		$http({
			method : "POST",
			url : '/remove_from_cart',
			data : {
				"product":x
			}
		}).success(function(data) {
			if(data.statusCode==200){
				$scope.current_user=data.user;
				$cookieStore.put('user',data.user);
				$scope.cart_length=$scope.current_user.cart.length;
				$scope.removed_cart=data.user.cart;
			}
			else{
				
			}
		}).error(function(error) {
			
		});
	}
	$scope.payment_init=function(){
		//$scope.cc_number=$scope.current_user.cc_number;
		//$scope.cc_expiry_=$scope.current_user.cc_expiry;
		//$scope.cc_type=$scope.current_user.cc_type;
		$scope.invalid_cc=true;
		$scope.valid_cc=true;
		$scope.enter_cc=true;
	};
	
	
	
	$scope.checkout=function(){		
		$scope.order={"products":$scope.current_user.cart,
				"order_total":$scope.order_total,
				"order_total_tax":$scope.order_total_tax
		};
		$cookieStore.put('current_order',$scope.order);
		$state.go("checkout");
	};
	
	$scope.payment=function(){
		console.log($scope.cc_number);
		if($scope.cc_number.length==16 && $scope.cc_expiry.length==5 && $scope.cc_type.length==3){
			$http({
				method : "POST",
				url : '/payment',
				data : {
					"order":$scope.current_order
				}
			}).success(function(data) {
				if(data.statusCode==200){
					$scope.current_user.cart=[];
					$cookieStore.get('user').cart=[];
					console.log(data);
					$cookieStore.put('user',data.user);
					$scope.current_user=data.user;
					$scope.valid_cc=false;
				}
				else{
					$scope.invalid_cc=false;
					console.log(data);
				}
			}).error(function(error) {
				
			});
		}
		else{
			$scope.enter_cc=false;
		}
	};
	
});