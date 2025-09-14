// src/components/common/ButtonGroup.tsx
import AdminButtonGroup from "./AdminButtonGroup";
import MenteeButtonGroup from "./MenteeButtonGroup";
import MentoButtonGroup from "./MentoButtonGroup";

export type UserType = "mentor" | "mentee" | "admin" | "guest";

export interface ButtonGroupProps {
  userType?: UserType;
}

export default function ButtonGroup({ userType }: ButtonGroupProps) {
  if (userType === "mentor") {
    return <MentoButtonGroup />;
  } else if (userType === "admin") {
    return <AdminButtonGroup />;
  } else {
    return <MenteeButtonGroup />;
  }
}
