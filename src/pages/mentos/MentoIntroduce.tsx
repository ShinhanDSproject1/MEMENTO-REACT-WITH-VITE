// src/pages/MentoIntroduce.tsx
import kogiriFace from "@/assets/images/kogiri-face.svg";
import Button from "@/components/common/Button";
import { SimpleEditor } from "@/components/common/tiptap-templates/simple/simple-editor";
import { useState, type ChangeEvent } from "react";

export default function MentoIntroduce() {
  const [profileImage, setProfileImage] = useState<string>(kogiriFace);
  const [text, setText] = useState<string>("사진을 추가하세요");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      // result: string | ArrayBuffer | null
      if (typeof result === "string") {
        setProfileImage(result);
        setText(file.name);
      }
    };
    reader.readAsDataURL(file);
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
        {/* SimpleEditor가 value/onChange를 받지 않는 구현이면 그대로 사용 */}
        <SimpleEditor />
      </div>

      <div className="flex w-full justify-center">
        <Button className="w-full" size="lg" variant="primary">
          다음
        </Button>
      </div>
    </div>
  );
}
