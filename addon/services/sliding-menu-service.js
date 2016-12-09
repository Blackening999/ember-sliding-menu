import Ember from 'ember';

const {
  Service
} = Ember;

/**
 * Share Menu progress manager
 * so you can handle menu state from any controller or component
 */
export default Service.extend({
  menuProgress: 0,
  updateProgress(newProgress) {
    this.set('menuProgress', newProgress);
  }
});
