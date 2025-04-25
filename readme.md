> CLI Tool to for managing passwords (requires node14)

##### Get started
```
cd /path/to/project # navigate to project folder
npm i # install modules
cp node_modules -r /path/to/project/node/linux # copy modules
cp ~/.nvm/versions/node/v14.0.0/bin/node /path/to/project/node/linux # copy node binary file
```

##### Final Structure
```
├── add.js
├── app.bat
├── app.sh
├── config.js
├── credentials.json
├── db.json
├── delete.js
├── get.js
├── index.js
├── node
│   ├── linux
│   │   ├── node
│   │   └── node_modules
│   ├── mac
│   │   ├── node
│   │   └── node_modules
│   └── win
│       ├── node.exe
│       └── node_modules
├── olum.js
├── package.json
├── readme.md
└── update.js
```

##### Make project portable
> copy the final structure to a USB flash and add alias in your .bashrc

##### copy project to usb flash
```
cp /path/to/project -r /path/to/usb-flash
```

##### add alias on OS

```
alias pass='node /path/to/usb-flash/index.js'
```

##### run it using alias anywhere on your OS

```
pass --help
pass --version
```

##### run it from usb-flash (portable)

```
/path/to/usb-flash/node/linux/node index.js -h
```

##### Useful commands using `pass` alias

```
pass get # lists all passwords in db.json file
pass get --id 2 # show acccount with id 2
pass get --name google # show acccount with name google
pass add --name google --username foo@gmail.com --location www.google.com # saves password for google
pass make --length 20 # make random strong password of 20 chars
```
