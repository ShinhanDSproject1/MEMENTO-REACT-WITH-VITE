import React from "react";
import Button from "../Button";

function ButtonVariantTest() {
  return (
    <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-3">
      <Button variant="primary" size="md">
        primary
      </Button>
      <Button variant="danger" size="md">
        danger
      </Button>
      <Button variant="cancelGray" size="md">
        cancelGray
      </Button>
      <Button variant="light" size="md">
        light
      </Button>
      <Button variant="refund" size="md">
        refund
      </Button>
      <Button variant="lightBlue" size="md">
        lightBlue
      </Button>
      <Button variant="cancelWhite" size="md">
        cancelWhite
      </Button>
    </div>
  );
}

export default ButtonVariantTest;
