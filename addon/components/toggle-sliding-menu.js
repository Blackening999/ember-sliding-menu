import Ember from 'ember';

const {
  Component,
  inject,
  computed: { oneWay }
} = Ember;

export default Component.extend({
  slidingMenuService: inject.service(),

  tagName: 'a',

  progressManager: null,
  menuProgress: oneWay('slidingMenuService.menuProgress'),
  speed: 0.04,
  slidingMenu: 'sliding-menu',
  $slidingMenu: null,

  click() {
    this.$slidingMenu = Ember.$('.' + this.get('slidingMenu'));
    this.speed = this.get('menuProgress') === -1 ? Math.abs(this.get('speed')) : -Math.abs(this.get('speed'));
    this.$slidingMenu.css({ visibility: 'visible' });
    requestAnimationFrame(this.updateMenuProgress.bind(this));
  },

  updateMenuProgress() {
    var newProgress = Math.min(Math.max(-1, this.get('menuProgress') + this.speed), 0);

    this.progressManager.updateProgress(newProgress);
    if (newProgress !== 0 && newProgress !== -1) {
      requestAnimationFrame(this.updateMenuProgress.bind(this));
    } else if (newProgress === 0) {
      this.$slidingMenu.css({ visibility: 'hidden' });
    }
  }
});
