// src/components/common/MainCard.tsx
import { Fragment } from "react";
import Button from "./Button";

export interface MainCardProps {
  title: string;
  context: string;
}

export default function MainCard({ title, context }: MainCardProps) {
  const lines = context.split("\n");

  const formattedContext = lines.map((line, index) => (
    <Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
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
