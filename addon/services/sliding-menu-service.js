import Ember from 'ember';

const {
  Service,
  computed
} = Ember;

/**
 * Share Menu progress manager
 * so you can handle menu state from any controller or component
 */
export default Service.extend({


  //TODO: refactor to computed get/set
  menuProgress: 0,
  updateProgress(newProgress) {
    this.set('menuProgress', newProgress);
  }
});
