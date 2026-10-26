export type ClassType = "strength" | "cardio" | "mobility";

export interface GymClass {
  id: string;
  name: string;
  type: ClassType;
  intensity: string;
  price: number;
  desc: string;
}

export interface Coach {
  name: string;
  role: string;
  note: string;
}

export interface Membership {
  id: string;
  name: string;
  price: number;
}

export interface Testimonial {
  name: string;
  text: string;
}

export const classes: GymClass[] = [
  { id: "hiit", name: "HIIT Forge", type: "strength", intensity: "Cao", price: 180000, desc: "45 phút interval cường độ cao, đốt mỡ và tăng sức bền." },
  { id: "strength", name: "Strength Lab", type: "strength", intensity: "Vừa – Cao", price: 200000, desc: "Tạ đòn, tạ đơn, kỹ thuật chuẩn với huấn luyện viên kèm sát." },
  { id: "pilates", name: "Pilates Core", type: "mobility", intensity: "Vừa", price: 170000, desc: "Core, tư thế và kiểm soát hơi thở, phù hợp người mới." },
  { id: "boxing", name: "Boxing Fundamentals", type: "cardio", intensity: "Cao", price: 190000, desc: "Đấm bao, footwork và thể lực, không cần kinh nghiệm võ." },
  { id: "mobility", name: "Mobility Reset", type: "mobility", intensity: "Nhẹ – Vừa", price: 160000, desc: "Giãn cơ sâu, khớp và phục hồi sau buổi nặng." },
  { id: "sprint", name: "Sprint Conditioning", type: "cardio", intensity: "Cao", price: 185000, desc: "Chạy biến tốc, sled và thể lực thi đấu theo nhóm nhỏ." },
];

export const schedule = [
  { day: "Thứ 2", items: "06:30 HIIT Forge · 18:00 Strength Lab" },
  { day: "Thứ 3", items: "06:30 Pilates Core · 18:30 Boxing Fundamentals" },
  { day: "Thứ 4", items: "06:30 HIIT Forge · 18:00 Strength Lab" },
  { day: "Thứ 5", items: "06:30 Pilates Core · 18:30 Boxing Fundamentals" },
  { day: "Thứ 7", items: "08:00 Strength Lab · 16:00 HIIT Forge" },
];

export const coaches: Coach[] = [
  { name: "HLV Tuấn Kiệt", role: "Strength & Conditioning", note: "8 năm huấn luyện, chuyên kỹ thuật tạ và phục hồi." },
  { name: "HLV Mai Phương", role: "Pilates & Mobility", note: "Chuyên core, tư thế văn phòng và người mới bắt đầu." },
  { name: "HLV Hoàng Nam", role: "HIIT & Boxing", note: "Chuyên thể lực, giảm mỡ và lớp nhóm năng lượng cao." },
];

export const memberships: Membership[] = [
  { id: "flex", name: "Flex — 8 buổi/tháng", price: 1200000 },
  { id: "pro", name: "Pro — 16 buổi/tháng", price: 2000000 },
  { id: "unlimited", name: "Unlimited — không giới hạn", price: 2800000 },
];

export const testimonials: Testimonial[] = [
  { name: "Anh Minh — học viên 6 tháng", text: "Lớp nhỏ nên được sửa form từng buổi, 3 tháng đã thấy sức và dáng thay đổi rõ." },
  { name: "Chị Thảo — học viên Pilates", text: "Đau lưng văn phòng giảm hẳn, lịch cố định nên dễ duy trì." },
];

export function money(n: number): string {
  return n.toLocaleString("vi-VN") + " đ";
}

export function typeLabel(t: ClassType): string {
  return t === "strength" ? "Sức mạnh" : t === "cardio" ? "Cardio" : "Dẻo dai";
}
