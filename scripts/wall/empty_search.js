var EmptySearch = Chute.View.extend({
  template: JST['wall/no_items'],
  append: true,
  events: {
    'click a.reset-filters': 'resetFilters'
  },
  
  initialize: function() {
    this.listenToOnce(this, 'render', function(){
      this.parent.bindings.loadButton.hide();
    });
  },
  
  resetFilters: function(e) {
    e.preventDefault();
    
    this.parent.bindings.loadButton.show();
    Display.hub.bindings.search.val('');
    Display.hub.search();
    this.remove();
  }
});