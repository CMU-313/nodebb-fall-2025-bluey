
/* eslint-disable strict */
//var request = require('request');

const translatorApi = module.exports;

translatorApi.translate = async function (postData) {
	const TRANSLATOR_API = process.env.TRANSLATOR_API || 'http://translator:5000';
	const response = await fetch(`${TRANSLATOR_API}/?content=${encodeURIComponent(postData.content)}`);
	const data = await response.json();
	return [data.is_english, data.translated_content];
};
