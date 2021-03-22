const req = require('request-promise');
const config = require('../config');

let logger = global.logger;

let e = {};

e.handleError = (_err, _res) => {
	if (_err.statusCode) return _res.status(_err.statusCode).json(_err.error)
	_res.status(400).json({ "message": _err.message })
}

e.login = (_url, _data) => {
	return req({
		uri: `${_url}${config.apis.login}`,
		method: 'POST',
		json: true,
		body: _data,
	});
};

e.logout = (_url, _req) => {
	return req({
		uri: `${_url}${config.apis.logout}`,
		method: 'DELETE',
		json: true,
		headers: {
			'Authorization': _req.get('Authorization')
		}
	});
};

e.check = (_url, _req) => {
	return req({
		uri: `${_url}${config.apis.check}`,
		method: 'GET',
		json: true,
		headers: {
			'Authorization': _req.get('Authorization')
		}
	});
}

e.call = async (_req, _method, _url, _type, _qs, _data) => {
	logger.debug(`Outbound call :: ${_method} ${_url}`);
	const options = {
		uri: `${_url}${config.apis[_type]}`,
		method: _method,
		qs: _qs,
		json: true,
		headers: {
			'Authorization': _req.get('Authorization')
		}
	};
	if (_data) options['body'] = _data;
	return req(options);
};

module.exports = e;