import Ember from 'ember';
import Movement from '../utils/movement';

const {
  Component,
  inject,
  computed: { alias },
  get,
  set,
  $,
  observer
} = Ember;

/**
 * Sliding menu
 */
export default Component.extend({
  //Menu Progress manager
  slidingMenuService: inject.service(),
  menuProgress: alias('slidingMenuService.menuProgress'),

  /**
   * Default options
   */
  classNameBindings: ['slidingMenuClass'],

  //Custom sliding menu class
  slidingMenuClass: 'sliding-menu',
  //Background overlay class
  backgroundOverlayClass: 'background-overlay',
  //Movement instance
  movement: null,
  //Hammer instance
  hammer: null,
  //jQuery instance of sliding element
  $slidingComponent: '',
  //Default application identifier
  appIdentifier: '.ember-application',
  //menu offset
  menuOffset: 0,
  //initial offset
  offset: 0,
  //Slide direction option
  slideDirection: 'toLeft',
  //Tappable/Pannable zone where animation will invoke
  pannableWidth: 40,
  //Default animation speed
  defaultSpeed: 0.03,

  didInsertElement() {
    const slidingMenuService = get(this, 'slidingMenuService');
    const appIdentifier = get(this, 'appIdentifier');
    const width = get(this, 'element.offsetWidth');
    const menuOffset = get(this, 'menuOffset');
    const appElement = document.querySelector(appIdentifier);
    const backgroundOverlayClass = get(this, 'backgroundOverlayClass');
    const initialWidth = get(this, 'slideDirection') === 'toLeft' ? width : -Math.abs(width);
    const hammer = new Hammer(appElement);

    set(this, 'width', width);

    const $slidingComponent = $('.' + get(this, 'slidingMenuClass'));
    const $backgroundOverlayComponent = $('.' + get(this, 'backgroundOverlayClass'));

    this.setProperties({
      hammer,
      screenWidth: get(appElement, 'offsetWidth'),
      $slidingComponent: $slidingComponent
    });

    //init service
    slidingMenuService.setProperties({
      menuOffset,
      width,
      slidingComponent: $slidingComponent,
      backgroundOverlayComponent: $backgroundOverlayComponent,
      slideDirection: get(this, 'slideDirection'),
      elementExist: !!get(this, 'element'),
    });

    get(this, '$slidingComponent').css({ transform: 'translateX(' + initialWidth + 'px)' });
    get(this, 'hammer').on('panstart', this.handlePanStart.bind(this));
  },

  willDestroyElement() {
    get(this, 'hammer').destroy();
    set(this, 'menuProgress', 0);
  },

  /**
   * Pan start Handler
   * @param event
   */
  handlePanStart(event) {
    event.preventDefault();

    const movement = new Movement(event);
    const progress = get(this, 'menuProgress');
    const slideDirection = get(this, 'slideDirection');
    const width = get(this, 'width');
    const pannableWidth = get(this, 'pannableWidth');

    let newOffset = 0;

    set(this, 'movement', movement);

    if (slideDirection === 'toLeft') {
      const screenWidth = get(this, 'screenWidth');

      if (progress === -1 || movement.initX >= screenWidth - pannableWidth) {
        newOffset = progress === 0 ? Math.abs(width - movement.initX) : movement.initX;
        set(this, 'offset', Math.max(0, newOffset));//TODO: dry
        this.attachHandlers();
      }
    } else if (slideDirection === 'toRight') {
      if (progress === 1 || movement.initX <= pannableWidth) {
        newOffset = progress * this.width - movement.initX;
        set(this, 'offset', Math.max(0, newOffset));//TODO: dry
        this.attachHandlers();
      }
    }
    return false;
  },
  /**
   * Pan move Handler
   * @param event
   */
  handlePanMove(event) {
    event.preventDefault();

    this.movement.push(event);
    if (!this.tick) {
      this.tick = true;
      requestAnimationFrame(this.updateElementProgress.bind(this));
    }
    return false;
  },
  /**
   * Pan end Handler
   * @param event
   */
  handlePanEnd(event) {
    event.preventDefault();

    this.get('hammer').off('panmove', this.handlePanMove);
    this.get('hammer').off('panend', this.handlePanEnd);
    this.completeExpansion();
    return false;
  },

  attachHandlers() {
    this.get('$slidingComponent').css({ visibility: 'visible' });
    this.get('hammer').on('panmove', this.handlePanMove.bind(this));
    this.get('hammer').on('panend', this.handlePanEnd.bind(this));
  },

  updateElementProgress() {
    let newProgress = 0;

    if (this.get('slideDirection') === 'toLeft') {
      newProgress = -Math.abs(Math.max((this.width - this.movement.lastX + this.offset) / this.width, -1));
      if (newProgress >= -1) { set(this, 'menuProgress', newProgress); }
    } else {
      newProgress = Math.min((this.movement.lastX  + this.offset) / this.width, 1);
      if (newProgress <= 1) { set(this, 'menuProgress', newProgress); }
    }
    this.tick = false;
  },

  /**
   * Complete exapansion of sliding element
   */
  completeExpansion() {
    const progress = this.get('menuProgress');
    const speed = this.movement.speedX;
    const defaultSpeed = get(this, 'defaultSpeed');
    let closeConstraint = 0,
      openConstraint = 0,
      movementConstraint = false,
      newProgress = 0;

    if (progress === -1 || progress === 0 || progress === 1) {
      return;
    }

    if (this.get('slideDirection') === 'toLeft') {
      closeConstraint = 0;
      openConstraint = -1;
      movementConstraint = speed > 0.5 || speed > 0 && speed < 0.5 && progress < -0.5;
    } else {
      closeConstraint = 0;
      openConstraint = 1;
      movementConstraint = speed <= -0.5 || progress < 0.5;
    }

    if (movementConstraint) {
      newProgress = Math.max(progress - defaultSpeed, closeConstraint);
    } else {
      newProgress = Math.min(progress + defaultSpeed, openConstraint);
    }

    set(this, 'menuProgress', newProgress);

    if (newProgress > closeConstraint && newProgress < openConstraint) {
      requestAnimationFrame(this.completeExpansion.bind(this));
    }
    if (newProgress === 0) { this.get('$slidingComponent').css({ visibility: 'hidden' }); }
  }
});
