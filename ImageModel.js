module.exports = function(mongoose) {
  var ImageSchema = new mongoose.Schema({
    height: Number,
    width: Number,
    name: String,
    tags: [String]
  });

  ImageSchema.statics.searchFacets = function(searchParams, cb) {
    searchParams = searchParams || {};
    cb = cb || function() {};

    var search = this.find();
    if (searchParams.tags)
      search = search.find({ tags: { $in: searchParams.tags } });

    if (searchParams.height)
      search = search.find({ height: searchParams.height });

    if (searchParams.width)
      search = search.find({ width: searchParams.width });

    if (searchParams.name)
      search = search.find({ name: new Regex(searchParams.name) });

    search.exec(cb);
  };

  return mongoose.model('Image', ImageSchema);
};

