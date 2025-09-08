import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommonModal } from "@/components/common/CommonModal";

export default function PaySuccess() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const goToMyMentos = () => {
    setOpen(false);
    navigate("/mentee/mymentos", { replace: true, state: { from: "paymentSuccess" } });
  };

  return (
    <CommonModal type="paySuccess" isOpen={open} onConfirm={goToMyMentos} onCancel={goToMyMentos} />
  );
}
