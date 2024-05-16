import { db } from "./firebaseConfig.js";
import {
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

import { classes, modules as subjects } from "../assets/js/common.js";

export const createAdminUser = async (username, lastName, TCNO) => {
  try {
    const docRef = await doc(db, "teachers", TCNO);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: false, message: "admin zaten var!" };
    }

    await setDoc(docRef, {
      username,
      lastName,
      TCNO,
    });

    return { success: true };
  } catch (error) {
    console.log(error.message, "createAdminUser");
    return { success: false, message: error.message };
  }
};

export const loginTeachersAdmin = async (username, lastName, tcNo) => {
  try {
    const docRef = doc(db, "teachers", tcNo);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, message: "admin bulunamadı!" };
    }

    const user = docSnap.data();
    if (
      user?.lastName !== lastName ||
      user?.username !== username ||
      user?.TCNO !== tcNo
    ) {
      return { success: false, message: "admin adı veya admin şifre yanlış!" };
    }

    localStorage.setItem("teacher", JSON.stringify(user));

    return { success: true, user };
  } catch (error) {
    console.log(error.message, "loginTeachersAdmin");
  }
};

export const createUser = async (
  name,
  surname,
  className,
  branchName,
  tcNo,
  studentNo
) => {
  try {
    const docRef = await doc(db, "users", tcNo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: false, message: "kullanıcı zaten var!" };
    }

    await setDoc(docRef, {
      name,
      surname,
      className,
      branchName,
      tcNo,
      studentNo,
      RegisterYear: new Date().getFullYear(),
      firstToRegister: true,
    });

    // create a module collection for the user
    const moduleRef = doc(db, "modules", tcNo);
    await setDoc(moduleRef, {
      name: name,
      surname: surname,
      className: className,
      branch: branchName,
      userId: tcNo,
    });

    return { success: true };
  } catch (error) {
    console.log("in auth", error.message);
  }
};

export const loginUser = async (tcNo, studentNo) => {
  try {
    const docRef = doc(db, "users", tcNo);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, message: "kullanıcı bulunamadı!" };
    }

    const user = docSnap.data();
    if (user.studentNo !== studentNo) {
      return { success: false, message: "öğrenci numarası yanlış!" };
    }

    const check = await checkIfUserStillEligible(user);
    if (!check.success && check) {
      return check;
    }

    if (new Date().getMonth() == 7) {
      user.className = classes[classes.indexOf(user.className) + 1];
    }

    localStorage.setItem("user", JSON.stringify(user));

    return { success: true, user };
  } catch (error) {
    console.log("login error", error.message);
  }
};

const checkIfUserStillEligible = async (user) => {
  if (!user) return;
  const userClass = user?.className;
  const month = new Date().getMonth();

  try {
    if (
      (month === 7 && user?.RegisterYear === new Date().getFullYear() - 1) ||
      (month === 7 && user?.firstToRegister === true)
    ) {
      if (userClass === "8.Sınıf") {
        let isDeleted = await deleteUser(user);
        if (isDeleted) {
          return { success: false, message: "Sınıfınız bitti!" };
        }
      } else {
        await setDoc(doc(db, "users", user?.tcNo), {
          ...user,
          className: classes[classes.indexOf(userClass) + 1],
          RegisterYear: new Date().getFullYear(),
          firstToRegister: false,
        });
        await setDoc(doc(db, "modules", user?.tcNo), {
          name: user?.name,
          surname: user?.surname,
          userId: user?.tcNo,
          className: classes[classes.indexOf(userClass) + 1],
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.log("checkIfUserStillEligible", error.message);
    return { success: false, message: error.message };
  }
};

export const deleteUser = async (user) => {
  if (!user) return;

  try {
    subjects.forEach(async (subject) => {
      const docRef = collection(doc(db, "modules", user?.tcNo), subject);
      const docSnap = await getDocs(docRef);

      if (!docSnap.empty) {
        docSnap.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }
    });

    await deleteDoc(doc(db, "modules", user?.tcNo));
    await deleteDoc(doc(db, "users", user?.tcNo));
    await deleteDoc(doc(db, "messages", user?.tcNo));

    localStorage.removeItem("user");
    return true;
  } catch (error) {
    console.log("deleteUser", error.message);
  }
};

export const getAllTeachers = async () => {
  try {
    const docRef = collection(db, "teachers");
    const docSnap = await getDocs(docRef);

    let teachers = [];

    docSnap.forEach((doc) => {
      teachers.push(doc.data());
    });

    return teachers;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteTeacher = async (tcNo) => {
  try {
    const docRef = doc(db, "teachers", tcNo);
    if (!docRef.exists()) {
      return { success: false, message: "Öğretmen bulunamadı!" };
    }
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.log("deleteTeacher", error.message);
  }
};

export const getAllUsers = async () => {
  try {
    const docRef = collection(db, "users");
    const docSnap = await getDocs(docRef);

    let users = [];

    docSnap.forEach((doc) => {
      if (doc.id !== "AdminUsersId") users.push(doc.data());
    });

    return users;
  } catch (error) {
    console.log(error.message);
  }
};

export const loginAdmin = async (username, password) => {
  try {
    const docRef = doc(db, "users", "AdminUsersId");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, message: "Admin kullanıcısı bulunamadı!" };
    } else {
      if (
        docSnap.data()?.password !== password ||
        docSnap.data()?.admin !== username
      ) {
        return {
          success: false,
          message: "admin adı veya admin şifre yanlış!",
        };
      } else {
        return { success: true };
      }
    }
  } catch (error) {
    console.log("loginAdmin", error.message);
  }
};

export const getUser = async (tcNo) => {
  try {
    const docRef = doc(db, "users", tcNo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return { success: false, message: "Kullanıcı bulunamadı!" };
    }
  } catch (error) {
    console.log("getUser", error.message);
  }
};

export const updateUser = async (user) => {
  try {
    const docRef = doc(db, "users", user?.tcNo);
    const moduleRef = doc(db, "modules", user?.tcNo);

    await setDoc(docRef, user);
    await setDoc(moduleRef, {
      name: user?.name,
      surname: user?.surname,
      className: user?.className,
      branch: user?.branchName,
      userId: user?.tcNo,
    });

    return { success: true };
  } catch (error) {
    console.log("updateUser", error.message);
  }
};
