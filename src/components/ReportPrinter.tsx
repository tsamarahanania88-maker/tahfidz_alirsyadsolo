/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Student, Class, Musyrif, Capaian } from "../types";
import { Printer, ArrowLeft, CheckCircle2, LayoutGrid, FileText } from "lucide-react";

import logoImg from "../assets/images/al_irsyad_logo_hd_1784773161816.jpg";

import rightBannerImg from "../assets/images/header_right_banner_1784774190288.jpg";

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
      ? "h-8 sm:h-9"
      : sizeVariant === "super"
      ? "h-10 sm:h-11"
      : sizeVariant === "compact"
      ? "h-12 sm:h-14"
      : "h-16 sm:h-20";

  return (
    <div className="flex items-center shrink-0">
      <img
        src={LOGO_URL}
        alt="Al-Irsyad Al-Islamiyyah"
        className={`${heightClass} w-auto object-contain transition-all`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const DRIVE_RIGHT_HEADER_URL = "https://lh3.googleusercontent.com/d/1AxWqNswQPndetuhEJqVO2o-tQSQOFO73";
const DRIVE_FALLBACK_URL = "https://drive.google.com/uc?export=view&id=1AxWqNswQPndetuhEJqVO2o-tQSQOFO73";

const RightHeaderLogos = ({ sizeVariant = "normal" }: { sizeVariant?: "normal" | "compact" | "super" | "ultra" }) => {
  const heightClass =
    sizeVariant === "ultra"
      ? "h-8 sm:h-9 max-w-[150px]"
      : sizeVariant === "super"
      ? "h-10 sm:h-11 max-w-[200px]"
      : sizeVariant === "compact"
      ? "h-12 sm:h-14 max-w-[250px]"
      : "h-16 sm:h-20 md:h-24 max-w-[280px] sm:max-w-[340px]";

  return (
    <div className="flex items-center shrink-0">
      <img
        src={DRIVE_RIGHT_HEADER_URL}
        alt="Sekolah Mengedepankan Akhlak - SMQU SMP Qur'an"
        className={`${heightClass} w-auto object-contain transition-all`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== DRIVE_FALLBACK_URL) {
            target.src = DRIVE_FALLBACK_URL;
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

  // Default format is kolektif if level or class filter active
  const [printFormat, setPrintFormat] = useState<"kolektif" | "individu">(
    selectedLevel || selectedClassId ? "kolektif" : "kolektif"
  );

  // Group students by class
  const studentsByClass: { [classId: string]: Student[] } = {};
  filteredStudents.forEach((student) => {
    if (!studentsByClass[student.kelasId]) {
      studentsByClass[student.kelasId] = [];
    }
    studentsByClass[student.kelasId].push(student);
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
      {/* Control Panel */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-8 border border-slate-200 no-print">
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0B122B] hover:bg-[#152042] text-yellow-400 font-bold rounded-xl shadow-md transition-all transform active:scale-95 text-sm"
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

        {/* Format Selector */}
        <div className="mt-6 border-t border-slate-150 pt-6">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
            Format Cetak Laporan:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setPrintFormat("kolektif")}
              className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                printFormat === "kolektif"
                  ? "border-[#0B122B] bg-[#0B122B]/5 ring-2 ring-[#0B122B]/20"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
              id="opt-print-kolektif"
            >
              <LayoutGrid className={`w-5 h-5 shrink-0 mt-0.5 ${printFormat === "kolektif" ? "text-[#0B122B]" : "text-slate-400"}`} />
              <div>
                <p className={`font-bold text-sm ${printFormat === "kolektif" ? "text-[#0B122B]" : "text-slate-700"}`}>
                  Format Resmi Sesuai Template (Tabel Rekapitulasi Kolektif)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Header biru gelap, judul kuning/putih, tabel berselang-seling biru muda, dan footer link alirsyadsolo.sch.id.
                </p>
              </div>
            </button>

            <button
              onClick={() => setPrintFormat("individu")}
              className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                printFormat === "individu"
                  ? "border-[#0B122B] bg-[#0B122B]/5 ring-2 ring-[#0B122B]/20"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
              id="opt-print-individu"
            >
              <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${printFormat === "individu" ? "text-[#0B122B]" : "text-slate-400"}`} />
              <div>
                <p className={`font-bold text-sm ${printFormat === "individu" ? "text-[#0B122B]" : "text-slate-700"}`}>
                  Laporan Individu Santri
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Menampilkan lembar rapot individu per santri dengan tema resmi Al-Irsyad Surakarta.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Sheet Wrapper */}
      <div className="max-w-4xl mx-auto space-y-8 print:max-w-none print:w-full print:m-0 print:p-0 print:space-y-0">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            Tidak ada data siswa atau laporan capaian untuk kriteria yang dipilih.
          </div>
        ) : printFormat === "kolektif" ? (
          // =================== KOLEKTIF VIEW (EXACT TEMPLATE MATCH) ===================
          sortedClassIds.map((classId, classIdx) => {
            const classStudents = studentsByClass[classId] || [];
            const classMusyrifs = Array.from(new Set(classStudents.map((s) => s.musyrifNama).filter(Boolean)));
            
            // Selected musyrif object if specific filter active
            const selectedMusyrifObj = selectedMusyrifId ? musyrifs.find(m => m.id === selectedMusyrifId) : null;
            const musyrifDisplayTitle = selectedMusyrifObj 
              ? selectedMusyrifObj.nama 
              : classMusyrifs.length === 1 
              ? classMusyrifs[0] 
              : "HALAQOH USTADZ";

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
              studentCount > 15 ? "ultra" :
              studentCount > 10 ? "super" :
              studentCount > 6 ? "compact" : "normal";

            const headerPadding =
              sizeVariant === "ultra" ? "pt-1.5 pb-1.5 px-3" :
              sizeVariant === "super" ? "pt-2.5 pb-2.5 px-4" :
              sizeVariant === "compact" ? "pt-4 pb-4 px-6" :
              "pt-8 pb-8 px-6 sm:px-10";

            const logosRowMargin =
              sizeVariant === "ultra" ? "mb-0.5" :
              sizeVariant === "super" ? "mb-1" :
              sizeVariant === "compact" ? "mb-2" :
              "mb-6";

            const titleBlockMargin =
              sizeVariant === "ultra" ? "space-y-0 my-0.5" :
              sizeVariant === "super" ? "space-y-0 my-0.5" :
              sizeVariant === "compact" ? "space-y-0.5 my-1" :
              "space-y-1 my-2";

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

            const titleHalaqahClass =
              sizeVariant === "ultra" ? "text-[10px] sm:text-xs" :
              sizeVariant === "super" ? "text-xs sm:text-sm" :
              sizeVariant === "compact" ? "text-sm sm:text-base" :
              "text-lg sm:text-xl";

            const titleSmpClass =
              sizeVariant === "ultra" ? "text-xs sm:text-sm" :
              sizeVariant === "super" ? "text-sm sm:text-base" :
              sizeVariant === "compact" ? "text-base sm:text-lg" :
              "text-xl sm:text-2xl";

            const titleTahunClass =
              sizeVariant === "ultra" ? "text-[8px] pt-0" :
              sizeVariant === "super" ? "text-[9px] pt-0.5" :
              sizeVariant === "compact" ? "text-[10px] pt-1" :
              "text-xs sm:text-sm pt-2";

            const tableThClass =
              sizeVariant === "ultra" ? "py-0.5 px-1 text-[8.5px]" :
              sizeVariant === "super" ? "py-1 px-1.5 text-[9.5px]" :
              sizeVariant === "compact" ? "py-1.5 px-2 text-[10px]" :
              "py-3 px-2 text-[11px]";

            const tableTdClass =
              sizeVariant === "ultra" ? "py-0.5 px-1 text-[8.5px]" :
              sizeVariant === "super" ? "py-1 px-1.5 text-[9px]" :
              sizeVariant === "compact" ? "py-2 px-2 text-[10px]" :
              "py-3.5 px-2 text-[11px]";

            const tableTdNameClass =
              sizeVariant === "ultra" ? "py-0.5 px-2 text-[9px]" :
              sizeVariant === "super" ? "py-1 px-2.5 text-[9.5px]" :
              sizeVariant === "compact" ? "py-2 px-3 text-[10px]" :
              "py-3.5 px-4 text-[11px]";

            const containerPadding =
              sizeVariant === "ultra" ? "p-2 sm:p-3" :
              sizeVariant === "super" ? "p-3 sm:p-4" :
              sizeVariant === "compact" ? "p-4" :
              "p-4 sm:p-6";

            const signatureMarginTop =
              sizeVariant === "ultra" ? "mt-1 mb-1 px-2 text-[9px]" :
              sizeVariant === "super" ? "mt-2 mb-1 px-3 text-[10px]" :
              sizeVariant === "compact" ? "mt-4 mb-2 px-4 text-[11px]" :
              "mt-12 mb-4 px-4 text-xs";

            const signatureSpace =
              sizeVariant === "ultra" ? "mb-4" :
              sizeVariant === "super" ? "mb-6" :
              sizeVariant === "compact" ? "mb-8" :
              "mb-16";

            const footerBarPadding =
              sizeVariant === "ultra" ? "py-1.5" :
              sizeVariant === "super" ? "py-2" :
              sizeVariant === "compact" ? "py-2.5" :
              "py-3.5";

            return (
              <div
                key={classId}
                className="bg-white shadow-2xl rounded-none md:rounded-lg overflow-hidden border border-slate-300 p-0 text-slate-900 print-card relative print-page-break flex flex-col justify-between min-h-[297mm] h-[297mm]"
                style={{ height: "297mm", minHeight: "297mm" }}
              >
                {/* TOP HEADER BANNER (DARK NAVY BLUE #0B122B) */}
                <div className={`bg-[#0B122B] text-white ${headerPadding} text-center relative overflow-hidden shrink-0`}>
                  {/* Top Logos Row */}
                  <div className={`flex items-center justify-between ${logosRowMargin}`}>
                    <HeaderEmblemLogo sizeVariant={sizeVariant} />
                    <RightHeaderLogos sizeVariant={sizeVariant} />
                  </div>

                  {/* Title Block */}
                  <div className={titleBlockMargin}>
                    <h2 className={`text-yellow-400 font-extrabold uppercase ${titleLaporanClass}`}>
                      LAPORAN BULAN {getIndonesianMonthUpper(selectedBulan)}
                    </h2>
                    <h1 className={`text-white font-extrabold tracking-wide uppercase italic leading-tight ${titleTahfidzClass}`}>
                      TAHFIZHUL QUR'AN KELAS {selectedLevel ? `${selectedLevel}` : classId}
                    </h1>
                    <h3 className={`text-white font-bold tracking-wide uppercase italic ${titleHalaqahClass}`}>
                      {musyrifDisplayTitle.toUpperCase().startsWith("HALAQAH") || musyrifDisplayTitle.toUpperCase().startsWith("USTADZ") 
                        ? musyrifDisplayTitle.toUpperCase()
                        : `HALAQAH ${musyrifDisplayTitle.toUpperCase()}`}
                    </h3>
                    <h3 className={`text-white font-extrabold tracking-wide uppercase italic ${titleSmpClass}`}>
                      SMP AL-IRSYAD SURAKARTA
                    </h3>
                    <p className={`text-yellow-400 font-bold tracking-widest uppercase ${titleTahunClass}`}>
                      TAHUN AJARAN {getTahunAjaran(selectedBulan)}
                    </p>
                  </div>
                </div>

                {/* TABLE SECTION */}
                <div className={`${containerPadding} bg-white flex-1 flex flex-col justify-between overflow-hidden`}>
                  <div className="overflow-hidden border border-[#0B122B]/30 rounded-none">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0B122B] text-white uppercase font-extrabold tracking-wider text-center">
                          <th className={`${tableThClass} border-r border-slate-700 w-8`}>NO</th>
                          <th className={`${tableThClass} border-r border-slate-700 text-left`}>NAMA</th>
                          <th className={`${tableThClass} border-r border-slate-700 w-14`}>KELAS</th>
                          <th className={`${tableThClass} border-r border-slate-700 text-left`}>CAPAIAN</th>
                          <th className={`${tableThClass} border-r border-slate-700 w-20`}>TOTAL BARIS</th>
                          <th className={`${tableThClass} border-r border-slate-700 w-28`}>MURAJAAH JUZIYYAH</th>
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
                      <div className="w-44 border-b-2 border-slate-800 mx-auto mb-1"></div>
                      <p className="font-bold text-slate-900">Muhammat Imam Syafi'i S.Pd.</p>
                      <p className="text-xs font-bold text-slate-700">NIK. 103.244.00205</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-slate-600 ${signatureSpace}`}>
                        Surakarta, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br />
                        <strong className="text-slate-800">Musyrif Halaqoh</strong>
                      </p>
                      <div className="w-44 border-b-2 border-slate-800 mx-auto mb-1"></div>
                      <p className="font-bold text-slate-900">{musyrifSignName}</p>
                      <p className="text-xs font-bold text-slate-700">
                        {musyrifSignId ? `NIK. ${musyrifs.find((m) => m.id === musyrifSignId)?.nik || musyrifSignId}` : "Pembina Tahfidz"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTTOM FOOTER BAR (DARK NAVY BLUE #0B122B) */}
                <div className={`bg-[#0B122B] ${footerBarPadding} text-center shrink-0 mt-auto`}>
                  <p className="text-white font-extrabold text-xs sm:text-sm tracking-widest font-mono">
                    www.alirsyadsolo.sch.id
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          // =================== INDIVIDUAL VIEW ===================
          filteredStudents.map((student, idx) => {
            const capaian = getCapaianForStudent(student.id);
            return (
              <div
                key={student.id}
                className="bg-white shadow-2xl rounded-none md:rounded-lg overflow-hidden border border-slate-300 p-0 text-slate-900 print-card relative print-page-break flex flex-col justify-between min-h-[297mm] h-[297mm]"
                style={{ height: "297mm", minHeight: "297mm" }}
              >
                {/* TOP HEADER BANNER */}
                <div className="bg-[#0B122B] text-white pt-8 pb-8 px-6 sm:px-10 text-center relative overflow-hidden shrink-0">
                  <div className="flex items-center justify-between mb-6">
                    <HeaderEmblemLogo />
                    <RightHeaderLogos />
                  </div>

                  <div className="space-y-1 my-2">
                    <h2 className="text-yellow-400 font-extrabold text-base sm:text-lg tracking-widest uppercase">
                      LAPORAN BULAN {getIndonesianMonthUpper(selectedBulan)}
                    </h2>
                    <h1 className="text-white font-extrabold text-xl sm:text-2xl tracking-wide uppercase italic leading-tight">
                      TAHFIZHUL QUR'AN INDIVIDU
                    </h1>
                    <h3 className="text-white font-extrabold text-xl sm:text-2xl tracking-wide uppercase italic">
                      SMP AL-IRSYAD SURAKARTA
                    </h3>
                    <p className="text-yellow-400 font-bold text-xs sm:text-sm tracking-widest uppercase pt-2">
                      TAHUN AJARAN {getTahunAjaran(selectedBulan)}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 bg-white space-y-6 flex-1 flex flex-col justify-between">
                  {/* Student Details Card */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-8 bg-[#EEF4FF] p-5 rounded-xl border border-slate-200 text-xs sm:text-sm">
                    <div className="flex">
                      <span className="w-32 font-bold text-slate-600">Nama Siswa</span>
                      <span className="mr-2 font-bold">:</span>
                      <span className="font-extrabold text-slate-900 uppercase">{student.nama}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-bold text-slate-600">Kelas</span>
                      <span className="mr-2 font-bold">:</span>
                      <span className="font-bold text-slate-800">{student.kelasId}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-bold text-slate-600">No. Induk Siswa</span>
                      <span className="mr-2 font-bold">:</span>
                      <span className="font-mono font-bold text-slate-800">{student.noInduk}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-bold text-slate-600">Musyrif Tahfidz</span>
                      <span className="mr-2 font-bold">:</span>
                      <span className="font-bold text-slate-800">{student.musyrifNama}</span>
                    </div>
                  </div>

                  {/* Performance Table */}
                  <div className="overflow-hidden border border-[#0B122B]/30 rounded-lg">
                    <table className="w-full text-xs sm:text-sm text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0B122B] text-white uppercase text-[11px] font-extrabold tracking-wider text-center">
                          <th className="py-3 px-4 border-r border-slate-700 w-20">Juz</th>
                          <th className="py-3 px-4 border-r border-slate-700 text-left">Capaian Awal Bulan</th>
                          <th className="py-3 px-4 border-r border-slate-700 text-left">Capaian Akhir Bulan</th>
                          <th className="py-3 px-4 border-r border-slate-700 w-28">Total Baris</th>
                          <th className="py-3 px-4 w-36">Murajaah Juziyyah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {capaian ? (
                          <tr className="border-t border-slate-200 bg-white">
                            <td className="py-4 px-4 text-center font-extrabold text-xl text-[#0B122B] border-r border-slate-200 bg-[#EEF4FF]">
                              {capaian.juz}
                            </td>
                            <td className="py-4 px-4 border-r border-slate-200 text-slate-800 align-top">
                              <div className="font-bold text-slate-900">{capaian.capaianAwal || "-"}</div>
                              <span className="text-[10px] text-slate-400 block mt-1">Materi hafalan awal periode</span>
                            </td>
                            <td className="py-4 px-4 border-r border-slate-200 text-slate-800 align-top">
                              <div className="font-bold text-slate-900">{capaian.capaianAkhir || "-"}</div>
                              <span className="text-[10px] text-slate-400 block mt-1">Hafalan terakhir dicapai</span>
                            </td>
                            <td className="py-4 px-4 text-center font-mono font-bold text-slate-800 border-r border-slate-200 align-middle">
                              {capaian.totalBaris || 0} Baris
                            </td>
                            <td className="py-4 px-4 text-center align-middle font-bold text-slate-800">
                              {capaian.juziyyah || "Belum"}
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-12 px-4 text-center text-slate-400 italic">
                              Belum ada input capaian tahfidz dari Musyrif untuk bulan ini.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Teacher's Feedback Card */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-[#EEF4FF]/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B122B] mb-2">
                      Catatan & Rekomendasi Musyrif:
                    </h4>
                    <p className="text-sm text-slate-800 italic leading-relaxed min-h-[50px]">
                      {capaian?.catatan ? `"${capaian.catatan}"` : "Belum ada catatan pembinaan."}
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 gap-12 text-xs mt-12 mb-4 px-4">
                    <div className="text-center">
                      <p className="text-slate-600 mb-16">
                        Mengetahui,<br />
                        <strong className="text-slate-800">Penanggungjawab Tahfidz</strong>
                      </p>
                      <div className="w-48 border-b-2 border-slate-800 mx-auto mb-1"></div>
                      <p className="font-bold text-slate-900">Muhammat Imam Syafi'i S.Pd.</p>
                      <p className="text-xs font-bold text-slate-700">NIK. 103.244.00205</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 mb-16">
                        Surakarta, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br />
                        <strong className="text-slate-800">Musyrif Halaqoh</strong>
                      </p>
                      <div className="w-48 border-b-2 border-slate-800 mx-auto mb-1"></div>
                      <p className="font-bold text-slate-900">{student.musyrifNama}</p>
                      <p className="text-xs font-bold text-slate-700">
                        NIK. {musyrifs.find((m) => m.id === student.musyrifId)?.nik || student.musyrifId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTTOM FOOTER BAR */}
                <div className="bg-[#0B122B] py-3.5 text-center shrink-0 mt-auto">
                  <p className="text-white font-extrabold text-xs sm:text-sm tracking-widest font-mono">
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
