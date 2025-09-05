export default function PrivacyCollectTerms() {
  return (
    <div>
      <h3 className="font-WooridaumR mb-2">개인정보 수집 및 이용 동의</h3>
      <p className="mb-1">1. 개인정보 수집항목</p>
      <ul className="mb-2 list-disc pl-5 text-sm leading-5">
        <li>예약자와 실제 참여자가 다른 경우: 참여자의 이름 및 휴대전화번호</li>
        <li>멘토링 장소 제공/방문이 필요한 경우: 주소</li>
        <li>온라인 멘토링 진행 시: 이메일 주소, 연락처(ID 포함)</li>
        <li>특정 서비스 참여 시: 이름, 생년월일, 학년, 성별</li>
      </ul>
      <p className="mb-2 text-sm">
        2. 수집 및 이용목적: 멘토와 멘티 간 원활한 예약 진행, 서비스 제공, 고객 상담 및 분쟁 조정
        해결을 위한 기록 보존
      </p>
      <p className="mb-2 text-sm">
        3. 보관기간: 회원 탈퇴 시 지체 없이 파기 (단, 관련 법령에 의해 일정 기간 보관이 필요한 경우
        해당 기간 동안 보관)
      </p>
      <p className="text-sm">
        4. 동의 거부권 고지: 개인정보 수집 및 이용 동의를 거부할 권리가 있으나, 이 경우 예약 및
        서비스 이용이 제한될 수 있음
      </p>
    </div>
  );
}
