import { CommonModal } from "@/03-widgets/common";
import { http } from "@/05-shared/api/https";
import { useModal } from "@/05-shared/hooks/ui/useModal";
import type {
  ApiDetailResponse,
  ApiResponse,
  Report,
  ReportDetail,
} from "@/05-shared/utils/reportUtils";
import { translateReportType } from "@/05-shared/utils/reportUtils";
import { useEffect, useState } from "react";

// ModalType에 확인 모달 키를 추가
type ModalType =
  | "reportDetail"
  | "reportAgree"
  | "reportReject"
  | "confirmReportAgree"
  | "confirmReportReject";

export default function ReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportDetail, setReportDetail] = useState<ReportDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // useModal의 modalData에 'onConfirm' 시 실행할 함수를 담을 수 있도록 타입 지정
  const { isOpen, modalType, openModal, closeModal, modalData } = useModal<
    ModalType,
    {
      onConfirm?: () => void;
    }
  >();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        // 'http'를 사용 API 호출
        const response = await http.get<ApiResponse>("/manager/reports", {
          params: { limit: 10 },
        });

        setReports(response.data.result.content);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const onClickDetail = async (report: Report) => {
    openModal("reportDetail"); // 먼저 모달을 엽니다 (내부는 로딩 상태)
    setDetailLoading(true);
    setDetailError(null);
    setReportDetail(null);

    try {
      // 상세조회 API 호출 (엔드포인트는 실제 API 명세에 맞게 조정 필요)
      const response = await http.get<ApiDetailResponse>(`/manager/reports/${report.reportSeq}`);
      setReportDetail(response.data.result); // 성공 시 상세 데이터 저장
    } catch (err) {
      setDetailError("상세 정보를 불러오는 데 실패했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleReportAction = async (action: "approval" | "rejection") => {
    if (!reportDetail) return;
    try {
      openModal("loading");
      const path = `/manager/reports/${action}/${reportDetail.reportSeq}`;
      await http.patch(path);
      openModal(action === "approval" ? "reportAgree" : "reportReject");
      setReports((prevReports) =>
        prevReports.filter((report) => report.reportSeq !== reportDetail.reportSeq),
      );
    } catch (err) {
      console.error("신고 처리 중 에러 발생:", err);
      alert("신고 처리에 실패했습니다. 다시 시도해주세요.");
      closeModal();
    }
  };

  // '승인' 버튼 클릭 시 실행될 함수
  const handleApproveClick = () => {
    openModal("confirmReportAgree", {
      onConfirm: () => handleReportAction("approval"),
    });
  };

  // '거부' 버튼 클릭 시 실행될 함수
  const handleRejectClick = () => {
    openModal("confirmReportReject", {
      onConfirm: () => handleReportAction("rejection"),
    });
  };

  if (loading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="font-woori flex min-h-screen w-full items-start justify-center">
      <div className="mx-auto my-6 w-[375px] bg-white text-[#111]">
        <h1 className="mb-3 text-left text-[28px] leading-[32px] font-bold">신고 확인</h1>
        <div className="overflow-auto rounded-[12px] border border-[#E5E7ED]">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="text-[13px] font-extrabold text-white">
                <th className="h-10 border-r border-white/35 bg-[#0b76ff] px-3 text-center first:rounded-tl-[12px]">
                  신고자
                </th>
                <th className="h-10 border-r border-white/35 bg-[#0b76ff] px-3 text-center">
                  신고 멘토링
                </th>
                <th className="h-10 border-r border-white/35 bg-[#0b76ff] px-3 text-center">
                  분류
                </th>
                <th className="h-10 bg-[#0b76ff] px-3 text-center last:rounded-tr-[12px]">
                  상세보기
                </th>
              </tr>
            </thead>
            <tbody className="text-[13px] [&>tr:last-child>td]:border-b [&>tr>td]:h-10 [&>tr>td]:border-t [&>tr>td]:border-l [&>tr>td]:border-[#E5E7ED] [&>tr>td]:px-3 [&>tr>td]:text-center [&>tr>td]:align-middle [&>tr>td:first-child]:border-l-0">
              {reports.map((report) => (
                <tr key={report.reportSeq} className="bg-white">
                  <td>{report.reporterName}</td>
                  <td>{report.reportedMentosTitle}</td>
                  <td className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {translateReportType(report.reportType)}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => onClickDetail(report)}
                      className="inline-flex h-6 cursor-pointer items-center justify-center rounded-full bg-[#005EF9] px-3 text-[12px] leading-none whitespace-nowrap text-white hover:bg-[#0048C7] focus:ring-2 focus:ring-[#005EF9]/30 focus:outline-none">
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpen && (
        <CommonModal
          type={modalType!}
          isOpen={isOpen}
          onSubmit={handleApproveClick}
          onConfirm={modalData?.onConfirm || handleRejectClick}
          onCancel={closeModal}
          modalData={
            modalType === "reportDetail"
              ? { detail: reportDetail, loading: detailLoading, error: detailError }
              : {}
          }
        />
      )}
    </div>
  );
}
