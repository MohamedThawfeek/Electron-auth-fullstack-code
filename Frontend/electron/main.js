const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  protocol,
  shell,
} = require("electron");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const isDev = require("electron-is-dev");
const { URL } = require("url");
const CREDENTIAL_PATH = path.join(__dirname, "credentials.json");
const credential = require(CREDENTIAL_PATH);
const { google } = require("googleapis");
let mainWindow;

// IPC handlers - Register these BEFORE app.whenReady()

const { client_id, client_secret, redirect_uris } = credential.installed;

const OAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Define the scopes for Google OAuth
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid'
];



async function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Electron Auth App",
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
    },
    icon: path.join(__dirname, '../assets/icons/icon-64.png'),
    titleBarStyle: "hiddenInset",
    show: false,
  });

  // Maximize the window on startup
  // mainWindow.maximize();

  console.log("isDev", isDev);

  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Set the app icon for dock/taskbar
  app.dock?.setIcon(path.join(__dirname, '../assets/icons/icon-64.png'));
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-platform", () => {
  return process.platform;
});

ipcMain.handle("login", (channel, authData) => {
  console.log("Login request:", authData);
  return { data: authData };
});

ipcMain.handle("signup", (channel, authData) => {
  console.log("Signup request:", authData);
  return { data: authData };
});

ipcMain.handle("logout", (channel, authData) => {
  console.log("Logout request:", authData);
  return { message: "Logout successful" };
});

// Google OAuth handlers
ipcMain.handle("google-oauth", async () => {
  return new Promise((resolve, reject) => {
    const authUrl = OAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
      modal: true,
      parent: mainWindow,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: true,
      },
    });

    authWindow.loadURL(authUrl);

    let isResolved = false;

    // Handle the OAuth callback - check for both redirect and navigation
    const handleCallback = (navigationUrl) => {
      try {
        const url = new URL(navigationUrl);
        
        // Check for various callback patterns
        if (url.searchParams.has('code')) {
          const code = url.searchParams.get("code");
          if (!isResolved) {
            isResolved = true;
            authWindow.close();
            resolve({ code });
          }
          return;
        }
        
        // Check for error in callback
        if (url.searchParams.has('error')) {
          const error = url.searchParams.get("error");
          if (!isResolved) {
            isResolved = true;
            authWindow.close();
            reject(new Error(`OAuth error: ${error}`));
          }
          return;
        }
      } catch (error) {
        console.error("Error parsing callback URL:", error);
      }
    };

    // Listen for both redirect and navigation events
    authWindow.webContents.on("will-redirect", (event, navigationUrl) => {
      handleCallback(navigationUrl);
    });

    authWindow.webContents.on("did-navigate", (event, navigationUrl) => {
      handleCallback(navigationUrl);
    });

    authWindow.webContents.on("did-navigate-in-page", (event, navigationUrl) => {
      handleCallback(navigationUrl);
    });

    authWindow.on("closed", () => {
      if (!isResolved) {
        isResolved = true;
        reject(new Error("OAuth window was closed"));
      }
    });

    // Add timeout to prevent hanging
    setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        authWindow.close();
        reject(new Error("OAuth timeout"));
      }
    }, 300000); // 5 minutes timeout
  });
});

ipcMain.handle("exchange-google-code", async (event, code) => {
  try {
    // Exchange the authorization code for tokens using OAuth2Client
    const { tokens } = await OAuth2Client.getToken(code);
    
    // Set the credentials for the OAuth2Client
    OAuth2Client.setCredentials(tokens);

    // Create a Google OAuth2 service instance
    const oauth2 = google.oauth2({ version: 'v2', auth: OAuth2Client });

    // Get user information using the Google API
    const userResponse = await oauth2.userinfo.get();
    const userData = userResponse.data;

    return {
      success: true,
      user: userData,
      tokens: tokens,
    };
  } catch (error) {
    console.error("Error exchanging Google code:", error);
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("user-details", async (event, userData) => {
  return { data: userData };
});

ipcMain.handle("store-user-details", async (event, userData) => {
  console.log("Storing user details:", userData);
  return { data: userData };
});

ipcMain.handle("forgot-password", async (event, authData) => {
  console.log("Forgot password request:", authData);
  return { data: authData };
});

ipcMain.handle("reset-password", async (event, authData) => {
  console.log("Reset password request:", authData);
  return { data: authData };
});

ipcMain.handle("get-device-details", async (event, deviceData) => {
  console.log("Get device details request:", deviceData);
  return { data: deviceData };
});