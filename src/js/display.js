class TileSheet {
    image = null;
    tile_size = null;
    columns = null;

    constructor(tile_size, columns) {
        this.tile_size = tile_size;
        this.columns = columns;
    }

}

class Display {

    constructor(canvas) {
        this.buffer = document.createElement("canvas").getContext("2d"),
            this.context = canvas.getContext("2d");
        this.tile_sheet = new TileSheet(16, 8);
    }

    renderHoverBox(mouse, color) {
        let x = mouse.x * 16;
        let y = mouse.y * 16;
        this.buffer.fillStyle = color;
        this.buffer.fillRect(Math.floor(x), Math.floor(y), 16, 16);
    }

    render() {
        this.context.drawImage(
            this.buffer.canvas,
            0,
            0,
            this.buffer.canvas.width,
            this.buffer.canvas.height,
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height,
        );
    };

    drawTileSet(img) {
        this.buffer.drawImage(
            img,
            0,
            0
        );
    }

    drawGride(row, col, tile_size) {

        for (let x = 0, length = col; x <= length; x++) {
            this.drawLine(x * tile_size, 0, x * tile_size, row * tile_size);
        }
        for (let y = 0, length = row; y <= length; y++) {
            this.drawLine(0, y * tile_size, col * tile_size, y * tile_size);
        }
    }

    drawLine(fromx, fromy, tox, toy) {
        this.buffer.beginPath();
        this.buffer.moveTo(fromx, fromy);
        this.buffer.lineWidth = 0.2;
        this.buffer.strokeStyle = 'GREY';
        this.buffer.lineTo(tox, toy);
        this.buffer.stroke();
    }

    drawRect(x, y, width, height, color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(Math.floor(x), Math.floor(y), width, height);
    }

    drawTile(img, mouse, destination_x, destination_y) {
        this.buffer.drawImage(
            img,
            destination_x * this.tile_sheet.tile_size,
            destination_y * this.tile_sheet.tile_size,
            this.tile_sheet.tile_size,
            this.tile_sheet.tile_size,
            mouse.x * this.tile_sheet.tile_size,
            mouse.y * this.tile_sheet.tile_size,
            this.tile_sheet.tile_size,
            this.tile_sheet.tile_size,
        );
    };

    drawMap(image, map, columns) {

        for (let index = map.length - 1; index > -1; --index) {

            let value = map[index];
            if (value) {
                let source_x_y;
                source_x_y = value.split('-');

                let destination_x = (index % columns) * this.tile_sheet.tile_size;
                let destination_y = Math.floor(index / columns) * this.tile_sheet.tile_size;

                this.buffer.drawImage(
                    image,
                    source_x_y[0] * this.tile_sheet.tile_size,
                    source_x_y[1] * this.tile_sheet.tile_size,
                    this.tile_sheet.tile_size,
                    this.tile_sheet.tile_size,
                    destination_x,
                    destination_y,
                    this.tile_sheet.tile_size,
                    this.tile_sheet.tile_size,
                );
            }
        }
    };

    renderColor(color) {

        this.buffer.fillStyle = color;
        this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

    };

    resize(width, height, height_width_ratio) {

        if (height / width > height_width_ratio) {

            this.context.canvas.height = width * height_width_ratio;
            this.context.canvas.width = width;

        } else {

            this.context.canvas.height = height;
            this.context.canvas.width = height / height_width_ratio;

        }

        this.context.imageSmoothingEnabled = false;

    };

    handleResize(event) {
        this.resize(event);
    };

}