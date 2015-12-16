require('../lib/db');

var express 		= require('express');
var router 			= express.Router();
var mongoose		= require( 'mongoose' );
var books     		= mongoose.model( 'books' );
var resources     	= mongoose.model( 'resources' );

/* GET home page. */
router.get('/', function(req, res, next) {

	books.find(function(err,books,count){
		resources.find(function(err,resources,count){
			res.render('index',{
				title:"homepage",
				books:books,
				resources:resources
			});
		});
	});
});

module.exports = router;
