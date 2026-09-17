/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Student, Class, Musyrif, Capaian } from "../types";
import {
  Printer,
  Download,
  CheckCircle,
  Award,
  Users,
  User,
  Calendar,
  Sparkles,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckSquare,
  Square,
  RefreshCw,
  X
} from "lucide-react";
import smpAlIrsyadBanner from "../assets/images/smp_al_irsyad_banner.png";
import headerRightLogo from "../assets/images/header_right_logo.png";

export interface CertificateData {
  namaSiswa: string;
  kelas: string;
  materiTasmi: string;
  waktuTasmi: string;
  predikat: string;
  jumlahHafalan: string;
  tanggalSurat: string;
  musyrif: {
    jabatan: string;
    nama: string;
    nik?: string;
  };
  wakaKeagamaan: {
    jabatan: string;
    nama: string;
    nik: string;
  };
  penanggungjawabTahfidz: {
    jabatan: string;
    nama: string;
    nik: string;
  };
}

interface CertificatePrinterProps {
  students: Student[];
  classes: Class[];
  musyrifs: Musyrif[];
  capaians: Capaian[];
  currentMusyrif: Musyrif;
  initialStudentId?: string;
  onClose?: () => void;
}

// Vector Al-Irsyad Winged Emblem for Certificate Header & Watermark
const AlIrsyadWingedLogo = ({ className = "w-16 h-12", isWatermark = false }: { className?: string; isWatermark?: boolean }) => {
  const fillColor = isWatermark ? "#0A5C36" : "#0A5C36";
  const accentColor = isWatermark ? "#15803D" : "#047857";

  return (
    <svg viewBox="0 0 160 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left Wings */}
      <g fill={fillColor}>
        <path d="M 68 36 C 55 24 35 20 5 28 C 15 32 30 36 45 42 C 55 46 62 48 68 48 Z" opacity="0.95" />
        <path d="M 66 44 C 52 35 32 32 8 40 C 18 43 32 46 44 50 C 54 53 62 55 66 54 Z" opacity="0.85" />
        <path d="M 64 52 C 50 45 34 43 14 50 C 22 53 34 56 46 58 C 55 60 62 60 64 59 Z" opacity="0.75" />
        <path d="M 62 58 C 50 54 36 53 20 59 C 28 62 38 64 48 64 C 55 64 60 63 62 62 Z" opacity="0.65" />
      </g>

      {/* Right Wings */}
      <g fill={fillColor}>
        <path d="M 92 36 C 105 24 125 20 155 28 C 145 32 130 36 115 42 C 105 46 98 48 92 48 Z" opacity="0.95" />
        <path d="M 94 44 C 108 35 128 32 152 40 C 142 43 128 46 116 50 C 106 53 98 55 94 54 Z" opacity="0.85" />
        <path d="M 96 52 C 110 45 126 43 146 50 C 138 53 126 56 114 58 C 105 60 98 60 96 59 Z" opacity="0.75" />
        <path d="M 98 58 C 110 54 124 53 140 59 C 132 62 122 64 112 64 C 105 64 100 63 98 62 Z" opacity="0.65" />
      </g>

      {/* Central Shield */}
      <path
        d="M 80 14 C 95 14 98 25 98 38 C 98 56 80 68 80 68 C 80 68 62 56 62 38 C 62 25 65 14 80 14 Z"
        fill="#FFFFFF"
        stroke={fillColor}
        strokeWidth="2.5"
      />
      <path
        d="M 80 18 C 92 18 94 27 94 38 C 94 52 80 63 80 63 C 80 63 66 52 66 38 C 66 27 68 18 80 18 Z"
        fill={accentColor}
        opacity={isWatermark ? "0.3" : "0.15"}
      />

      {/* Islamic Star and Crescent inside shield */}
      <circle cx="80" cy="35" r="8" fill={fillColor} />
      <circle cx="83" cy="34" r="6.5" fill="#FFFFFF" />
      <polygon
        points="83,28 84.5,31 87.5,31 85,33 86,36 83,34 80,36 81,33 78.5,31 81.5,31"
        fill="#EAB308"
      />

      {/* Open Holy Quran in Center Shield */}
      <path
        d="M 73 48 C 76 46 80 47 80 47 C 80 47 84 46 87 48 L 87 54 C 84 52 80 53 80 53 C 80 53 76 52 73 54 Z"
        fill="#FFFFFF"
        stroke={fillColor}
        strokeWidth="1.2"
      />
      <line x1="80" y1="47" x2="80" y2="53" stroke={fillColor} strokeWidth="1" />
    </svg>
  );
};

// Single Certificate Document View
const CertificateDocument: React.FC<{ data: CertificateData }> = ({ data }) => {
  return (
    <div
      className="certificate-page relative w-full bg-[#fbfaf5] text-slate-800 overflow-hidden shadow-2xl mx-auto select-none print:shadow-none print:m-0 print:border-none print:w-[297mm] print:h-[210mm] print:min-h-[210mm] print:max-h-[210mm]"
      style={{
        aspectRatio: "297 / 210",
        boxSizing: "border-box",
      }}
    >
      {/* Background SVG Framing & Sashes (Dot grid, Double Gold Border, Bottom-Left Corner & Gold Arc) */}
      <svg
        viewBox="0 0 1000 707.1"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Subtle Sage Dot Grid Pattern matching original design */}
          <pattern id="certDotPattern" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="9" r="1.15" fill="#1b5e3a" opacity="0.16" />
          </pattern>

          {/* Deep Forest Green Gradient for Bottom-Left Wedge */}
          <linearGradient id="certGreenCornerGrad" x1="0%" y1="100%" x2="80%" y2="20%">
            <stop offset="0%" stopColor="#052e18" />
            <stop offset="50%" stopColor="#084725" />
            <stop offset="100%" stopColor="#0a5c36" />
          </linearGradient>

          {/* Rich Gold Gradient for Corner Ribbon */}
          <linearGradient id="certGoldSwooshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Gold Trailing Arc Gradient along bottom border */}
          <linearGradient id="certGoldBottomArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#eab308" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#ca8a04" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Dot Grid Texture */}
        <rect width="1000" height="707.1" fill="url(#certDotPattern)" />

        {/* 2. Outer Gold Border */}
        <rect
          x="24"
          y="24"
          width="952"
          height="659.1"
          fill="none"
          stroke="#bda466"
          strokeWidth="2.4"
        />

        {/* 3. Inner Fine Gold Border */}
        <rect
          x="35"
          y="35"
          width="930"
          height="637.1"
          fill="none"
          stroke="#d8c593"
          strokeWidth="1.2"
        />

        {/* 4. Bottom-Left Dark Green Curved Wedge */}
        <path
          d="M 0 440 Q 90 560 210 635 T 440 707.1 L 0 707.1 Z"
          fill="url(#certGreenCornerGrad)"
        />

        {/* 5. Gold Highlight Swoosh along the curve */}
        <path
          d="M 0 440 Q 90 560 210 635 T 440 707.1"
          fill="none"
          stroke="url(#certGoldSwooshGrad)"
          strokeWidth="4"
        />

        {/* 6. Gold Ribbon Curve swooping along the bottom edge */}
        <path
          d="M 190 625 Q 340 688 560 703"
          fill="none"
          stroke="url(#certGoldBottomArc)"
          strokeWidth="2.6"
        />
      </svg>

      {/* FADED CENTER WATERMARK FROM OFFICIAL AL-IRSYAD LOGO */}
      <div className="cert-watermark absolute inset-0 flex items-center justify-center pointer-events-none z-[1] select-none">
        <img
          src="/al_irsyad_official_logo.png"
          alt="Watermark Al-Irsyad Al-Islamiyyah"
          className="cert-watermark-img w-[640px] max-w-[72%] max-h-[72%] object-contain opacity-[0.10] filter contrast-125"
          onError={(e) => {
            e.currentTarget.src = "/al_irsyad_official_logo.png";
          }}
        />
      </div>

      {/* ================= MAIN CERTIFICATE CONTENT CONTAINER ================= */}
      <div className="cert-content-container relative z-10 h-full w-full flex flex-col justify-between pt-8 sm:pt-9 md:pt-10 px-6 sm:px-8 md:px-10 pb-7 sm:pb-9 md:pb-11 box-border">
        {/* HEADER SECTION (Nudged down slightly for breathing room from the top border) */}
        <div className="flex items-start justify-between gap-4 mt-1 sm:mt-1.5 md:mt-2">
          {/* Top-Left: Official Al-Irsyad School Identity Banner */}
          <div className="flex flex-col items-start w-fit max-w-[52%]">
            <img
              src={smpAlIrsyadBanner}
              alt="SMP Al-Irsyad Surakarta"
              className="cert-school-banner h-12 sm:h-14 md:h-16 lg:h-[78px] w-auto max-w-[280px] sm:max-w-[340px] md:max-w-[420px] object-contain object-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("smp_al_irsyad_banner.png")) {
                  target.src = "/smp_al_irsyad_banner.png";
                } else if (!target.src.endsWith("/X%20BANNER.png")) {
                  target.src = "/X BANNER.png";
                }
              }}
            />
            {/* Divider line directly under the banner */}
            <div className="cert-school-line w-full h-[1.5px] bg-[#005a32]/70 my-1 sm:my-1.5" />
            {/* School address directly under the line */}
            <p className="cert-school-addr text-[8px] sm:text-[9.5px] md:text-[10.5px] font-bold text-slate-600 tracking-tight leading-tight uppercase pl-0.5">
              JL. KAPTEN MULYADI NO. 117 TELP. (0271) 647730 SURAKARTA 57113
            </p>
          </div>

          {/* Top-Right: Official Program Identity (SMPQU SMP QUR'AN + ZIYADAH TAHFIDZ EXCELLENCE PROGRAM) */}
          <div className="flex items-center justify-end shrink-0">
            <img
              src={headerRightLogo}
              alt="SMPQU SMP Qur'an - Ziyadah Tahfidz Excellence Program"
              className="cert-program-logo h-14 sm:h-16 md:h-20 lg:h-[86px] w-auto max-w-[270px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[440px] object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("header_right_logo.png")) {
                  target.src = "/header_right_logo.png";
                } else if (!target.src.endsWith("/logo_kanan.png")) {
                  target.src = "/logo_kanan.png";
                }
              }}
            />
          </div>
        </div>

        {/* CENTER BODY SECTION: TITLE & RECIPIENT */}
        {/* Diturunkan dan dipusatkan tepat di tengah lembar sertifikat antara kop atas dan tanda tangan bawah */}
        <div className="cert-body-center flex flex-col items-center text-center my-auto px-4 sm:px-8 space-y-1 sm:space-y-2 md:space-y-2.5 pt-7 sm:pt-9 md:pt-11 pb-1 sm:pb-2">
          {/* Main Title: "Piagam Penghargaan" in Gothic/Fraktur style */}
          <h1
            className="cert-title text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal text-[#0a5c36] tracking-wide leading-tight select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
            style={{
              fontFamily: "'UnifrakturMaguntia', 'Cinzel Decorative', Georgia, serif",
            }}
          >
            Piagam Penghargaan
          </h1>

          {/* Subtitle */}
          <p className="cert-subtitle text-sm sm:text-base md:text-lg text-slate-800 font-semibold tracking-wide">
            Barakallah atas hafalannya ananda :
          </p>

          {/* Student Name */}
          <div className="pt-0.5 pb-0.5 w-full max-w-2xl">
            <h2 className="cert-student-name text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-black text-slate-900 tracking-tight uppercase leading-snug font-sans">
              {data.namaSiswa || "Nama Santri"}
            </h2>
            {/* Elegant Name Underline with Center Diamond */}
            <div className="cert-student-underline relative flex items-center justify-center w-64 sm:w-80 md:w-96 mx-auto mt-1 sm:mt-1.5">
              <div className="w-full h-[2px] bg-slate-900" />
              <div className="absolute w-2.5 h-2.5 bg-[#0a5c36] rotate-45 border-2 border-white" />
            </div>
          </div>

          {/* Student Class & Tasmi Details */}
          <div className="cert-details space-y-0.5 sm:space-y-1 text-slate-800 text-sm sm:text-base md:text-lg font-medium leading-normal">
            <p>
              <span className="font-bold">Kelas :</span> {data.kelas}
            </p>
            <p>
              <span className="font-bold">Tasmi' :</span> {data.materiTasmi}
            </p>
            <p>
              <span className="font-bold">Waktu Tasmi' :</span> {data.waktuTasmi}
            </p>
          </div>

          {/* PREDIKAT & JUMLAH HAFALAN NOTCHED RIBBON PILL */}
          <div className="cert-ribbon-wrapper pt-2 sm:pt-2.5 flex items-center justify-center">
            <div className="cert-ribbon-container inline-flex items-center relative filter drop-shadow-[0_2px_4px_rgba(10,92,54,0.10)]">
              {/* Left Ribbon Wing: Ekor pita melipat menyatu mulus ke balik lingkaran kapsul */}
              <svg
                className="cert-ribbon-wing cert-wing-left w-9 sm:w-11 md:w-12 h-9 sm:h-10 md:h-11 -mr-5 sm:-mr-6 md:-mr-7 z-0 select-none"
                viewBox="0 0 48 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Pita hijau utama dengan lekukan swallowtail tembus pandang */}
                <path
                  d="M48 0H4L16 19L4 38H48V0Z"
                  fill="#0a5c36"
                />
                {/* Bayangan lipatan pita (3D ribbon fold shadow) */}
                <path
                  d="M48 0L28 19L48 38V0Z"
                  fill="#05361e"
                  opacity="0.35"
                />
                {/* Garis aksen emas mewah khas Al-Irsyad */}
                <path
                  d="M48 2.5H7L16.5 19L7 35.5H48"
                  stroke="#d4af37"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
              </svg>

              {/* Center Pill: Lingkaran kapsul putih bersih dengan border hijau tajam */}
              <div className="cert-ribbon-pill relative z-10 h-9 sm:h-10 md:h-11 px-7 sm:px-10 md:px-12 bg-white border-2 md:border-[2.5px] border-[#0a5c36] rounded-full shadow-sm flex items-center justify-center gap-3 sm:gap-5">
                <span className="cert-ribbon-text text-sm sm:text-base md:text-lg font-extrabold text-[#0a5c36] tracking-wide whitespace-nowrap">
                  Predikat : <span className="text-slate-900 font-black">{data.predikat}</span>
                </span>
                <span className="text-[#0a5c36] font-black text-base sm:text-lg md:text-xl select-none">|</span>
                <span className="cert-ribbon-text text-sm sm:text-base md:text-lg font-extrabold text-[#0a5c36] tracking-wide whitespace-nowrap">
                  Jumlah hafalan : <span className="text-slate-900 font-black">{data.jumlahHafalan}</span>
                </span>
              </div>

              {/* Right Ribbon Wing: Ekor pita melipat simetris ke kanan */}
              <svg
                className="cert-ribbon-wing cert-wing-right w-9 sm:w-11 md:w-12 h-9 sm:h-10 md:h-11 -ml-5 sm:-ml-6 md:-ml-7 z-0 select-none"
                viewBox="0 0 48 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Pita hijau utama dengan lekukan swallowtail tembus pandang */}
                <path
                  d="M0 0H44L32 19L44 38H0V0Z"
                  fill="#0a5c36"
                />
                {/* Bayangan lipatan pita (3D ribbon fold shadow) */}
                <path
                  d="M0 0L20 19L0 38V0Z"
                  fill="#05361e"
                  opacity="0.35"
                />
                {/* Garis aksen emas mewah khas Al-Irsyad */}
                <path
                  d="M0 2.5H41L31.5 19L41 35.5H0"
                  stroke="#d4af37"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* FOOTER: 3 SIGNATURE COLUMNS (LEFT: MUSYRIF, CENTER: DATE & WAKA, RIGHT: PENANGGUNGJAWAB TAHFIDZ) */}
        {/* Raised up with ample signature space (h-16 sm:h-20 md:h-24) and safe bottom margin */}
        <div className="cert-footer mt-auto pt-0 mb-3 sm:mb-4 md:mb-5">
          <div className="cert-footer-grid grid grid-cols-3 gap-3 sm:gap-6 items-end text-center">
            {/* 1. BAGIAN KIRI: MUSYRIF */}
            <div className="flex flex-col items-center">
              {/* Spacer matching the date row in the center */}
              <div className="cert-sig-spacer h-5 sm:h-6 md:h-7" />

              <p className="cert-sig-role text-xs sm:text-sm md:text-base font-bold text-slate-800 leading-tight">
                {data.musyrif.jabatan}
              </p>

              {/* Ruang Tanda Tangan Lapang & Lebih Tinggi */}
              <div className="cert-sig-box h-16 sm:h-20 md:h-24 flex items-center justify-center relative w-full" />

              <p className="cert-sig-name text-xs sm:text-sm md:text-base font-extrabold text-slate-900 leading-tight border-b-2 border-slate-900/80 pb-0.5 px-3 min-w-[150px] sm:min-w-[190px] md:min-w-[210px]">
                {data.musyrif.nama}
              </p>
              {data.musyrif.nik ? (
                <p className="cert-sig-nik text-xs sm:text-sm md:text-[15px] font-semibold text-slate-700 mt-1">
                  {data.musyrif.nik}
                </p>
              ) : (
                <p className="cert-sig-nik text-xs sm:text-sm md:text-[15px] font-semibold text-slate-500 mt-1">
                  Pembina Tahfidz
                </p>
              )}
            </div>

            {/* 2. BAGIAN TENGAH: OTOMATIS TANGGAL CETAK KEMUDIAN WAKA BIDANG KEAGAMAAN */}
            <div className="flex flex-col items-center relative">
              {/* Otomatis Tanggal Cetak */}
              <div className="cert-date-text text-center text-xs sm:text-sm md:text-base font-bold text-slate-800 mb-1 leading-tight">
                {data.tanggalSurat}
              </div>

              {/* Jabatan Waka Bidang Keagamaan */}
              <p className="cert-sig-role text-xs sm:text-sm md:text-base font-bold text-slate-800 leading-tight">
                {data.wakaKeagamaan.jabatan}
              </p>

              {/* Ruang Tanda Tangan Lapang & Cap Stempel Resmi */}
              <div className="cert-sig-box h-16 sm:h-20 md:h-24 flex items-center justify-center relative w-full" />

              <p className="cert-sig-name text-xs sm:text-sm md:text-base font-extrabold text-slate-900 leading-tight border-b-2 border-slate-900/80 pb-0.5 px-3 min-w-[150px] sm:min-w-[190px] md:min-w-[210px]">
                {data.wakaKeagamaan.nama}
              </p>
              <p className="cert-sig-nik text-xs sm:text-sm md:text-[15px] font-semibold text-slate-700 mt-1">
                {data.wakaKeagamaan.nik}
              </p>
            </div>

            {/* 3. KOLOM KANAN: PENANGGUNGJAWAB TAHFIDZ */}
            <div className="flex flex-col items-center">
              {/* Spacer matching the date row in the center */}
              <div className="cert-sig-spacer h-5 sm:h-6 md:h-7" />

              <p className="cert-sig-role text-xs sm:text-sm md:text-base font-bold text-slate-800 leading-tight">
                {data.penanggungjawabTahfidz.jabatan}
              </p>

              {/* Ruang Tanda Tangan Lapang */}
              <div className="cert-sig-box h-16 sm:h-20 md:h-24 flex items-center justify-center relative w-full" />

              <p className="cert-sig-name text-xs sm:text-sm md:text-base font-extrabold text-slate-900 leading-tight border-b-2 border-slate-900/80 pb-0.5 px-3 min-w-[150px] sm:min-w-[190px] md:min-w-[210px]">
                {data.penanggungjawabTahfidz.nama}
              </p>
              <p className="cert-sig-nik text-xs sm:text-sm md:text-[15px] font-semibold text-slate-700 mt-1">
                {data.penanggungjawabTahfidz.nik}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CertificatePrinter({
  students,
  classes,
  musyrifs,
  capaians,
  currentMusyrif,
  initialStudentId,
  onClose,
}: CertificatePrinterProps) {
  // Only students mentored by this Musyrif
  const myStudents = students.filter((s) => s.musyrifId === currentMusyrif.id);

  // Selection mode: 'single' student or 'batch' all/multiple students
  const [printMode, setPrintMode] = useState<"single" | "batch">("single");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || myStudents[0]?.id || ""
  );

  React.useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId);
      const student = myStudents.find((s) => s.id === initialStudentId);
      if (student) {
        const studentCapaians = capaians.filter((c) => c.studentId === student.id);
        if (studentCapaians.length > 0) {
          const latest = studentCapaians[studentCapaians.length - 1];
          if (latest.juz && latest.juz !== "-") {
            setJumlahHafalan(`${latest.juz} Juz`);
          }
          if (latest.capaianAkhir) {
            setMateriTasmi(`Juz ${latest.juz || "30"} (${latest.capaianAkhir})`);
          }
        }
      }
    }
  }, [initialStudentId]);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>(
    myStudents.map((s) => s.id)
  );
  const [searchFilter, setSearchFilter] = useState("");

  // Certificate customization form state
  const [materiTasmi, setMateriTasmi] = useState("Juz 30, 29, 28 & Al Baqarah 1-76");
  const [waktuTasmi, setWaktuTasmi] = useState("Senin, 03 Juni 2024 ( 07.50 - 10.10 )");
  const [predikat, setPredikat] = useState("Mumtaz");
  const [jumlahHafalan, setJumlahHafalan] = useState("7 Juz");
  const [wakaNama, setWakaNama] = useState("Yusuf Arifin, S.Pd");
  const [wakaNik, setWakaNik] = useState("NIK. 103.244.00172");
  const [pjNama, setPjNama] = useState("Muhammat Imam Syafi'i, S.Pd.");
  const [pjNik, setPjNik] = useState("NIK. 103.244.00205");
  const [customMusyrifNama, setCustomMusyrifNama] = useState("");
  const [customMusyrifNik, setCustomMusyrifNik] = useState("");

  // Helper to format today's printing date automatically in Indonesian
  const formatTanggalCetakOtomatis = () => {
    const today = new Date();
    const formatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);
    return `Surakarta, ${formatted}`;
  };

  const [tanggalSurat, setTanggalSurat] = useState(formatTanggalCetakOtomatis);

  // Show detailed customization panel
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Current active preview student
  const activeStudent = myStudents.find((s) => s.id === selectedStudentId) || myStudents[0];

  // Helper to autofill certificate details from a student's capaian
  const handleSelectStudent = (student: Student) => {
    setSelectedStudentId(student.id);

    // Find student's most recent capaian
    const studentCapaians = capaians.filter((c) => c.studentId === student.id);
    if (studentCapaians.length > 0) {
      const latest = studentCapaians[studentCapaians.length - 1];
      if (latest.juz && latest.juz !== "-") {
        setJumlahHafalan(`${latest.juz} Juz`);
      }
      if (latest.capaianAkhir) {
        setMateriTasmi(`Juz ${latest.juz || "30"} (${latest.capaianAkhir})`);
      }
    }
  };

  // Toggle selection for batch print
  const handleToggleBatchStudent = (id: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllBatch = () => {
    if (selectedBatchIds.length === filteredMyStudents.length) {
      setSelectedBatchIds([]);
    } else {
      setSelectedBatchIds(filteredMyStudents.map((s) => s.id));
    }
  };

  const filteredMyStudents = myStudents.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.noInduk.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.kelasId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Trigger browser print dialog with landscape styles
  const handleTriggerPrint = () => {
    window.print();
  };

  // Build certificate data object for a given student
  const buildCertData = (student: Student): CertificateData => {
    const classObj = classes.find((c) => c.id === student.kelasId);
    const kelasStr = classObj ? classObj.nama : student.kelasId;
    const assignedMusyrif = musyrifs.find((m) => m.id === student.musyrifId) || currentMusyrif;

    const defaultMusyrifNama = assignedMusyrif?.nama || currentMusyrif?.nama || "Ustadz Ridwan Setiyono, M.Pd";
    const defaultMusyrifNik = assignedMusyrif?.nik
      ? (assignedMusyrif.nik.startsWith("NIK") ? assignedMusyrif.nik : `NIK. ${assignedMusyrif.nik}`)
      : (currentMusyrif?.nik
          ? (currentMusyrif.nik.startsWith("NIK") ? currentMusyrif.nik : `NIK. ${currentMusyrif.nik}`)
          : "NIK. 103.244.00259");

    return {
      namaSiswa: student.nama,
      kelas: kelasStr,
      materiTasmi,
      waktuTasmi,
      predikat,
      jumlahHafalan,
      tanggalSurat: tanggalSurat || formatTanggalCetakOtomatis(),
      musyrif: {
        jabatan: "Musyrif",
        nama: customMusyrifNama || defaultMusyrifNama,
        nik: customMusyrifNik || defaultMusyrifNik,
      },
      wakaKeagamaan: {
        jabatan: "Waka Bidang Keagamaan",
        nama: wakaNama,
        nik: wakaNik,
      },
      penanggungjawabTahfidz: {
        jabatan: "Penanggungjawab Tahfidz",
        nama: pjNama,
        nik: pjNik,
      },
    };
  };

  // Batch students to print
  const batchStudents = myStudents.filter((s) => selectedBatchIds.includes(s.id));

  return (
    <div className="min-h-screen bg-slate-900/50 flex flex-col print:bg-white print:min-h-0 print:block">
      {/* Dynamic Landscape Print CSS injected when printing */}
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          *, *:before, *:after {
            box-sizing: border-box !important;
          }
          html, body {
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print,
          header.no-print,
          aside.no-print,
          main.no-print,
          div.no-print {
            display: none !important;
          }
          .certificate-print-wrapper {
            display: block !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
          }
          .certificate-print-page {
            width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            max-height: 210mm !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always !important;
            break-after: page !important;
            margin: 0 !important;
            padding: 0 !important;
            position: relative !important;
            overflow: hidden !important;
            background-color: #fbfaf5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .certificate-print-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .certificate-page {
            width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            max-height: 210mm !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background-color: #fbfaf5 !important;
            position: relative !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Exact element alignment to match preview 100% on 297mm x 210mm A4 */
          .certificate-page .cert-content-container {
            height: 100% !important;
            max-height: 210mm !important;
            padding-top: 14mm !important;
            padding-left: 16mm !important;
            padding-right: 16mm !important;
            padding-bottom: 14mm !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          .certificate-page .cert-watermark-img {
            width: 190mm !important;
            max-width: 72% !important;
            max-height: 72% !important;
            opacity: 0.10 !important;
          }
          .certificate-page .cert-school-banner {
            height: 16.5mm !important;
            max-width: 95mm !important;
            object-fit: contain !important;
            object-position: left center !important;
          }
          .certificate-page .cert-school-line {
            width: 100% !important;
            height: 1.5px !important;
            background-color: rgba(0, 90, 50, 0.7) !important;
            margin: 1mm 0 !important;
          }
          .certificate-page .cert-school-addr {
            font-size: 6.8pt !important;
            line-height: 1.1 !important;
            color: #475569 !important;
            margin-top: 0 !important;
          }
          .certificate-page .cert-program-logo {
            height: 18mm !important;
            max-width: 110mm !important;
          }
          .certificate-page .cert-body-center {
            margin-top: auto !important;
            margin-bottom: auto !important;
            padding-top: 11mm !important;
            padding-bottom: 2mm !important;
          }
          .certificate-page .cert-title {
            font-size: 46pt !important;
            line-height: 1.05 !important;
            font-family: 'UnifrakturMaguntia', 'Cinzel Decorative', Georgia, serif !important;
            color: #0a5c36 !important;
          }
          .certificate-page .cert-subtitle {
            font-size: 13pt !important;
            margin-top: 3px !important;
          }
          .certificate-page .cert-student-name {
            font-size: 28pt !important;
            line-height: 1.15 !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
          }
          .certificate-page .cert-student-underline {
            width: 320px !important;
            margin-top: 5px !important;
          }
          .certificate-page .cert-details {
            font-size: 12.5pt !important;
            line-height: 1.4 !important;
            margin-top: 4px !important;
          }
          .certificate-page .cert-ribbon-wrapper {
            padding-top: 8px !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .certificate-page .cert-ribbon-container {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
          }
          .certificate-page .cert-ribbon-wing {
            height: 36px !important;
            width: 44px !important;
            display: block !important;
          }
          .certificate-page .cert-wing-left {
            margin-right: -24px !important;
          }
          .certificate-page .cert-wing-right {
            margin-left: -24px !important;
          }
          .certificate-page .cert-ribbon-pill {
            height: 36px !important;
            padding: 0 32px !important;
            background-color: #ffffff !important;
            border: 2.5px solid #0a5c36 !important;
            border-radius: 9999px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
            z-index: 10 !important;
            box-shadow: none !important;
          }
          .certificate-page .cert-ribbon-text {
            font-size: 12.5pt !important;
            font-weight: 800 !important;
          }
          .certificate-page .cert-footer {
            margin-top: auto !important;
            padding-top: 0 !important;
            margin-bottom: 5mm !important;
          }
          .certificate-page .cert-footer-grid {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 10mm !important;
            align-items: flex-end !important;
          }
          .certificate-page .cert-sig-spacer {
            height: 18px !important;
          }
          .certificate-page .cert-sig-role {
            font-size: 11.5pt !important;
            font-weight: 700 !important;
            line-height: 1.15 !important;
          }
          .certificate-page .cert-sig-box {
            height: 22mm !important;
          }
          .certificate-page .cert-sig-name {
            font-size: 12pt !important;
            font-weight: 800 !important;
            min-width: 175px !important;
            border-bottom: 2px solid rgba(15, 23, 42, 0.8) !important;
            padding-bottom: 2px !important;
          }
          .certificate-page .cert-sig-nik {
            font-size: 11.5pt !important;
            font-weight: 600 !important;
            margin-top: 2px !important;
          }
          .certificate-page .cert-date-text {
            font-size: 11.5pt !important;
            font-weight: 700 !important;
            margin-bottom: 3px !important;
          }
        }
      `}</style>

      {/* TOP CONTROL BAR (HIDDEN IN PRINT) */}
      <header className="no-print bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Kembali"
              id="btn-close-cert-printer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                Cetak Piagam / Sertifikat Tasmi' Tahfidz
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  A4 Landscape
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Musyrif: {currentMusyrif.nama} &bull; {myStudents.length} Santri Binaan
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showCustomizer
                ? "bg-slate-800 text-white border-slate-700"
                : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white"
            }`}
            id="btn-toggle-customizer"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kustomisasi Sertifikat</span>
          </button>

          <button
            onClick={handleTriggerPrint}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-2 transition-all cursor-pointer"
            id="btn-print-certificate-top"
          >
            <Printer className="w-4 h-4" />
            <span>
              {printMode === "single"
                ? "Cetak Dokumen Sekarang (A4)"
                : `Cetak Dokumen Sekarang (${batchStudents.length} Santri A4)`}
            </span>
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE (SPLIT VIEW IN SCREEN MODE) */}
      <div className="no-print flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* SIDEBAR SELECTOR & CUSTOMIZER (HIDDEN IN PRINT) */}
        <aside className="no-print w-full lg:w-96 bg-white border-r border-slate-200 p-4 sm:p-5 overflow-y-auto space-y-5 shadow-md">
          {/* Mode Switcher: Single vs Batch */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Mode Pencetakan
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setPrintMode("single")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  printMode === "single"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id="btn-mode-single"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" /> Per Santri
              </button>
              <button
                onClick={() => setPrintMode("batch")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  printMode === "batch"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id="btn-mode-batch"
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" /> Cetak Massal
              </button>
            </div>
          </div>

          {/* Student Selector List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {printMode === "single" ? "Pilih Santri Binaan" : "Pilih Santri (Massal)"}
              </label>
              {printMode === "batch" && (
                <button
                  onClick={handleSelectAllBatch}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  id="btn-batch-select-all"
                >
                  {selectedBatchIds.length === filteredMyStudents.length ? "Hapus Semua" : "Pilih Semua"}
                </button>
              )}
            </div>

            {/* Quick Search */}
            <input
              type="text"
              placeholder="Cari nama santri atau kelas..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              id="input-cert-search"
            />

            {/* Student List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {filteredMyStudents.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center italic">
                  Santri tidak ditemukan
                </p>
              ) : (
                filteredMyStudents.map((s) => {
                  const isSelected =
                    printMode === "single"
                      ? s.id === selectedStudentId
                      : selectedBatchIds.includes(s.id);

                  return (
                    <div
                      key={s.id}
                      onClick={() =>
                        printMode === "single"
                          ? handleSelectStudent(s)
                          : handleToggleBatchStudent(s.id)
                      }
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                      id={`student-item-${s.id}`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {printMode === "batch" ? (
                          isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )
                        ) : isSelected ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="truncate">{s.nama}</p>
                          <p className="text-[10px] text-slate-500 font-normal">
                            Kelas {s.kelasId} &bull; NIS {s.noInduk}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold shrink-0">
                        {s.kelasId}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Form Settings / Customizer Panel */}
          <div className="pt-3 border-t border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Data Materi Piagam
              </span>
            </div>

            <div className="space-y-3">
              {/* Materi Tasmi */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Materi Tasmi' :
                </label>
                <input
                  type="text"
                  value={materiTasmi}
                  onChange={(e) => setMateriTasmi(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Juz 30, 29, 28 & Al Baqarah 1-76"
                  id="input-cert-tasmi"
                />
              </div>

              {/* Waktu Tasmi */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Waktu Tasmi' :
                </label>
                <input
                  type="text"
                  value={waktuTasmi}
                  onChange={(e) => setWaktuTasmi(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Senin, 03 Juni 2024 ( 07.50 - 10.10 )"
                  id="input-cert-waktu"
                />
              </div>

              {/* Predikat & Jumlah Hafalan in Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Predikat :
                  </label>
                  <select
                    value={predikat}
                    onChange={(e) => setPredikat(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-emerald-800 bg-white focus:ring-2 focus:ring-emerald-500"
                    id="select-cert-predikat"
                  >
                    <option value="Mumtaz">Mumtaz (Istimewa)</option>
                    <option value="Jayyid Jiddan">Jayyid Jiddan (Sangat Baik)</option>
                    <option value="Jayyid">Jayyid (Baik)</option>
                    <option value="Maqbul">Maqbul (Cukup)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Jumlah Hafalan :
                  </label>
                  <input
                    type="text"
                    value={jumlahHafalan}
                    onChange={(e) => setJumlahHafalan(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: 7 Juz"
                    id="input-cert-hafalan"
                  />
                </div>
              </div>

              {/* Tanggal Cetak Otomatis (Tengah) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Tanggal Cetak (Otomatis) :
                  </label>
                  <button
                    type="button"
                    onClick={() => setTanggalSurat(formatTanggalCetakOtomatis())}
                    className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold underline cursor-pointer"
                  >
                    Set Hari Ini
                  </button>
                </div>
                <input
                  type="text"
                  value={tanggalSurat}
                  onChange={(e) => setTanggalSurat(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Surakarta, 16 September 2026"
                  id="input-cert-tanggal"
                />
              </div>

              {/* Collapsible: Pejabat & Penandatangan */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCustomizer(!showCustomizer)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 hover:text-emerald-700 py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Penandatangan Piagam (3 Kolom)
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {showCustomizer ? "Sembunyikan" : "Sesuaikan"}
                  </span>
                </button>

                {showCustomizer && (
                  <div className="mt-2 space-y-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px]">
                    {/* Waka Keagamaan */}
                    <div>
                      <span className="font-bold text-slate-700 block">Waka Bidang Keagamaan:</span>
                      <input
                        type="text"
                        value={wakaNama}
                        onChange={(e) => setWakaNama(e.target.value)}
                        className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium"
                        placeholder="Nama Waka"
                      />
                      <input
                        type="text"
                        value={wakaNik}
                        onChange={(e) => setWakaNik(e.target.value)}
                        className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-600"
                        placeholder="NIK Waka"
                      />
                    </div>

                    {/* Penanggungjawab Tahfidz */}
                    <div>
                      <span className="font-bold text-slate-700 block">Penanggungjawab Tahfidz:</span>
                      <input
                        type="text"
                        value={pjNama}
                        onChange={(e) => setPjNama(e.target.value)}
                        className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium"
                        placeholder="Nama PJ Tahfidz"
                      />
                      <input
                        type="text"
                        value={pjNik}
                        onChange={(e) => setPjNik(e.target.value)}
                        className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-600"
                        placeholder="NIK PJ Tahfidz"
                      />
                    </div>

                    {/* Custom Musyrif Name/NIK Override if needed */}
                    <div>
                      <span className="font-bold text-slate-700 block">Nama Musyrif (Opsional Override):</span>
                      <input
                        type="text"
                        value={customMusyrifNama}
                        onChange={(e) => setCustomMusyrifNama(e.target.value)}
                        className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium"
                        placeholder="Default otomatis sesuai data musyrif"
                      />
                      <input
                        type="text"
                        value={customMusyrifNik}
                        onChange={(e) => setCustomMusyrifNik(e.target.value)}
                        className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-600"
                        placeholder="NIK Musyrif"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PREVIEW CANVAS AREA */}
        <main className="no-print flex-1 bg-slate-800/90 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-start min-h-[calc(100vh-60px)]">
          {/* Certificate Preview Card */}
          <div className="w-full max-w-5xl space-y-4">
            {/* Action Header on Top of Canvas */}
            <div className="no-print flex items-center justify-between text-white text-xs px-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Pratinjau Piagam (Sesuai Aslinya)
                </span>
                {printMode === "batch" && (
                  <span className="text-slate-400">
                    &bull; Menampilkan 1 dari {batchStudents.length} santri terpilih
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerPrint}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-all cursor-pointer text-xs"
                  id="btn-print-action-preview"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen Sekarang (A4)</span>
                </button>
              </div>
            </div>

            {/* LIVE SCREEN PREVIEW */}
            <div className="no-print rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-white">
              {activeStudent ? (
                <CertificateDocument data={buildCertData(activeStudent)} />
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-500" />
                  <p className="font-bold text-sm">Tidak ada santri yang dipilih.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ================= PRINT-ONLY ENGINE ================= */}
      {/* This section renders exclusively when window.print() is executed */}
      <div className="certificate-print-wrapper hidden print:block">
        {printMode === "single" ? (
          activeStudent ? (
            <div className="certificate-print-page">
              <CertificateDocument data={buildCertData(activeStudent)} />
            </div>
          ) : null
        ) : (
          batchStudents.map((student, idx) => (
            <div
              key={student.id}
              className={`certificate-print-page ${idx < batchStudents.length - 1 ? "print-page-break" : ""}`}
            >
              <CertificateDocument data={buildCertData(student)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
