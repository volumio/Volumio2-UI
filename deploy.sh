#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# VOLUMIO THEME
# clear and re-create the dist directory
rm -rf dist || exit 0;
mkdir dist;

# Build Volumio UI
echo "Building Volumio UI"
gulp build --theme="volumio" --env="production"

# Fallback to 127.0.0.1 (for Ui on non-networked systems)
echo "Writing local-config.json"
echo '{"localhost": "http://127.0.0.1:3000"}' > dist/app/local-config.json

# go to the dist directory and create a *new* Git repo
echo "Initializing Git Repo"
cd dist
git init

# inside this git repo we'll pretend to be a new user
echo "Writing Git Config"
git config user.name "Volumio"
git config user.email "info@volumio.org"

# Deploy
echo "Deploying to Dist Branch"
git add .
git commit -m "Deploy to Dist Branch"

# Force push from the current repo's master branch to the dist branch for deployment
echo "Pushing to Dist Branch"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:dist > /dev/null 2>&1

cd ..
# VOLUMIO3 THEME
# clear and re-create the dist directory
rm -rf dist || exit 0;
mkdir dist;

# Build Volumio UI
gulp build --theme="volumio3" --env="production"

# Fallback to 127.0.0.1 (for Ui on non-networked systems)
echo '{"localhost": "http://127.0.0.1:3000"}' > dist/app/local-config.json

# go to the dist directory and create a *new* Git repo
cd dist
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Volumio"
git config user.email "info@volumio.org"

# Deploy
git add .
git commit -m "Deploy to Dist3 Branch"

# Force push from the current repo's master branch to the dist branch for deployment
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:dist3 > /dev/null 2>&1
