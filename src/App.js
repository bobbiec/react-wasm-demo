import React, { useState, useEffect } from "react";
import createModule from "./matrixMultiply.mjs";

function wrapMatrixMultiply(Module) {
  // JS-friendly wrapper around the WASM call
  return function (firstMatrix, secondMatrix) {
    // multiplies two square matrices (as 2-D arrays) of the same size and returns the result
    const length = firstMatrix.length;

    // set up input arrays with the input data
    const flatFirst = new Float32Array(firstMatrix.flat());
    const flatSecond = new Float32Array(secondMatrix.flat());
    const buffer1 = Module._malloc(
      flatFirst.length * flatFirst.BYTES_PER_ELEMENT
    );
    const buffer2 = Module._malloc(
      flatSecond.length * flatSecond.BYTES_PER_ELEMENT
    );
    Module.HEAPF32.set(flatFirst, buffer1 >> 2);
    Module.HEAPF32.set(flatSecond, buffer2 >> 2);

    // allocate memory for the result array
    const resultBuffer = Module._malloc(
      flatFirst.length * flatFirst.BYTES_PER_ELEMENT
    );

    // make the call
    const resultPointer = Module.ccall(
      "matrixMultiply",
      "number",
      ["number", "number", "number", "number"],
      [buffer1, buffer2, resultBuffer, length]
    );

    // get the data from the returned pointer into an flat array
    const resultFlatArray = [];
    for (let i = 0; i < length ** 2; i++) {
      resultFlatArray.push(
        Module.HEAPF32[resultPointer / Float32Array.BYTES_PER_ELEMENT + i]
      );
    }

    // convert the flat array back into an array of arrays
    const result = [];
    while (resultFlatArray.length) {
      result.push(resultFlatArray.splice(0, length));
    }
    Module._free(buffer1);
    Module._free(buffer2);
    Module._free(resultBuffer);
    return result;
  };
}

function App() {
  const [add, setAdd] = useState();
  const [matrixMultiply, setMatrixMultiply] = useState();
  useEffect(
    // useEffect here is roughly equivalent to putting this in componentDidMount for a class component
    () => {
      createModule().then((Module) => {
        // need to use callback form (() => function) to ensure that `add` is set to the function
        // if you use setX(myModule.cwrap(...)) then React will try to set newX = myModule.cwrap(currentX), which is wrong
        setAdd(() => Module.cwrap("add", "number", ["number", "number"]));
        setMatrixMultiply(() => wrapMatrixMultiply(Module));
      });
    },
    []
  );

  if (!add || !matrixMultiply) {
    return "Loading webassembly...";
  }

  const result = matrixMultiply(
    [
      [1, 2],
      [3, 4],
    ],
    [
      [5, 6],
      [7, 8],
    ]
  );

  return (
    <div className="App">
      <p>Pls work</p>
      <div>1 + 2 = {add(1, 2)}</div>
      <div>[[1, 2], [3, 4]] @ [[5, 6], [7, 8]] = {JSON.stringify(result)}</div>
    </div>
  );
}

export default App;
