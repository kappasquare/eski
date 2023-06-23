"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("./error");
var primitives_1 = require("./primitives");
var KEYWORDS_GENERIC = Object.freeze({
    IS: ":is",
    KEY: ":key:",
    VALUE: ":value",
    CONDITIONS: ":conditions"
});
var KEYWORDS_LIST = Object.freeze({
    MIN_LENGTH: ":min_length",
    MAX_LENGTH: ":max_length"
});
var TYPE_CONTAINERS = Object.freeze({
    LIST: "list",
    OBJECT: "object"
});
function checkType(of, value) {
    return Object.keys(of).find(function (key) { return of[key] === value; });
}
;
function isListOrObject(value) {
    return checkType(TYPE_CONTAINERS, value);
}
;
function checkIfList(value) {
    return value == TYPE_CONTAINERS.LIST;
}
;
function isKey(value) {
    return value.toString().includes(KEYWORDS_GENERIC.KEY) ?
        value.split(KEYWORDS_GENERIC.KEY).pop() : false;
}
;
var SchemaProcessor = /** @class */ (function () {
    function SchemaProcessor() {
        var _this = this;
        this.schema = {};
        this.process = function () { return _this._process(_this.schema); };
        this.setSchema = function (schema) { return _this.schema = schema; };
        this.deregister = function (name) { return delete primitives_1.Primitives[name]; };
    }
    SchemaProcessor.prototype.processList = function (schema, response) {
        var _value = schema[KEYWORDS_GENERIC.VALUE];
        if (!schema[KEYWORDS_LIST.MIN_LENGTH] || !schema[KEYWORDS_LIST.MAX_LENGTH])
            throw new error_1.ListConditionsNotFound();
        if (!_value[KEYWORDS_GENERIC.IS])
            throw new error_1.ListValueIsNotFound();
        for (var _ in Array.from(Array(primitives_1.Primitives.integer({
            from: schema[KEYWORDS_LIST.MIN_LENGTH],
            to: schema[KEYWORDS_LIST.MAX_LENGTH]
        })).keys())) {
            response.push(this._process(_value));
        }
        ;
        return response;
    };
    ;
    SchemaProcessor.prototype.processObjecct = function (schema, response) {
        var _value = schema[KEYWORDS_GENERIC.VALUE];
        for (var key in _value) {
            var extractedKey = isKey(key);
            if (extractedKey) {
                var _processed = this._process(_value[key]);
                if ((!!response) && (response.constructor === Array))
                    response[extractedKey].push(_processed);
                else
                    response[extractedKey] = _processed;
            }
            ;
        }
        ;
        return response;
    };
    ;
    SchemaProcessor.prototype.processPrimitive = function (type, conditions) {
        try {
            return primitives_1.Primitives[type](conditions);
        }
        catch (error) {
            if (error instanceof TypeError) {
                if (error.message.includes('is not a function')) {
                    throw new error_1.PrimitiveMissing(type);
                }
                else if (error.message.includes('Cannot read property')) {
                    throw new error_1.ConditionsMissing(type);
                }
            }
        }
    };
    ;
    SchemaProcessor.prototype._process = function (schema) {
        var is = schema[KEYWORDS_GENERIC.IS];
        if (isListOrObject(is)) {
            if (!schema[KEYWORDS_GENERIC.VALUE])
                throw new error_1.ValueNotFound();
            return checkIfList(is) ? this.processList(schema, []) : this.processObjecct(schema, {});
        }
        else
            return this.processPrimitive(is, schema[KEYWORDS_GENERIC.CONDITIONS]);
    };
    ;
    SchemaProcessor.prototype.register = function (name, fn) {
        if (!fn)
            throw new error_1.PrimitiveNotDefined(name);
        primitives_1.Primitives[name] = fn;
    };
    return SchemaProcessor;
}());
;
exports.default = SchemaProcessor;
