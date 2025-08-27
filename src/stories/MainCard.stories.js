import { fn } from "storybook/test";

import MainCard from "@/components/common/MainCard";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Common/MainCard",
  component: MainCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "light" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const notice = {
  args: {
    title: "공지사항",
    context: `멘토링 신청, 재테크 유형, 서비스 점검 등
    안내사항을 확인하세요.`,
  },
};

export const FAQ = {
  args: {
    title: "FAQ",
    context: `결제취소, 환불, 문의 등 주요 질문과 답변을 
살펴보세요.`,
  },
};
