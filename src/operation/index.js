const OperationFactory = require("./operation-factory");
const SegmentGenerator = require("./segment-generator");
const PathResolver = require("./path-resolver");

const { DashSegmentGenerator, UnderscoreSegmentGenerator } = SegmentGenerator;

module.exports = {
  DashSegmentGenerator,
  OperationFactory,
  PathResolver,
  SegmentGenerator,
  UnderscoreSegmentGenerator
};
