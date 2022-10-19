// PixelGrid and PixelGrid Glimmer 1.0.0
// Developed by Sandakelum Senevirathna (www.facebook.com/iamsandakelum)
// 
// Copyright (c) 2022 Sandakelum Senevirathna
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function PixelGrid(root, width, height) {
  this.root = root;
  this.width = width;
  this.height = height;
  this.pixels = null;
  this.create();
}

PixelGrid.prototype = {
  create: function () {
    var pixels = [],
      root = this.root,
      width = this.width,
      height = this.height;

    for (var j = 0; j < height; j++) {
      var row = document.createElement("tr"),
        inner = [];
    
      for (var i = 0; i < width; i++) {
        var cell = document.createElement("td");
        
        inner.push([cell.style, [0, 0, 0], {}]);
        row.appendChild(cell);
      }

      root.appendChild(row);
      pixels.push(inner);
    }

    this.pixels = pixels;
  },

  fillRandom: function (base, variance) {
    var width = this.width,
      height = this.height;

    var base_h = base[0] - variance[0],
      base_s = base[1] - variance[1],
      base_v = base[2] - variance[2];

    var var_h = variance[0] * 2,
      var_s = variance[1] * 2,
      var_v = variance[2] * 2;

    var out = [null, null, null];

    for (var j = 0; j < height; j++) {
      for (var i = 0; i < width; i++) {
        var h = base_h + Math.random() * var_h;
        var s = base_s + Math.random() * var_s;
        var v = base_v + Math.random() * var_v;

        this._hsv2rgb(h, s, v, out);
        this.set(i, j, out[0], out[1], out[2]);
      }
    }
  },

  get: function (x, y) {
    var a = this.pixels[y][x][1];

    return [a[0], a[1], a[2]];
  },

  extra: function (x, y) {
    return this.pixels[y][x][2];
  },

  set: function (x, y, r, g, b) {
    var ele = this.pixels[y][x];

    ele[0].backgroundColor = "rgb(" + r + "," + g + "," + b + ")";

    ele[1][0] = r;
    ele[1][1] = g;
    ele[1][2] = b;
  },

  _hsv2rgb: function (h, s, v, out) {
    var r, i, f, p, q, t;

    i = Math.floor(h / 60) % 6;
    f = h / 60 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i) {
      case 0:
        out[0] = Math.floor(v * 255);
        out[1] = Math.floor(t * 255);
        out[2] = Math.floor(p * 255);
        return;
      case 1:
        out[0] = Math.floor(q * 255);
        out[1] = Math.floor(v * 255);
        out[2] = Math.floor(p * 255);
        return;
      case 2:
        out[0] = Math.floor(p * 255);
        out[1] = Math.floor(v * 255);
        out[2] = Math.floor(t * 255);
        return;
      case 3:
        out[0] = Math.floor(p * 255);
        out[1] = Math.floor(q * 255);
        out[2] = Math.floor(v * 255);
        return;
      case 4:
        out[0] = Math.floor(t * 255);
        out[1] = Math.floor(p * 255);
        out[2] = Math.floor(v * 255);
        return;
      case 5:
        out[0] = Math.floor(v * 255);
        out[1] = Math.floor(p * 255);
        out[2] = Math.floor(q * 255);
        return;
    }
  }
};

PixelGrid.Glimmer = function (pixels, count) {
  var tweens = [];

  for (var i = 0; i < count; i++) {
    tweens.push({ delay: i * 7, max_delay: 70, completed: true });
  }

  setInterval(function () {
    for (var i = 0; i < count; i++) {
      var t = tweens[i];

      if (t.completed) {
        if (t.delay > 0) {
          t.delay -= 1;
        } else {
          var x;

          do {
            t.x = Math.floor(Math.random() * pixels.width);
            t.y = Math.floor(Math.random() * pixels.height);
            x = pixels.extra(t.x, t.y);
          } while (x.animating);

          x.animating = true;

          t.to = pixels.get(t.x, t.y);
          t.from = [210, 245, 240];

          t.delta = [
            t.to[0] - t.from[0],
            t.to[1] - t.from[1],
            t.to[2] - t.from[2],
          ];

          t.progress = 0;
          t.completed = false;
        }
      } else {
        pixels.set(
          t.x,
          t.y,
          Math.floor(t.from[0] + t.delta[0] * t.progress),
          Math.floor(t.from[1] + t.delta[1] * t.progress),
          Math.floor(t.from[2] + t.delta[2] * t.progress)
        );

        t.progress += 0.04;

        if (t.progress >= 1) {
          t.delay = t.max_delay;
          t.completed = true;

          pixels.set(t.x, t.y, t.to[0], t.to[1], t.to[2]);
          pixels.extra(t.x, t.y).animating = false;
        }
      }
    }
  }, 30);
};
