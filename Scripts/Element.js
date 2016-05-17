class Element {
    constructor(img, pos, width, height, sound) {
        this.img = img; //img TODO
        this.pos = pos; //Position
        this.width = width;
        this.height = height;
        this.sound = sound; //sound url
        //Image Data
        var g_cv = document.createElement("canvas");
        g_cv.width = this.width;
        g_cv.height = this.height;
        var g_ctx = g_cv.getContext("2d");
        g_ctx.drawImage(this.img, 0, 0, width, height);
        this.imgData = g_ctx.getImageData(0, 0, width, height);
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.pos.x, this.pos.y, this.width, this.height);
        //TODO putImageData <- mais eficaz
        //console.log("img: " + this.img + " x: " + this.pos.x + " y:" + this.pos.y + " w: " + this.width + " h:" + this.height);
    }
    clear(ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.height);
    }
    playSound() {
        //TODO
    }
    checkCollision(element) {
        if (this.checkCollisionBoundingBox(element)) {
            if (this.checkCollisionPixelByPixel(element)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    checkCollisionBoundingBox(element) {
        if (this.pos.x < element.pos.x + element.width && this.pos.x + this.width > element.pos.x && this.pos.y < element.pos.y + element.height && this.pos.y + this.height > element.pos.y) {
            return true;
        } else {
            return false;
        }
    }
    checkCollisionPixelByPixel(element) {
        var x_left = Math.floor(Math.max(this.pos.x, element.pos.x));
        var x_right = Math.floor(Math.min(this.pos.x + this.width, element.pos.x + element.width));
        var y_top = Math.floor(Math.max(this.pos.y, element.pos.y));
        var y_bottom = Math.floor(Math.min(this.pos.y + this.height, element.pos.y + element.height));

        for (var y = y_top; y < y_bottom; y++) {
            for (var x = x_left; x < x_right; x++) {
                var x_0 = Math.round(x - this.pos.x);
                var y_0 = Math.round(y - this.pos.y);
                var n_pix = y_0 * this.width + x_0; //n pixel to check
                var pix_op = this.imgData.data[4 * n_pix + 3]; //opacity (R G B A)

                var element_x_0 = Math.round(x - element.pos.x);
                var element_y_0 = Math.round(y - element.pos.y);
                var element_n_pix = element_y_0 * element.width + element_x_0; //n pixel to check
                var element_pix_op = element.imgData.data[4 * element_n_pix + 3]; //opacity (R G B A)

                if (pix_op == 255 && element_pix_op == 255) {
                    /*Debug*/
                    console.log("This -> (R:" + this.imgData.data[4 * n_pix] + ", G:" + this.imgData.data[4 * n_pix + 1] + ", B:" + this.imgData.data[4 * n_pix + 2] + ", A:" + pix_op + ")");
                    console.log("Element -> (R:" + element.imgData.data[4 * element_n_pix] + ", G:" + element.imgData.data[4 * element_n_pix + 1] + ", B:" + element.imgData.data[4 * element_n_pix + 2] + ", A:" + element_pix_op + ")");
                    console.log("Collision -> (x:" + x + ", y:" + y +")");
                    console.log("This(Local) -> (x:" + x_0 + ", y:" + y_0+")");
                    console.log("Element(Local) -> (x:" + element_x_0 + ", y:" + element_y_0+")");
                    return true;
                }
            }
        }
        return false;
    }
}
