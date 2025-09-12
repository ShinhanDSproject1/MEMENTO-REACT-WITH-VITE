import { useDaumPostcode } from "@shared/hooks";
import type { ChangeEvent } from "react";
import { useState } from "react";

export interface LocationFieldValue {
  zonecode: string;
  address: string;
  detail: string;
  location: string; // 조합된 주소
}

export interface LocationFieldProps {
  onChange?: (value: LocationFieldValue) => void;
}

export default function LocationField({ onChange }: LocationFieldProps) {
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [detail, setDetail] = useState("");
  const { loaded, openPostcode } = useDaumPostcode();

  const emit = (z = zonecode, a = address, d = detail) => {
    onChange?.({
      zonecode: z,
      address: a,
      detail: d,
      location: a ? `${a}${d ? ` ${d}` : ""}` : "",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3">
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
            className="h-12 w-full rounded-[14px] border border-[#E5E7ED] bg-white pr-28 pl-4 text-[15px] text-[#0F172A] shadow-[0_1px_0_rgba(17,17,17,0.02)] placeholder:text-[#9AA2AE] focus:outline-none"
          />
          <button
            type="button"
            disabled={!loaded}
            onClick={() =>
              openPostcode((data: any) => {
                const z = data.zonecode || "";
                const a = data.roadAddress || data.jibunAddress || "";
                setZonecode(z);
                setAddress(a);
                emit(z, a, detail);
              })
            }
            className={`absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold ${loaded ? "bg-[#005EF9] text-white hover:brightness-95" : "cursor-not-allowed bg-slate-200 text-white"}`}>
            주소 검색
          </button>
        </div>
      </div>

      <input
        value={detail}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setDetail(e.target.value);
          emit(zonecode, address, e.target.value);
        }}
        placeholder="상세 주소"
        className="h-12 w-full cursor-pointer rounded-[14px] border border-[#E5E7ED] bg-white px-4 text-[15px] text-[#0F172A] placeholder:text-[#9AA2AE] focus:ring-2 focus:ring-[#005EF9]/60 focus:outline-none"
      />
    </div>
  );
}
