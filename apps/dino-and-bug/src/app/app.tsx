import { Button, FlexContainer } from "@jorben-amich/components"
import { useState } from "react";

export function App() {
  const [value, setValue] = useState(0);

  const processValueChange = (increment?: boolean) => setValue(increment ? value + 1 : value - 1);

  return (
    <div>
      <FlexContainer direction="vertical">
        <h1>Dino + Bug</h1>
        <p>{`Current value is ${value}`}</p>
      </FlexContainer>
        <FlexContainer direction="horizontal">
          <Button onClick={() => processValueChange(true)}>Increment</Button>
          <Button onClick={() => processValueChange()}>Decrement</Button>
        </FlexContainer>
      </div>
  );
}

export default App;
