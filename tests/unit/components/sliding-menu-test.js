import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('sliding-menu', 'SlidingMenuComponent', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('is a button tag', function(assert) {
  assert.equal('DIV', this.$().prop('tagName'));

  this.subject().teardownSlidingMenu();
});
