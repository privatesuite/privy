cls
@ECHO off

echo Starting creation of distribution folder

rmdir "../staging/dist" /s /q > nul
mkdir "../staging/dist" > nul

mkdir "../staging/dist/js" > nul
mkdir "../staging/dist/css" > nul
mkdir "../staging/dist/img" > nul
mkdir "../staging/dist/views" > nul

copy /Y "../js" "../staging/dist/js" > nul
copy /Y "../css" "../staging/dist/css" > nul
copy /Y "../img" "../staging/dist/img" > nul
copy /Y "../views" "../staging/dist/views" > nul

more "../index.html" > "../staging/dist/index.html"
more "../manifest.json" > "../staging/dist/manifest.json"
more "../sw.js" > "../staging/dist/sw.js"

echo Distribution folder is ready

@ECHO on
