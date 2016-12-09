import Ember from 'ember';
import Movement from '../utils/movement';

const {
  Component,
  inject,
  computed: { oneWay },
  get,
  set,
  $
} = Ember;

/**
 * Sliding menu
 */
export default Component.extend({
  //Menu Progress manager
  slidingMenuService: inject.service(),
  menuProgress: oneWay('slidingMenuService.menuProgress'),

  /**
   * Default options
   */
  classNameBindings: ['slidingElement'],

  //Custom sliding menu class
  slidingElement: 'sliding-menu',
  //Movement instance
  movement: null,
  //Hammer instance
  hammer: null,
  //jQuery instance of sliding element
  $slidingComponent: '',
  //Default application identifier
  appIdentifier: '.ember-application',
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
    const appElement = document.querySelector(appIdentifier);
    const slidingElement = get(this, 'slidingElement');
    const initialWidth = get(this, 'slideDirection') === 'toLeft' ? width : -Math.abs(width);
    const hammer = new Hammer(appElement);

    set(this, 'width', width);

    this.setProperties({
      hammer,
      screenWidth: get(this, 'appElement.offsetWidth'),
      $slidingComponent: $('.' + (slidingElement === '' ?  get(this, 'observableElement') : slidingElement))
    });

    get(this, '$slidingComponent').css({ transform: 'translateX(' + initialWidth + 'px)' });
    get(this, 'hammer').on('panstart', this.handlePanStart.bind(this));
  },

  willDestroyElement() {
    const slidingMenuService = get(this, 'slidingMenuService');

    get(this, 'hammer').destroy();
    slidingMenuService.updateProgress(0);
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

  /**
   * Rendering observer with constraints
   */
   //TODO: refactor
  animateSliding: function() {
    var progress = this.get('menuProgress'),
      translatedProgress = this.get('slideDirection') === 'toLeft' ? progress + 1 : progress - 1;

    if (this.element && this.width) {
      var translate = translatedProgress * this.width;
      this.get('$slidingComponent').css({ transform: 'translateX(' + translate + 'px)' });
      //TODO: for future possible frost glass effect
//      if (additionalElement) {
//        additionalElement.css({ transform: 'translateX(' + (-translate - 40) + 'px)' });
//      }
    }
  }.observes('menuProgress'),

  updateElementProgress() {
    const slidingMenuService = get(this, 'slidingMenuService');
    let newProgress = 0;

    if (this.get('slideDirection') === 'toLeft') {
      newProgress = -Math.abs(Math.max((this.width - this.movement.lastX + this.offset) / this.width, -1));
      if (newProgress >= -1) { slidingMenuService.updateProgress(newProgress); }
    } else {
      newProgress = Math.min((this.movement.lastX  + this.offset) / this.width, 1);
      if (newProgress <= 1) { slidingMenuService.updateProgress(newProgress); }
    }
    this.tick = false;
  },

  /**
   * Complete exapansion of sliding element
   */
  completeExpansion(){
    var progress = this.get('menuProgress'), speed = this.movement.speedX, newProgress = 0,
      inverseConstraint = 0, reverseConstraint = 0,
      movementConstraint = false;

    if (progress === -1 || progress === 0 || progress === 1) {
      return;
    }

    if (this.get('slideDirection') === 'toLeft') {
      inverseConstraint = -1;
      reverseConstraint = 0;
      movementConstraint = speed > 0.5 || speed > 0 && speed < 0.5 && progress < -0.5;
    } else {
      inverseConstraint = 0;
      reverseConstraint = 1;
      movementConstraint = speed > -0.5 || speed >= 0.5 && progress > 0.5;
    }

    if (movementConstraint) {
      newProgress = Math.max(this.get('menuProgress') - this.get('defaultSpeed'), inverseConstraint);
      this.set('menuProgress', newProgress);
    } else {
      newProgress = Math.min(this.get('menuProgress') + this.get('defaultSpeed'), reverseConstraint);
      this.set('menuProgress', newProgress);
    }

    if (newProgress > inverseConstraint && newProgress < reverseConstraint) {
      requestAnimationFrame(this.completeExpansion.bind(this));
    }
    if (newProgress === 0) { this.get('$slidingComponent').css({ visibility: 'hidden' }); }
  }

//  TODO: for future possible frost glass effect
//  $blurredContent: null,
//  initElement: function() {
//    this._super();
//
//    var element = this, blurredScroll = element.get('$slidingComponent').find('.blurred-scroll');
//    Ember.run.later(function() {
//      var contentClone = Ember.$('.screen-content').clone();
//      blurredScroll.append(contentClone);
//      contentClone.css({ transform: 'translateX(-40px)' });
//      element.set('$blurredContent', contentClone);
//    }, 1000);
//
//  }.on('didInsertElement'),
//
//  /**
//   * Rendering observer with constraints
//   */
//  animateSliding: function() {
//    this._super(this.get('$blurredContent'));
//  }.observes('menuProgress')
});
