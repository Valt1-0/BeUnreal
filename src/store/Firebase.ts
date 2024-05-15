// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
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
export const getUsers = async () => {
  const usersRef = collection(db, "users");
  const userSnapshot = await getDocs(usersRef);
  const users = userSnapshot.docs.map((doc) => doc.data());
  return users;
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

export interface Message {
  senderId: string;
  content: string;
  timestamp: typeof serverTimestamp;
  type: "text" | "image" | "voice";
}

interface ParticipantData {
  participantId: string;
  hasDeletedChat: boolean;
  lastReadMessageId: string | null;
  deletedAt: null
}

export const sendMessage = async (chatId: string, message: Message) => {
  const messageRef = collection(db, `chats/${chatId}/messages`);
  return await addDoc(messageRef, {
    ...message,
    timestamp: serverTimestamp(),
  });
};


export const createChat = async (participants: string[]) => {
  const chatRef = collection(db, "chats");

  // Requête pour trouver un chat existant avec les mêmes participants
  const q = query(chatRef, where("participants", "==", participants));
  const querySnapshot = await getDocs(q);

  let chatDocRef;
  if (!querySnapshot.empty) {
    // Le chat existe déjà
    chatDocRef = querySnapshot.docs[0].ref;

    // Vérifiez si l'utilisateur a supprimé le chat
    const participantDataRef = collection(chatDocRef, "participantData");
    const participantDataSnapshot = await getDocs(participantDataRef);
    participantDataSnapshot.docs.forEach(async (doc) => {
      if (doc.data().hasDeletedChat) {
        // Si l'utilisateur a supprimé le chat, mettez à jour l'état
        await updateDoc(doc.ref, { hasDeletedChat: false });
      }
    });
  } else {
    // Le chat n'existe pas, créez-en un nouveau
    chatDocRef = await addDoc(chatRef, { participants });

    const participantDataRef = collection(chatDocRef, "participantData");
    participants.forEach(async (participant) => {
      await addDoc(participantDataRef, {
        participantId: participant,
        hasDeletedChat: false,
        lastReadMessageId: null,
      });
    });
  }

  return chatDocRef;
};
interface Tchat {
  id: string;
  participants: any[];
  latestMessage?: any;
  [key: string]: any;
}

export const getChats = async (
  userId: string,
  callback: (chats: any[]) => void
) => {
  const chatsRef = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId)
  );

  return onSnapshot(chatsRef, async (snapshot) => {
    const chats = [];
    for (let chatDoc of snapshot.docs) {
      const participantDataRef = doc(
        db,
        `chats/${chatDoc.id}/participantData/${userId}`
      );
      const participantDataSnapshot = await getDoc(participantDataRef);
      const participantData = participantDataSnapshot.data() as ParticipantData;
      if (!participantData?.hasDeletedChat) {
        const tchat: Tchat = {
          id: chatDoc.id,
          participants: [],
          ...chatDoc.data(),
        };

        // Récupérer les informations des participants
        tchat.participants = await Promise.all(
          tchat.participants.map(async (participantId: string) => {
            const userRef = doc(db, "users", participantId);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data();
            return { uid: participantId, ...userData };
          })
        );

        // Récupérer le dernier message du chat
        getLatestMessage(chatDoc.id, (message) => {
          tchat.latestMessage = message;
        });
        chats.push(tchat);
      }
    }

    callback(chats);
  });
};

export const getMessages = async (
  chatId: string,
  userId: string,
  callback: (messages: any[]) => void
) => {
  const participantDataRef = doc(
    db,
    `chats/${chatId}/participantData/${userId}`
  );
  const participantDataSnapshot = await getDoc(participantDataRef);
  const deletedAt = participantDataSnapshot.data()?.deletedAt;

let messagesRef;
if (deletedAt) {
  messagesRef = query(
    collection(db, `chats/${chatId}/messages`),
    where("timestamp", ">", deletedAt),
    orderBy("timestamp", "desc")
  );
} else {
  messagesRef = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("timestamp", "desc")
  );
}

  return onSnapshot(messagesRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(messages);
  });
};


export const getLatestMessage = (
  chatId: string,
  callback: (message: Message) => void
) => {
  const messagesRef = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy('timestamp', 'desc'),
    limit(1)
  );

  return onSnapshot(messagesRef, (snapshot) => {
    const message: Message = snapshot.docs[0]?.data() as Message;
    callback(message);
  });
};
