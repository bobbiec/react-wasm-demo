src/matrixMultiply.mjs: src/matrixMultiply.c
	emcc --no-entry src/matrixMultiply.c -o src/matrixMultiply.mjs  \
	  -s ENVIRONMENT='web'  \
	  -s MODULARIZE=1  \
	  -s SINGLE_FILE=1  \
	  -s EXPORT_ES6=1  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s EXPORTED_FUNCTIONS='["_add", "_matrixMultiply", "_malloc", "_free"]'  \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'