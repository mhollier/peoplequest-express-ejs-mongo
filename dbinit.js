var mongodb = require('mongodb').MongoClient;

var people = [
  {
    firstName: 'Melisandre ',
    lastName: '',
    address1: 'House Baratheon',
    address2: 'The Stormlands, Westeros',
    birthDate: '1790-01-01T00:00:00Z',
    interests: 'Magic, Fire, Burning People at the Stake',
    image: '/images/Melisandre.jpg'
  },
  {
    firstName: 'Petyr ',
    lastName: 'Baelish',
    address1: 'Baelish Castle ',
    address2: 'The Fingers, Westeros',
    birthDate: '1980-01-01T00:00:00Z',
    interests: 'Chaos, The Vale, Redheads',
    image: '/images/Petyr_Baelish.jpg'
  },
  {
    firstName: 'Sandor \'The Hound\'',
    lastName: 'Clegane',
    address1: '',
    address2: 'Westeros',
    birthDate: '1975-01-01T00:00:00Z',
    interests: 'Fighting, Drinking, Chicken',
    image: '/images/Sandor_Clegane.jpg'
  },
  {
    firstName: 'Khal',
    lastName: 'Drogo',
    address1: '',
    address2: 'Essos',
    birthDate: '1990-01-01T00:00:00Z',
    interests: 'Horses, War, Pillaging, Fiery Blondes',
    image: '/images/Khal_Drogo.jpg'
  },
  {
    firstName: 'Cersei',
    lastName: 'Lannister',
    address1: 'King\'s Landing',
    birthDate: '1975-01-01T00:00:00Z5',
    interests: 'Treachery, Plotting, Brotherly Love',
    image: '/images/Cersei_Lannister.jpg'
  },
  {
    firstName: 'Jaime',
    lastName: 'Lannister',
    address1: 'King\'s Landing',
    address2: 'Westeros',
    birthDate: '1975-01-01T00:00:00Z',
    interests: 'Swords, Oaths, Cersei',
    image: '/images/Jaime_Lannister.jpg'
  },
  {
    firstName: 'Tyrion',
    lastName: 'Lannister',
    address1: 'King\'s Landing',
    birthDate: '1977-01-01T00:00:00Z',
    interests: 'Drinking, Sarcasm, Companionship',
    image: '/images/Tyrion_Lannister.jpg'
  },
  {
    firstName: 'Jorah',
    lastName: 'Mormont',
    address1: 'House Mormont',
    address2: 'Bear Island, Westeros',
    birthDate: '1975-01-01T00:00:00Z',
    interests: 'Spying, Loyalty, Fiery Blondes',
    image: '/images/Jorah_Mormont.jpg'
  },
  {
    firstName: 'Jon',
    lastName: 'Snow',
    address1: 'The Wall',
    birthDate: '1989-01-01T00:00:00Z',
    interests: 'Wildlings, Night\'s Watch, Direwolves, Redheads',
    image: '/images/Jon_Snow.jpg'
  },
  {
    firstName: 'Arya',
    lastName: 'Stark',
    address1: 'House of Black and White',
    address2: 'Braavos',
    birthDate: '2002-01-01T00:00:00Z',
    interests: 'Swordfighting, Justice, Direwolves',
    image: '/images/Arya_Stark.jpg'
  },
  {
    firstName: 'Sansa',
    lastName: 'Stark',
    address1: 'Winterfell',
    address2: 'The North, Westeros',
    birthDate: '2002-01-01T00:00:00Z',
    interests: 'Family, Direwolves, Lemon Squares',
    image: '/images/Sansa_Stark.jpg'
  },
  {
    firstName: 'Daenerys',
    lastName: 'Targaryen',
    address1: 'Great Pyramid',
    address2: 'Bay of Dragons, Essos',
    birthDate: '1990-01-01T00:00:00Z',
    interests: 'Dragons, Dothraki, Fire',
    image: '/images/Daenerys_Targaryen.jpg'
  }
];

var url = 'mongodb://localhost:27017/peopleQuest';
mongodb.connect(url, function (err, db) {
  db.dropCollection('people');
  console.log('Collection dropped');
  var collection = db.collection('people');
  collection.insertMany(people, function (err, results) {

    // Create an index on name fields
    collection.createIndex({firstName: 1, lastName: 1}, function (err, result) {
      console.log(result);
    });

    // Dump the entire collection to the console for verification
    collection.find({}).toArray(function (err, results) {
      console.log(results);
    });
    // Close the connection
    db.close();
  });
});
