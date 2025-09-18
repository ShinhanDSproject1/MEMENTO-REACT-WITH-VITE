import Button from "@/widgets/common/Button";
import { SimpleEditor } from "@/widgets/common/tiptap-templates/simple/simple-editor";
import kogiriFace from "@assets/images/character/character-kogiri-face.svg";
import { useMentoProfileDetail } from "@entities/profile";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function MentoIntroduce() {
  const { data, isLoading, isError, refetch, error } = useMentoProfileDetail();

  const [overrideImage, setOverrideImage] = useState<string | null>(null);

  const profileImage = overrideImage ?? data?.mentoProfileImage ?? kogiriFace;
  const hasRealImage = Boolean(overrideImage || data?.mentoProfileImage);

  const navigate = useNavigate();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setOverrideImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) return <div className="p-4 text-center">프로필 불러오는 중…</div>;

  if (isError)
    return (
      <div className="p-4 text-center text-red-500">
        {(error as Error)?.message ?? "프로필 조회 실패"}
        <div className="mt-3">
          <Button size="sm" variant="primary" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      </div>
    );

  const goNext = () => {
    navigate("/mento/introduce2");
    sessionStorage.setItem(
      "mentorOnboarding.step1",
      JSON.stringify({ profileImageDataUrl: profileImage, profileContent: "" }),
    );
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-10 bg-white p-4">
      {/* 프로필 이미지 업로드 */}
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="profile-upload" className="group cursor-pointer">
          <div className="relative inline-block rounded-full bg-gradient-to-r from-blue-400 to-green-400 p-[3px]">
            <img
              src={profileImage}
              alt="프로필 이미지"
              className="h-32 w-32 rounded-full bg-white object-cover shadow-lg shadow-blue-100 transition-transform duration-200 group-hover:scale-105"
            />
            {/* 선택적: 업로드 아이콘 오버레이 */}
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

        {/* ✅ 조건에 따라 문구 표시 */}
        <p className="font-WooridaumB text-gray-500">
          {hasRealImage ? "프로필 이미지" : "이미지를 등록하세요"}
        </p>
      </div>

      {/* 소개글 + 에디터 세로 정렬 */}
      <div className="flex flex-col gap-2">
        <p className="font-WooridaumB text-lg font-bold">소개글 입력</p>
        <div className="flex h-80 max-w-[90vw] items-center justify-center overflow-hidden rounded border border-gray-200">
          <SimpleEditor />
        </div>
      </div>

      <div className="flex w-full justify-center">
        <Button
          type="button"
          onClick={goNext}
          className="w-full cursor-pointer"
          size="lg"
          variant="primary">
          다음
        </Button>
      </div>
    </div>
  );
}
