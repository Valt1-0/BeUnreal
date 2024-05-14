import { observable, computed, action, makeObservable, runInAction } from "mobx";
import { get, set, entries, remove } from "mobx";
import * as firebaseService from "./Firebase";

export class Store {
  activeUser: any = null;
  loading: boolean = false;
  authCheckComplete: boolean = false;
  items: Map<any, any> = new Map();
  initializationError: any = null;

  constructor() {
       makeObservable(this, {
      activeUser: observable,
      loading: observable,
      authCheckComplete: observable,
      items: observable,
      initializationError: observable,
      authenticatedUser: computed,
      doCheckAuth: computed,
      itemEntries: computed,
      doCreateUser: action,
      doLogin: action,
      doLogout: action,
      loadData: action,
      itemByKey: action,
      addItem: action,
      deleteItem: action,
    });

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

  get authenticatedUser() {
    return this.activeUser || null;
  }

  get itemEntries() {
    return entries(this.items);
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
        firstName: _params.firstName,
        lastName: _params.lastName,
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
}

