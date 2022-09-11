public/matrixMultiply.wasm: src/matrixMultiply.mjs
src/matrixMultiply.mjs: src/matrixMultiply.c
	emcc --no-entry src/matrixMultiply.c -o src/matrixMultiply.mjs  \
	  --pre-js src/locateFile.js  \
	  -s ENVIRONMENT='web'  \
	  -s EXPORT_NAME='createModule'  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s EXPORTED_FUNCTIONS='["_add", "_matrixMultiply", "_malloc", "_free"]'  \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
	  -O3
	mv src/matrixMultiply.wasm public/matrixMultiply.wasm

.PHONY: clean
clean:
	rm public/matrixMultiply.wasm src/matrixMultiply.mjs