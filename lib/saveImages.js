function getImageObject(ImageModel, h, w, name, tags) {
  return new ImageModel({
    height: h,
    width: w,
    name: name,
    tags: tags
  });
}

var databaseConnection = require('./databaseConnection');
databaseConnection.initDbConnection(function(mongoose) {
  var ImageModel = require('./ImageModel')(mongoose);

  console.log('Removing old images');
  ImageModel.collection.remove(function(err) {
    if (err) { console.error('Error removing images', err); }
  });

  console.log('Instantiating images');
  var imageGenerator = getImageObject.bind(this, ImageModel);

  var images = [];
  images.push(imageGenerator(100, 100,'JDAvatar.png',['JD', 'Avatar', 'person', 'face', 'color']));
  images.push(imageGenerator(100, 100, 'Another100.png', ['person', 'square']));
  images.push(imageGenerator(1090, 1920, 'background.png', ['background', 'color', 'hd', 'big', 'landscape']));
  images.push(imageGenerator(200, 200, 'PersonTagOnly.png', ['person']));

  console.log('Saving images');
  ImageModel.create(images, function(err) {
    if (err) {
      console.error('Error occurred', err);
    } else {
      console.info('Images saved.');
    }

    process.exit(0);
  });
}); // initDbConnection
