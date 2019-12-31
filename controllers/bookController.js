var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var Bookinstance = require('../models/bookinstance');

var async = require('async');
var mongoose = require('mongoose');
var validator = require('express-validator');

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
        console.log(list_books);
        res.render('book_list', {title: 'Book List', book_list: list_books});
        //res.json(list_books);
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

function getAuthorGenreList(callbackRender) {
    async.parallel({
        authors: function(callback) {
            Author.find()
            .sort([['family_name', 'ascending']])
            .exec(callback);
        },
        genres: function(callback) {
            Genre.find()
            .sort([['name', 'ascending']])
            .exec(callback);
        }
    },
        function(err, results){
            if(err) { return next(err); }
            callbackRender(results.authors, results.genres);
        });
}

exports.book_create_get = function(req, res, next) {
    var callbackRender = function(authorsList, genresList) {
        res.render('book_form', {title:'Create Book', authors: authorsList, genres: genresList});
    }
    getAuthorGenreList(callbackRender);
    
    //res.send('NOT IMPLEMENTED: book create GET');
};

exports.book_create_post = [
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)) {
            if(typeof req.body.genre === 'undefined') req.body.genre = [];
            else req.body.genre=new Array(req.body.genre);
        }
        next();
    },
    validator.body('title', 'Title must not be empty').isLength({min:1}).trim(),
    validator.body('author', 'Author must not be empty').isLength({min:1}).trim(),
    validator.body('summary', 'Summary must not be empty').isLength({min:1}).trim(),
    validator.body('isbn', 'ISBN must not be empty').isLength({min:1}).trim(),
    validator.sanitizeBody('*').escape(),
    (req, res, next) => {
        const errors = validator.validationResult(req);

        var book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
        });

        if(!errors.isEmpty()) {
            const callbackRender = (authorsList, genresList, errorsList) => {
                for(var i = 0; i < genresList.length; i++) {
                    if(book.genre.indexOf(genresList[i]._id) > -1 ) { genresList[i].checked = true; }
                }
                res.render('book_form', {title:'Create Book', authors: authorsList, genres: genresList, errors: errorsList.array()});
            };
            getAuthorGenreList(callbackRender);
            return;
        } else {
            book.save(function(err) {
                if(err) { return next(err); }
                res.redirect(book.url);
            });
        }

    }
];/*function(req, res) {
    res.send('NOT IMPLEMENTED: book create POST');
};*/

exports.book_delete_get = function(req, res, next) {
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