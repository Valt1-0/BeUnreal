// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

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
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  DocumentReference,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8EbcRqe4j-xjvvg3LZZpvqt9IDlhdpZo",
  authDomain: "beunreal-b282b.firebaseapp.com",
  projectId: "beunreal-b282b",
  storageBucket: "beunreal-b282b.appspot.com",
  messagingSenderId: "77689837748",
  appId: "1:77689837748:web:ac91383f37bb08de6b9fe1",
  measurementId: "G-NKSDGM23J6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const authCheck = async (
  _handleAuthedUser: (user: User | null) => Promise<any>
) => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
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

export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const logOut = () => {
  return signOut(auth);
};

interface UserInfo {
  username: string;
  email: string;
  password: string;
}

export const registerUser = (userInfo: UserInfo) => {
  console.log("in registerUser");
  return createUserWithEmailAndPassword(
    auth,
    userInfo.email,
    userInfo.password
  ).then((newUser) => {
    let { email, username } = userInfo;

return setDoc(doc(db, "users", newUser.user.uid), {
  email,
  username,
}).then(() => {
  return { ...newUser.user, username };
});
  });
};

export const getUserProfile = async () => {
  let user = auth.currentUser;
  console.log(user);

  var userRef = doc(db, "users", user!.uid);

  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return {
      ...docSnap.data(),
      id: user!.uid,
    };
  } else {
    console.log("No such document!", user!.uid);
    return null;
  }
};

interface QueryParams {
  collectionName: string;
}
interface Result {
  id: string;
  data: any;
}

export const queryObjectCollection = async ({
  collectionName,
}: QueryParams) => {
  let currentUserId = auth.currentUser!.uid;
  let collectionRef = collection(db, collectionName);

  let results: Result[] = [];

  const querySnapshot = await getDocs(collectionRef);
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      data: doc.data(),
    });
  });

  return results;
};

interface AddObjectParams {
  collectionName: string;
  objectData: any;
}

export const addObjectToCollection = async ({
  collectionName,
  objectData,
}: AddObjectParams) => {
  let currentUserId = auth.currentUser!.uid;
  let collectionRef = collection(db, collectionName);

  const docRef = await addDoc(collectionRef, {
    owner: currentUserId,
    content: { ...objectData },
    created: new Date().getTime(),
    updated: new Date().getTime(),
  });

  console.log(`addObjectToCollection ${collection} ${docRef}`);

  const docSnap = await getDoc(docRef);
  return { ...docSnap.data(), id: docRef.id };
};

interface RemoveObjectParams {
  collection: string;
  objectId: string;
}

export const removeObjectFromCollection = async ({
  collection,
  objectId,
}: RemoveObjectParams) => {
  let currentUserId = auth.currentUser!.uid;
  let docRef = doc(db, collection, objectId);

  await deleteDoc(docRef);

  console.log(`removeObjectFromCollection ${collection} ${objectId}`);
  return true;
};

export const getByRef = async (_documentRef: DocumentReference) => {
  const docSnap = await getDoc(_documentRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), id: _documentRef.id };
  } else {
    console.log("No such document!");
    return null;
  }
};

export const uploadImage = async (blob: Blob) => {
  let currentUserId = auth.currentUser!.uid;
  const storageRef = ref(
    storage,
    `${currentUserId}/${new Date().getTime()}-${currentUserId}.jpeg`
  );

  const snapshot = await uploadBytesResumable(storageRef, blob);

  console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

  const downloadURL = await getDownloadURL(snapshot.ref);

  return {
    url: downloadURL,
    contentType: snapshot.metadata.contentType,
    name: snapshot.metadata.name,
    size: snapshot.metadata.size,
  };
};
