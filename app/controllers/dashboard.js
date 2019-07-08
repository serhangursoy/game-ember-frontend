import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  main: Ember.inject.service('main'),
  titleMessage: "Dashboard",
  newGameTitle: "",
  selectedUser: {},
  users: [],
  service: null,
  fetchUsers: function(response){
    console.log(response);
    if(response.data) {
      this.set("users", response.data);
      this.notifyPropertyChange('users');
    }
  },
  init: function () {
    this._super();
    this.service =  this.get('main');
    Ember.run.schedule("afterRender",this,function() {
      this.send("loginCheck");
    });
  },
  actions: {
   loginCheck: function() {
     console.log("Checking credentials..");
     this.service.checkAuth();
     console.log("PASS - You are cool");
     const promise = this.service.getAllUsers();
     promise.then(this.fetchUsers.bind(this)).catch( ( error ) => {
       console.log( error );
    });
   },
   create: function(){
     console.log("CREATE Requested. With ", this.selectedUser , "and as ", this.newGameTitle);
   }
 }
});
