
window.addEventListener("load", function(event) {

  "use strict";

  let resize = () => {

    display.resize(document.documentElement.clientWidth * 0.8, document.documentElement.clientHeight * 0.8, game.getHeight() / game.getWidth());
    displayTileSet.resize(document.documentElement.clientWidth * 0.28, document.documentElement.clientHeight * 0.28, game.getTileSetHeight() / game.getTileSetWidth());
    displayTileSet.render();
    display.render();

  };

  let render = () => {
    display.renderColor('WHITE');
    display.drawGride(game.tilesY, game.tilesX, game.tileSize);
    if (game.tileSetImage) {
      display.drawMap(game.tileSetImage, game.map, game.tilesY);
    }
    display.render();
  };

  let renderTileSet = () => {
    displayTileSet.renderColor('WHITE');
    if (game.tileSetImage) {
      displayTileSet.drawTileSet(game.tileSetImage);
    }
    if (game.selectedTile) {
      displayTileSet.renderHoverBox(game.selectedTile, 'rgba(37, 128, 206, 0.5)');
    }
    displayTileSet.drawGride(game.tileSetX, game.tileSetY, game.tileSize);
    displayTileSet.render();
  };

  let update = () => {

    game.update();

  };

  let controller = new Controller();
  let display = new Display(document.getElementById("tileMap"));
  let displayTileSet = new Display(document.getElementById("tileSet"));
  let game = new Game();

  display.buffer.canvas.height = game.getHeight();
  display.buffer.canvas.width = game.getWidth();

  displayTileSet.buffer.canvas.height = game.getTileSetHeight();
  displayTileSet.buffer.canvas.width = game.getTileSetWidth();

  window.addEventListener("resize", resize);
  resize();
  render();
  renderTileSet();

  displayTileSet.context.canvas.addEventListener('mousemove',
    (e) => {
      renderTileSet();
      displayTileSet.renderHoverBox(
        controller.handleMouseMove(e, displayTileSet.context.canvas, displayTileSet.buffer.canvas),
        'rgba(0, 0, 0, 0.5)'
      );
      displayTileSet.render();
    }
  );

  displayTileSet.context.canvas.addEventListener ("mouseout",
    (e) => {
      renderTileSet();
    }
  );

  displayTileSet.context.canvas.addEventListener('click',
    (e) => {
      game.selectedTile = controller.handleMouseClick(e, displayTileSet.context.canvas, displayTileSet.buffer.canvas);
      renderTileSet();
    }
  );


  display.context.canvas.addEventListener('mousemove',
    (e) => {
      if (game.selectedTile) {
        render();
        display.drawTile(
          game.tileSetImage,
          controller.handleMouseMove(e, display.context.canvas, display.buffer.canvas),
          game.selectedTile.x,
          game.selectedTile.y,
        );
        display.render();
      }
    }
  );

  display.context.canvas.addEventListener ("mouseout",
    (e) => {
      render();
    }
  );

  display.context.canvas.addEventListener('click',
    (e) => {
      if (game.selectedTile) {
        game.updateMap(
          controller.handleMouseMove(e, display.context.canvas, display.buffer.canvas),
        );
        display.render();
      }
    }
  );

  const saveSettings = document.getElementById('saveSettings');

  saveSettings.addEventListener('click', async () => {
    let settings = await controller.processSettings();
    game.updateSettings(settings, (img) => {displayTileSet.drawTileSet(img); renderTileSet(); render();});
    display.buffer.canvas.height = game.getHeight();
    display.buffer.canvas.width = game.getWidth();
    displayTileSet.buffer.canvas.height = game.getTileSetHeight();
    displayTileSet.buffer.canvas.width = game.getTileSetWidth();
    resize();
    render();
    renderTileSet();
  });

  const exportButton = document.getElementById('exportButton');

  exportButton.addEventListener('click', () => {
    let exportName = controller.getExportName();
    game.exportMap(exportName);
  });

});
