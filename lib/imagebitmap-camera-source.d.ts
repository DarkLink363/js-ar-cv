import { zappar_camera_source_t, zappar_pipeline_t } from "./gen/zappar";
import { CameraFrameInfo, Source } from "./source";
export declare class ImageBitmapCameraSource extends Source {
    private _impl;
    private _pipeline;
    private _deviceId;
    static USER_DEFAULT_DEVICE_ID: string;
    static DEFAULT_DEVICE_ID: string;
    private _currentStream;
    private _activeDeviceId;
    private _isPaused;
    private _isUserFacing;
    private _hadFrames;
    private _canvas;
    private _context;
    private _lastFrameTime;
    private _video;
    private _cameraToDeviceTransform;
    private _cameraToDeviceTransformUserFacing;
    private _cameraModel;
    constructor(_impl: zappar_camera_source_t, _pipeline: zappar_pipeline_t, _deviceId: string);
    destroy(): void;
    private _stop;
    pause(): void;
    start(): void;
    private _getConstraints;
    getFrame(currentlyProcessing: boolean): void;
    private _getUserMedia;
    private _syncCamera;
    private _hasStartedOrientation;
    private _deviceMotionListener;
    private _startDeviceOrientation;
    private _startDeviceMotion;
    private _stopDeviceMotion;
    uploadGL(info: CameraFrameInfo): void;
}
