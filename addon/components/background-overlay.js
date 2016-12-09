import Ember from 'ember';

const {
  Component,
  inject,
  get
} = Ember;

export default Component.extend({
  slidingMenuService: inject.service(),

  tagName: 'a',

  click() {
    const slidingMenuService = get(this, 'slidingMenuService');
    slidingMenuService.toggleMenu();
  }
});
