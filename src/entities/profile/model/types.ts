export type GetProfile = MentiProfile | MentoProfile;
export type UserRole = "MENTI" | "MENTO";

export interface Certification {
  mentoCertificationSeq: number;
  certificationName: string;
  certificationImageUrl: string;
}

export interface BaseProfile {
  memberName: string;
  memberPhoneNumber: string;
  memberBirthDate: string;
  memberId: string;
  memberType: UserRole;
}

export interface MentoProfile extends BaseProfile {
  memberType: "MENTO";
  certifications: Certification[];
}

export interface MentiProfile extends BaseProfile {
  memberType: "MENTI";
}

export interface UpdateProfileInput {
  memberPhoneNumber: string;
  memberBirthDate: string;
}

export interface ApiEnvelope<T> {
  code: number;
  status: number;
  message: string;
  result: T;
}

export interface ApiErrorEnvelope {
  code: number;
  status: number;
  message: string;
  timestamp?: string;
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type MentoProfileDetail = {
  mentoProfileImage?: string | null;
  mentoProfileContent?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  availableDays?: string | null;
  mentoPostcode?: string | null;
  mentoRoadAddress?: string | null;
  mentoBname?: string | null;
  mentoDetail?: string | null;
};

export type GetProfileSuccess = ApiEnvelope<GetProfile>;
export type UpdateProfileSuccess = ApiEnvelope<null>;
export type UpdatePasswordSuccess = ApiEnvelope<null>;
export type WithdrawSuccess = ApiEnvelope<null>;
export type GetMentoProfileDetailSuccess = ApiEnvelope<MentoProfileDetail>;
