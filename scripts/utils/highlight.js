var Highlight = {
  highlightCaption: function(caption, service) {
    _.each(twttr.txt.extractHashtagsWithIndices(caption, {checkUrlOverlap: true}), function(tag) {
      caption = caption.replace('#' + tag.hashtag, '<strong>#' + tag.hashtag + '</strong>');
    });

    _.each(twttr.txt.extractMentions(caption), function(mention) {
      caption = caption.replace('@' + mention, '<strong>@' + mention + '</strong>');
    });
    return caption;
  },

  linkifyCaption: function(caption, service) {
    return this['linkifyCaptionFor' + (service.charAt(0).toUpperCase() + service.slice(1))](caption);
  },

  linkifyCaptionForTwitter: function(caption) {
    return twttr.txt.autoLink(caption);
  },

  linkifyCaptionForInstagram: function(caption) {
    caption = this.linkifyCaptionForUploaded(caption);

    _.each(twttr.txt.extractMentions(caption), function(mention) {
      caption = caption.replace('@' + mention, '<a href="http://instagram.com/' + mention + '">@' + mention + '</a>');
    });
    return caption;
  },

  linkifyCaptionForFacebook: function(caption) {
    return this.linkifyCaptionForUploaded(caption);
  },

  linkifyCaptionForUploaded: function(caption) {
    _.each(twttr.txt.extractUrls(caption), function(url){
      caption = caption.replace(url, '<a href="' + url + '">' + url + '</a>');
    });

    return caption;
  }

};