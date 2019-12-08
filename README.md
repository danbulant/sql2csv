# SQL2CSV

[![NPM](https://img.shields.io/npm/v/auto-sql2csv/latest)](https://www.npmjs.com/package/auto-sql2csv)

[![NPM](https://nodei.co/npm/auto-sql2csv.png)](https://nodei.co/npm/auto-sql2csv/)

Using sql2csv programmatically? see lib/README.md

Convert MySQL SELECT output to CSV format

## Config

Configuration is made through config.yml. Althrough the extension is yml, parser is implemented inside of the script and is only capable of reading string in format `key: value`.
Both key and value are trimmed, passwords with space at end won't work.

Bellow is a table containing information about configuration. An example can be found in config.yml.


| Key name  | Default value | Description                     |
|-----------|---------------|---------------------------------|
| host      | localhost     | Host to connect to              |
| port      | 3306          | Port to use                     |
| username  | root          | Username for connection         |
| password  |               | Password for given user         |
| showNames | false         | Show table names in first row   |
| crlf      | false         | Use crlf (windows) line endings |


## Folders

### Input

'input' folder is for .sql files containing QUERYs. Query must be correct, isn't modified in any way (directly executed, as is). Must include SELECT.
Make sure the input is save, it's directly executed and not checked for anything.

### Output

'output' folder is for .cvs files. Output of sql2csv is written to the folder, the name of the file is same as input file except .sql is changed to .cvs.


**The folders should be created __before__ running the program. Sql2cvs doesn't create folders and will fail if they don't exist!**
