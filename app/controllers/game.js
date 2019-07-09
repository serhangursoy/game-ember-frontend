import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  main: Ember.inject.service('main'),
  service: null,
  queryParams: ['gid'],
  titleMessage: "",
  gid: null,
  board: [0,0,0,0,0,0,0,0,0],
  turn: 1,
  uid: -1,
  isEnded: false,
  winner: null,
  notUserTurn: false,
  isOwner: true,
  didLoad: false,
  Socket:  function(){
    const promise = this.service.fetchGame( this.gid );
    promise.then(this.UpdateGameBoard.bind(this)).catch( ( error ) => {
        console.log( error );
        window.location.href = "/dashboard"
    });
  },
  UpdateGameBoard: function(response){
    let gameData = response.data;
    let stringEq = this.board.join();
    if(gameData.table != stringEq) {
      console.log("New move detected", response.data);
      let newTurn = this.turn==1?2:1;
      let comparer = (parseInt(this.uid) === gameData.p1)?1:2;
      if(newTurn === comparer){
        this.set("notUserTurn", false)
      } else {
        this.set("notUserTurn", true)
      }
      this.set("turn", newTurn);
      this.set("board", gameData.table.split(',').map(Number));
      this.set("didLoad", true);
      this.set("isEnded", gameData.finished);
      this.set("winner", gameData.winner);
      this.notifyPropertyChange('turn');
      this.notifyPropertyChange('isEnded');
      this.notifyPropertyChange('winner');
      this.notifyPropertyChange('didLoad');
      this.notifyPropertyChange('board');
      this.notifyPropertyChange('notUserTurn');
    }
  },
  init: function () {
    this._super();
    this.service =  this.get('main');
    Ember.run.schedule("afterRender",this,function() {
      this.send("initBoard");
    });
    this.set("uid",  this.service.getUserID());
    setInterval(this.Socket.bind(this), 850);
  },
  actions: {
    goToDashboard: function(){
      window.location.href =  "/dashboard"
    },
    initBoard: function(){
      const promise = this.service.fetchGame( this.gid );
      promise.then((response) => {
          let gameData=response.data;
          if((parseInt(this.uid) !== gameData.p1) && (parseInt(this.uid) !== gameData.p2)) window.location.href =  "/dashboard";
          console.log("INIT",gameData);
          this.set("titleMessage", gameData.title);
          if((parseInt(this.uid) === gameData.p1)){
            this.set("isOwner",true);
            if(gameData.turn === 1) {
              this.set("notUserTurn", false)
            } else {
              this.set("notUserTurn", true)
            }
          } else {
            this.set("isOwner",false);
            if(gameData.turn === 2) {
              this.set("notUserTurn", false)
            } else {
              this.set("notUserTurn", true)
            }
          }
          this.set("didLoad", true);
          this.set("isEnded", gameData.finished);
          this.set("winner", gameData.winner);
          this.notifyPropertyChange('isEnded');
          this.notifyPropertyChange('winner');
          this.notifyPropertyChange('titleMessage');
          this.notifyPropertyChange('didLoad');
          this.notifyPropertyChange('isOwner');
          this.notifyPropertyChange('notUserTurn');
      }).catch( ( error ) => {
          console.log( error );
          window.location.href =  "/dashboard"
      });
    },
    cellClick: function(which,event){
      let boardChanged = this.board.slice(0)
      boardChanged[which] = this.turn;
      /* Check if game is ended */
      let finished = false;
      if((which%3) === 1) {
        if(boardChanged[which] === boardChanged[which-1] && boardChanged[which] === boardChanged[which+1]){
          finished = true;
        }
        if(parseInt(which/3) === 0) {
          if (boardChanged[which] === boardChanged[which+3] && boardChanged[which] === boardChanged[which+6]){
            finished = true;
          }
        } else if(parseInt(which/3) === 2) {
          if (boardChanged[which] === boardChanged[which-3] && boardChanged[which] === boardChanged[which-6]){
            finished = true;
          }
        } else {
          if (boardChanged[which] === boardChanged[which-1] && boardChanged[which] === boardChanged[which+1]){
            finished = true;
          } else if (boardChanged[which] === boardChanged[which-2] && boardChanged[which] === boardChanged[which+2]){
            finished = true;
          }  else if (boardChanged[which] === boardChanged[which+2] && boardChanged[which] === boardChanged[which-2]){
            finished = true;
          }
        }
      } else if((which%3) === 0){
        if (boardChanged[which] === boardChanged[which+1] && boardChanged[which] === boardChanged[which+2]){
          finished = true;
        }
        if(parseInt(which/3) === 0) {
          if (boardChanged[which] === boardChanged[which+3] && boardChanged[which] === boardChanged[which+6]){
            finished = true;
          } else if (boardChanged[which] === boardChanged[which+4] && boardChanged[which] === boardChanged[which+8]) {
            finished = true;
          }
        } else if(parseInt(which/3) === 2) {
          if (boardChanged[which] === boardChanged[which-3] && boardChanged[which] === boardChanged[which-6]){
            finished = true;
          } else if (boardChanged[which] === boardChanged[which-2] && boardChanged[which] === boardChanged[which-4]) {
            finished = true;
          }
        } else {
          if (boardChanged[which] === boardChanged[which+3] && boardChanged[which] === boardChanged[which-3]){
            finished = true;
          }
        }
      } else {
        if (boardChanged[which] === boardChanged[which-1] && boardChanged[which] === boardChanged[which-2]){
          finished = true;
        }
        if(parseInt(which/3) === 0) {
          if (boardChanged[which] === boardChanged[which+3] && boardChanged[which] === boardChanged[which+6]){
            finished = true;
          } else if (boardChanged[which] === boardChanged[which+2] && boardChanged[which] === boardChanged[which+4]) {
            finished = true;
          }
        } else if(parseInt(which/3) === 2) {
          if (boardChanged[which] === boardChanged[which-3] && boardChanged[which] === boardChanged[which-6]){
            finished = true;
          } else if (boardChanged[which] === boardChanged[which-8] && boardChanged[which] === boardChanged[which-4]) {
            finished = true;
          }
        } else {
          if (boardChanged[which] === boardChanged[which+3] && boardChanged[which] === boardChanged[which-3]){
            finished = true;
          }
        }
      }
      /**/
      let winner =null;
      if(finished){
        winner = parseInt(this.uid);
        console.log("FINISHED. YOU WON!");
      }

      let stringEq = boardChanged.join();
      let newTurn = this.turn==1?2:1;
      console.log("CELL CLICKED " + newTurn);
      const promise = this.service.updateGame( { table: stringEq, turn: newTurn, winner: winner, finished: finished },  this.gid );
      promise.then( (response) => { console.log("Click event sent. Resp:",response)}).catch( ( error ) => {
          console.log( error );
          window.location.href =  "/dashboard"
      });
    }
  }
});
