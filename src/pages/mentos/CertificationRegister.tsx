// src/pages/CertificationRegister.tsx
import Button from "@/widgets/common/Button";
import { FileInput, Label } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ACCEPT_MIME = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
const MAX_SIZE_MB = 5;

type PreviewKind = "image" | "pdf" | null;

export default function CertificationRegister() {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewKind, setPreviewKind] = useState<PreviewKind>(null);

  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateFile = (f: File) => {
    if (!ACCEPT_MIME.includes(f.type)) {
      throw new Error("PNG, JPG, PDF 파일만 업로드할 수 있어요.");
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`파일 용량은 ${MAX_SIZE_MB}MB 이하만 가능합니다.`);
    }
  };

  const makePreview = (f: File) => {
    // 이전 URL 정리
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setPreviewKind(f.type === "application/pdf" ? "pdf" : "image");
  };

  const handleFilePicked = (f: File | null) => {
    if (!f) return;
    try {
      validateFile(f);
      setFile(f);
      setErrorMsg(null);
      makePreview(f);
    } catch (err: any) {
      setFile(null);
      setPreviewUrl(null);
      setPreviewKind(null);
      setErrorMsg(err?.message || "잘못된 파일입니다.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFilePicked(f);
  };

  // 드래그&드롭
  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    handleFilePicked(f);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("파일을 선택해주세요.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 15_000); // 15초 타임아웃

    try {
      const form = new FormData();
      form.append("file", file);

      // HTTPS 페이지에서 로컬 HTTP 서버와 통신하려면 개발 프록시(/py) 필요
      const res = await fetch("/py/certs/extract", {
        method: "POST",
        body: form,
        signal: ctl.signal,
      });

      let payload: any = {};
      try {
        payload = await res.json();
      } catch {
        /* no body */
      }

      if (!res.ok) {
        const msg =
          payload?.message ||
          (res.status === 404
            ? "서버 주소를 확인해주세요. (404)"
            : res.status === 500
              ? "서버 내부 오류입니다. (500)"
              : `업로드 실패 (${res.status})`);
        throw new Error(msg);
      }

      navigate("/mento/certification/inprogress", { state: payload });
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setErrorMsg("요청 시간이 초과되었습니다. 서버가 실행 중인지 확인해주세요.");
      } else if (err?.message?.includes("Failed to fetch")) {
        setErrorMsg(
          "서버에 연결할 수 없습니다. 같은 네트워크인지, 프록시/방화벽 설정을 확인하세요.",
        );
      } else {
        setErrorMsg(err?.message || "업로드 실패");
      }
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewKind(null);
    setErrorMsg(null);
    // input 값도 리셋: 라벨 내부 FileInput은 ref 없이도, 아래처럼 강제로 초기화하려면 key 바꾸는 패턴을 써야 함
    // 여기선 굳이 불필요하니 생략
  };

  return (
    <div className="flex h-[80vh] w-full flex-col justify-between gap-4 bg-white p-4 py-4">
      {/* 제목 */}
      <div className="flex w-full">
        <p className="font-WooridaumB text-black">
          보유중인 <span className="font-WooridaumB text-[#005EF9]">자격증</span>을 <br />
          업로드해주세요!
        </p>
      </div>

      {/* 업로드 영역 */}
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <Label
          htmlFor="dropzone-file"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={[
            "flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed",
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50",
            "hover:bg-gray-100",
          ].join(" ")}>
          <div className="flex flex-col items-center justify-center px-4 pt-5 pb-6 text-center">
            {!previewUrl ? (
              <>
                <svg
                  className="mb-4 h-8 w-8 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5
                       5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5
                       5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8
                       8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold">클릭</span> 또는{" "}
                  <span className="font-semibold">파일을 끌어다 놓기</span>
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. {MAX_SIZE_MB}MB)</p>
              </>
            ) : (
              <div className="w-full">
                {previewKind === "image" ? (
                  <img
                    src={previewUrl}
                    alt="미리보기 이미지"
                    className="mx-auto max-h-48 w-auto rounded-md object-contain shadow-sm"
                  />
                ) : (
                  <object
                    data={previewUrl}
                    type="application/pdf"
                    className="mx-auto h-48 w-full rounded-md">
                    <p className="text-xs text-gray-500">
                      브라우저가 PDF 미리보기를 지원하지 않습니다. 파일을 다운로드해 확인해주세요.
                    </p>
                  </object>
                )}
                {file && (
                  <p className="mt-2 text-xs break-all text-gray-600">
                    선택된 파일: <span className="font-medium">{file.name}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 라벨-인풋 연결: onClick 없이 htmlFor와 id만으로 작동 */}
          <FileInput
            id="dropzone-file"
            className="hidden"
            onChange={handleFileChange}
            accept={ACCEPT_MIME.join(",")}
          />
        </Label>

        {/* 선택 해제 버튼 */}
        {file && (
          <button
            type="button"
            onClick={clearFile}
            className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">
            선택 해제
          </button>
        )}
      </div>

      {/* 오류 메시지 */}
      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

      {/* 버튼 */}
      <div className="flex flex-col items-center justify-center gap-2">
        <Button
          onClick={handleUpload}
          variant="primary"
          className="font-WooridaumB w-full px-8 py-4 font-bold"
          size="xl"
          disabled={loading || !file}>
          {loading ? "업로드 중..." : "추가하기"}
        </Button>
        <Button
          onClick={() => navigate("/mento")}
          variant="cancelGray"
          className="font-WooridaumB w-full px-8 py-4 font-bold"
          size="xl">
          돌아가기
        </Button>
      </div>
    </div>
  );
}
