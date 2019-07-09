import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  main: Ember.inject.service('main'),
  titleMessage: "Dashboard",
  newGameTitle: "",
  selectedUser: {},
  userOwnedGames: [],
  userInvitedGames: [],
  users: [],
  service: null,
  fetchUsers: function(response){
    console.log(response);
    if(response.data) {
      let uid = this.service.getUserID();
      let filtered = response.data.filter( user => user.id !== parseInt(uid));
      this.set("users", filtered);
      this.notifyPropertyChange('users');
    }
  },
  randomHash: function(){
    let lenth = 6;
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  },
  createGameCallback: function(response){
    console.log(response);
    if(response.data) {
      this.transitionToRoute('game',  { queryParams: { gid: response.data.id }} );
    }
  },
  fillListCallback:  function(response){
    console.log(response);
    if(response) {
      this.set("userOwnedGames", response.owned_games);
      this.set("userInvitedGames", response.invited_games);
      this.notifyPropertyChange('userOwnedGames');
      this.notifyPropertyChange('userInvitedGames');
    }
  },
  init: function () {
    this._super();
    this.service =  this.get('main');
    Ember.run.schedule("afterRender",this,function() {
      this.send("loginCheck");
      this.send("fillUserInfo");
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
   fillUserInfo: function(){
     const promise = this.service.getUserGames();
     promise.then(this.fillListCallback.bind(this)).catch( ( error ) => {
       console.log( error );
    });
  },
  goToGame: function( game ){
    console.log(game)
     this.transitionToRoute('game', { queryParams: { gid: game.id }});
   },
   logout: function(){
     this.service.logout();
   },
   create: function(){
     console.log("CREATE Requested. With ", this.selectedUser , "and as ", this.newGameTitle);
     const promise = this.service.createGame( this.selectedUser.id, this.newGameTitle );
     promise.then(this.createGameCallback.bind(this)).catch( ( error ) => {
         console.log( error );
     });
   }
 }
});
