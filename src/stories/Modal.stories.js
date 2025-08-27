import { fn } from "storybook/test";

import { CommonModal } from "@/components/common/CommonModal";
import Button from "@/components/common/Button";
import { useModal } from "@/hooks/common/useModal";

export default {
  title: "Common/CommonModal",
  component: CommonModal,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
};

export const deleteMentos = {
  args: {
    type: "deleteMentos",
    isOpen: true,
  },
};

export const dismissUser = {
  args: {
    type: "dismissUser",
    isOpen: true,
  },
};

export const createMentos = {
  args: {
    type: "createMentos",
    isOpen: true,
  },
};

export const updateMentos = {
  args: {
    type: "updateMentos",
    isOpen: true,
  },
};

export const reportComplete = {
  args: {
    type: "reportComplete",
    isOpen: true,
  },
};

export const reviewComplete = {
  args: {
    type: "reviewComplete",
    isOpen: true,
  },
};

export const deleteComplete = {
  args: {
    type: "deleteComplete",
    isOpen: true,
  },
};

export const dismissSuccess = {
  args: {
    type: "dismissSuccess",
    isOpen: true,
  },
};

export const review = {
  args: {
    type: "review",
    isOpen: true,
    modalData: { title: "제목" }, // 이 title이 CommonModal 컴포넌트로 전달됩니다.
  },
};

export const report = {
  args: {
    type: "report",
    isOpen: true,
    modalData: { title: "신고하기" }, // 이 title이 CommonModal 컴포넌트로 전달됩니다.
  },
};

export const reportDetail = {
  args: {
    type: "reportDetail",
    isOpen: true,
    modalData: { title: "상세보기" }, // 이 title이 CommonModal 컴포넌트로 전달됩니다.
  },
};
