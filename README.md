# Simple Responsive Social Sharing Buttons
Social sharing buttons that you can drop into any website with attractive SVG-based icons, small download, and browser compatibility.
SRSSB automatically adjusts to different screen sizes by tweaking sizes, splitting buttons evenly onto multiple rows and hiding the labels.

The library offers consistenly styled buttons for all sites.  It avoids running scripts from each social site, with the inherent overheads and incosistent appearance of buttons.

Developed by [**AlbanyWeb**](http://www.albanyweb.co.uk/).
Based on [**RRSSB**](https://github.com/kni-labs/rrssb) "Ridiculously Responsive Social Sharing Buttons" by [**KNI**](http://www.kurtnoble.com).

## Main changes from RRSSB
- Allow buttons to split onto multiple rows, ensuring the rows stay even.
- Buttons size automatically stays usable and clear.  As a rule we don't want huge buttons on a huge screen or tiny ones on a tiny screen, which you tend to get with RRSSB.
SRSSB offers a configurable default size, and a configurable percentage allowable shrink.
- Whitespace around icons and text consistent at all sizes.  With RRSSB, the spacing varies with button size.  At "normal width" there is lots of space, hence smaller fonts and icons that are harder to read.
Grow the screen, and you see the "large format", and it's different — and we think a better balance.
By default, SRSSB is similar to the large format, but with slightly larger icons.
- Uniform responsiveness applied simultaneously to all buttons.  In contrast RRSSB hides the labels one-by-one.
That's not an approach we are familiar with on mainstream websites, and we feel it looks odd, as if there is a bug.

## Performance changes
- Smaller JS and CSS files for faster download.
- Simpler script executes a lot less lines of code for smoother resizing.
- Smaller page sizes because SVGs are in CSS rather than inline.
Browser downloads the buttons once for the whole site, rather than once per page and per set of buttons.
Avoids bloating of page cache with very many copies of SVG data.
