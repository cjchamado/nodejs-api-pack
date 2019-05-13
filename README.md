# NodeJS Api Pack

A simple package for standardizing API operations.

This package provides the configuration base for executing API operations through the [GET, POST, PUT, DELETE] methods.

The package does not provide operations performers, just an interface to access the features configured for each step of the operations.

## Basic concept

READ >> DESERIALIZE >> CHECK >> VALIDATE >> WRITE >> SERIALIZE

| STEP        | DESCRIPTION                                        | PERFORMER  |
| ----------- | -------------------------------------------------- | ---------- |
| READ        | Retrieve data (item/collection/custom/null)        | provider   |
| DESERIALIZE | Update resource/entity retrieved with request data | serializer |
| CHECK       | Check the resource access permissions              | checker    |
| VALIDATE    | Validate the populated/deserialized data           | validator  |
| WRITE       | Persist/update/delete data                         | persister  |
| SERIALIZE   | Serialize data before response                     | serializer |

### Performers (recommendation)

**Providers:** Providers operate by interpreting the request by loading the corresponding data and inserting it into the operation property `operation.data`

**Serializers** Operate at two different times:

- DESERIALIZE: Gets the request body and populates the entity. If an entity has not been recovered, a new entity must be provided by the provider.
- SERIALIZE: Format/add/remove properties according to business rules, before response.

**Checkers** After entity recovery, this step can be used for secure / access checks, if necessary.

**Validator** Performs validation of entity data

**Persister** Do one of the operations - persist (update) or remove, when applicable.

# Usage

## Installation

```js
// npm
npm install @kolinalabs/nodejs-api-pack

// or yarn
yarn add @kolinalabs/nodejs-api-pack
```

## Example

**Custom performers**

```js
const Checker = {
  check(operation) {
    /** You custom checking process **/
    if (operation.method.toUpperCase() === "DELETE") {
      operation.context.errors.checker.push({
        message: "Unauthorized."
      });
    }
  }
};

const Persister = {
  persist(operation) {
    /** Your custom persistence process **/
    operation.data.id = Math.random();
    operation.data.updatedAt = new Date().toISOString();
  },
  remove(operation) {
    /** Your custom remove process **/
    operation.data = null;
  }
};

const Provider = {
  getCollection(operation) {
    /** Your custom retrieve collection process **/
    operation.data = [
      { title: "Item " + Math.random() },
      { title: "Item " + Math.random() },
      { title: "Item " + Math.random() }
    ];
  },
  getItem(operation) {
    /** Your custom retrieve item process **/
    operation.data = { title: "Item B" };
  },
  getInstance(operation) {
    /** Your custom instantiation process **/
    operation.data = {};
  }
};

const Serializer = {
  serialize(operation) {
    /** You custom serialization process **/
    delete operation.data.context;
    delete operation.data.email;
  },
  deserialize(operation, data = {}) {
    /** You custom deserialization process **/
    Object.keys(data).map(property => {
      operation.data[property] = data[property];
    });
  }
};

const Validator = {
  validate(operation) {
    /** You custom validation process **/
    if (operation.method.toUpperCase() === "PUT") {
      operation.context.errors.validator.push({
        message: "Validation error"
      });
    }
  }
};
```

**Create ApiPack**

```js
const { ApiPack } = require("@kolinalabs/nodejs-api-pack");

const apiPack = new ApiPack();

apiPack.checker(Checker);
apiPack.persister(Persister);
apiPack.provider(Provider);
apiPack.serializer(Serializer);
apiPack.validator(Validator);
```

**Custom operations**

```js
const operation = [
  {
    type: "collection",
    method: "get",
    path: "/dummies"
  },
  {
    type: "collection",
    method: "post",
    path: "/dummies"
  },
  {
    type: "item",
    method: "get",
    path: "/dummies/:id"
  },
  {
    type: "item",
    method: "put",
    path: "/dummies/:id"
  },
  {
    type: "item",
    method: "delete",
    path: "/dummies/:id"
  }
];
```

**Using ExpressJS (+bodyParser.json)**

```js
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const app = express();

/** You custom stack **/
function Stack(operation) {
  return [
    // initialization
    (req, res, next) => {
      operation.context = {
        request: req,
        errors: {
          checker: [],
          validator: []
        }
      };
      ApiPack.operation = operation;
      req.ApiPack = ApiPack;
      next();
    },
    // read
    (req, res, next) => {
      req.ApiPack.read();
      next();
    },
    // deserialize
    (req, res, next) => {
      req.ApiPack.deserialize(req.body);
      next();
    },
    // check
    (req, res, next) => {
      req.ApiPack.check();
      if (req.ApiPack.errors("checker").length) {
        return res
          .status(req.ApiPack.operation.status || 401)
          .send(req.ApiPack.errors("checker"));
      }
      next();
    },
    // validate
    (req, res, next) => {
      req.ApiPack.validate();
      next();
    },
    // write
    (req, res, next) => {
      req.ApiPack.write();
      next();
    },
    // serialize
    (req, res, next) => {
      req.ApiPack.serialize();
      next();
    },
    // respond
    (req, res, next) => {
      let status = 200;
      if (!req.ApiPack.operation.data) {
        status = 204;
      } else if (req.ApiPack.operation.type === "collection") {
        status = 201;
      }
      res.status(status).send(req.ApiPack.operation.data);
    }
  ];
}

// configure routes
operations.forEach(operation => {
  router[operation.method](operation.path, Stack(operation));
});

app.use("/api-pack", router);
app.use(bodyParser.json());
app.listen(3007);
```

**Start your server**

```bash
$ node express-mocked.js
```

**Access the URLs**

```
GET: http://localhost:3007/api-pack/dummies

POST: http://localhost:3007/api-pack/dummies

GET: http://localhost:3007/api-pack/dummies/123456

PUT: http://localhost:3007/api-pack/dummies/123456

DELETE: http://localhost:3007/api-pack/dummies/123456
```
