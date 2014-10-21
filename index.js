var LOAD_EXAMPLE_IMAGES = false;

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/faceted-test', function(err) {
  if (err) return console.error('Error connecting to database', err);
  console.log('Connected to database');
});

var ImageSchema = new mongoose.Schema({
  height: Number,
  width: Number,
  name: String,
  tags: [String]
});

var ImageModel = mongoose.model('Image', ImageSchema);

// **** SAVING EXAMPLE IMAGES
if (LOAD_EXAMPLE_IMAGES) {
  console.log('Creating images');

  var image1 = new ImageModel({
    height: 100,
    width: 100,
    name: 'JDAvatar.png',
    tags: ['JD', 'Avatar', 'person', 'face', 'color']
  });

  var image2 = new ImageModel({
    height: 1080,
    width: 1920,
    name: 'background.png',
    tags: ['background', 'color', 'hd', 'big', 'landscape']
  });

  console.log('Saving images');
  image1.save(function(err1) {
    if (err1) return console.error('error saving image 1', err1);

    console.info('Saved image 1');
    image2.save(function(err2) {
      if (err2) return console.error('error saving image 2', err2);

      console.info('Saved image 2');
    });
  });
}

// **** END SAVING EXAMPLE IMAGES

facetedSearch({ tags: ['person'] }, function(err, results) {
  if (err) return console.error('Error searching', err);

  console.log('Searching by tags: ', results);
});

console.log('Finished.');

function facetedSearch(filters, callback) {
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