import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react-vite";
import preview from "../storybook/preview"; // 반드시 default export

setProjectAnnotations([a11yAddonAnnotations, preview]);
