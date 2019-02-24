### NOTE: This project is no longer under maintenance.

However, we will gladly accept new PRs or questions.

[![Build Status](https://api.shippable.com/projects/54a0895ad46935d5fbc112c8/badge?branchName=master)](https://app.shippable.com/projects/54a0895ad46935d5fbc112c8/builds/latest)
[![Code Climate](https://codeclimate.com/github/AlphaGit/mongo-faceted/badges/gpa.svg)](https://codeclimate.com/github/AlphaGit/mongo-faceted) [![Test Coverage](https://codeclimate.com/github/AlphaGit/mongo-faceted/badges/coverage.svg)](https://codeclimate.com/github/AlphaGit/mongo-faceted)
[![Dependencies](https://david-dm.org/AlphaGit/mongo-faceted.svg)](https://david-dm.org/AlphaGit/mongo-faceted)

# mongo-faceted

Creating faceted searches in MongoDB.

## Introduction

This library will provide a few helper functions to extract facets out of a
MongoDB database. You can optionally use [mongoose][], in which case you'll also
get two extra functions defined statically in your models.

## Initializing

**MongoDB:** Nothing to do. :)

**Mongoose:**

```javascript
var mongooseFacets = require('mongo-facets').mongooseFacets;
mongooseFacets('MyModelName', MyModel);
```

This will add `MyModel.findWithFacets(...)` and `MyModel.getFacets(...)` to your
model's static methods.

If you did not install optional dependencies, mongoose will not be available and
these two functions will bite your hand off. Be warned.

## Using

`Model.findWithFacets(filter, callback)` (Only available with Mongoose.)

- `filter`: `Object`. Filter documents for which facets will be generated.
  Accepts all options that mongoose's `.find(filter)` does.
- `callback`: `Function`. The first parameter will be an error object if it
  was raised, null otherwise. The second parameter will be the find() results
  and it will also have a property `facets` on which facets results will be
  present.

`Model.getFacets(filter, callback)`  (Only available with Mongoose.)

- `filter`: `Object`. Filter documents for which facets will be generated.
  Accepts all options that mongoose's `.find(filter)` does.
- `callback`: `Function`. The first parameter will be an error object if it
  was raised, null otherwise. The second parameter will be the retrieved facets.

```javascript
var mongoFacets = require('mongo-facets').mongoFacets;
mongoFacets.getFacets(collection, filter, facetTypes, callback)
```

- `collection`: `Object`. The collection object from the MongoDB Driver. You can
  retrieve it by executing `db.collection('myCollectionName', callback)`.
- `filter`: `Object`. Filter documents for which facets will be generated.
  Accepts all options that Mongo's `.find(filter)` does.
- `facetTypes`: `Object`. Object indicator of the facets that need to be
  retrieved and their corresponding types in the document. Keys are the property
  names and values are the types.
- `callback`: `Function`. The first parameter will be an error object if it
  was raised, null otherwise. The second parameter will be the retrieved facets.

### Example

```javascript
var testData = [{
  stringField: 'One',
  numberField: 1,
  arrayOfStringsField: ['Uno', 'Eins', 'Raz']
}, {
  stringField: 'Two',
  numberField: 2,
  arrayOfStringsField: ['Dos', 'Zwei', 'Dva']
}, {
  stringField: 'Three',
  numberField: 3,
  arrayOfStringsField: ['Tres', 'Drei', 'Tri']
}];
// ... insert this data into the database ...

var mongoFacets = require('mongo-facets').mongoFacets;

var filter = { $or: [{ numberField: 1 }, { numberField: 2 }] };

var facetTypes = {
  stringField: String,
  numberField: Number,
  arrayOfStringsField: Array
};

mongoFacets.getFacets(testDataCollection, filter, facetTypes, function(err, facets) {
  /* facets should have:

  {
    stringField: ['One', 'Two']
    numberField: [1, 2],
    arrayOfStringsField: ['Uno', 'Eins', 'Raz', 'Dos', 'Zwei', 'Dva']
  }

  */
});
```

## To test

```console
gulp
```

Or, if you're into watching your code as it grows:

```console
gulp watch
```

<!-- Link references -->

[mongoose]: https://www.npmjs.com/package/mongoose "Mongoose"
