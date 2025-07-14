# echo //registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN} >> .npmrc
echo "//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}" > ~/.npmrc
echo $NODE_AUTH_TOKEN
cat .npmrc
pwd