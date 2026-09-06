// Preload script - secure bridge between main and renderer processes
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('app-version'),
  getPath: (name) => ipcRenderer.invoke('app-get-path', name),
  
  // Window controls
  minimizeToTray: () => ipcRenderer.send('app-minimize-to-tray'),
  quit: () => ipcRenderer.send('app-quit'),
  
  // Bridge management
  requestBridgeRestart: () => ipcRenderer.send('bridge-restart-request'),
  onBridgeError: (callback) => ipcRenderer.on('bridge-error', (_, msg) => callback(msg)),
  onBridgeRestarted: (callback) => ipcRenderer.on('bridge-restarted', () => callback()),
  
  // Platform info
  platform: process.platform,
  isPackaged: process.argv.includes('--packaged') || !process.argv.some(a => a.includes('electron')),
  
  // Utility: open external links safely
  openExternal: (url) => ipcRenderer.send('open-external', url)
});

// Remove the default Electron API exposure for security
delete window.require;
delete window.exports;
delete window.module;