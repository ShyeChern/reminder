const { ipcMain } = require('electron');
const fs = require('fs');
const constants = require('../utils/constants');
// const { shuffleArray } = require('../utils/functions');

/**
 * Return ipcMain function that can invoke from renderer process
 * @param {BrowserWindow} mainWindow parent browser window
 * @return {ipcMain} ipcMain function
 */
module.exports.init = (mainWindow) => {
	// Initialize event data
	ipcMain.handle('init-data', async () => {
		const data = fs.readFileSync(constants.FILE_PATH);
		return JSON.parse(data);
	});

	// Add/Edit Event
	ipcMain.handle('submit-event', async (e, data) => {
		let file = JSON.parse(fs.readFileSync(constants.FILE_PATH));
		if (data.id) {
			file.oneTime = file.oneTime.filter((value) => value.id !== data.id);
			file.daily = file.daily.filter((value) => value.id !== data.id);
			file.weekly = file.weekly.filter((value) => value.id !== data.id);
			file.monthly = file.monthly.filter((value) => value.id !== data.id);
			file.yearly = file.yearly.filter((value) => value.id !== data.id);
		}
		switch (data.frequency) {
			case '0': {
				file.oneTime.push({ ...data, id: new Date().getTime().toString() });
				break;
			}
			case '1': {
				file.daily.push({ ...data, id: new Date().getTime().toString() });
				break;
			}
			case '2': {
				file.weekly.push({ ...data, id: new Date().getTime().toString() });
				break;
			}
			case '3': {
				file.monthly.push({ ...data, id: new Date().getTime().toString() });
				break;
			}
			case '4': {
				file.yearly.push({ ...data, id: new Date().getTime().toString() });
				break;
			}
		}
		fs.writeFileSync(constants.FILE_PATH, JSON.stringify(file));
		return true;
	});

	ipcMain.handle('delete-event', async (e, id) => {
		this.deleteEvent(id);
	});

	ipcMain.handle('get-event', async (e, id) => {
		let file = JSON.parse(fs.readFileSync(constants.FILE_PATH));
		let data;
		data = file.oneTime.find((value) => value.id === id);
		data = data || file.daily.find((value) => value.id === id);
		data = data || file.weekly.find((value) => value.id === id);
		data = data || file.monthly.find((value) => value.id === id);
		data = data || file.yearly.find((value) => value.id === id);
		return data;
	});
};

module.exports.deleteEvent = (id) => {
	let file = JSON.parse(fs.readFileSync(constants.FILE_PATH));
	if (id) {
		file.oneTime = file.oneTime.filter((value) => value.id !== id);
		file.daily = file.daily.filter((value) => value.id !== id);
		file.weekly = file.weekly.filter((value) => value.id !== id);
		file.monthly = file.monthly.filter((value) => value.id !== id);
		file.yearly = file.yearly.filter((value) => value.id !== id);
	}
	fs.writeFileSync(constants.FILE_PATH, JSON.stringify(file));
	return true;
};
