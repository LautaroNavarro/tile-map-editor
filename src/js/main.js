window.addEventListener("load", function(event) {

    "use strict";

    let setWidthAndHeight = () => {
        // Recalculate width and height for both canvas
        mapDisplay.buffer.canvas.height = mapCreator.getHeight();
        mapDisplay.buffer.canvas.width = mapCreator.getWidth();

        tileSetDisplay.buffer.canvas.height = mapCreator.getTileSetHeight();
        tileSetDisplay.buffer.canvas.width = mapCreator.getTileSetWidth();
    }

    let resize = () => {
        // Handle resize event
        mapDisplay.resize(document.documentElement.clientWidth * 0.8, document.documentElement.clientHeight * 0.8, mapCreator.getHeight() / mapCreator.getWidth());
        tileSetDisplay.resize(document.documentElement.clientWidth * 0.28, document.documentElement.clientHeight * 0.28, mapCreator.getTileSetHeight() / mapCreator.getTileSetWidth());
        tileSetDisplay.render();
        mapDisplay.render();

    };

    let render = () => {
        // Render tile set & tile map
        mapDisplay.renderColor('WHITE');
        tileSetDisplay.renderColor('WHITE');

        if (mapCreator.tileSetImage) {
            mapDisplay.drawMap(mapCreator.tileSetImage, mapCreator.map, mapCreator.tilesX);
            tileSetDisplay.drawTileSet(mapCreator.tileSetImage);
        }

        if (mapCreator.selectedTile) {
            tileSetDisplay.renderHoverBox(mapCreator.selectedTile, 'rgba(37, 128, 206, 0.5)');
        }

        mapDisplay.drawGride(mapCreator.tilesY, mapCreator.tilesX, mapCreator.tileSize);
        tileSetDisplay.drawGride(mapCreator.tileSetX, mapCreator.tileSetY, mapCreator.tileSize);

        mapDisplay.render();
        tileSetDisplay.render();
    };

    let controller = new Controller();
    let mapDisplay = new Display(document.getElementById("tileMap"));
    let tileSetDisplay = new Display(document.getElementById("tileSet"));
    let mapCreator = new MapCreator();

    window.addEventListener("resize", resize);
    setWidthAndHeight();
    resize();
    render();

    // Render hover in tile set
    tileSetDisplay.context.canvas.addEventListener('mousemove',
        (e) => {
            render();
            tileSetDisplay.renderHoverBox(
                controller.handleMouseMove(e, tileSetDisplay.context.canvas, tileSetDisplay.buffer.canvas),
                'rgba(0, 0, 0, 0.5)'
            );
            tileSetDisplay.render();
        }
    );

    // Rerender to erase hover in tile set
    tileSetDisplay.context.canvas.addEventListener("mouseout", (e) => {
        render();
    });

    // Tile selection
    tileSetDisplay.context.canvas.addEventListener('click',
        (e) => {
            mapCreator.selectedTile = controller.handleMouseClick(e, tileSetDisplay.context.canvas, tileSetDisplay.buffer.canvas);
            render();
        }
    );

    // Draw ghost tile inside map
    mapDisplay.context.canvas.addEventListener('mousemove',
        (e) => {
            if (mapCreator.selectedTile && mapCreator.selectedTool == 'PEN') {
                render();
                mapDisplay.drawTile(
                    mapCreator.tileSetImage,
                    controller.handleMouseMove(e, mapDisplay.context.canvas, mapDisplay.buffer.canvas),
                    mapCreator.selectedTile.x,
                    mapCreator.selectedTile.y,
                );
                mapDisplay.render();
            }
        }
    );

    // Rerender if mouse is out to erase ghost tile
    mapDisplay.context.canvas.addEventListener("mouseout", (e) => {
        render();
    });

    // Add the selected tile to the selected map position
    mapDisplay.context.canvas.addEventListener('click', (e) => {
        mapCreator.updateMap(
            controller.handleMouseClick(e, mapDisplay.context.canvas, mapDisplay.buffer.canvas),
        );
        render();
    });

    // Save settings button
    const saveSettings = document.getElementById('saveSettings');
    saveSettings.addEventListener('click', async() => {
        let settings = await controller.processSettings();
        mapCreator.updateSettings(settings, (img) => {
            tileSetDisplay.drawTileSet(img);
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
        mapCreator.selectPen();
        penButton.classList = "btn btn-dark active";
        eraserButton.classList = "btn btn-dark";
    });

    // Eraser tool button
    eraserButton.addEventListener('click', () => {
        mapCreator.selectEraser();
        penButton.classList = "btn btn-dark";
        eraserButton.classList = "btn btn-dark active";
    });

    // Export map button
    const exportButton = document.getElementById('exportButton');
    exportButton.addEventListener('click', () => {
        let exportName = controller.getExportName();
        mapCreator.exportMap(exportName);
    });

});