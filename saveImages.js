var databaseConnection = require('./databaseConnection');
databaseConnection.initDbConnection(function(mongoose) {
  var ImageModel = require('./ImageModel')(mongoose);

  console.log('Instantiating images');
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
      process.exit(0);
    });
  });
}); // initDbConnection