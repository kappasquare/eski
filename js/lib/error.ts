export class ListConditionsNotFound extends Error {
    constructor() {
        super(`Missing ':min_length' and ':max_length' conditions for list schema.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

export class ValueNotFound extends Error {
    constructor() {
        super(`Missing ':value' details for schema.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

export class ListValueIsNotFound extends Error {
    constructor() {
        super(`Missing ':is' detail for list schema.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

export class PrimitiveMissing extends Error {
    constructor(type: string) {
        super(`Missing primitive '${type}'. Did you include/register the custom primitives? Check docs for more information.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

export class ConditionsMissing extends Error {
    constructor(type: string) {
        super(`Missing ':conditions' for primitive '${type}' in schema.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

export class PrimitiveNotDefined extends Error {
    constructor(type: string) {
        super(`Primitive '${type}' needs a defintion to be registered. Provide a function definition or check docs for more information.`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

export class SchemaInvalid extends Error {
    constructor() {
        super('Invalid schema provided.')
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
};

export class CustomPrimitivesPathInvalid extends Error {
    constructor(path: string) {
        super(`Unable to load primitives from path (${path}).`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

export class RouteConfigurationPathInvalid extends Error {
    constructor(route: string) {
        super(`Unable to load route configurations from (${route}).`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnableToLoadSchema extends Error {
    constructor(path: string) {
        super(`Unable to load schema from (${path}). Verify the paths to schemas provided in route configurations.
        \n NOTE: Schema paths MUST be absolute paths and not relative paths!\n`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

export class RouteConfigurationsNotProvided extends Error {
    constructor() {
        super(`Unable to start Eski! No route configuration provided!`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ServerNotUp extends Error {
    constructor() {
        super(`Eski Server was not started!`)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}
