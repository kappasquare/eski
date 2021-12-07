class ListConditionsNotFound extends Error {
    constructor(schema) {
        super(`Missing ':min_length' and ':max_length' conditions for list schema.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

class ValueNotFound extends Error {
    constructor(schema) {
        super(`Missing ':value' details for schema.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

class ListValueIsNotFound extends Error {
    constructor(schema) {
        super(`Missing ':is' detail for list schema.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

class PrimitiveMissing extends Error {
    constructor(type) {
        super(`Missing primitive '${type}'. Did you include/register the custom primitives? Check docs for more information.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

class ConditionsMissing extends Error {
    constructor(type) {
        super(`Missing ':conditions' for primitive '${type}' in schema.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

class PrimitiveNotDefined extends Error {
    constructor(type) {
        super(`Primitive '${type}' needs a defintion to be registered. Provide a function definition or check docs for more information.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

class SchemaInvalid extends Error {
    constructor(route) {
        super('Invalid schema provided.')
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

class CustomPrimitivesPathInvalid extends Error {
    constructor(primitives) {
        super(`Unable to load primitives from path (${primitives}).`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

class RouteConfigurationPathInvalid extends Error {
    constructor(route) {
        super(`Unable to load route configurations from (${route}).`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

class SchemaPathInvalid extends Error {
    constructor(schema) {
        super(`Unable to load schema from (${schema}). Verify the paths to schemas provided in route configurations.
        \n NOTE: Schema paths MUST be absolute paths and not relative paths!\n`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

class RouteConfigurationsNotProvided extends Error {
    constructor() {
        super(`Unable to start Eskimo! No route configuration provided!`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    ValueNotFound,
    ListConditionsNotFound,
    ListValueIsNotFound,
    ConditionsMissing,
    PrimitiveMissing,
    PrimitiveNotDefined,
    SchemaInvalid,
    CustomPrimitivesPathInvalid,
    RouteConfigurationPathInvalid,
    SchemaPathInvalid,
    RouteConfigurationsNotProvided,
}