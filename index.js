const fs = require("fs");
const sql2csv = require("./sql2csv");
const mysql = require("mysql");
const configLoc = "config.yml";
var config = {};

//logging functions for colored console. No support for windows cmd.exe (Use powershell!)
function log(str){
  if(str == undefined){
    console.log();
    return;
  }
  if(typeof str != "string"){
    console.log(str);
    return;
  }
  console.log("[LOG] \x1b[2m" + str + "\x1b[0m");
}
function success(str){
  console.log("[LOG] \x1b[32m" + str + "\x1b[0m");
}
function warn(str){
  console.warn("[WARN] \x1b[33m" + str + "\x1b[0m");
}
function error(str){
  console.error("[ERROR] \x1b[41m" + str + "\x1b[0m");
}

log("Starting...");
var today = new Date();
var dateTime = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
log("Current time and date: " + dateTime);
log();

const s2c = new sql2csv({
  logging: true,
  skipMysqlCheck: true,
  colors: true,
  showNames: false,
  crlf: false
});

log();
//read config
var configFile = fs.readFileSync(configLoc);
if(Buffer.isBuffer(configFile)){//converts to string if readFileSync returns buffer
  configFile = configFile.toString();
}
configFile = configFile.split("\n");
configFile.forEach((line) => {
  line = line.trim(); //trim line
  if(line.indexOf("#") != -1) line = line.substr(0, line.indexOf("#"));
  if(line.indexOf(":") == -1) return;
  var value = line.substr(line.indexOf(":") + 1, line.length - line.indexOf(":")).trim();
  if(value == "true") value = true;//string "true" save as literal true
  if(value == "false") value = false;//same for false
  if(value == parseInt(value)) value = parseInt(value);//save numbers as integers instead of strings
  config[line.substr(0, line.indexOf(":")).trim()] = value;
});

//check config
if(config.showNames == undefined){
  warn("Undefined showNames, using false");
  config.showNames = false;
}
if(config.crlf == undefined){
  warn("Undefined crlf, using false");
  config.crlf = false;
}
if(config.host == undefined){
  warn("Undefined host, using localhost");
  config.host = "localhost";
}
if(config.port == undefined){
  warn("Undefined port, using 3306");
  config.port = 3306;
}
if(config.username == undefined){
  warn("Undefined username, using root");
  config.username = "root";
}
if(config.password == undefined){
  warn("Undefined password, using (empty)");
  config.password = "";
}
if(config.showNames) s2c.setOption("showNames", true);
if(config.crlf) s2c.setOption("crlf", true);

var con = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password
});

con.connect(function(err) {
  if (err){
    console.log("\x1b[31m");
    console.log(err + "");
    console.log("\x1b[0m");
    process.exit(1);
  }
  log("\x1b[32mMySQL Connected!");
});

s2c.setConnection(con);

fs.readdirSync('./input/').forEach(file => {
  if(fs.statSync(file).isDirectory()) return;//skip directories
  s2c.query(fs.readFileSync(file))
    .then(result => {
      console.log(result.csv);
      log(`Task from file ${file} done in ` + Math.round(result.end - result.start) + "ms");
      con.end();
    })
    .catch(err => {error(err); process.exit(0)})
});
