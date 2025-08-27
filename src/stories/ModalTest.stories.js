import { fn } from "storybook/test";

import ResultModalTest from "@/components/common/__test__/ResultModalTest";

export default {
  title: "Common/CommonModal/ResultModalTest",
  component: ResultModalTest,
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
    title: "멘토스 카드 테스트",
    description: "Default에서 확인 요망...",
  },
};
