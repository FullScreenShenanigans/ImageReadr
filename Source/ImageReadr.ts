/// <reference path="ImageReadr.d.ts" />

module ImageReadr {
    "use strict";

    export class ImageReadr implements IImageReadr {
        /**
         * 
         */
        private PixelRender: PixelRendr.IPixelRendr;

        /**
         * 
         */
        private palettes: { [i: string]: number[][]; };

        /**
         * 
         */
        private palette: string;

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

            this.palette = settings.paletteDefault;

            this.initializePalettes();
        }


        /* Internal resets
        */

        /**
         * 
         */
        private initializePalettes(): void {
            var section: HTMLElement = <HTMLElement>document.querySelector(this.sectionSelector),
                name: string,
                element: HTMLElement,
                chosen: HTMLElement;

            section.appendChild(this.initializePaletteUploader());

            for (name in this.palettes) {
                if (!this.palettes.hasOwnProperty(name)) {
                    continue;
                }

                element = this.initializePalette(name, this.palettes[name]);
                section.appendChild(element);

                if (name === this.paletteDefault) {
                    chosen = element;
                }
            }

            chosen.click();
        }

        /**
         * 
         */
        private initializePalette(name, palette): HTMLDivElement {
            var surround = document.createElement("div"),
                label = document.createElement("h4"),
                container = document.createElement("div"),
                color, boxOut, boxIn, i;

            surround.className = "palette";
            label.className = "palette-label";
            container.className = "palette-container";

            surround.onclick = this.choosePalette.bind(this, surround, name, palette);

            label.textContent = "Palette: " + name;

            for (i = 0; i < palette.length; i += 1) {
                color = palette[i];

                boxOut = document.createElement("div");
                boxOut.className = "palette-box";

                boxIn = document.createElement("div");
                boxIn.className = "palette-box-in";
                boxIn.style.background = "rgba(" + color.join(",") + ")";

                boxOut.appendChild(boxIn);
                container.appendChild(boxOut);
            }

            surround.appendChild(label);
            surround.appendChild(container);

            return surround;
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

        /**
         * 
         */
        private choosePalette(element: HTMLElement, name, palette, event) {
            var elements: HTMLCollection = element.parentElement.children,
                i;

            for (i = 0; i < elements.length; i += 1) {
                (<HTMLElement>elements[i]).className = "palette"
            }

            element.className = "palette palette-selected";

            this.PixelRender = new PixelRendr.PixelRendr({
                "paletteDefault": palette
            });

            this.palette = name;
        }
    }
}