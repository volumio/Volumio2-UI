#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# Fallback to 127.0.0.1 (for Ui on non-networked systems)
echo '{"localhost": "http://127.0.0.1:3000"}' > dist-volumio3/app/local-config.json

# go to the dist directory and create a *new* Git repo
cd dist-volumio3
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Volumio"
git config user.email "info@volumio.org"

# Deploy
git add .
git commit -m "Deploy to Dist3 Branch"

# Force push from the current repo's master branch to the dist3 branch for deployment
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:dist3 > /dev/null 2>&1

cd ..