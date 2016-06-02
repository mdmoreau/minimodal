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

  _.url = function() {
    return _.current.getAttribute('href');
  };

  _.load = function() {
    var element = '<img class="minimodal__element" src="' + _.url() + '">';
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
