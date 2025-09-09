// src/components/common/ButtonGroup.tsx
import AdminButtonGroup from "./AdminButtonGroup";
import MenteeButtonGroup from "./MenteeButtonGroup";
import MentoButtonGroup from "./MentoButtonGroup";

export type UserType = "mentor" | "mentee" | "admin";

export interface ButtonGroupProps {
  userType?: UserType; // 옵셔널 → 기본값은 mentee
}

export default function ButtonGroup({ userType = "mentee" }: ButtonGroupProps) {
  if (userType === "mentor") {
    return <MentoButtonGroup />;
  } else if (userType === "admin") {
    return <AdminButtonGroup />;
  } else {
    return <MenteeButtonGroup />;
  }
}
