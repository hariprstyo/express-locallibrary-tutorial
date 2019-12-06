var Author = require('../models/author');

exports.author_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Author list');
};

exports.author_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};