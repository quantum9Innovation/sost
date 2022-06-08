#!/usr/bin/env bash
echo "Building project"
browserify sost --s sost -o dist/sost.min.js
echo "Minifying result"
terser ./dist/sost.min.js --keep-classnames --keepfnames --compress -o ./dist/sost.min.js
echo "Build complete; see dist/sost.min.js"
