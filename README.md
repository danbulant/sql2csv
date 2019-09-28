# SQL2CSV

Convert MySQL SELECT to CSV format

## Config

Configuration is made through config.yml. Althrough the extension is yml, parser is implemented inside of the script and is only capable of reading string in format `key: value`.
Both key and value are trimmed, passwords with space at end won't work.
## Folders

### Input

'input' folder is for .sql files containing QUERYs. Query must be correct, isn't modified in any way (directly executed, as is). Must include SELECT.
Make sure the input is save, it's directly executed and not checked for anything.

### Output

'output' folder is for .cvs files. Output of sql2csv is written to the folder, the name of the file is same as input file except .sql is changed to .cvs.


**The folders should be created __before__ running the program. Sql2cvs doesn't create folders and will fail if they don't exists!**
