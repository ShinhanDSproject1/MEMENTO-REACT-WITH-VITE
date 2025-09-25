// src/pages/CertificationFailPage.tsx
import Button from "@/02-widgets/common/Button";
import certificationFail from "@assets/images/certification/certification-fail.svg";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type CertResult = {
  isValid: boolean;
  verifiedCertificationImage?: string;
  certificationName?: string;
  name?: string | null;
  certificationNum?: string;
  birthDate?: string;
  admissionDate?: string;
  expirationdate?: string;
  stampSimilarity?: number;
  // 업로드 단계에서 넘겨주는 원본 파일(선택)
  file?: File;
};

const SS_KEY = "cert.lastResultPayload";

const CertificationFailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 업로드/인증 단계에서 navigate로 넘긴 payload
  const navState = (location.state || null) as CertResult | null;

  // 화면에 보여줄 메타데이터(세션스토리지 백업 포함)
  const data: CertResult | null = useMemo(() => {
    if (navState && typeof navState === "object") return navState;
    try {
      const raw = sessionStorage.getItem(SS_KEY);
      return raw ? (JSON.parse(raw) as CertResult) : null;
    } catch {
      return null;
    }
  }, [navState]);

  // 새 payload 저장 (File은 저장 불가하므로 제외)
  useEffect(() => {
    if (navState) {
      try {
        const { file: _omit, ...rest } = navState;
        sessionStorage.setItem(SS_KEY, JSON.stringify(rest));
      } catch {}
    }
  }, [navState]);

  // ---------- 업로드 원본 파일 미리보기 처리 ----------
  const file = navState?.file; // 새로고침 시엔 undefined (세션에 못 넣음)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<"image" | "pdf" | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setPreviewKind(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewKind(file.type === "application/pdf" ? "pdf" : "image");
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // 서버가 준 이미지 URL (없을 수 있음)
  const serverImg = data?.verifiedCertificationImage;

  return (
    <div className="mx-auto flex min-h-[85vh] w-full max-w-3xl flex-col gap-6 px-4 py-6">
      {/* 헤더 */}
      <header>
        <h1 className="font-WooridaumB text-lg text-slate-900 sm:text-xl">
          자격증 <span className="text-[#DF001F]">인증 실패</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          이미지 내 주요 정보(예: 이름)를 확인하지 못했습니다. 더 선명한 이미지로 다시 시도해주세요.
        </p>
      </header>

      {/* 업로드한 파일 or 서버 이미지 or 기본 일러스트 */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-700">업로드된 이미지</p>
        </div>

        <div className="flex max-h-[500px] items-center justify-center bg-slate-50 p-4">
          {previewKind === "image" ? (
            <img
              src={previewUrl!}
              alt="업로드 이미지"
              className="max-h-[460px] w-auto object-contain"
            />
          ) : previewKind === "pdf" ? (
            <object data={previewUrl!} type="application/pdf" className="h-[460px] w-full">
              <p className="text-xs text-slate-500">
                브라우저에서 PDF 미리보기를 지원하지 않습니다. 파일을 다운로드해 확인해 주세요.
              </p>
            </object>
          ) : serverImg ? (
            <img src={serverImg} alt="인증 실패" className="max-h-[460px] w-auto object-contain" />
          ) : (
            <img
              src={certificationFail}
              alt="인증 실패"
              className="max-h-[460px] w-auto object-contain"
            />
          )}
        </div>

        {data?.certificationName && (
          <div className="border-t border-slate-100 px-4 py-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              📄 {data.certificationName}
            </span>
          </div>
        )}
      </div>

      {/* 실패 사유 & 세부 정보 */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-700">실패 사유</p>
        </div>
        <div className="px-4 py-4">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>자격증 전체가 보이도록 정면에서 촬영해주세요.</li>
            <li>빛 반사/흐릿함/낮은 해상도는 인식률을 떨어뜨립니다.</li>
            <li>PDF 파일은 원본 해상도가 충분한지 확인해주세요.</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <footer className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => navigate("/mento")}
          variant="cancelGray"
          className="font-WooridaumB w-full rounded-2xl px-8 py-3 font-bold">
          프로필로 돌아가기
        </Button>
        <Button
          onClick={() => navigate("/mento/certification")}
          variant="primary"
          className="font-WooridaumB w-full rounded-2xl px-8 py-3 font-bold">
          다시 업로드
        </Button>
      </footer>
    </div>
  );
};

export default CertificationFailPage;

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-0.5 min-h-[20px] text-sm font-semibold text-slate-800">
        {value || <span className="text-slate-400">-</span>}
      </dd>
    </div>
  );
}
