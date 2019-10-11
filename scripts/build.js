'use strict';

const fs = require('fs-extra');
const path = require('path');

const CleanCss = require('clean-css');

const {tokens} = require('@vizia/design-tokens');
const formatCss = require('@vizia/design-tokens/src/lib/format-css');

const cleanCss = new CleanCss({
    returnPromise: true
});

(async function build() {
    const sources = await Promise.all(
        [
            path.resolve('src/css/global.css'),
            // Backwards compatibility
            path.resolve('src/css/compat/colors.css'),
            // Backwards compatibility
            path.resolve('src/css/compat/icons.css'),
            // Backwards compatibility
            path.resolve('src/css/compat/layout.css')
        ]
            .map((path) => fs.readFile(path))
    );

    const destinationPath = path.resolve('build');

    const output = []
        .concat(formatCss(tokens.css))
        .concat(sources)
        .join('');

    const {styles: minifiedOutput} = await cleanCss.minify(output);

    await fs.mkdirp(destinationPath);

    await fs.writeFile(
        path.resolve(destinationPath, 'vizia-style.min.css'),
        minifiedOutput
    );
}());
