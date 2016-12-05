/**
 * People data service module.
 * @module peopleDataService
 * @author Mark Hollier <mhollier@yahoo.com>
 */

var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId;
var dbUrl = 'mongodb://localhost:27017/peopleQuest';

/**
 * Builds a MongoDB query object from the given search term.
 * @access private
 * @param {String} searchTerm - The search term used for matching a person by name.
 * @returns {Object} The MongoDB query object.
 */
function buildQuery(searchTerm) {

  if (searchTerm === undefined || searchTerm.length === 0)
    return {};

  var name = searchTerm.trim();
  return {
    $or: [
      {firstName: {$regex: name, $options: 'i'}},
      {lastName: {$regex: name, $options: 'i'}}
    ]
  };
}

/**
 * Calculates a person's age a date string.
 * @access private
 * @param {String} dobString - The person's date of birth as a string.
 * @returns {Number} The calculated age.
 */
function calculatAge(dobString) {
  var dob = new Date(dobString);
  var now = new Date();
  var age = now.getFullYear() - dob.getFullYear();
  if ((dob.getMonth() > now.getMonth()) ||
    (dob.getMonth() == now.getMonth() && dob.getUTCDate() > now.getUTCDate())) {
    --age;
  }
  return age;
}

/**
 * Creates a person object from the given MongoDB object.
 * @access private
 * @param {Object} dbObj - A person object from MongoDB.
 * @returns {Object} A person object with additional attributes attached.
 */
function createPerson(dbObj) {
  return {
    _id: dbObj._id,
    firstName: dbObj.firstName,
    lastName: dbObj.lastName,
    address1: dbObj.address1,
    address2: dbObj.address2,
    birthDate: dbObj.birthDate,
    interests: dbObj.interests,
    image: dbObj.image,
    age: calculatAge(dbObj.birthDate.slice(0, 10)),
    fullName: dbObj.firstName + ' ' + dbObj.lastName
  };
}

/**
 * Creates an array of person objects from the given MongoDB results.
 * @access private
 * @param {Object[]} dbArray - The array of MongoDB results.
 */
function createPersonArray(dbArray) {
  var people = [];
  for (var i = 0; i < dbArray.length; i++) {
    people.push(createPerson(dbArray[i]));
  }
  return people;
}

/**
 * The callback format for the getPerson method.
 * @callback getPersonCallback
 * @param {Error} err - An error instance representing the error during the execution.
 * @param {object} person - A person object.
 */

/**
 * Gets a person for the given identifier.
 * @param {String} id - The person identifier.
 * @param {getPersonCallback} callback - The callback that handles the response.
 */
function getPerson(id, callback) {
  var objId = new objectId(id);
  mongodb.connect(dbUrl, function (err, db) {
    var collection = db.collection('people');
    collection.findOne({_id: objId}, function (err, results) {
      callback(err, {person: createPerson(results)});
      db.close();
    });
  });
}

/**
 * The callback format for the getPeople method.
 * @callback getPeopleCallback
 * @param {Error} err - An error instance representing the error during the execution.
 * @param {Object} results - The results object.
 */

/**
 * Gets a collection of people for the given search term and paging parameters. *
 * @param {String} searchTerm - The search term used to match a person by first or last name.
 * @param {Number} page - The page of people results to retrieve.
 * @param {Number} pageSize - The number of people per page.
 * @param {getPeopleCallback} callback - The callback that handles the response.
 */
function getPeople(searchTerm, page, pageSize, callback) {

  // Build the database query
  var query = buildQuery(searchTerm);

  // Get the current page number
  if (page === undefined || isNaN(page) || page < 1) {
    page = 1;
  }

  mongodb.connect(dbUrl, function (err, db) {
    var collection = db.collection('people');
    collection.find(query).count(function (err, count) {

      // Calculate the number to skip for paging
      var skipCount = pageSize * (page - 1);
      // Calculate the total number of pages (pageCount)
      var pageCount = Math.ceil(count / pageSize);

      // Query database and return results via callback
      collection.find(query).skip(skipCount).limit(pageSize).toArray(function (err, results) {
        callback(err, {
          people: createPersonArray(results),
          page: page,
          pageCount: pageCount,
          searchTerm: searchTerm
        });
        db.close();
      });
    });
  });
}

module.exports = {
  getPeople: getPeople,
  getPerson: getPerson
};
