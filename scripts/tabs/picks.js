var PicksTab = Chute.View.extend({
  container: 'div.tabs',
  template: JST['tabs/picks'],

  initialize: function() {
    this.listenToOnce(this, 'render', this.setupWall);
  },

  setupWall: function() {
    /*this.wall = new Wall({
      parent: this,
      collection: Display.collections.picks,
      name: 'picks',
      masonry: {
        gutter: 10
      }
    });

    this.wall.render();*/
  },

  remove: function() {
//    this.wall.destroy();
//    delete this.wall;
  }
});