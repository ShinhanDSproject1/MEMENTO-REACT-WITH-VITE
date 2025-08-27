import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

function MainCard({ title, context, ...props }) {
  const formattedContext = context.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < context.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));
  return (
    <div className="flex max-w-[360px] flex-col gap-2 rounded-[15px] border-[1px] p-4">
      <section>{title}</section>
      <section className="flex w-[70%]">
        <p className="text-[0.6rem]">{formattedContext}</p>
      </section>
      <div className="flex justify-end">
        <Button className="w-[30%] items-center text-[0.75rem]" variant="light" size="sm">
          바로가기
        </Button>
      </div>
    </div>
  );
}

MainCard.propTypes = { title: PropTypes.string, context: PropTypes.string };

export default MainCard;
