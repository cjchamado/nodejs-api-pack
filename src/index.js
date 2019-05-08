const { Method, Type } = require("./enums");

module.exports = class ApiPack {
  constructor() {
    this.checkers = [];
    this.persisters = [];
    this.providers = [];
    this.serializers = [];
    this.validators = [];
    this.operation = {};
  }

  checker(checker) {
    this.checkers.push(checker);
    return this;
  }

  persister(persister) {
    this.persisters.push(persister);
    return this;
  }

  provider(provider) {
    this.providers.push(provider);
    return this;
  }

  serializer(serializer) {
    this.serializers.push(serializer);
    return this;
  }

  validator(validator) {
    this.validators.push(validator);
    return this;
  }

  errors(type) {
    return this.operation.context.errors[type];
  }

  getOperationChecker() {
    return this.checkers[0] || null;
  }

  getOperationPersister() {
    return this.persisters[0] || null;
  }

  getOperationProvider() {
    return this.providers[0] || null;
  }

  getOperationSerializer() {
    return this.serializers[0] || null;
  }

  getOperationValidator() {
    return this.validators[0] || null;
  }

  async read() {
    const provider = this.getOperationProvider();
    if (!provider) return;
    try {
      switch (this.operation.type.toLowerCase()) {
        case Type.COLLECTION:
          this.operation.method.toUpperCase() === Method.POST
            ? (this.operation.data = null)
            : await provider.getCollection(this.operation);
          break;
        case Type.ITEM:
          await provider.getItem(this.operation);
          break;
        case Type.CUSTOM:
          await provider.getData(this.operation);
          break;
      }
    } catch (e) {
      this.operation.data = null;
    }
  }

  async deserialize(data = {}) {
    if (!this.operation.data) {
      const provider = this.getOperationProvider();
      if (!provider) return;
      await provider.getInstance(this.operation);
    }
    const serializer = this.getOperationSerializer();
    if (serializer) {
      await serializer.deserialize(this.operation, data);
    }
  }

  async check() {
    const checker = this.getOperationChecker();
    if (checker) {
      await checker.check(this.operation);
    }
  }

  async validate() {
    const validator = this.getOperationValidator();
    if (validator) {
      await validator.validate(this.operation);
    }
  }

  async write() {
    const persister = this.getOperationPersister();
    if (persister) {
      switch (this.operation.method.toUpperCase()) {
        case Method.PUT:
        case Method.POST:
        case Method.PATCH:
          await persister.persist(this.operation);
          break;
        case Method.DELETE:
          await persister.remove(this.operation);
          break;
      }
    }
  }

  async serialize() {
    const serializer = this.getOperationSerializer();
    if (serializer) {
      await serializer.serialize(this.operation);
    }
  }
};
