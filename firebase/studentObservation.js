import { db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

import { modules as Subjects } from "../assets/js/common.js";

export const getStudentsDataByClassName = async (
  classTitle,
  branchName = null
) => {
  try {
    const results = [];

    const docRef = collection(db, "modules");
    const allUsers = await getDocs(docRef);
    await Promise.all(
      allUsers?.docs?.map(async (doc) => {
        let score = 0;
        const { name, surname, className, branch, userId } = doc.data();

        if (!name || !surname || !className || !userId) {
          return;
        }

        if (
          (branchName && branchName !== branch) ||
          (classTitle && classTitle !== className)
        ) {
          return;
        }

        results.push({
          name,
          surname,
          className,
          branch,
          userId,
          totalScore: score,
        });

        await Promise.all(
          Subjects.map(async (subject) => {
            if (subject === "Kitap") {
              return;
            }
            const moduleRef = collection(docRef, userId, subject);
            const snapshot = await getDocs(moduleRef);
            if (snapshot.empty) {
              return;
            }
            snapshot.forEach((document) => {
              const { solved } = document.data();
              score += parseInt(solved);
            });
            results.find((result) => result.userId === userId).totalScore =
              score;
          })
        );
      })
    );
    results.sort((a, b) => b.totalScore - a.totalScore);

    return results;
  } catch (error) {
    console.log("students data", error.message);
  }
};

export const getStudentDetails = async (id) => {
  if (id === null) return;

  try {
    const modules = [];
    const docRef = doc(db, "modules", id);
    const userDoc = await getDoc(docRef);

    Subjects.map(async (module) => {
      const moduleRef = collection(docRef, module);
      const snapshot = await getDocs(moduleRef);

      if (snapshot?.empty) return;

      snapshot.forEach((doc) => {
        modules.push(
          Object.assign({ id: doc.id, Subject: module, ...doc.data() })
        );
      });
    });

    const user = userDoc.data();

    return { success: true, modules, user };
  } catch (error) {
    console.log("get modules", error.message);
    return { success: false, message: error.message };
  }
};
