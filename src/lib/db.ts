/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, isFirebaseConfigured } from "./firebase";
import { Student, Class, Musyrif, Capaian, Settings } from "../types";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

// --- ERROR LOGGING HELPER ---
function logFirestoreError(context: string, err: any) {
  const errMsg = err instanceof Error ? err.message : String(err);
  if (errMsg.includes("offline") || errMsg.includes("connection") || errMsg.includes("network") || errMsg.includes("Unavailable") || errMsg.includes("Failed to get document")) {
    console.warn(`Firestore connection issue in ${context} (gracefully falling back to local storage):`, errMsg);
  } else {
    console.error(`Firestore error in ${context}:`, err);
  }
}

// --- SEED DATA FOR LOCAL STORAGE ---
const DEFAULT_CLASSES: Class[] = [
  { id: "7A", nama: "Kelas 7A" },
  { id: "7B", nama: "Kelas 7B" },
  { id: "8A", nama: "Kelas 8A" },
  { id: "8B", nama: "Kelas 8B" },
  { id: "9A", nama: "Kelas 9A" },
  { id: "9B", nama: "Kelas 9B" },
];

const DEFAULT_MUSYRIFS: Musyrif[] = [
  {
    id: "19920101",
    nik: "19920101",
    nama: "Ust. Ahmad Fauzi, S.Pd.I",
    jumlahSiswa: 3,
    username: "ahmad",
    passwordHash: "ahmad123",
  },
  {
    id: "19940202",
    nik: "19940202",
    nama: "Ust. Muhammad Ridwan, Lc",
    jumlahSiswa: 2,
    username: "ridwan",
    passwordHash: "ridwan123",
  },
];

const DEFAULT_STUDENTS: Student[] = [
  {
    id: "1001",
    noInduk: "1001",
    nama: "Abdurrahman Al-Fatih",
    kelasId: "7A",
    musyrifId: "19920101",
    musyrifNama: "Ust. Ahmad Fauzi, S.Pd.I",
  },
  {
    id: "1002",
    noInduk: "1002",
    nama: "Muhammad Azzam Kamil",
    kelasId: "7A",
    musyrifId: "19920101",
    musyrifNama: "Ust. Ahmad Fauzi, S.Pd.I",
  },
  {
    id: "1003",
    noInduk: "1003",
    nama: "Ali Zainal Abidin",
    kelasId: "7B",
    musyrifId: "19940202",
    musyrifNama: "Ust. Muhammad Ridwan, Lc",
  },
  {
    id: "1004",
    noInduk: "1004",
    nama: "Hamzah Syihabuddin",
    kelasId: "8A",
    musyrifId: "19920101",
    musyrifNama: "Ust. Ahmad Fauzi, S.Pd.I",
  },
  {
    id: "1005",
    noInduk: "1005",
    nama: "Umar Faruq",
    kelasId: "8B",
    musyrifId: "19940202",
    musyrifNama: "Ust. Muhammad Ridwan, Lc",
  },
];

const DEFAULT_CAPAIAN: Capaian[] = [
  {
    id: "1001_2026-07",
    studentId: "1001",
    noInduk: "1001",
    namaSiswa: "Abdurrahman Al-Fatih",
    kelasId: "7A",
    kelasNama: "Kelas 7A",
    musyrifId: "19920101",
    musyrifNama: "Ust. Ahmad Fauzi, S.Pd.I",
    juz: "30",
    capaianAwal: "An-Naba 1",
    capaianAkhir: "An-Nazi'at 20",
    totalBaris: 120,
    juziyyah: "Lancar",
    catatan: "Sangat baik dalam tajwid, perlu ditingkatkan kelancaran hafalan.",
    bulan: "2026-07",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "1002_2026-07",
    studentId: "1002",
    noInduk: "1002",
    namaSiswa: "Muhammad Azzam Kamil",
    kelasId: "7A",
    kelasNama: "Kelas 7A",
    musyrifId: "19920101",
    musyrifNama: "Ust. Ahmad Fauzi, S.Pd.I",
    juz: "29",
    capaianAwal: "Al-Mulk 1",
    capaianAkhir: "Al-Qalam 15",
    totalBaris: 85,
    juziyyah: "Sedang",
    catatan: "Perlu perhatian lebih pada makharijul huruf.",
    bulan: "2026-07",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "1003_2026-07",
    studentId: "1003",
    noInduk: "1003",
    namaSiswa: "Ali Zainal Abidin",
    kelasId: "7B",
    kelasNama: "Kelas 7B",
    musyrifId: "19940202",
    musyrifNama: "Ust. Muhammad Ridwan, Lc",
    juz: "1",
    capaianAwal: "Al-Baqarah 1",
    capaianAkhir: "Al-Baqarah 50",
    totalBaris: 250,
    juziyyah: "Lancar",
    catatan: "Hafalan lancar dan tajwid mumtaz.",
    bulan: "2026-07",
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_ADMIN_PASSWORD = "admin";

// Helpers to get / set localStorage
function getLocal(key: string, defaultValue: any) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
}

function setLocal(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- DB SERVICE EXPORTS ---

export const dbService = {
  // 1. Class Operations
  async getClasses(): Promise<Class[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "classes"));
        const list: Class[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Class);
        });

        if (list.length === 0) {
          const initDoc = await getDoc(doc(db, "settings", "classes_init"));
          const isInitialized = initDoc.exists() && initDoc.data().initialized === true;

          if (!isInitialized) {
            // Initialize with default classes if empty and not initialized before
            for (const c of DEFAULT_CLASSES) {
              await setDoc(doc(db, "classes", c.id), { nama: c.nama });
              list.push(c);
            }
            await setDoc(doc(db, "settings", "classes_init"), { initialized: true });
          }
        }
        return list;
      } catch (err) {
        logFirestoreError("getClasses", err);
      }
    }
    return getLocal("tahfidz_classes", DEFAULT_CLASSES);
  },

  async saveClass(classData: Class): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "classes", classData.id), { nama: classData.nama });
      } catch (err) {
        logFirestoreError("saveClass", err);
      }
    }
    const list = getLocal("tahfidz_classes", DEFAULT_CLASSES);
    const index = list.findIndex((c) => c.id === classData.id);
    if (index >= 0) {
      list[index] = classData;
    } else {
      list.push(classData);
    }
    setLocal("tahfidz_classes", list);
  },

  async deleteClass(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "classes", id));
      } catch (err) {
        logFirestoreError("deleteClass", err);
      }
    }
    const list = getLocal("tahfidz_classes", DEFAULT_CLASSES);
    const updated = list.filter((c) => c.id !== id);
    setLocal("tahfidz_classes", updated);
  },

  // 2. Musyrif Operations
  async getMusyrifs(): Promise<Musyrif[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "musyrif"));
        const list: Musyrif[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Musyrif);
        });

        if (list.length === 0) {
          const initDoc = await getDoc(doc(db, "settings", "musyrifs_init"));
          const isInitialized = initDoc.exists() && initDoc.data().initialized === true;

          if (!isInitialized) {
            // Initialize with default musyrifs if empty and not initialized before
            for (const m of DEFAULT_MUSYRIFS) {
              await setDoc(doc(db, "musyrif", m.id), {
                nik: m.nik,
                nama: m.nama,
                jumlahSiswa: m.jumlahSiswa,
                username: m.username,
                passwordHash: m.passwordHash,
              });
              list.push(m);
            }
            await setDoc(doc(db, "settings", "musyrifs_init"), { initialized: true });
          }
        }
        return list;
      } catch (err) {
        logFirestoreError("getMusyrifs", err);
      }
    }
    return getLocal("tahfidz_musyrifs", DEFAULT_MUSYRIFS);
  },

  async saveMusyrif(musyrifData: Musyrif): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "musyrif", musyrifData.id), {
          nik: musyrifData.nik,
          nama: musyrifData.nama,
          jumlahSiswa: musyrifData.jumlahSiswa,
          username: musyrifData.username,
          passwordHash: musyrifData.passwordHash,
        });
      } catch (err) {
        logFirestoreError("saveMusyrif", err);
      }
    }
    const list = getLocal("tahfidz_musyrifs", DEFAULT_MUSYRIFS);
    const index = list.findIndex((m) => m.id === musyrifData.id);
    if (index >= 0) {
      list[index] = musyrifData;
    } else {
      list.push(musyrifData);
    }
    setLocal("tahfidz_musyrifs", list);
  },

  async deleteMusyrif(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "musyrif", id));
      } catch (err) {
        logFirestoreError("deleteMusyrif", err);
      }
    }
    const list = getLocal("tahfidz_musyrifs", DEFAULT_MUSYRIFS);
    const updated = list.filter((m) => m.id !== id);
    setLocal("tahfidz_musyrifs", updated);
  },

  // 3. Student Operations
  async getStudents(): Promise<Student[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const list: Student[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Student);
        });

        if (list.length === 0) {
          const initDoc = await getDoc(doc(db, "settings", "students_init"));
          const isInitialized = initDoc.exists() && initDoc.data().initialized === true;

          if (!isInitialized) {
            // Initialize with default students
            for (const s of DEFAULT_STUDENTS) {
              await setDoc(doc(db, "students", s.id), {
                noInduk: s.noInduk,
                nama: s.nama,
                kelasId: s.kelasId,
                musyrifId: s.musyrifId,
                musyrifNama: s.musyrifNama,
              });
              list.push(s);
            }
            await setDoc(doc(db, "settings", "students_init"), { initialized: true });
          }
        }
        return list;
      } catch (err) {
        logFirestoreError("getStudents", err);
      }
    }
    return getLocal("tahfidz_students", DEFAULT_STUDENTS);
  },

  async saveStudent(studentData: Student): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "students", studentData.id), {
          noInduk: studentData.noInduk,
          nama: studentData.nama,
          kelasId: studentData.kelasId,
          musyrifId: studentData.musyrifId,
          musyrifNama: studentData.musyrifNama,
        });
        // Now update counts
        await this.recalculateMusyrifSiswaCount();
      } catch (err) {
        logFirestoreError("saveStudent", err);
      }
    }
    const list = getLocal("tahfidz_students", DEFAULT_STUDENTS);
    const index = list.findIndex((s) => s.id === studentData.id);
    if (index >= 0) {
      list[index] = studentData;
    } else {
      list.push(studentData);
    }
    setLocal("tahfidz_students", list);
    await this.recalculateMusyrifSiswaCount();
  },

  async saveStudentsBatch(studentsData: Student[]): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await Promise.all(
          studentsData.map((s) =>
            setDoc(doc(db, "students", s.id), {
              noInduk: s.noInduk,
              nama: s.nama,
              kelasId: s.kelasId,
              musyrifId: s.musyrifId,
              musyrifNama: s.musyrifNama,
            })
          )
        );
        await this.recalculateMusyrifSiswaCount();
      } catch (err) {
        logFirestoreError("saveStudentsBatch", err);
      }
    }
    const list = getLocal("tahfidz_students", DEFAULT_STUDENTS);
    for (const studentData of studentsData) {
      const index = list.findIndex((s) => s.id === studentData.id);
      if (index >= 0) {
        list[index] = studentData;
      } else {
        list.push(studentData);
      }
    }
    setLocal("tahfidz_students", list);
    await this.recalculateMusyrifSiswaCount();
  },

  async deleteStudent(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "students", id));
        await this.recalculateMusyrifSiswaCount();
      } catch (err) {
        logFirestoreError("deleteStudent", err);
      }
    }
    const list = getLocal("tahfidz_students", DEFAULT_STUDENTS);
    const updated = list.filter((s) => s.id !== id);
    setLocal("tahfidz_students", updated);
    await this.recalculateMusyrifSiswaCount();
  },

  // 4. Capaian Operations
  async getCapaians(): Promise<Capaian[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "capaian"));
        const list: Capaian[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Capaian);
        });
        
        if (list.length === 0) {
          const initDoc = await getDoc(doc(db, "settings", "capaian_init"));
          const isInitialized = initDoc.exists() && initDoc.data().initialized === true;

          if (!isInitialized) {
            // Initialize
            for (const c of DEFAULT_CAPAIAN) {
              await setDoc(doc(db, "capaian", c.id), {
                studentId: c.studentId,
                noInduk: c.noInduk,
                namaSiswa: c.namaSiswa,
                kelasId: c.kelasId,
                kelasNama: c.kelasNama,
                musyrifId: c.musyrifId,
                musyrifNama: c.musyrifNama,
                juz: c.juz,
                capaianAwal: c.capaianAwal,
                capaianAkhir: c.capaianAkhir,
                totalBaris: c.totalBaris,
                juziyyah: c.juziyyah,
                catatan: c.catatan,
                bulan: c.bulan,
                updatedAt: c.updatedAt,
              });
              list.push(c);
            }
            await setDoc(doc(db, "settings", "capaian_init"), { initialized: true });
          }
        }
        return list;
      } catch (err) {
        logFirestoreError("getCapaians", err);
      }
    }
    return getLocal("tahfidz_capaians", DEFAULT_CAPAIAN);
  },

  async clearAllCapaians(): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "capaian"));
        const deletePromises: Promise<void>[] = [];
        querySnapshot.forEach((docSnap) => {
          deletePromises.push(deleteDoc(doc(db, "capaian", docSnap.id)));
        });
        await Promise.all(deletePromises);
        await setDoc(doc(db, "settings", "capaian_init"), { initialized: true });
      } catch (err) {
        logFirestoreError("clearAllCapaians", err);
      }
    }
    setLocal("tahfidz_capaians", []);
  },

  async saveCapaian(capaianData: Capaian): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "capaian", capaianData.id), {
          studentId: capaianData.studentId,
          noInduk: capaianData.noInduk,
          namaSiswa: capaianData.namaSiswa,
          kelasId: capaianData.kelasId,
          kelasNama: capaianData.kelasNama,
          musyrifId: capaianData.musyrifId,
          musyrifNama: capaianData.musyrifNama,
          juz: capaianData.juz,
          capaianAwal: capaianData.capaianAwal,
          capaianAkhir: capaianData.capaianAkhir,
          totalBaris: Number(capaianData.totalBaris),
          juziyyah: capaianData.juziyyah,
          catatan: capaianData.catatan,
          bulan: capaianData.bulan,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        logFirestoreError("saveCapaian", err);
      }
    }
    const list = getLocal("tahfidz_capaians", DEFAULT_CAPAIAN);
    const index = list.findIndex((c) => c.id === capaianData.id);
    const item = { ...capaianData, totalBaris: Number(capaianData.totalBaris), updatedAt: new Date().toISOString() };
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }
    setLocal("tahfidz_capaians", list);
  },

  async deleteCapaian(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "capaian", id));
      } catch (err) {
        logFirestoreError("deleteCapaian", err);
      }
    }
    const list = getLocal("tahfidz_capaians", DEFAULT_CAPAIAN);
    const updated = list.filter((c) => c.id !== id);
    setLocal("tahfidz_capaians", updated);
  },

  // 5. Admin Settings
  async getAdminPassword(): Promise<string> {
    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, "settings", "admin"));
        if (docSnap.exists()) {
          return docSnap.data().adminPassword || DEFAULT_ADMIN_PASSWORD;
        } else {
          await setDoc(doc(db, "settings", "admin"), { adminPassword: DEFAULT_ADMIN_PASSWORD });
          return DEFAULT_ADMIN_PASSWORD;
        }
      } catch (err) {
        logFirestoreError("getAdminPassword", err);
      }
    }
    return getLocal("tahfidz_admin_password", DEFAULT_ADMIN_PASSWORD);
  },

  async updateAdminPassword(newPassword: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "settings", "admin"), { adminPassword: newPassword });
      } catch (err) {
        logFirestoreError("updateAdminPassword", err);
      }
    }
    setLocal("tahfidz_admin_password", newPassword);
  },

  // Helper: Recalculate Musyrif student counts
  async recalculateMusyrifSiswaCount(): Promise<void> {
    const students = getLocal("tahfidz_students", DEFAULT_STUDENTS);
    const musyrifs = getLocal("tahfidz_musyrifs", DEFAULT_MUSYRIFS);

    const updatedMusyrifs = musyrifs.map((m) => {
      const count = students.filter((s) => s.musyrifId === m.id).length;
      return { ...m, jumlahSiswa: count };
    });

    if (isFirebaseConfigured && db) {
      try {
        const promises = updatedMusyrifs.map((m) =>
          setDoc(doc(db, "musyrif", m.id), {
            nik: m.nik,
            nama: m.nama,
            jumlahSiswa: m.jumlahSiswa,
            username: m.username,
            passwordHash: m.passwordHash,
          })
        );
        await Promise.all(promises);
        return;
      } catch (err) {
        logFirestoreError("recalculateMusyrifSiswaCount", err);
      }
    }

    setLocal("tahfidz_musyrifs", updatedMusyrifs);
  }
};
