import { fn } from "storybook/test";

import MentoIntroduce from "@/pages/Mentos/MentoIntroduce";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Mentos/introduce",
  component: MentoIntroduce,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

// ✅ MentosCardTest 컴포넌트를 보여줄 '스토리'를 정의합니다.
export const Default = {
  args: {
    // 멘토스 카드에 필요한 props를 여기에 추가합니다.
    // 예: title, description, image, etc.
    title: "CertificationRegister 테스트",
    description: "Default에서 확인 요망...",
  },
};
