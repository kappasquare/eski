import {
    ValueNotFound,
    ListConditionsNotFound,
    ListValueIsNotFound,
    ConditionsMissing,
    PrimitiveMissing,
    PrimitiveNotDefined
} from './error';
import { Primitives } from './primitives';

const KEYWORDS_GENERIC = Object.freeze({
    IS: ":is",
    KEY: ":key:",
    VALUE: ":value",
    CONDITIONS: ":conditions"
});

const KEYWORDS_LIST = Object.freeze({
    MIN_LENGTH: ":min_length",
    MAX_LENGTH: ":max_length"
});

const TYPE_CONTAINERS = Object.freeze({
    LIST: "list",
    OBJECT: "object"
});

function checkType(of: Readonly<any>, value: string) {
    return Object.keys(of).find(key => of[key] === value);
};

function isListOrObject(value: string) {
    return checkType(TYPE_CONTAINERS, value);
};

function checkIfList(value: string) {
    return value == TYPE_CONTAINERS.LIST;
};

function isKey(value: string) {
    return value.toString().includes(KEYWORDS_GENERIC.KEY) ?
        value.split(KEYWORDS_GENERIC.KEY).pop() : false;
};


class SchemaProcessor {
    private schema: Record<string, any> = {};

    private processList(schema: Record<string, any>, response: any[]): any[] {
        const _value = schema[KEYWORDS_GENERIC.VALUE];
        if (!schema[KEYWORDS_LIST.MIN_LENGTH] || !schema[KEYWORDS_LIST.MAX_LENGTH]) throw new ListConditionsNotFound(); 
        if (!_value[KEYWORDS_GENERIC.IS]) throw new ListValueIsNotFound();
        for (var _ in Array.from(Array(Primitives.integer({
            from: schema[KEYWORDS_LIST.MIN_LENGTH],
            to: schema[KEYWORDS_LIST.MAX_LENGTH]
        })).keys())) {
            response.push(this._process(_value));
        };
        return response;
    };

    private processObjecct(schema: Record<string, any>, response: Record<string, any[]>) {
        const _value = schema[KEYWORDS_GENERIC.VALUE];
        for (var key in _value) {
            const extractedKey = isKey(key);
            if (extractedKey) {
                const _processed = this._process(_value[key]);
                if ((!!response) && (response.constructor === Array)) (response[extractedKey] as Array<any>).push(_processed)
                else response[extractedKey] = _processed;
            };
        };
        return response;
    };


    private processPrimitive(type: string, conditions: any) {
        try { return Primitives[type](conditions); }
        catch (error) {
            if (error instanceof TypeError) {
                if (error.message.includes('is not a function')) {
                    throw new PrimitiveMissing(type);
                } else if (error.message.includes('Cannot read property')) {
                    throw new ConditionsMissing(type);
                }
            }
        }
    };

    private _process(schema: Record<string, any>) {
        const is = schema[KEYWORDS_GENERIC.IS];
        if (isListOrObject(is)) {
            if (!schema[KEYWORDS_GENERIC.VALUE]) throw new ValueNotFound();
            return checkIfList(is) ? this.processList(schema, []) : this.processObjecct(schema, {});
        } else return this.processPrimitive(is, schema[KEYWORDS_GENERIC.CONDITIONS]);
    };

    register(name: string, fn: Function) {
        if (!fn) throw new PrimitiveNotDefined(name);
        Primitives[name] = fn;
    }

    process = () => this._process(this.schema);

    setSchema = (schema: Record<string, any>) => this.schema = schema;

    deregister = (name: string) => delete Primitives[name];
};

export default SchemaProcessor;