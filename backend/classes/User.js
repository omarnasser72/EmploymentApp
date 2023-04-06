class User {
  id;
  email;
  password;
  phone;
  status;

  constructor() {
    if (this.constructor === User) {
      throw new Error("this class can't be instantiate");
    }
  }

  logIn(email, password) {}
  logOut(email, password) {}
}
