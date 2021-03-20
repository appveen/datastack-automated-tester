module.exports = {
	"datastack": {
		"URL": process.env.URL || "https://localhost",
		"USERNAME": process.env.USERNAME || "admin",
		"PASSWORD": process.env.PASSWORD || "password"
	},
	"logging": {
		"loglevel": process.env.LOG_LEVEL || "info",
		"options": {
			"appenders": {
				"out": {
					"type": 'stdout',
					"layout": { type: 'basic' }
				}
			},
			"categories": {
				"default": {
					"appenders": ['out'],
					"level": 'error'
				}
			}
		}
	}
}