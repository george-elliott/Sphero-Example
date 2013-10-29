var Wall = Chute.Display.extend({
  template: JST['wall/wall'],
  plugin: 'masonry',
  bindings: {
    items: 'div.wall-item',
    loadingIcon: 'div.loading',
    loadButton: 'a.load-more'
  },
  itemView: WallItem,
  events: {
    'click a.load-more': function(e) {
      e.preventDefault();
      var assetCount = this.collection.length;

      this.bindings.loadingIcon.removeClass('hidden');
      $(e.target).hide();
      this.collection.nextPage({

        remove: false,
        success: _.bind(function() {
          this.bindings.loadingIcon.addClass('hidden');
          if (this.collection.length >= assetCount + this.collection.perPage()) {
            $(e.target).show();
          }
          fb.resize();
        }, this)
      });

      analytics.track('Load more clicked', {
        page: this.collection.options.page
      });
    }
  }
});