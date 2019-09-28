const { execSync } = require('child_process');
const { performance } = require('perf_hooks');
class sql2csv {
  log(str){
    if(!this.options.logging) return;
    if(this.options.colors){
      console.log(this.options.prefix + str + "\x1b[0m");
    } else {
      console.log(this.options.prefix + str);
    }
  }
  colorLog(str, color){
    if(!this.options.logging) return;
    if(this.options.colors){
      console.log(this.options.prefix + color + str + "\x1b[0m");
    } else {
      console.log(this.options.prefix + str);
    }
  }
  warn(str){
    if(!this.options.logging) return;
    if(this.options.colors){
      console.warn(this.options.prefix + "\x1b[33m" + str + "\x1b[0m");
    } else {
      console.warn(this.options.prefix + str);
    }
  }

  constructor(options) {
    if(typeof options != undefined){
      this.options = options;
      if(this.options.conn) this.conn = this.options.conn;
      if(this.options.connection) this.conn = this.options.connection;//long alias for conn
    } else {
      this.options = {};
    }
    if(!this.options.prefix) this.options.prefix = "[SQL2CSV] ";
    if(this.options.colors == undefined) this.options.colors = true;
    if(this.options.crlf == undefined) this.options.crlf = false;

    if(!this.options.skipMysqlCheck){
      try {
        this.log("Checking for mysql driver...");
        execSync('npm ls mysql --json');
        this.log("\x1b[32mMysql driver is installed");
      } catch(e){
        this.warn("Remember sql2csv needs mysql driver.");
        this.warn("You can still use sql2csv with other drivers, but the conversion might not work.")
      }
    } else {
      this.warn("Mysql driver check skipped");
    }
    this.colorLog("Initialized", "\x1b[32m");
  }

  query(sql){
    var self = this;
    var startDate = performance.timeOrigin + performance.now();
    return new Promise((resolve, reject) => {
      self.conn.query(sql, function (err, result) {
        if (err){reject(err); return }
        if(result == undefined){reject("undefined result"); return; }
        var csv = "";
        var keys = [];
        var keysEmpty = true;
        result.forEach((row) => {
          var current = 0;
          var last = Object.keys(row).length;
          for(var key in row){
            current++;
            if(keysEmpty) keys[keys.length] = key;
            var column = row[key];
            if(typeof column == "string"){
              column = column.replace('"', '""');//double quotes, regarding https://stackoverflow.com/questions/4617935
              if(column.indexOf(",") != -1){
                column = '"' + column + '"';
              }
            }
            if(current != last)
              csv += column + ",";
          }
          keysEmpty = false;
          if(self.options.crlf) csv += "\r";
          csv += "\n";
        });
        if(self.options.showNames){
          var header = "";
          keys.forEach((key) => {
            key.replace('"', '""');//double quotes, regarding https://stackoverflow.com/questions/4617935
            key.replace(",", '","');
            header += key + ",";
          });
          if(self.options.crlf) header += "\r";
          header += "\n";
          csv = header + csv;
        }
        var endDate = performance.timeOrigin + performance.now();
        var obj = {csv: csv, start: startDate, end: endDate};
        resolve(obj);
      });
    });
  }
  //update certain option
  setOption(name, value){
    this.options[name] = value;
  }

  //overwrites options
  setOptions(options){
    this.options = options;
  }

  //set connection
  setConnection(conn){
    this.conn = conn;
  }

}
module.exports = sql2csv;
