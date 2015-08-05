document.onreadystatechange = function (event) {
    if (event.target.readyState != "complete") {
        return;
    }

    var imageDrawer;

    var input = document.getElementById("myTextInput");
    input.onkeypress = function(key) {
        if(key.which == 13) {
            imageDrawer = new ImageDrawr(
                input.value,
                document.getElementById("myLeftButton"),
                document.getElementById("myRightButton"),
                document.getElementById("myWidth"),
                document.getElementById("myHeight"),
                document.getElementById("myCanvas"),
                document.getElementById("myLink")
            );
        }
    };
};

function ImageDrawr(inputString
    , leftButton, rightButton
    , widthText, heightText
    , canvas
    , link ) 
{
    this.pixelRender = createPixelRender(inputString);
    var nPixels = this.pixelRender.library.sprites.mySprite.length / 4;
    this.dims = calculatePossibleDimensions(nPixels);
    this.dimIndex = Math.floor( (this.dims.length - 1) / 2 );
    this.canvas = canvas;
    this.widthText  = widthText;
    this.heightText = heightText;
    this.link = link;
    var that = this;
    leftButton.onclick  = function() { that.updateDim("-"); };
    rightButton.onclick = function() { that.updateDim("+"); };
    this.updateDim();
}
ImageDrawr.prototype.updateDim = function(op) {
    if( op === "+" ) {
        var maxInd = this.dims.length - 1;
        if( this.dimIndex >= maxInd )   { this.dimIndex = maxInd; }
        else                            { ++this.dimIndex; }
    } else if( op === "-" ) {
        if( this.dimIndex <= 0 ) { this.dimIndex = 0; }
        else                     { --this.dimIndex; }
    }

    this.canvas.width  = this.widthText.value  = this.dims[this.dimIndex][0];
    this.canvas.height = this.heightText.value = this.dims[this.dimIndex][1];

    this.render();
}
ImageDrawr.prototype.render = function() {
    var sizing = {
        "spriteWidth": this.canvas.width,
        "spriteHeight": this.canvas.height
    };
    var sprite = this.pixelRender.decode("mySprite", sizing);
    var context = this.canvas.getContext("2d");

    var imageData = context.getImageData(
        0, 0, this.canvas.width, this.canvas.height);
    this.pixelRender.memcpyU8(sprite, imageData.data);
    context.putImageData(imageData, 0, 0);

    this.link.download = "mario.png";
    this.link.href = this.canvas.toDataURL("image/png");
}

function calculatePossibleDimensions(nPixels) {
    var dims = [];
    var LIM = Math.sqrt(nPixels);
    for( var n = 2; n <= LIM; ++n ) {
        if( nPixels % n == 0 ) {
            dims.push( [n, nPixels/n] );
        }
    }

    var iReverseUpTo = dims.length - 1;
    if ( dims[iReverseUpTo][0] == dims[iReverseUpTo][1] ) {
        --iReverseUpTo; 
    }
    for( var i = iReverseUpTo ; i >= 0 ; --i ) {
        dims.push( [ dims[i][1], dims[i][0] ] );
    }

    return dims;
}

function createPixelRender(inputString) {
    return new PixelRendr.PixelRendr({
        "paletteDefault": [
                [0, 0, 0, 0],
                // Grayscales (1-4)
                [255, 255, 255, 255],
                [0, 0, 0, 255],
                [188, 188, 188, 255],
                [116, 116, 116, 255],
                // Reds & Browns (5-11)
                [252, 216, 168, 255],
                [252, 152, 56, 255],
                [252, 116, 180, 255],
                [216, 40, 0, 255],
                [200, 76, 12, 255],
                [136, 112, 0, 255],
                [124, 7, 0, 255],
                // Greens (12-14, and 21)
                [168, 250, 188, 255],
                [128, 208, 16, 255],
                [0, 168, 0, 255],
                // Blues (15-20)
                [24, 60, 92, 255],
                [0, 128, 136, 255],
                [32, 56, 236, 255],
                [156, 252, 240, 255],
                [60, 188, 252, 255],
                [92, 148, 252, 255],
                // Green (21) for Luigi
                [0, 130, 0, 255],
                // Pinkish tan (22) for large decorative text
                [252, 188, 176, 255]
            ],
       "filters": {
            "Underworld": ["palette", {
                "05": "18",
                "09": "16"
            }],
            "UnderworldKoopa": ["palette", {
                "06": "09",
                "14": "16"
            }],
            "Castle": ["palette", {
                "02": "04",
                "05": "01",
                "09": "03"
            }],
            "Alt": ["palette", {
                "11": "01"
            }],
            "Alt2": ["palette", {
                "02": "04",
                "05": "01",
                "09": "03",
                "13": "01",
                "19": "08"
            }],
            "StarOne": ["palette", {}],
            "StarTwo": ["palette", {
                "06": "02",
                "08": "05",
                "10": "09"
            }],
            "StarThree": ["palette", {
                "06": "01",
                "08": "06",
                "10": "08"
            }],
            "StarFour": ["palette", {
                "06": "01",
                "08": "06",
                "10": "14"
            }],
            "Smart": ["palette", {
                "14": "08"
            }]
        },

        "library": {
            "mySprite": inputString,
        }

    });
}
