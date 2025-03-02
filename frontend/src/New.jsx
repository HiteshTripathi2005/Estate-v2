import React, { useState } from "react";

const New = () => {
  const [count, setCount] = useState(0);
  console.log("New page rendered");
  return (
    <div>
      <h1>New Page</h1>
      <p>Count: {count}</p>
    </div>
  );
};

export default New;
