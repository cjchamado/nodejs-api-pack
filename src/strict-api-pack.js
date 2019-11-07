const { Method, Type } = require('./enums');

class StrictApiPack {
    constructor({
        operation,
        provider,
        persister,
        serializer,
        routeChecker,
        resourceChecker,
        validator
    }) {
        this.operation = operation;
        this.provider = provider;
        this.persister = persister;
        this.serializer = serializer;
        this.routeChecker = routeChecker;
        this.resourceChecker = resourceChecker;
        this.validator = validator;
    }

    getOperationProvider() {
        return this.provider;
    }

    getOperationPersister() {
        return this.persister;
    }

    getOperationSerializer() {
        return this.serializer;
    }

    getOperationValidator() {
        return this.validator;
    }

    getOperationChecker() {
        return this.resourceChecker;
    }

    getRouteChecker() {
        return this.routeChecker;
    }

    errors(type) {
        return this.operation.context.errors[type];
    }

    async checkRoute() {
        const checker = this.getRouteChecker();
        if (!checker) {
            return;
        }
        await checker.checkRoute(this.operation);
    }

    async read() {
        this.operation.data = null;
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
            /** @todo enable exception here */
            this.operation.data = null;
        }
    }

    async deserialize(data = {}) {
        const method = this.operation.method.toUpperCase();

        if (
            [Method.GET, Method.DELETE].indexOf(method) >= 0 ||
            ([Method.POST, Method.PUT].indexOf(method) >= 0 &&
                !Object.keys(data).length)
        ) {
            return;
        }

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

        if (!checker || !this.operation.data) {
            return;
        }

        await checker.check(this.operation);
    }

    async validate() {
        const method = this.operation.method.toUpperCase();
        const validator = this.getOperationValidator();

        if (Method.GET === method || Method.DELETE === method || !validator) {
            return;
        }

        await validator.validate(this.operation);
    }

    async write() {
        const method = this.operation.method.toUpperCase();
        const persister = this.getOperationPersister();

        if (!persister || method === Method.GET) {
            return;
        }

        switch (method) {
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

    async serialize() {
        const serializer = this.getOperationSerializer();

        if (!serializer || !this.operation.data) {
            return;
        }

        await serializer.serialize(this.operation);
    }
}

module.exports = StrictApiPack;
