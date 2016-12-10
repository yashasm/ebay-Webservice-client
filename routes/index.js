var express = require('express');
var router = express.Router();
var logFile = require('./log');
var mq_client = require('../rpc/client');

var amqp = require('amqplib/callback_api');

var soap = require('soap');
var baseURL = "http://localhost:8080/ebayWebService/services";


/* GET home page. */
router.get('/', function(req, res, next) {
	
	logFile.logToFile(req,res,'Action: Loaded home page');
		console.log(req.session.username);
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
	
	
	logFile.logToFile(req,res,'Action: signin');
	console.log(req.session.username);
	  res.render('signin', { title: 'Sign In' });
	});

router.get('/confirm-login', function (req, res) {
	console.log("session variable!!!");
	logFile.logToFile(req,res,'Action: Retrieving data from session');
	
	
	
	var cartCount = 0;
	if(typeof req.session.cartitems !== "undefined"){
		cartCount = req.session.cartitems.length; 
	}
	var tempid = 0;
	if(typeof req.session.tempid !== "undefined"){
		tempid = req.session.tempid;
	}
	
	var lastloggedin ='';
	if(typeof req.session.lastloggedin !== "undefined"){
		lastloggedin =req.session.lastloggedin; 
	}
	
	var user = {"id":req.session.username ,"cartcount":cartCount,"tempid":tempid,"lastloggedin":lastloggedin};
    res.send(user)
}
);




router.get('/account-details', function(req,res){

	console.log("lets get account details");
	
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/Accounts?wsdl";
	var args = {email: req.session.email};
	  soap.createClient(url,option, function(err, client) {
	      client.getAccountDetails(args, function(err, result) {
	    	  if(result.statusCode == "200"){	    		  
	    		  
	    		  result = {"condition":"success"};													
					
					res
					.status(200)
					.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
	  });


});




router.post('/account-details',function(req,res){
	console.log("lets set account details");	
	
	var n = req.body.birthday.indexOf("T");
    req.body.birthday = req.body.birthday.substring(0, n);      
    req.body.expiry = req.body.birthday.substring(0, 7);
			
	
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/Accounts?wsdl";
	var args = {email: req.session.email,firstname:req.body.firstname,lastname:req.body.lastname,phone:req.body.phone,ebayHandle:req.body.ebayhandle,birthday:req.body.birthday,address:req.body.address,cardnumber:req.body.cardnumber,expiry:req.body.expiry,cvv:req.body.cvv};
	  soap.createClient(url,option, function(err, client) {
	      client.setAccountDetails(args, function(err, result) {
	    	  if(result == "200"){	    		  
	    		  
	    		  result = {"condition":"success"};													
					
					res
					.status(200)
					.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
	  });


});



router.get('/search-mycollection', function(req,res){
	console.log("lets search my collection");	
	
	
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/SearchValidations?wsdl";
	var args = {myMail: req.session.email};
	  soap.createClient(url,option, function(err, client) {
	      client.getMyCollectionData(args, function(err, result) {
	    	  if(result.statusCode == "200"){	    		  
	    		  
	    		  result = {"condition":"success"};													
					
					res
					.status(200)
					.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
	  });
});




router.get('/search-getmypurchasehistory', function(req,res){
	console.log("lets my purchase history");
	
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/SearchValidations?wsdl";
	var args = {myMail: req.session.email};
	  soap.createClient(url,option, function(err, client) {
	      client.getMyPurchaseHistory(args, function(err, result) {
	    	  if(result.statusCode == "200"){	    		  
	    		  
	    		  result = {"condition":"success"};													
					
					res
					.status(200)
					.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
	  });
});


//router.get('/search-bidinghistory', searchController.getMyBidingHistory);
router.get('/search-bidinghistory', function(req,res){
	console.log("lets my bid history");
	
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/Bidding?wsdl";
	var args = {myMail: req.session.email};
	  soap.createClient(url,option, function(err, client) {
	      client.getMyBidingHistory(args, function(err, result) {
	    	  if(result.statusCode == "200"){	    		  
	    		  
	    		  result = {"condition":"success"};													
					
					res
					.status(200)
					.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
	  });

});


router.get('/search-details', function(req,res){
	console.log("lets my search-details");
	
	//
	
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/SearchValidations?wsdl";
	var args = {query: req.query.searchstring};
	  soap.createClient(url,option, function(err, client) {
	      client.searchData(args, function(err, result) {
	    	  if(result.statusCode == "200"){
	    		  
	    		  
	    		  result = {"condition":"success"};													
					
					res
					.status(200)
					.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
		
	  });
});





router.get('/search-item', function(req,res){
	console.log("lets my search-items");
	
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/SearchValidations?wsdl";
	var args = {query: req.query.searchid};
	  soap.createClient(url,option, function(err, client) {
	      client.searchItem(args, function(err, result) {
	    	  if(result.statusCode == "200"){
	    		  
	    		  
	    		  result = {"condition":"success"};													
					
					res
					.status(200)
					.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
	  });	
});


router.post('/bid',function(req, res){
	

	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/Bidding?wsdl";
	 
	 
	  var args = {bidamount:req.body.bidamount,itemid:req.body.itemid,itemname:req.body.itemname,seller:req.body.seller,email:req.session.email};
	  soap.createClient(url,option, function(err, client) {
	      client.saveBid(args, function(err, result) {
	    	  if(result == "200"){
	    		  	    		  	    		 
		            	            
		            res
		    		.status(200)
		    		.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
	  });

});


router.post('/cartcardconfirm',function(req, res){
	
	logFile.logToFile(req,res,'Action: Validate credit card before purchase');
	console.log("card details");
	console.log(req.body.cardnumber);
	console.log(req.body.expiration);
	console.log(req.body.cvv);
	console.log(typeof req.body.cardnumber);
	console.log("card details ends");
	
	if(req.body.cardnumber == "" || req.body.expiration == ""|| req.body.cvv == ""){
		console.log("inside null");
		var data = {"condition":"failed"};
		res
		.status(200)
		.send(data);
		return;
	}
	cardLength = req.body.cardnumber.toString();
	if(cardLength.length != 16){
		console.log("inside length failure",req.body.cardnumber.length);
		var data = {"condition":"failed"};
		res
		.status(200)
		.send(data);
		return;
	}
	
	var data = {"condition":"success"};
	res
	.status(200)
	.send(data);
});



router.get('/logout', function (req, res) {
	logFile.logToFile(req,res,'Action: Logging out!! Bye');
	console.log("session variable!!!destroy");
	var user = {"id":""};
	req.session.destroy();
    res.send(user)
}
);

router.post('/signin',function(req,res){
	console.log("lets take a new route........");
	
	
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/validation?wsdl";
	 console.log("username"+req.body.email);
	 console.log("username"+req.body.password);
	  var args = {username: req.body.email,password: req.body.password};
	  soap.createClient(url,option, function(err, client) {
	      client.validate(args, function(err, result) {
	    	  if(result.statusCode == "200"){
	    		  
	    		  
	    		  req.session.username = results.firstname;
		            
		            req.session.email = results.email;
		            	            
		            res
		    		.status(200)
		    		.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
	  });

});


router.get('/register', function(req, res, next) {
	logFile.logToFile(req,res,'Action: Loading register page');
	  res.render('register', { title: 'Register' });
	});



router.post('/register',function(req,res){
	console.log("lets register new user");	
	msgTest = {"body":req.body};
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/validation?wsdl";
	var args = {username: req.body.email,password: req.body.password, firstname: req.body.firstname, lastname:req.body.lastname , phone: req.body.lastname};
	  soap.createClient(url,option, function(err, client) {
	      client.signup(args, function(err, result) {
	    	  if(result.statusCode == "200"){
	    		  
	    		  
	    		  result = {"condition":"success"};													
					
					res
					.status(200)
					.json(result);
	    	  }
	    	  else{
	    		  
	    		  res
		    		.status(401)
		    		.json(result);
	    	  }
	      });
	  });	
});



module.exports = router;