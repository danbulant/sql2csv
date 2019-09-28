const { execSync } = require('child_process');

class sql2csv {
  log(str){
    if(!this.options.logging) return;
    if(this.options.colors)
    console.log(this.options.prefix + str + "\x1b[0m");
    console.log(this.options.prefix + str + "\x1b[0m");
  }

  warn(str){
    if(!this.options.logging) return;
    console.warn(this.options.prefix + "\x1b[33m" + str + "\x1b[0m");
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
    this.log("\x1b[32mInitialized");
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
