import {
  observable,
  computed,
  action,
  makeObservable,
  runInAction,
} from "mobx";
import { get, set, entries, remove } from "mobx";
import * as firebaseService from "./Firebase";
import { DocumentSnapshot, serverTimestamp } from "firebase/firestore";
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
      doCheckAuth: computed,
      itemEntries: computed,
      getTchatMessages: action,
      getTchats: action,
      getUsers: action,
      doCreateUser: action,
      doLogin: action,
      doLogout: action,
      loadData: action,
      itemByKey: action,
      addItem: action,
      deleteItem: action,
      doCreateChat: action,
      doSendMessage: action,
      doGetUsersNotFollowed: action,
      doFollowUser: action,
      doGetFollowingUsers: action,
      doGetPendingFriendsRequests: action,
      doAcceptFriendRequest: action,
      doRejectFriendRequest: action,
      pendingFriendRequestsRealtime: observable,
      doGetPendingFriendRequestsRealtime: action,
    });

    this.getUsers = this.getUsers.bind(this);
    this.initializeStore().then((u: any) => {
      this.activeUser = u;
      this.authCheckComplete = true;
    });
  }

  handleAuthedUser = async (_authUser: any) => {
    if (_authUser) {
      let userAcctInfo = await firebaseService.getUserProfile();
      console.log("setting active user");
      this.activeUser = { ..._authUser, ...userAcctInfo };

      await this.loadData();
    } else {
      this.activeUser = _authUser;
    }
    return this.activeUser;
  };

  async initializeStore() {
    return firebaseService
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

  get doCheckAuth() {
    if (firebaseService.getCurrentUser()) {
      return this.activeUser;
    } else {
      return null;
    }
  }

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

  get itemEntries() {
    return entries(this.items);
  }

  async getUsers(username?: string) {
    try {
      const users = await firebaseService.getUsers(username);
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
  itemByKey(_key: any) {
    return get(this.items, _key);
  }

  doLogin(_username: string, _password: string) {
    if (_username.length) {
      return firebaseService
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
      let newUser = await firebaseService.registerUser({
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
    return firebaseService.logOut();
  }

  loadData() {
    return firebaseService
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

  addItem(_data: any) {
    return firebaseService
      .addObjectToCollection({ collectionName: "items", objectData: _data })
      .then(
        (_result: any) => {
          return runInAction(() => {
            set(this.items, _result.id, _result);
            return _result;
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

  deleteItem(_data: any) {
    return firebaseService
      .removeObjectFromCollection({ collection: "items", objectId: _data.id })
      .then(
        (_result: any) => {
          return runInAction(() => {
            remove(this.items, _data.id);
            return true;
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

  async doGetUsersNotFollowed(_status?: string, lastUser?: DocumentSnapshot) {
    try {
      const users = await firebaseService.getUsersFollowWithStatus(
        this.activeUser.uid,
        _status
      );

      runInAction(() => {
        this.usersNotFollowed = users;
      });
      return users;
    } catch (err) {
      console.error("Error getting users: ", err);
      return null;
    }
  }

  async doFollowUser(_userId: string) {
    try {
      await firebaseService.sendFriendRequest(this.activeUser.uid, _userId);
      return true;
    } catch (err) {
      console.error("Error following user: ", err);
      return false;
    }
  }

  async doGetFollowingUsers(_userId?: string) {
    const useruid = _userId || this.activeUser.uid;
    try {
      const users = await firebaseService.getFollowing(useruid);
      runInAction(() => {
        this.followingUsers = users;
      });
      return users;
    } catch (err) {
      console.error("Error to get following user: ", err);
      return null;
    }
  }

  async doGetPendingFriendsRequests() {
    const useruid = this.activeUser.uid;
    try {
      const users = await firebaseService.getPendingFriendRequests(useruid);
      runInAction(() => {
        this.pendingFriendRequests = users;
      });
      return users;
    } catch (err) {
      console.error("Error to get following user: ", err);
      return null;
    }
  }

  async doAcceptFriendRequest(_userId: string) {
    try {
      await firebaseService.acceptFriendRequest(this.activeUser.uid, _userId);
      return true;
    } catch (err) {
      console.error("Error to accept friend request: ", err);
      return false;
    }
  }

  async doRejectFriendRequest(_userId: string) {
    try {
      await firebaseService.rejectFriendRequest(this.activeUser.uid, _userId);
      return true;
    } catch (err) {
      console.error("Error to reject friend request: ", err);
      return false;
    }
  }
  doGetPendingFriendRequestsRealtime() {
    if (this.activeUser) {
      console.log("testtt")
    firebaseService.getPendingFriendRequestsRealtime(
      this.activeUser.uid,
      (requests: any[]) => {
        runInAction(() => {
          this.pendingFriendRequestsRealtime = requests;
        });
      }
    );
    }

  }
}
