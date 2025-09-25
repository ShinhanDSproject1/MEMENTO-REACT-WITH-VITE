import { type MotionProps } from "framer-motion";

export type CategoryKey = "spending" | "life" | "saving" | "growth";
export type Role = "mentee" | "mentor";

export interface SplashProps {
  onDone?: (message?: string) => void;
  onSelectCategory?: (key: CategoryKey) => void;
  onLogin?: (email: string, password: string, role?: Role) => void;
  nextLabel?: string;
}

export const fadeUp: MotionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};
