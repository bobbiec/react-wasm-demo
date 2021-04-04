import React, { useState, useEffect } from "react";
import Module from "./matrixMultiply.mjs";

function wrapMatrixMultiply(myModule) {
  return function (firstMatrix, secondMatrix) {
    const length = firstMatrix.length;

    // set up input arrays with the input data
    const flatFirst = new Float32Array(firstMatrix.flat());
    const flatSecond = new Float32Array(secondMatrix.flat());
    const buffer1 = myModule._malloc(
      flatFirst.length * flatFirst.BYTES_PER_ELEMENT
    );
    const buffer2 = myModule._malloc(
      flatSecond.length * flatSecond.BYTES_PER_ELEMENT
    );
    myModule.HEAPF32.set(flatFirst, buffer1 >> 2);
    myModule.HEAPF32.set(flatSecond, buffer2 >> 2);

    // allocate memory for the result array
    const resultBuffer = myModule._malloc(
      flatFirst.length * flatFirst.BYTES_PER_ELEMENT
    );

    // make the call
    const resultPointer = myModule.ccall(
      "matrixMultiply",
      "number",
      ["number", "number", "number", "number"],
      [buffer1, buffer2, resultBuffer, length]
    );

    // get the data from the returned pointer into an flat array
    const resultFlatArray = [];
    for (let i = 0; i < length ** 2; i++) {
      resultFlatArray.push(
        myModule.HEAPF32[resultPointer / Float32Array.BYTES_PER_ELEMENT + i]
      );
    }

    // convert the flat array back into an array of arrays
    const result = [];
    while (resultFlatArray.length) {
      result.push(resultFlatArray.splice(0, length));
    }
    myModule._free(buffer1);
    myModule._free(buffer2);
    myModule._free(resultBuffer);
    return result;
  };
}

function App() {
  const [add, setAdd] = useState();
  const [matrixMultiply, setMatrixMultiply] = useState();
  useEffect(
    // useEffect here is roughly equivalent to putting this in componentDidMount for a class component
    () => {
      Module().then((myModule) => {
        // need to use callback form (() => function) to ensure that `add` is set to the function
        // if you use setX(myModule.cwrap(...)) then React will try to set newX = myModule.cwrap(currentX), which is wrong
        setAdd(() => myModule.cwrap("add", "number", ["number", "number"]));
        setMatrixMultiply(() => wrapMatrixMultiply(myModule));
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
