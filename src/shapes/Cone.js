module.exports = Cone;

var Shape = require('./Shape');
var Vec3 = require('../math/Vec3');

/**
 * Conical shape
 * @class Cone
 * @constructor
 * @extends Shape
 * @param{Number} halfHeight
 * @param {Number} radius The radius of the cone, a non-negative number.
 */
function Cone(height,radius){
    Shape.call(this, {
        type: Shape.types.CONE
    });

	
	this.height = height;
	
    this.radius = radius !== undefined ? radius : 1.0;

    if(this.radius < 0){
        throw new Error('The sphere radius cannot be negative.');
    }

    this.convexPolyhedronRepresentation = null;

    this.updateConvexPolyhedronRepresentation();
    this.updateBoundingSphereRadius();
}


Cone.prototype = new Shape();
Cone.prototype.constructor = Cone;


//need to wor on this
Cone.prototype.updateConvexPolyhedronRepresentation = function(){
    
	//Vertex
    var V = Vec3;
	cos = Math.cos,
    sin = Math.sin;
    verts = [],
    axes = [],
    faces = [],
    bottomface = [],
	topface = []
	N = 8
	
	// First bottom point
    verts.push(new Vec3(this.radius*cos(0),
                               this.radius*sin(0),
                               -height*0.5));
    bottomface.push(0);
	
	 // First top point
    verts.push(new Vec3(0,0,height*0.5));
   
    topface.push(1);
	
	for(var i=0; i<N; i++){
        var theta = 2*Math.PI/N * (i+1);
        var thetaN = 2*Math.PI/N * (i+0.5);
        if(i<N-1){
            // Bottom
            verts.push(new Vec3(radiusBottom*cos(theta),
                                       radiusBottom*sin(theta),
                                       -height*0.5));
            bottomface.push(2 + i);
     

            // Face
            faces.push([i+2, 1, 2 * i]);
        } 
		else {
		faces.push([0,1, 8]); // Connect
        }

  
    }


    var h = new ConvexPolyhedron(verts, indices);
    this.convexPolyhedronRepresentation = h;
    h.material = this.material;
};


//Calculate the inertia for a cone
Cone.prototype.calculateLocalInertia = function(mass,target){
    target = target || new Vec3();
    target.x = ((3*mass)/20) + ((this.radius*this.radius)+ (4 * (this.height*this.height)));
    target.y = ((3*mass)/20) + ((this.radius*this.radius)+ (4 * (this.height*this.height)));
    target.z = (3*mass* (this.radius*this.radius) )/  10;
    return target;
};

//Calculate the volume for a cone
Cone.prototype.volume = function(){
    return  (this.radius*this.radius) * Math.PI * ((this.height) / 3.0);
};

//Update the radius when using bounding spere checks
Cone.prototype.updateBoundingSphereRadius() = function(){
    this.boundingSphereRadius = this.radius;
};
