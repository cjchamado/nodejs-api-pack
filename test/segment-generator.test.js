const { DashSegmentGenerator, UnderscoreSegmentGenerator } = require("../src");

describe("SegmentGenerator", () => {
  it("DashSegmentGenerator", () => {
    expect(DashSegmentGenerator.getSegment("FOOBAR")).toBe("foobars");
    expect(DashSegmentGenerator.getSegment("FooBar")).toBe("foo-bars");
    expect(DashSegmentGenerator.getSegment("Foo_Bar")).toBe("foo-bars");
  });

  it("UnderscoreSegmentGenerator", () => {
    expect(UnderscoreSegmentGenerator.getSegment("FOOBAR")).toBe("foobars");
    expect(UnderscoreSegmentGenerator.getSegment("FooBar")).toBe("foo_bars");
    expect(UnderscoreSegmentGenerator.getSegment("Foo-Bar")).toBe("foo_bars");
  });
});
