@echo off
echo "Building new release"
SET FOLDER="%CD%\dist"
DEL /F/Q/S "%FOLDER%" > NUL
RMDIR /Q/S "%FOLDER%"
npm install && npm run buildpackage

rem npm publish l2js-client-1.0.0.tgz