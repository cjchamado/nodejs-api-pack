const {
  PathResolver,
  UnderscoreSegmentGenerator
} = require("../../src/operation/");

describe("PathResolver", () => {
  it("Static", () => {
    expect(PathResolver.resolveOperationPath("FooBar")).toBe("/foo-bars");
  });

  it("Instance", () => {
    const pathResolver = new PathResolver();
    expect(pathResolver.resolveOperationPath("FooBar")).toBe("/foo-bars");
  });

  it("Underscored", () => {
    const pathResolver = new PathResolver(UnderscoreSegmentGenerator);
    expect(pathResolver.resolveOperationPath("FooBar")).toBe("/foo_bars");
  });
});
