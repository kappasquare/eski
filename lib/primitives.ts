
import casual from 'casual';

export const Primitives: Record<string, Function> = {
	country: function () { return casual.country; },
	city: function () { return casual.city; },
	zip: function () { return casual.zip(); },
	street: function () { return casual.street; },
	address: function () { return casual.address; },
	address1: function () { return casual.address1; },
	address2: function () { return casual.address2; },
	state: function () { return casual.state; },
	state_abbr: function () { return casual.state_abbr; },
	latitude: function () { return casual.latitude; },
	longitude: function () { return casual.longitude; },
	sentence: function () { return casual.sentence; },
	sentences: function (n: number) { return casual.sentences(n); },

	title: function () { return casual.title; },
	text: function () { return casual.text; },
	description: function () { return casual.description; },
	short_description: function () { return casual.short_description; },
	string: function () { return casual.string; },
	word: function () { return casual.word; },
	words: function (n: number) { return casual.words(n); },
	array_of_words: function (n: number) { return casual.array_of_words(n); },

	ip: function () { return casual.ip; },
	domain: function () { return casual.domain; },
	url: function () { return casual.url; },
	email: function () { return casual.email; },
	user_agent: function () { return casual.user_agent; },

	name: function () { return casual.name; },
	username: function () { return casual.username; },
	first_name: function () { return casual.first_name; },
	last_name: function () { return casual.last_name; },
	full_name: function () { return casual.full_name; },
	password: function () { return casual.password; },
	name_prefix: function () { return casual.name_prefix; },
	name_suffix: function () { return casual.name_suffix; },
	company_name: function () { return casual.company_name; },
	company_suffix: function () { return casual.company_suffix; },
	catch_phrase: function () { return casual.catch_phrase; },
	phone: function () { return casual.phone; },

	random: function () { return casual.random; },
	integer: function (args: { from: number, to: number }) { return casual.integer(args.from, args.to); },
	double: function (args: { from: number, to: number }) { return casual.double(args.from, args.to); },
	array_of_digits: function (n: number) { return casual.array_of_digits(n); },
	array_of_integers: function (n: number) { return casual.array_of_integers(n); },
	array_of_doubles: function (n: number) { return casual.array_of_doubles(n); },
	coin_flip: function () { return casual.coin_flip; },

	unix_time: function () { return casual.unix_time; },
	moment: function () { return casual.moment; },
	date: function (format: string) { return casual.date(format); },
	time: function (format: string) { return casual.time(format); },
	century: function () { return casual.century; },
	am_pm: function () { return casual.am_pm; },
	day_of_year: function () { return casual.day_of_year; },
	day_of_month: function () { return casual.day_of_month; },
	day_of_week: function () { return casual.day_of_week; },
	month_number: function () { return casual.month_number; },
	month_name: function () { return casual.month_name; },
	year: function () { return casual.year; },
	timezone: function () { return casual.timezone; },

	card_type: function () { return casual.card_type; },
	card_number: function (vendor: string) { return casual.card_number(vendor); },
	card_exp: function () { return casual.card_exp; },
	card_data: function () { return casual.card_data; },

	country_code: function () { return casual.country_code; },
	language_code: function () { return casual.language_code; },
	locale: function () { return casual.locale; },
	currency_code: function () { return (casual as any).currency_code; },
	currency_name: function () { return (casual as any).currency_name; },
	mime_type: function () { return casual.mime_type; },
	file_extension: function () { return casual.file_extension; },
	boolean: function () { return casual.boolean; },
	uuid: function () { return casual.uuid; },
	color_name: function () { return casual.color_name; },
	safe_color_name: function () { return casual.safe_color_name; },
	rgb_hex: function () { return casual.rgb_hex; },
	rgb_array: function () { return casual.rgb_array; },

	array_of: function (times: number, generator: any) { return casual.array_of(times, generator); },
	random_element: function (array: any[]) { return casual.random_element(array); },
	random_key: function (object: any) { return casual.random_key(object); },
	random_value: function (object: any) { return casual.random_value(object); },
	random_string: function (args: { min_length: number, max_length: number, extras: any[], exclude_digits: boolean, exclude_letters: boolean }) {
		return (casual as any).random_string({
			min_length: args.min_length, max_length: args.max_length, extras:
				args.extras, exclude_digits: args.exclude_digits, exclude_letters: args.exclude_letters
		});
	},

	register_provider: function (provider: string) { return casual.register_provider(provider); },
	numerify: function (format: string) { return casual.numerify(format); },
	randify: function (args: { format: string, extras: any[], exclude_digits: boolean, exclude_letters: boolean }) {
		return (casual as any).randify({
			format: args.format, extras: args.extras, exclude_digits: args.exclude_digits,
			exclude_letters: args.exclude_letters
		});
	},
	populate: function (format: string) { return casual.populate(format); },
	populate_one_of: function (formats: string[]) { return (casual as any).numerify(formats); },

};
