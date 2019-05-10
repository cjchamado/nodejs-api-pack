const PathResolver = require("./path-resolver");

const scopes = {
  paginate: "get",
  create: "post",
  retrieve: "get",
  update: "put",
  remove: "delete"
};

const create = (name, scope = null) => {
  switch (scope) {
    case "paginate":
    case "create":
      return {
        type: "collection",
        path: PathResolver.resolveOperationPath(name, "collection"),
        method: scopes[scope],
        data: null
      };
    case "retrieve":
    case "update":
    case "remove":
      return {
        type: "item",
        path: PathResolver.resolveOperationPath(name, "item"),
        method: scopes[scope],
        data: null
      };
    default:
      return [
        create(name, "paginate"),
        create(name, "create"),
        create(name, "retrieve"),
        create(name, "update"),
        create(name, "remove")
      ];
      break;
  }
};

module.exports = {
  scopes,
  create
};
