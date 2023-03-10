var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HTMLElementSource } from "./html-element-source";
import { profile } from "./profile";
import { Pipeline } from "./pipeline";
import { cameraRotationForScreenOrientation } from "./cameramodel";
import { zcout } from "./loglevel";
import { deleteCameraSource } from "./camera-source-map";
let _videoSingleton = document.createElement("video");
_videoSingleton.setAttribute('playsinline', '');
_videoSingleton.setAttribute('webkit-playsinline', '');
if (profile.videoElementInDOM) {
    _videoSingleton.style.width = "0px";
    _videoSingleton.style.height = "0px";
    document.body.appendChild(_videoSingleton);
}
export class CameraSource extends HTMLElementSource {
    constructor(_impl, pipeline, _deviceId) {
        super(_videoSingleton, pipeline);
        this._impl = _impl;
        this._deviceId = _deviceId;
        this._currentStream = null;
        this._activeDeviceId = null;
        this._hasStartedOrientation = false;
        this._deviceMotionListener = (ev) => {
            let pipeline = Pipeline.get(this._pipeline);
            if (!pipeline)
                return;
            let timeStamp = (ev.timeStamp !== undefined && ev.timeStamp !== null) ? ev.timeStamp : performance.now();
            if (ev.accelerationIncludingGravity !== null &&
                ev.accelerationIncludingGravity.x !== null &&
                ev.accelerationIncludingGravity.y !== null &&
                ev.accelerationIncludingGravity.z !== null) {
                pipeline.motionAccelerometerSubmit(timeStamp, ev.accelerationIncludingGravity.x * profile.deviceMotionMutliplier, ev.accelerationIncludingGravity.y * profile.deviceMotionMutliplier, ev.accelerationIncludingGravity.z * profile.deviceMotionMutliplier);
            }
            if (ev.rotationRate !== null &&
                ev.rotationRate.alpha !== null &&
                ev.rotationRate.beta !== null &&
                ev.rotationRate.gamma !== null && !this._hasStartedOrientation) {
                ev.timeStamp;
                pipeline.motionRotationRateSubmit(timeStamp, ev.rotationRate.alpha * Math.PI / -180.0, ev.rotationRate.beta * Math.PI / -180.0, ev.rotationRate.gamma * Math.PI / -180.0);
            }
            else if (!this._hasStartedOrientation) {
                this._startDeviceOrientation();
            }
        };
    }
    destroy() {
        deleteCameraSource(this._impl);
        super.destroy();
    }
    _stop() {
        if (!this._currentStream)
            return;
        let tracks = this._currentStream.getTracks();
        tracks.forEach(t => t.stop());
        this._currentStream = null;
    }
    pause() {
        super.pause();
        this._stopDeviceMotion();
        this._syncCamera();
    }
    start() {
        super.start();
        this._startDeviceMotion();
        this._syncCamera();
    }
    _getConstraints() {
        return __awaiter(this, void 0, void 0, function* () {
            let deviceId;
            let facingMode;
            if (this._deviceId !== CameraSource.DEFAULT_DEVICE_ID &&
                this._deviceId !== CameraSource.USER_DEFAULT_DEVICE_ID) {
                // Custom device
                deviceId = this._deviceId;
            }
            else {
                facingMode = (this._deviceId === CameraSource.DEFAULT_DEVICE_ID) ? "environment" : "user";
            }
            let constraints = {
                audio: false,
                video: {
                    facingMode: facingMode,
                    width: profile.videoWidth,
                    height: profile.videoHeight,
                    frameRate: profile.requestHighFrameRate ? 60 : undefined,
                    deviceId: deviceId
                }
            };
            if (deviceId)
                return constraints;
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)
                return constraints;
            let devices = yield navigator.mediaDevices.enumerateDevices();
            let hasHadCapabilities = false;
            devices = devices.filter(val => {
                // Remove non-video devices
                if (val.kind !== "videoinput")
                    return false;
                // If the media info object contains capabilities, use it to filter to the correct facing cameras
                if (val.getCapabilities) {
                    hasHadCapabilities = true;
                    let capabilities = val.getCapabilities();
                    if (capabilities && capabilities.facingMode && capabilities.facingMode.indexOf(facingMode === "user" ? "user" : "environment") < 0)
                        return false;
                }
                return true;
            });
            // If none of the devices had capability info, or we have no devices left, fall back to the standard constraints
            if (!hasHadCapabilities || devices.length === 0) {
                return constraints;
            }
            if (typeof constraints.video === "object") {
                zcout("choosing device ID", devices[devices.length - 1].deviceId);
                constraints.video.deviceId = devices[devices.length - 1].deviceId;
            }
            return constraints;
        });
    }
    getFrame(allowRead) {
        this._cameraToScreenRotation = cameraRotationForScreenOrientation(false);
        super.getFrame(allowRead);
    }
    _getUserMedia() {
        return __awaiter(this, void 0, void 0, function* () {
            let constraints = yield this._getConstraints();
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
                return yield navigator.mediaDevices.getUserMedia(constraints);
            return yield new Promise((resolve, reject) => {
                navigator.getUserMedia(constraints, resolve, reject);
            });
        });
    }
    _syncCamera() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._currentStream && this._isPaused) {
                this._stop();
                return;
            }
            if (this._currentStream && this._activeDeviceId !== this._deviceId)
                this._stop();
            if (!this._isPaused) {
                this._activeDeviceId = this._deviceId;
                this._currentStream = yield this._getUserMedia();
                if (this._isPaused) {
                    yield this._syncCamera();
                    return;
                }
                this._isUserFacing = false;
                if (this._currentStream) {
                    let videoTracks = this._currentStream.getVideoTracks();
                    if (videoTracks.length > 0) {
                        this._isUserFacing = videoTracks[0].getSettings().facingMode === "user";
                    }
                }
                if (!(this._video instanceof HTMLVideoElement))
                    return;
                this._video.src = "";
                this._video.loop = false;
                this._video.muted = true;
                this._video.srcObject = this._currentStream;
                this._video.play();
            }
        });
    }
    _startDeviceOrientation() {
        if (this._hasStartedOrientation)
            return;
        this._hasStartedOrientation = true;
        this._deviceOrientationListener = (ev) => {
            let pipeline = Pipeline.get(this._pipeline);
            if (!pipeline)
                return;
            let timeStamp = (ev.timeStamp !== undefined && ev.timeStamp !== null) ? ev.timeStamp : performance.now();
            if (ev.alpha === null || ev.beta === null || ev.gamma === null)
                return;
            pipeline.motionAttitudeSubmit(timeStamp, ev.alpha, ev.beta, ev.gamma);
        };
        window.addEventListener("deviceorientation", this._deviceOrientationListener);
    }
    _startDeviceMotion() {
        window.addEventListener("devicemotion", this._deviceMotionListener, false);
    }
    _stopDeviceMotion() {
        window.removeEventListener("devicemotion", this._deviceMotionListener);
        if (this._deviceOrientationListener)
            window.removeEventListener("deviceorientation", this._deviceOrientationListener);
    }
}
CameraSource.USER_DEFAULT_DEVICE_ID = "Simulated User Default Device ID: a908df7f-5661-4d20-b227-a1c15d2fdb4b";
CameraSource.DEFAULT_DEVICE_ID = "Simulated Default Device ID: a908df7f-5661-4d20-b227-a1c15d2fdb4b";
