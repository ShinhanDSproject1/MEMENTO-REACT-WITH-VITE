// src/pages/MentoIntroduce2.tsx
import Button from "@/widgets/common/Button";
import DayChips, { type Day } from "@/widgets/common/DayChips";
import HourRangePicker, { type HourRange } from "@/widgets/common/HourRangePicker";
import LocationField, { type LocationFieldValue } from "@/widgets/common/LocationField";
import { useState } from "react";

export default function MentoIntroduce2() {
  // ✅ 타입 명시
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [hours, setHours] = useState<HourRange>({ start: 10, end: 18 });
  const [location, setLocation] = useState<LocationFieldValue>({
    zonecode: "",
    address: "",
    detail: "",
    location: "",
  });

  const payload = { days: selectedDays, ...hours, ...location };

  const handleSubmit = () => {
    console.log("payload:", payload);
    // TODO: 실제 API 호출
  };

  return (
    <main>
      <div className="mx-auto w-full max-w-screen-sm px-4 pt-10 pb-8 sm:max-w-md md:max-w-lg">
        <section className="mb-6">
          <p className="font-WooridaumB mb-3 ml-4 text-[18px] font-bold text-[#0F172A]">요일</p>
          <DayChips defaultDays={[]} onChange={setSelectedDays} />
        </section>

        <section className="mb-6">
          <p className="font-WooridaumB mb-3 ml-4 text-[18px] font-bold text-[#0F172A]">
            근무 시간
          </p>
          <HourRangePicker value={hours} onChange={setHours} />
        </section>

        <section className="mb-2">
          <p className="font-WooridaumB mb-3 ml-4 text-[18px] font-bold text-[#0F172A]">장소</p>
          <LocationField onChange={setLocation} />
        </section>

        <footer className="mt-21.5 flex w-full justify-center">
          <Button className="w-full" size="lg" variant="primary" onClick={handleSubmit}>
            등록
          </Button>
        </footer>
      </div>
    </main>
  );
}
