var request = require('request')
    , express = require('express')
    ,assert = require('chai').assert
    ,http = require("http");


describe('http tests  LAB2 : MongoDB and RabbitMQ', function(){


    it('should be able to login with correct details', function(done) {
        request.post(
            'http://localhost:3000/checkLogin',
            { form: { username: 'admin@ebay.com',password:'admin' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
    
    it('get products', function(done) {
        request.post(
            'http://localhost:3000/fetchProducts',
            { form: { category: 'Electronics'} },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('showing the cart', function(done) {
        request.post(
            'http://localhost:3000/showCart',
            { form: { session_owner: 'admin@ebay.com' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('get products', function(done) {
        request.post(
            'http://localhost:3000/fetchProducts',
            { form: { "category": 'Clothes'} },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
    it('get products', function(done) {
        request.post(
            'http://localhost:3000/fetchProducts',
            { form: { category: 'Mobile'} },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
});