// src/pages/mentor/EditMentosPage.tsx
import MentosForm from "@/pages/mentor/MentosForm";
import {
  getMentosDetail,
  updateMentos,
  type MentosDetailResult,
  type MentosItem,
} from "@api/mentos";
import { useModal } from "@hooks/ui/useModal";
import { CommonModal } from "@widgets/common";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type RouteParams = { id: string };
type ModalType = "updateMentos";
type ModalData = Record<string, unknown>;

// 상세 응답 → 폼 초기값 매핑
function mapDetailToFormInitial(detail: MentosDetailResult) {
  return {
    title: detail.mentosTitle,
    content: detail.mentosDescription, // 상세 설명을 에디터로
    price: String(detail.mentosPrice),
    location: detail.mentosLocation,
    // category / imageFile은 스펙상 제외 (필요 시 확장)
  };
}

export default function EditMentosPage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();
  const { isOpen, openModal, closeModal } = useModal<ModalType, ModalData>();

  // 상세 조회 결과 상태 (undefined: 로딩, null: 에러/없음, 객체: 성공)
  const [detail, setDetail] = useState<MentosDetailResult | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setDetail(null);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const res = await getMentosDetail(Number(id)); // ✅ number로 변환
        if (alive) setDetail(res);
      } catch {
        if (alive) setDetail(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const handleUpdate = async (values: Partial<MentosItem>) => {
    if (!id) return;
    // MentosForm에서 넘어오는 값(MentosFormValues)을 Partial<MentosItem>로 맞춰 호출
    await updateMentos(id, {
      title: values.title ?? "",
      content: values.content ?? "",
      price: values.price ?? "",
      location: values.location ?? "",
    });
    openModal("updateMentos");
  };

  const handleClose = () => {
    closeModal();
    navigate("/mento/my-list");
  };

  if (detail === undefined) return <div className="p-6">불러오는 중…</div>;
  if (detail === null) return <div className="p-6 text-red-600">데이터를 불러오지 못했습니다.</div>;

  return (
    <div className="flex h-full w-full justify-center overflow-x-hidden bg-[#f5f6f8]">
      <section className="w-full bg-white px-4 py-5 shadow">
        <h1 className="mt-6 mb-15 pl-2 text-[20px] font-bold">멘토링 수정하기</h1>

        <CommonModal
          type="updateMentos"
          isOpen={isOpen}
          onConfirm={handleClose}
          onCancel={handleClose}
          onSubmit={() => {}}
          modalData={{}}
        />

        <MentosForm
          mode="edit"
          // 상세 응답을 폼 초기값으로 매핑
          initialValues={mapDetailToFormInitial(detail)}
          onSubmit={handleUpdate}
        />
      </section>
    </div>
  );
}
