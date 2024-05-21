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

const user = localStorage.getItem("user");
if (!user) {
  window.location.href = "./index.html";
}
const currentUser = JSON.parse(user);

export const createModule = async (
  module,
  subject,
  tarih,
  solved,
  correct = 0,
  wrong = 0
) => {
  if (!currentUser || !module || !tarih || !solved) {
    alert("Lütfen tüm alanları doldurunuz.");
    return;
  }

  try {
    const docRef = doc(db, "modules", currentUser.tcNo);
    const moduleRef = collection(docRef, module);

    await addDoc(moduleRef, {
      name: subject,
      tarih: tarih,
      solved: solved,
      correct: correct,
      wrong: wrong,
    });
  } catch (error) {
    console.log("module creation", error.message);
  }
};

export const getModules = async (module) => {
  if (!currentUser || !module) {
    return;
  }

  try {
    const modules = [];
    const docRef = doc(db, "modules", currentUser.tcNo);
    const moduleRef = collection(docRef, module);
    const snapshot = await getDocs(moduleRef);

    snapshot.forEach((doc) => {
      modules.push(Object.assign({ id: doc.id, ...doc.data() }));
    });

    return { success: true, modules };
  } catch (error) {
    console.log("get modules", error.message);
    return { success: false, message: error.message };
  }
};

export const deleteModule = async (module, id) => {
  if (!currentUser || !module || !id) {
    return;
  }

  try {
    const docRef = doc(db, "modules", currentUser.tcNo);
    const moduleRef = doc(docRef, module, id);
    await deleteDoc(moduleRef);
  } catch (error) {
    console.log("delete module", error.message);
  }
};

export const getStudentsTotalScoreLeaderBoard = async (
  branchName = null,
  sinif = null
) => {
  const results = [];

  if (!currentUser) {
    return;
  }

  try {
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
          (sinif && sinif !== className)
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
    console.log("leaderboard", error.message);
  }
};

// export const createMessage = async (message, sender = "", tcNo) => {
//   if (!currentUser || !message || !tcNo) {
//     return;
//   }

//   try {
//     const docRef = doc(db, "messages", tcNo);
//     const inboxRef = collection(docRef, "inbox");

//     await addDoc(inboxRef, {
//       message: message,
//       sender,
//       to: tcNo,
//       read: false,
//       date: new Date().toLocaleString(),
//     });

//     return true;
//   } catch (error) {
//     console.log("create message", error.message);
//     return false;
//   }
// };

export const getMessages = async () => {
  if (!currentUser) {
    return;
  }

  try {
    let messages = [];
    const docRef = doc(db, "messages", currentUser?.tcNo);
    const inboxRef = collection(docRef, "inbox");
    const snapshot = await getDocs(inboxRef);

    snapshot.forEach((doc) => {
      messages.push(Object.assign({ id: doc.id, ...doc.data() }));
    });

    messages = messages.sort((a, b) => {
      return new Date(b?.date) - new Date(a?.date);
    });

    return messages;
  } catch (error) {
    console.log("get messages", error.message);
  }
};

export const updateMessage = async (id) => {
  if (!currentUser || !id) {
    return;
  }

  try {
    const docRef = doc(db, "messages", currentUser?.tcNo);
    const inboxRef = doc(docRef, "inbox", id);
    const message = await getDoc(inboxRef);

    if (message.exists()) {
      setDoc(inboxRef, { ...message.data(), read: true });
    }
  } catch (error) {
    console.log("update message", error.message);
  }
};
