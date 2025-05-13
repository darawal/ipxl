const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ipxl.min.js',
        library: "ipxl",
        libraryTarget: 'umd',
        globalObject: 'this'
    },
};