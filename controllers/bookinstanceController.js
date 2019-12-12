var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

var async = require('async');
var mongoose = require('mongoose');

exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
    .populate('book')
    .exec(function(err, list_bookinstance) {
        if(err) { return next(err); }

        res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstance});
    });
    //res.send('NOT IMPLEMENTED: bookinstance list');
};

exports.bookinstance_detail = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);

    async.parallel({
        bookinstance: function(callback) {
            BookInstance.findById(id)
            .populate('book')
            .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        if(results.bookinstance==null) {
            var err = new Error('Book copies not found');
            err.status = 404;
            return next(err);
        }
        res.render('bookinstance_detail', {title: 'Book-intance detail', bookinstance: results.bookinstance});
    });
    //res.send('NOT IMPLEMENTED: bookinstance detail: ' + req.params.id);
};

exports.bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: bookinstance create GET');
};

exports.bookinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: bookinstance create POST');
};

exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: bookinstance delete GET');
};

exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: bookinstance delete POST');
};

exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: bookinstance update GET');
};

exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: bookinstance update POST');
};