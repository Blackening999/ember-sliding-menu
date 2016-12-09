import Ember from 'ember';

const {
  Component,
  inject,
  get
} = Ember;

export default Component.extend({
  classNames: ['background-overlay'],
  slidingMenuService: inject.service(),

  click() {
    const slidingMenuService = get(this, 'slidingMenuService');
    slidingMenuService.toggleMenu();
  }
});
