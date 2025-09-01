import React, { useState } from "react";
import Button from "@/components/common/Button";
import kogiriFace from "@/assets/images/kogiri-face.svg";
import { SimpleEditor } from "@/components/common/tiptap-templates/simple/simple-editor";

function MentoIntroduce() {
  const [profileImage, setProfileImage] = useState(kogiriFace);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-full w-[100vw] flex-col justify-between gap-4 bg-white py-4">
      <div className="flex flex-col items-center gap-2">
        {/* label로 프로필 이미지를 감싸고, input과 연결 */}
        <label htmlFor="profile-upload" className="cursor-pointer">
          <img
            src={profileImage}
            alt="프로필 이미지"
            className="h-32 w-32 rounded-full border-[1px] border-[#E6E7EA] object-cover"
          />
        </label>
        {/* 실제 파일 input은 숨김 */}
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <p className="font-WooridaumB text-sm text-gray-500">사진을 추가하세요</p>
      </div>
      <p className="font-WooridaumB ml-4 text-lg font-bold">소개글 입력</p>
      <div className="flex max-w-[90vw] items-center justify-center rounded-[5px] border-[1px] border-gray-200">
        <SimpleEditor className="flex items-center justify-center" />
      </div>

      <div className="flex w-full justify-center">
        <Button className="w-full" size="lg" variant="primary">
          등록
        </Button>
      </div>
    </div>
  );
}

export default MentoIntroduce;
