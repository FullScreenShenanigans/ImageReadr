/// <reference path="ImageReadr.d.ts" />
var ImageReadr;
(function (_ImageReadr) {
    "use strict";
    var ImageReadr = (function () {
        /**
         *
         */
        function ImageReadr(settings) {
            this.allowedFiles = settings.allowedFiles;
            this.sectionSelector = settings.sectionSelector;
            this.inputSelector = settings.inputSelector;
            this.outputSelector = settings.outputSelector;
            this.paletteDefault = settings.paletteDefault;
            this.palettes = settings.palettes;
            this.palette = settings.paletteDefault;
            this.initializePalettes();
            this.initializeInput(this.inputSelector);
        }
        /* Internal resets
        */
        /**
         *
         */
        ImageReadr.prototype.initializePalettes = function () {
            var section = document.querySelector(this.sectionSelector), name, element, chosen;
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
        };
        /**
         *
         */
        ImageReadr.prototype.initializePalette = function (name, palette) {
            var surround = document.createElement("div"), label = document.createElement("h4"), container = document.createElement("div"), color, boxOut, boxIn, i;
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
        };
        /**
         *
         */
        ImageReadr.prototype.initializePaletteUploader = function () {
            var surround = document.createElement("div"), label = document.createElement("h4");
            surround.className = "palette palette-uploader";
            label.className = "palette-label";
            label.textContent = "Drag or upload an image here to generate a palette.";
            this.initializeClickInput(surround);
            this.initializeDragInput(surround);
            surround.children[0].workerCallback = this.workerPaletteUploaderStart.bind(this);
            surround.appendChild(label);
            return surround;
        };
        /**
         *
         */
        ImageReadr.prototype.choosePalette = function (element, name, palette, event) {
            var elements = element.parentElement.children, i;
            for (i = 0; i < elements.length; i += 1) {
                elements[i].className = "palette";
            }
            element.className = "palette palette-selected";
            this.PixelRender = new PixelRendr.PixelRendr({
                "paletteDefault": palette
            });
            this.palette = name;
        };
        /* Input
        */
        /**
         *
         */
        ImageReadr.prototype.initializeInput = function (selector) {
            var input = document.querySelector(selector);
            this.initializeClickInput(input);
            this.initializeDragInput(input);
        };
        /**
         *
         */
        ImageReadr.prototype.initializeClickInput = function (input) {
            var dummy = document.createElement("input");
            dummy.type = "file";
            dummy.multiple = true;
            dummy.onchange = this.handleFileDrop.bind(this, dummy);
            input.addEventListener("click", function () {
                dummy.click();
            });
            input.appendChild(dummy);
        };
        /**
         *
         */
        ImageReadr.prototype.initializeDragInput = function (input) {
            input.ondragenter = this.handleFileDragEnter.bind(this, input);
            input.ondragover = this.handleFileDragOver.bind(this, input);
            input.ondragleave = input.ondragend = this.handleFileDragLeave.bind(this, input);
            input.ondrop = this.handleFileDrop.bind(this, input);
        };
        /**
         *
         */
        ImageReadr.prototype.handleFileDragEnter = function (input, event) {
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "copy";
            }
            input.className += " hovering";
        };
        /**
         *
         */
        ImageReadr.prototype.handleFileDragOver = function (input, event) {
            event.preventDefault();
            return false;
        };
        /**
         *
         */
        ImageReadr.prototype.handleFileDragLeave = function (input, event) {
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "none";
            }
            input.className = input.className.replace(" hovering", "");
        };
        /**
         *
         *
         * @remarks input.files is when the input[type=file] is the source, while
         *          event.dataTransfer.files is for drag-and-drop.
         */
        ImageReadr.prototype.handleFileDrop = function (input, event) {
            var files = input.files || event.dataTransfer.files, output = document.querySelector(this.outputSelector), elements = [], file, tag, element, i;
            this.handleFileDragLeave(input, event);
            event.preventDefault();
            event.stopPropagation();
            for (i = 0; i < files.length; i += 1) {
                file = files[i];
                tag = file.type.split("/")[1];
                if (!this.allowedFiles[tag]) {
                    element = document.createElement("div");
                    element.className = "output output-failed";
                    element.textContent = "'" + file.name + "' is either a folder or has a non-image type...";
                    elements.push(element);
                    continue;
                }
                elements.push(this.createWorkerElement(files[i], event.target));
            }
            for (i = 0; i < elements.length; i += 1) {
                output.insertBefore(elements[i], output.firstElementChild);
            }
        };
        /**
         *
         */
        ImageReadr.prototype.createWorkerElement = function (file, target) {
            var element = document.createElement("div"), reader = new FileReader();
            element.workerCallback = target.workerCallback;
            element.className = "output output-uploading";
            element.setAttribute("palette", this.palette);
            element.innerText = "Uploading '" + file.name + "'...";
            reader.onprogress = this.workerUpdateProgress.bind(this, file, element);
            reader.onloadend = this.workerTryStartWorking.bind(this, file, element);
            reader.readAsDataURL(file);
            return element;
        };
        /**
         *
         */
        ImageReadr.prototype.workerUpdateProgress = function (file, element, event) {
            if (!event.lengthComputable) {
                return;
            }
            var percent = Math.min(Math.round((event.loaded / event.total) * 100), 100);
            element.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
        };
        /**
         *
         *
         *
         */
        ImageReadr.prototype.workerTryStartWorking = function (file, element, event) {
            var result = event.currentTarget.result;
            if (element.workerCallback) {
                element.workerCallback(result, file, element, event);
            }
            else {
                this.workerTryStartWorkingDefault(result, file, element, event);
            }
        };
        /**
         *
         */
        ImageReadr.prototype.workerTryStartWorkingDefault = function (result, file, element, event) {
            if (result.length > 100000) {
                this.workerCannotStartWorking(result, file, element, event);
            }
            else {
                this.workerStartWorking(result, file, element, event);
            }
        };
        /**
         *
         */
        ImageReadr.prototype.workerCannotStartWorking = function (result, file, element, event) {
            element.innerText = "'" + file.name + "' is too big! Use a smaller file.";
            element.className = "output output-failed";
        };
        /**
         *
         */
        ImageReadr.prototype.workerStartWorking = function (result, file, element, event) {
            var displayBase64 = document.createElement("input");
            element.className = "output output-working";
            element.innerText = "Working on " + file.name + "...";
            displayBase64.spellcheck = false;
            displayBase64.className = "selectable";
            displayBase64.type = "text";
            displayBase64.setAttribute("value", result);
            element.appendChild(document.createElement("br"));
            element.appendChild(displayBase64);
            this.parseBase64Image(file, result, this.workerFinishRender.bind(this, file, element));
        };
        /**
         *
         */
        ImageReadr.prototype.parseBase64Image = function (file, src, callback) {
            var image = document.createElement("img");
            image.onload = this.PixelRender.encode.bind(this.PixelRender, image, callback);
            image.src = src;
        };
        /**
         *
         */
        ImageReadr.prototype.workerFinishRender = function (file, element, result, image) {
            var displayResult = document.createElement("input");
            displayResult.spellcheck = false;
            displayResult.className = "selectable";
            displayResult.type = "text";
            displayResult.setAttribute("value", result);
            element.firstChild.textContent = "Finished '" + file.name + "' ('" + element.getAttribute("palette") + "' palette).";
            element.className = "output output-complete";
            element.style.backgroundImage = "url('" + image.src + "')";
            element.appendChild(displayResult);
        };
        /**
         *
         */
        ImageReadr.prototype.workerPaletteUploaderStart = function (result, file, element, event) {
            var image = document.createElement("img");
            image.onload = this.workerPaletteCollect.bind(this, image, file, element, result);
            image.src = result;
            element.className = "output output-working";
            element.innerText = "Working on " + file.name + "...";
        };
        /**
         *
         */
        ImageReadr.prototype.workerPaletteCollect = function (image, file, element, src, event) {
            var canvas = document.createElement("canvas"), context = canvas.getContext("2d"), data;
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            data = context.getImageData(0, 0, canvas.width, canvas.height).data;
            this.workerPaletteFinish(this.PixelRender.generatePaletteFromRawData(data, true, true), file, element, src);
        };
        /**
         *
         */
        ImageReadr.prototype.workerPaletteFinish = function (colors, file, element, src) {
            var chooser = this.initializePalette(file.name, colors), displayResult = document.createElement("input");
            chooser.style.backgroundImage = "url('" + src + "')";
            displayResult.spellcheck = false;
            displayResult.className = "selectable";
            displayResult.type = "text";
            displayResult.setAttribute("value", "[ [" + colors.join("], [") + "] ]");
            if (colors.length > 999) {
                element.className = "output output-failed";
                element.innerText = "Too many colors (>999) in " + file.name + " palette.";
            }
            element.className = "output output-complete";
            element.innerText = "Created " + file.name + " palette (" + colors.length + " colors).";
            document.querySelector("#palettes").appendChild(chooser);
            element.appendChild(displayResult);
            chooser.click();
        };
        return ImageReadr;
    })();
    _ImageReadr.ImageReadr = ImageReadr;
})(ImageReadr || (ImageReadr = {}));
