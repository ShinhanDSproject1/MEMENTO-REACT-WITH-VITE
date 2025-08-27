import { fn } from "storybook/test";

import MentosCard from "@/components/common/MentosCard";

export default {
  title: "Common/MentosCard",
  component: MentosCard,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
};

export const completed = {
  args: {
    title: "React 강의",
    price: 100000,
    location: "연남동",
    imageUrl: "https://picsum.photos/seed/react/200/300",
    status: "completed",
  },
};

export const empty = {
  args: {
    title: "React 강의",
    price: 100000,
    location: "연남동",
    imageUrl: "https://picsum.photos/seed/react/200/300",
  },
};

export const pending = {
  args: {
    title: "React 강의",
    price: 100000,
    location: "연남동",
    imageUrl: "https://picsum.photos/seed/react/200/300",
    status: "pending",
  },
};

export const mento = {
  args: {
    title: "React 강의",
    price: 100000,
    location: "연남동",
    imageUrl: "https://picsum.photos/seed/react/200/300",
    status: "mento",
  },
};
