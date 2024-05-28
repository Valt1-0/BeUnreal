// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  startAt,
  endAt,
  limit,
  serverTimestamp,
  
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import config from "./../config";
import * as geofire from "geofire-common";

const firebaseConfig = config.firebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export const getBeReal = async (uid: string) => {
  const q = query(collection(db, "BeReal"), where("uid", "==", uid), orderBy("timestamp", "desc"));
  
  const querySnapshot = await getDocs(q);
  const beRealData:any[] = [];
  querySnapshot.forEach((doc) => {
    beRealData.push(doc.data());
  });
  return beRealData;
};

export const saveBeReal = async (
  uid: string,
  location: { latitude: number; longitude: number },
  imageUrl: string
) => {
  const timestamp = serverTimestamp();
  const timestampUrl = Date.now();
  const hash = geofire.geohashForLocation([location.latitude, location.longitude]);
  // Upload the image to Firebase Storage
  const storageRef = ref(storage, `users/${uid}/beunreal/${timestampUrl}.jpeg`);
  await uploadString(storageRef, imageUrl, "data_url");
  const url = await getDownloadURL(storageRef);

  // Save the image data to Firestore
  const docData = {
    uid,
    timestamp,
    hash,
    location,
    url,
  };

  await addDoc(collection(db, "BeReal"), docData);
};

export const getNearbyNonFollowedUnBeReal = async (
  currentUserId: string,
  currentLocation: { latitude: number; longitude: number }
) => {
  // Récupérer la liste des personnes suivies par l'utilisateur actuel
const followersCollection = collection(db, "users", currentUserId, "following");
const followerDocs = await getDocs(followersCollection);
const followedUsers = followerDocs.docs.map((doc) => doc.id); 

  // Définir le centre et le rayon pour la requête geohash
  const center: geofire.Geopoint = [
    currentLocation.latitude,
    currentLocation.longitude,
  ];
  const radiusInM = 30 * 1000;

  // Obtenir les limites de la requête geohash
  const bounds = geofire.geohashQueryBounds(center, radiusInM);
  const promises = [];
  for (const b of bounds) {
    const q = query(
      collection(db, "BeReal"),
      orderBy("hash"),
      startAt(b[0]),
      endAt(b[1])
    );
    promises.push(getDocs(q));
  }

  // Collecter tous les résultats de la requête dans une seule liste
  const snapshots = await Promise.all(promises);


  const matchingDocs = [];
  for (const snap of snapshots) {
    for (const snapDoc of snap.docs) {
      const location = snapDoc.get("location");

      // Nous devons filtrer quelques faux positifs en raison de la précision du geohash,
      // mais la plupart correspondront
      const distanceInKm = geofire.distanceBetween(
        [location.latitude, location.longitude],
        center
      );
      const distanceInM = distanceInKm * 1000;

      if (
        distanceInM <= radiusInM &&
        !followedUsers.includes(snapDoc.data().uid) &&
        snapDoc.data().uid !== currentUserId
      ) {
        // Récupérer les informations supplémentaires de l'utilisateur
        const userDoc = await getDoc(doc(db, "users", snapDoc.data().uid));
        const userData = userDoc.data();
        matchingDocs.push({ ...snapDoc.data(), ...userData });
      }
    }
  }
  return matchingDocs;
};

export const getFollowBeUnReal = async (userId: string) => {
  try {
    // Récupérer la liste des personnes que l'utilisateur suit
    const followingSnapshot = await getDocs(
      collection(db, "users", userId, "following")
    );
    const following = followingSnapshot.docs.map((doc) => doc.id);

    // Récupérer les BeReal de chaque personne suivie
    const friendsBeRealPromises = following.map(async (friendId: string) => {
      const q = query(
        collection(db, "BeReal"),
        where("uid", "==", friendId),
        orderBy("timestamp", "desc")
      );
      const beRealDocs = await getDocs(q);

      // Récupérer les informations de l'utilisateur
      const userDoc = await getDoc(doc(db, "users", friendId));
      const userData = userDoc.data();

      // Ajouter les informations de l'utilisateur aux données BeReal
      return beRealDocs.docs.map((doc) => ({
        ...doc.data(),
        user: userData,
      }));
    });

    const friendsBeRealSnapshots = await Promise.all(friendsBeRealPromises);

    // Convertir les snapshots en données
    const friendsBeReal = friendsBeRealSnapshots.map((snapshot) => {
      return snapshot;
    });

    return friendsBeReal;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des BeReal des amis: ",
      error
    );
  }
};

export const uploadImage = async (blob: Blob) => {
  let currentUserId = auth.currentUser!.uid;
  const storageRef = ref(
    storage,
    `${currentUserId}/${new Date().getTime()}-${currentUserId}.jpeg`
  );

  const snapshot = await uploadBytesResumable(storageRef, blob);

 
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
  timestamp?: Timestamp | null;
  type: "text" | "image" | "voice";
}

interface ParticipantData {
  participantId: string;
  hasDeletedChat: boolean;
  lastReadMessageId: string | null;
  deletedAt: null;
}

export const sendMessage = async (
  chatId: string,
  message: Message,
  imageFile?: File
) => {
  if (imageFile && message.type === "image") {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // Attendre que le téléchargement soit terminé
    await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          resolve(null);
        }
      );
    });

    // Obtenir l'URL de téléchargement
    message.content = await getDownloadURL(uploadTask.snapshot.ref);
  }
  const participantDataRef = collection(db, `chats/${chatId}/participantData`);
  const participantDataSnapshot = await getDocs(participantDataRef);
  participantDataSnapshot.docs.forEach(async (doc) => {
    if (doc.data().hasDeletedChat) {
      // Si un participant a supprimé la conversation, mettez hasDeletedChat à false
      await updateDoc(doc.ref, { hasDeletedChat: false });
    }
  });

  const messageRef = collection(db, `chats/${chatId}/messages`);
  return await addDoc(messageRef, {
    ...message,
    timestamp: new Timestamp(Date.now() / 1000, 0),
  });
};

export const deleteUserChat = async (userId: string, chatId: string) => {
  const participantDataRef = collection(db, `chats/${chatId}/participantData`);
  const participantSnapshot = await getDocs(participantDataRef);
  const userDoc = participantSnapshot.docs.find(
    (doc) => doc.data().participantId === userId
  );

  if (userDoc) {
    await updateDoc(userDoc.ref, { hasDeletedChat: true });
  } else {
    console.log("User not found in participantData");
  }
};



export const createChat = async (_participants: string[]) => {
  const chatRef = collection(db, "chats");
const participants = [..._participants].sort();
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
export const getChats = (userId: string, callback: (chats: any[]) => void) => {
  const chatsRef = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId)
  );

  let chats: any[] = [];
  let unsubscribeFunctions: (() => void)[] = [];

  const unsubscribe = onSnapshot(chatsRef, (snapshot): void => {
    // Désabonner des mises à jour précédentes
    unsubscribeFunctions.forEach((unsub) => unsub());
    unsubscribeFunctions = [];

    snapshot.docs.forEach((chatDoc) => {
      const participantDataRef = collection(
        db,
        `chats/${chatDoc.id}/participantData`
      );

      getDocs(participantDataRef).then((participantDataSnapshot) => {
        const userDoc = participantDataSnapshot.docs.find(
          (doc) => doc.data().participantId === userId
        );

        if (userDoc) {
          const unsub = onSnapshot(userDoc.ref, (docSnapshot) => {
            const hasDeletedChat = docSnapshot.data()?.hasDeletedChat;

            if (!hasDeletedChat) {
              const tchat: Tchat = {
                id: chatDoc.id,
                participants: [],
                ...chatDoc.data(),
              };

              // Récupérer les informations des participants
              Promise.all(
                tchat.participants.map((participantId: string) => {
                  const userRef = doc(db, "users", participantId);
                  return getDoc(userRef).then((userSnapshot) => {
                    const userData = userSnapshot.data();
                    return { uid: participantId, ...userData };
                  });
                })
              ).then((participants) => {
                tchat.participants = participants;

                // Récupérer le dernier message du chat en temps réel
                const messagesRef = collection(
                  db,
                  `chats/${chatDoc.id}/messages`
                );
                const unsubMessage = onSnapshot(
                  query(messagesRef, orderBy("timestamp", "desc"), limit(1)),
                  (messageSnapshot) => {
                    if (!messageSnapshot.empty) {
                      tchat.latestMessage = messageSnapshot.docs[0].data();
                    }
                  }
                );

                unsubscribeFunctions.push(unsubMessage);

                chats.push(tchat);
                callback(chats);
              });
            } else {
              // Si le chat a été supprimé, le supprimer du tableau
              chats = chats.filter((chat) => chat.id !== chatDoc.id);
              callback(chats);
            }
          });

          unsubscribeFunctions.push(unsub);
        }
      });
    });
  });

  // Retourner la fonction de désabonnement
  return () => {
    unsubscribe();
    unsubscribeFunctions.forEach((unsub) => unsub());
  };
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

  return onSnapshot(messagesRef, async (snapshot) => {
    const messages = await Promise.all(
      snapshot.docs.map(async (fetchdoc) => {
        const messageData = fetchdoc.data();
        const userDocRef = doc(db, `users/${messageData.senderId}`);
        const userSnapshot = await getDoc(userDocRef);
        const userData = userSnapshot.data();

        return {
          id: fetchdoc.id,
          ...messageData,
          username: userData?.username, // ou toute autre information de l'utilisateur que vous voulez inclure
        };
      })
    );

    callback(messages);
  });
};

export const getLatestMessage = (
  chatId: string,
  callback: (message: Message) => void
) => {
  const messagesRef = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  return onSnapshot(messagesRef, (snapshot) => {
    const message: Message = snapshot.docs[0]?.data() as Message;
    callback(message);
  });
};


export const getChatIdByParticipants = async (
  participants: string[]
): Promise<{ tChatID: string | null; usernames: string[] }> => {
  const chatRef = collection(db, "chats");

  // Trier les participants
  const sortedParticipants = [...participants].sort();

  // Requête pour trouver un chat existant avec les mêmes participants
  const q = query(chatRef, where("participants", "==", sortedParticipants));
  const querySnapshot = await getDocs(q);

  // Récupérer les noms d'utilisateur des participants
  const usernames = await Promise.all(
    participants.map(async (participantId) => {
      const userSnapshot = await getDoc(doc(db, "users", participantId));
      return userSnapshot.data()?.username || null;
    })
  );

  if (!querySnapshot.empty) {
    // Le chat existe déjà, retourner son id
    return { tChatID: querySnapshot.docs[0].id, usernames };
  } else {
    // Le chat n'existe pas
    return { tChatID: null, usernames };
  }
};

