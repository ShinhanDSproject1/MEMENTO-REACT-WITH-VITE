import { InteractiveHoverButton } from "../MainButton";

function MentoButtonGroup() {
  const style =
    "font-WooridaumB w-[300px] max-w-sm rounded-lg bg-[#005EF9] px-6 py-3 text-center font-bold text-white";
  return (
    <div className="mt-10 flex flex-col items-center gap-y-4">
      <InteractiveHoverButton className={style}>멘토링 생성하기</InteractiveHoverButton>
      <InteractiveHoverButton className={style}>멘토링 관리</InteractiveHoverButton>
      <InteractiveHoverButton className={style}>멘티 관리</InteractiveHoverButton>
      <InteractiveHoverButton className={style}>리뷰 확인하기</InteractiveHoverButton>
    </div>
  );
}
export default MentoButtonGroup;
