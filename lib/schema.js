
const primitives = require('./primitives.js');

const {
    ValueNotFound,
    ListConditionsNotFound,
    ListValueIsNotFound,
    ConditionsMissing,
    PrimitiveMissing,
    PrimitiveNotDefined
} = require('./error.js')

const KEYWORDS_GENERIC = Object.freeze({
    IS: ":is",
    KEY: ":key:",
    VALUE: ":value",
    CONDITIONS: ":conditions"
});

const KEYWORDS_LIST = Object.freeze({
    MIN_LENGTH : ":min_length",
    MAX_LENGTH : ":max_length"
});

const TYPE_CONTAINERS = Object.freeze({
    LIST: "list",
    OBJECT: "object"
});

function checkType(of, value) {
    return Object.keys(of).find(key => of[key] === value);
};

function isPrimitive(value) {
    return checkType(TYPE_CONTAINERS, value);
};

function isList(value) {
    return value == TYPE_CONTAINERS.LIST;
};

function isKey(value) {
    return value.toString().includes(KEYWORDS_GENERIC.KEY) ? 
                    value.split(KEYWORDS_GENERIC.KEY).pop() : false;
};


class SchemaProcessor {

    CONTAINER_PROCESSORS = Object.freeze({
        LIST: this._processList,
        OBJECT: this._processObject
    });
    
    _processList(schema, response){
        const _value = schema[KEYWORDS_GENERIC.VALUE];
        if (!schema[KEYWORDS_LIST.MIN_LENGTH] || !schema[KEYWORDS_LIST.MAX_LENGTH]) {
            throw new ListConditionsNotFound(schema);
        } if (!_value[KEYWORDS_GENERIC.IS]) {
            throw new ListValueIsNotFound(schema);
        }
        for (var _ in Array.from(Array(primitives.integer({from: schema[KEYWORDS_LIST.MIN_LENGTH], 
                                        to: schema[KEYWORDS_LIST.MAX_LENGTH]})).keys())) {
            response.push(this._process(_value));
        };
        return response;
    };

    _processObject(schema, response) {
        const _value = schema[KEYWORDS_GENERIC.VALUE];
        for (var key in _value) {
            const _extractedKey = isKey(key);
            if (_extractedKey) {
                const _processed = this._process(_value[key]);
                (!!response) && (response.constructor === Array) ? response[_extractedKey].push(_processed) : 
                                    response[_extractedKey] = _processed;
            };
        };
        return response;
    };


    _processPrimitive(type, conditions) {
        try { return primitives[type](conditions); } 
        catch (error) {
            if (error instanceof TypeError) { 
                if (error.message.includes('is not a function')) {
                    throw new PrimitiveMissing(type); 
                } else if (error.message.includes('Cannot read property')){
                    throw new ConditionsMissing(type);
                }
            }
        }
    };

    _process(schema) {
        const _is = schema[KEYWORDS_GENERIC.IS];
        const _isPrimitive = isPrimitive(_is);
        if (_isPrimitive) {
            const _isList = isList(_is);
            const _value = schema[KEYWORDS_GENERIC.VALUE];
            if (!_value) {
                throw new ValueNotFound(schema);
            }
            return _isList ? this._processList(schema, []) : this._processObject(schema, {});
        } else {
            return this._processPrimitive(_is, schema[KEYWORDS_GENERIC.CONDITIONS]);
        };
    };

    process() {
        return this._process(this.schema);
    }

    set_schema(schema) {
        this.schema = schema;
    }


    register(name, fn) {
        if (!fn) throw new PrimitiveNotDefined(name);
        primitives[name] = fn;
    }

    deregister(name) {
        delete primitives[name];
    }
};

module.exports = SchemaProcessor;