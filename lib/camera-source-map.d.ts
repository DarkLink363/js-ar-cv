import { CameraSource } from "./camera-source";
import { zappar_camera_source_t, zappar_pipeline_t } from "./gen/zappar";
import { ImageBitmapCameraSource } from "./imagebitmap-camera-source";
import { MSTPCameraSource } from "./mstp-camera-source";
export declare type CameraSourceType = CameraSource | MSTPCameraSource | ImageBitmapCameraSource;
export declare function getNextCameraSourceId(): zappar_camera_source_t;
export declare function setCameraSourceId(id: zappar_camera_source_t, c: CameraSourceType): void;
export declare function getCameraSource(id: zappar_camera_source_t): CameraSourceType | undefined;
export declare function deleteCameraSource(id: zappar_camera_source_t): void;
export declare function createCameraSource(p: zappar_pipeline_t, deviceId: string): zappar_camera_source_t;
