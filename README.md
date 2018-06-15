[![Join the chat at https://gitter.im/volumio/Volumio2-UI](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/volumio/Volumio2-UI?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/volumio/Volumio2-UI.svg?branch=master)](https://travis-ci.org/volumio/Volumio2-UI)
[![devDependency Status](https://david-dm.org/volumio/Volumio2-UI/dev-status.svg)](https://david-dm.org/volumio/Volumio2-UI#info=devDependencies)
[![bitHound Score](https://www.bithound.io/github/volumio/Volumio2-UI/badges/score.svg)](https://www.bithound.io/github/volumio/Volumio2-UI)


## Volumio Web Interface

This UI is meant to be used as a standalone Web User Interface communicating via Volumio2 Backend via Socket.io API, see [Volumio2 WebSocket API reference](https://github.com/volumio/Volumio2/wiki/WebSockets-API-Reference)

Currently the UI is served via Express Static Server, and resides at /volumio/http/www


## Repo information

This repo is used as a git submodule in [Volumio2](https://github.com/volumio/Volumio2).  
Only the `dist/` directory is needed by Volumio2, so there is a [dist branch](https://github.com/volumio/Volumio2-UI/tree/dist) which contains just that.

To update the dist branch with the latest changes, run:

```shell
git subtree split --prefix dist -b dist
git push origin dist:dist
```


## Set up development environment

You must have Node.js, Npm and Bower installed

First clone it

```shell
git clone https://github.com/volumio/Volumio2-UI.git
```


Then, install its depencencies

```shell
cd Volumio2-UI
npm install
bower install
```

Now, you can develop on it, while retrieving data from Volumio2 backend (you must have a Volumio2 device on your network and know its IP address).
To tell the UI where to find Volumio 2 backend, create a file with the IP of Volumio2 in

```shell
/src/app/local-config.json
```

The file will look like

```shell
{
  "localhost": "http://192.168.31.234"
}
```


Now, feel free to edit and see live changes on a local browser with dynamically generated UI. To do so:

```shell
npm run gulp serve --theme="volumio"
```

Once finished, to deploy on Volumio 2, first build it. if you want production optimization use --env="production"

```shell
npm run gulp build --theme="volumio" --env="production"
```


And deploy by copying the content of dist directory on Volumio2 device to:

```shell
/volumio/http/www
```
