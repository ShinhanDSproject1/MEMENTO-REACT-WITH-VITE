import { fn } from "storybook/test";

import Button from "@/components/common/Button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Common/Button",
  component: Button,
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

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const primary = {
  args: {
    variant: "primary",
    label: "Button",
    children: "primary",
    size: "md",
  },
};

export const danger = {
  args: {
    variant: "danger",
    label: "Button",
    children: "danger",
    size: "md",
  },
};

export const cancelGray = {
  args: {
    variant: "cancelGray",
    label: "Button",
    children: "cancelGray",
    size: "md",
  },
};
export const light = {
  args: {
    variant: "light",
    label: "Button",
    children: "light",
    size: "md",
  },
};
export const refund = {
  args: {
    variant: "refund",
    label: "Button",
    children: "refund",
    size: "md",
  },
};
export const lightBlue = {
  args: {
    variant: "lightBlue",
    label: "Button",
    children: "lightBlue",
    size: "md",
  },
};
export const cancelWhite = {
  args: {
    variant: "cancelWhite",
    label: "Button",
    children: "cancelWhite",
    size: "md",
  },
};

export const xs = {
  args: {
    variant: "primary",
    label: "Button",
    children: "xs",
    size: "xs",
  },
};

export const sm = {
  args: {
    variant: "primary",
    label: "Button",
    children: "sm",
    size: "sm",
  },
};

export const md = {
  args: {
    variant: "primary",
    label: "Button",
    children: "md",
    size: "md",
  },
};

export const lg = {
  args: {
    variant: "primary",
    label: "Button",
    children: "lg",
    size: "lg",
  },
};

export const xl = {
  args: {
    variant: "primary",
    label: "Button",
    children: "xl",
    size: "xl",
  },
};
