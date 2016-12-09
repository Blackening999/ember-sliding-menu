/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-sliding-menu',
  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/hammerjs/hammer.js');
  },
  isDevelopingAddon: function() {
		return true;
	}
};
