// 키는 페이지 간 공유에 사용
const KEY = "mentorProfile.v1";

export type MentorOnboardingDraft = {
  profileImageDataUrl?: string;
  profileContent?: string;
  days?: string[];
  start?: number;
  end?: number;
  zonecode?: string;
  address?: string;
  detail?: string;
  bname?: string;
};

// 저장
export function saveMentorOnboardingDraft(draft: Partial<MentorOnboardingDraft>) {
  const current = loadMentorOnboardingDraft() ?? {};
  const next = { ...current, ...draft };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

// 로드
export function loadMentorOnboardingDraft(): MentorOnboardingDraft | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MentorOnboardingDraft;
  } catch {
    return null;
  }
}

// 삭제
export function clearMentorOnboardingDraft() {
  sessionStorage.removeItem(KEY);
}
