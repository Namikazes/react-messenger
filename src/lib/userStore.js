import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firebase';

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoadind: true,
  fetchUserInfo: async (uid) => {
    if(!uid) return set({currentUser: null, isLoadind:false});
    try{
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            set({currentUser:docSnap.data(), isLoadind: false})
        } else {
            set({currentUser:null, isLoadind: false})
        }
    } catch(err) {
        console.log(err);
        return set({currentUser: null, isLoadind:false});
    }
  }
}))