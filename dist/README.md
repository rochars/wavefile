# Distribution
This library is a ES module also distributed as UMD module that can be used in Node.js and browsers.

**This lib works out of the box in Node.js** when installed with ```npm install wavefile```. It includes a [TypeScript](https://www.typescriptlang.org/) definition file: **./index.d.ts**.

If you use the [Closure Compiler](https://github.com/google/closure-compiler), this package includes a externs file: **./externs/wavefile.js**.

## The dist files:
- The **UMD** module **./dist/wavefile.umd.js** is transpiled to ES5 and minified. It is compatible with Node and browsers. It can be used with ```<script>``` tags and AMD loaders. It is served in the "main" field of package.json.

- The **ES6 bundle** is **./dist/wavefile.js**, served as "es2015" in package.json. It is not compiled/minified.

- **./index.js** is served as "module" in package.json. This should be the entry point for bundlers.

## LICENSE
Copyright (c) 2017-2018 Rafael da Silva Rocha.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
