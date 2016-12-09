import Ember from 'ember';

const {
  Component,
  inject,
  get,
  set,
  $,
  computed: { alias }
} = Ember;

export default Component.extend({
  slidingMenuService: inject.service(),

  tagName: 'a',
  menuProgress: alias('slidingMenuService.menuProgress'),
  slidingMenuClass: 'sliding-menu',

  speed: 0.04,

  slideDirection: 'toRight',

  click() {
    //TODO: go native instead
    const speed = get(this, 'speed');
    const progress = get(this, 'menuProgress');
    const $slidingMenu = $('.' + get(this, 'slidingMenuClass'));
    const slideDirection = get(this, 'slideDirection');

    let newSpeed = speed;

    if (progress === -1) {
      newSpeed = Math.abs(newSpeed);
    } else if (progress === 1) {
      newSpeed = -Math.abs(newSpeed);
    } else if (slideDirection === 'toRight') {
      newSpeed = Math.abs(newSpeed);
    } else if (slideDirection === 'toLeft') {
      newSpeed = -Math.abs(newSpeed);
    }

    set(this, 'speed', newSpeed);
    $slidingMenu.css({ visibility: 'visible' });
    requestAnimationFrame(this.updateMenuProgress.bind(this));
  },

  updateMenuProgress() {
    const speed = get(this, 'speed');
    const progress = get(this, 'menuProgress');
    const slideDirection = get(this, 'slideDirection');
    let newProgress = 0;

    if (slideDirection === 'toLeft') {
      newProgress = Math.min(Math.max(-1, progress + speed), 0);
    } else {
      newProgress = Math.min(Math.max(0, progress + speed), 1);
    }

    set(this, 'menuProgress', newProgress);

    if (newProgress === 0) {
      const $slidingMenu = $('.' + get(this, 'slidingMenuClass'));
      $slidingMenu.css({ visibility: 'hidden' });
    } else if (newProgress !== -1 && newProgress !== 1) {
      requestAnimationFrame(this.updateMenuProgress.bind(this));
    }
  }
});
