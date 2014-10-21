module.exports = function(mongoose) {
  var ImageSchema = new mongoose.Schema({
    height: Number,
    width: Number,
    name: String,
    tags: [String]
  });
  return mongoose.model('Image', ImageSchema);
};

