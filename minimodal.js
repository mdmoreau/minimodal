(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.minimodal = factory();
  }
}(this, function() {

  var minimodal = function(target, options) {

    options = typeof options !== 'undefined' ? options : {};

    var _ = {};

    var option = function(property, value) {
      _.options[property] = typeof options[property] !== 'undefined' ? options[property] : value;
    };

    _.options = {};
    option('loadingHTML', 'Loading');
    option('previousButtonHTML', 'Previous');
    option('nextButtonHTML', 'Next');
    option('closeButtonHTML', 'Close');
    option('statusTimeout', 0);
    option('removeTimeout', 0);
    option('closeTimeout', 0);

    _.node = function(html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      return div.firstChild;
    };

    _.setup = function() {
      _.current = target;
      _.minimodal = _.node('<div class="minimodal" tabindex="0">');
      _.overlay = _.node('<div class="minimodal__overlay">');
      _.viewport = _.node('<div class="minimodal__viewport">');
      _.closeButton = _.node('<button class="minimodal__close">' + _.options.closeButtonHTML + '</button>');
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
      var minimodal = _.minimodal;
      minimodal.classList.remove('minimodal--active');
      setTimeout(function() {
        if (minimodal.parentNode) {
          minimodal.parentNode.removeChild(minimodal);
        }
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
      } else if (e.keyCode === 37) {
        if (_.index > -1) {
          _.previous();
        }
      } else if (e.keyCode === 39) {
        if (_.index > -1) {
          _.next();
        }
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
      _.status = _.node('<div class="minimodal__status">' + _.options.loadingHTML + '</div>');
      _.item.appendChild(_.status);
      _.reflow();
      _.item.classList.add('minimodal__item--loading');
    };

    _.loaded = function() {
      var status = _.status;
      setTimeout(function() {
        if (status.parentNode) {
          status.parentNode.removeChild(status);
        }
      }, _.options.statusTimeout);
      _.item.appendChild(_.content);
      _.item.classList.remove('minimodal__item--loading');
      _.reflow();
      _.item.classList.add('minimodal__item--loaded');
    };

    _.error = function() {
      _.status.innerHTML = 'Error loading resource';
    };

    _.ajax = function() {
      var url = _.url;
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.onload = function() {
        if (url === _.url) {
          if (request.status >= 200 && request.status < 400) {
            var response = request.responseText;
            _.content = _.node('<div class="minimodal__content"><div class="minimodal__element">' + response);
            _.loaded();
          } else {
            _.error();
          }
        }
      };
      request.onerror = function() {
        if (url === _.url) {
          _.error();
        }
      };
      request.send();
    };

    _.googleMaps = function() {
      var src = 'https://www.google.com/maps/embed/v1/';
      var apiKey = 'AIzaSyDqlCMWHw2THOOYiVkO8-PjkPTTAIpkxww';
      if (_.url.indexOf('/maps/place/') > -1) {
        var place = _.url.match('(?:/maps/place/)([^/]+)')[1];
        src += 'place?key=' + apiKey + '&q=' + place;
      } else {
        var coords = _.url.match('(?:/maps/@)([^z]+)')[1];
        coords = coords.split(',');
        var lat = coords[0];
        var long = coords[1];
        var zoom = coords[2];
        src += 'view?key=' + apiKey + '&center=' + lat + ',' + long + '&zoom=' + zoom + 'z';
      }
      _.content = _.node('<div class="minimodal__content"><iframe class="minimodal__element minimodal__element--map" src="' + src + '" frameborder="0">');
      _.loaded();
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
      var url = _.url;
      var img = document.createElement('img');
      img.onload = function() {
        if (url === _.url) {
          _.content = _.node('<div class="minimodal__content"><img class="minimodal__element" src="' + _.url + '">');
          _.loaded();
        }
      };
      img.onerror = function() {
        if (url === _.url) {
          _.error();
        }
      };
      img.src = url;
    };

    _.type = function() {
      if (_.current.getAttribute('data-minimodal-type')) {
        return _.current.getAttribute('data-minimodal-type');
      } else if (_.url.indexOf('google.com/maps') > -1) {
        return 'googleMaps';
      } else if (_.url.indexOf('youtube.com') > -1) {
        return 'youtube';
      } else if (_.url.indexOf('vimeo.com') > -1) {
        return 'vimeo';
      } else {
        return 'image';
      }
    };

    _.load = function(change) {
      _.url = _.current.getAttribute('href');
      _.item = _.node('<div class="minimodal__item">');
      _.viewport.appendChild(_.item);
      if (change) {
        _.item.classList.add('minimodal__item--added');
        _.item.classList.add('minimodal__item--added--' + change);
        _.reflow();
        _.item.classList.remove('minimodal__item--added');
        _.item.classList.remove('minimodal__item--added--' + change);
      }
      _.loading();
      _[_.type()]();
    };

    _.remove = function(change) {
      var item = _.item;
      item.classList.add('minimodal__item--removed');
      item.classList.add('minimodal__item--removed--' + change);
      setTimeout(function() {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      }, _.options.removeTimeout);
    };

    _.update = function(change) {
      _.remove(change);
      _.current = _.groupItems[_.index];
      _.load(change);
    };

    _.previous = function() {
      if (_.index - 1 < 0) {
        _.index = _.indexMax;
      } else {
        _.index -= 1;
      }
      _.update('previous');
    };

    _.next = function() {
      if (_.index + 1 > _.indexMax) {
        _.index = 0;
      } else {
        _.index += 1;
      }
      _.update('next');
    };

    _.nav = function() {
      _.previousButton = _.node('<button class="minimodal__nav minimodal__nav--previous">' + _.options.previousButtonHTML + '</button>');
      _.nextButton = _.node('<button class="minimodal__nav minimodal__nav--next">' + _.options.nextButtonHTML + '</button>');
      _.minimodal.insertBefore(_.previousButton, _.closeButton);
      _.minimodal.insertBefore(_.nextButton, _.closeButton);
      _.previousButton.addEventListener('click', _.previous);
      _.nextButton.addEventListener('click', _.next);
    };

    _.group = function() {
      _.groupID = _.current.getAttribute('data-minimodal');
      if (_.groupID) {
        _.groupItems = document.querySelectorAll('[data-minimodal="' + _.groupID + '"]');
        if (_.groupItems.length > 1) {
          _.index = Array.prototype.indexOf.call(_.groupItems, _.current);
          _.indexMax = _.groupItems.length - 1;
          _.nav();
        }
      }
    };

    _.open = function(e) {
      e.preventDefault();
      _.setup();
      _.build();
      _.listen();
      _.load();
      _.group();
    };

    _.init = function() {
      target.addEventListener('click', _.open);
    };

    return _;

  };

  return minimodal;

}));
