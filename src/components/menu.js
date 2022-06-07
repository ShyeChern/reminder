const constants = require('../utils/constants');
const { app, dialog } = require('electron');

module.exports.customMenu = () => {
	const menu = [
		{
			label: constants.APP_NAME,
			submenu: [
				{
					label: 'About',
					click: () =>
						dialog.showMessageBox({
							title: constants.APP_NAME,
							type: 'info',
							message: `App Version: ${app.getVersion()}
							Electron Version: ${process.versions.electron}`,
						}),
				},
				{
					label: 'Exit',
					accelerator: 'CommandOrControl+Q',
					click: () => {
						app.isQuiting = true;
						app.quit();
					},
				},
			],
		},
	];

	// if not package then enable Dev menu
	if (!app.isPackaged) {
		menu.push({
			label: 'Dev',
			role: 'viewMenu',
		});
	}

	return menu;
};
