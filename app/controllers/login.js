import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  main: Ember.inject.service('main'),
  titleMessage: "Welcome!",
  loginName: "",
  registerName: "",
  errorMessage: "Wrong username",
  haveError: false,
  LoginCallback: function(response) {
    console.log("Logged In. User data ", response.data);
    let self = this;
    if(response.data) {
      this.get('main').loginUser(response.data);
    } else {
      this.set("haveError",true);
    }
  },
  RegisterCallback: function(response) {
    console.log("Registered user. User data ", response.data );
    if(response.data) {
      this.get('main').loginUser(response.data);
    }
  },
  init: function () {
    this._super();
    this.get('main').checkIfLoggedIn();
  },
  actions: {
    login() {
      const promise = this.get('main').getUser(this.loginName);
      promise.then( this.LoginCallback.bind(this) ).catch( ( error ) => {
        console.log( error );
     });
    },
    register() {
      const promise = this.get('main').createUser(this.registerName);
      promise.then( this.RegisterCallback.bind(this) ).catch( ( error ) => {
        console.log( error );
     });
   }
  }
});
