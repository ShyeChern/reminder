const { Tray, Menu, app } = require('electron');
const path = require('path');

module.exports.customTray = (window) => {
	const tray = new Tray(
		app.isPackaged
			? path.join(app.getAppPath(), '..', 'assets/img/icon.png')
			: './src/assets/img/icon.png'
	);
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Show',
			click: () => {
				window.show();
			},
		},
	]);

	tray.setToolTip('Reminder');
	tray.on('double-click', () => {
		window.show();
	});
	tray.setContextMenu(contextMenu);

	return tray;
};
