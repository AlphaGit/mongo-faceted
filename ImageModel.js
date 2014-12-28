module.exports = function(mongoose) {
  var ImageSchema = new mongoose.Schema({
    height: Number,
    width: Number,
    name: String,
    tags: [String]
  });

  ImageSchema.statics.searchFacets = function(filter, cb) {
    searchParams = searchParams || {};
    cb = cb || function() {};

    var searchParams = {};
    if (filter.tags) searchParams.tags = { $in: filter.tags };
    if (filter.height) searchParams.height = filter.height;
    if (filter.width) searchParams.width = filter.width;
    if (filter.name) searchParams.name = new Regex(filter.name);

    ImageModel.find(searchParams, function (error, resultDocs) {
      if (error) { return cb(error, resultDocs); }

      ImageModel.aggregate([
        { $match: searchParams },
        { $unwind: '$tags' },
        { $group: {
            _id: null,
            height: { $addToSet: "$height" },
            width: { $addToSet: "$width" },
            name: { $addToSet: "$name" },
            tags: { $addToSet: "$tags" }
          }
        }
      ], function (error, aggregationDocs) {
        resultDocs.facets = aggregationDocs;
        cb(null, resultDocs);
      })
    });
  };

  var ImageModel = mongoose.model('Image', ImageSchema);

  return ImageModel;
};

