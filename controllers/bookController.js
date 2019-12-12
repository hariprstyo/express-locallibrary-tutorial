var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var Bookinstance = require('../models/bookinstance');

var async = require('async');
var mongoose = require ('mongoose');

exports.index = function(req, res) {
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        },
        bookinstance_count: function(callback) {
            Bookinstance.countDocuments({}, callback);
        },
        bookinstance_available_count: function(callback) {
            Bookinstance.countDocuments({status: 'Available'}, callback);
        }
    }, function(err, results){
        res.render('index', {title: 'Local Library Home', error: err, data: results})
    });
    //res.send('NOT IMPLEMENTED: Site Home Page');
}

exports.book_list = function(req, res, next) {
    Book.find({}, 'title author')
    .populate('author')
    .exec(function(err, list_books) {
        if(err) {return next(err);}

        res.render('book_list', {title: 'Book List', book_list: list_books});
    });
    //res.send('NOT IMPLEMENTED: book list');
};

exports.book_detail = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    console.log(req.params.id);
    console.log(id);
    async.parallel({
        book: function(callback) {
            Book.findById(id)
            .populate('author')
            .populate('genre')
            .exec(callback);
        },
        book_instance: function(callback) {
            Bookinstance.find({'book': id})
            .exec(callback);
        }
    },function(err, results){
        if(err) { return next(err); }
        if(results.book==null) {
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }

        res.render('book_detail', {title: results.book.title, book: results.book, book_instance: results.book_instance});
    });
    //res.send('NOT IMPLEMENTED: book detail: ' + req.params.id);
};

exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: book create GET');
};

exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: book create POST');
};

exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: book delete GET');
};

exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: book delete POST');
};

exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: book update GET');
};

exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: book update POST');
};