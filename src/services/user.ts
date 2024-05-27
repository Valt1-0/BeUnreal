
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  updateCurrentUser,
  signInWithCredential,
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
import { Auth,EmailAuthProvider } from "firebase/auth";
import config from "./../config";

interface AddObjectParams {
  collectionName: string;
  objectData: any;
}
  interface UserInfo {
    username: string;
    email: string;
    password: string;
  }
interface QueryParams {
  collectionName: string;
}
interface Result {
  id: string;
  data: any;
}
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
  getUsers = async (username?: string) => {
    const usersRef = collection(this.db, "users");
    let q;

    if (username) {
      q = query(
        usersRef,
        orderBy("username"),
        startAt(username),
        endAt(username + "\uf8ff")
      );
    } else {
      q = usersRef;
    }

    const userSnapshot = await getDocs(q);
    const users = userSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
    console.log("users: ", users);
    return users;
  };

  loginWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(this.auth, email, password);
  };

  getCurrentUser = () => {
    return this.auth.currentUser;
  };

  logOut = () => {
    return signOut(this.auth);
  };

  registerUser = async (userInfo: UserInfo) => {
    console.log("in registerUser");
    return createUserWithEmailAndPassword(
      this.auth,
      userInfo.email,
      userInfo.password
    ).then((newUser) => {
      let { email, username } = userInfo;
      let userId = newUser.user.uid;

      // Create an array of folder paths to be created
      const folders = [
        `users/${userId}/beunreal/.empty`,
        `users/${userId}/profile/.empty`,
      ];

      // Function to create empty folders
      const createEmptyFolder = async (path: string) => {
        const folderRef = ref(this.storage, path);
        await uploadString(folderRef, ""); // Uploading an empty string creates a folder
      };

      // Create all empty folders
      return Promise.all(folders.map(createEmptyFolder)).then(() => {
        // Set user document in Firestore
        return setDoc(doc(this.db, "users", userId), { email, username }).then(
          () => {
            return { ...newUser.user, username };
          }
        );
      });
    });
  };

  updateUser = async (userId: string, updatedInfo: Partial<UserInfo>) => {
    const userRef = doc(this.db, "users", userId);

    return updateDoc(userRef, updatedInfo)
      .then(() => {
        console.log("User updated");
      })
      .catch((error) => {
        console.error("Error updating user: ", error);
      });
  };

  deleteUser = async (userId: string) => {
    const userRef = doc(this.db, "users", userId);

    // Supprimer l'utilisateur de Firestore
    await deleteDoc(userRef);

    // Supprimer l'utilisateur de Firebase Authentication
    const user = this.auth.currentUser;
    if (user && user.uid === userId) {
      // Demander à l'utilisateur de se reconnecter
      const credential = await this.reauthenticateUser();
      if (credential) {
        await signInWithCredential(this.auth, credential);
        await user.delete();
      }
    }

    console.log("User deleted");
  };

  reauthenticateUser = async () => {
    // Demander à l'utilisateur de fournir à nouveau ses identifiants
    const password = prompt("Please enter your password") || ""; // Provide a default value for password if the user cancels the prompt
    const user = this.auth.currentUser;
    if (user && user.email) { // Check if user.email is not null
      const credential = EmailAuthProvider.credential(user.email, password);
      return credential;
    }
    return null;
  };

  getUserProfile = () => {
    let user = this.auth.currentUser;
    console.log(user);

    var userRef = doc(this.db, "users", user!.uid);

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
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
    });

    // Retourner la fonction de désabonnement pour permettre d'arrêter l'écoute des mises à jour
    return unsubscribe;
  };

  queryObjectCollection = async ({ collectionName }: QueryParams) => {
    let currentUserId = this.auth.currentUser!.uid;
    let collectionRef = collection(this.db, collectionName);

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
}