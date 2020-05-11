'use strict';

const fs = require('fs-extra');
const path = require('path');

const CleanCss = require('clean-css');

const getDesignTokens = require('@vizia/design-tokens');
const VIZIA_DARK = require('@vizia/design-tokens/src/presets/vizia-dark');

const cleanCss = new CleanCss({
    returnPromise: true
});

const formatCss = (cssTokens, selector = ':root') => {
    const customProperties = Object.entries(cssTokens)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ');

    return `${selector} { ${customProperties} }`;
};

async function getCss(files) {
    const designTokens = getDesignTokens(VIZIA_DARK);
    const fileOutput = await Promise.all(
        [...files].map((path) => fs.readFile(path))
    );
    const output = [formatCss(designTokens.css), ...fileOutput].join('');
    const {styles: minifiedOutput} = await cleanCss.minify(output);

    return minifiedOutput;
}

(async function build() {
    const destinationPath = path.resolve('build');

    await fs.mkdirp(destinationPath);

    const css = await getCss([
        // Core
        path.resolve('src/css/global.css'),
        // Backwards compatibility
        path.resolve('src/css/compat/colors.css'),
        // Backwards compatibility
        path.resolve('src/css/compat/icons.css'),
        // Backwards compatibility
        path.resolve('src/css/compat/layout.css')
    ]);

    await fs.writeFile(
        path.resolve(destinationPath, 'vizia-style.min.css'),
        css
    );

    console.log('Vizia CSS built');
}());
