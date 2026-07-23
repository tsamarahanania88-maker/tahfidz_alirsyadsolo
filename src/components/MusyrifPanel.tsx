/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Student, Class, Musyrif, Capaian } from "../types";
import {
  BookOpen,
  Edit,
  Save,
  Printer,
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Info,
  CheckCircle,
  Clock,
  UserCheck,
  AlertCircle,
  RotateCcw,
  Trash2,
  X
} from "lucide-react";

interface MusyrifPanelProps {
  currentMusyrif: Musyrif;
  students: Student[];
  classes: Class[];
  capaians: Capaian[];
  onSaveCapaian: (capaian: Capaian) => Promise<void>;
  onDeleteCapaian?: (id: string) => Promise<void>;
  onUpdateMusyrifPassword: (musyrifId: string, newPass: string) => Promise<void>;
  onTriggerPrint: (filters: { classId?: string; level?: string; musyrifId?: string; bulan: string }) => void;
  onLogout: () => void;
}

type TabType = "input" | "cetak" | "pengaturan";

export default function MusyrifPanel({
  currentMusyrif,
  students,
  classes,
  capaians,
  onSaveCapaian,
  onDeleteCapaian,
  onUpdateMusyrifPassword,
  onTriggerPrint,
  onLogout,
}: MusyrifPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("input");
  const [selectedBulan, setSelectedBulan] = useState("2026-07");
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [filterJenjang, setFilterJenjang] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "filled" | "unfilled">("");

  // Active student being edited for capaian input
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states for Capaian
  const [capaianText, setCapaianText] = useState("");
  const [totalBaris, setTotalBaris] = useState<string | number>("");
  const [juziyyah, setJuziyyah] = useState("");
  const [catatan, setCatatan] = useState("");
  const [juz, setJuz] = useState("");

  // Change password form states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Only get students mentored by this Musyrif
  const myStudents = students.filter((s) => s.musyrifId === currentMusyrif.id);

  // Filter students by grade level (Jenjang) and input status (Sudah/Belum)
  const filteredMyStudents = myStudents.filter((s) => {
    // 1. Jenjang filter
    if (filterJenjang && !s.kelasId.startsWith(filterJenjang)) return false;

    // 2. Status filter
    if (filterStatus) {
      const isFilled = capaians.some((c) => c.studentId === s.id && c.bulan === selectedBulan);
      if (filterStatus === "filled" && !isFilled) return false;
      if (filterStatus === "unfilled" && isFilled) return false;
    }

    return true;
  });

  // Pagination state for student list (15 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const totalPages = Math.ceil(filteredMyStudents.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedStudents = filteredMyStudents.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  // Get filled vs unfilled stats for the selected month
  const studentsFilled = myStudents.filter((s) =>
    capaians.some((c) => c.studentId === s.id && c.bulan === selectedBulan)
  );
  const studentsUnfilled = myStudents.filter((s) =>
    !capaians.some((c) => c.studentId === s.id && c.bulan === selectedBulan)
  );

  // Handle open input/edit form for a student's capaian
  const handleOpenEditCapaian = (student: Student) => {
    setEditingStudent(student);

    // Find if there is an existing capaian report for this student & month
    const existing = capaians.find(
      (c) => c.studentId === student.id && c.bulan === selectedBulan
    );

    if (existing) {
      setJuz(existing.juz || "");
      const formattedCap = existing.capaianAwal && existing.capaianAkhir && existing.capaianAwal !== existing.capaianAkhir
        ? `${existing.capaianAwal} - ${existing.capaianAkhir}`
        : (existing.capaianAkhir || existing.capaianAwal || "");
      setCapaianText(formattedCap);
      setTotalBaris(existing.totalBaris !== undefined && existing.totalBaris !== null ? existing.totalBaris : "");
      setJuziyyah(existing.juziyyah || "");
      setCatatan(existing.catatan || "");
    } else {
      // Clear fields for fresh entry
      setJuz("");
      setCapaianText("");
      setTotalBaris("");
      setJuziyyah("");
      setCatatan("");
    }
  };

  // Reset form input fields
  const handleResetForm = () => {
    setJuz("");
    setCapaianText("");
    setTotalBaris("");
    setJuziyyah("");
    setCatatan("");
    showNotification("Isian form capaian berhasil direset/dikosongkan.");
  };

  // Reset/Delete saved capaian data for a student
  const handleResetSavedCapaian = async (student: Student) => {
    const capaianId = `${student.id}_${selectedBulan}`;
    const existing = capaians.find((c) => c.id === capaianId);

    if (!existing) {
      handleResetForm();
      return;
    }

    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus / mereset data capaian tersimpan untuk ${student.nama} pada bulan ${formatIndonesianMonth(selectedBulan)}?`
      )
    ) {
      if (onDeleteCapaian) {
        try {
          await onDeleteCapaian(capaianId);
          showNotification(`Data capaian ${student.nama} berhasil direset/dihapus!`);
          handleResetForm();
          if (editingStudent?.id === student.id) {
            setEditingStudent(null);
          }
        } catch (err) {
          showNotification("Gagal mereset data capaian.", "error");
        }
      } else {
        handleResetForm();
      }
    }
  };

  // Handle saving capaian
  const handleSaveCapaianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    if (!capaianText.trim()) {
      showNotification("Field CAPAIAN wajib diisi!", "error");
      return;
    }

    // Get class detail
    const studentClassObj = classes.find((c) => c.id === editingStudent.kelasId);
    const classNama = studentClassObj ? studentClassObj.nama : editingStudent.kelasId;

    const parsedBaris = typeof totalBaris === "number" ? totalBaris : (parseInt(String(totalBaris).replace(/\D/g, ""), 10) || 0);

    const newCapaian: Capaian = {
      id: `${editingStudent.id}_${selectedBulan}`,
      studentId: editingStudent.id,
      noInduk: editingStudent.noInduk,
      namaSiswa: editingStudent.nama,
      kelasId: editingStudent.kelasId,
      kelasNama: classNama,
      musyrifId: currentMusyrif.id,
      musyrifNama: currentMusyrif.nama,
      juz: juz || "-",
      capaianAwal: "",
      capaianAkhir: capaianText.trim(),
      totalBaris: parsedBaris,
      juziyyah: juziyyah.trim() || "-",
      catatan: catatan.trim(),
      bulan: selectedBulan,
      updatedAt: new Date().toISOString(),
    };

    try {
      await onSaveCapaian(newCapaian);
      showNotification(`Capaian Tahfidz ${editingStudent.nama} berhasil disimpan!`);
      setEditingStudent(null);
    } catch (err) {
      showNotification("Gagal menyimpan capaian tahfidz.", "error");
    }
  };

  // Handle changing musyrif password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPassword !== currentMusyrif.passwordHash) {
      showNotification("Sandi saat ini salah!", "error");
      return;
    }
    if (newPassword.length < 4) {
      showNotification("Sandi baru minimal 4 karakter!", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification("Konfirmasi sandi tidak sesuai!", "error");
      return;
    }

    try {
      await onUpdateMusyrifPassword(currentMusyrif.id, newPassword);
      showNotification("Sandi Anda berhasil diperbarui!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showNotification("Gagal memperbarui sandi.", "error");
    }
  };

  // Helper to format Indonesian month names
  const formatIndonesianMonth = (monthStr: string) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${months[parseInt(month, 10) - 1] || ""} ${year}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar for Musyrif */}
      <aside className="w-full md:w-64 bg-brand-800 text-white shrink-0 shadow-lg flex flex-col justify-between md:min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 border-b border-brand-700 pb-5 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-inner shrink-0">
              <img
                src="https://www.alirsyad.or.id/wp-content/uploads/download/alirsyad-alislamiyyah.png"
                alt="Logo Al Irsyad"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight leading-tight uppercase">Tahfidz Al Irsyad</h1>
              <span className="text-[10px] text-brand-100 font-semibold tracking-wider uppercase">PORTAL MUSYRIF</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab("input"); setEditingStudent(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "input" ? "bg-white text-brand-800 shadow-md" : "text-brand-100 hover:bg-brand-700/50"
              }`}
              id="m-tab-input"
            >
              <BookOpen className="w-4 h-4" /> Input Capaian
            </button>
            <button
              onClick={() => setActiveTab("cetak")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "cetak" ? "bg-white text-brand-800 shadow-md" : "text-brand-100 hover:bg-brand-700/50"
              }`}
              id="m-tab-cetak"
            >
              <Printer className="w-4 h-4" /> Cetak Laporan
            </button>
            <button
              onClick={() => setActiveTab("pengaturan")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "pengaturan" ? "bg-white text-brand-800 shadow-md" : "text-brand-100 hover:bg-brand-700/50"
              }`}
              id="m-tab-pengaturan"
            >
              <SettingsIcon className="w-4 h-4" /> Pengaturan Sandi
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-brand-700 bg-brand-900/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold border border-white/20">
              US
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{currentMusyrif.nama}</p>
              <p className="text-[10px] text-brand-200 truncate">NIK. {currentMusyrif.nik}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2 bg-rose-600/30 hover:bg-rose-600 hover:text-white text-rose-200 text-xs font-bold rounded-lg transition-all border border-rose-500/30 flex items-center justify-center gap-2"
            id="btn-logout-musyrif"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar Portal
          </button>
        </div>
      </aside>

      {/* Main stage */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div>
            <h2 className="text-xs font-semibold text-slate-400">SMP Al Irsyad Surakarta &bull; Portal Musyrif</h2>
          </div>
          <span className="text-xs font-bold text-brand-700 px-3 py-1 bg-brand-50 rounded-full">
            Aktif: {currentMusyrif.nama}
          </span>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
          {notification && (
            <div className={`p-4 rounded-xl shadow-md flex items-center gap-3 border ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : "bg-rose-50 border-rose-100 text-rose-800"
            } animate-slideIn`}>
              <CheckCircle className={`w-5 h-5 shrink-0 ${notification.type === "success" ? "text-emerald-500" : "text-rose-500"}`} />
              <p className="text-sm font-semibold">{notification.text}</p>
            </div>
          )}

          {/* ----------------- TAB INPUT CAPAIAN SISWA ----------------- */}
          {activeTab === "input" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Input Capaian Siswa</h2>
                  <p className="text-sm text-slate-500 mt-1">Masukkan hasil setoran hafalan Al-Qur'an bulanan santri binaan Anda.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Pilih Bulan:</span>
                  <input
                    type="month"
                    value={selectedBulan}
                    onChange={(e) => {
                      setSelectedBulan(e.target.value);
                      setEditingStudent(null);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    id="m-input-bulan"
                  />
                </div>
              </div>

              {/* Editing Modal Form Popup */}
              {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-2xl animate-scaleIn my-auto relative">
                    <div className="border-b border-slate-100 pb-4 mb-5 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-extrabold text-slate-800">
                            Isi Capaian Tahfidz Siswa
                          </h3>
                          <span className="text-xs bg-brand-50 text-brand-800 border border-brand-200 px-2.5 py-0.5 rounded-full font-bold">
                            Periode {formatIndonesianMonth(selectedBulan)}
                          </span>
                        </div>
                        <p className="text-xs text-brand-700 font-bold mt-1 uppercase tracking-wide">
                          {editingStudent.nama} ({editingStudent.noInduk}) &bull; Kelas {editingStudent.kelasId}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Tutup Form"
                        id="btn-close-modal-capaian"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveCapaianSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 1. CAPAIAN */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            CAPAIAN <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={capaianText}
                            onChange={(e) => setCapaianText(e.target.value)}
                            className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold"
                            placeholder="Contoh: Surah An-Naba' : 1 - An-Nazi'at : 20 / Juz 30"
                            id="input-capaian-text"
                            autoFocus
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Diisi manual sesuai capaian materi hafalan siswa</span>
                        </div>

                        {/* 2. TOTAL BARIS */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            TOTAL BARIS <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={totalBaris}
                            onChange={(e) => setTotalBaris(e.target.value)}
                            className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold"
                            placeholder="Contoh: 15 / 20 Baris"
                            id="input-capaian-baris"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Diisi manual jumlah baris setoran hafalan</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 3. MURAJAAH JUZIYYAH */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            MURAJAAH JUZIYYAH
                          </label>
                          <input
                            type="text"
                            list="juziyyah-suggestions"
                            value={juziyyah}
                            onChange={(e) => setJuziyyah(e.target.value)}
                            className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold"
                            placeholder="Contoh: Juz 30 (Lancar) / Sudah Ujian Juziyyah"
                            id="input-capaian-juziyyah"
                          />
                          <datalist id="juziyyah-suggestions">
                            <option value="Juz 30 (Lancar)" />
                            <option value="Juz 29 (Lancar)" />
                            <option value="Sudah Ujian Juziyyah" />
                            <option value="Lancar (Mumtaz)" />
                            <option value="Cukup Lancar (Jayyid Jiddan)" />
                            <option value="Belum Lancar" />
                          </datalist>
                          <span className="text-[10px] text-slate-400 mt-1 block">Diisi manual status murajaah / ujian juziyyah</span>
                        </div>

                        {/* 4. KET. / PREDIKAT */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            KET. / PREDIKAT
                          </label>
                          <input
                            type="text"
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold"
                            placeholder="Contoh: Mumtaz / Jayyid Jiddan / Hafalan sangat baik"
                            id="input-capaian-catatan"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">Diisi manual keterangan, predikat, atau catatan musyrif</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleResetForm}
                            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            id="btn-reset-form-fields"
                            title="Kosongkan seluruh isian form"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reset Isian Form
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {capaians.some((c) => c.studentId === editingStudent.id && c.bulan === selectedBulan) && (
                            <button
                              type="button"
                              onClick={() => handleResetSavedCapaian(editingStudent)}
                              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              id="btn-delete-saved-capaian"
                              title="Hapus data tersimpan untuk siswa ini pada bulan terpilih"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Reset / Hapus Data Siswa
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setEditingStudent(null)}
                            className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                            id="btn-cancel-capaian"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-brand-700 text-white font-bold rounded-lg text-xs hover:bg-brand-800 inline-flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95 cursor-pointer"
                            id="btn-save-capaian"
                          >
                            <Save className="w-4 h-4" /> Simpan Capaian
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Stats summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Already Filled */}
                <div
                  onClick={() => {
                    setFilterStatus(filterStatus === "filled" ? "" : "filled");
                    setCurrentPage(1);
                  }}
                  className={`border rounded-2xl p-5 shadow-sm flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                    filterStatus === "filled"
                      ? "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-500/20 scale-[1.01] shadow-md"
                      : "bg-emerald-50/50 border-emerald-100 hover:bg-emerald-100/30 hover:border-emerald-200"
                  }`}
                >
                  <div>
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                      Sudah Diinput ({formatIndonesianMonth(selectedBulan)})
                      {filterStatus === "filled" && (
                        <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[8px] uppercase tracking-normal">Aktif</span>
                      )}
                    </p>
                    <h4 className="text-2xl font-extrabold text-emerald-950 mt-1">
                      {studentsFilled.length} <span className="text-xs font-semibold text-emerald-600">dari {myStudents.length} Santri</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">Klik untuk memfilter daftar santri terisi</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 shadow-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>

                {/* Card Unfilled */}
                <div
                  onClick={() => {
                    setFilterStatus(filterStatus === "unfilled" ? "" : "unfilled");
                    setCurrentPage(1);
                  }}
                  className={`border rounded-2xl p-5 shadow-sm flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                    filterStatus === "unfilled"
                      ? "bg-amber-100 border-amber-400 ring-2 ring-amber-500/20 scale-[1.01] shadow-md"
                      : "bg-amber-50/50 border-amber-100 hover:bg-amber-100/30 hover:border-amber-200"
                  }`}
                >
                  <div>
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                      Belum Diinput ({formatIndonesianMonth(selectedBulan)})
                      {filterStatus === "unfilled" && (
                        <span className="px-1.5 py-0.5 bg-amber-600 text-white rounded text-[8px] uppercase tracking-normal">Aktif</span>
                      )}
                    </p>
                    <h4 className="text-2xl font-extrabold text-amber-950 mt-1">
                      {studentsUnfilled.length} <span className="text-xs font-semibold text-amber-600">Santri</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">Klik untuk memfilter daftar santri belum diinput</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-700 shadow-sm">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Student list mentored */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Santri Binaan Saya</h3>
                    {filterStatus && (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        filterStatus === "filled"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        Filter: {filterStatus === "filled" ? "Sudah Diinput" : "Belum Diinput"}
                        <button
                          onClick={() => {
                            setFilterStatus("");
                            setCurrentPage(1);
                          }}
                          className="hover:bg-slate-200 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-extrabold transition-colors"
                          title="Hapus filter"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Filter Jenjang:</span>
                    <select
                      value={filterJenjang}
                      onChange={(e) => {
                        setFilterJenjang(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      id="m-filter-jenjang"
                    >
                      <option value="">Semua Jenjang</option>
                      <option value="7">Jenjang Kelas 7</option>
                      <option value="8">Jenjang Kelas 8</option>
                      <option value="9">Jenjang Kelas 9</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold tracking-wider">
                        <th className="py-3 px-6">No. Induk</th>
                        <th className="py-3 px-6">Nama Santri</th>
                        <th className="py-3 px-6">Kelas</th>
                        <th className="py-3 px-6 text-center">Status Input ({formatIndonesianMonth(selectedBulan)})</th>
                        <th className="py-3 px-6 text-center w-36">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMyStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 px-6 text-center text-slate-400 italic">
                            {myStudents.length === 0
                              ? "Belum ada siswa yang didelegasikan ke bimbingan Anda oleh Admin."
                              : "Tidak ada data siswa yang cocok dengan filter Jenjang."}
                          </td>
                        </tr>
                      ) : (
                        paginatedStudents.map((s) => {
                          const record = capaians.find((c) => c.studentId === s.id && c.bulan === selectedBulan);
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-4 px-6 font-mono font-bold text-slate-600">{s.noInduk}</td>
                              <td className="py-4 px-6 font-bold text-slate-950">{s.nama}</td>
                              <td className="py-4 px-6">
                                <span className="inline-flex px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold text-[10px]">
                                  {s.kelasId}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                {record ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Sudah Terisi (Juz {record.juz})
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    <Clock className="w-3 h-3 text-amber-600" /> Belum Diinput
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditCapaian(s)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
                                    id={`btn-edit-siswa-${s.noInduk}`}
                                  >
                                    <Edit className="w-3 h-3" /> {record ? "Edit" : "Input"} Capaian
                                  </button>
                                  {record && (
                                    <button
                                      onClick={() => handleResetSavedCapaian(s)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                      title="Reset / Hapus data isian capaian siswa ini"
                                      id={`btn-reset-siswa-${s.noInduk}`}
                                    >
                                      <RotateCcw className="w-3 h-3" /> Reset
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredMyStudents.length > 0 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-medium">
                    <div>
                      Menampilkan <span className="font-extrabold text-slate-800">{(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-extrabold text-slate-800">{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredMyStudents.length)}</span> dari <span className="font-extrabold text-slate-800">{filteredMyStudents.length}</span> Santri
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          disabled={safeCurrentPage === 1}
                          className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                          id="btn-musyrif-prev-page"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
                        </button>

                        <div className="flex items-center gap-1 px-2 font-bold text-slate-700">
                          Halaman {safeCurrentPage} dari {totalPages}
                        </div>

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                          disabled={safeCurrentPage === totalPages}
                          className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                          id="btn-musyrif-next-page"
                        >
                          Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------- TAB CETAK LAPORAN ----------------- */}
          {activeTab === "cetak" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Cetak Laporan Perjenjang</h2>
                <p className="text-sm text-slate-500 mt-1">Ekspor laporan capaian tahfidz binaan Anda pertingkat jenjang.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl space-y-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Bulan Periode</label>
                    <input
                      type="month"
                      value={selectedBulan}
                      onChange={(e) => setSelectedBulan(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs bg-white"
                      id="m-cetak-bulan"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Tingkat Jenjang:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {["7", "8", "9"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => onTriggerPrint({
                          level: lvl,
                          musyrifId: currentMusyrif.id,
                          bulan: selectedBulan
                        })}
                        className="py-3 px-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 text-slate-800 font-bold text-center text-xs flex flex-col items-center gap-1 transition-all"
                        id={`btn-print-jenjang-${lvl}`}
                      >
                        <Printer className="w-4 h-4 text-brand-600" />
                        <span>Jenjang {lvl}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB PENGATURAN PASSWORD ----------------- */}
          {activeTab === "pengaturan" && (
            <div className="space-y-6">
              <div className="max-w-md">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Ubah Kata Sandi</h2>
                <p className="text-sm text-slate-500 mt-1">Demi keamanan, ganti sandi akun Anda secara berkala.</p>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kata Sandi Saat Ini</label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                        placeholder="Sandi musyrif Anda"
                        id="musyrif-old-password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kata Sandi Baru</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                        placeholder="Minimal 4 karakter"
                        id="musyrif-new-password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Konfirmasi Sandi Baru</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                        placeholder="Ulangi sandi baru"
                        id="musyrif-confirm-password"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand-700 text-white font-bold rounded-xl text-xs hover:bg-brand-800 transition-all shadow-sm"
                        id="btn-update-musyrif-pass"
                      >
                        Perbarui Sandi
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Copyright Footer */}
          <div className="pt-8 border-t border-slate-200/60 text-center text-[11.5px] text-slate-400 font-medium tracking-wide">
            Copyright © 2026 HUMAS SMP AL IRSYAD SURAKARTA
          </div>
        </div>
      </main>
    </div>
  );
}
