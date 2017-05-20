//loading the 'login' angularJS module

var login = angular.module('login', ['ui.router','ngRoute','ngResource','ngCookies','pubnub.angular.service']);

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
	            	templateUrl : 'templates/navbar1.html'
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
	            'sidebar':{
	            	templateUrl : 'templates/navbar1.html'
	            },
	            'content': {
	                templateUrl : 'templates/checkout.html',
	            },
			}
		}).state('account',{
			url : '/account',
			controller: 'login',
			params : {USER: null},
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/navbar1.html'
	            },
	            'content': {
	                templateUrl : 'templates/account.html',
	            },
			}
		});
		$urlRouterProvider.otherwise('/');
});
//defining the login controller
login.controller('login', function($scope,$http,$state,$window, $cookies, $cookieStore) {
	
	$scope.Text_to_Speech = "Welcome to the speech enabled world!";
	$scope.current_user=$window.localStorage.getItem('user');
	console.log($scope.current_user);
	$scope.invalid_data = true;
	$scope.valid_data = true;
	$scope.invalid_login = true;
	$scope.valid_login = true;
	$scope.product_quantity=1;
	$scope.current_order=$cookieStore.get('current_order');
	
	$scope.describe_element=function(x){
		 window.speechSynthesis.speak(new SpeechSynthesisUtterance(x));
	};
	
	$scope.describe_products=function(x){
		$scope.text="The name of this product is"+x.productname+". The product is described as"+x.productdesc+". The product cost "+x.productcost+". Move your mouse downward to add this item to the cart.";
		 window.speechSynthesis.speak(new SpeechSynthesisUtterance($scope.text));
	};
	
	$scope.describe_products1=function(x){
		$scope.text="The name of this product is"+x.productname+". The product is described as"+x.productdesc+". The product cost "+x.productcost+". Move your mouse to right to edit the quantity.";
		 window.speechSynthesis.speak(new SpeechSynthesisUtterance($scope.text));
	};
	
	 $scope.pauseit = function () {
	      window.speechSynthesis.cancel();
	 };
	
	
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
				window.localStorage.setItem('user',data.user);
				console.log("checking:"+$scope.current_user);
				$scope.current_user=data.user;
				console.log("checking:"+$scope.current_user);
				$scope.valid_login = false;
				$scope.invalid_login = true;
				$scope.current_user=data.user;
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
				$scope.describe_element("Hey you have been registered with our site. Please click on login button to ");
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
				$window.localStorage.setItem('user',data.user);
				console.log("checking:"+$scope.current_user);
				$scope.current_user=data.user;
				console.log("checking:"+$scope.current_user);
				$scope.valid_login = false;
				$scope.invalid_login = true;
				$scope.current_user=data.user;
				$scope.display_name=display_name;
				$scope.describe_element("Login Successful.On the next page you will find the account options on the top of the page. If you want to visit the cart please drag your mouse to the top left corner and listen to the audio carefully.");
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
					$scope.describe_element("The Products from category"+category+"has been loaded on your screen. Please move your mouse downwards to find out about them.");
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
				window.localStorage.setItem('user',data.user);
				$scope.current_user=data.user;
				$scope.cart_length=$scope.current_user.cart.length;
				window.speechSynthesis.speak(new SpeechSynthesisUtterance("The product has been added to the cart. To listen to the products in your cart Move mouse to the top right corner of the web page."));
			}
			else{
				
			}
		}).error(function(error) {
			
		});
	}
	
	$scope.prepare_cart=function(){
		$scope.order_total=0;
		$scope.order_total_tax=0;
		$scope.current_order.order_total=0;
		$scope.current_order.order_total_tax=0;
		$scope.cart=$current_user.cart;
	};
	
		
	$scope.prepare_cart_products=function(x){
		$scope.cart=x;
		for(var count=0;count<x.length;count++){
			$scope.cart[count].product_quantity=1;
			$scope.cart[count].product_total=$scope.cart[count].productcost;
			$scope.order_total=$scope.order_total+$scope.cart[count].product_total;
			$scope.order_total_tax=Math.round($scope.order_total*1.05);
		}	
		$scope.current_user.cart=$scope.cart;
		window.localStorage.setItem('user',$scope.current_user);
		console.log($scope.cart);
	};
	
	
	$scope.update_cart=function(x){
		$scope.order_total=$scope.order_total-x.product_total;
		x.product_total=(x.productcost*x.product_quantity);
		$scope.order_total=$scope.order_total+x.product_total;
		$scope.order_total_tax=Math.round($scope.order_total*1.05);
		$scope.describe_element("Your cart has been updated.Please go to the specific products to find out about the updated details.");
	}
	

	$scope.remove_cart=function(x){
		$scope.order_total=$scope.order_total-x.product_total;
		$scope.order_total_tax=Math.round($scope.order_total*1.05);
		console.log("remove_cart");
			$http({
			method : "POST",
			url : '/remove_from_cart',
			data : {
				"product":x
			}
		}).success(function(data) {
			if(data.statusCode==200){
				$scope.order_total=0;
				$scope.order_total_tax=0;
				$scope.current_user=data.user;
				window.localStorage.setItem('user',data.user);
				$scope.cart_length=$scope.current_user.cart.length;
				$scope.cart=data.user.cart;
				$scope.current_user.cart=data.user.cart;
				$scope.prepare_cart_products($scope.current_user.cart);
				$scope.describe_element("The item is removed from the cart.Please go to the specific products to find out about the updated details.");
			}
			else{
				
			}
		}).error(function(error) {
			
		});
	}
	$scope.payment_init=function(){
		$scope.invalid_cc=true;
		$scope.valid_cc=true;
		$scope.enter_cc=true;
	};
	
	
	
	$scope.checkout=function(){		
		$scope.order={"products":$scope.current_user.cart,
				"order_total":$scope.order_total,
				"order_total_tax":$scope.order_total_tax,
		};
		$cookieStore.put('current_order',$scope.order);
		$state.go("checkout");
	};
	
	$scope.payment=function(){
		$scope.category="orders";
		if($scope.subscribe_order){
			console.log("here");
			$scope.category="subscription_orders";
		}
		$scope.current_order.delivery_address=$scope.address;
		console.log($scope.cc_number);
		if($scope.cc_number.length==16 && $scope.cc_expiry.length==5 && $scope.cc_type.length==3){
			$http({
				method : "POST",
				url : '/payment',
				data : {
					"category":$scope.category,
					"order":$scope.current_order
				}
			}).success(function(data) {
				if(data.statusCode==200){
					$scope.current_user.cart=[];
					$window.localStorage.getItem('user').cart=[];
					console.log(data);
					window.localStorage.setItem('user',data.user);
					$scope.current_user=data.user;
					$scope.valid_cc=false;
					$scope.describe_element("Your order was placed successfully and the order will be delivered to you within 2 days. If you have selected the order as a subscription order it will be delivered evry week.");
				}
				else{
					$scope.invalid_cc=false;
					console.log(data);
					$scope.describe_element("There was some error from our side while processing your order.Please try again later.");
				}
			}).error(function(error) {
				$scope.describe_element("There was error in our system.we could not process your order please try again later.");
			});
		}
		else{
			$scope.enter_cc=false;
			$scope.describe_element("Please enter the payment details carefully");
		}
	};
	
});