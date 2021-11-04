[![Build Status](https://app.travis-ci.com/volumio/Volumio2-UI.svg?branch=master)](https://travis-ci.org/volumio/Volumio2-UI)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Awesome](https://awesome.re/badge.svg)](https://github.com/thibmaek/awesome-raspberry-pi)

[![Volumio](https://volumio.org/wp-content/uploads/2016/02/Volumio_logo_HD2000.jpg)](https://volumio.org)


## Volumio Web Interface

This UI is meant to be used as a standalone Web User Interface communicating via Volumio2 Backend via Socket.io API, see [Volumio2 WebSocket API reference](https://github.com/volumio/Volumio2/wiki/WebSockets-API-Reference)

Currently the UI is served via Express Static Server, and resides at `/volumio/http/www` (Classic UI) and `/volumio/http/www3` (Contemporary UI)


## Repo information

This repo holds the source code of Volumio UI [Volumio2](https://github.com/volumio/Volumio2), which is compiled and hosted in Volumio system images.
Only the `dist/` and `dist3/` branches are needed by Volumio2, so there is a [dist branch](https://github.com/volumio/Volumio2-UI/tree/dist) which contains just that.


## Set up development environment

You must have Node.js, Npm and Bower installed. Node.js suggested version is 10.22.1 (lower versions and higher versions might fail). It's strongly suggested to use [NVM](https://github.com/nvm-sh/nvm) to set up the proper Node.js Environment.

Clone the Repo:

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
gulp serve --theme="volumio"
```

Additional parameters can be env, for selecting the environment which can be production or development

```shell
gulp serve --theme="volumio" --env="production"
```

And debug, to show debug console logs on the browser

```shell
gulp serve --theme="volumio" --env="production" --debug
```

Once finished, to deploy on Volumio 2, first build it. if you want production optimization use --env="production"

```shell
npm run gulp build --theme="volumio" --env="production"
```


And deploy by copying the content of dist directory on Volumio2 device to:

```shell
/volumio/http/www
```



