## Volumio Web Interface

This UI is meant to be used as a standalone Web User Interface communicating via Volumio2 Backend via Socket.io API, see [Volumio2 WebSocket API reference](https://github.com/volumio/Volumio2/wiki/WebSockets-API-Reference) 

Currently the UI is served via Express Static Server, and resides at /volumio/http/www 

## Development 

First clone it 

```shell
git clone https://github.com/volumio/Volumio2-UI.git
```shell


Then, install its depencencies 

```shell
cd Volumio2-UI
npm install
bower install
```shell

To run a local browser with dinamically generated UI do

```shell
gulp
```shell

To build it and deploy

```shell
gulp --theme="volumio"
```shell


This repo is used as a git submodule in [Volumio2](https://github.com/volumio/Volumio2).  
Only the `dist/` directory is needed by Volumio2, so there is a [dist branch](https://github.com/volumio/Volumio2-UI/tree/dist) which contains just that.

To update the dist branch with the latest changes, run:

```shell
git subtree split --prefix dist -b dist
git push origin dist:dist
```shell
