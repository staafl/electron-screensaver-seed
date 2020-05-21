'use strict';

const electron = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Stay open only if the screensaver should be shown (/s param)
// We don't implement /c (configure) and /p (preview) for now... 
var shouldStart = false;
for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i].trim() == "/s") {
        shouldStart = true;
        break;
    }
}

if (!shouldStart) {
    app.quit();
}

let {spawn,spawnSync} = require("child_process");

spawnSync("taskkill.exe", [
    "/im",
    "flux.exe",
    "/f"
]);

spawn("C:\\Users\\Owner\\AppData\\Local\\FluxSoftware\\Flux\\flux.exe",[],{detached:true});
setTimeout(function() {
    spawn("sendkeys.exe", [
        "!{End}"
    ]);

}, 5000);

setTimeout(function() {
    spawn("winhide.exe", [
        "f.lux"
    ]);
}, 3000);
setTimeout(function() {
    spawn("winhide.exe", [
        "f.lux"
    ]);
}, 4000);
setTimeout(function() {
    spawn("winhide.exe", [
        "f.lux"
    ]);
}, 5000);
setTimeout(function() {
    spawn("winhide.exe", [
        "f.lux"
    ]);
}, 6000);
setTimeout(function() {
    spawn("winhide.exe", [
        "f.lux"
    ]);
}, 7000);

setInterval(function() {
    spawn("sendkeys.exe", [
        "!{End}"
    ]);
}, 60*60*1000 + 10000);


// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  const ret = electron.globalShortcut.register('Escape', function(){
    app.quit();
  });

  // Create the browser window.
  function create(x) {
      const window = new BrowserWindow({width: 2560, height: 1440, x, y:0, fullscreen: true, title: "ESCR" });
      /* let screen = electron.screen;
let displays = screen.getAllDisplays();
let width;
for(var i in displays)
{

	width+= displays[i].bounds.width;

}*/

      // and load the index.html of the app.
      //window.loadURL('http://localhost:28080/Video%20page.html');
      window.loadURL('file://D:/btsync-delta/YouTube-Screensaver/Video%20page.html');
      
      // Hide the menu
      window.setMenu(null);
      window.webContents.setAudioMuted(true);
      // Dev tools (when in doubt, uncomment!)
      //window.webContents.openDevTools();

      // Emitted when the window is closed.
      window.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        app.quit();
      });
      electronLocalshortcut.register(window, 'Escape', () => {
        app.quit();
      });
      return window;
  }
  mainWindow = create(0);
  create(-2560);
  create(2560);
});

//// Quit the screensaver when the renderer process says so
//var ipc = require('ipc');
//ipc.on('sendQuit', function(event){
//    app.quit(); 
//});