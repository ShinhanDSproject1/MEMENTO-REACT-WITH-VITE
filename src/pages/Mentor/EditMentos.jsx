import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MentosForm from "./MentosForm.jsx";
import { useModal } from "@/hooks/common/useModal";
import { getMentos, updateMentos } from "@/services/mentos.api";
import { CommonModal } from "@/components/common/CommonModal";

export default function EditMentosPage() {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();

  const { id } = useParams();
  const [data, setData] = useState(undefined);

  useEffect(() => {
    getMentos(id)
      .then(setData)
      .catch(() => setData(null));
  }, [id]);
  const handleUpdate = async (values) => {
    await updateMentos(id, values);
    openModal("updateMentos");
  };

  const handleClose = async () => {
    closeModal();
    navigate("/mento/my-list");
  };

  if (data === undefined) return <div className="p-6">불러오는 중…</div>;
  return (
    <div className="flex min-h-full w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5 shadow">
        <h1 className="font-WooridaumB mt-6 mb-15 pl-2 text-[20px] font-bold">멘토링 수정하기</h1>

        <CommonModal
          type={"updateMentos"}
          isOpen={isOpen}
          onConfirm={handleClose}
          onCancel={handleClose}
          onSubmit={() => {}}
          modalData={{}}
        />

        <MentosForm mode="edit" initialValues={data ?? {}} onSubmit={handleUpdate} />
      </section>
    </div>
  );
}
