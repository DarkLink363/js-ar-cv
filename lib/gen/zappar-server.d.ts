import { MessageSerializer } from "../serializer";
import { zappar_cwrap } from "./zappar-native";
import { zappar_pipeline_t } from "./zappar-native";
import { zappar_camera_source_t } from "./zappar-native";
import { zappar_sequence_source_t } from "./zappar-native";
import { zappar_image_tracker_t } from "./zappar-native";
import { zappar_face_tracker_t } from "./zappar-native";
import { zappar_face_mesh_t } from "./zappar-native";
import { zappar_face_landmark_t } from "./zappar-native";
import { zappar_barcode_finder_t } from "./zappar-native";
import { zappar_instant_world_tracker_t } from "./zappar-native";
export declare class zappar_server {
    private _impl;
    private _sender;
    constructor(_impl: zappar_cwrap, _sender: (pipeline: number, ab: ArrayBuffer) => void);
    private _deserializer;
    serializersByPipelineId: Map<number, MessageSerializer>;
    _pipeline_id_by_pipeline_id: Map<number, number>;
    _pipeline_by_instance: Map<number, zappar_pipeline_t>;
    _pipeline_id_by_camera_source_id: Map<number, number>;
    _camera_source_by_instance: Map<number, zappar_camera_source_t>;
    _pipeline_id_by_sequence_source_id: Map<number, number>;
    _sequence_source_by_instance: Map<number, zappar_sequence_source_t>;
    _pipeline_id_by_image_tracker_id: Map<number, number>;
    _image_tracker_by_instance: Map<number, zappar_image_tracker_t>;
    _pipeline_id_by_face_tracker_id: Map<number, number>;
    _face_tracker_by_instance: Map<number, zappar_face_tracker_t>;
    _pipeline_id_by_face_mesh_id: Map<number, number>;
    _face_mesh_by_instance: Map<number, zappar_face_mesh_t>;
    _pipeline_id_by_face_landmark_id: Map<number, number>;
    _face_landmark_by_instance: Map<number, zappar_face_landmark_t>;
    _pipeline_id_by_barcode_finder_id: Map<number, number>;
    _barcode_finder_by_instance: Map<number, zappar_barcode_finder_t>;
    _pipeline_id_by_instant_world_tracker_id: Map<number, number>;
    _instant_world_tracker_by_instance: Map<number, zappar_instant_world_tracker_t>;
    processBuffer(b: ArrayBuffer): void;
    exploreState(): void;
}
