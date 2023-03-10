import { vec2 } from "gl-matrix";
import { image_target_type_t } from "./gen/zappar-native";
export function getPreviewMesh(info) {
    switch (info.type) {
        case image_target_type_t.IMAGE_TRACKER_TYPE_PLANAR: return planar(info);
        case image_target_type_t.IMAGE_TRACKER_TYPE_CYLINDRICAL: return cylindrical(info);
        case image_target_type_t.IMAGE_TRACKER_TYPE_CONICAL: return conical(info);
    }
    return defaultMesh();
}
function planar(info) {
    const aspectRatio = info.trainedWidth / info.trainedHeight;
    if (isNaN(aspectRatio))
        return defaultMesh();
    const scaling = info.physicalScaleFactor > 0 ? info.physicalScaleFactor : 1;
    const vertices = new Float32Array([
        -1.0 * aspectRatio * scaling, -1 * scaling, 0,
        -1.0 * aspectRatio * scaling, scaling, 0,
        aspectRatio * scaling, scaling, 0,
        aspectRatio * scaling, -1 * scaling, 0
    ]);
    const indices = new Uint16Array([0, 2, 1, 0, 3, 2]);
    const uvs = new Float32Array([
        0, 0,
        0, 1,
        1, 1,
        1, 0
    ]);
    const normals = new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ]);
    return { vertices, indices, uvs, normals };
}
function defaultMesh() {
    return {
        indices: new Uint16Array(0),
        vertices: new Float32Array(0),
        normals: new Float32Array(0),
        uvs: new Float32Array(0)
    };
}
function cylindrical(info) {
    const wrap_amount = 2 * info.trainedWidth / (info.trainedHeight * info.topRadius);
    return generalConical(info, 2, false, 0, 0, 0, vec2.create(), info.trainedWidth / info.trainedHeight, wrap_amount, info.physicalScaleFactor);
}
function conical(info) {
    const radius_diff = info.topRadius - info.bottomRadius;
    const height_3d = Math.sqrt(info.sideLength * info.sideLength - radius_diff * radius_diff);
    const flip = info.bottomRadius > info.topRadius;
    let aspect_ratio = info.trainedWidth / info.trainedHeight;
    if (isNaN(aspect_ratio))
        aspect_ratio = 1;
    const cone = !(info.bottomRadius > 0) || !(info.topRadius > 0);
    const wide = info.sideLength < (2 * Math.abs(info.topRadius - info.bottomRadius));
    const top_corner = vec2.create();
    const bottom_corner = vec2.create();
    const rotation_center = vec2.create();
    if (cone) {
        if (wide) {
            if (flip) {
                rotation_center[1] = aspect_ratio - 1;
                const omega = Math.acos((2 - aspect_ratio) / aspect_ratio);
                top_corner[0] = aspect_ratio * Math.sin(omega);
                top_corner[1] = (aspect_ratio - 1) + aspect_ratio * Math.cos(omega);
                vec2.copy(bottom_corner, rotation_center);
            }
            else {
                rotation_center[1] = 1.0 - aspect_ratio;
                const omega = Math.PI + Math.acos((2 - aspect_ratio) / aspect_ratio);
                top_corner[0] = aspect_ratio * Math.sin(omega);
                top_corner[1] = (1 - aspect_ratio) + aspect_ratio * Math.cos(omega);
                vec2.copy(bottom_corner, rotation_center);
            }
        }
        else {
            if (flip) {
                rotation_center[1] = 1;
                vec2.copy(bottom_corner, rotation_center);
                top_corner[0] = aspect_ratio;
                top_corner[1] = 1 - Math.sqrt(4 - Math.pow(aspect_ratio, 2));
            }
            else {
                rotation_center[1] = -1;
                vec2.copy(bottom_corner, rotation_center);
                top_corner[0] = -aspect_ratio;
                top_corner[1] = Math.sqrt(4 - Math.pow(aspect_ratio, 2)) - 1;
            }
        }
    }
    else {
        if (wide) {
            if (flip) {
                rotation_center[1] = aspect_ratio - 1;
                const omega = Math.acos((2 - aspect_ratio) / aspect_ratio);
                top_corner[0] = aspect_ratio * Math.sin(omega);
                top_corner[1] = (aspect_ratio - 1) + aspect_ratio * Math.cos(omega);
                bottom_corner[0] = (aspect_ratio - info.sideLength) * Math.sin(omega);
                bottom_corner[1] = (aspect_ratio - 1) + (aspect_ratio - info.sideLength) * Math.cos(omega);
            }
            else {
                rotation_center[1] = 1.0 - aspect_ratio;
                const omega = Math.PI + Math.acos((2 - aspect_ratio) / aspect_ratio);
                top_corner[0] = aspect_ratio * Math.sin(omega);
                top_corner[1] = (1 - aspect_ratio) + aspect_ratio * Math.cos(omega);
                bottom_corner[0] = (aspect_ratio - info.sideLength) * Math.sin(omega);
                bottom_corner[1] = (1 - aspect_ratio) + (aspect_ratio - info.sideLength) * Math.cos(omega);
            }
        }
        else {
            const radius_ratio = flip ? (info.topRadius / info.bottomRadius) : (info.bottomRadius / info.topRadius);
            if (flip) {
                bottom_corner[0] = radius_ratio * aspect_ratio;
                bottom_corner[1] = 1;
                top_corner[0] = aspect_ratio;
                top_corner[1] = 1 - Math.sqrt((info.sideLength * info.sideLength) - ((bottom_corner[0] - top_corner[0]) * (bottom_corner[0] - top_corner[0])));
                rotation_center[1] = top_corner[1] + (top_corner[0] / (top_corner[0] - bottom_corner[0])) * (bottom_corner[1] - top_corner[1]);
            }
            else {
                bottom_corner[0] = -radius_ratio * aspect_ratio;
                bottom_corner[1] = -1;
                top_corner[0] = -aspect_ratio;
                top_corner[1] = Math.sqrt((info.sideLength * info.sideLength) - ((bottom_corner[0] - top_corner[0]) * (bottom_corner[0] - top_corner[0]))) - 1;
                rotation_center[1] = top_corner[1] - (-top_corner[0] / (bottom_corner[0] - top_corner[0])) * (top_corner[1] - bottom_corner[1]);
            }
        }
    }
    const top_from_center = vec2.create();
    vec2.subtract(top_from_center, top_corner, rotation_center);
    const bottom_from_center = vec2.create();
    vec2.subtract(bottom_from_center, bottom_corner, rotation_center);
    const top_2d_radius = vec2.length(top_from_center);
    const bottom_2d_radius = vec2.length(bottom_from_center);
    let max_angle = 2 * Math.abs(Math.atan(top_from_center[0] / top_from_center[1]));
    if (wide)
        max_angle = (2 * Math.PI) - max_angle;
    let theta_3d = (top_2d_radius * max_angle) / info.topRadius;
    let theta = Math.abs(Math.atan(top_from_center[0] / top_from_center[1]));
    if (wide)
        theta = Math.PI - theta;
    return generalConical(info, height_3d, flip, theta, bottom_2d_radius, top_2d_radius, rotation_center, aspect_ratio, theta_3d, info.physicalScaleFactor);
}
function generalConical(info, height_3d, flip, theta, bottom_2d_radius, top_2d_radius, rotation_center, aspect_ratio, wrap_amount, psf) {
    if (isNaN(aspect_ratio))
        aspect_ratio = 1;
    const vertices = [];
    const uvs = [];
    const physical_scale = psf > 0 ? psf : 1;
    const scale_factor = physical_scale * 2.0 / height_3d;
    const subdivisons = 64;
    for (let s = 0; s <= subdivisons; ++s) {
        const angle = (s * wrap_amount / subdivisons) + (((2 * Math.PI) - wrap_amount) / 2);
        const bx = info.bottomRadius * Math.sin(angle) * scale_factor;
        const bz = info.bottomRadius * Math.cos(angle) * scale_factor;
        const tx = info.topRadius * Math.sin(angle) * scale_factor;
        const tz = info.topRadius * Math.cos(angle) * scale_factor;
        const btm = -1 * physical_scale;
        const top = physical_scale;
        if (flip) {
            vertices.push(bx, btm, bz);
            vertices.push(tx, top, tz);
        }
        else {
            vertices.push(tx, top, -tz);
            vertices.push(bx, btm, -bz);
        }
    }
    for (let s = 0; s <= subdivisons; ++s) {
        if (info.type == image_target_type_t.IMAGE_TRACKER_TYPE_CYLINDRICAL) {
            const offset = 1 - (s / subdivisons);
            uvs.push(offset, 1);
            uvs.push(offset, 0);
        }
        else {
            let angle_2d = -((s / subdivisons) - 0.5) * 2 * theta;
            if (flip) {
                angle_2d = -angle_2d + theta;
                if (angle_2d > theta)
                    angle_2d = -theta + (angle_2d - theta);
            }
            const direction = vec2.create();
            direction[0] = Math.sin(angle_2d);
            direction[1] = Math.cos(angle_2d);
            if (flip)
                direction[1] *= -1;
            const bottom_px = vec2.create();
            vec2.copy(bottom_px, direction);
            vec2.scale(bottom_px, bottom_px, bottom_2d_radius);
            vec2.add(bottom_px, rotation_center, bottom_px);
            const top_px = vec2.create();
            vec2.copy(top_px, direction);
            vec2.scale(top_px, top_px, top_2d_radius);
            vec2.add(top_px, rotation_center, top_px);
            uvs.push((top_px[0] + aspect_ratio) / (2 * aspect_ratio), 1 - ((-top_px[1] + 1) / 2));
            uvs.push((bottom_px[0] + aspect_ratio) / (2 * aspect_ratio), 1 - ((-bottom_px[1] + 1) / 2));
        }
    }
    const indices = [];
    for (let i = 0; i < subdivisons; ++i) {
        const bi = i * 2;
        indices.push(bi + 1, bi + 2, bi + 3);
        indices.push(bi + 0, bi + 2, bi + 1);
    }
    return {
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices),
        normals: new Float32Array(0),
        uvs: new Float32Array(uvs)
    };
}
