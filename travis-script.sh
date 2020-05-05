#!/bin/bash

# exit with nonzero exit code if anything fails
set -e

# Build the classic UI and move it into "dist-volumio"
npm run build:volumio && mv dist dist-volumio

# Build the v3 UI and move it into "dist-volumio3"
npm run build:volumio3 && mv dist dist-volumio3

# Copy the classic UI into the folder which will be deployed to Firebase
cp -r dist-volumio firebase-hosting

# Store actual directory
P_DIR=$(pwd)

# Configure GIT user
git config --global user.name "Volumio"
git config --global user.email "info@volumio.org"

# Push classic UI on 'dist' branch
cd "${P_DIR}/dist-volumio"
# Fallback to 127.0.0.1 (for Ui on non-networked systems)
echo '{"localhost": "http://127.0.0.1:3000"}' > app/local-config.json
git init && git add . && git commit -m "Deploy to dist branch"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:dist > /dev/null 2>&1

# Push v3 UI on 'dist3' branch
cd "${P_DIR}/dist-volumio3"
# Fallback to 127.0.0.1 (for Ui on non-networked systems)
echo '{"localhost": "http://127.0.0.1:3000"}' > app/local-config.json
git init && git add . && git commit -m "Deploy to dist branch"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:dist3 > /dev/null 2>&1

cd "${P_DIR}"