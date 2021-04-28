module.exports = {
	'logging': {
		'loglevel': process.env.LOG_LEVEL || 'info',
		'options': {
			'appenders': {
				'out': {
					'type': 'stdout',
					'layout': { type: 'basic' }
				}
			},
			'categories': {
				'default': {
					'appenders': ['out'],
					'level': 'error'
				}
			}
		}
	}
};