/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Student, Class, Musyrif, Capaian } from "../types";
import { Printer, ArrowLeft, CheckCircle2, BookOpen } from "lucide-react";

import logoImg from "../assets/images/al_irsyad_logo_hd_1784773161816.jpg";
import rightBannerImg from "../assets/images/header_right_banner_1784774190288.jpg";
import headerRightLogo from "../assets/images/header_right_logo.png";

// Islamic Geometric Pattern Watermark for Tahfidz Header
const IslamicGeometricBg = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern id="islamic-geom-star" width="48" height="48" patternUnits="userSpaceOnUse">
        <g stroke="#FDE047" strokeWidth="0.85" fill="none">
          {/* Islamic 8-Point Star Interlacing */}
          <path d="M24,4 L30,14 L41,14 L33,22 L36,34 L24,27 L12,34 L15,22 L7,14 L18,14 Z" />
          <circle cx="24" cy="24" r="9" strokeDasharray="2 2" strokeOpacity="0.7" />
          <rect x="12" y="12" width="24" height="24" transform="rotate(45 24 24)" strokeOpacity="0.5" />
          <path d="M0,0 L48,48 M48,0 L0,48" strokeOpacity="0.25" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-geom-star)" />
  </svg>
);

// Traditional Islamic Manuscript Corner Flourish
const IslamicCornerFlourish = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 60 60"
    className={`w-12 h-12 sm:w-16 sm:h-16 text-yellow-300 pointer-events-none ${className}`}
    fill="none"
    stroke="currentColor"
  >
    <path d="M3,3 L36,3 Q16,3 16,22 L16,46" strokeWidth="1.75" />
    <path d="M8,8 L44,8 Q22,8 22,28 L22,52" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />
    <circle cx="4" cy="4" r="3" fill="currentColor" />
    <circle cx="16" cy="16" r="2" fill="currentColor" fillOpacity="0.6" />
    <path d="M12,3 Q12,12 3,12" strokeWidth="1.5" />
  </svg>
);

// 8-Pointed Quranic Star (Rub el Hizb) Marker
const RubElHizbIcon = ({ className = "w-4 h-4 text-yellow-300" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0 inline-block`} fill="currentColor">
    <path d="M12 1.5l2.6 3.6 4.4-.7-1.1 4.4 3.7 2.7-3.7 2.7 1.1 4.4-4.4-.7L12 22.5l-2.6-3.6-4.4.7 1.1-4.4-3.7-2.7 3.7-2.7-1.1-4.4 4.4.7L12 1.5z" />
    <circle cx="12" cy="12" r="3.2" fill="#173E7C" />
    <circle cx="12" cy="12" r="1.5" fill="#FDE047" />
  </svg>
);

interface ReportPrinterProps {
  students: Student[];
  classes: Class[];
  musyrifs: Musyrif[];
  capaians: Capaian[];
  selectedClassId?: string;
  selectedLevel?: string; // "7", "8", "9"
  selectedMusyrifId?: string;
  selectedBulan: string;
  onClose: () => void;
}

// Official Al-Irsyad Al-Islamiyyah Logo
const LOGO_URL = "https://www.alirsyad.or.id/wp-content/uploads/download/alirsyad-alislamiyyah.png";

const HeaderEmblemLogo = ({ sizeVariant = "normal" }: { sizeVariant?: "normal" | "compact" | "super" | "ultra" }) => {
  const heightClass =
    sizeVariant === "ultra"
      ? "h-6 sm:h-7"
      : sizeVariant === "super"
      ? "h-7 sm:h-8"
      : sizeVariant === "compact"
      ? "h-8 sm:h-9"
      : "h-10 sm:h-12";

  return (
    <div className="flex items-center shrink-0">
      <img
        src={LOGO_URL}
        alt="Al-Irsyad Al-Islamiyyah"
        className={`${heightClass} w-auto object-contain transition-all drop-shadow-sm`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== logoImg) {
            target.src = logoImg;
          }
        }}
      />
    </div>
  );
};

const RightHeaderLogos = ({ sizeVariant = "normal" }: { sizeVariant?: "normal" | "compact" | "super" | "ultra" }) => {
  const heightClass =
    sizeVariant === "ultra"
      ? "h-6 sm:h-7 max-w-[130px]"
      : sizeVariant === "super"
      ? "h-7 sm:h-8 max-w-[160px]"
      : sizeVariant === "compact"
      ? "h-8 sm:h-9 max-w-[190px]"
      : "h-9 sm:h-10 md:h-11 max-w-[210px] sm:max-w-[250px]";

  return (
    <div className="flex items-center shrink-0">
      <img
        src={headerRightLogo}
        alt="Sekolah Mengedepankan Akhlak - SMQU SMP Qur'an"
        className={`${heightClass} w-auto object-contain transition-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== "/Story Ig PART 4_20260915_195906_0000.png") {
            target.src = "/Story Ig PART 4_20260915_195906_0000.png";
          } else if (target.src !== rightBannerImg) {
            target.src = rightBannerImg;
          }
        }}
      />
    </div>
  );
};

export default function ReportPrinter({
  students,
  classes,
  musyrifs,
  capaians,
  selectedClassId,
  selectedLevel,
  selectedMusyrifId,
  selectedBulan,
  onClose,
}: ReportPrinterProps) {
  // Filter students based on selection
  let filteredStudents = [...students];

  if (selectedClassId) {
    filteredStudents = filteredStudents.filter((s) => s.kelasId === selectedClassId);
  } else if (selectedLevel) {
    filteredStudents = filteredStudents.filter((s) => s.kelasId.startsWith(selectedLevel));
  }

  if (selectedMusyrifId) {
    filteredStudents = filteredStudents.filter((s) => s.musyrifId === selectedMusyrifId);
  }

  // Helper to extract numeric/main grade level from kelasId (e.g., "7A" -> "7", "8B" -> "8")
  const getGradeLevel = (kelasId: string) => {
    const match = kelasId.match(/(\d+)/);
    return match ? match[1] : kelasId;
  };

  // Group students by grade level (to consolidate e.g. 7A and 7B into Class 7 for a single halaqah)
  const studentsByClass: { [classId: string]: Student[] } = {};
  filteredStudents.forEach((student) => {
    const gradeLevel = getGradeLevel(student.kelasId);
    if (!studentsByClass[gradeLevel]) {
      studentsByClass[gradeLevel] = [];
    }
    studentsByClass[gradeLevel].push(student);
  });

  // Sort students within each group by class (so 7A is listed before 7B) and then by name
  Object.keys(studentsByClass).forEach((gradeLevel) => {
    studentsByClass[gradeLevel].sort((a, b) => {
      const classComp = a.kelasId.localeCompare(b.kelasId);
      if (classComp !== 0) return classComp;
      return a.nama.localeCompare(b.nama);
    });
  });

  const sortedClassIds = Object.keys(studentsByClass).sort();

  // Helper formatting functions
  const getIndonesianMonthUpper = (monthStr: string) => {
    if (!monthStr) return "APRIL";
    const [year, month] = monthStr.split("-");
    const months = [
      "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
      "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return months[monthIndex] || "APRIL";
  };

  const getFullMonthYearString = (monthStr: string) => {
    if (!monthStr) return "APRIL 2026";
    const [year, month] = monthStr.split("-");
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${months[monthIndex] || "April"} ${year}`;
  };

  const getTahunAjaran = (monthStr: string) => {
    if (!monthStr) return "2025/2026";
    const [yearStr, monthStrPart] = monthStr.split("-");
    const yr = parseInt(yearStr, 10);
    const mo = parseInt(monthStrPart, 10);
    if (isNaN(yr) || isNaN(mo)) return "2025/2026";
    if (mo >= 7) {
      return `${yr}/${yr + 1}`;
    } else {
      return `${yr - 1}/${yr}`;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to get achievement for a student
  const getCapaianForStudent = (studentId: string) => {
    return capaians.find((c) => c.studentId === studentId && c.bulan === selectedBulan);
  };

  // Helper to compute display text for Capaian column
  const formatCapaianText = (capaian?: Capaian) => {
    if (!capaian) return "-";
    if (capaian.capaianAkhir && capaian.capaianAwal && capaian.capaianAkhir !== capaian.capaianAwal) {
      return `${capaian.capaianAkhir}`;
    }
    return capaian.capaianAkhir || capaian.capaianAwal || "-";
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:p-0 print:m-0 print:bg-white print:min-h-0">
      <style>{`
        @media print {
          @page {
            size: A4 portrait !important;
            margin: 0 !important;
          }
        }
      `}</style>
      {/* Control Panel */}
      <div className="max-w-[210mm] w-full mx-auto bg-white rounded-2xl shadow-md p-6 mb-8 border border-slate-200 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-medium transition-colors mb-2 text-sm"
              id="btn-back-print"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Panel
            </button>
            <h1 className="text-2xl font-bold text-slate-800">
              Pratinjau Cetak Laporan Capaian Tahfidz
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Periode: <span className="font-semibold text-brand-600">{getFullMonthYearString(selectedBulan)}</span>
              {selectedLevel && ` | Jenjang: Kelas ${selectedLevel}`}
              {selectedClassId && ` | Kelas: ${selectedClassId}`}
              {selectedMusyrifId && ` | Musyrif: ${musyrifs.find(m => m.id === selectedMusyrifId)?.nama}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#173E7C] to-[#21539E] hover:from-[#133368] hover:to-[#1B4380] text-yellow-300 font-bold rounded-xl shadow-md transition-all transform active:scale-95 text-sm"
              id="btn-trigger-print"
            >
              <Printer className="w-5 h-5 text-white" /> Cetak Laporan (PDF)
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm text-emerald-800">
            <p className="font-bold">Panduan Cetak Laporan SMP Al-Irsyad Surakarta:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
              <li>Desain telah disesuaikan persis dengan template resmi <strong>SMP Al-Irsyad Surakarta</strong>.</li>
              <li>Pilih opsi <strong>"Save as PDF"</strong> pada dialog printer.</li>
              <li>Pastikan mencentang <strong>"Background graphics"</strong> agar warna header biru gelap & baris berselang-seling tercetak sempurna.</li>
              <li>Gunakan orientasi kertas <strong>Portrait</strong> dengan ukuran kertas <strong>A4</strong>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Printable Sheet Wrapper */}
      <div className="max-w-[210mm] w-full mx-auto space-y-8 print:max-w-none print:w-full print:m-0 print:p-0 print:space-y-0">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            Tidak ada data siswa atau laporan capaian untuk kriteria yang dipilih.
          </div>
        ) : (
          // =================== REKAPITULASI KOLEKTIF VIEW ===================
          sortedClassIds.map((classId, classIdx) => {
            const classStudents = studentsByClass[classId] || [];
            const classMusyrifs = Array.from(new Set(classStudents.map((s) => s.musyrifNama).filter(Boolean)));
            
            // Selected musyrif object if specific filter active
            const selectedMusyrifObj = selectedMusyrifId ? musyrifs.find(m => m.id === selectedMusyrifId) : null;
            const musyrifSignName = selectedMusyrifObj
              ? selectedMusyrifObj.nama
              : classMusyrifs.length === 1 
              ? classMusyrifs[0] 
              : "PJ Tahfidz / Musyrif Halaqoh";

            const musyrifSignId = selectedMusyrifObj
              ? selectedMusyrifObj.id
              : classStudents[0]?.musyrifId || "";

            // Dynamic scaling depending on total number of students in list
            const studentCount = classStudents.length;
            const sizeVariant: "normal" | "compact" | "super" | "ultra" =
              studentCount > 24 ? "ultra" :
              studentCount > 18 ? "super" :
              studentCount > 13 ? "compact" : "normal";

            const headerPadding =
              sizeVariant === "ultra" ? "pt-1 pb-1 px-3" :
              sizeVariant === "super" ? "pt-2 pb-2 px-4" :
              sizeVariant === "compact" ? "pt-3 pb-3 px-5" :
              "pt-5 pb-5 px-6 sm:px-10";

            const logosRowMargin =
              sizeVariant === "ultra" ? "mb-0.5" :
              sizeVariant === "super" ? "mb-1" :
              sizeVariant === "compact" ? "mb-1.5" :
              "mb-3";

            const titleBlockMargin =
              sizeVariant === "ultra" ? "space-y-0 my-0.5" :
              sizeVariant === "super" ? "space-y-0 my-0.5" :
              sizeVariant === "compact" ? "space-y-0.5 my-1" :
              "space-y-1 my-1.5";

            const titleLaporanClass =
              sizeVariant === "ultra" ? "text-[9px] tracking-wider" :
              sizeVariant === "super" ? "text-[10px] tracking-wider" :
              sizeVariant === "compact" ? "text-xs tracking-widest" :
              "text-base sm:text-lg tracking-widest";

            const titleTahfidzClass =
              sizeVariant === "ultra" ? "text-xs sm:text-sm" :
              sizeVariant === "super" ? "text-sm sm:text-base" :
              sizeVariant === "compact" ? "text-base sm:text-lg" :
              "text-xl sm:text-2xl";

            const titleSmpClass =
              sizeVariant === "ultra" ? "text-xs sm:text-sm" :
              sizeVariant === "super" ? "text-sm sm:text-base" :
              sizeVariant === "compact" ? "text-base sm:text-lg" :
              "text-xl sm:text-2xl";

            const titleTahunClass =
              sizeVariant === "ultra" ? "text-[8px] pt-0" :
              sizeVariant === "super" ? "text-[9px] pt-0.5" :
              sizeVariant === "compact" ? "text-[10px] pt-1" :
              "text-xs sm:text-sm pt-1.5";

            const tableThClass =
              sizeVariant === "ultra" ? "py-0.5 px-1 text-[8px]" :
              sizeVariant === "super" ? "py-1 px-1.5 text-[9px]" :
              sizeVariant === "compact" ? "py-1.5 px-2 text-[10px]" :
              "py-3 px-3 text-xs";

            const tableTdClass =
              sizeVariant === "ultra" ? "py-0.5 px-1 text-[8px]" :
              sizeVariant === "super" ? "py-1 px-1.5 text-[9px]" :
              sizeVariant === "compact" ? "py-1.5 px-2 text-[10px]" :
              "py-2.5 px-3 text-xs";

            const tableTdNameClass =
              sizeVariant === "ultra" ? "py-0.5 px-1.5 text-[8.5px]" :
              sizeVariant === "super" ? "py-1 px-2 text-[9px]" :
              sizeVariant === "compact" ? "py-1.5 px-2.5 text-[10px]" :
              "py-2.5 px-3 text-xs";

            const isClass8 = String(classId).startsWith("8") || selectedLevel === "8";

            const containerPadding =
              isClass8 && studentCount <= 20 ? "pt-5 pb-3 px-6" :
              sizeVariant === "ultra" ? "pt-1 pb-1 px-3" :
              sizeVariant === "super" ? "pt-2 pb-1.5 px-4" :
              sizeVariant === "compact" ? "pt-3 pb-2 px-5" :
              "pt-4 pb-3 px-6";

            const signatureMarginTop =
              sizeVariant === "ultra" ? "mt-auto pt-1 mb-0 px-2 text-[8px]" :
              sizeVariant === "super" ? "mt-auto pt-1.5 mb-0 px-3 text-[9.5px]" :
              sizeVariant === "compact" ? "mt-auto pt-2.5 mb-0 px-4 text-[11px]" :
              "mt-auto pt-3.5 mb-0 px-6 text-xs";

            const signatureSpace =
              isClass8 && studentCount <= 20 ? "mb-12" :
              sizeVariant === "ultra" ? "mb-1.5" :
              sizeVariant === "super" ? "mb-3" :
              sizeVariant === "compact" ? "mb-5" :
              "mb-9";

            const footerBarPadding =
              sizeVariant === "ultra" ? "py-1.5" :
              sizeVariant === "super" ? "py-2" :
              sizeVariant === "compact" ? "py-2.5" :
              "py-3";

            return (
              <div
                key={classId}
                className="bg-white shadow-2xl rounded-none md:rounded-lg overflow-hidden border border-slate-300 p-0 text-slate-900 print-card relative print-page-break flex flex-col justify-between min-h-[297mm] h-[297mm]"
                style={{ height: "297mm", minHeight: "297mm" }}
              >
                {/* TOP HEADER BANNER (BRIGHTER ROYAL ISLAMIC BLUE WITH TAHFIDZ ORNAMENTS) */}
                <div className={`bg-gradient-to-r from-[#173E7C] via-[#21539E] to-[#173E7C] border-b-4 border-amber-400 text-white ${headerPadding} text-center relative overflow-hidden shrink-0 shadow-sm`}>
                  {/* Islamic Geometric Pattern Overlay */}
                  <IslamicGeometricBg />

                  {/* Corner Arabesque Flourishes */}
                  <IslamicCornerFlourish className="absolute -top-1 -left-1 opacity-45" />
                  <IslamicCornerFlourish className="absolute -top-1 -right-1 opacity-45 -scale-x-100" />

                  {/* Top Logos Row */}
                  <div className={`flex items-center justify-between relative z-10 ${logosRowMargin}`}>
                    <HeaderEmblemLogo sizeVariant={sizeVariant} />
                    <RightHeaderLogos sizeVariant={sizeVariant} />
                  </div>

                  {/* Title Block with Tahfidz Decorations */}
                  <div className={`${titleBlockMargin} relative z-10`}>
                    {/* Basmalah Calligraphy Ribbon */}
                    <div className="flex items-center justify-center gap-2 text-yellow-300/95 my-0.5">
                      <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-yellow-300/70"></span>
                      <span className="text-[11px] sm:text-xs tracking-widest font-serif drop-shadow text-yellow-200">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </span>
                      <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-yellow-300/70"></span>
                    </div>

                    <h2 className={`text-yellow-300 font-extrabold uppercase ${titleLaporanClass} drop-shadow-sm`}>
                      LAPORAN BULAN {getIndonesianMonthUpper(selectedBulan)}
                    </h2>

                    {/* Main Tahfidz Title with Quranic 8-Point Stars */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
                      <RubElHizbIcon className={sizeVariant === "ultra" ? "w-3 h-3 text-yellow-300" : "w-4 h-4 sm:w-5 sm:h-5 text-yellow-300"} />
                      <h1 className={`text-white font-extrabold tracking-wide uppercase italic leading-tight ${titleTahfidzClass} drop-shadow-md`}>
                        TAHFIZHUL QUR'AN KELAS {selectedClassId ? selectedClassId : (selectedLevel ? `${selectedLevel}` : classId)}
                      </h1>
                      <RubElHizbIcon className={sizeVariant === "ultra" ? "w-3 h-3 text-yellow-300" : "w-4 h-4 sm:w-5 sm:h-5 text-yellow-300"} />
                    </div>

                    <h3 className={`text-white font-extrabold tracking-wide uppercase italic ${titleSmpClass} drop-shadow-sm`}>
                      SMP AL-IRSYAD SURAKARTA
                    </h3>

                    {/* Tahfidz Badge & Academic Year */}
                    <div className="flex items-center justify-center gap-2 pt-0.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-300/40 text-yellow-200 text-[8px] sm:text-[9.5px] font-bold tracking-wider uppercase">
                        <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300 shrink-0" />
                        <span>Mutaba'ah Hifzhul Qur'an</span>
                      </span>
                      <span className="text-yellow-300/60 font-bold">•</span>
                      <p className={`text-yellow-300 font-bold tracking-widest uppercase ${titleTahunClass} inline-block`}>
                        TAHUN AJARAN {getTahunAjaran(selectedBulan)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TABLE SECTION */}
                <div className={`${containerPadding} bg-white flex-1 flex flex-col justify-between overflow-hidden`}>
                  <div className="overflow-hidden border border-[#173E7C]/40 rounded-none">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#173E7C] via-[#1E4D94] to-[#173E7C] text-white uppercase font-extrabold tracking-wider text-center border-b-2 border-amber-400">
                          <th className={`${tableThClass} border-r border-blue-900/40 w-8`}>NO</th>
                          <th className={`${tableThClass} border-r border-blue-900/40 text-left w-40`}>NAMA</th>
                          <th className={`${tableThClass} border-r border-blue-900/40 w-14`}>KELAS</th>
                          <th className={`${tableThClass} border-r border-blue-900/40 text-left`}>CAPAIAN</th>
                          <th className={`${tableThClass} border-r border-blue-900/40 w-20`}>TOTAL BARIS</th>
                          <th className={`${tableThClass} border-r border-blue-900/40 w-28`}>MURAJAAH JUZIYYAH</th>
                          <th className={`${tableThClass} w-24`}>KET. /PREDIKAT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {classStudents.map((student, sIdx) => {
                          const capaian = getCapaianForStudent(student.id);
                          const isEven = sIdx % 2 === 1;
                          const rowBg = isEven ? "bg-white" : "bg-[#EEF4FF]";

                          return (
                            <tr key={student.id} className={`${rowBg} hover:bg-amber-50/50 transition-colors`}>
                              <td className={`${tableTdClass} text-center font-bold text-slate-700 border-r border-slate-200`}>
                                {sIdx + 1}
                              </td>
                              <td className={`${tableTdNameClass} font-bold text-slate-800 uppercase tracking-wide border-r border-slate-200`}>
                                {student.nama}
                              </td>
                              <td className={`${tableTdClass} text-center font-semibold text-slate-700 border-r border-slate-200`}>
                                {student.kelasId}
                              </td>
                              <td className={`${tableTdClass} text-slate-800 font-medium border-r border-slate-200 leading-snug`}>
                                {formatCapaianText(capaian)}
                              </td>
                              <td className={`${tableTdClass} text-center font-bold text-slate-700 border-r border-slate-200 whitespace-nowrap`}>
                                {capaian?.totalBaris !== undefined && String(capaian?.totalBaris).trim() !== "" && String(capaian?.totalBaris).trim() !== "0"
                                  ? (typeof capaian.totalBaris === "number" || !isNaN(Number(capaian.totalBaris)) ? `${capaian.totalBaris} Baris` : capaian.totalBaris)
                                  : "-"}
                              </td>
                              <td className={`${tableTdClass} text-center font-medium text-slate-700 border-r border-slate-200`}>
                                {capaian?.juziyyah ? (
                                  <span className="font-semibold text-slate-800">
                                    {capaian.juziyyah}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className={`${tableTdClass} text-center font-medium text-slate-600`}>
                                {capaian?.catatan || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* SIGNATURES SECTION */}
                  <div className={`grid grid-cols-2 gap-8 ${signatureMarginTop}`}>
                    <div className="text-center">
                      <p className={`text-slate-600 ${signatureSpace}`}>
                        Mengetahui,<br />
                        <strong className="text-slate-800">Penanggungjawab Tahfidz</strong>
                      </p>
                      <div className="mb-1">
                        <span className="inline-block border-b-2 border-slate-800 pb-0.5 px-4 font-extrabold text-slate-900">
                          Muhammat Imam Syafi'i S.Pd.
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">NIK. 103.244.00205</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-slate-600 ${signatureSpace}`}>
                        Surakarta, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br />
                        <strong className="text-slate-800">Musyrif Halaqoh</strong>
                      </p>
                      <div className="mb-1">
                        <span className="inline-block border-b-2 border-slate-800 pb-0.5 px-4 font-extrabold text-slate-900">
                          {musyrifSignName}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        {musyrifSignId ? `NIK. ${musyrifs.find((m) => m.id === musyrifSignId)?.nik || musyrifSignId}` : "Pembina Tahfidz"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTTOM FOOTER BAR (BRIGHTER ROYAL ISLAMIC BLUE) */}
                <div className={`bg-gradient-to-r from-[#173E7C] via-[#21539E] to-[#173E7C] border-t-2 border-amber-400 ${footerBarPadding} text-center shrink-0 mt-auto`}>
                  <p className="text-yellow-200 font-extrabold text-xs sm:text-sm tracking-widest font-mono">
                    www.alirsyadsolo.sch.id
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
