#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# These variables are set by CI builds.
if [ ! -n "$GH_TOKEN" ] && [ ! -n "$GH_REF" ]; then
    # Assume a test build, pushing to a contoributor's forked repository
    myorigin=$(git config --get remote.origin.url)
    mydir=$(dirname $(realpath $0))
    export PATH="${mydir}/node_modules/.bin:${PATH}"
fi

# VOLUMIO THEME
# clear and re-create the dist directory
rm -rf dist || exit 0;
mkdir dist;

# Build Volumio UI
gulp build --theme="volumio" --env="production"

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
git commit -m "Deploy to Dist Branch"

# Force push from the current repo's master branch to the dist branch for deployment
if [ -n "$myorigin" ]; then
    git add remote origin "$myorigin"
    git push --force origin master:dist
else
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:dist > /dev/null 2>&1
fi

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
if [ -n "$myorigin" ]; then
    git add remote origin "$myorigin"
    git push --force origin master:dist3
else
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:dist3 > /dev/null 2>&1
fi
