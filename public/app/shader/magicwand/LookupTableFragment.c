#include "Vision.h"

/**
 * The width/height of the square lut texture
 */
uniform float lutSize;
/**
 * The square lut texture
 */
uniform sampler2D lut;
/**
 * The coordinate of the current pixel, usually just maps to the current UV coordinate
 */
varying vec2 center;

void main() {
	gl_FragColor = texture2D(lut, vec2(center.x, 1.0 - center.y) + 0.5 / lutSize);
}
