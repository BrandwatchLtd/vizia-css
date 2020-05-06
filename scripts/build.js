'use strict';

const fs = require('fs-extra');
const path = require('path');

const CleanCss = require('clean-css');

const cleanCss = new CleanCss({
    returnPromise: true
});

async function buildCss(inputFiles, outputFile) {
    const output = await Promise.all(
        [...inputFiles].map((path) => fs.readFile(path))
    );
    const {styles: minifiedOutput} = await cleanCss.minify(output.join(''));

    return fs.writeFile(outputFile, minifiedOutput);
}

(async function () {
    const destinationPath = path.resolve('build');

    await fs.mkdirp(destinationPath);
    await buildCss(
        [
            // Core
            path.resolve('src/css/global.css'),
            // Backwards compatibility
            path.resolve('src/css/compat/colors.css'),
            // Backwards compatibility
            path.resolve('src/css/compat/icons.css'),
            // Backwards compatibility
            path.resolve('src/css/compat/layout.css')
        ],
        path.resolve(destinationPath, 'vizia-style.min.css')
    );
}());
