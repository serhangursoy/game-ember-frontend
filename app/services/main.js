import Service from '@ember/service';
import axios from 'axios';
import { inject as service } from '@ember/service';

const BASE_URL = "http://localhost:3000";

export default Service.extend({
  cookies: service(),
  getUser( username ) {
       const url = BASE_URL+ "/users/" + username;
       return axios.get(url).then(  response  => response.data);
  },
  getAllUsers( ) {
       const url = BASE_URL+ "/users/";
       return axios.get(url).then(response  => response.data);
  },
  createUser( username ) {
        const url = BASE_URL+ "/users";
        return axios.post(url, { username: username }).then(  response  => response.data);
  },
  createGame( cid, title ) {
        let cookieService = this.get('cookies');
        let uid = cookieService.read('uid');
        const url = BASE_URL+ "/games";
        return axios.post(url, { table: "0,0,0,0,0,0,0,0,0", p1: uid, p2:cid, title: title, turn: 1, finished: false, winner: null }).then(  response  => response.data);
  },
  updateGame( newState, gid ){
    const url = BASE_URL+ "/games/" + gid;
    return axios.put(url, { table: newState.table , turn: newState.turn, finished: newState.finished, winner: newState.winner }).then(response  => response.data);
  },
  fetchGame( gid ){
      const url = BASE_URL+ "/games/" + gid;
      return axios.get(url).then(response  => response.data);
  },
  getUserGames(){
    let cookieService = this.get('cookies');
    let uid = cookieService.read('uid');
    const url = BASE_URL+ "/games/user/" + uid;
    return axios.get(url).then(response  => response.data);
  },
  checkAuth(){
    let cookieService = this.get('cookies');
    if (!cookieService.exists('uid')) {
      window.location.href = "/login";
    }
  },
  checkIfLoggedIn(){
    let cookieService = this.get('cookies');
    if (cookieService.exists('uid')) {
      window.location.href = "/dashboard";
    }
  },
  getUserID(){
    let cookieService = this.get('cookies');
    return cookieService.read('uid');
  },
  loginUser(user){
    let cookieService = this.get('cookies');
    cookieService.write('uid', user.id);
    cookieService.write('uname', user.username);
    window.location.href = "/dashboard";
  },
  logout(){
    let cookieService = this.get('cookies');
    cookieService.clear('uid');
    cookieService.clear('uname');
    window.location.href = "/login";
  }
});
