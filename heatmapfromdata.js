'use strict'

//FIXME: module.export

if (typeof module !== 'undefined') module.exports = heatmapfromdata;

function heatmapfromdata(canvas) {
    if (!(this instanceof heatmapfromdata)) return new heatmapfromdata(canvas);

   canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

    this._ctx = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;

    this._max = 1;
    this._data = [];
}

heatmapfromdata.prototype = {
    defaultRadius: 0.3     ,

    defaultGradient: {
        0.3: 'blue',
        0.6: 'green',
        1.0: 'red'
    }, 

    data: function(data) {
        this._data = data;
        return this;
    },

    clear: function() {
        this._data = [];
        return this;
    },

    radius: function(r, blur) {
        blur = blur === undefined ? 3 : blur;

        let circle = this._circle = this._createCanvas(),
            ctx = circle.getContext('2d'),
            r2 = this._r = r + blur;

        circle.width = circle.height = r2 * 2;

        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';

        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return this;
    },
    parseColors: function(colors) {
        let i = 0,
            data = [];
        
        while (colors.indexOf(`(`, i) && i < colors.length) {
            let indexLeft = colors.indexOf(`(`, i),
                indexRight = colors.indexOf(`)`, indexLeft + 1),
                arrColors = colors.slice(indexLeft + 1, indexRight).split(',');
            
            data.push(arrColors);

            i = indexRight + 1;
        }

        return data;
    },
    //FIXME:
    linearInterpolation: function (colors) {
        // проверка на количество цветов
        // сделать выбрасывание ошибки
        let data = [];

        for (let i = 0; i < colors.length - 1; i++) {
            let firstColorR = +colors[i][0],
                firstColorG = +colors[i][1],
                firstColorB = +colors[i][2],
                secondColorR = +colors[i + 1][0],
                secondColorG = +colors[i + 1][1],
                secondColorB = +colors[i + 1][2],
                limit = 1024 / (colors.length - 1) / 4 ,
                step = 1 / limit;
           
            for (let t = 0, count = 0; count < limit;  t += step, count++) {
                data.push(Math.floor(firstColorR * (1 - t) + secondColorR * t));
                data.push(Math.floor(firstColorG * (1 - t) + secondColorG * t));
                data.push(Math.floor(firstColorB * (1 - t) + secondColorB * t));
                data.push(0);
            }
        }
        return data;
    },

    gradient: function(grad) {
        this._grad = grad;

        return this;
    },

    draw: function(minOpacity) {
        if (!this._circle) this.radius(this.defaultRadius);
        if (!this._grad) this.gradient(this.defaultGradient);

        let ctx = this._ctx;

        ctx.clearRect(0, 0, this._width, this._height);

        for (let i = 0, len = this._data.length, p; i < len; i++) {
            p = this._data[i];
            ctx.globalAlpha = Math.min(Math.max(p[2], minOpacity === undefined ? 0.05 : minOpacity), 1);
            ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r);
        }

        let colored = ctx.getImageData(0, 0, this._width, this._height);
        this._colorize(colored.data, this._grad);
        ctx.putImageData(colored, 0, 0);

        return this;
    },
   
    _colorize: function (pixels, gradient) {
        for (let i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4;

            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            } 
        }
    },

    _createCanvas: function () {
        if (typeof document !== 'undefined') {
            return document.createElement('canvas');
        } else {
            return new this._canvas.constructor();
        }
    }
};

function parse(data) {
    return data.split("\n").slice(0).map(e => {
        return e.trim().split(" ").map(e => +e);
    });
};

function dataNormalization(matrix) {
    let maxElem = 0.0;
    for(let i = 0; i < matrix.length - 1; i++) {
        for(let j = 0; j < matrix.length - 1; j++) {
            maxElem = Math.max(Math.abs(matrix[i][j]), Math.abs(maxElem));
        }
    }
    

    if (maxElem) {
        for(let i = 0; i < matrix.length - 1; i++) {
            for(let j = 0; j < matrix.length - 1; j++) {
                matrix[i][j] = (matrix[i][j]  + 0.0) / maxElem;
            }
        }
    }

    return matrix;
};

function makeStruct(data) {
    let newData = [],
        canvas = document.getElementById('canvas'),
        width = canvas.width,
        height = canvas.height;

    for(let i = 0; i < data.length - 1; i++) {
        for(let j = 0; j < data.length - 1; j++) {
            newData.push([width / ( data.length + 1) * (j + 1), height / ( data.length + 1) * (i + 1), data[i][j]]);////////
        }
    }

    return newData;
};

function ganeration(n) {
    let data = [];

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            let rand = Math.round(Math.random() * 5);
            data += String(rand) + " ";
        }
        if (i != n - 1) data += "\n";
    }
    return data;
}