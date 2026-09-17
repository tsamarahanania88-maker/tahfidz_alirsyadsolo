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
import headerRightLogo from "../assets/images/Untitled design.png";

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

// Single Certificate Document View - Strictly Calibrated to A4 Landscape (297mm x 210mm)
const CertificateDocument: React.FC<{ data: CertificateData }> = ({ data }) => {
  return (
    <div
      className="certificate-page relative text-slate-800 overflow-hidden select-none box-border"
      style={{
        width: "297mm",
        height: "210mm",
        minWidth: "297mm",
        maxWidth: "297mm",
        minHeight: "210mm",
        maxHeight: "210mm",
        backgroundColor: "#fbfaf5",
        boxSizing: "border-box",
        position: "relative",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Background Subtle Paper Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(#d6cdb7 0.75px, transparent 0.75px), radial-gradient(#d6cdb7 0.75px, #fbfaf5 0.75px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />

      {/* FADED CENTER WATERMARK FROM OFFICIAL AL-IRSYAD LOGO */}
      <div className="cert-watermark absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.075] select-none">
        <img
          src="/al_irsyad_official_logo.png"
          alt="Watermark Al-Irsyad Al-Islamiyyah"
          style={{
            width: "135mm",
            maxHeight: "135mm",
            objectFit: "contain",
            filter: "contrast(120%)",
          }}
          onError={(e) => {
            e.currentTarget.src = "https://www.alirsyad.or.id/wp-content/uploads/download/alirsyad-alislamiyyah.png";
          }}
        />
      </div>

      {/* ================= CORNER GEOMETRIC SASHES ================= */}
      {/* 1. TOP-RIGHT CORNER ACCENT */}
      <div
        className="cert-corner-tr absolute top-0 right-0 pointer-events-none z-0 opacity-45"
        style={{ width: "42mm", height: "24mm" }}
      >
        <svg viewBox="0 0 160 90" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="certGoldCornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#b4831f" />
            </linearGradient>
          </defs>
          <path d="M 60 0 L 160 0 L 160 60 Z" fill="url(#certGoldCornerGrad)" opacity="0.5" />
          <path d="M 40 0 L 160 90" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* 2. BOTTOM-LEFT CORNER SASH */}
      <div
        className="cert-corner-bl absolute bottom-0 left-0 pointer-events-none z-10"
        style={{ width: "125mm", height: "76mm" }}
      >
        <svg viewBox="0 0 280 140" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="certGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
            <linearGradient id="certGreenGradBottom" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0a5c36" />
              <stop offset="60%" stopColor="#074426" />
              <stop offset="100%" stopColor="#042e1a" />
            </linearGradient>
          </defs>

          {/* Under Gold Sash Stripe */}
          <path d="M 0 140 L 280 140 C 180 120 100 70 0 0 Z" fill="url(#certGoldGrad)" opacity="0.9" />

          {/* Main Dark Green Swoosh */}
          <path d="M 0 140 L 268 140 C 172 120 92 70 0 10 Z" fill="url(#certGreenGradBottom)" />

          {/* Gold highlight pinstripe */}
          <path d="M 0 10 C 92 70 172 120 268 140" stroke="#FDE047" strokeWidth="1.75" fill="none" opacity="0.8" />
        </svg>
      </div>

      {/* ================= DOUBLE INNER BORDER FRAME ================= */}
      <div
        className="cert-border-outer absolute pointer-events-none rounded-[2px]"
        style={{
          top: "7.5mm",
          left: "7.5mm",
          right: "7.5mm",
          bottom: "7.5mm",
          border: "1.75px solid #bda466",
        }}
      />
      <div
        className="cert-border-inner absolute pointer-events-none rounded-[1px]"
        style={{
          top: "9.5mm",
          left: "9.5mm",
          right: "9.5mm",
          bottom: "9.5mm",
          border: "0.85px solid #d8c593",
        }}
      />

      {/* ================= MAIN CERTIFICATE CONTENT CONTAINER ================= */}
      <div
        className="cert-content-container relative z-10 w-full h-full flex flex-col justify-between box-border"
        style={{
          padding: "13mm 16mm 12mm 16mm",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER SECTION */}
        <div className="flex items-start justify-between gap-4">
          {/* Top-Left: Official Al-Irsyad School Identity */}
          <div className="flex items-center gap-3.5 max-w-[58%]">
            {/* Official Al-Irsyad Winged Emblem Logo */}
            <img
              src="/al_irsyad_official_logo.png"
              alt="Logo Al-Irsyad Surakarta"
              style={{
                width: "18.5mm",
                height: "18.5mm",
                objectFit: "contain",
                flexShrink: 0,
              }}
              onError={(e) => {
                e.currentTarget.src = "https://www.alirsyad.or.id/wp-content/uploads/download/alirsyad-alislamiyyah.png";
              }}
            />

            <div className="flex flex-col">
              <h2
                className="cert-school-h2 font-black text-[#0a5c36] uppercase tracking-wide leading-none"
                style={{ fontSize: "16pt", letterSpacing: "0.04em" }}
              >
                SMP AL-IRSYAD
              </h2>
              <h3
                className="cert-school-h3 font-extrabold text-[#0a5c36] uppercase leading-tight mt-0.5"
                style={{ fontSize: "12pt", letterSpacing: "0.26em" }}
              >
                SURAKARTA
              </h3>
              <div className="cert-school-line w-full h-[1px] bg-[#0a5c36]/40 my-1" />
              <p
                className="cert-school-addr font-semibold text-slate-600 tracking-tight leading-tight uppercase"
                style={{ fontSize: "7.2pt" }}
              >
                JL. KAPTEN MULYADI NO.117 TELP. (0271) 647730 SURAKARTA 57113
              </p>
            </div>
          </div>

          {/* Top-Right: Official Program Identity (SMPQU SMP QUR'AN + ZIYADAH TAHFIDZ EXCELLENCE PROGRAM) */}
          <div className="flex items-center justify-end shrink-0">
            <img
              src={headerRightLogo}
              alt="SMPQU SMP Qur'an - Ziyadah Tahfidz Excellence Program"
              style={{
                height: "16.5mm",
                width: "auto",
                maxWidth: "92mm",
                objectFit: "contain",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
              }}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("Untitled%20design.png") && !target.src.endsWith("/Untitled design.png")) {
                  target.src = "/Untitled design.png";
                } else if (!target.src.endsWith("/logo_kanan.png")) {
                  target.src = "/logo_kanan.png";
                }
              }}
            />
          </div>
        </div>

        {/* CENTER BODY SECTION: TITLE & RECIPIENT */}
        <div className="flex flex-col items-center text-center my-auto px-6 space-y-1">
          {/* Main Title: "Piagam Penghargaan" in Gothic/Fraktur style */}
          <h1
            className="cert-title font-normal text-[#0a5c36] tracking-wide leading-none select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
            style={{
              fontFamily: "'UnifrakturMaguntia', 'Cinzel Decorative', Georgia, serif",
              fontSize: "42pt",
              lineHeight: "1.05",
              marginTop: "0.5mm",
              marginBottom: "1mm",
            }}
          >
            Piagam Penghargaan
          </h1>

          {/* Subtitle */}
          <p
            className="cert-subtitle text-slate-700 font-medium tracking-wide"
            style={{ fontSize: "11.5pt", marginBottom: "0.5mm" }}
          >
            Barakallah atas hafalannya ananda :
          </p>

          {/* Student Name */}
          <div className="w-full max-w-xl py-0.5">
            <h2
              className="cert-student-name font-extrabold text-slate-900 tracking-tight uppercase leading-tight font-sans"
              style={{ fontSize: "21pt", letterSpacing: "0.02em" }}
            >
              {data.namaSiswa || "Nama Santri"}
            </h2>
            {/* Elegant Name Underline with Center Diamond */}
            <div
              className="cert-student-underline relative flex items-center justify-center mx-auto"
              style={{ width: "80mm", marginTop: "2mm" }}
            >
              <div className="w-full h-[1.5px] bg-slate-800" />
              <div className="absolute w-2 h-2 bg-[#0a5c36] rotate-45 border border-white" />
            </div>
          </div>

          {/* Student Class & Tasmi Details */}
          <div
            className="cert-details space-y-0.5 text-slate-800 font-medium leading-snug"
            style={{ fontSize: "11pt", marginTop: "1.5mm" }}
          >
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
          <div className="cert-ribbon-wrapper" style={{ paddingTop: "2.5mm" }}>
            <div className="inline-flex items-center relative">
              {/* Left Ribbon End Notch */}
              <div
                className="cert-notch-left bg-[#0a5c36] relative flex items-center -mr-1 rounded-l-sm"
                style={{ width: "5mm", height: "8.5mm" }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#fbfaf5]"
                  style={{ clipPath: "polygon(0 0, 0 100%, 100% 50%)" }}
                />
              </div>

              {/* Center Pill */}
              <div
                className="cert-ribbon-pill bg-white border-2 border-[#0a5c36] rounded-full shadow-sm flex items-center gap-4 z-10"
                style={{ padding: "1.5mm 8mm" }}
              >
                <span
                  className="cert-ribbon-text font-extrabold text-[#0a5c36] tracking-wide whitespace-nowrap"
                  style={{ fontSize: "11pt" }}
                >
                  Predikat : <span className="text-slate-900">{data.predikat}</span>
                </span>
                <span className="text-[#0a5c36] font-bold" style={{ fontSize: "12pt" }}>|</span>
                <span
                  className="cert-ribbon-text font-extrabold text-[#0a5c36] tracking-wide whitespace-nowrap"
                  style={{ fontSize: "11pt" }}
                >
                  Jumlah hafalan : <span className="text-slate-900">{data.jumlahHafalan}</span>
                </span>
              </div>

              {/* Right Ribbon End Notch */}
              <div
                className="cert-notch-right bg-[#0a5c36] relative flex items-center -ml-1 rounded-r-sm"
                style={{ width: "5mm", height: "8.5mm" }}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 w-2.5 bg-[#fbfaf5]"
                  style={{ clipPath: "polygon(100% 0, 100% 100%, 0 50%)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER: 3 SIGNATURE COLUMNS (LEFT: MUSYRIF, CENTER: DATE & WAKA, RIGHT: PENANGGUNGJAWAB TAHFIDZ) */}
        <div className="cert-footer mt-auto" style={{ paddingTop: "2mm" }}>
          <div className="cert-footer-grid grid grid-cols-3 gap-4 items-end text-center">
            {/* 1. BAGIAN KIRI: MUSYRIF */}
            <div className="flex flex-col items-center">
              {/* Spacer matching the date row in the center */}
              <div className="cert-sig-spacer" style={{ height: "4.5mm" }} />

              <p className="cert-sig-role font-bold text-slate-800 leading-tight" style={{ fontSize: "10.5pt" }}>
                {data.musyrif.jabatan}
              </p>

              {/* Ruang Tanda Tangan */}
              <div className="cert-sig-box flex items-center justify-center relative w-full" style={{ height: "16mm" }} />

              <p
                className="cert-sig-name font-extrabold text-slate-900 leading-tight border-b border-slate-900/60 pb-0.5 px-2"
                style={{ fontSize: "11pt", minWidth: "40mm", display: "inline-block" }}
              >
                {data.musyrif.nama}
              </p>
              {data.musyrif.nik ? (
                <p className="cert-sig-nik font-semibold text-slate-700 mt-0.5" style={{ fontSize: "9pt" }}>
                  {data.musyrif.nik}
                </p>
              ) : (
                <p className="cert-sig-nik font-semibold text-slate-500 mt-0.5" style={{ fontSize: "9pt" }}>
                  Pembina Tahfidz
                </p>
              )}
            </div>

            {/* 2. BAGIAN TENGAH: OTOMATIS TANGGAL CETAK KEMUDIAN WAKA BIDANG KEAGAMAAN */}
            <div className="flex flex-col items-center relative">
              {/* Otomatis Tanggal Cetak */}
              <div
                className="cert-date-text text-center font-semibold text-slate-800 leading-tight flex items-center justify-center"
                style={{ fontSize: "10.5pt", height: "4.5mm" }}
              >
                {data.tanggalSurat}
              </div>

              {/* Jabatan Waka Bidang Keagamaan */}
              <p className="cert-sig-role font-bold text-slate-800 leading-tight" style={{ fontSize: "10.5pt" }}>
                {data.wakaKeagamaan.jabatan}
              </p>

              {/* Ruang Tanda Tangan & Cap Stempel Resmi */}
              <div className="cert-sig-box flex items-center justify-center relative w-full" style={{ height: "16mm" }} />

              <p
                className="cert-sig-name font-extrabold text-slate-900 leading-tight border-b border-slate-900/60 pb-0.5 px-2"
                style={{ fontSize: "11pt", minWidth: "40mm", display: "inline-block" }}
              >
                {data.wakaKeagamaan.nama}
              </p>
              <p className="cert-sig-nik font-semibold text-slate-700 mt-0.5" style={{ fontSize: "9pt" }}>
                {data.wakaKeagamaan.nik}
              </p>
            </div>

            {/* 3. KOLOM KANAN: PENANGGUNGJAWAB TAHFIDZ */}
            <div className="flex flex-col items-center">
              {/* Spacer matching the date row in the center */}
              <div className="cert-sig-spacer" style={{ height: "4.5mm" }} />

              <p className="cert-sig-role font-bold text-slate-800 leading-tight" style={{ fontSize: "10.5pt" }}>
                {data.penanggungjawabTahfidz.jabatan}
              </p>

              {/* Ruang Tanda Tangan */}
              <div className="cert-sig-box flex items-center justify-center relative w-full" style={{ height: "16mm" }} />

              <p
                className="cert-sig-name font-extrabold text-slate-900 leading-tight border-b border-slate-900/60 pb-0.5 px-2"
                style={{ fontSize: "11pt", minWidth: "40mm", display: "inline-block" }}
              >
                {data.penanggungjawabTahfidz.nama}
              </p>
              <p className="cert-sig-nik font-semibold text-slate-700 mt-0.5" style={{ fontSize: "9pt" }}>
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

  // Zoom mode and dynamic container width for 1:1 pixel-perfect WYSIWYG preview
  const [zoomMode, setZoomMode] = useState<"fit" | "100" | "75" | "50">("fit");
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!previewContainerRef.current) return;
    const updateWidth = () => {
      if (previewContainerRef.current) {
        setContainerWidth(previewContainerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // 297mm x 210mm at 96 DPI: ~1122.52px x 793.7px
  const A4_WIDTH_PX = 1122.52;
  const A4_HEIGHT_PX = 793.7;

  let computedScale = 1;
  if (zoomMode === "fit") {
    computedScale = containerWidth > 0 ? Math.min((containerWidth - 32) / A4_WIDTH_PX, 1) : 0.85;
    if (computedScale < 0.25) computedScale = 0.25;
  } else if (zoomMode === "100") {
    computedScale = 1;
  } else if (zoomMode === "75") {
    computedScale = 0.75;
  } else if (zoomMode === "50") {
    computedScale = 0.5;
  }

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

    const finalMusyrifNama = assignedMusyrif?.nama || currentMusyrif?.nama || "Musyrif Tahfidz";
    const finalMusyrifNik = assignedMusyrif?.nik
      ? `NIK. ${assignedMusyrif.nik}`
      : (currentMusyrif?.nik ? `NIK. ${currentMusyrif.nik}` : "");

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
        nama: finalMusyrifNama,
        nik: finalMusyrifNik,
      },
      wakaKeagamaan: {
        jabatan: "Waka Bidang Keagamaan",
        nama: "Yusuf Arifin, S.Pd",
        nik: "NIK. 103.244.00172",
      },
      penanggungjawabTahfidz: {
        jabatan: "Penanggungjawab Tahfidz",
        nama: "Muhammat Imam Syafi'i, S.Pd.",
        nik: "NIK. 103.244.00205",
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
          size: 297mm 210mm landscape;
          margin: 0;
        }
        @media print {
          html, body {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
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
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
          }
          .certificate-print-page {
            width: 297mm !important;
            height: 209.6mm !important;
            min-height: 209.6mm !important;
            max-height: 209.6mm !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always !important;
            break-after: page !important;
            margin: 0 !important;
            padding: 0 !important;
            position: relative !important;
            background-color: #fbfaf5 !important;
          }
          .certificate-print-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .certificate-page {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            width: 297mm !important;
            height: 209.6mm !important;
            max-height: 209.6mm !important;
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
            </div>
          </div>
        </aside>

        {/* MAIN PREVIEW CANVAS AREA */}
        <main className="no-print flex-1 bg-slate-900/95 overflow-y-auto p-3 sm:p-5 md:p-6 flex flex-col items-center justify-start min-h-[calc(100vh-60px)]">
          {/* Certificate Preview Card */}
          <div className="w-full max-w-6xl space-y-4">
            {/* Action Header on Top of Canvas */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 text-white text-xs bg-slate-800/90 backdrop-blur-sm border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" /> Pratinjau Piagam (Sesuai 100% Hasil Cetak)
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-600">
                  A4 Landscape (297 × 210 mm) • Skala {Math.round(computedScale * 100)}%
                </span>
                {printMode === "batch" && (
                  <span className="text-slate-400 text-xs">
                    &bull; 1 dari {batchStudents.length} santri terpilih
                  </span>
                )}
              </div>

              {/* Zoom & Print Controls */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-700">
                  <button
                    onClick={() => setZoomMode("fit")}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                      zoomMode === "fit" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
                    }`}
                    title="Sesuaikan ukuran tampilan dengan lebar layar"
                  >
                    Fit
                  </button>
                  <button
                    onClick={() => setZoomMode("100")}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                      zoomMode === "100" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
                    }`}
                    title="Ukuran fisik 100% A4 asli (297 × 210 mm)"
                  >
                    100%
                  </button>
                  <button
                    onClick={() => setZoomMode("75")}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                      zoomMode === "75" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
                    }`}
                    title="Ukuran 75%"
                  >
                    75%
                  </button>
                  <button
                    onClick={() => setZoomMode("50")}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                      zoomMode === "50" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
                    }`}
                    title="Ukuran 50%"
                  >
                    50%
                  </button>
                </div>

                <button
                  onClick={handleTriggerPrint}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-all cursor-pointer text-xs"
                  id="btn-print-action-preview"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Piagam (A4)</span>
                </button>
              </div>
            </div>

            {/* LIVE SCREEN PREVIEW VIEWPORT WITH DYNAMIC SCALING */}
            <div
              ref={previewContainerRef}
              className="no-print w-full flex justify-center items-start overflow-x-auto p-4 bg-slate-950/50 rounded-2xl border border-slate-800 shadow-inner"
            >
              {activeStudent ? (
                <div
                  className="shadow-2xl transition-transform duration-150 ease-out origin-top border border-slate-700/60 rounded-xs overflow-hidden"
                  style={{
                    width: "297mm",
                    height: "210mm",
                    transform: `scale(${computedScale})`,
                    transformOrigin: "top center",
                    marginBottom: `${-(793.7 * (1 - computedScale))}px`,
                  }}
                >
                  <CertificateDocument data={buildCertData(activeStudent)} />
                </div>
              ) : (
                <div className="p-16 text-center text-slate-400">
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
