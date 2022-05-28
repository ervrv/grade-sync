// mostly taken from soap library examples https://github.com/vpulim/node-soap#features
// wsdl service description example taken from https://stackoverflow.com/questions/49802327/soap-server-using-node-js

var express = require('express');
var soap = require('soap');

var myService = {
	MyService: {
		MyPort: {
			MyFunction: function(args) {
				console.log(args)
				return {
					name: args.name
				};
			},

			// This is how to define an asynchronous function with a callback.
			MyAsyncFunction: function(args, callback) {
				// do some work
				callback({
					name: args.name
				});
			},

			// This is how to define an asynchronous function with a Promise.
			MyPromiseFunction: function(args) {
				return new Promise((resolve) => {
					// do some work
					resolve({
						name: args.name
					});
				});
			},

			// This is how to receive incoming headers
			HeadersAwareFunction: function(args, cb, headers) {
				return {
					name: headers.Token
				};
			},

			// You can also inspect the original `req`
			reallyDetailedFunction: function(args, cb, headers, req) {
				console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
				return {
					name: headers.Token
				};
			}
		}
	}
};

var xml = require('fs').readFileSync('myservice.wsdl', 'utf8');

//http server example
// var server = http.createServer(function(request,response) {
// 	response.end('404: Not Found: ' + request.url);
// });
//
// server.listen(8000);
// soap.listen(server, '/wsdl', myService, xml, function(){
// 	console.log('server initialized');
// });

//express server example
var app = express();
//body parser middleware are supported (optional)
//app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
app.listen(8001, function(){
	//Note: /wsdl route will be handled by soap module
	//and all other routes & middleware will continue to work
	soap.listen(app, '/wsdl', myService, xml, function(){
		console.log('server initialized');
	});
});


console.log('SFedU cabinet mock started on : ' + 8001);