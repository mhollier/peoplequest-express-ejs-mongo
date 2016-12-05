/**
 * People controller module.
 * @module peopleController
 * @author Mark Hollier <mhollier@yahoo.com>
 */

var model = require('../services/peopleDataService');
var resultsPerPage = 5;

function getIndex(req, res) {

  var searchTerm = req.query['searchTerm'];
  var page = parseInt(req.query['page']);
  model.getPeople(searchTerm, page, resultsPerPage, function (err, results) {
    // If received via an AJAX request, then use a partial view
    var view = (req.xhr) ? 'partials/peopleList' : 'index';
    res.render(view, results);
  });
}

function getById(req, res) {
  var id = req.params.id;
  model.getPerson(id, function (err, person) {
    res.render('details', person);
  });
}

module.exports = {
  getIndex: getIndex,
  getById: getById
};

