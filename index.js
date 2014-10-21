function facetedSearch(ImageModel, filters, callback) {
  var search = ImageModel.find();
  if (filters.tags)
    search = search.find({ $all: filters.tags });

  if (filters.height)
    search = search.find({ height: filters.height });

  if (filters.width)
    search = search.find({ width: filters.width });

  if (filters.name)
    search = search.find({ name: new Regex(filters.name) });

  search.exec(callback);
};

/******************************************************************************/

var databaseConnection = require('./databaseConnection');
databaseConnection.initDbConnection(function(mongoose) {
  var ImageModel = require('./ImageModel')(mongoose);

  ImageModel.count({}, function(error, count) {
    console.log('Total results:', count);
  });

  var facetedWithImage = facetedSearch.bind(this, ImageModel);
  facetedWithImage({ tags: ['person'] }, function(err, results) {
    if (err) return console.error('Error searching', err);

    console.log('Searching by tags: ', results);
    process.exit(0);
  });
}); // initDbConnection()