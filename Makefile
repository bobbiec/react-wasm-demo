src/matrixMultiply.js: src/matrixMultiply.wasm
	echo -n "export const wasm = atob('" > src/matrixMultiply.js
	base64 -w 0 src/matrixMultiply.wasm >> src/matrixMultiply.js
	echo "')" >> src/matrixMultiply.js


src/matrixMultiply.wasm: src/matrixMultiply.c
	emcc --no-entry src/matrixMultiply.c -o src/matrixMultiply.wasm
