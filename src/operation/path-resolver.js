const { DashSegmentGenerator } = require("./segment-generator");

const resolveOperationPath = function(name, type) {
  const generator = this.pathSegmentGenerator
    ? this.pathSegmentGenerator
    : DashSegmentGenerator;

  let path = "/" + generator.getSegment(name, true);

  if (type === "item") {
    path += "/:id";
  }

  return path;
};

const PathResolver = function(pathSegmentGenerator = null) {
  this.pathSegmentGenerator = pathSegmentGenerator
    ? pathSegmentGenerator
    : DashSegmentGenerator;

  this.resolveOperationPath = resolveOperationPath;
};

PathResolver.resolveOperationPath = resolveOperationPath;

module.exports = PathResolver;
