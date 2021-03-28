# React WASM demo

This project is a minimal [create-react-app](https://create-react-app.dev/) project that demonstrates an easy way to run WebAssembly from a local .wasm file.

Note: although the file is named `matrixMultiply`, I still need to figure out the whole `Memory` thing.
So for now, you just get `add`.

## How to run

Run `make`.
The default Makefile target will compile `matrixMultiply.c` into `matrixMultiply.wasm`, and then base64 encode that .wasm file into a Javascript string constant in `matrixMultiply.c`.
Then we convert it back to binary and use [WebAssembly.instantiate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate) to get the module.
The approach used here is inspired by [wasm2js](https://github.com/sipavlovic/wasm2js).

After this, you can `npm install` and `npm start` to run the local dev server.

## Extending

To make changes, edit `matrixMultiply.c` and run `make` again.
You can play with the `emcc` command if you need something else from the compiler.

## Notes

### Motivation

When I tried to use WebAssembly with React, it seemed to be very hard without doing one of the following:

- Ejecting from create-react-app to mess with the `webpack` config
- Using `react-app-rewired` or `craco` to mess with webpack without ejecting
- Hosting the .wasm file somewhere else entirely and fetching it

### Caveats

1. As mentioned at the top, I'm still figuring out how to manage `Memory` here.

2. If you use this, your app will probably be bigger and might load slower.
   Base64 encoding adds an overhead of 33% in file size; this will be loaded with your app instead of being fetched asynchronously.
   Maybe this is fine, if you need the WebAssembly to do anything.

3. It's entirely possible that I've missed a better way to do this.
   If so, let me know so I can do that instead, and sing its praises over the alternatives I saw (see "Motivation").
