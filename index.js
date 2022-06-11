const { app, BrowserWindow, Menu, Notification } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { customMenu } = require('./src/components/menu');
const { customTray } = require('./src/components/tray');
const constants = require('./src/utils/constants');
const api = require('./src/api/index');
const fs = require('fs');
const schedule = require('node-schedule');
let tray = null;
app.setLoginItemSettings({ openAtLogin: app.isPackaged });

if (!app.isPackaged) {
	app.setAppUserModelId('electron.dev.app');
}

let main;
const notifiedEvents = [];
function createWindow() {
	main = new BrowserWindow({
		title: constants.APP_NAME,
		width: 900,
		height: 700,
		webPreferences: {
			preload: path.join(__dirname, './src/preload.js'),
			devTools: !app.isPackaged,
			disableHtmlFullscreenWindowResize: true,
		},
		maximizable: false,
		show: !app.isPackaged,
	});

	if (!fs.existsSync(constants.FILE_PATH)) {
		fs.writeFileSync(constants.FILE_PATH, constants.INIT_DATA);
	}

	Menu.setApplicationMenu(Menu.buildFromTemplate(customMenu()));

	main.loadFile('./src/views/index.html');

	main.on('minimize', (e) => {
		e.preventDefault();
		main.hide();
		tray = customTray(main);
	});

	main.on('restore', () => {
		tray.destroy();
	});

	main.on('close', (e) => {
		if (!app.isQuiting) {
			e.preventDefault();
			main.minimize();
		}
	});

	main.on('ready-to-show', () => {
		app.isPackaged && main.minimize();
	});

	api.init(main);
}

function scheduleJob() {
	const createNoti = (title, body) => {
		new Notification({ title, body, timeoutType: 'never' }).show();
	};
	// Run every hour
	const job = schedule.scheduleJob('0 * * * *', () => {
		let file = JSON.parse(fs.readFileSync(constants.FILE_PATH));
		const events = [
			...file.oneTime,
			...file.daily,
			...file.weekly,
			...file.monthly,
			...file.yearly,
		].filter((value) => !notifiedEvents.includes(value.id));
		const today = new Date().toISOString().split('T')[0];
		for (const event of events) {
			const startDate = new Date(event.startDate).getTime();
			const endDate = new Date(event.endDate).getTime() || Infinity;
			const selectedDate = new Date(today).getTime();
			switch (event.frequency) {
				case '0': {
					if (startDate === selectedDate) {
						createNoti(event.title, event.description);
						notifiedEvents.push(event.id);
					}
					break;
				}
				case '1': {
					if (selectedDate >= startDate && selectedDate <= endDate) {
						createNoti(event.title, event.description);
						notifiedEvents.push(event.id);
					}
					break;
				}
				case '2': {
					if (
						selectedDate >= startDate &&
						selectedDate <= endDate &&
						new Date(selectedDate).getDay() === new Date(startDate).getDay()
					) {
						createNoti(event.title, event.description);
						notifiedEvents.push(event.id);
					}
					break;
				}
				case '3': {
					if (
						selectedDate >= startDate &&
						selectedDate <= endDate &&
						new Date(selectedDate).getDate() === new Date(startDate).getDate()
					) {
						createNoti(event.title, event.description);
						notifiedEvents.push(event.id);
					}
					break;
				}
				case '4': {
					if (
						selectedDate >= startDate &&
						selectedDate <= endDate &&
						new Date(selectedDate).getMonth() === new Date(startDate).getMonth() &&
						new Date(selectedDate).getDate() === new Date(startDate).getDate()
					) {
						createNoti(event.title, event.description);
						notifiedEvents.push(event.id);
					}
					break;
				}
			}
		}
	});
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', () => {
		if (main) {
			if (main.isMinimized()) {
				main.show();
				main.restore();
			}
			main.focus();
		}
	});

	app.whenReady().then(() => {
		createWindow();
		scheduleJob();

		autoUpdater.checkForUpdatesAndNotify();

		app.on('activate', function () {
			if (BrowserWindow.getAllWindows().length === 0) createWindow();
		});
	});

	app.on('window-all-closed', function () {
		if (process.platform !== 'darwin') app.quit();
	});
}
