import { mat4, vec3 } from "gl-matrix";
export function projectionMatrix(params, screenWidth, screenHeight, near = 0.01, far = 100.0) {
    let cam_x = params[2] * 2;
    let cam_y = params[3] * 2;
    let projection = mat4.create();
    mat4.frustum(projection, near * (-0.5 - params[2]) / params[0], near * (cam_x - 0.5 - params[2]) / params[0], near * (cam_y - 0.5 - params[3]) / params[1], near * (-0.5 - params[3]) / params[1], near, far);
    // Flip camera y axis (before any other transformations) - converts from
    // the y axis downwards of the  tracking camera models to the y axis upwards
    // of rendering coordinate systems
    projection[4] *= -1.0;
    projection[5] *= -1.0;
    projection[6] *= -1.0;
    projection[7] *= -1.0;
    let mult = mat4.create();
    mat4.fromScaling(mult, [0.5 * cam_x, 0.5 * cam_y, 1]);
    mat4.multiply(projection, mult, projection);
    // If it's user facing or not doesn't matter here as long as we apply the same-but-opposite
    // rotation at the end of the function
    mat4.fromRotation(mult, cameraRotationForScreenOrientation(false) * Math.PI / 180.0, [0, 0, 1]);
    mat4.multiply(projection, mult, projection);
    let vec = vec3.create();
    vec[0] = cam_x;
    vec[1] = cam_y;
    vec[2] = 0;
    vec3.transformMat4(vec, vec, mult);
    let absWidth = Math.abs(vec[0]);
    let absHeight = Math.abs(vec[1]);
    let scaleFactor = 1;
    if (absWidth / screenWidth > absHeight / screenHeight) {
        scaleFactor = screenHeight / absHeight;
    }
    else {
        scaleFactor = screenWidth / absWidth;
    }
    mat4.fromScaling(mult, [scaleFactor, scaleFactor, 1]);
    mat4.multiply(projection, mult, projection);
    mat4.fromScaling(mult, [2 / screenWidth, 2 / screenHeight, 1]);
    mat4.multiply(projection, mult, projection);
    mat4.fromRotation(mult, cameraRotationForScreenOrientation(false) * Math.PI / -180.0, [0, 0, 1]);
    mat4.multiply(projection, projection, mult);
    return projection;
}
export function cameraRotationForScreenOrientation(isUserFacing) {
    if (window.screen.orientation) {
        switch (window.screen.orientation.type) {
            case "portrait-primary":
                return isUserFacing ? 90 : 270;
            case "landscape-secondary":
                return 180;
            case "portrait-secondary":
                return isUserFacing ? 270 : 90;
            default:
                return 0;
        }
    }
    else if (window.orientation !== undefined) {
        switch (window.orientation) {
            case 0: return isUserFacing ? 90 : 270;
            case 90: return 0;
            case 180: return isUserFacing ? 270 : 90;
            case -90: return 180;
        }
    }
    return 0;
}
