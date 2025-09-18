// src/pages/MentoIntroduce.tsx
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import Button from "@/widgets/common/Button";
import DayChips, { DAYS, type Day } from "@/widgets/common/DayChips";
import HourRangePicker, { type HourRange } from "@/widgets/common/HourRangePicker";
import LocationField, { type LocationFieldValue } from "@/widgets/common/LocationField";
import { SimpleEditor } from "@/widgets/common/tiptap-templates/simple/simple-editor";

import kogiriFace from "@assets/images/character/character-kogiri-face.svg";
import { updateMentoProfileDetail, useMentoProfileDetail } from "@entities/profile";

// ★ 모달 훅 & 컴포넌트
import { useModal } from "@hooks/ui/useModal";
import type { ModalKey } from "@shared/ui/ModalConfig";
import { CommonModal } from "@widgets/common";

// ---------- 유틸: 서버 ↔ UI 매핑 ----------
const ISO_TO_KOR_DAY: Record<string, Day> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

const KOR_TO_ISO_DAY: Record<Day, string> = {
  일: "SUN",
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
};

// "MON,WED,FRI" → Day[]
function parseAvailableDays(src?: string | null): Day[] {
  if (!src) return [];
  const set = new Set<Day>(DAYS as unknown as Day[]);
  return src
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .map((iso) => ISO_TO_KOR_DAY[iso])
    .filter((d): d is Day => Boolean(d) && set.has(d));
}

// "09:00" → 9
function parseHour(hhmm?: string | null, fallback: number): number {
  if (!hhmm) return fallback;
  const [hh] = hhmm.split(":");
  const n = Number(hh);
  return Number.isFinite(n) ? n : fallback;
}

// 9 → "09:00"
const toHHMM = (h: number) => String(h).padStart(2, "0") + ":00";

export default function MentoIntroduce() {
  // 서버 조회 훅 (react-query 등)
  const { data, isLoading, isError, error, refetch, isFetching } = useMentoProfileDetail();

  // ★ 모달
  const { isOpen, modalType, modalData, openModal, closeModal } = useModal() as {
    isOpen: boolean;
    modalType?: ModalKey;
    modalData?: Record<string, unknown>;
    openModal: (type: ModalKey, data?: Record<string, unknown>) => void;
    closeModal: () => void;
  };

  // 이미지 (미리보기 + 실제 업로드 파일)
  const [overrideImage, setOverrideImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const profileImage = overrideImage ?? data?.mentoProfileImage ?? kogiriFace;
  const hasRealImage = Boolean(overrideImage || data?.mentoProfileImage);

  // 소개글
  const [profileContent, setProfileContent] = useState<string>("");

  // 요일/시간
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const emptyDays = useMemo<Day[]>(() => [], []);
  const [hours, setHours] = useState<HourRange>({ start: 10, end: 18 });

  // 주소
  const [location, setLocation] = useState<LocationFieldValue>({
    zonecode: "",
    address: "",
    detail: "",
    bname: undefined,
  } as LocationFieldValue);

  // ✅ 페이지 진입 시 항상 서버 재조회 (세션 값 사용 안 함)
  useEffect(() => {
    // 폼 초기화
    setOverrideImage(null);
    setImageFile(null);
    setProfileContent("");
    setSelectedDays([]);
    setHours({ start: 10, end: 18 });
    setLocation({ zonecode: "", address: "", detail: "", bname: undefined } as LocationFieldValue);

    // 강제 최신 데이터 가져오기
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 1회

  // 서버 데이터 → 폼 상태 반영
  useEffect(() => {
    if (!data) return;

    if (data.mentoProfileImage) setOverrideImage(data.mentoProfileImage);
    if (typeof data.mentoProfileContent === "string") {
      setProfileContent(data.mentoProfileContent);
    }

    setSelectedDays(parseAvailableDays(data.availableDays));
    setHours({
      start: parseHour(data.startTime, 10),
      end: parseHour(data.endTime, 18),
    });

    setLocation({
      zonecode: data.mentoPostcode ?? "",
      address: data.mentoRoadAddress ?? "",
      detail: data.mentoDetail ?? "",
      bname: data.mentoBname ?? undefined,
    });
  }, [data]);

  // 이미지 선택 → 미리보기 & 업로드 파일 보관
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") setOverrideImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 저장 (PATCH) 후 재조회 — 모든 alert → 모달로 변경
  const handleSubmit = async () => {
    const requestDto = {
      mentoProfileContent: profileContent,
      startTime: toHHMM(hours.start),
      endTime: toHHMM(hours.end),
      availableDays: selectedDays.map((d) => KOR_TO_ISO_DAY[d]).join(","), // "MON,WED"
      mentoPostcode: location.zonecode,
      mentoRoadAddress: location.address,
      mentoBname: location.bname ?? "",
      mentoDetail: location.detail ?? "",
    };

    // 로딩 모달
    openModal("loading", { title: "저장 중입니다…", description: "잠시만 기다려주세요 ⏳" });

    try {
      const res = await updateMentoProfileDetail({
        requestDto,
        imageFile,
      });

      closeModal(); // loading 닫기

      if (res.code === 1000) {
        // ✅ 성공 모달 (프로젝트의 완료용 키로 교체 가능: e.g. "saveComplete")
        openModal("reviewComplete", { message: "프로필이 저장되었습니다." });
        await refetch();
      } else {
        // ✅ 에러 모달
        openModal("withdrawFailed", { message: res.message || "프로필 저장에 실패했습니다." });
      }
    } catch (e: any) {
      closeModal(); // loading 닫기
      openModal("withdrawFailed", {
        message: e?.response?.data?.message || "프로필 저장 중 오류가 발생했습니다.",
      });
    }
  };

  // 첫 로딩/재조회 로딩
  if (isLoading || isFetching) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p>프로필 불러오는 중…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        {(error as Error)?.message ?? "프로필 조회 실패"}
        <div className="mt-3 flex justify-center">
          <Button size="sm" variant="primary" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <div className="mx-auto w-full max-w-screen-sm space-y-10 px-4 pt-8 pb-10 sm:max-w-md md:max-w-lg">
        <h1 className="font-WooridaumB text-center">멘티들이 확인할 정보를 입력해주세요</h1>

        {/* 프로필 이미지 */}
        <section className="flex flex-col items-center gap-2">
          <label htmlFor="profile-upload" className="group cursor-pointer">
            <div className="relative inline-block rounded-full bg-gradient-to-r from-blue-400 to-green-400 p-[3px]">
              <img
                src={profileImage}
                alt="프로필 이미지"
                className="h-32 w-32 rounded-full bg-white object-cover shadow-lg shadow-blue-100 transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-sm font-semibold text-white">변경</span>
              </div>
            </div>
          </label>

          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <p className="font-WooridaumB text-gray-500">
            {hasRealImage ? "프로필 이미지" : "이미지를 등록하세요"}
          </p>
        </section>

        {/* 소개글 */}
        <section className="flex flex-col gap-2">
          <p className="font-WooridaumB text-lg font-bold">소개글 입력</p>
          <div className="flex h-80 max-w-[90vw] items-center justify-center overflow-hidden rounded border border-gray-200">
            <SimpleEditor value={profileContent} onChange={setProfileContent} />
          </div>
        </section>

        {/* 요일 */}
        <section>
          <p className="font-WooridaumB mb-3 ml-1 text-[18px] font-bold text-[#0F172A]">
            멘토링 가능 요일
          </p>
          <DayChips
            defaultDays={selectedDays.length ? selectedDays : emptyDays}
            onChange={setSelectedDays}
          />
        </section>

        {/* 시간 */}
        <section>
          <p className="font-WooridaumB mb-3 ml-1 text-[18px] font-bold text-[#0F172A]">
            멘토링 가능 시간
          </p>
          <HourRangePicker value={hours} onChange={setHours} />
        </section>

        {/* 장소 */}
        <section>
          <p className="font-WooridaumB mb-3 ml-1 text-[18px] font-bold text-[#0F172A]">
            멘토링 장소
          </p>
          <LocationField
            defaultValue={{
              zonecode: location.zonecode,
              address: location.address,
              detail: location.detail,
              bname: location.bname,
              location: "",
            }}
            onChange={(v) =>
              setLocation({
                zonecode: v.zonecode,
                address: v.address,
                detail: v.detail,
                bname: v.bname,
              } as LocationFieldValue)
            }
          />
        </section>

        {/* 저장 */}
        <footer className="mt-6 flex w-full justify-center">
          <Button
            className="w-full cursor-pointer"
            size="lg"
            variant="primary"
            onClick={handleSubmit}>
            등록
          </Button>
        </footer>
      </div>

      {/* ★ 공통 모달 렌더 */}
      {isOpen && modalType ? (
        <CommonModal
          type={modalType}
          isOpen={isOpen}
          onCancel={closeModal}
          onConfirm={closeModal}
          onSubmit={closeModal}
          modalData={modalData}
        />
      ) : null}
    </main>
  );
}
