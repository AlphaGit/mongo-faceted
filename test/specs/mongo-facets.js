var async = require('async');
var testFw = require('../test-framework');
var mongoose = require('mongoose');
var mongoFacets = require('../../lib/mongo-facets');
var ExampleModel = require('../example-model');

mongoFacets(ExampleModel.schema, ExampleModel);
