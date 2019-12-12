var Author = require('../models/author');
var Book = require('../models/book');

var async = require('async');
var mongoose = require('mongoose');

exports.author_list = function(req, res) {
    Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function(err, list_authors) {
        if(err) { return next(err); }

        res.render('author_list', {title: 'Author List', author_list: list_authors});
    });
    //res.send('NOT IMPLEMENTED: Author list');
};

exports.author_detail = function(req, res) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        author: function(callback) {
            Author.findById(id)
            .exec(callback);
        },
        author_books: function(callback) {
            Book.find({'author': id}, 'title summary')
            .exec(callback);
        }
    },function(err, results) {
        if(err) { return next(err); }
        if(results.author==null) {
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        res.render('author_detail', {title: 'Author Detail', author: results.author, author_books: results.author_books});
    });
    //res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};