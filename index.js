"use strict";

const prompt = require("./prompt.js");
const del = require("./delete.js");
const waterfall = require("async").waterfall;

waterfall([
		prompt,
		(config, cb) => del(config, cb)
	],
	(err, result) => {
		if(err) {
			console.error("ERROR", err);
		}
		else {
			console.log("Completed");
		}
	}
);
