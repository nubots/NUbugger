/**
 * This is the Goal object, It is an yellow cylinder.
 */
(function (THREE) {

    "use strict";

    var Cylinder;

    /**
     * This constructs a cylinder of a particular top and bottom radius, height and color.
     *
     * @param parameters the top and bottom radius, height and color of the cylinder.
     * @constructor
     */
    Cylinder = function (parameters) {
        // Call super constructor.
        THREE.Object3D.call(this);
        // Ensure parameters is not undefined.
        parameters = parameters || {};
        // Rhe top and bottom radius, height and amount of segments in the cylinder and its color.
        var topRadius = parameters.topRadius || Field.constants.GOAL_POST_DIAMETER * 0.5;
        var bottomRadius = parameters.bottomRadius || Field.constants.GOAL_POST_DIAMETER * 0.5;
        var height = parameters.height || Field.constants.GOAL_CROSSBAR_HEIGHT;
        var segments = 50;
        var color = parameters.color || 0xFFCF12;
        // Create the cylinder geometry.
        var geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, segments);
        // Create a material.
        var material = new THREE.MeshLambertMaterial({
            color: color
        });
        // Create the cylinder mesh with its geometry and specified material.
        this.mesh = new THREE.Mesh(geometry, material);
		// Move the position of the object.
		this.position.copy(parameters.position || new THREE.Vector3(0, 0, 0));
        // Set the rotation of the cylinder.
        var rotationX = (parameters.rotation && parameters.rotation.x) || (0.5 * Math.PI);
        var rotationY = (parameters.rotation && parameters.rotation.y) || 0;
        var rotationZ = (parameters.rotation && parameters.rotation.z) || 0;
        this.mesh.rotation.set(rotationX, rotationY, rotationZ);
	    // Add a name to the object.
	    this.name = parameters.name || 'Cylinder';
        // Add the cylinder to the object.
        this.add(this.mesh);
    };

    Cylinder.prototype = Object.create(THREE.Object3D.prototype);
    // Export the object.
    window.Cylinder = Cylinder;

}(window.THREE));
