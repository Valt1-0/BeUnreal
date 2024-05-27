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

export class FriendsService {
  firebaseConfig = config.firebaseConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  storage = getStorage(this.app);

  sendFriendRequest = async (currentUserId: string, friendUserId: string) => {
    await setDoc(
      doc(
        collection(this.db, "friendRequests"),
        `${currentUserId}_${friendUserId}`
      ),
      {
        from: currentUserId,
        to: friendUserId,
        status: "pending", // La demande est en attente d'acceptation
      }
    );
  };

  unfollowUser = async (currentUserId: string, unfollowUserId: string) => {
    try {
      // Supprimer unfollowUserId de la liste des personnes suivies par currentUserId
      const followingDoc = doc(
        this.db,
        "users",
        currentUserId,
        "following",
        unfollowUserId
      );
      await deleteDoc(followingDoc);

      // Supprimer currentUserId de la liste des followers de unfollowUserId
      const followerDoc = doc(
        this.db,
        "users",
        unfollowUserId,
        "followers",
        currentUserId
      );
      await deleteDoc(followerDoc);

      console.log(
        "L'utilisateur a été supprimé de la liste d'amis avec succès."
      );
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de l'utilisateur de la liste d'amis: ",
        error
      );
    }
  };

  acceptFriendRequest = async (currentUserId: string, friendUserId: string) => {
    let batch = writeBatch(this.db);

    // Ajouter friendUserId à la liste des followers de currentUserId
    let followerDoc1 = doc(
      this.db,
      "users",
      currentUserId,
      "followers",
      friendUserId
    );
    batch.set(followerDoc1, {});

    // Ajouter currentUserId à la liste des followers de friendUserId
    let followerDoc2 = doc(
      this.db,
      "users",
      friendUserId,
      "followers",
      currentUserId
    );
    batch.set(followerDoc2, {});

    // Ajouter currentUserId à la liste des personnes suivies par friendUserId
    let followingDoc1 = doc(
      this.db,
      "users",
      friendUserId,
      "following",
      currentUserId
    );
    batch.set(followingDoc1, {});

    // Ajouter friendUserId à la liste des personnes suivies par currentUserId
    let followingDoc2 = doc(
      this.db,
      "users",
      currentUserId,
      "following",
      friendUserId
    );
    batch.set(followingDoc2, {});

    // Supprimer la demande d'ami de la collection "friendRequests"
    let friendRequestDoc = doc(
      this.db,
      "friendRequests",
      `${friendUserId}_${currentUserId}`
    );
    batch.delete(friendRequestDoc);

    // Commit the batch
    await batch.commit();

    // const friendRequestDoc = doc(
    //   collection(db, "friendRequests"),
    //   `${friendUserId}_${currentUserId}`
    // );
    // await updateDoc(friendRequestDoc, {
    //   status: "accepted",
    // });
  };

  rejectFriendRequest = async (currentUserId: string, friendUserId: string) => {
    // Supprimer la demande d'ami de la collection "friendRequests"
    await deleteDoc(
      doc(
        collection(this.db, "friendRequests"),
        `${friendUserId}_${currentUserId}`
      )
    );
  };

  getPendingFriendRequestsRealtime = (
    userId: string,
    callback: (requests: any[]) => void
  ) => {
    return onSnapshot(
      query(
        collection(this.db, "friendRequests"),
        where("to", "==", userId),
        where("status", "==", "pending")
      ),
      async (snapshot) => {
        const requests = await Promise.all(
          snapshot.docs.map(async (docRequest) => {
            const requestData = docRequest.data();
            const userSnapshot = await getDoc(
              doc(this.db, "users", requestData.from)
            );
            const userData = userSnapshot.data();
            const username = userData?.username || "";

            return {
              id: docRequest.id,
              from: requestData.from,
              to: requestData.to,
              status: requestData.status,
              username: username,
              uuid: requestData.to,
            };
          })
        );
        callback(requests);
      }
    );
  };

  getFollowing = (userId: string, callback: (following: any) => void) => {
    const unsubscribe = onSnapshot(
      collection(this.db, "users", userId, "following"),
      async (followingSnapshot) => {
        const following = await Promise.all(
          followingSnapshot.docs.map(async (docFollow) => {
            const userSnapshot = await getDoc(
              doc(this.db, "users", docFollow.id)
            );
            const userData = userSnapshot.data();
            const username = userData?.username || "";

            return {
              uid: docFollow.id,
              username: username,
            };
          })
        );

        callback(following);
      }
    );

    // Retourner la fonction de désinscription pour permettre d'arrêter l'écoute des modifications
    return unsubscribe;
  };

  getUnfollowedUsersWithPendingStatus = async (
    currentUserId: string,
    callback: (users: any) => void
  ) => {
    // Obtenir la liste des demandes de suivi en attente
    const unsubscribeRequests = onSnapshot(
      collection(this.db, "friendRequests"),
      async (snapshot) => {
        // Obtenir la liste des utilisateurs suivis
        let followingUsers: any[] = await new Promise((resolve) => {
          const unsubscribe = this.getFollowing(currentUserId, (following) => {
            resolve(following);
            unsubscribe();
          });
        });

        interface RequestData {
          uuid: string;
          from: string;
          status: string;
          to: string;
          // Ajoutez ici d'autres propriétés si nécessaire
        }
        const pendingRequests = snapshot.docs
          .map((doc) => ({ uuid: doc.id, ...doc.data() } as RequestData))
          .filter(
            (request) =>
              request.from === currentUserId && request.status === "pending"
          );
        const pendingUserIds = pendingRequests.map((request) => request.to);

        // Obtenir tous les utilisateurs
        const unsubscribeUsers = onSnapshot(
          collection(this.db, "users"),
          (userSnapshot) => {
            const allUsers = userSnapshot.docs.map((doc) => ({
              uid: doc.id,
              ...doc.data(),
            }));

            // Ajouter le statut de suivi à tous les utilisateurs
            const usersWithStatus = allUsers.map((user) => {
              if (
                followingUsers.some(
                  (followingUser) => followingUser.uid === user.uid
                )
              ) {
                return {
                  ...user,
                  status: "followed",
                };
              } else if (pendingUserIds.includes(user.uid)) {
                return {
                  ...user,
                  status: "pending",
                };
              } else {
                return {
                  ...user,
                  status: "notFollowed",
                };
              }
            });
            callback(usersWithStatus);
          }
        );

        // Retourner la fonction de désinscription pour permettre d'arrêter l'écoute des modifications
        return () => {
          unsubscribeRequests();
          unsubscribeUsers();
        };
      }
    );
  };
}
