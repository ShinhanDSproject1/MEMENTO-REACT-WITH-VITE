import type { UserRole } from "@/entities/auth";

const KEY = "auth:user";
export type SnapshotUser = {
  memberName: string;
  memberType: UserRole;
  accessToken?: string;
};

export const saveUserSnapshot = (u: SnapshotUser) => {
  const str = JSON.stringify(u);
  localStorage.setItem(KEY, str);
};

export const loadUserSnapshot = (): SnapshotUser | null => {
  const s = localStorage.getItem(KEY);
  try {
    return s ? (JSON.parse(s) as SnapshotUser) : null;
  } catch {
    return null;
  }
};

export const clearUserSnapshot = () => localStorage.removeItem(KEY);
