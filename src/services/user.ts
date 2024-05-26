
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  DocumentReference,
  Timestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  startAt,
  endAt,
  limit,
  DocumentSnapshot,
  writeBatch,
  serverTimestamp,
  Firestore,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  FirebaseStorage,
} from "firebase/storage";
import { Auth } from "firebase/auth";
import config from "./../config";



export class UserService {
  firebaseConfig = config.firebaseConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  storage = getStorage(this.app);

  authCheck = async (
    _handleAuthedUser: (user: User | null) => Promise<any>
  ) => {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user != null) {
          console.log("We are authenticated now!");
          return resolve(await _handleAuthedUser(user));
        } else {
          console.log("We did not authenticate.");
          _handleAuthedUser(null);
          return resolve(null);
        }
      });
    });
  };
}