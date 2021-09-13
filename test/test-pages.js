var expect  = require('chai').expect;
var request = require('request');
let app = require("../app");

it('Main page content', function(done) {
    request('http://localhost:3000/test' , function(error, response, body) {
        console.log("body",body)
        expect(body).to.equal('Hello World');
        done();
    });
});

it('Main page content', function(done) {
    request('http://localhost:3000/departmenttest' , function(error, response, body) {
        console.log("body",body)
       
        expect(body).to.equal('Working DEPARTMENT');
        done();
    });
});


it('Main page content', function(done) {
    request('http://localhost:3000/categorytest' , function(error, response, body) {
        console.log("body",body)
        expect(body).to.equal('Working CATEGORY');
        done();
    });
});