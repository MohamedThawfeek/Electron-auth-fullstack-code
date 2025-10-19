# Electron Auth App

A secure Electron application with authentication capabilities, built with Vite and modern web technologies.

## Features

- ✅ Secure IPC communication between main and renderer processes
- ✅ Context isolation enabled for security
- ✅ Preload script for safe API exposure
- ✅ Modern Vite build system
- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Beautiful, responsive UI with dark/light mode support

## Project Structure

```
electron-auth/
├── electron/                 # Electron main process files
│   ├── main.js              # Main Electron process
│   └── preload.js           # Preload script for secure IPC
├── src/                     # Renderer process files
│   ├── main.js              # Main renderer script
│   ├── style.css            # Application styles
│   ├── counter.js           # Counter functionality
│   └── javascript.svg       # Assets
├── public/                  # Static assets
│   └── vite.svg
├── dist/                    # Built application (after npm run build)
├── index.html               # Main HTML file
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd electron-auth
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the application in development mode:

```bash
npm run electron:dev
```

This command will:
- Start the Vite development server
- Wait for the server to be ready
- Launch the Electron application

### Building for Production

1. Build the renderer process:
   ```bash
   npm run build
   ```

2. Build the Electron application:
   ```bash
   npm run build:electron
   ```

3. Create distribution packages:
   ```bash
   npm run dist
   ```

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build the renderer process
- `npm run preview` - Preview the built application
- `npm run electron` - Run Electron with built files
- `npm run electron:dev` - Run Electron in development mode
- `npm run build:electron` - Build Electron application
- `npm run dist` - Create distribution packages

## Security Features

This application implements several security best practices:

1. **Context Isolation**: Enabled to prevent the renderer process from accessing Node.js APIs directly
2. **Node Integration**: Disabled in the renderer process
3. **Preload Script**: Provides a secure bridge between main and renderer processes
4. **Remote Module**: Disabled for security
5. **External Link Handling**: Opens external links in the default browser

## API Reference

The application exposes the following APIs through the preload script:

### `window.electronAPI`

- `getAppVersion()` - Returns the application version
- `getPlatform()` - Returns the current platform (win32, darwin, linux)
- `sendMessage(message)` - Send a message to the main process
- `onMessage(callback)` - Listen for messages from the main process
- `removeAllListeners(channel)` - Remove all listeners for a specific channel

## Customization

### Adding New IPC Handlers

1. Add the handler in `electron/main.js`:
   ```javascript
   ipcMain.handle('your-handler', () => {
     return 'your-data';
   });
   ```

2. Expose it in `electron/preload.js`:
   ```javascript
   contextBridge.exposeInMainWorld('electronAPI', {
     // ... existing APIs
     yourHandler: () => ipcRenderer.invoke('your-handler')
   });
   ```

3. Use it in your renderer process:
   ```javascript
   const data = await window.electronAPI.yourHandler();
   ```

### Styling

The application uses CSS custom properties and supports both light and dark themes. Modify `src/style.css` to customize the appearance.

## Troubleshooting

### Common Issues

1. **Application won't start**: Make sure all dependencies are installed with `npm install`
2. **Build errors**: Ensure you're using Node.js version 16 or higher
3. **Security warnings**: This is normal for development. In production, ensure proper code signing.

### Development Tips

- Use `Ctrl+Shift+I` (or `Cmd+Option+I` on macOS) to open DevTools
- Check the console for any errors or warnings
- The application automatically reloads when you make changes to the renderer process

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
