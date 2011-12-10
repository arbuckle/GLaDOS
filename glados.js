var GLaDOS = new function() {
	var bodyCanvas,
		armCanvas,
		faceCanvas,
		bodyContext,
		armContext,
		faceContext,
		images,
		worldRect,
		mouseX,
		mouseY,
		faceRange,
		armRange,
		mouseBoundary,
		growing;


	this.init = function() {
		document.addEventListener('mousemove', updateMousePosition, false);

		bodyCanvas= document.getElementById( 'body' );
		armCanvas= document.getElementById( 'arm' );
		faceCanvas= document.getElementById( 'face' );

		bodyContext = bodyCanvas.getContext('2d');
		armContext = armCanvas.getContext('2d');
		faceContext = faceCanvas.getContext('2d');

		worldRect = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
		mouseX = worldRect.width*0.5;
		mouseY = worldRect.height*0.5;

		faceRange = 13;
		armRange = 3;
		mouseBoundary = 165; //x, y position on the page where the angular rotation of the image is 0 degrees
		growing = true;

		loadImages();

		setInterval(loop, 1000 / 15 );

	}

	function updateMousePosition(event) {
		mouseX = event.clientX - (window.innerWidth - worldRect.width) * .5;
		mouseY = event.clientY - (window.innerHeight - worldRect.height) * .5;
	}

	function drawCanvas(images) {
		bodyContext.drawImage(images.body, 0, 0, 165, 197);
		armContext.drawImage(images.arm, 0, 0, 129, 119);
		faceContext.drawImage(images.face, 0, 0, 98, 98);
	}

	function reDrawWithRotation(context, canvas, Rot, img, imgX, imgY) {
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.translate(imgX/2, imgY/2);
		context.rotate(Rot * Math.PI / 180);
		context.drawImage(img, imgX/-2, imgY/-2, imgX, imgY);

	}


	function redrawEye(posX, posY) {
		faceContext.fillStyle = "#825d27";
		faceContext.beginPath();
		faceContext.arc(posX, posY, 6, 0, Math.PI*2, true);
		faceContext.closePath();
		faceContext.fill();

		faceContext.fillStyle = "#efb348";
		faceContext.beginPath();
		faceContext.arc(posX, posY, 4, 0, Math.PI*2, true);
		faceContext.closePath();
		faceContext.fill();
	}

	function loadImages() {
		var numImages, loadedImages, sources, address;

		images = {};
		numImages = 3;
		loadedImages = 0;
		sources = {
			body: "http://catto5k.com/a/glados/body.png",
			arm: "http://catto5k.com/a/glados/arm.png",
			face: "http://catto5k.com/a/glados/face.png"
		};

		for (address in sources) {
			images[address] = new Image();
			images[address].onload = function() {
				if (loadedImages++ >= numImages-1) {
					drawCanvas(images);
				}
			};
			images[address].src = sources[address];
		}
	}

	function loop() {
		function faceMove() {
			var cR = ((mouseY / mouseBoundary) * faceRange) -faceRange;
			reDrawWithRotation(faceContext, faceCanvas, cR, images.face, 98, 98);
			//the face must be repositioned so that it appears as though it is attached to the arm
			var topRange = 7;
			var leftRange = -5;

			var faceTop = 85 + ((mouseY / mouseBoundary) * topRange) -topRange;
			var faceLeft = 131 + ((mouseY / mouseBoundary) * leftRange) -leftRange;

			faceCanvas.style.top=parseInt(faceTop) + 'px';
			faceCanvas.style.left=parseInt(faceLeft) + 'px';
		}

		function armMove() {
			var cR = ((mouseY / mouseBoundary) * armRange) -armRange;
			reDrawWithRotation(armContext, armCanvas, cR, images.arm, 129, 119);
		}

		function eyeMove() {
			//slides the eye around within the context of the face canvas.
			var range, eX, eY;
			if (mouseY < mouseBoundary) {
				range = {x:-3, y:8};
				eX = 7 + ((mouseY / mouseBoundary) * range.x);
				eY = 8 + ((mouseY / mouseBoundary) * range.y) -range.y;
				redrawEye(eX, eY);
			} else {
				if (mouseX < mouseBoundary) {
					range = {x:4, y:-8};
					eX = 4 + ((mouseX / mouseBoundary) * range.x) - range.x;
					eY = 8 + ((mouseX / mouseBoundary) * range.y) - range.y;
					redrawEye(eX, eY);
				} else {
					redrawEye(4, 8);
				}
			}
		}

		faceMove();
		armMove();
		eyeMove();
	}

}