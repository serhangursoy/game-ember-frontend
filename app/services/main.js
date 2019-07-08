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
  checkAuth(){
    let cookieService = this.get('cookies');
    if (!cookieService.exists('uid')) {
      window.location.href = "/login";
    }
  },
  loginUser(user){
    let cookieService = this.get('cookies');
    cookieService.write('uid', user.id);
    cookieService.write('uname', user.username);
    window.location.href = "/dashboard";
  }
});
