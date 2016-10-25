"use strict";

const prompt = require("prompt");

module.exports = (cb) => {

	const schema = {
		properties: {
			email: {
				description: "Your e-mail address (e.g. you@your.company.com)",
				pattern: /.+@.+/,
				required: true
			},
			password: {
				description: "Your password (hidden input)",
				pattern: /.+/,
				hidden: true,
				required: true
			},
			site: {
				description: "Base URL (e.g. https://hipchat.your.company.com)",
				pattern: /.+/,
				required: true
			},
			memberIdOther: {
				description: "Other member's (numeric) member ID (e.g. 1201)",
				pattern: /^[0-9]+$/,
				required: true
			},
			dateFrom: {
				description: "Delete messages from (e.g. 2016-01-31)",
				pattern: /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/,
				required: true
			},
			dateUntil: {
				description: "Delete messages until (e.g. 2016-05-31)",
				pattern: /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/,
				required: true
			}
		}
	};

	prompt.start();
	prompt.get(schema, cb);
};
