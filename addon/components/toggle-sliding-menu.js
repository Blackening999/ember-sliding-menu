import Ember from 'ember';

const {
  Component,
  inject,
  get,
  set,
  $,
  computed: { oneWay }
} = Ember;

export default Component.extend({
  slidingMenuService: inject.service(),

  tagName: 'a',
  menuProgress: oneWay('slidingMenuService.menuProgress'),
  speed: 0.04,
  slidingMenuClass: 'sliding-menu',
  $slidingMenu: null,

  click() {
    //TODO: go native instead
    const speed = get(this, 'speed');
    const progress = get(this, 'menuProgress');
    const $slidingMenu = get(this, '$slidingMenu');

    set(this, '$slidingMenu', $('.' + get(this, 'slidingMenuClass')));
    set(this, 'speed', progress === -1 ? Math.abs(speed) : -Math.abs(speed));
    $slidingMenu.css({ visibility: 'visible' });
    requestAnimationFrame(this.updateMenuProgress.bind(this));
  },

  updateMenuProgress() {
    const slidingMenuService = get(this, 'slidingMenuService');
    const speed = get(this, 'speed');
    const progress = get(this, 'menuProgress');
    const $slidingMenu = get(this, '$slidingMenu');

    let newProgress = Math.min(Math.max(-1, progress + speed), 0);

    slidingMenuService.updateProgress(newProgress);

    if (newProgress !== 0 && newProgress !== -1) {
      requestAnimationFrame(this.updateMenuProgress.bind(this));
    } else if (newProgress === 0) {
      $slidingMenu.css({ visibility: 'hidden' });
    }
  }
});
