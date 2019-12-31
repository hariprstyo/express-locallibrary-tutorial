var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

var async = require('async');
var mongoose = require('mongoose');

const validator = require('express-validator');

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

exports.bookinstance_create_get = function(req, res, next) {
    Book.find({}, 'title')
    .exec(function(err, books) {
        if(err) { return next(err); }
        res.render('bookinstance_form', {title: 'Create Bookinstance', book_list: books});
    });
    //res.send('NOT IMPLEMENTED: bookinstance create GET');
};

exports.bookinstance_create_post = [
    validator.body('book', 'Book must be specified').isLength({min: 1}).trim(),
    validator.body('imprint', 'Imprint must be specified').isLength({min: 1}).trim(),
    validator.body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),

    validator.sanitizeBody('book').escape(),
    validator.sanitizeBody('imprint').escape(),
    validator.sanitizeBody('status').trim().escape(),
    validator.sanitizeBody('due_date').toDate(),

    (req, res, next) => {
        const error = validator.validationResult(req);

        const bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        });

        if(!error.isEmpty()) {
            Book.find({}, 'title')
            .exec(function(err, books) {
                res.render('bookinstance_form', {title: 'Bookinstance Create', book_list: books, selected_book: bookinstance.book._id, errors: error.array(), bookinstance: bookinstance});
            });
            return;
        } else {
            bookinstance.save(function (err) {
                if(err) { return next(err); }
                res.redirect(bookinstance.url);
            });
        }
    }
];
/*function(req, res) {
    res.send('NOT IMPLEMENTED: bookinstance create POST');
};*/

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