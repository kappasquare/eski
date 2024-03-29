"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitives = void 0;
var casual_1 = __importDefault(require("casual"));
exports.Primitives = {
    country: function () { return casual_1.default.country; },
    city: function () { return casual_1.default.city; },
    zip: function () { return casual_1.default.zip(); },
    street: function () { return casual_1.default.street; },
    address: function () { return casual_1.default.address; },
    address1: function () { return casual_1.default.address1; },
    address2: function () { return casual_1.default.address2; },
    state: function () { return casual_1.default.state; },
    state_abbr: function () { return casual_1.default.state_abbr; },
    latitude: function () { return casual_1.default.latitude; },
    longitude: function () { return casual_1.default.longitude; },
    sentence: function () { return casual_1.default.sentence; },
    sentences: function (n) { return casual_1.default.sentences(n); },
    title: function () { return casual_1.default.title; },
    text: function () { return casual_1.default.text; },
    description: function () { return casual_1.default.description; },
    short_description: function () { return casual_1.default.short_description; },
    string: function () { return casual_1.default.string; },
    word: function () { return casual_1.default.word; },
    words: function (n) { return casual_1.default.words(n); },
    array_of_words: function (n) { return casual_1.default.array_of_words(n); },
    ip: function () { return casual_1.default.ip; },
    domain: function () { return casual_1.default.domain; },
    url: function () { return casual_1.default.url; },
    email: function () { return casual_1.default.email; },
    user_agent: function () { return casual_1.default.user_agent; },
    name: function () { return casual_1.default.name; },
    username: function () { return casual_1.default.username; },
    first_name: function () { return casual_1.default.first_name; },
    last_name: function () { return casual_1.default.last_name; },
    full_name: function () { return casual_1.default.full_name; },
    password: function () { return casual_1.default.password; },
    name_prefix: function () { return casual_1.default.name_prefix; },
    name_suffix: function () { return casual_1.default.name_suffix; },
    company_name: function () { return casual_1.default.company_name; },
    company_suffix: function () { return casual_1.default.company_suffix; },
    catch_phrase: function () { return casual_1.default.catch_phrase; },
    phone: function () { return casual_1.default.phone; },
    random: function () { return casual_1.default.random; },
    integer: function (args) { return casual_1.default.integer(args.from, args.to); },
    double: function (args) { return casual_1.default.double(args.from, args.to); },
    array_of_digits: function (n) { return casual_1.default.array_of_digits(n); },
    array_of_integers: function (n) { return casual_1.default.array_of_integers(n); },
    array_of_doubles: function (n) { return casual_1.default.array_of_doubles(n); },
    coin_flip: function () { return casual_1.default.coin_flip; },
    unix_time: function () { return casual_1.default.unix_time; },
    moment: function () { return casual_1.default.moment; },
    date: function (format) { return casual_1.default.date(format); },
    time: function (format) { return casual_1.default.time(format); },
    century: function () { return casual_1.default.century; },
    am_pm: function () { return casual_1.default.am_pm; },
    day_of_year: function () { return casual_1.default.day_of_year; },
    day_of_month: function () { return casual_1.default.day_of_month; },
    day_of_week: function () { return casual_1.default.day_of_week; },
    month_number: function () { return casual_1.default.month_number; },
    month_name: function () { return casual_1.default.month_name; },
    year: function () { return casual_1.default.year; },
    timezone: function () { return casual_1.default.timezone; },
    card_type: function () { return casual_1.default.card_type; },
    card_number: function (vendor) { return casual_1.default.card_number(vendor); },
    card_exp: function () { return casual_1.default.card_exp; },
    card_data: function () { return casual_1.default.card_data; },
    country_code: function () { return casual_1.default.country_code; },
    language_code: function () { return casual_1.default.language_code; },
    locale: function () { return casual_1.default.locale; },
    currency_code: function () { return casual_1.default.currency_code; },
    currency_name: function () { return casual_1.default.currency_name; },
    mime_type: function () { return casual_1.default.mime_type; },
    file_extension: function () { return casual_1.default.file_extension; },
    boolean: function () { return casual_1.default.boolean; },
    uuid: function () { return casual_1.default.uuid; },
    color_name: function () { return casual_1.default.color_name; },
    safe_color_name: function () { return casual_1.default.safe_color_name; },
    rgb_hex: function () { return casual_1.default.rgb_hex; },
    rgb_array: function () { return casual_1.default.rgb_array; },
    array_of: function (times, generator) { return casual_1.default.array_of(times, generator); },
    random_element: function (array) { return casual_1.default.random_element(array); },
    random_key: function (object) { return casual_1.default.random_key(object); },
    random_value: function (object) { return casual_1.default.random_value(object); },
    random_string: function (args) {
        return casual_1.default.random_string({
            min_length: args.min_length, max_length: args.max_length, extras: args.extras, exclude_digits: args.exclude_digits, exclude_letters: args.exclude_letters
        });
    },
    register_provider: function (provider) { return casual_1.default.register_provider(provider); },
    numerify: function (format) { return casual_1.default.numerify(format); },
    randify: function (args) {
        return casual_1.default.randify({
            format: args.format, extras: args.extras, exclude_digits: args.exclude_digits,
            exclude_letters: args.exclude_letters
        });
    },
    populate: function (format) { return casual_1.default.populate(format); },
    populate_one_of: function (formats) { return casual_1.default.numerify(formats); },
};
