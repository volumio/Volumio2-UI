## Volumio Web Interface

This repo is used as a git submodule in [Volumio2](https://github.com/volumio/Volumio2).
Only the `dist/` directory is needed by Volumio2, so there is a [dist branch](https://github.com/volumio/Volumio2-UI/tree/dist) which contains just that.

To update the dist branch with the latest changes, run:

```shell
git subtree split --prefix dist -b dist
git push origin dist:dist
```
