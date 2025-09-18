import Button from "@/widgets/common/Button";
import { SimpleEditor } from "@/widgets/common/tiptap-templates/simple/simple-editor";
import kogiriFace from "@assets/images/character/character-kogiri-face.svg";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function MentoIntroduce() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string>(kogiriFace);
  const [text, setText] = useState<string>("사진을 추가하세요");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setProfileImage(result);
        setText(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const goNext = () => {
    navigate("/mento/introduce2");
    sessionStorage.setItem(
      "mentorOnboarding.step1",
      JSON.stringify({ profileImageDataUrl: profileImage, profileContent: "" }),
    );
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-8 bg-white p-4">
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="profile-upload" className="cursor-pointer">
          <img
            src={profileImage}
            alt="프로필 이미지"
            className="h-32 w-32 rounded-full border-[1px] border-[#E6E7EA] object-cover"
          />
        </label>

        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <p className="font-WooridaumB text-gray-500">{text}</p>
      </div>

      <p className="font-WooridaumB ml-4 text-lg font-bold">소개글 입력</p>

      <div className="flex h-80 max-w-[90vw] items-center justify-center overflow-hidden rounded-[5px] border-[1px] border-gray-200">
        <SimpleEditor />
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
