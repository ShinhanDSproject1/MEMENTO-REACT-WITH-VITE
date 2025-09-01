//  수정 페이지
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MentosForm from "./MentosForm.jsx";
import { getMentos, updateMentos } from "@/services/mentos.api";

export default function EditMentosPage() {
  const { id } = useParams();
  const [data, setData] = useState(undefined);

  useEffect(() => {
    getMentos(id)
      .then(setData)
      .catch(() => setData(null));
  }, [id]);
  const handleUpdate = async (values) => {
    console.log("PUT /api/mentos/" + id, values); // 추후 api 연동
    await updateMentos(id, values);
  };

  if (data === undefined) return <div className="p-6">불러오는 중…</div>;
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5 shadow">
        <h1 className="font-WooridaumB mt-6 mb-15 pl-2 text-[20px] font-bold">멘토링 수정하기</h1>
        <MentosForm mode="edit" initialValues={data ?? {}} onSubmit={handleUpdate} />
      </section>
    </div>
  );
}
