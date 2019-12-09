var Book = require('../models/book');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
}

exports.book_list = function(req, res) {
    res.send('NOT IMPLEMENTED: book list');
};

exports.book_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: book detail: ' + req.params.id);
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