(function(window) {
    var canvas = document.getElementById('canvas');
    var ghostCanvas = document.createElement('canvas');
    // var ghostCanvas = document.getElementById('ghost-canvas');
    var ctx = canvas.getContext('2d');
    var ghostCtx = ghostCanvas.getContext('2d');

    var canvasWidth = canvas.width = ghostCanvas.width = window.innerWidth;
    var canvasHeight = canvas.height = ghostCanvas.height  = window.innerHeight;

    var boxList = [];
    var drawState = false;

    var draggingIndex = null;
    var ox, oy;

    function Box(x, y, width, height,color) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || '10';
        this.height = height || '10';
        this.fill = color || 'gray';

        this.isActive = false;
    }
    Box.prototype.drawOn = function(context) {
        context.fillStyle = this.fill;
        context.fillRect(this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);

        if (this.isActive) {
            context.strokeStyle = "black";
            context.strokeRect(this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
        }
    }

    init();

    function init() {
        var box1 = new Box(120, 120, 40, 40, "#47b784");
        var box2 = new Box(260, 120, 40, 40, "#3473d6");

        boxList.push(box1);
        boxList.push(box2);

        drawState = true;

        draw();
        loop();
        bindEvents();
    }
    function draw() {
        if (drawState) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            for (var i = 0; i < boxList.length; i++) {
                boxList[i].drawOn(ctx);
            }
            drawState = false;
        }
    }
    function loop() {
        draw();
        requestAnimationFrame(loop);
    }
    function bindEvents() {
        canvas.addEventListener('mousedown', mousedown);
        canvas.addEventListener('mousemove', mousemove);
        canvas.addEventListener('mouseup', mouseup);
        canvas.addEventListener('dblclick', dblclick);
    }
    function createBox(x, y) {
        var box = new Box(x, y, 40, 40, "#47b784");
        boxList.push(box);
        drawState = true;
    }
    function dblclick(event){
        createBox(event.pageX, event.pageY);
    }
    function mousedown(event) {
        var boxsLength = boxList.length;
        ox = event.pageX;
        oy = event.pageY;
        for (var i = boxsLength - 1; i >= 0; i--) {
            var box = boxList[i];
            // 清除 ghost 画板
            ghostCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            var fakeBox = new Box(box.x, box.y, box.width, box.height, 'black');
            fakeBox.drawOn(ghostCtx);
            var pixelData = ghostCtx.getImageData(ox, oy, 1, 1).data;
            if (pixelData[3] !== 0) {
                box.isActive = true;
                draggingIndex = i;
                break;
            }
        }
    }
    function mouseup(event) {
        if (typeof draggingIndex === 'number') {
            boxList[draggingIndex].isActive = false;
            draggingIndex = undefined;
            drawState = true;
        }
    }
    function mousemove(event) {
        if (typeof draggingIndex === 'number') {
            deltaX = event.pageX - ox;
            deltaY = event.pageY - oy;
            ox = event.pageX;
            oy = event.pageY;

            boxList[draggingIndex].x += deltaX;
            boxList[draggingIndex].y += deltaY;
            drawState = true;
        }
    }
})(window);
