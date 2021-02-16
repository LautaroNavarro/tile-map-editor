
class Game {

    map = [];
    tilesX = 15;
    tilesY = 15;
    tileSetX = 6;
    tileSetY = 10;
    tileSetImage = null;
    tileSize = 16;
    selectedTool = null;
    selectedTile = null;

    exportMap (exportName) {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({'map': this.map})));
      element.setAttribute('download', exportName);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }

    updateMap (mouse) {
        this.map[(mouse.y * this.tilesX) + mouse.x] = `${this.selectedTile.x}-${this.selectedTile.y}`
    }

    getWidth () {
        return this.tileSize * this.tilesX;
    }

    getHeight () {
        return this.tileSize * this.tilesY;
    }

    getTileSetWidth () {
        return this.tileSize * this.tileSetY;
    }

    getTileSetHeight () {
        return this.tileSize * this.tileSetX;
    }

    updateSettings (settings, callback) {
        debugger;
        let img = new Image();
        img.onload = () => {callback(img)}
        img.src = URL.createObjectURL(settings.fileSelector);
        this.tileSetImage = img;
        this.tilesX = parseInt(settings.tileMapX);
        this.tilesY = parseInt(settings.tileMapY);

        if (settings.map) {
            this.map = settings.map;
        } else {
            this.map = [];
            for(let x = 0, lengthX = this.tilesX; x < lengthX; x++){
                for(let y = 0, lengthY = this.tilesY; y < lengthY; y++){
                    this.map.push(null);
                }
            }
        }
        this.tileSetX = parseInt(settings.tileSetX);
        this.tileSetY = parseInt(settings.tileSetY);
        this.tileSize = parseInt(settings.tileSize);
    }

    update () {
        // TODO: Implement
    }
}
