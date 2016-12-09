import Ember from 'ember';

const {
  Mixin,
  inject,
  $,
  get
} = Ember;

export default Ember.Mixin.create({
  slidingMenuService: inject.service(),

  closeMenu() {
    const slidingMenuService = get(this, 'slidingMenuService');
    slidingMenuService.set('menuProgress', 0);
    // $('.sliding-menu').css({ visibility: 'hidden' });
  },

  /**
   * Transition and Close menu
   * Support transitionFromMenu and works as internal action
   * E.g. you want to invalidate session and call this method in order to close menu
   * on logout action
   */
  transitionAndCloseMenu() {
    this.transitionToRoute.apply(this, arguments);
    this.closeMenu();
  },
  actions: {
    /**
     * Public way for close menu when transitioning out
     * Useful when you want to transition somewhere by clicking
     * menu item and close menu as well.
     */
    transitionFromMenu() {
      this.transitionAndCloseMenu.apply(this, arguments);
    },

    /**
      * Close menu when transitioning by default
    */
    didTransition() {
      this.closeMenu();
      return true;
    }
  }
});
