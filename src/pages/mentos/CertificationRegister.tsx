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
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("자격증을 업로드해주세요.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    setScanning(true);

    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 15_000);

    try {
      const form = new FormData();
      form.append("file", file);

      const req = fetch("/py/certs/extract", {
        method: "POST",
        body: form,
        signal: ctl.signal,
      }).then(async (res) => {
        let payload: any = {};
        try {
          payload = await res.json();
        } catch {}
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
        return payload;
      });

      const [payload] = await Promise.all([req, delay(5000)]);

      // ✅ name 값이 없으면 실패 페이지로
      if (!payload?.name) {
        navigate("/mento/certification/fail", { state: { ...payload, file } });
      } else {
        navigate("/mento/certification/inprogress", { state: payload });
      }
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
      setScanning(false);
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
  };

  return (
    <div className="flex min-h-[80vh] w-full flex-col justify-between gap-4 bg-white p-4 py-4">
      {/* keyframes */}
      <style>
        {`
        @keyframes scan-move {
          0% { transform: translateY(-100%); opacity: 0.0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0.0; }
        }
        @keyframes glossy {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        `}
      </style>

      {/* 제목 */}
      <div className="flex w-full">
        <p className="font-WooridaumB text-black">
          보유중인 <span className="font-WooridaumB text-[#005EF9]">자격증</span>을 <br />
          업로드해주세요!
        </p>
      </div>

      {/* 업로드 + 미리보기 */}
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <Label
          htmlFor="dropzone-file"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={[
            "relative",
            // ⬇️ 드롭존 세로 확대
            "flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10",
            "min-h-[340px] sm:min-h-[420px]",
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50",
            "hover:bg-gray-100",
            "transition-colors",
          ].join(" ")}>
          <div className="flex w-full flex-col items-center justify-center px-3 pt-8 text-center">
            {!previewUrl ? (
              <>
                <svg
                  className="mb-5 h-12 w-12 text-gray-500"
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
                <p className="mb-2 text-base text-gray-800">
                  <span className="font-semibold">클릭</span> 또는{" "}
                  <span className="font-semibold">파일을 끌어다 놓기</span>
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, PDF (MAX. {MAX_SIZE_MB}MB)</p>
              </>
            ) : (
              <div className="w-full">
                <div className="relative mx-auto max-h-[60vh] w-full overflow-hidden rounded-xl">
                  {previewKind === "image" ? (
                    <img
                      src={previewUrl}
                      alt="미리보기 이미지"
                      className="mx-auto max-h-[60vh] w-auto object-contain"
                    />
                  ) : (
                    <object
                      data={previewUrl}
                      type="application/pdf"
                      className="mx-auto h-[60vh] w-full">
                      <p className="text-xs text-gray-500">
                        브라우저가 PDF 미리보기를 지원하지 않습니다. 파일을 다운로드해 확인해주세요.
                      </p>
                    </object>
                  )}

                  {scanning && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                      <div
                        className="absolute inset-0 h-[40%] w-[150%] -rotate-6 bg-gradient-to-b from-transparent via-blue-500/90 to-transparent"
                        style={{
                          animation: "scan-move 3s linear infinite",
                          boxShadow: "0 0 30px rgba(59,130,246,0.9), 0 0 80px rgba(59,130,246,0.6)",
                        }}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-200/20 to-transparent"
                        style={{
                          backgroundSize: "200% 200%",
                          animation: "glossy 2.5s linear infinite",
                        }}
                      />
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold whitespace-nowrap text-white shadow-lg shadow-blue-500/40">
                        🔍 AI가 자격증을 스캔하는 중…
                      </div>
                    </div>
                  )}
                </div>

                {file && (
                  <p className="mt-3 text-xs break-all text-gray-600">
                    선택된 파일: <span className="font-medium">{file.name}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <FileInput
            id="dropzone-file"
            className="hidden"
            onChange={handleFileChange}
            accept={ACCEPT_MIME.join(",")}
          />
        </Label>

        {file && !scanning && (
          <button
            type="button"
            onClick={clearFile}
            className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">
            선택 해제
          </button>
        )}
      </div>

      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

      <div className="flex flex-col items-center justify-center gap-2">
        <Button
          onClick={handleUpload}
          variant="primary"
          className="font-WooridaumB w-full px-8 py-4 font-bold"
          size="xl"
          disabled={loading || !file || scanning}>
          {scanning ? "스캔 중..." : loading ? "업로드 중..." : "추가하기"}
        </Button>
        <Button
          onClick={() => navigate("/mento")}
          variant="cancelGray"
          className="font-WooridaumB w-full px-8 py-4 font-bold"
          size="xl"
          disabled={scanning}>
          돌아가기
        </Button>
      </div>
    </div>
  );
}
