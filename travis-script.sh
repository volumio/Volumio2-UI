#!/bin/bash

# exit with nonzero exit code if anything fails
set -e

console.log(${GH_REF})

# Build the classic UI and move it into "dist-volumio"
echo "Building Volumio UI"
npm run build:volumio && mv dist dist-volumio

# Build the v3 UI and move it into "dist-volumio3"
echo "Building Volumio3 UI"
npm run build:volumio3 && mv dist dist-volumio3

# Configure GIT user
echo "Configuring Git User"
git config --global user.name "Volumio"
git config --global user.email "info@volumio.org"

console.log(${GH_TOKEN})
git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/volumio/Volumio2-UI.git

# Push classic UI on 'dist' branch
echo "Preparing dist branch"
cd "dist-volumio"

# Fallback to 127.0.0.1 (for Ui on non-networked systems)
echo "Writing local-config.json"
echo '{"localhost": "http://127.0.0.1:3000"}' > app/local-config.json

echo "Initializing Git Repo"
git init && git add . && git commit -m "Deploy to dist branch"

echo "Pushing to dist branch"
git push --force --quiet master:dist

cd .. 

# Push v3 UI on 'dist3' branch
echo "Preparing dist3 branch"
cd "dist-volumio3"

# Fallback to 127.0.0.1 (for Ui on non-networked systems)
echo "Writing local-config.json"
echo '{"localhost": "http://127.0.0.1:3000"}' > app/local-config.json

echo "Initializing Git Repo"
git init && git add . && git commit -m "Deploy to dist3 branch"

echo "Pushing to dist3 branch"
git push --force --quiet master:dist3

cd ..