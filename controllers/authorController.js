var Author = require('../models/author');
var Book = require('../models/book');

var async = require('async');
var mongoose = require('mongoose');

const {body,validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

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

exports.author_create_get = function(req, res, next) {
    res.render('author_form', {title: 'Create Author'});
    //res.send('NOT IMPLEMENTED: Author create GET');
};

exports.author_create_post = [
    //validate fields
    body('first_name').isLength({min:1}).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non alphanumeric characters.'),
    body('family_name').isLength({min:1}).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy:true}).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({checkFalsy:true}).isISO8601(),
    //sanitize fields
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),
    //process request after validation and sanitazion
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty) {
            res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array()});
            return;
        } else {
            var author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
            author.save(function(err) {
                if(err) {return next(err); }

                res.redirect(author.url);
            });
        }
    }
];
/*function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};*/

exports.author_delete_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        author: function(callback) {
            Author.findById(id).exec(callback);
        },
        author_books: function(callback) {
            Book.find({'author': id}).exec(callback);
        }
    },function(err, results) {
        if(err) { return next(err); }
        if(results.author==null) {
            res.redirect('/catalog/authors');
        }

        res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.author_books});
    });
    //res.send('NOT IMPLEMENTED: Author delete GET');
};

exports.author_delete_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.body.authorid);
    async.parallel({
        author: function(callback) { 
            Author.findById(id).exec(callback); 
        },
        author_books: function(callback) {
            Book.find({'author':id}).exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }

        if(results.author_books.length > 0) {
            res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.author_books})
            return;
        } else {
            Author.findByIdAndRemove(id, function deleteAuthor(err) {
                if(err) { return next(err); }

                res.redirect('/catalog/authors');
            });
        }


    });
    //res.send('NOT IMPLEMENTED: Author delete POST');
};

exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};