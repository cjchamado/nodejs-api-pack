const { ApiPack } = require("./../src");

describe("Api Pack Testing", () => {
  it("Default instance", () => {
    const apiPack = new ApiPack();

    const testProperties = [
      "checkers",
      "persisters",
      "providers",
      "serializers",
      "validators"
    ];

    testProperties.forEach(property => {
      expect(apiPack[property]).toEqual([]);
      expect(apiPack[property].length).toBe(0);
    });
  });

  it("Add handlers on instance", () => {
    const apiPack = new ApiPack();

    const checker = { foo() {} };
    const persister = { foo() {} };
    const provider = { foo() {} };
    const serializer = { foo() {} };
    const validator = { foo() {} };

    apiPack
      .checker(checker)
      .persister(persister)
      .provider(provider)
      .serializer(serializer)
      .validator(validator);

    const testProperties = [
      "checkers",
      "persisters",
      "providers",
      "serializers",
      "validators"
    ];

    testProperties.forEach(property => {
      const actual = JSON.stringify(apiPack[property]);
      const expected = JSON.stringify([{ foo() {} }]);
      expect(actual).toEqual(expected);
      expect(apiPack[property].length).toBe(1);
    });
  });

  it("Handle operation", () => {
    const READ_DATA = { foo: "bar", bar: "baz" };
    const DESERIALIZE_DATA = { foo: "foo", bar: "bar" };
    const SERIALIZE_DATA = { foo: "bar" };

    const checker = {
      check(operation = {}) {
        operation.checked = true;
      }
    };

    const persister = {
      persist(operation = {}) {
        operation.persisted = true;
      }
    };

    const provider = {
      getItem(operation = {}) {
        operation.data = READ_DATA;
      }
    };

    const serializer = {
      serialize(operation = {}) {
        operation.data = SERIALIZE_DATA;
      },
      deserialize(operation = {}, data = {}) {
        operation.data = data;
      }
    };

    const validator = {
      validate(operation = {}) {
        operation.validated = true;
      }
    };

    const apiPack = new ApiPack();

    apiPack
      .checker(checker)
      .persister(persister)
      .provider(provider)
      .serializer(serializer)
      .validator(validator);

    const operation = {
      type: "item",
      method: "PUT"
    };

    // Define apiPack.operation
    apiPack.operation = operation;

    // read
    apiPack.read();
    expect(operation.data).toEqual(READ_DATA);

    // deserialize
    apiPack.deserialize(DESERIALIZE_DATA);
    expect(operation.data).toEqual(DESERIALIZE_DATA);

    // check
    apiPack.check();
    expect(operation.checked).toBeTruthy();

    // validate
    apiPack.validate();
    expect(operation.validated).toBeTruthy();

    // write
    apiPack.write();
    expect(operation.persisted).toBeTruthy();

    // serialize
    apiPack.serialize();
    expect(operation.data).toEqual(SERIALIZE_DATA);
  });
});
