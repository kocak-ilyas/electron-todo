const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require("path")
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "todos"
});

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // frame: false,
        webPreferences: { nodeIntegration: true }
    })
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    // mainWindow.setResizable = false

    connectMySQL()
    mainWindow.webContents.once("dom-ready", () => { getDataMysql() })

    ipcMain.on("addNewData", (event, arg) => {
        addDataMysql(arg)

    })

    ipcMain.on("deleteElement", (event, arg) => {
        deleteDataMysql(arg)
    })

    ipcMain.on("windowClose", () => {
        mainWindow.close();
        connection.end();
        console.log("Mysql connection ended")
    })
}
app.on('ready', createWindow)

function connectMySQL() {
    connection.connect(function(err) {
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        } else {
            console.log("Mysql connected")
        }
    })
}

function getDataMysql() {
    connection.query("SELECT text FROM list", (error, results, fields) => {
        mainWindow.webContents.send("msqlData", results)
    })
}

function addDataMysql(arg) {
    if (arg === "") {
        console.log("running alert");
        const alertEmpty = {
            type: "question",
            buttons: ["Okey"],
            title: "Do you know what you're doing?",
            message: "A blank entry!!!"
        }
        dialog.showMessageBox(alertEmpty)
    } else {
        connection.query("INSERT INTO list SET text = ?", arg)
        mainWindow.webContents.send("addElement", arg)
    }
}

function deleteDataMysql(arg) {
    connection.query("DELETE FROM list WHERE text = ?", arg)
}