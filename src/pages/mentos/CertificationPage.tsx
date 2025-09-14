import Button from "@/widgets/common/Button";
import certificationFail from "@assets/images/certification/certification-fail.svg";
import certificationSuccess from "@assets/images/certification/certification-success.svg";
import { Progress, Spinner } from "flowbite-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

type RouteParams = {
  result?: "inprogress" | "fail" | "success";
};

const CertificationPage: React.FC = () => {
  const { result } = useParams<RouteParams>();
  const navigate = useNavigate();

  if (result === "inprogress") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-between gap-4 bg-white py-4">
        <div className="flex w-full">
          <p className="font-WooridaumB text-2xl text-black">
            자격증 인증 <span className="font-WooridaumB text-[#005EF9]">진행중</span>...
          </p>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-10">
          <Spinner aria-label="Extra large spinner example" size="xl" className="h-50 w-50" />
          <Progress
            className="w-70"
            progress={45}
            progressLabelPosition="inside"
            textLabel=""
            textLabelPosition="outside"
            size="lg"
            labelProgress
            labelText
          />
        </div>

        <Button
          variant="cancelGray"
          onClick={() => navigate("/mento")}
          className="font-WooridaumB w-full px-8 py-4 font-bold"
          size="lg">
          취소하기
        </Button>
      </div>
    );
  }

  if (result === "fail") {
    return (
      <div className="flex h-[80vh] w-full flex-col justify-between gap-4 bg-white p-4">
        <div className="flex w-full">
          <p className="font-WooridaumB text-2xl text-black">
            자격증을 <span className="font-WooridaumB text-[#DF001F]">인증하지</span> 못했습니다
          </p>
        </div>

        <div className="flex w-full justify-center">
          <img className="w-[80%]" src={certificationFail} alt="인증 실패" />
        </div>
        <Button
          onClick={() => navigate("/mento")}
          variant="danger"
          className="font-WooridaumB w-full px-8 py-4 font-bold"
          size="lg">
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] w-full flex-col justify-between gap-4 bg-white p-4">
      <div className="flex w-full">
        <p className="font-WooridaumB text-xl text-black">
          자격증이 <span className="font-WooridaumB text-[#005EF9]">인증</span>
          되었습니다
        </p>
      </div>
      <div className="flex w-full justify-center">
        <img className="w-[80%]" src={certificationSuccess} alt="인증 성공" />
      </div>
      <Button
        onClick={() => navigate("/mento")}
        variant="primary"
        className="font-WooridaumB w-full px-8 py-4 font-bold"
        size="lg">
        확인
      </Button>
    </div>
  );
};

export default CertificationPage;
