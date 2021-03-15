# minimodal

Minimal, customizable, responsive modals

Examples available at https://mdmoreau.github.io/minimodal/

## Features

- Fully responsive with minimal styling
- All scaling and calculations are done through CSS
- Use built-in CSS classes to transition between states (load, previous, next, etc)
- Dependency free (no jQuery)
- Keyboard accessible
- Built-in support for a variety of content types
- Ability to group and navigate between items
- Works in IE 10+ (requires [classList](http://caniuse.com/#search=classlist) support)
    - Close on overlay click uses CSS pointer-events and only works in IE 11+

## Install

### Standard

Include minimodal CSS:

```html
<link href="minimodal.css" rel="stylesheet">
```

Include minimodal JavaScript:

```html
<script src="minimodal.js"></script>
```

Call minimodal on your target elements:

```javascript
var targets = document.querySelectorAll('[data-minimodal]');
for (var i = 0; i < targets.length; i += 1) {
  var modal = minimodal(targets[i], {
    // options
    statusTimeout: 600,
    removeTimeout: 600,
    closeTimeout: 600
  });
  modal.init();
}
```

### npm

You can also install minimodal using npm:

```
npm install minimodal --save
```

UMD is used to support both AMD and CommonJS environments. For example, with Browserify you could use `var minimodal = require('minimodal');` at the top of the above script block.

## Example

In the above example we're using the `data-minimodal` attribute to target elements, but you can use whatever selector you'd like. Grouping is done using `data-minimodal="group-name"` though, so it can be handy to stick with the default for that reason.

```html
<a href="image.jpg" data-minimodal>image</a>
```

You can link to any of the content types in the next section to have minimodal handle them accordingly.

## Content Types

Most content types will be automatically detected based on the item's href attribute, however some noted below will need to have their types set explicitly.

- Image
  - default fallback if no other type is specified or detected
- YouTube
  - use `https://www.youtube.com/watch?v=xxxxxxxxxxx` or `https://youtu.be/xxxxxxxxxxx` format
- Vimeo
  - use `https://vimeo.com/xxxxxxx` format
- Google Maps
  - requires `googleMapsAPIKey` option to be set correctly
  - currently supports place and coordinate modes
    - place mode: `https://www.google.com/maps/place/City,+State/...`
    - coordinate mode: `https://www.google.com/maps/@latitude,longitude,#z...`
- AJAX
  - requires `data-minimodal-type="ajax"` on target item
- Selector
  - requires `data-minimodal-selector="#selector"` on target item
    - `#selector` can be any valid CSS selector
- Iframe
  - requires `data-minimodal-type="iframe"` on target item

## Options

### Classes

Additional classes can be added to minimodal elements. This allows different styling of a modal depending on its context.

`rootClass`

default: ''

Added to the root `minimodal` element.

### Markup

Markup for the following elements can be customized when initializing minimodal. Any customizations will be added inside each element's container.

`loadingHTML`

default: 'Loading'

`previousButtonHTML`

default: 'Previous'

`nextButtonHTML`

default: 'Next'

`closeButtonHTML`

default: 'Close'

### Animation

Timeout delays can be used to have certain elements removed from the DOM after a set amount of time. Match up the CSS transition durations with the various timeout options below to have elements removed once their transitions are complete.

`statusTimeout`

default: 0

Delay before `minimodal__status` element is removed from the DOM. This can be used to fade and remove a custom loading spinner once the item is ready, for example.

`removeTimeout`

default: 0

Delay before any `minimodal__item` element is removed from the DOM. When a previous or next button is clicked, the last current item will be removed after this delay. Can be used to transition an old item out of view while the new one loads in.

`closeTimeout`

default: 0

Delay before the root `minimodal` is removed from the DOM when clicking the close button.

### Callbacks

`onLoaded`

default: `function() {}`

Called whenever an item is finished loading. The content type of the item is passed through as an argument.

`onOpen`

default: `function() {}`

Called whenever the root `minimodal` is added to the DOM.

`onClose`

default: `function() {}`

Called whenever the root `minimodal` is removed from the DOM.

### Other

`googleMapsAPIKey`

default: ''

Enter your API key to enable Google Maps support. Instructions on how to obtain an API key can be found [here](https://developers.google.com/maps/documentation/embed/guide#api_key).

## Classes

### State

`minimodal--active`

Added to the root container once it's been added to the DOM. This class is also removed when the close button is clicked. Add rules to transition between this and the initial root `minimodal` class to add open/close animations.

`minimodal__item--loading`

Added to an item while loading. Can be used to transition the status element in and out.  Removed once the item has finished loading.

`minimodal__item--loaded`

Added to an item once it has been fully loaded. Can be used to transition in the loaded content.

`minimodal__item--added`

Items will receive this class briefly when they are added to the DOM. It is immediately removed from the item, allowing transitioning between this class and the standard `minimodal__item` class.

`minimodal__item--added--previous`

Modifier class that is briefly added when an item is added via the previous button.

`minimodal__item--added--next`

Modifier class that is briefly added when an item is added via the next button.

`minimodal__item--removed`

This class is added to an item when it is removed from the DOM. Styles can be set for this class to transition an item between it and the standard `minimodal__item` class.

`minimodal__item--removed--previous`

Modifier class that is added to an item when it is removed via the previous button.

`minimodal__item--removed--next`

Modifier class that is added to an item when it is removed via the next button.

## Captions

Use the `data-minimodal-caption` attribute on your target links to have the contained content appear as a caption. Links and other HTML can be used here as needed.

```html
<a href="image.jpg" data-minimodal data-minimodal-caption="My caption. <a href='#'>source</a>">image</a>
```

## Groups

To group items into a navigable set, add the `data-minimodal` attribute to each item with a matching value.

```html
<!-- group 1 -->
<a href="image1.jpg" data-minimodal="group1">image</a>
<a href="image2.jpg" data-minimodal="group1">image</a>
<a href="image3.jpg" data-minimodal="group1">image</a>
<!-- group 2 -->
<a href="image4.jpg" data-minimodal="group2">image</a>
<a href="image5.jpg" data-minimodal="group2">image</a>
<a href="image6.jpg" data-minimodal="group2">image</a>
```

Targets don't need to be visible on the page to be grouped, so you could have one visible entry item while all of the others are hidden with CSS.

```html
<a href="image1.jpg" data-minimodal="group1">image</a>
<a href="image2.jpg" data-minimodal="group1" style="display: none;">image</a>
<a href="image3.jpg" data-minimodal="group1" style="display: none;">image</a>
```

## Attribute Passthrough

Certain attributes can be passed from a target link to its corresponding item markup.

- `data-minimodal-alt`
  - Image
- `data-minimodal-title`
  - YouTube
  - Vimeo
  - Google Maps
  - Iframe

```html
<a href="image.jpg" data-minimodal data-minimodal-alt="descriptive text">image</a>
```
