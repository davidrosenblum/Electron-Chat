## 

### Layout
/src is the __server source__

_/app folder_ is the __electron application__
_/app/src is_ the __react source__
_/app/build_ is the __compiled react__

### Installation & Setup
##### Install Runtime Environment
[Node.js](https://nodejs.org/en/download/) must be installed

##### Install Dependencies 
`npm i` in the root folder to install server dependencies
`cd app`
`npm i` in the app folder to install client dependencies

##### Dev Mode
`npm run dev` in the root to start server in dev mode
`cd app`
`npm run react` in the app folder to start react dev server
`npm run dev` start electron dev mode 

##### Prod Mode
`npm start` in the root to start the server
`cd app`
`npm run build` (if you did not already compile)
`npm start` to start electron 