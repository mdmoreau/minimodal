function minimodal(target, options) {

  options = typeof options !== 'undefined' ? options : {};

  var _ = {};

  _.current = target;

  _.options = {
    closeTimeout: typeof options.closeTimeout !== 'undefined' ? options.closeTimeout : 0,
    statusTimeout: typeof options.statusTimeout !== 'undefined' ? options.statusTimeout : 0
  };

  _.node = function(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
  };

  _.setup = function() {
    _.minimodal = _.node('<div class="minimodal" tabindex="0">');
    _.overlay = _.node('<div class="minimodal__overlay">');
    _.viewport = _.node('<div class="minimodal__viewport">');
    _.closeButton = _.node('<button class="minimodal__close">Close</button>');
  };

  _.build = function() {
    _.minimodal.appendChild(_.overlay);
    _.minimodal.appendChild(_.viewport);
    _.minimodal.appendChild(_.closeButton);
    document.body.appendChild(_.minimodal);
    _.minimodal.focus();
    _.minimodal.classList.add('minimodal--active');
  };

  _.close = function() {
    _.minimodal.classList.remove('minimodal--active');
    setTimeout(function() {
      _.minimodal.parentNode.removeChild(_.minimodal);
    }, _.options.closeTimeout);
    document.removeEventListener('keydown', _.keydown);
    target.focus();
  };

  _.focusTrap = function(e) {
    if (e.shiftKey) {
      if (_.minimodal === document.activeElement) {
        e.preventDefault();
        _.closeButton.focus();
      }
    } else {
      if (_.closeButton === document.activeElement) {
        e.preventDefault();
        _.minimodal.focus();
      }
    }
  };

  _.keydown = function(e) {
    if (e.keyCode === 9) {
      _.focusTrap(e);
    } else if (e.keyCode === 27) {
      _.close();
    }
  };

  _.listen = function() {
    _.closeButton.addEventListener('click', _.close);
    document.addEventListener('keydown', _.keydown);
  };

  _.reflow = function() {
    var x = _.minimodal.clientWidth;
  };

  _.loading = function() {
    _.status = _.node('<div class="minimodal__status">Loading</div>');
    _.item.appendChild(_.status);
    _.reflow();
    _.item.classList.add('minimodal__item--loading');
  };

  _.loaded = function() {
    setTimeout(function() {
      _.status.parentNode.removeChild(_.status);
    }, _.options.statusTimeout);
    _.item.appendChild(_.content);
    _.item.classList.remove('minimodal__item--loading');
    _.reflow();
    _.item.classList.add('minimodal__item--loaded');
  };

  _.error = function() {
    _.status.innerHTML = 'Error loading resource';
  };

  _.youtube = function() {
    var id = _.url.split('v=')[1];
    _.content = _.node('<div class="minimodal__content"><div class="minimodal__element minimodal__element--video"><iframe class="minimodal__video" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen>');
    _.loaded();
  };

  _.vimeo = function() {
    var id = _.url.split('vimeo.com/')[1];
    _.content = _.node('<div class="minimodal__content"><div class="minimodal__element minimodal__element--video"><iframe class="minimodal__video" src="https://player.vimeo.com/video/' + id + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>');
    _.loaded();
  };

  _.image = function() {
    var img = document.createElement('img');
    img.onload = function() {
      if (img.src.indexOf(_.url) > -1) {
        _.content = _.node('<div class="minimodal__content"><img class="minimodal__element" src="' + _.url + '">');
        _.loaded();
      }
    };
    img.onerror = function() {
      if (img.src.indexOf(_.url) > -1) {
        _.error();
      }
    };
    img.src = _.url;
  };

  _.load = function() {
    _.url = _.current.getAttribute('href');
    _.item = _.node('<div class="minimodal__item">');
    _.viewport.appendChild(_.item);
    _.loading();
    if (_.url.indexOf('youtube.com') > -1) {
      _.youtube();
    } else if (_.url.indexOf('vimeo.com') > -1) {
      _.vimeo();
    } else {
      _.image();
    }
  };

  _.open = function() {
    _.setup();
    _.build();
    _.listen();
    _.load();
  };

  return _;

}
