const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // Auth
  loginData: (authData) => ipcRenderer.invoke('login', authData),
  signupData: (authData) => ipcRenderer.invoke('signup', authData),
  logoutData: (authData) => ipcRenderer.invoke('logout', authData),
  forgotPassword: (authData) => ipcRenderer.invoke('forgot-password', authData),
  resetPassword: (authData) => ipcRenderer.invoke('reset-password', authData),

  // Google OAuth
  googleOAuth: () => ipcRenderer.invoke('google-oauth'),
  exchangeGoogleCode: (code) => ipcRenderer.invoke('exchange-google-code', code),

  // User details
  storeUserDetails: (userData) => ipcRenderer.invoke('store-user-details', userData),
  userDetails: (userData) => ipcRenderer.invoke('user-details', userData),

  // Device
  getDeviceDetails: (deviceData) => ipcRenderer.invoke('get-device-details', deviceData),

  // Short URL
  createShortURL: (shortURLData) => ipcRenderer.invoke('create-short-url', shortURLData),
  getShortURL: (shortURLData) => ipcRenderer.invoke('get-short-url', shortURLData),
  getFullURL: (fullURLData) => ipcRenderer.invoke('get-full-url', fullURLData),
  deleteShortURL: (deleteURLData) => ipcRenderer.invoke('delete-short-url', deleteURLData),

});