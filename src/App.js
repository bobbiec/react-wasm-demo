import React, { useState, useEffect } from "react";
import Module from "./matrixMultiply.mjs";

function App() {
  const [add, setAdd] = useState();
  const [matrixMultiply, setMatrixMultiply] = useState();
  useEffect(() => {
    Module().then((myModule) => {
      // need to use callback form (() => function) to ensure that `add` is set to the function
      // if you use setX(myModule.cwrap(...)) then React will try to set newX = myModule.cwrap(currentX), which is wrong
      setAdd(() => myModule.cwrap("add", "number", ["number", "number"]));
      setMatrixMultiply(
        () =>
          function (firstMatrix, secondMatrix) {
            const length = firstMatrix.length;
            const flatFirst = new Float32Array(firstMatrix.flat());
            const flatSecond = new Float32Array(secondMatrix.flat());
            console.log({ flatFirst, flatSecond });
            const buffer1 = myModule._malloc(
              flatFirst.length * flatFirst.BYTES_PER_ELEMENT
            );
            const buffer2 = myModule._malloc(
              flatSecond.length * flatSecond.BYTES_PER_ELEMENT
            );
            myModule.HEAPF32.set(flatFirst, buffer1 >> 2);
            myModule.HEAPF32.set(flatSecond, buffer2 >> 2);

            const resultBuffer = myModule._malloc(
              flatFirst.length * flatFirst.BYTES_PER_ELEMENT
            );

            const result = myModule.ccall(
              "matrixMultiply", // name of C function
              "number", // return type
              ["number", "number", "number", "number"], // argument types
              [buffer1, buffer2, resultBuffer, length] // arguments
            );
            const temp_res = [];
            for (let i = 0; i < length ** 2; i++) {
              temp_res.push(
                myModule.HEAPF32[result / Float32Array.BYTES_PER_ELEMENT + i]
              );
            }
            const res = [];
            while (temp_res.length) {
              res.push(temp_res.splice(0, length));
            }
            myModule._free(buffer1);
            myModule._free(buffer2);
            myModule._free(resultBuffer);
            return res;
          }
      );
    });
  }, []);

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
