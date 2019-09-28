# Installation

(!https://img.shields.io/npm/v/auto-sql2csv/latest)[https://www.npmjs.com/package/auto-sql2csv]

[![NPM](https://nodei.co/npm/auto-sql2csv.png)](https://nodei.co/npm/auto-sql2csv/)

Run `npm install auto-sql2csv`.

# Why?

This project was made for database reporting.
Auto in the first is because that sql2csv is already taken by CLI abandoned 5 year old project.

# Usage

Usage is pretty straight forward. Currently this package has support only for mysql driver, but others may work when they have similar syntax (conn.query(str, (err, result)=>{})).

## Options

| name           | default      | description                                                          |
|----------------|--------------|----------------------------------------------------------------------|
| prefix         | '[SQL2CSV] ' | Prefix to use when logging                                           |
| conn           | null         | Connection to use, must be created outside                           |
| colors         | true         | Whether to use colors or not when logging                            |
| crlf           | false        | Use windows crlf instead of linux lf on line ends                    |
| skipMysqlCheck | false        | Skip check for mysql driver (doesn't do anything other than warning) |
| showNames      | false        | Show column names in first row                                       |
| logging        | false        | Log to console                                                       |

## Methods

| name          | parameters             | description                                                                                                                                    |
|---------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| log           | string to log          | Logs to console using prefix + string                                                                                                          |
| colorLog      | string to log, color   | Same as log but with color prefix parameter, used to disable coloring when colors: false                                                       |
| warn          | string to warn         | Same as log but with yellow color                                                                                                              |
| constructor   | options                | Run when class instanciated, options are optional                                                                                              |
| query         | sql                    | This is where magic happens. Runs MySQL query and converts result (if any) to csv. Using promise. Rejected when empty result or error happens. |
| setOption     | option name, new value | Sets new value to option                                                                                                                       |
| setOptions    | options                | Overwrites options object with the one provided                                                                                                |
| setConnection | conn                   | Sets new connection                                                                                                                            |

## Example

`js
const sql2csv = require("sql2csv");
const mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

const s2c = new sql2csv({
  logging: true,//Log to console
  skipMysqlCheck: true,//Skip mysql check, as it's surely there
  colors: true,//Use colors, default value (could be ommited)
  showNames: true,//Show column names in first row
  crlf: false,//Use only linux lf
  conn: con //Connection to use
  });

console.log(s2c.query("SELECT * FROM db.table"));
/*
Shows something like
id,column1,column2
1,Daniel,Bulant
2,John,Doe
*/
`
