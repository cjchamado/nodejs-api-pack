const Inflector = require("inflected");

const DashSegmentGenerator = {
  getSegment(name, collection = true) {
    const segment = Inflector.dasherize(Inflector.tableize(name));
    return collection ? segment : Inflector.singularize(segment);
  }
};

const UnderscoreSegmentGenerator = {
  getSegment(name, collection = true) {
    const segment = Inflector.underscore(Inflector.tableize(name));
    return collection ? segment : Inflector.singularize(segment);
  }
};

module.exports = {
  DashSegmentGenerator,
  UnderscoreSegmentGenerator
};
