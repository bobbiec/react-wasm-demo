import React, { useState, useEffect } from "react";
import Module from "./matrixMultiply.mjs";

function App() {
  const [add, setAdd] = useState();
  useEffect(() => {
    Module().then((myModule) => {
      // need to use callback form (() => function) to ensure that `add` is set to the function
      // if you use setX(myModule.cwrap(...)) then React will try to set newX = myModule.cwrap(currentX), which is wrong
      setAdd(() => myModule.cwrap("add", "number", ["number", "number"]));
    });
  }, []);

  if (!add) {
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
