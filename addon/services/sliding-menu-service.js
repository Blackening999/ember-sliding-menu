import Ember from 'ember';

const {
  Service,
  computed,
  $,
  get
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
  slidingElement: '',

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
    const $slidingComponent = $('.' + get(this, 'slidingElement'));
    const menuOffset = get(this, 'menuOffset');

    if (this.elementExist && this.width) {
      const translate = translatedProgress * this.width - menuOffset;
      $slidingComponent.css({ transform: 'translateX(' + translate + 'px)' });
    }
  }
});
