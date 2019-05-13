# NodeJS Api Pack

A simple package for standardizing API operations.

This package provides the configuration base for executing API operations through the [GET, POST, PUT, DELETE] methods.

The package does not provide operations performers, just an interface to access the features configured for each step of the operations.

## Basic concept

READ >> DESERIALIZE >> CHECK >> VALIDATE >> WRITE >> SERIALIZE

| STEP        | DESCRIPTION                                        | OPERATOR   |
| ----------- | -------------------------------------------------- | ---------- |
| READ        | Retrieve data (item/collection/custom/null)        | provider   |
| DESERIALIZE | Update resource/entity retrieved with request data | serializer |
| CHECK       | Check the resource access permissions              | checker    |
| VALIDATE    | Validate the populated/deserialized data           | validator  |
| WRITE       | Persist/update/delete data                         | persister  |
| SERIALIZE   | Serialize data before response                     | serializer |

### Operadores

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
