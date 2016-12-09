import Ember from 'ember';

const {
  Service,
  computed,
  $,
  get,
  inject,
  set
} = Ember;

/**
 * Sliding Menu manager
 * so you can handle menu state from any controller or component
 */
export default Service.extend({
  slideDirection: 'toLeft',
  width: 0,
  elementExist: false,
  menuOffset: 0,
  slidingMenuClass: '',
  backgroundOverlayClass: '',

  slidingComponent: null,
  backgroundOverlayComponent: null,
  speed: 0.04,

  menuProgress: computed({
    set(_, newProgress) {
      this.didProgressUpdated();
      return newProgress;
    },
    get() {
      return 0;
    }
  }),

  didProgressUpdated() {
    const progress = this.get('menuProgress');
    const translatedProgress = this.get('slideDirection') === 'toLeft' ? progress + 1 : progress - 1;
    const $slidingComponent = get(this, 'slidingComponent');
    const backgroundOverlayComponent = get(this, 'backgroundOverlayComponent');
    const menuOffset = get(this, 'menuOffset');

    if (this.elementExist && this.width) {
      const translate = translatedProgress * this.width - menuOffset;
      $slidingComponent.css({ transform: 'translateX(' + translate + 'px)' });
      backgroundOverlayComponent.css({ visibility: progress === 0 ? 'hidden' : 'visible' });
    }
  },

  toggleMenu() {
    //TODO: go native instead
    const speed = get(this, 'speed');
    const progress = get(this, 'menuProgress');
    const $slidingMenu = get(this, 'slidingComponent');
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
      const $slidingMenu = get(this, 'slidingComponent');
      $slidingMenu.css({ visibility: 'hidden' });
    } else if (newProgress !== -1 && newProgress !== 1) {
      requestAnimationFrame(this.updateMenuProgress.bind(this));
    }
  }
});
