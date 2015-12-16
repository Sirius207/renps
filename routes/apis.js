require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var books = mongoose.model('books');
var resources = mongoose.model('resources');
var moment = require('moment');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// /************************增加書籍或財產*********************************************

router.post('/add_book', function(req, res, next) {

    new books({
        book_name: req.body.name,
        author: req.body.author,
        image: req.body.image,
        intro: req.body.intro,
        url: req.body.url,
        owner: req.body.owner,
        remark: req.body.remark,
        free: true,
        who_keep: 'ccns'
    }).save(function(err) {
        if (err) {
            console.log('fail!');
            return;
        }
        console.log('save to db');
    });
    res.redirect('/');

});

router.post('/add_resource', function(req, res, next) {

    new resources({
        product_name: req.body.product_name,
        image: req.body.image,
        intro: req.body.intro,
        url: req.body.url,
        owner: req.body.owner,
        remark: req.body.remark,
        free: true,
        who_keep: 'ccns'
    }).save(function(err) {
        if (err) {
            console.log('fail!');
            return;
        }
        console.log('save to db');
    });
    res.redirect('/');

});

//********************************************消除預約紀錄***********************************************************

router.get('/deletebook/:id', function(req, res, next) {
    books.update({
        _id: req.params.id
    }, {
        $set: {
            have_rent:true
        }
    }, function(err) {
        if (err)
            console.log("fail delete");
        else
            console.log("success delete");
    });
    res.redirect('/');
});


router.get('/delete_resources/:id', function(req, res, next) {
    resources.update({
        _id: req.params.id
    }, {
        $set: {
            have_rent:true
        }
    }, function(err) {
        if (err)
            console.log("fail delete");
        else
            console.log("success delete");
    });
    res.redirect('/');
});

// **************************************預約借書******************************************************

router.post('/rentbook/:id', function(req, res, next) {

    url = '/users/books/' + req.params.id;
    var contact = true;
    var now = Date.now();

    req.body.end_day = moment(req.body.end_day).format('YYYY-MM-DD');
    req.body.start_day = moment(req.body.start_day).format('YYYY-MM-DD');
    books.findById(req.params.id).lean().exec(function(err, thisbook) {
        thisbook.record.forEach(function(bookrecord) {

            bookrecord.start_day = moment(bookrecord.start_day).format('YYYY-MM-DD');
            bookrecord.end_day = moment(bookrecord.end_day).format('YYYY-MM-DD');
            now = moment(now).format('YYYY-MM-DD');


            if (bookrecord.end_day <= req.body.end_day && bookrecord.end_day >= req.body.start_day) {
                console.log("夾到別人的結束時間");
                console.log('你的開始時間' + req.body.start_day);
                console.log('別人的結束時間' + bookrecord.end_day);
                console.log('你的結束時間' + req.body.end_day);

                contact = false;
            } else if (req.body.start_day <= now) {
                console.log('今天是' + now);
                console.log("選到過去時間囉！");
                contact = false;
            } else if (req.body.start_day > req.body.end_day) {
                console.log("開始時間在結束時間後面了喔！！");
                contact = false;
            } else if (bookrecord.start_day <= req.body.end_day && bookrecord.start_day >= req.body.start_day) {
                console.log("夾到別人的開始時間");
                console.log('你的開始時間' + req.body.start_day);
                console.log('別人的開始時間' + bookrecord.start_day);
                console.log('你的結束時間' + req.body.end_day);
                contact = false;
            }
            console.log("");
            console.log('今天是' + now);
            console.log('別人的開始時間' + bookrecord.start_day);
            console.log('別人的結束時間' + bookrecord.end_day);
            console.log('你的開始時間 ' + req.body.start_day);
            console.log('你的結束時間 ' + req.body.end_day);
            console.log("");
        });
        console.log('pass ' + contact);
        // console.log("pass test!");

        if (contact === false) {
            res.redirect(url);
        } else {
            console.log('enter ' + contact);
            books.update({
                _id: req.params.id
            }, {
                $push: {
                    record: {
                        user_id: req.body.user_id,
                        start_day: req.body.start_day,
                        end_day: req.body.end_day,
                        record_time: Date.now(),
                        have_rent: false
                    }
                }
            }, function(err) {
                if (err) {
                    console.log('fail!');
                    return;
                }
                console.log('save to db');
                console.log('save ' + contact);
                res.redirect(url);
            });
        }
    }); // res.redirect('/users/intro/req.params.id');
});


// **************************************預約借財產****************************************************************

router.post('/rent_resources/:id', function(req, res, next) {

    url = '/users/resources/' + req.params.id;
    var contact = true;
    var now = Date.now();

    req.body.end_day = moment(req.body.end_day).format('YYYY-MM-DD');
    req.body.start_day = moment(req.body.start_day).format('YYYY-MM-DD');
    resources.findById(req.params.id).lean().exec(function(err, thisresources) {
        thisresources.record.forEach(function(bookrecord) {

            bookrecord.start_day = moment(bookrecord.start_day).format('YYYY-MM-DD');
            bookrecord.end_day = moment(bookrecord.end_day).format('YYYY-MM-DD');
            now = moment(now).format('YYYY-MM-DD');


            if (bookrecord.end_day <= req.body.end_day && bookrecord.end_day >= req.body.start_day) {
                console.log("夾到別人的結束時間");
                console.log('你的開始時間' + req.body.start_day);
                console.log('別人的結束時間' + bookrecord.end_day);
                console.log('你的結束時間' + req.body.end_day);

                contact = false;
            } else if (req.body.start_day <= now) {
                console.log('今天是' + now);
                console.log("選到過去時間囉！");
                contact = false;
            } else if (req.body.start_day > req.body.end_day) {
                console.log("開始時間在結束時間後面了喔！！");
                contact = false;
            } else if (bookrecord.start_day <= req.body.end_day && bookrecord.start_day >= req.body.start_day) {
                console.log("夾到別人的開始時間");
                console.log('你的開始時間' + req.body.start_day);
                console.log('別人的開始時間' + bookrecord.start_day);
                console.log('你的結束時間' + req.body.end_day);
                contact = false;
            }
            console.log("");
            console.log('今天是' + now);
            console.log('別人的開始時間' + bookrecord.start_day);
            console.log('別人的結束時間' + bookrecord.end_day);
            console.log('你的開始時間 ' + req.body.start_day);
            console.log('你的結束時間 ' + req.body.end_day);
            console.log("");
        });
        console.log('pass ' + contact);
        // console.log("pass test!");

        if (contact === false) {
            res.redirect(url);
        } else {
            console.log('enter ' + contact);
            resources.update({
                _id: req.params.id
            }, {
                $push: {
                    record: {
                        user_id: req.body.user_id,
                        start_day: req.body.start_day,
                        end_day: req.body.end_day,
                        record_time: Date.now(),
                        have_rent: false
                    }
                }
            }, function(err) {
                if (err) {
                    console.log('fail!');
                    return;
                }
                console.log('save to db');
                console.log('save ' + contact);
                res.redirect(url);
            });
        }
    }); // res.redirect('/users/intro/req.params.id');
});


module.exports = router;
