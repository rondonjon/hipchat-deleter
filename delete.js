"use strict";

const request = require("request").defaults({jar: true});
const dateformat = require("dateformat");
const cheerio = require("cheerio");
const async = require("async");
const sleep = require("sleep-async")();
const prompt = require("prompt");

function calcDays(dFrom, dUntil) {

	const day = 86400000;
	var days = [], i;

	for (i = new Date(dFrom.getTime()); i <= dUntil; i = new Date(i.getTime() + day)) {
		days.push(i);
	}

	return days;
}

module.exports = function(config, cb, /*optional*/ log) {

	log = log || console.log.bind(console);

	function signin(cb) {

		log("Loading start page");

		request({
			method: "POST",
			uri: `${config.site}/sign_in`
		},
		(err, data) => {

			if(err) {
				cb(err);
				return;
			}

			const $ = cheerio.load(data.body);
			const token = $("input[name='xsrf_token']").val();

			if(!token) {
				cb(new Error("sign_in received no xsrf_token"));
				return;
			}

			log("Signing in");

			request({
				method: "POST",
				uri: `${config.site}/sign_in`,
				formData: {
					xsrf_token: token,
					email: config.email,
					password: config.password
				}
			},
			cb);
		});
	}

	function wipeDay(day, cb) {

		const dateStr = dateformat(day, "yyyy/mm/dd");
		const uri = `${config.site}/history/member/${config.memberIdOther}/${dateStr}`;

		log(`Fetching conversation for ${dateStr}`);

		request({
			method: "GET",
			uri: uri
		},
		(err, data) => {

			if(err) {
				cb(err);
				return;
			}

			const $ = cheerio.load(data.body);
			const dateStr = dateformat(day, "yyyy/mm/dd");
			const $messages = $(`form[action='${uri}']`);
			const mcount = $messages.length;

			log(`  ${mcount} messages found`);

			if($messages.length === 0) {
				const delay = Math.floor(Math.random() * 2000 + 1000);
				console.log(`  Waiting ${delay} ms`);
				sleep.sleep(delay, cb);
				return;
			}

			const $m = $messages.first();
			const token = $m.find("input[name='xsrf_token']").val();
			const mid = $m.find("input[name='message_id']").val();
			const mix = $m.find("input[name='message_index']").val();

			if(!token) {
				cb(new Error("delete form has no xsrf_token"));
				return;
			}

			if(!mid) {
				cb(new Error("delete form has no message_id"));
				return;
			}

			if(!mix) {
				cb(new Error("delete form has no message_index"));
				return;
			}

			log(`  Deleting message: ${dateStr} ${mid}`);

			const p = {
				method: "POST",
				uri: uri,
				formData: {
					action: "delete",
					message_id: mid,
					message_index: mix,
					xsrf_token: token
				}
			};

			request(
				p,
				(err, data) => {
					if(err) {
						cb(err);
					}
					else {
						// recursive deleting
						wipeDay(day, cb);
					}
			});
		});
	}

	const steps = [ signin ];

	const dateFrom = config.dateFrom instanceof Date ? config.dateFrom : new Date(config.dateFrom);
	const dateUntil = config.dateUntil instanceof Date ? config.dateUntil : new Date(config.dateUntil);
	const days = calcDays(dateFrom, dateUntil);

	days.forEach(day => steps.push(wipeDay.bind(null, day)));

	async.series(steps, cb);
};
