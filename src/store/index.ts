import {
  observable,
  computed,
  action,
  makeObservable,
  runInAction,
} from "mobx";
import { get, set, entries, remove } from "mobx";
import * as firebaseService from "./Firebase";

import { UserService } from "../services/user";
import { FriendsService } from "../services/friends";
const userService = new UserService();
const friendsService = new FriendsService();

export class Store {
  activeUser: any = null;
  loading: boolean = false;
  authCheckComplete: boolean = false;
  items: Map<any, any> = new Map();
  initializationError: any = null;
  users: any[] = [];
  usersNotFollowed: any[] = [];
  tchats: any[] = [];
  tchatMessages: any[] = [];
  followingUsers: any[] = [];
  pendingFriendRequests: any[] = [];
  pendingFriendRequestsRealtime: any[] = [];

  constructor() {
    makeObservable(this, {
      activeUser: observable,
      loading: observable,
      authCheckComplete: observable,
      items: observable,
      initializationError: observable,
      users: observable,
      tchats: observable,
      tchatMessages: observable,
      usersNotFollowed: observable,
      followingUsers: observable,
      pendingFriendRequests: observable,
      authenticatedUser: computed,
      // doCheckAuth: computed,
      getTchatMessages: action,
      getTchatIdByParticipants : action,
      getTchats: action,
      getUsers: action,
      doCreateUser: action,
      doLogin: action,
      doLogout: action,
      loadData: action,
      // addItem: action,
      // deleteItem: action,
      doCreateChat: action,
      doSendMessage: action,
      //doGetUsersNotFollowed: action,
      doFollowUser: action,
      doGetFollowingUsers: action,
      //doGetPendingFriendsRequests: action,
      doAcceptFriendRequest: action,
      doRejectFriendRequest: action,
      pendingFriendRequestsRealtime: observable,
      doGetPendingFriendRequestsRealtime: action,
      doUnFollow: action,
      doSaveBeReal: action,
      doGetBeReal: action,
    });

    this.getUsers = this.getUsers.bind(this);
    this.initializeStore().then((u: any) => {
      this.activeUser = u;
      this.authCheckComplete = true;
    });
  }

  handleAuthedUser = async (_authUser: any) => {
    if (_authUser) {
      let userAcctInfo = await userService.getUserProfile();
      console.log("setting active user");
      this.activeUser = { ..._authUser, ...userAcctInfo };

      await this.loadData();
    } else {
      this.activeUser = _authUser;
    }
    return this.activeUser;
  };

  async initializeStore() {
    return userService
      .authCheck(this.handleAuthedUser)
      .then((_user: any) => {
        return _user;
      })
      .catch((e: any) => {
        return runInAction(() => {
          this.initializationError = e;
        });
      });
  }

  // get doCheckAuth() {
  //   if (firebaseService.getCurrentUser()) {
  //     return this.activeUser;
  //   } else {
  //     return null;
  //   }
  // }

  getTchatMessages(_chatId: string, _userID: string) {
    return firebaseService.getMessages(_chatId, _userID, (messages: any[]) => {
      console.log(messages);
      runInAction(() => {
        this.tchatMessages = messages;
      });
    });
  }
  get authenticatedUser() {
    return this.activeUser || null;
  }

  async getTchatIdByParticipants(_participants: string[]) {
    try {
      if (this.activeUser?.uid && _participants.length > 0) {
        const participants = [..._participants, this.activeUser.uid];
        const chatId = await firebaseService.getChatIdByParticipants(
          participants
        );
        return chatId;
      } else return null;
    } catch (error) {
      console.error("Error getting chat id: ", error);
      return null;
    }
  }

  getTchats() {
    firebaseService.getChats(this.activeUser?.uid, (chats: any[]) => {
      // Handle the chats data here
      console.log(chats);
      runInAction(() => {
        this.tchats = chats;
      });
    });
    return this.tchats;
  }

  async getUsers(username?: string) {
    try {
      const users = await userService.getUsers(username);
      console.log("userss :", users);
      runInAction(() => {
        this.users = users;
      });
      return users;
    } catch (error) {
      console.error("Error getting users: ", error);
      return null;
    }
  }

  doLogin(_username: string, _password: string) {
    if (_username.length) {
      return userService
        .loginWithEmail(_username, _password)
        .then(
          async (_result: any) => {
            return _result;
          },
          (err: any) => {
            console.log(err);
            return err;
          }
        )
        .catch((e: any) => {
          console.log(e);
          return e;
        });
    }
  }

  async doCreateUser(_params: any) {
    try {
      let newUser = await userService.registerUser({
        email: _params.email,
        password: _params.password,
        username: _params.username,
      });
      return newUser;
    } catch (err) {
      debugger;
      console.log(err);
      return err;
    }
  }

  doLogout() {
    this.activeUser = null;
    return userService.logOut();
  }

  loadData() {
    return userService
      .queryObjectCollection({ collectionName: "items" })
      .then(
        (_result: any) => {
          return runInAction(() => {
            let resultMap = _result.reduce((map: any, obj: any) => {
              map[obj.id] = obj;
              return map;
            }, {});
            this.items = resultMap;
            return resultMap;
          });
        },
        (err: any) => {
          console.log(err);
          return err;
        }
      )
      .catch((e: any) => {
        console.log(e);
        return e;
      });
  }

  // addItem(_data: any) {
  //   return firebaseService
  //     .addObjectToCollection({ collectionName: "items", objectData: _data })
  //     .then(
  //       (_result: any) => {
  //         return runInAction(() => {
  //           set(this.items, _result.id, _result);
  //           return _result;
  //         });
  //       },
  //       (err: any) => {
  //         console.log(err);
  //         return err;
  //       }
  //     )
  //     .catch((e: any) => {
  //       console.log(e);
  //       return e;
  //     });
  // }

  // deleteItem(_data: any) {
  //   return firebaseService
  //     .removeObjectFromCollection({ collection: "items", objectId: _data.id })
  //     .then(
  //       (_result: any) => {
  //         return runInAction(() => {
  //           remove(this.items, _data.id);
  //           return true;
  //         });
  //       },
  //       (err: any) => {
  //         console.log(err);
  //         return err;
  //       }
  //     )
  //     .catch((e: any) => {
  //       console.log(e);
  //       return e;
  //     });
  // }

  async doCreateChat(_participants: string[]) {
    try {
      return await firebaseService.createChat(_participants);
    } catch (err) {
      return err;
    }
  }

  async doSendMessage(
    _chatId: string,
    _message: firebaseService.Message,
    _imageFile: File
  ) {
    try {
      return await firebaseService.sendMessage(_chatId, _message, _imageFile);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  // doGetUsersNotFollowed(_status?: string, lastUser?: DocumentSnapshot) {
  //   try {
  //     // Appeler getUsersFollowWithStatus et stocker la fonction de désinscription
  //     const unsubscribe =
  //       firebaseService.getUsersFollowWithStatus(
  //         this.activeUser.uid,
  //         _status,
  //         lastUser,
  //         (users) => {
  //           // Mettre à jour usersNotFollowed chaque fois que les utilisateurs sont modifiés
  //           runInAction(() => {
  //             this.usersNotFollowed = users;
  //           });
  //         }
  //       );

  //     // Retourner la fonction de désinscription pour permettre d'arrêter l'écoute des modifications
  //     return unsubscribe;
  //   } catch (err) {
  //     console.error("Error getting users: ", err);
  //     return null;
  //   }
  // }

  async doFollowUser(_userId: string) {
    try {
      await friendsService.sendFriendRequest(this.activeUser.uid, _userId);
      return true;
    } catch (err) {
      console.error("Error following user: ", err);
      return false;
    }
  }

  doGetFollowingUsers = (_userId?: string) => {
    const useruid = _userId || this.activeUser.uid;
    const unsubscribe = friendsService.getFollowing(useruid, (users) => {
      runInAction(() => {
        this.followingUsers = users;
      });
    });

    // Stocker la fonction de désinscription pour pouvoir arrêter l'écoute plus tard
    return unsubscribe;
  };

  doGetUsersNotFollowed() {
    try {
      // Appeler getUsersFollowWithStatus et stocker la fonction de désinscription
      const unsubscribe = friendsService.getUnfollowedUsersWithPendingStatus(
        this.activeUser.uid,
        (users) => {
          // Mettre à jour usersNotFollowed chaque fois que les utilisateurs sont modifiés
          runInAction(() => {
            this.usersNotFollowed = users;
          });
        }
      );

      // Retourner la fonction de désinscription pour permettre d'arrêter l'écoute des modifications
      return unsubscribe;
    } catch (err) {
      console.error("Error getting users: ", err);
      return null;
    }
  }

  // async doGetPendingFriendsRequests() {
  //   const useruid = this.activeUser.uid;
  //   try {
  //     const users = await firebaseService.getPendingFriendRequests(useruid);
  //     runInAction(() => {
  //       this.pendingFriendRequests = users;
  //     });
  //     return users;
  //   } catch (err) {
  //     console.error("Error to get following user: ", err);
  //     return null;
  //   }
  // }

  async doAcceptFriendRequest(_userId: string) {
    try {
      await friendsService.acceptFriendRequest(this.activeUser.uid, _userId);
      return true;
    } catch (err) {
      console.error("Error to accept friend request: ", err);
      return false;
    }
  }

  async doRejectFriendRequest(_userId: string) {
    try {
      await friendsService.rejectFriendRequest(this.activeUser.uid, _userId);
      return true;
    } catch (err) {
      console.error("Error to reject friend request: ", err);
      return false;
    }
  }
  doGetPendingFriendRequestsRealtime() {
    if (this.activeUser) {
      friendsService.getPendingFriendRequestsRealtime(
        this.activeUser.uid,
        (requests: any[]) => {
          runInAction(() => {
            this.pendingFriendRequestsRealtime = requests;
          });
        }
      );
    }
  }

  async doUnFollow(unfollowUserId: string) {
    console.log("test unfollow");
    try {
      return await friendsService.unfollowUser(
        this.activeUser.uid,
        unfollowUserId
      );
    } catch (err) {
      console.error("Error to unfollow user: ", err);
      return false;
    }
  }

  async doSaveBeReal(
    location: { latitude: number; longitude: number },
    imageUrl: string
  ) {
    try {
      await firebaseService.saveBeReal(this.activeUser.uid, location, imageUrl);
      return true;
    } catch (err) {
      console.error("Error to save be real: ", err);
      return false;
    }
  }

  async doGetBeReal(_userId?: string) {
    try {
      const userId = _userId || this.activeUser.uid;
      return await firebaseService.getBeReal(userId);
    } catch (err) {
      console.error("Error to get be real: ", err);
      return null;
    }
  }
}
