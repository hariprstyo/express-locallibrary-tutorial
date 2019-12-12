var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
var mongoose = require('mongoose');

exports.genre_list = function(req, res, next) {
    Genre.find()
    .sort([['name', 'ascending']])
    .exec(function(err, list_genre) {
        if(err) { return next(err); }

        res.render('genre_list', {title: 'Genre List', genre_list: list_genre});
    });
    //res.send('NOT IMPLEMENTED: genre list');
};

exports.genre_detail = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);

    async.parallel({
        genre: function(callback) {
            Genre.findById(id)
            .exec(callback);
        },
        genre_books: function(callback) {
            Book.find({'genre': id})
            .exec(callback);
        }
    },function(err, results) {
        if(err) { return next(err); }
        if(results.genre==null) {
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }

        res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
    });
    //res.send('NOT IMPLEMENTED: genre detail: ' + req.params.id);
};

exports.genre_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: genre create GET');
};

exports.genre_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: genre create POST');
};

exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: genre delete GET');
};

exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: genre delete POST');
};

exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: genre update GET');
};

exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: genre update POST');
};