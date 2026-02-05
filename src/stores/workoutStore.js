import { defineStore } from "pinia";
import { auth, db, googleProvider } from "@/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export const useWorkoutStore = defineStore("workout", {
  state: () => ({
    user: null, // 
    userData: {
      completedDays: [], // 
      weights: {} // 
    },
    selectedDay: null,
    selectedExercise: null,
    loading: false, // 
  }),

  getters: {
    currentWorkoutType: (state) => {
      const types = ["Push", "Pull", "Legs"];
      return state.selectedDay !== null ? types[state.selectedDay % 3] : "";
    },
    // دالة لمعرفة هل اليوم مكتمل أم لا
    isDayCompleted: (state) => (dayIndex) => {
      return state.userData.completedDays.includes(dayIndex);
    }
  },

  actions: {
    // 1. مراقبة حالة تسجيل الدخول (يتم استدعاؤها في main.js أو App.vue)
    initAuth() {
      onAuthStateChanged(auth, async (user) => {
        this.user = user;
        if (user) {
          await this.fetchUserData();
        } else {
          this.userData = { completedDays: [], weights: {} };
        }
      });
    },

    // 2. تسجيل الدخول بجوجل
    async loginUser() {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error("Login Error:", error);
      }
    },

    // 3. تسجيل الخروج
    async logoutUser() {
      await signOut(auth);
      this.user = null;
      this.userData = { completedDays: [], weights: {} };
    },

    // 4. جلب بيانات المستخدم من Firestore
    async fetchUserData() {
      if (!this.user) return;
      this.loading = true;
      const docRef = doc(db, "users", this.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.userData = docSnap.data();
      } else {
        // إذا كان مستخدم جديد، ننشئ له ملفاً فارغاً
        await setDoc(docRef, { completedDays: [], weights: {} });
      }
      this.loading = false;
    },

    // 5. حفظ الأوزان ليوم محدد
    async saveDayWeights(dayIndex, weightsObj) {
      if (!this.user) return alert("Please login to save progress!");
      
      const docRef = doc(db, "users", this.user.uid);
      // نستخدم النقطة للوصول لحقل متداخل (Nested Field) داخل الـ Map
      const updateData = {};
      updateData[`weights.day-${dayIndex}`] = weightsObj;

      await updateDoc(docRef, updateData);
    },

    // 6. تعليم اليوم كمكتمل
    async markDayComplete(dayIndex) {
      if (!this.user) return;
      
      // تحديث الواجهة فوراً
      if (!this.userData.completedDays.includes(dayIndex)) {
        this.userData.completedDays.push(dayIndex);
      }

      // تحديث الداتابيز
      const docRef = doc(db, "users", this.user.uid);
      await updateDoc(docRef, {
        completedDays: arrayUnion(dayIndex)
      });
    },

    selectDay(day) {
      this.selectedDay = day;
    },
    selectExercise(name) {
      this.selectedExercise = name;
    },
    closeExercise() {
      this.selectedExercise = null;
    },
  },
});
