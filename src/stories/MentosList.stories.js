import { fn } from "storybook/test";

import MentosList from "@/pages/mentos/MentosList";

export default {
  title: "Mentos/MentosList",
  component: MentosList,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
};

// ✅ MentosCardTest 컴포넌트를 보여줄 '스토리'를 정의합니다.
export const Default = {
  args: {
    // 멘토스 카드에 필요한 props를 여기에 추가합니다.
    // 예: title, description, image, etc.
    category: 1,
    title: "멘토스 리스트 테스트",
    description: "이것은 테스트용 멘토스 리스트입니다.",
  },
};
