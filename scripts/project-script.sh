###################################################################
echo "PROJECT_APPKEY:$PROJECT_APPKEY"
###################################################################
echo "current folder is..." && pwd

npm i
echo "Run Build"
npm run build && echo "npm run build succeeded" || exit 1
echo "Copy the package.json to the 'build' directory (necessary in order to publish the npm package)..."
cp package.json dist/package.json  
cd dist
echo "current folder is" && pwd
ls -lha


echo "Publishing NPM Package to Artifactory ..."
# if [ "$GIT_BRANCH" = "master" ] && [ "$CONFIG" = "prod" ]; then
#     echo "Publishing Release Version ..."
#     npm publish
# elif [ "$GIT_BRANCH" != "master" ]; then
#     echo "Publishing Development Version ... "
#     cd ../dist
#     VERSION=1.0.0-$BRANCH_IDENTIFIER-$(date +%s)
#     npm version $VERSION
#     echo "BRANCH_IDENTIFIER: $BRANCH_IDENTIFIER"
#     npm publish --tag $BRANCH_IDENTIFIER
#     git tag bizcommon@$VERSION
#     git push origin bizcommon@$VERSION
# fi

echo "Publishing Development Version ... "
cd ../dist
npm version $VERSION
BRANCH_IDENTIFIER="dev"
npm publish --tag $BRANCH_IDENTIFIER
git tag ai-migrate-cli@$VERSION
git push origin ai-migrate-cli@$VERSION