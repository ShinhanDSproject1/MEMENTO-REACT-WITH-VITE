// EditMentosPage.tsx
import { useModal } from "@/hooks/common/useModal";
import MentosForm from "@/pages/mentor/MentosForm";
import {
  getMentos,
  updateMentos,
  type MentosItem,
} from "@/services/mentos.api"; // ⬅️ .js 제거
import { CommonModal } from "@/widgets/common/CommonModal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type RouteParams = { id: string };
type ModalType = "updateMentos";
type ModalData = Record<string, unknown>;

export default function EditMentosPage() {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>(); // ⬅️ 파라미터에 타입 지정
  const { isOpen, openModal, closeModal } = useModal<ModalType, ModalData>();

  const [data, setData] = useState<MentosItem | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    } // ⬅️ 가드
    getMentos(id)
      .then(setData)
      .catch(() => setData(null));
  }, [id]);

  const handleUpdate = async (values: Partial<MentosItem>) => {
    if (!id) return; // ⬅️ 가드
    await updateMentos(id, values); // ⬅️ 이제 에러 없어짐
    openModal("updateMentos");
  };

  const handleClose = () => {
    closeModal();
    navigate("/mento/my-list");
  };

  if (data === undefined) return <div className="p-6">불러오는 중…</div>;

  return (
    <div className="flex h-full w-full justify-center overflow-x-hidden bg-[#f5f6f8]">
      <section className="w-full bg-white px-4 py-5 shadow">
        <h1 className="mt-6 mb-15 pl-2 text-[20px] font-bold">
          멘토링 수정하기
        </h1>

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
          initialValues={data ?? ({} as MentosItem)}
          onSubmit={handleUpdate}
        />
      </section>
    </div>
  );
}
