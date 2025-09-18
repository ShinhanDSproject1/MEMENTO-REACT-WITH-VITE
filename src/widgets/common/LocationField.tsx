// src/widgets/common/LocationField.tsx
import { useDaumPostcode } from "@shared/hooks";
import type { ChangeEvent } from "react";
import { useState } from "react";

export interface LocationFieldValue {
  zonecode: string;
  address: string; // 기본 주소(도로명/지번)
  detail: string; // 상세 주소(동/호 등)
  bname?: string; // 법정동/행정동
}

export interface LocationFieldProps {
  onChange?: (value: LocationFieldValue) => void;
}

export default function LocationField({ onChange }: LocationFieldProps) {
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [detail, setDetail] = useState("");
  const [bname, setBname] = useState<string | undefined>();
  const { loaded, openPostcode } = useDaumPostcode();

  // ✅ location 은 address만 사용 (detail 합치지 않음)
  const emit = (z = zonecode, a = address, d = detail, b = bname) => {
    onChange?.({
      zonecode: z,
      address: a,
      detail: d,
      bname: b,
      location: a, // ← 여기! 기본 주소만 넘깁니다.
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {/* 우편번호 + 주소 */}
      <div className="flex gap-2">
        <input
          value={zonecode}
          readOnly
          placeholder="우편번호"
          className="h-12 w-28 rounded-[14px] border border-[#E5E7ED] bg-white px-3 text-[15px] text-[#0F172A] placeholder:text-[#9AA2AE] focus:outline-none"
        />
        <div className="relative flex-1">
          <input
            value={address}
            readOnly
            placeholder="도로명/지번 주소"
            className="h-12 w-full rounded-[14px] border border-[#E5E7ED] bg-white pr-28 pl-4 text-[15px] text-[#0F172A] shadow-sm placeholder:text-[#9AA2AE] focus:outline-none"
          />
          <button
            type="button"
            disabled={!loaded}
            onClick={() =>
              openPostcode((data) => {
                const z = data.zonecode || "";
                const a = data.roadAddress || data.jibunAddress || "";
                const b = data.bname || undefined;
                setZonecode(z);
                setAddress(a);
                setBname(b);
                emit(z, a, detail, b); // location은 내부에서 a만 사용
              })
            }
            className={`absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold ${
              loaded
                ? "bg-[#005EF9] text-white hover:brightness-95"
                : "cursor-not-allowed bg-slate-200 text-white"
            }`}>
            주소 검색
          </button>
        </div>
      </div>

      {/* 상세주소 */}
      <input
        value={detail}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const d = e.target.value;
          setDetail(d);
          emit(zonecode, address, d, bname); // location은 그대로 address
        }}
        placeholder="상세 주소"
        className="h-12 w-full rounded-[14px] border border-[#E5E7ED] bg-white px-4 text-[15px] text-[#0F172A] placeholder:text-[#9AA2AE] focus:ring-2 focus:ring-[#005EF9]/60 focus:outline-none"
      />
    </div>
  );
}
