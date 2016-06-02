function minimodal(target) {

  var _ = {};

  _.current = target;

  _.node = function(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
  };

  _.setup = function() {
    _.minimodal = _.node('<div class="minimodal">');
    _.overlay = _.node('<div class="minimodal__overlay">');
    _.viewport = _.node('<div class="minimodal__viewport">');
    _.closeButton = _.node('<button class="minimodal__close">Close</button>');
  };

  _.build = function() {
    _.minimodal.appendChild(_.overlay);
    _.minimodal.appendChild(_.viewport);
    _.minimodal.appendChild(_.closeButton);
    document.body.appendChild(_.minimodal);
  };

  _.close = function() {
    _.minimodal.parentNode.removeChild(_.minimodal);
  };

  _.listen = function() {
    _.closeButton.addEventListener('click', _.close);
  };

  _.youtube = function() {
    var id = _.url.split('v=')[1];
    return '<div class="minimodal__element minimodal__element--video"><iframe class="minimodal__video" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen>';
  };

  _.vimeo = function() {
    var id = _.url.split('vimeo.com/')[1];
    return '<div class="minimodal__element minimodal__element--video"><iframe class="minimodal__video" src="https://player.vimeo.com/video/' + id + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>';
  };

  _.image = function() {
    return '<img class="minimodal__element" src="' + _.url + '">';
  };

  _.load = function() {
    var element;
    _.url = _.current.getAttribute('href');
    if (_.url.indexOf('youtube.com') > -1) {
      element = _.youtube();
    } else if (_.url.indexOf('vimeo.com') > -1) {
      element = _.vimeo();
    } else {
      element = _.image();
    }
    _.item = _.node('<div class="minimodal__item"><div class="minimodal__content">' + element);
    _.viewport.appendChild(_.item);
  };

  _.open = function() {
    _.setup();
    _.build();
    _.listen();
    _.load();
  };

  return _;

}
