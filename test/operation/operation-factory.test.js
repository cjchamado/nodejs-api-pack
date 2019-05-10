const { OperationFactory } = require("../../src/operation");

describe("OperationFactory", () => {
  it("Defaults", () => {
    const operations = OperationFactory.create("Dummy");

    expect(operations.length).toBe(5);

    const paginate = operations[0];
    expect(paginate.type).toBe("collection");
    expect(paginate.path).toBe("/dummies");
    expect(paginate.method).toBe("get");

    const create = operations[1];
    expect(create.type).toBe("collection");
    expect(create.path).toBe("/dummies");
    expect(create.method).toBe("post");

    const retrieve = operations[2];
    expect(retrieve.type).toBe("item");
    expect(retrieve.path).toBe("/dummies/:id");
    expect(retrieve.method).toBe("get");

    const update = operations[3];
    expect(update.type).toBe("item");
    expect(update.path).toBe("/dummies/:id");
    expect(update.method).toBe("put");

    const remove = operations[4];
    expect(remove.type).toBe("item");
    expect(remove.path).toBe("/dummies/:id");
    expect(remove.method).toBe("delete");
  });
});
