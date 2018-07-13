# Building wavefile

Building works the same on all platforms:
```
npm run build
```
This will lint the sources, test the sources, compile a UMD version, a CJS version, a ES bundle, compile a minified browser version, test everything and generate documentation files.

There **must** be no errors or warnings during the build.

The dist files are generated in the *dist/* folder.

The API documentation is generated in the *docs/* folder.

Mind that wavefile uses Google Closure Compiler with compilation level set to ADVANCED, so properties that have not been exported will be renamed (and likely result in errors in the compiled browser version).
