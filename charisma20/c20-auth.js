/* Charisma20 shared Firebase module. ONE app + auth + db for every page on this site.
   Firebase Auth already remembers the login in the browser (IndexedDB), per origin.
   Importing the same instance everywhere is what makes every page see it. */
import {initializeApp,getApps,getApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,onAuthStateChanged,GoogleAuthProvider,signInWithPopup,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig={apiKey:"AIzaSyCY0tkVIUqGjO_6ayWJWLHNcRUpDls5VZ8",authDomain:"grace-might-and-magicks.firebaseapp.com",projectId:"grace-might-and-magicks",appId:"1:449279853302:web:fdef6375c84605bcf5a2d7"};

export const app=getApps().length?getApp():initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);

export const login=()=>signInWithPopup(auth,new GoogleAuthProvider());
export const logout=()=>signOut(auth);
export const isReal=u=>!!u&&!u.isAnonymous;      // signed in with Google, not anonymous
export {onAuthStateChanged};

// Resolves once Firebase has restored (or failed to restore) the saved session.
export const ready=new Promise(res=>{const off=onAuthStateChanged(auth,u=>{off();res(u)})});
