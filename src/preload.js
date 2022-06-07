const { contextBridge, ipcRenderer } = require('electron');

/**
 * API/Function allowed from the renderer process
 */
contextBridge.exposeInMainWorld('myAPI', {
	initData: () => ipcRenderer.invoke('init-data'),
	submitEvent: (data) => ipcRenderer.invoke('submit-event', data),
	deleteEvent: (id) => ipcRenderer.invoke('delete-event', id),
	getEvent: (id) => ipcRenderer.invoke('get-event', id),
});
