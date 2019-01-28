/* electron start script */

// imports
let { app, BrowserWindow } = require("electron");

// application window
let appWindow;

// creates a new window
let createWindow = function(){
    // create window
    appWindow = new BrowserWindow({
        width: 960,
        height: 540
    });

    // load app based on mode 
    if(process.argv.includes("--dev")){
        // load react if in developer mode
        appWindow.loadURL("http://localhost:3000");
    }
    else{
        // load built application because production mode
        appWindow.loadFile("build/index.html");
    }

    // destroy window on close 
    appWindow.on("closed", () => appWindow = null);
};

// create window when the app starts
app.on("ready", createWindow);

// possibly recreate window if neccessary (mac thing?)
app.on("activate", () => {
    if(!appWindow){
        createWindow();
    }
});

// quit app when window closed
app.on("all-windows-closed", () => {
    if(process.platform !== "darwin"){
        app.quit();
    }
});