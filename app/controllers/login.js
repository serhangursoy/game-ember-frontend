import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  main: Ember.inject.service('main'),
  titleMessage: "Welcome!",
  loginName: "",
  registerName: "",
  LoginCallback: function(response) {
    console.log("Logged In. User data ", response.data);
    if(response.data) {
      this.get('main').loginUser(response.data);
    }
  },
  RegisterCallback: function(response) {
    console.log("Registered user. User data ", response.data );
    if(response.data) {
      this.get('main').loginUser(response.data);
    }
  },
  actions: {
    login() {
      console.log("Login with ", this.loginName);
      const promise = this.get('main').getUser(this.loginName);
      promise.then( this.LoginCallback.bind(this) ).catch( ( error ) => {
        console.log( error );
     });
    },
    register() {
      console.log("Register with " + this.registerName);
      const promise = this.get('main').createUser(this.registerName);
      promise.then( this.RegisterCallback.bind(this) ).catch( ( error ) => {
        console.log( error );
     });
   }
  }
});
