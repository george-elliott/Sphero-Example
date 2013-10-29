var WallItem = Chute.View.extend({
  template: JST['wall/wall_item'],
  append: true,
  bindings: {

  },
  events: {
    'click .asset': 'openLightbox'
  },
  initialize: function() {
    this.listenToOnce(this, 'render', _.bind(function(){
      this.asset = new ItemView({model: this.model, parent: this, size: 'w/300' });
      this.asset.render();
    }, this));
  },

  openLightbox: function(e) {
    if(!detect.isMobile()) new Lightbox({ model: this.model, view: this, gallery: this.parent.options.name }).render();
  },

  remove: function() {
    this.asset.destroy();
    delete this.asset;
  }
});