import MentosForm from "@/pages/mentor/MentosForm";
import { CommonModal } from "@/widgets/common/CommonModal";
import { useModal } from "@hooks/ui/useModal";
import { useNavigate } from "react-router-dom";

export default function CreateMentos() {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();

  const handleCreate = () => {
    openModal("createMentos");
  };

  const handleClose = async () => {
    closeModal();
    navigate("/mento/my-list");
  };

  return (
    <div className="flex min-h-full w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5 shadow">
        <h1 className="font-WooridaumB mt-6 mb-15 pl-2 text-[20px] font-bold">멘토링 생성하기</h1>

        <CommonModal
          type="createMentos"
          isOpen={isOpen}
          onConfirm={handleClose}
          onCancel={handleClose}
          onSubmit={() => {}}
          modalData={{}}
        />

        <MentosForm mode="create" initialValues={{}} onSubmit={handleCreate} />
      </section>
    </div>
  );
}
