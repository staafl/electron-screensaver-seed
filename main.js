'use strict';

const electron = require('electron');
let {spawn,spawnSync} = require("child_process");



const electronLocalshortcut = require('electron-localshortcut');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

let videos = [
    "https://www.youtube.com/watch?v=ftlvreFtA2A", // Norway
    "https://www.youtube.com/watch?v=1nf61dNdzPc", // Kauai
    "https://www.youtube.com/watch?v=TB6n7I52gzc", // Fiji
    "https://www.youtube.com/watch?v=mA30W2dHQIo", // Bermuda
    "https://www.youtube.com/watch?v=tbodhmmqa-g", // Birds
    "https://www.youtube.com/watch?v=xiBZKJkeC_k", // Banff
    "https://www.youtube.com/watch?v=AWpvNtoG5nU", // Maui
    "https://www.youtube.com/watch?v=Xf5QTs2NLRc", // Cinque Terre
    "https://www.youtube.com/watch?v=4AtJV7U3DlU", // Oahu
    //"https://www.youtube.com/watch?v=AMDykUUXkHY", // Shikhans
    "https://www.youtube.com/watch?v=_RTMLn7rDRw", // Scotland
    "https://www.youtube.com/watch?v=ut2KhcNtnm8", // africa
    "https://www.youtube.com/watch?v=cC9r0jHF-Fw",   // coral reef
    "https://www.youtube.com/watch?v=TKmGU77INaM",   // wild animals
];

const indices = [];
for (let ii = 0; ii < videos.length; ii += 1) {
  indices.push(ii);
}
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
shuffle(videos);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
const windows = [];

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

fluxShenanigans();

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

//electron.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
//  details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36';
//  callback({ cancel: false, requestHeaders: details.requestHeaders });
//});
/*
electron.session.defaultSession.webRequest.onBeforeRequest(
    ['*://*.googlevideo.com/videoplayback?*'],
    (details, callback) => {
    const newUrl = details.url.replace(/&itag=[^&]+/, "&itag=399").replace(/&mime=[^&]+/, "&mime=video/mp4");
    // electron.dialog.showMessageBox({ message: newUrl });
  // https://r2---sn-8p85jvh-nv4l.googlevideo.com/videoplayback?expire=1590520156&ei=_BTNXrGSIbGK8gPojbjICw&ip=94.155.68.35&id=o-ADjVmwLpw4WRDs6UFWfX7TvIBKBhTIYfHdjHfmr2beTV&itag=397&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C271%2C278%2C313%2C394%2C395%2C396%2C397%2C398%2C399%2C400%2C401&source=youtube&requiressl=yes&mh=DI&mm=31%2C29&mn=sn-8p85jvh-nv4l%2Csn-nv47lnl6&ms=au%2Crdu&mv=m&mvi=1&pl=20&initcwndbps=1208750&vprv=1&mime=video%2Fmp4&gir=yes&clen=221088433&dur=3447.443&lmt=1575898402186541&mt=1590498452&fvip=2&keepalive=yes&fexp=23882513&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAK7jDAjWhXLu2HECHG6g2OfxxmNI-HF6fQEKNby_dAFEAiBd8Niuczu0Mw7D4iDo3l3Yrrj9pd_ZsCBj5JiR47nyXg%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAO4aIyntCt-EfTpkNf8ZBhEDLpBBg1OBpFuGOlqRzErwAiEA_RnOpApUKSThNPYhaEpWpp4Ah6k9RhgQwZqo-KwluIc%3D&alr=yes&cpn=AunrHmnBhgWkHTV3&cver=2.20200521.03.02&range=3071108-3767842&rn=43&rbuf=10919
//https://r3---sn-8p85jvh-nv4l.googlevideo.com/videoplayback?expire=1590521547&ei=axrNXuueI5KE8gPwyI0g&ip=94.155.68.35&id=o-ABraDc0YHrXbEKxujZS-aG3Jw-IKxKb0Q1NvU7KhkEWN&itag=399&source=youtube&requiressl=yes&mh=0c&mm=31%2C29&mn=sn-8p85jvh-nv4l%2Csn-nv47lnlz&ms=au%2Crdu&mv=m&mvi=2&pl=20&initcwndbps=1267500&vprv=1&mime=audio%2Fwebm&gir=yes&clen=80102996&dur=5142.461&lmt=1541395917660097&mt=1590499836&fvip=3&keepalive=yes&c=WEB_EMBEDDED_PLAYER&txp=5511222&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRQIhALvMILiHHXsbcSrx8hYaOaySTBQ_FHoe6awW-dO8L6PLAiBH2E8yxU5Dw1RDupmAmVFoOXUdaCXqnbDWslGLek2ZVw%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAJxg_ZTeJAZlhNkydGixaTLxXe_EwyjIGyisMciv2EYaAiEAnv-mnbg8MOtx_OD7B18EH6AjA9tEr65jGHO8JWXDFiE%3D&alr=yes&cpn=08dCM997SEfMVFVi&cver=20200521&range=0-74961&rn=2&rbuf=0
// https://r3---sn-8p85jvh-nv4l.googlevideo.com/videoplayback?expire=1590521633&ei=wRrNXpXzD6iRx_APjaOagAY&ip=94.155.68.35&id=o-AIj8QeB7H1cYp9Gy0HQOCMWlUkV-Uq8jFSvoohuXBoSM&itag=243&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C271%2C278%2C313%2C394%2C395%2C396%2C397%2C398%2C399&source=youtube&requiressl=yes&mh=0c&mm=31%2C29&mn=sn-8p85jvh-nv4l%2Csn-nv47lnlz&ms=au%2Crdu&mv=m&mvi=2&pl=20&initcwndbps=1310000&vprv=1&mime=video%2Fwebm&gir=yes&clen=211406092&dur=5142.437&lmt=1541384424242446&mt=1590499954&fvip=3&keepalive=yes&c=WEB_EMBEDDED_PLAYER&txp=5532432&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRQIgGhB-x3uOom_lw6pzfGdTIKiM1SDiuFbywWplRbjAsHYCIQDRC4fg_9YWKIxYIsArD755we0HIEvAtk0Cy4l6THhLaA%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgOzTePozENOTs52V57IziTPN5Hvj5e9GjLR417wo00ZsCIQDp5ct2C6CeY29gK5yMnHbESOKtC8dpyFCYrhe86SDrng%3D%3D&alr=yes&cpn=cSOTJCvgZ4w5llsk&cver=20200521&range=0-122765&altitags=242%2C278&rn=1&rbuf=0
// https://r3---sn-8p85jvh-nv4l.googlevideo.com/videoplayback?expire=1590521710&ei=DhvNXt_QJIbE-gaQxqngBg&ip=94.155.68.35&id=o-ANxX6UGVkxbzthYPLXc_yDmgHySIJImketmy2z3jaCdM&itag=399&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C271%2C278%2C313%2C394%2C395%2C396%2C397%2C398%2C399&source=youtube&requiressl=yes&mh=0c&mm=31%2C29&mn=sn-8p85jvh-nv4l%2Csn-nv47lnlz&ms=au%2Crdu&mv=m&mvi=2&pl=20&initcwndbps=1326250&vprv=1&mime=video%2Fwebm&gir=yes&clen=211406092&dur=5142.437&lmt=1541384424242446&mt=1590500016&fvip=3&keepalive=yes&c=WEB_EMBEDDED_PLAYER&txp=5532432&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAO3RcEWmAvpMcHpsRGuZFVWEgjkcaAzCZVPTaD5HuCm1AiEAsD7KgcOt7z3zELGG9k4lf1_r0--6R9J06e4BfjC9COw%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAKARLdHdWPgxOan1E-72kEXPn4qpJc1JjfzP6yphUv3AAiBqmxynypcQvW7awPgpxl5DG6d1GSFRQOoiac9mS9v7qg%3D%3D&alr=yes&cpn=jLd9i9XQKiatjvR6&cver=20200521&range=0-122765&altitags=242%2C278&rn=1&rbuf=0
  if (newUrl !== details.url) {
    callback({
    cancel: false,
    redirectURL: newUrl
  });
  } else {
  callback({
    cancel: false
  });
  }
});*/

  const ret = electron.globalShortcut.register('Escape', function(){
    app.quit();
  });

  function create(x, clock) {
      const window = new BrowserWindow({
        width: 2560,
        height: 1440,
        x,
        y:0,
        fullscreen: true,
        title: "ESCR",
        backgroundColor: '#fff',
        zoomFactor: 1,
        webPreferences: {
          webSecurity: false
        }
      });
      /* let screen = electron.screen;
let displays = screen.getAllDisplays();
let width;
for(var i in displays)
{

	width+= displays[i].bounds.width;

}*/
      window.setAlwaysOnTop(true, 'screen');
      // and load the index.html of the app.
      //window.loadURL('http://localhost:28080/Video%20page.html');
      if (clock) {
        window.loadURL('file://D:/btsync/dropbox/misc/clock/clock.html');
      }

      // Hide the menu
      window.setMenu(null);
      window.webContents.setAudioMuted(true);
      // Dev tools (when in doubt, uncomment!)
      // window.webContents.openDevTools();
      let seen = 0;
      window.webContents.on('dom-ready', (event)=> {
          let css = '* { cursor: none !important; overflow: hidden !important; }';
          if (!seen)
          //loadVideo(window, videoIndex);
          seen = 1;
          window.webContents.insertCSS(css);
      });
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
  let videoIndex = 0;
  mainWindow = create(0, true);
  //windows.push(mainWindow);
  if (electron.screen.getAllDisplays().length > 2)
    windows.push(create(2560));
  windows.push(create(-2560));
  for (const window of windows) {
    loadVideo(window, videoIndex);
  }

  setInterval(() => {
    videoIndex += 1;
    for (const window of windows) {
      loadVideo(window, videoIndex);
    }
    //window.webContents.reload();
  }, 60*60*1000);

});

function loadVideo(window, videoIndex) {
  videoIndex %= indices.length;
  window.loadURL(
    //"https://www.youtube.com/embed/ftlvreFtA2A"
    'file://D:/btsync-delta/electron-screensaver-seed/Video%20page.html#' + encodeURI(videos[indices[videoIndex]])
    );//  frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
}

//// Quit the screensaver when the renderer process says so
//var ipc = require('ipc');
//ipc.on('sendQuit', function(event){
//    app.quit();
//});


function fluxShenanigans() {

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

    disableFlux();
}
function disableFlux() {
    setTimeout(function() {
        spawn("sendkeys.exe", [
            "!{End}"
        ]);
        disableFlux();
    }, 60*60*1000 + 10000);
}