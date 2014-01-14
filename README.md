# GroundworkJS Components

Dependency-free JavaScript modules compatible with but not limited to usage with [GroundworkJS][1]. Included components are:

- ### Widgets
 - *Dropdown*, an accessible dropdown menu.
 - *Expandable*, an accessible expandable content analogous to the HTML5 details element.
 - *Modal*, a simple and accessible modal overlay.
 - *Slider*, a horizontal scrolling content slider.
 - *Slideshow*, a minimal slideshow with before/current/after hooks for CSS transitions.
 - *Tabs*, an accessible and flexible tabs implementation.

- ### Directives
 - *Labelholder*, visually replaces form input labels with placeholders without abusing usability.
 - *Lazy image*, use image placeholders for lazy or conditional loading with CSS hooks.
 - *Respond*, responsive breakpoint component loading and unloading (requires GroundworkJS).
 - *To SVG*, swaps an image source URI to an SVG counterpart.

- ### Utilities
 - *CSS feature*, provides basic CSS feature detection

## Dependencies

None. The modules are defined with the universal module definition ([UMD][5]) but it's preferable to use an AMD compatible script loader such as [RequireJS][2] or [curl.js][3] and manage component instances with [GroundworkJS][1].

## Issues

Have a bug? Please report an issues on the [Github project page][0]

https://github.com/i-like-robots/groundwork-components/issues

## License

This work is licensed under a [MIT License][4].

[0]: https://github.com/i-like-robots/groundwork-components/issues
[1]: http://github.com/i-like-robots/groundwork/
[2]: http://requirejs.org/
[3]: https://github.com/cujojs/curl
[4]: http://opensource.org/licenses/MIT
[5]: http://jsdefine.org/
