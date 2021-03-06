export interface NotifyModel {
  contractID?: number;
  topic?: string;
  description?: string;
  time?: number;
}

const ContractTopic = "CONTRACT";
const RateTopic = "RATE";
const Comment = "COMMENT";
export { ContractTopic, RateTopic, Comment };

export function GetContractDescription(tuteeName: string | undefined) {
  return `${tuteeName} đã gửi cho bạn yêu cầu hợp đồng`;
}

export function GetRateDescription(tuteeName: string) {
  return `${tuteeName} đã đánh giá bạn`;
}

export function GetApproveContractDesc(tutorName: string | undefined) {
  return `${tutorName} đã đồng ý hợp đồng của bạn`;
}

export function GetPaidDesciption(tuteeName: string | undefined) {
  return `${tuteeName} đã thanh toán hợp đồng của bạn`;
}
