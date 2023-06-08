#!/usr/bin/env bash
echo "Compiling TypeScript …"
yarn run tsc
echo "Building project …"
browserify dist/ts/sost --s sost -o dist/sost.js
echo "Minifying result …"
terser ./dist/sost.js --keep-classnames --keepfnames --compress -o ./dist/sost.min.js
echo "Build complete; see \`dist/sost.min.js\`."
