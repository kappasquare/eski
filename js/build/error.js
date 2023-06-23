"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerNotUp = exports.RouteConfigurationsNotProvided = exports.UnableToLoadSchema = exports.RouteConfigurationPathInvalid = exports.CustomPrimitivesPathInvalid = exports.SchemaInvalid = exports.PrimitiveNotDefined = exports.ConditionsMissing = exports.PrimitiveMissing = exports.ListValueIsNotFound = exports.ValueNotFound = exports.ListConditionsNotFound = void 0;
var ListConditionsNotFound = /** @class */ (function (_super) {
    __extends(ListConditionsNotFound, _super);
    function ListConditionsNotFound() {
        var _this = _super.call(this, "Missing ':min_length' and ':max_length' conditions for list schema.") || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ListConditionsNotFound;
}(Error));
exports.ListConditionsNotFound = ListConditionsNotFound;
;
var ValueNotFound = /** @class */ (function (_super) {
    __extends(ValueNotFound, _super);
    function ValueNotFound() {
        var _this = _super.call(this, "Missing ':value' details for schema.") || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ValueNotFound;
}(Error));
exports.ValueNotFound = ValueNotFound;
;
var ListValueIsNotFound = /** @class */ (function (_super) {
    __extends(ListValueIsNotFound, _super);
    function ListValueIsNotFound() {
        var _this = _super.call(this, "Missing ':is' detail for list schema.") || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ListValueIsNotFound;
}(Error));
exports.ListValueIsNotFound = ListValueIsNotFound;
;
var PrimitiveMissing = /** @class */ (function (_super) {
    __extends(PrimitiveMissing, _super);
    function PrimitiveMissing(type) {
        var _this = _super.call(this, "Missing primitive '".concat(type, "'. Did you include/register the custom primitives? Check docs for more information.")) || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return PrimitiveMissing;
}(Error));
exports.PrimitiveMissing = PrimitiveMissing;
;
var ConditionsMissing = /** @class */ (function (_super) {
    __extends(ConditionsMissing, _super);
    function ConditionsMissing(type) {
        var _this = _super.call(this, "Missing ':conditions' for primitive '".concat(type, "' in schema.")) || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ConditionsMissing;
}(Error));
exports.ConditionsMissing = ConditionsMissing;
;
var PrimitiveNotDefined = /** @class */ (function (_super) {
    __extends(PrimitiveNotDefined, _super);
    function PrimitiveNotDefined(type) {
        var _this = _super.call(this, "Primitive '".concat(type, "' needs a defintion to be registered. Provide a function definition or check docs for more information.")) || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return PrimitiveNotDefined;
}(Error));
exports.PrimitiveNotDefined = PrimitiveNotDefined;
;
var SchemaInvalid = /** @class */ (function (_super) {
    __extends(SchemaInvalid, _super);
    function SchemaInvalid() {
        var _this = _super.call(this, 'Invalid schema provided.') || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return SchemaInvalid;
}(Error));
exports.SchemaInvalid = SchemaInvalid;
;
var CustomPrimitivesPathInvalid = /** @class */ (function (_super) {
    __extends(CustomPrimitivesPathInvalid, _super);
    function CustomPrimitivesPathInvalid(path) {
        var _this = _super.call(this, "Unable to load primitives from path (".concat(path, ").")) || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return CustomPrimitivesPathInvalid;
}(Error));
exports.CustomPrimitivesPathInvalid = CustomPrimitivesPathInvalid;
var RouteConfigurationPathInvalid = /** @class */ (function (_super) {
    __extends(RouteConfigurationPathInvalid, _super);
    function RouteConfigurationPathInvalid(route) {
        var _this = _super.call(this, "Unable to load route configurations from (".concat(route, ").")) || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return RouteConfigurationPathInvalid;
}(Error));
exports.RouteConfigurationPathInvalid = RouteConfigurationPathInvalid;
var UnableToLoadSchema = /** @class */ (function (_super) {
    __extends(UnableToLoadSchema, _super);
    function UnableToLoadSchema(path) {
        var _this = _super.call(this, "Unable to load schema from (".concat(path, "). Verify the paths to schemas provided in route configurations.\n        \n NOTE: Schema paths MUST be absolute paths and not relative paths!\n")) || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return UnableToLoadSchema;
}(Error));
exports.UnableToLoadSchema = UnableToLoadSchema;
var RouteConfigurationsNotProvided = /** @class */ (function (_super) {
    __extends(RouteConfigurationsNotProvided, _super);
    function RouteConfigurationsNotProvided() {
        var _this = _super.call(this, "Unable to start Eski! No route configuration provided!") || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return RouteConfigurationsNotProvided;
}(Error));
exports.RouteConfigurationsNotProvided = RouteConfigurationsNotProvided;
var ServerNotUp = /** @class */ (function (_super) {
    __extends(ServerNotUp, _super);
    function ServerNotUp() {
        var _this = _super.call(this, "Eski Server was not started!") || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ServerNotUp;
}(Error));
exports.ServerNotUp = ServerNotUp;
