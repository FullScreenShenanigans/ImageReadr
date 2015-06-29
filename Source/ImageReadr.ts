/// <reference path="ImageReadr.d.ts" />

module ImageReadr {
    "use strict";

    export class ImageReadr implements IImageReadr {
        /**
         * 
         */
        private PixelRendr: PixelRendr.IPixelRendr;

        /**
         * 
         */
        private palettes: { [i: string]: number[][]; };

        /**
         * 
         */
        private currentPalette: number[][];

        /**
         * 
         */
        private paletteDefault: string;

        /**
         * 
         */
        private allowedFiles: { [i: string]: boolean; };

        /**
         * 
         */
        private inputSelector: string;

        /**
         * 
         */
        private outputSelector: string;

        /**
         * 
         */
        con
    }
}
