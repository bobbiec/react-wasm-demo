import React, { useState, useEffect } from "react";
import { wasm } from "./matrixMultiply";

function App() {
  const [matrixMultiply, setMatrixMultiply] = useState();
  const [add, setAdd] = useState();
  useEffect(() => {
    // load the WebAssembly module
    const wasmCode = new Uint8Array(wasm.length);
    for (var i in wasm) {
      wasmCode[i] = wasm.charCodeAt(i);
    }
    WebAssembly.instantiate(wasmCode).then((obj) => {
      setMatrixMultiply(() => obj.instance.exports.matrixMultiply);
      setAdd(() => obj.instance.exports.add);
    });
  }, []);

  if (!add || !matrixMultiply) {
    return "Loading webassembly...";
  }

  return (
    <div className="App">
      <p>Pls work</p>
      <div>1 + 2 = {add(1, 2)}</div>
    </div>
  );
}

export default App;
