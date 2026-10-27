export type ClassType = "Strength" | "HIIT" | "Mobility" | "Combat" | "Endurance";

export interface GymClass {
  id: string;
  day: number; // 0 = Mon
  time: string;
  name: string;
  type: ClassType;
  coach: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  spots: number;
  room: string;
}

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const mk = (
  id: string, day: number, time: string, name: string, type: ClassType,
  coach: string, intensity: 1 | 2 | 3 | 4 | 5, spots: number, room: string,
): GymClass => ({ id, day, time, name, type, coach, intensity, spots, room });

export const CLASSES: GymClass[] = [
  mk("c-mon-0600", 0, "06:00", "Iron Foundations", "Strength", "Minh Tran", 3, 12, "Rack Bay"),
  mk("c-mon-0730", 0, "07:30", "Sprint Intervals", "HIIT", "Linh Pham", 5, 8, "Turf"),
  mk("c-mon-1200", 0, "12:00", "Lunch Lift Club", "Strength", "Quoc Nguyen", 3, 10, "Rack Bay"),
  mk("c-mon-1800", 0, "18:00", "Boxing Conditioning", "Combat", "An Le", 4, 14, "Combat Room"),
  mk("c-mon-1930", 0, "19:30", "Deep Stretch Reset", "Mobility", "Mai Ho", 2, 16, "Studio"),
  mk("c-tue-0600", 1, "06:00", "Squat School", "Strength", "Minh Tran", 4, 10, "Rack Bay"),
  mk("c-tue-0730", 1, "07:30", "Engine Builder", "Endurance", "Linh Pham", 4, 12, "Turf"),
  mk("c-tue-1800", 1, "18:00", "Kettlebell Flow", "Strength", "Quoc Nguyen", 3, 12, "Studio"),
  mk("c-tue-1900", 1, "19:00", "Muay Thai Basics", "Combat", "An Le", 4, 14, "Combat Room"),
  mk("c-wed-0600", 2, "06:00", "Deadlift Lab", "Strength", "Minh Tran", 5, 8, "Rack Bay"),
  mk("c-wed-0730", 2, "07:30", "HIIT Blast 30", "HIIT", "Linh Pham", 5, 16, "Turf"),
  mk("c-wed-1200", 2, "12:00", "Mobility for Lifters", "Mobility", "Mai Ho", 2, 18, "Studio"),
  mk("c-wed-1800", 2, "18:00", "Olympic Lifting Intro", "Strength", "Quoc Nguyen", 4, 8, "Rack Bay"),
  mk("c-thu-0600", 3, "06:00", "Bench & Press", "Strength", "Quoc Nguyen", 3, 12, "Rack Bay"),
  mk("c-thu-0730", 3, "07:30", "Row & Run Engine", "Endurance", "Linh Pham", 4, 10, "Turf"),
  mk("c-thu-1800", 3, "18:00", "Sparring Drills", "Combat", "An Le", 5, 12, "Combat Room"),
  mk("c-thu-1900", 3, "19:00", "Yoga for Athletes", "Mobility", "Mai Ho", 2, 20, "Studio"),
  mk("c-fri-0600", 4, "06:00", "Heavy Friday Squats", "Strength", "Minh Tran", 5, 8, "Rack Bay"),
  mk("c-fri-0730", 4, "07:30", "Metcon Friday", "HIIT", "Linh Pham", 5, 14, "Turf"),
  mk("c-fri-1800", 4, "18:00", "Open Mat + Core", "Mobility", "Mai Ho", 3, 18, "Studio"),
  mk("c-fri-1900", 4, "19:00", "Fight Night Conditioning", "Combat", "An Le", 4, 12, "Combat Room"),
  mk("c-sat-0800", 5, "08:00", "Weekend Strength Camp", "Strength", "Minh Tran", 4, 16, "Rack Bay"),
  mk("c-sat-0930", 5, "09:30", "Team WOD", "HIIT", "Linh Pham", 4, 20, "Turf"),
  mk("c-sat-1100", 5, "11:00", "Beginner Barbell", "Strength", "Quoc Nguyen", 2, 12, "Rack Bay"),
  mk("c-sat-1600", 5, "16:00", "Long Stretch Sunday Prep", "Mobility", "Mai Ho", 1, 20, "Studio"),
  mk("c-sun-0800", 6, "08:00", "Easy Engine Ride", "Endurance", "Linh Pham", 2, 14, "Turf"),
  mk("c-sun-0930", 6, "09:30", "Technique Clinic", "Strength", "Minh Tran", 3, 10, "Rack Bay"),
  mk("c-sun-1100", 6, "11:00", "Full-Body Mobility", "Mobility", "Mai Ho", 2, 20, "Studio"),
];

export interface Tier {
  id: string;
  name: string;
  price: number; // VND per month
  note: string;
}

export const TIERS: Tier[] = [
  { id: "base", name: "BASE", price: 890000, note: "Train on your own, off-peak" },
  { id: "pro", name: "PRO", price: 1290000, note: "Most popular — all classes, all hours" },
  { id: "elite", name: "ELITE", price: 1890000, note: "Coaching + recovery included" },
];

export const FEATURES: { label: string; values: (boolean | string)[] }[] = [
  { label: "Floor access, all hours", values: [false, true, true] },
  { label: "Floor access, off-peak only", values: [true, false, false] },
  { label: "All group classes", values: [false, true, true] },
  { label: "Strength Lab + plate room", values: [true, true, true] },
  { label: "1 PT session / month", values: [false, false, true] },
  { label: "Sauna + cold plunge", values: [false, true, true] },
  { label: "Guest passes / month", values: ["0", "2", "4"] },
  { label: "Nutrition check-in", values: [false, false, true] },
];

export interface AddOn { id: string; name: string; price: number }
export const ADDONS: AddOn[] = [
  { id: "pt", name: "Extra PT session", price: 450000 },
  { id: "nutrition", name: "Nutrition plan", price: 300000 },
  { id: "guest", name: "Extra guest pass", price: 120000 },
  { id: "recovery", name: "Recovery pack (sauna + plunge)", price: 200000 },
];

export interface Trainer {
  id: string; name: string; role: string; specialty: string; rating: number; classes: string;
}
export const TRAINERS: Trainer[] = [
  { id: "t-minh", name: "Minh Tran", role: "Head Strength Coach", specialty: "Squat / Deadlift / Barbell technique", rating: 4.9, classes: "Iron Foundations · Squat School · Deadlift Lab" },
  { id: "t-linh", name: "Linh Pham", role: "Conditioning Coach", specialty: "HIIT / Engine / Sprint intervals", rating: 4.8, classes: "Sprint Intervals · Engine Builder · Team WOD" },
  { id: "t-quoc", name: "Quoc Nguyen", role: "Olympic Lifting Coach", specialty: "Clean & jerk / Snatch / Kettlebell", rating: 4.9, classes: "Kettlebell Flow · Olympic Lifting Intro · Bench & Press" },
  { id: "t-an", name: "An Le", role: "Combat Coach", specialty: "Boxing / Muay Thai / Sparring", rating: 4.7, classes: "Boxing Conditioning · Muay Thai Basics · Sparring Drills" },
  { id: "t-mai", name: "Mai Ho", role: "Mobility & Recovery Coach", specialty: "Stretch / Yoga for athletes / Recovery", rating: 5.0, classes: "Deep Stretch Reset · Yoga for Athletes · Full-Body Mobility" },
];

export type Goal = "strength" | "fatloss" | "mobility";
export const GOALS: { id: Goal; label: string; blurb: string }[] = [
  { id: "strength", label: "STRENGTH", blurb: "Four barbell days, one engine day, two recovery days." },
  { id: "fatloss", label: "FAT LOSS", blurb: "Daily movement, three conditioning days, no heavy singles." },
  { id: "mobility", label: "MOBILITY", blurb: "Gentle strength plus a mobility session every day." },
];

export interface PlanDay { title: string; focus: string; minutes: number; exercises: string[] }
export const PLANS: Record<Goal, PlanDay[]> = {
  strength: [
    { title: "Squat Day", focus: "Lower body", minutes: 75, exercises: ["Back squat 5×5", "Romanian deadlift 3×8", "Walking lunge 3×10", "Plank 3×45s"] },
    { title: "Press Day", focus: "Upper body", minutes: 60, exercises: ["Bench press 5×5", "Overhead press 3×8", "Dumbbell row 3×10", "Triceps pushdown 3×12"] },
    { title: "Engine Day", focus: "Conditioning", minutes: 40, exercises: ["Row intervals 8×500m", "Assault bike 10×30s", "Core circuit 3 rounds"] },
    { title: "Deadlift Day", focus: "Posterior chain", minutes: 75, exercises: ["Deadlift 5×3", "Front squat 3×6", "Good morning 3×10", "Hanging leg raise 3×12"] },
    { title: "Bench + Accessories", focus: "Upper body", minutes: 60, exercises: ["Bench press 4×8", "Incline dumbbell 3×10", "Pull-up 4×6", "Face pull 3×15"] },
    { title: "Mobility + Light Pump", focus: "Recovery", minutes: 45, exercises: ["Full-body stretch 20 min", "Light kettlebell flow", "Easy bike 15 min"] },
    { title: "Full Rest", focus: "Recovery", minutes: 0, exercises: ["Walk", "Sleep 8h", "Sauna if you want it"] },
  ],
  fatloss: [
    { title: "HIIT + Walk", focus: "Conditioning", minutes: 50, exercises: ["HIIT Blast 30", "Walk 10,000 steps", "Core 10 min"] },
    { title: "Full-Body Circuit", focus: "Strength + cardio", minutes: 55, exercises: ["Goblet squat 3×12", "Push-up 3×12", "Row 3×12", "Bike intervals 6×2 min"] },
    { title: "Engine Day", focus: "Conditioning", minutes: 45, exercises: ["Row 30 min steady", "Stretch 10 min"] },
    { title: "Strength Circuit", focus: "Strength", minutes: 55, exercises: ["Deadlift 3×8", "Bench 3×10", "Lunge 3×10", "Plank 3×45s"] },
    { title: "HIIT + Mobility", focus: "Conditioning", minutes: 50, exercises: ["Sprint intervals 8×30s", "Deep stretch 20 min"] },
    { title: "Team WOD", focus: "Community", minutes: 60, exercises: ["Team workout of the day", "Walk after training"] },
    { title: "Active Recovery", focus: "Recovery", minutes: 40, exercises: ["Easy swim or walk", "Full-body mobility"] },
  ],
  mobility: [
    { title: "Hips + Spine", focus: "Mobility", minutes: 40, exercises: ["90/90 hip flow", "Cat-cow + thoracic openers", "Light goblet squat 3×8"] },
    { title: "Shoulders + Upper Back", focus: "Mobility", minutes: 40, exercises: ["Band pull-aparts 3×15", "Wall slides", "Light press 3×10"] },
    { title: "Full-Body Flow", focus: "Mobility", minutes: 45, exercises: ["Sun salutation style flow", "Deep squat hold", "Easy bike 10 min"] },
    { title: "Strength, Gently", focus: "Light strength", minutes: 50, exercises: ["Goblet squat 3×10", "Dumbbell bench 3×10", "Row 3×10", "Stretch 15 min"] },
    { title: "Yoga for Athletes", focus: "Mobility", minutes: 60, exercises: ["Class: Yoga for Athletes", "Breathing 5 min"] },
    { title: "Long Stretch", focus: "Recovery", minutes: 50, exercises: ["Full-body stretch 40 min", "Walk 20 min"] },
    { title: "Rest + Walk", focus: "Recovery", minutes: 30, exercises: ["Walk", "Gentle stretch"] },
  ],
};

export const fmtVND = (n: number) => n.toLocaleString("vi-VN") + " ₫";
