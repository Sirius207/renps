var mongoose  = require( 'mongoose' );
var Schema   = mongoose.Schema;

var property   = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date
});


var books = new Schema({
	category	: String,
	tag			: [String],

	book_name	: String,
	author	 	: String,
	image		: String,
	intro	 	: String,
	url			: String,
	remark 		: String,

	owner	 	: String,
	free		: Boolean,
	who_keep	: String,   //who keep this book now?
	record		: [{
						user_id:String,
						start_day:Date,
						end_day:Date,
						record_time:Date,
						have_rent:Boolean
					}]

});


var resources = new Schema({
	category	: String,
	tag			: [String],

	product_name: String,
	image		: String,
	intro		: String,
	url			: String,
	remark		: String,


	owner	 	: String,
	free		: Boolean,
	who_keep	: String,   //who keep this book now?
	record		: [{
						user_id:String,
						start_day:Date,
						end_day:Date,
						record_time:Date,
						have_rent:Boolean
					}]

});

mongoose.model('books',books);
mongoose.model( 'property', property );
mongoose.model('resources',resources) ;
mongoose.connect( 'mongodb://localhost/property' );
