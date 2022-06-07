const path = require('path');
const { app } = require('electron');
module.exports = {
	APP_NAME: 'Reminder',
	INIT_DATA: '{"oneTime":[],"daily":[],"weekly":[],"monthly":[],"yearly":[]}',
	FILE_PATH: !app.isPackaged
		? path.join(app.getAppPath(), 'data.json')
		: path.join(app.getAppPath(), '..', 'data.json'),
};
