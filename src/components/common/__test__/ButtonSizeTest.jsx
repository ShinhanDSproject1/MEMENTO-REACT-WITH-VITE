import React from "react";
import Button from "../Button";

function ButtonSizeTest() {
  return (
    <div className="flex justify-around">
      <Button variant="primary" size="xs">
        xs
      </Button>
      <Button variant="primary" size="sm">
        sm
      </Button>
      <Button variant="primary" size="md">
        md
      </Button>
      <Button variant="primary" size="lg">
        lg
      </Button>
      <Button variant="primary" size="xl">
        xl
      </Button>
    </div>
  );
}

export default ButtonSizeTest;
