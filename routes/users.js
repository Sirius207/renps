require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose	= require( 'mongoose' );
var books     	= mongoose.model( 'books' );
var resources = mongoose.model('resources');
var moment = require('moment');


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add_property', function(req, res, next) {
  res.render('add_property',{
  	title:"addpage",
  });
});

router.get('/add_resource', function(req, res, next) {
  res.render('add_resource',{
    title:"addresource",
  });
});



router.get('/books/:id', function(req, res, next) {
  books.findById(req.params.id).lean().exec(function(err, books){
  	books.record.forEach( function ( books ){
  		books.start_day = moment(books.start_day).format('YYYY-MM-DD');
  		books.end_day = moment(books.end_day).format('YYYY-MM-DD');
  	});
 	  res.render('property',{
  		title:"propertypage",
  		books:books
  	});
  });
});



router.get('/resources/:id', function(req, res, next) {
  resources.findById(req.params.id).lean().exec(function(err, resources){
    resources.record.forEach( function ( resources){
      resources.start_day = moment(resources.start_day).format('YYYY-MM-DD');
      resources.end_day = moment(resources.end_day).format('YYYY-MM-DD');
    });
    res.render('resources',{
      title:"propertypage",
      resources:resources
    });
  });
});


module.exports = router;




