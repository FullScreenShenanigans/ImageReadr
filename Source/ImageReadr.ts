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
        private palette: number[][];

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
        private sectionSelector: string;

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
        constructor(settings: IImageReadrSettings) {
            this.allowedFiles = settings.allowedFiles;
            this.sectionSelector = settings.sectionSelector;
            this.inputSelector = settings.inputSelector;
            this.outputSelector = settings.outputSelector;
            this.paletteDefault = settings.paletteDefault;
            this.palettes = settings.palettes;

            this.palette = this.palettes[settings.paletteDefault];
        }


        /* Internal resets
        */

        /**
         * 
         */
        private initializePalettes(): void {
            var section: HTMLElement = document.getElementById(this.sectionSelector),
                name: string,
                element: HTMLElement,
                chosen: HTMLElement;

            section.appendChild(this.initializePaletteUploader());
        }

        /**
         * 
         */
        private initializePaletteUploader(): HTMLElement {
            var surround: HTMLDivElement = document.createElement("div"),
                label: HTMLHeadingElement = document.createElement("h4");

            surround.className = "palette palette-uploader";
            label.className = "palette-label";

            label.textContent = "Drag or upload an image here to generate a palette.";

            // this.initializeClickInput(surround);
            // this.initializeDragInput(surround);

            // surround.children[0].workerCallback = workerPaletteUploaderStart;

            surround.appendChild(label);

            return surround;
        }
    }
}
