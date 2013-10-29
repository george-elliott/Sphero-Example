var PopularTab = Chute.View.extend({
  container: 'div.tabs',
  template: JST['tabs/popular'],

  initialize: function() {
    this.listenToOnce(this, 'render', this.setupWall);
  },

  setupWall: function() {
    this.wall = new Wall({
      parent: this,
      collection: Display.collections.popular,
      name: 'popular',
      masonry: {
        gutter: 10
      }
    });

    this.wall.render();
  },

  remove: function() {
    this.wall.destroy();
    delete this.wall;
  }
});