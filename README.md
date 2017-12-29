# ImageReadr

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/ImageReadr.svg)](https://greenkeeper.io/)
A utility for converting regular images into PixelRendr sprites.

#### Basic Usage

Typical usage of ImageReadr is done via the web page at Source/index.html.

PixelRendr sprites use a custom format documented in [PixelRendr](http://github.com/FullScreenShenanigans/PixelRendr). It's a good idea to skim the format documentation there, but in general, know that sprites are stored as strings, refer to colors stored externally (in a "palette"), and don't know their own width or height.

To convert an image, either drag it onto the gray area, or click the area to open a multi-file picker. Images uploaded will show up below, with both the base64 compression and the PixelRendr sprite referencing the palette selected at the top. You can also upload an image to generate a new palette.

#### Coding Documentation
Coding documentation is not yet available for ImageReadr. 
