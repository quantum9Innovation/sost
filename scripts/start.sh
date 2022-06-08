#!/usr/bin/env bash
echo "Identifying OS and launching index.html"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open ./index.html
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open ./index.html
elif [[ "$OSTYPE" == "cygwin" ]]; then
    xdg-open ./index.html
elif [[ "$OSTYPE" == "msys" ]]; then
    start ./index.html
elif [[ "$OSTYPE" == "win32" ]]; then
    start ./index.html
elif [[ "$OSTYPE" == "freebsd"* ]]; then
    start ./index.html
else
    echo "Unknown OS, trying all methods..."
    xdg-open ./index.html || open ./index.html || start ./index.html
    echo "If no page is displayed, please open index.html manually."
fi
