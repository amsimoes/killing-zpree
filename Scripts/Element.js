class Element {
    constructor(img, x, y, width, height) {
        this.img = document.getElementById(img); //img TODO
        this.x = x; //Position
        this.y = y;
        this.width = width;
        this.height = height;
        //this.sound = sound; //sound url

        //Image Data
        var g_cv = document.createElement("canvas");
        g_cv.width = this.width;
        g_cv.height = this.height;
        var g_ctx = g_cv.getContext("2d");
        g_ctx.drawImage(this.img, 0, 0, 32, 32);
        this.imgData = g_ctx.getImageData(0, 0, 32, 32);
    }
    update(ctx, map) {
      this.updatePosition(map);
    }
    draw(ctx) {
        ctx.save();

        //console.log("[ELEMENT] DRAW");

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        //TODO putImageData <- mais eficaz
        //console.log("img: " + this.img + " x: " + this.x + " y:" + this.y + " w: " + this.width + " h:" + this.height);

        ctx.restore();
    }
    clear(ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
    playSound() {
        //TODO
    }
    getDistance(element) {
      var vx = this.x - element.x;
      var vy = this.y - element.y;
      return Math.sqrt(vx*vx+vy*vy);
    }
    getPosition() {
      return (this.x, this.y);
    }
    checkCollision(element) {
        if (this.checkCollisionBoundingBox(element)) {
            if (this.checkCollisionPixelByPixel(element)) {
                console.log("Colisao!!!!");
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    checkCollisionBoundingBox(element) {
        if (this.x < element.x + element.width && this.x + this.width > element.x && this.y < element.y + element.height && this.y + this.height > element.y) {
            return true;
        } else {
            return false;
        }
    }
    checkCollisionPixelByPixel(element) {
        var x_left = Math.floor(Math.max(this.x, element.x));
        var x_right = Math.floor(Math.min(this.x + this.width, element.x + element.width));
        var y_top = Math.floor(Math.max(this.y, element.y));
        var y_bottom = Math.floor(Math.min(this.y + this.height, element.y + element.height));

        for (var y = y_top; y < y_bottom; y++) {
            for (var x = x_left; x < x_right; x++) {
                var x_0 = Math.round(x - this.x);
                var y_0 = Math.round(y - this.y);
                var n_pix = y_0 * this.width + x_0; //n pixel to check
                var pix_op = this.imgData.data[4 * n_pix + 3]; //opacity (R G B A)

                var element_x_0 = Math.round(x - element.x);
                var element_y_0 = Math.round(y - element.y);
                var element_n_pix = element_y_0 * element.width + element_x_0; //n pixel to check
                var element_pix_op = element.imgData.data[4 * element_n_pix + 3]; //opacity (R G B A)

                if (pix_op == 255 && element_pix_op == 255) {
                    /*Debug*/
                    /*console.log("This -> (R:" + this.imgData.data[4 * n_pix] + ", G:" + this.imgData.data[4 * n_pix + 1] + ", B:" + this.imgData.data[4 * n_pix + 2] + ", A:" + pix_op + ")");
                    console.log("Element -> (R:" + element.imgData.data[4 * element_n_pix] + ", G:" + element.imgData.data[4 * element_n_pix + 1] + ", B:" + element.imgData.data[4 * element_n_pix + 2] + ", A:" + element_pix_op + ")");
                    console.log("Collision -> (x:" + x + ", y:" + y +")");
                    console.log("This(Local) -> (x:" + x_0 + ", y:" + y_0+")");
                    console.log("Element(Local) -> (x:" + element_x_0 + ", y:" + element_y_0+")");*/
                    return true;
                }
            }
        }
        return false;
    }
}
