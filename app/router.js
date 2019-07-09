import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('dashboard',{ path: '/' });
  this.route('dashboard');
  this.route('game',function() {
    this.route('game', { path: '/:hash' });
    this.route('login', { path: '/' });
  });
});

export default Router;
