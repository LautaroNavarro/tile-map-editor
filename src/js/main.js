window.addEventListener("load", function(event) {

    "use strict";

    let setWidthAndHeight = () => {
      // Recalculate width and height for both canvas
      display.buffer.canvas.height = game.getHeight();
      display.buffer.canvas.width = game.getWidth();

      displayTileSet.buffer.canvas.height = game.getTileSetHeight();
      displayTileSet.buffer.canvas.width = game.getTileSetWidth();
    }

    let resize = () => {
        // Handle resize event
        display.resize(document.documentElement.clientWidth * 0.8, document.documentElement.clientHeight * 0.8, game.getHeight() / game.getWidth());
        displayTileSet.resize(document.documentElement.clientWidth * 0.28, document.documentElement.clientHeight * 0.28, game.getTileSetHeight() / game.getTileSetWidth());
        displayTileSet.render();
        display.render();

    };

    let render = () => {
        // Render tile set & tile map
        display.renderColor('WHITE');
        displayTileSet.renderColor('WHITE');

        if (game.tileSetImage) {
            display.drawMap(game.tileSetImage, game.map, game.tilesY);
            displayTileSet.drawTileSet(game.tileSetImage);
        }

        if (game.selectedTile) {
            displayTileSet.renderHoverBox(game.selectedTile, 'rgba(37, 128, 206, 0.5)');
        }

        display.drawGride(game.tilesY, game.tilesX, game.tileSize);
        displayTileSet.drawGride(game.tileSetX, game.tileSetY, game.tileSize);

        display.render();
        displayTileSet.render();
    };

    let controller = new Controller();
    let display = new Display(document.getElementById("tileMap"));
    let displayTileSet = new Display(document.getElementById("tileSet"));
    let game = new Game();

    window.addEventListener("resize", resize);
    setWidthAndHeight();
    resize();
    render();

    // Render hover in tile set
    displayTileSet.context.canvas.addEventListener('mousemove',
        (e) => {
            render();
            displayTileSet.renderHoverBox(
                controller.handleMouseMove(e, displayTileSet.context.canvas, displayTileSet.buffer.canvas),
                'rgba(0, 0, 0, 0.5)'
            );
            displayTileSet.render();
        }
    );

    // Rerender to erase hover in tile set
    displayTileSet.context.canvas.addEventListener("mouseout", (e) => {render();});

    // Tile selection
    displayTileSet.context.canvas.addEventListener('click',
        (e) => {
            game.selectedTile = controller.handleMouseClick(e, displayTileSet.context.canvas, displayTileSet.buffer.canvas);
            render();
        }
    );

    // Draw ghost tile inside map
    display.context.canvas.addEventListener('mousemove',
        (e) => {
            if (game.selectedTile && game.selectedTool == 'PEN') {
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

    // Rerender if mouse is out to erase ghost tile
    display.context.canvas.addEventListener("mouseout", (e) => {render();});

    // Add the selected tile to the selected map position
    display.context.canvas.addEventListener('click', (e) => {
      game.updateMap(
          controller.handleMouseMove(e, display.context.canvas, display.buffer.canvas),
      );
      render();
    });

    // Save settings button
    const saveSettings = document.getElementById('saveSettings');
    saveSettings.addEventListener('click', async() => {
        let settings = await controller.processSettings();
        game.updateSettings(settings, (img) => {
            displayTileSet.drawTileSet(img);
            render();
        });
        // Recalculate height and width since this can be changed
        setWidthAndHeight();
        resize();
        render();
    });

    const penButton = document.getElementById('penButton');
    const eraserButton = document.getElementById('eraserButton');

    // Pen tool button
    penButton.addEventListener('click', () => {
        game.selectPen();
        penButton.classList = "btn btn-dark active";
        eraserButton.classList = "btn btn-dark";
    });

    // Eraser tool button
    eraserButton.addEventListener('click', () => {
        game.selectEraser();
        penButton.classList = "btn btn-dark";
        eraserButton.classList = "btn btn-dark active";
    });

    // Export map button
    const exportButton = document.getElementById('exportButton');
    exportButton.addEventListener('click', () => {
        let exportName = controller.getExportName();
        game.exportMap(exportName);
    });

});