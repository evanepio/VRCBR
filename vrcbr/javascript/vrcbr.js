/*
 * VR Comic Book Reader for Oculus Rift
 */
VRCBR = (function(doc) {
    "use strict";

    var imageIndex = 1;
    var LAST_IMAGE_INDEX = 5;
    var COMIC_FILE_PREFIX = 'resources/';
    var COMIC_FILE_POSTFIX = '.jpg';

    // Setup three.js WebGL renderer
    var renderer = new THREE.WebGLRenderer( { antialias: true } );

    // Append the canvas element created by the renderer to document body element.
    doc.body.appendChild( renderer.domElement );

    // Create a three.js scene
    var scene = new THREE.Scene();

    // Create a three.js camera
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

    // Apply VR headset positional data to camera.
    var controls = new THREE.VRControls( camera );

    // Apply VR stereo rendering to renderer
    var effect = new THREE.VREffect( renderer );
    effect.setSize( window.innerWidth, window.innerHeight );

    // Create 3d objects
    var geometry = new THREE.BoxGeometry( 20, 30.91, 20 );

    THREE.ImageUtils.crossOrigin = '';
    var material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture( COMIC_FILE_PREFIX + imageIndex + COMIC_FILE_POSTFIX )
    });

    var cube = new THREE.Mesh( geometry, material );

    // Position cube mesh
    cube.position.z = -20;

    // Add cube mesh to your three.js scene
    scene.add( cube );

    // Request animation frame loop function
    var animate = function() {
        // Update VR headset position and apply to camera.
        controls.update();

        // Render the scene through the VREffect.
        effect.render( scene, camera );

        requestAnimationFrame( animate );
    }

    // Kick off animation loop
    animate();

    // Listen for double click event to enter full-screen VR mode
    document.body.addEventListener( 'dblclick', function() {
        effect.setFullScreen( true );
    });

    // Listen for keyboard event and zero positional sensor on appropriate keypress.
    var onkey = function(event) {
        event.preventDefault();

        var moveValue = 0.2;
        if (event.keyCode == 90) { // z
            controls.zeroSensor();
        } else if (event.keyCode == 32) { // Space
            cube.position.x = 0;
            cube.position.y = -9;
        } else if (event.keyCode == 37) { // Left
            if (imageIndex === 1) {
                imageIndex = LAST_IMAGE_INDEX;
            } else {
                imageIndex--;
            }
            swapComicPage(imageIndex);
        } else if (event.keyCode == 38) { // Up
            cube.position.z = cube.position.z + moveValue;
        } else if (event.keyCode == 39) { // Right
            if (imageIndex === LAST_IMAGE_INDEX) {
                imageIndex = 1;
            } else {
                imageIndex++;
            }
            swapComicPage(imageIndex);
        } else if (event.keyCode == 40) { // Down
            cube.position.z = cube.position.z - moveValue;
        } else if (event.keyCode == 87) { //W
            cube.position.y = cube.position.y - moveValue;
        } else if (event.keyCode == 83) { //S
            cube.position.y = cube.position.y + moveValue;
        } else if (event.keyCode == 65) { //A 
            cube.position.x = cube.position.x + moveValue;
        } else if (event.keyCode == 68) { //D 
            cube.position.x = cube.position.x - moveValue;
        }

    };

    var swapComicPage = function(index) {
        material.map = THREE.ImageUtils.loadTexture( COMIC_FILE_PREFIX + index + COMIC_FILE_POSTFIX );
        material.needsUpdate = true;
    }

    window.addEventListener("keydown", onkey, true);


    // Handle window resizes
    var onWindowResize = function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        effect.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener( 'resize', onWindowResize, false );
    return { };
} (document) );
