 class SyncFileReader {
     ready = false;
     result = '';

     constructor(file) {
         this.file = file;
         const reader = new FileReader();
         reader.onload = (evt) => {
             this.result = evt.target.result;
             this.ready = true;
         };
         reader.readAsText(file);
     }

     sleep(ms) {
         return new Promise(resolve => setTimeout(resolve, ms));
     }

     async readAsText() {
         while (this.ready === false) {
             await this.sleep(100);
         }
         return this.result;
     }

 }


 class Controller {

     handleMouseClick(e, canvas, canvasBuffer) {
         let rect = canvas.getBoundingClientRect();
         let root = document.documentElement;

         let scaleX = canvasBuffer.width / canvas.width;
         let scaleY = canvasBuffer.height / canvas.height;

         let mouseX = (e.clientX - rect.left) * scaleX;
         let mouseY = (e.clientY - rect.top) * scaleY;

         let xPosition = Math.floor(mouseX / 16);
         let yPosition = Math.floor(mouseY / 16);
         return {
             'x': xPosition,
             'y': yPosition
         };
     }

     handleMouseMove(e, canvas, canvasBuffer) {
         let rect = canvas.getBoundingClientRect();
         let root = document.documentElement;

         let scaleX = canvasBuffer.width / canvas.width;
         let scaleY = canvasBuffer.height / canvas.height;

         let mouseX = (e.clientX - rect.left) * scaleX;
         let mouseY = (e.clientY - rect.top) * scaleY;

         let xPosition = Math.floor(mouseX / 16);
         let yPosition = Math.floor(mouseY / 16);

         return {
             'x': xPosition,
             'y': yPosition
         };
     }

     getExportName() {
         const exportName = document.getElementById('exportName');
         return exportName.value;
     }

     async processSettings() {
         const fileSelector = document.getElementById('file-selector');
         const tileMapX = document.getElementById('tile_map_x');
         const tileMapY = document.getElementById('tile_map_y');
         const tileSetX = document.getElementById('tile_set_x');
         const tileSetY = document.getElementById('tile_set_y');
         const tileSize = document.getElementById('tile_size');
         const mapFileSelector = document.getElementById('mapFileSelector');

         let response = {
             'fileSelector': fileSelector.files[0],
             'tileMapX': tileMapX.value,
             'tileMapY': tileMapY.value,
             'tileSetX': tileSetX.value,
             'tileSetY': tileSetY.value,
             'tileSize': tileSize.value,
         }
         if (mapFileSelector.files[0]) {
             const fileReader = new SyncFileReader(mapFileSelector.files[0]);
             const jsonMap = JSON.parse(await fileReader.readAsText());
             response['map'] = jsonMap.map;
         }
         return response;
     }

     update() {
         fileSelector.addEventListener('change', (event) => {
             const fileList = event.target.files;
             var img = document.createElement("img");

             img.src = URL.createObjectURL(fileList[0])
             var src = document.getElementById("image-col");
             src.appendChild(img);
         });
     }

 }