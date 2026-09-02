const { app, BrowserWindow, ipcMain, dialog, shell, Menu, Tray, nativeImage } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const isDev = !app.isPackaged;

// Disable the default Electron menu (File/Edit/View/Window/Help)
Menu.setApplicationMenu(null);

let mainWindow = null;
let bridgeProcess = null;
let bridgePort = 8787;
let isQuitting = false;

// Determine resource paths for packaged vs development
function getResourcePath(relativePath) {
  if (isDev) {
    return path.join(__dirname, '..', relativePath);
  }
  // In packaged app, resources are in process.resourcesPath
  return path.join(process.resourcesPath, relativePath);
}

function getBridgePath() {
  return getResourcePath('bridge.js');
}

function getWwwPath() {
  return getResourcePath('www');
}

function getFfmpegPath() {
  // In packaged app, ffmpeg is in extraResources/ffmpeg
  // In dev, use ffmpeg-static
  if (isDev) {
    try {
      return require('ffmpeg-static');
    } catch (e) {
      console.warn('ffmpeg-static not available in dev:', e.message);
      return 'ffmpeg'; // fallback to system ffmpeg
    }
  }
  // Packaged: check for bundled ffmpeg
  const platform = process.platform;
  const ffmpegDir = path.join(process.resourcesPath, 'ffmpeg');
  const candidates = [
    path.join(ffmpegDir, platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    path.join(ffmpegDir, 'ffmpeg'),
    path.join(ffmpegDir, 'bin', platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
    // Also check if ffmpeg was extracted to userData
    path.join(app.getPath('userData'), 'ffmpeg', platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      // Ensure executable permissions on Unix
      if (platform !== 'win32') {
        try { fs.chmodSync(candidate, 0o755); } catch (e) {}
      }
      console.log('[Electron] Found ffmpeg at:', candidate);
      return candidate;
    }
  }
  // Fallback: try to copy from extraResources to userData
  const sourceFfmpeg = path.join(ffmpegDir, platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
  const targetDir = path.join(app.getPath('userData'), 'ffmpeg');
  const targetFfmpeg = path.join(targetDir, platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
  
  if (fs.existsSync(sourceFfmpeg)) {
    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.copyFileSync(sourceFfmpeg, targetFfmpeg);
      if (platform !== 'win32') {
        fs.chmodSync(targetFfmpeg, 0o755);
      }
      console.log('[Electron] Copied ffmpeg to userData:', targetFfmpeg);
      return targetFfmpeg;
    } catch (e) {
      console.error('[Electron] Failed to copy ffmpeg:', e.message);
    }
  }
  // Fallback to system ffmpeg
  console.warn('[Electron] Using system ffmpeg fallback');
  return 'ffmpeg';
}

function createBridgeProcess() {
  const bridgePath = getBridgePath();
  const ffmpegPath = getFfmpegPath();
  
  console.log('[Electron] Starting bridge.js...');
  console.log('[Electron] Bridge path:', bridgePath);
  console.log('[Electron] FFmpeg path:', ffmpegPath);
  console.log('[Electron] WWW path:', getWwwPath());
  console.log('[Electron] isDev:', isDev);
  console.log('[Electron] resourcesPath:', process.resourcesPath);
  
  // Set environment variables for bridge.js
  const env = {
    ...process.env,
    FFMPEG_PATH: ffmpegPath,
    PORT: bridgePort.toString(),
    WWW_DIR: getWwwPath(),
    DATA_DIR: path.join(app.getPath('userData'), 'data', 'messages'),
    VOICE_DIR: path.join(app.getPath('userData'), 'data', 'voice'),
    LOCALES_DIR: path.join(getWwwPath(), 'locales'),
    ELECTRON_RUN: '1'
  };
  
  // Ensure data directories exist
  [env.DATA_DIR, env.VOICE_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  bridgeProcess = spawn('node', [bridgePath], {
    env,
    cwd: isDev ? path.join(__dirname, '..') : path.dirname(bridgePath),
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  bridgeProcess.stdout.on('data', (data) => {
    console.log('[Bridge]', data.toString().trim());
  });
  
  bridgeProcess.stderr.on('data', (data) => {
    console.error('[Bridge Error]', data.toString().trim());
  });
  
  bridgeProcess.on('error', (err) => {
    console.error('[Bridge] Failed to start:', err);
    if (mainWindow) {
      mainWindow.webContents.send('bridge-error', `Failed to start backend: ${err.message}`);
    }
  });
  
  bridgeProcess.on('close', (code) => {
    console.log('[Bridge] Process exited with code:', code);
    if (!isQuitting && mainWindow) {
      mainWindow.webContents.send('bridge-error', `Backend stopped unexpectedly (code: ${code})`);
    }
  });
  
  // Wait for bridge to be ready
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Bridge startup timeout'));
    }, 30000);
    
    const checkReady = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${bridgePort}/gateway/status`);
        if (response.ok) {
          clearTimeout(timeout);
          console.log('[Electron] Bridge is ready');
          resolve();
        }
      } catch (e) {
        // Not ready yet
      }
      setTimeout(checkReady, 500);
    };
    
    setTimeout(checkReady, 1000);
  });
}

function killBridgeProcess() {
  if (bridgeProcess) {
    console.log('[Electron] Killing bridge process...');
    bridgeProcess.kill();
    bridgeProcess = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Discord Manager',
    icon: getResourcePath(`build-resources/icon${process.platform === 'win32' ? '.ico' : '.png'}`),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: !isDev
    },
    show: false
  });
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });
  
  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      // On Windows/Linux, minimize to tray instead of closing
      if (process.platform !== 'darwin') {
        return;
      }
    }
    killBridgeProcess();
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Load the app via the bridge HTTP server so relative API URLs work correctly
  const bridgeUrl = `http://127.0.0.1:${bridgePort}/`;
  
  // Clear cache to ensure new UI loads (especially important in dev)
  if (isDev) {
    mainWindow.webContents.session.clearCache()
      .then(() => mainWindow.webContents.session.clearStorageData())
      .catch(e => console.warn('[Electron] Failed to clear cache:', e.message));
  }
  
  if (fs.existsSync(path.join(getWwwPath(), 'index.html'))) {
    mainWindow.loadURL(bridgeUrl);
  } else {
    console.error('[Electron] index.html not found in www folder');
    dialog.showErrorBox('Error', 'Failed to load app: index.html not found');
    app.quit();
  }
  
  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  
  // Prevent navigation to external URLs (allow bridge origin)
  const bridgeOrigin = `http://127.0.0.1:${bridgePort}`;
  mainWindow.webContents.on('will-navigate', (e, url) => {
    const parsed = new URL(url);
    if (parsed.origin !== 'file://' && parsed.origin !== bridgeOrigin) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
}

function createTray() {
  const iconPath = getResourcePath('build-resources/tray-icon.png');
  let trayIcon;
  
  if (fs.existsSync(iconPath)) {
    trayIcon = nativeImage.createFromPath(iconPath);
  } else {
    // Create a simple fallback icon
    trayIcon = nativeImage.createEmpty();
  }
  
  const tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Discord Manager',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('Discord Manager');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  
  return tray;
}

function setupMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit', label: 'Exit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'GitHub Repository',
          click: () => shell.openExternal('https://github.com/CarbonWalls/discord-botmanager')
        },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/CarbonWalls/discord-botmanager/issues')
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(async () => {
  setupMenu();
  
  try {
    await createBridgeProcess();
    createWindow();
    createTray();
  } catch (err) {
    console.error('[Electron] Startup failed:', err);
    dialog.showErrorBox('Startup Error', `Failed to start Discord Manager:\n${err.message}`);
    app.quit();
  }
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // On Windows/Linux, we hide to tray instead of quitting
    // Only quit if explicitly requested
  }
});

app.on('before-quit', () => {
  isQuitting = true;
  killBridgeProcess();
});

// IPC handlers for renderer communication
ipcMain.handle('app-version', () => app.getVersion());

ipcMain.handle('app-get-path', (e, name) => {
  return app.getPath(name);
});

ipcMain.on('app-minimize-to-tray', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});

ipcMain.on('app-quit', () => {
  isQuitting = true;
  app.quit();
});

// Handle bridge errors from renderer
ipcMain.on('bridge-restart-request', async () => {
  killBridgeProcess();
  try {
    await createBridgeProcess();
    mainWindow.webContents.send('bridge-restarted');
  } catch (err) {
    mainWindow.webContents.send('bridge-error', `Restart failed: ${err.message}`);
  }
});