# Distribution
This library is implemented as a ES6 module and also distributed as a CommonJS module, UMD module and a compiled script for browsers.

- The CommonJS is the one used by Node. It is served in the "main" field of this library's package.json
- The UMD module is compatible with Node, AMD and browsers. It is served in the "browser" field.
- The compiled dist is browser-only and should be the one served by CDNs.
- The "module" field points to "./index.js" and should be the default entry point for ES6.

If you are using a module bundler to compile a module that depends on this library you might need to specify what is the correct entry point as some bundlers will assume "browser". In general, you should point to "module".

## webpack example:
```javascript
module.exports = {
  entry: './index.js',
  resolve: {
    // tells webpack to use 'module' or 'main'
    // not 'browser'
    mainFields: ['module', 'main']
  },
  ...
};
```
