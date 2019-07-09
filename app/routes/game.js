import Route from '@ember/routing/route';

export default Route.extend({
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('model', model);
  },
  model(params) {
   return {gid: params};
 }
});
