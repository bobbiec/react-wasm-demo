# React WASM demo

This project is a minimal [create-react-app](https://create-react-app.dev/) project that demonstrates an easy way to compile WebAssembly into an ES6 module and use it in a create-react-app React app (without having to eject).

## How to run

Run `make`.
The default Makefile target will compile `matrixMultiply.c` into `matrixMultiply.mjs`, which is imported in App.js.

After this, you can `npm install` and `npm start` to run the local dev server.

## How to get here from a fresh create-react-app

1. Add `src/matrixMultiply.c`
2. Add Makefile with command to compile `src/matrixMultiply.mjs`
3. Add `"ignorePatterns": ["src/matrixMultiply.mjs"]` to `eslintConfig` in package.json
   - This is required because the ES6 module (`.mjs` file) fails linting
4. Import `Module` from the .mjs file in App.js, instantiate it (which returns a Promise), and resolve the Promise to do things with the resulting module (`myModule` in App.js).

All the interesting code is in `src/matrixMultiply.c` and `App.js`.
The Makefile shows how to compile the .c file in the .mjs file.
The ESLint config change is just required to build the app.

## Extending

To make changes, edit `matrixMultiply.c` and run `make` again.
You can play with the `emcc` command if you need something else from the compiler.

## Caveats

1. If you use this, your app will probably be bigger and might load slower.
   Compiling to single-file .mjs in-lines the WASM content as base64 in the variable `wasmBinaryFile`.
   Base64 encoding adds an overhead of 33% in file size; this will also be loaded with your app instead of being fetched asynchronously.
   Maybe this is fine for you, if you need the WebAssembly to do anything.

## Notes

### Motivation

When I tried to use WebAssembly with React, it seemed to be very hard without doing one of the following:

- Ejecting from create-react-app to mess with the `webpack` config
- Using `react-app-rewired` or `craco` to mess with webpack without ejecting
- Hosting the .wasm file somewhere else entirely and fetching it

### How I got here

Most of the intro-to-WebAssembly-type articles I found while my search involved using compiling to a .wasm file, and then fetching and instantiating it with `instantiateStreaming`.
I instantly ran into problems when I tried this with create-react-app, because the default webpack configuration wouldn't let me serve a .wasm file.
The rest of the intro articles used `.html` scaffolding targets - I also had issues getting this to work with create-react-app.

So, initially I would generate an .wasm file, and use the approach from [sipavlovic/wasm2js](https://github.com/sipavlovic/wasm2js) to include it as base64 (you can see this in older commits on this repo).
This worked well for my simple "add two integers" function.
But I ran into issues when I needed methods on the `Module` object to work with memory to pass around arrays for matrixMultiply.

Eventually I figured out `emcc` can directly generate ES6 Javascript modules!
The documentation says,

```
-o  <target>

[link] When linking an executable, the target file name extension defines the output type to be generated:

- <name>.mjs: ES6 JavaScript module (+ separate <name>.wasm file if emitting WebAssembly).
```

...That's all it says.
It doesn't say anything else about what this means or how I would use it.
So I tried this, and... it didn't work, even after excluding it from eslint.
I ended up needing to add `-s USE_ES6_IMPORT_META=0` to the emcc command to avoid an error involving `import.meta`, which was documented nowhere besides random Github issues like [this one](https://github.com/emscripten-core/emscripten/issues/10156).

But, once I did that, it worked like a charm.
Honestly I'm not sure that I understand it well enough and maybe I'm missing something, but I'll try writing this up and contributing it back to the MDN docs and hopefully someone can check it.

### Other helpful resources

- The memory management code in `wrapMatrixMultiply` is pretty tedious - Dan Ruta's post on [Passing and returning WebAssembly array parameters](https://becominghuman.ai/passing-and-returning-webassembly-array-parameters-a0f572c65d97) was helpful to me, and their package [wasm-arrays](https://github.com/DanRuta/wasm-arrays) looks useful for 1-D arrays.
