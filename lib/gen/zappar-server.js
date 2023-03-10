import { MessageSerializer } from "../serializer";
import { MessageDeserializer } from "../deserializer";
export class zappar_server {
    constructor(_impl, _sender) {
        this._impl = _impl;
        this._sender = _sender;
        this._deserializer = new MessageDeserializer();
        this.serializersByPipelineId = new Map();
        this._pipeline_id_by_pipeline_id = new Map();
        this._pipeline_by_instance = new Map();
        this._pipeline_id_by_camera_source_id = new Map();
        this._camera_source_by_instance = new Map();
        this._pipeline_id_by_sequence_source_id = new Map();
        this._sequence_source_by_instance = new Map();
        this._pipeline_id_by_image_tracker_id = new Map();
        this._image_tracker_by_instance = new Map();
        this._pipeline_id_by_face_tracker_id = new Map();
        this._face_tracker_by_instance = new Map();
        this._pipeline_id_by_face_mesh_id = new Map();
        this._face_mesh_by_instance = new Map();
        this._pipeline_id_by_face_landmark_id = new Map();
        this._face_landmark_by_instance = new Map();
        this._pipeline_id_by_barcode_finder_id = new Map();
        this._barcode_finder_by_instance = new Map();
        this._pipeline_id_by_instant_world_tracker_id = new Map();
        this._instant_world_tracker_by_instance = new Map();
    }
    processBuffer(b) {
        this._deserializer.setData(b);
        this._deserializer.forMessages((messageId, msg) => {
            switch (messageId) {
                case 34: {
                    this._impl.log_level_set(msg.logLevel());
                    break;
                }
                case 31: {
                    this._impl.analytics_project_id_set(msg.string());
                    break;
                }
                case 27: {
                    let clientId = msg.type();
                    let handle = this._impl.pipeline_create();
                    this._pipeline_by_instance.set(clientId, handle);
                    this._pipeline_id_by_pipeline_id.set(clientId, clientId);
                    this.serializersByPipelineId.set(clientId, new MessageSerializer(ab => {
                        this._sender(clientId, ab);
                    }));
                    break;
                }
                case 28: {
                    let clientId = msg.type();
                    let obj = this._pipeline_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.pipeline_destroy(obj);
                    this._pipeline_by_instance.delete(clientId);
                    break;
                }
                case 9: {
                    let clientId = msg.type();
                    let obj = this._pipeline_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.pipeline_frame_update(obj);
                    break;
                }
                case 8: {
                    let clientId = msg.type();
                    let obj = this._pipeline_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.pipeline_camera_frame_submit(obj, msg.dataWithLength(), msg.int(), msg.int(), msg.int(), msg.matrix4x4(), msg.cameraModel(), msg.bool());
                    break;
                }
                case 10: {
                    let clientId = msg.type();
                    let obj = this._pipeline_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.pipeline_motion_accelerometer_submit(obj, msg.timestamp(), msg.float(), msg.float(), msg.float());
                    break;
                }
                case 11: {
                    let clientId = msg.type();
                    let obj = this._pipeline_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.pipeline_motion_rotation_rate_submit(obj, msg.timestamp(), msg.float(), msg.float(), msg.float());
                    break;
                }
                case 12: {
                    let clientId = msg.type();
                    let obj = this._pipeline_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.pipeline_motion_attitude_submit(obj, msg.timestamp(), msg.float(), msg.float(), msg.float());
                    break;
                }
                case 13: {
                    let clientId = msg.type();
                    let obj = this._pipeline_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.pipeline_motion_attitude_matrix_submit(obj, msg.matrix4x4());
                    break;
                }
                case 29: {
                    let clientId = msg.type();
                    let arg_pipeline_id = msg.type();
                    let arg_pipeline = this._pipeline_by_instance.get(arg_pipeline_id);
                    let arg_device_id = msg.string();
                    let handle = this._impl.camera_source_create(arg_pipeline, arg_device_id);
                    this._camera_source_by_instance.set(clientId, handle);
                    this._pipeline_id_by_camera_source_id.set(clientId, arg_pipeline_id);
                    break;
                }
                case 30: {
                    let clientId = msg.type();
                    let obj = this._camera_source_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.camera_source_destroy(obj);
                    this._camera_source_by_instance.delete(clientId);
                    break;
                }
                case 35: {
                    let clientId = msg.type();
                    let arg_pipeline_id = msg.type();
                    let arg_pipeline = this._pipeline_by_instance.get(arg_pipeline_id);
                    let handle = this._impl.sequence_source_create(arg_pipeline);
                    this._sequence_source_by_instance.set(clientId, handle);
                    this._pipeline_id_by_sequence_source_id.set(clientId, arg_pipeline_id);
                    break;
                }
                case 36: {
                    let clientId = msg.type();
                    let obj = this._sequence_source_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.sequence_source_destroy(obj);
                    this._sequence_source_by_instance.delete(clientId);
                    break;
                }
                case 2: {
                    let clientId = msg.type();
                    let arg_pipeline_id = msg.type();
                    let arg_pipeline = this._pipeline_by_instance.get(arg_pipeline_id);
                    let handle = this._impl.image_tracker_create(arg_pipeline);
                    this._image_tracker_by_instance.set(clientId, handle);
                    this._pipeline_id_by_image_tracker_id.set(clientId, arg_pipeline_id);
                    break;
                }
                case 14: {
                    let clientId = msg.type();
                    let obj = this._image_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.image_tracker_destroy(obj);
                    this._image_tracker_by_instance.delete(clientId);
                    break;
                }
                case 4: {
                    let clientId = msg.type();
                    let obj = this._image_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.image_tracker_target_load_from_memory(obj, msg.dataWithLength());
                    break;
                }
                case 3: {
                    let clientId = msg.type();
                    let obj = this._image_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.image_tracker_enabled_set(obj, msg.bool());
                    break;
                }
                case 20: {
                    let clientId = msg.type();
                    let arg_pipeline_id = msg.type();
                    let arg_pipeline = this._pipeline_by_instance.get(arg_pipeline_id);
                    let handle = this._impl.face_tracker_create(arg_pipeline);
                    this._face_tracker_by_instance.set(clientId, handle);
                    this._pipeline_id_by_face_tracker_id.set(clientId, arg_pipeline_id);
                    break;
                }
                case 21: {
                    let clientId = msg.type();
                    let obj = this._face_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.face_tracker_destroy(obj);
                    this._face_tracker_by_instance.delete(clientId);
                    break;
                }
                case 22: {
                    let clientId = msg.type();
                    let obj = this._face_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.face_tracker_model_load_from_memory(obj, msg.dataWithLength());
                    break;
                }
                case 23: {
                    let clientId = msg.type();
                    let obj = this._face_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.face_tracker_enabled_set(obj, msg.bool());
                    break;
                }
                case 24: {
                    let clientId = msg.type();
                    let obj = this._face_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.face_tracker_max_faces_set(obj, msg.int());
                    break;
                }
                case 25: {
                    let clientId = msg.type();
                    let handle = this._impl.face_mesh_create();
                    this._face_mesh_by_instance.set(clientId, handle);
                    break;
                }
                case 26: {
                    let clientId = msg.type();
                    let obj = this._face_mesh_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.face_mesh_destroy(obj);
                    this._face_mesh_by_instance.delete(clientId);
                    break;
                }
                case 32: {
                    let clientId = msg.type();
                    let arg_landmark = msg.faceLandmarkName();
                    let handle = this._impl.face_landmark_create(arg_landmark);
                    this._face_landmark_by_instance.set(clientId, handle);
                    break;
                }
                case 33: {
                    let clientId = msg.type();
                    let obj = this._face_landmark_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.face_landmark_destroy(obj);
                    this._face_landmark_by_instance.delete(clientId);
                    break;
                }
                case 16: {
                    let clientId = msg.type();
                    let arg_pipeline_id = msg.type();
                    let arg_pipeline = this._pipeline_by_instance.get(arg_pipeline_id);
                    let handle = this._impl.barcode_finder_create(arg_pipeline);
                    this._barcode_finder_by_instance.set(clientId, handle);
                    this._pipeline_id_by_barcode_finder_id.set(clientId, arg_pipeline_id);
                    break;
                }
                case 17: {
                    let clientId = msg.type();
                    let obj = this._barcode_finder_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.barcode_finder_destroy(obj);
                    this._barcode_finder_by_instance.delete(clientId);
                    break;
                }
                case 18: {
                    let clientId = msg.type();
                    let obj = this._barcode_finder_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.barcode_finder_enabled_set(obj, msg.bool());
                    break;
                }
                case 19: {
                    let clientId = msg.type();
                    let obj = this._barcode_finder_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.barcode_finder_formats_set(obj, msg.barcodeFormat());
                    break;
                }
                case 5: {
                    let clientId = msg.type();
                    let arg_pipeline_id = msg.type();
                    let arg_pipeline = this._pipeline_by_instance.get(arg_pipeline_id);
                    let handle = this._impl.instant_world_tracker_create(arg_pipeline);
                    this._instant_world_tracker_by_instance.set(clientId, handle);
                    this._pipeline_id_by_instant_world_tracker_id.set(clientId, arg_pipeline_id);
                    break;
                }
                case 15: {
                    let clientId = msg.type();
                    let obj = this._instant_world_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.instant_world_tracker_destroy(obj);
                    this._instant_world_tracker_by_instance.delete(clientId);
                    break;
                }
                case 6: {
                    let clientId = msg.type();
                    let obj = this._instant_world_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.instant_world_tracker_enabled_set(obj, msg.bool());
                    break;
                }
                case 7: {
                    let clientId = msg.type();
                    let obj = this._instant_world_tracker_by_instance.get(clientId);
                    if (obj === undefined)
                        return;
                    this._impl.instant_world_tracker_anchor_pose_set_from_camera_offset_raw(obj, msg.float(), msg.float(), msg.float(), msg.instantTrackerTransformOrientation());
                    break;
                }
            }
        });
    }
    exploreState() {
        for (let [k, v] of this._pipeline_by_instance) {
            let pipeline = this._pipeline_id_by_pipeline_id.get(k);
            if (!pipeline)
                continue;
            let serializer = this.serializersByPipelineId.get(pipeline);
            if (!serializer)
                continue;
            serializer.sendMessage(7, msg => {
                msg.type(k);
                msg.int(this._impl.pipeline_frame_number(v));
            });
            serializer.sendMessage(6, msg => {
                msg.type(k);
                msg.cameraModel(this._impl.pipeline_camera_model(v));
            });
            serializer.sendMessage(5, msg => {
                msg.type(k);
                msg.int(this._impl.pipeline_camera_frame_user_data(v));
            });
            serializer.sendMessage(11, msg => {
                msg.type(k);
                msg.matrix4x4(this._impl.pipeline_camera_frame_camera_attitude(v));
            });
            serializer.sendMessage(12, msg => {
                msg.type(k);
                msg.matrix4x4(this._impl.pipeline_camera_frame_device_attitude(v));
            });
        }
        for (let [k, v] of this._camera_source_by_instance) {
            let pipeline = this._pipeline_id_by_camera_source_id.get(k);
            if (!pipeline)
                continue;
            let serializer = this.serializersByPipelineId.get(pipeline);
            if (!serializer)
                continue;
        }
        for (let [k, v] of this._sequence_source_by_instance) {
            let pipeline = this._pipeline_id_by_sequence_source_id.get(k);
            if (!pipeline)
                continue;
            let serializer = this.serializersByPipelineId.get(pipeline);
            if (!serializer)
                continue;
        }
        for (let [k, v] of this._image_tracker_by_instance) {
            let pipeline = this._pipeline_id_by_image_tracker_id.get(k);
            if (!pipeline)
                continue;
            let serializer = this.serializersByPipelineId.get(pipeline);
            if (!serializer)
                continue;
            serializer.sendMessage(19, msg => {
                msg.type(k);
                msg.int(this._impl.image_tracker_target_loaded_version(v));
            });
            serializer.sendMessage(1, msg => {
                msg.type(k);
                msg.int(this._impl.image_tracker_anchor_count(v));
            });
            for (let i = 0; i < this._impl.image_tracker_anchor_count(v); i++) {
                serializer.sendMessage(2, msg => {
                    msg.type(k);
                    msg.int(i);
                    msg.string(this._impl.image_tracker_anchor_id(v, i));
                });
            }
            for (let i = 0; i < this._impl.image_tracker_anchor_count(v); i++) {
                serializer.sendMessage(3, msg => {
                    msg.type(k);
                    msg.int(i);
                    msg.matrix4x4(this._impl.image_tracker_anchor_pose_raw(v, i));
                });
            }
        }
        for (let [k, v] of this._face_tracker_by_instance) {
            let pipeline = this._pipeline_id_by_face_tracker_id.get(k);
            if (!pipeline)
                continue;
            let serializer = this.serializersByPipelineId.get(pipeline);
            if (!serializer)
                continue;
            serializer.sendMessage(18, msg => {
                msg.type(k);
                msg.int(this._impl.face_tracker_model_loaded_version(v));
            });
            serializer.sendMessage(13, msg => {
                msg.type(k);
                msg.int(this._impl.face_tracker_anchor_count(v));
            });
            for (let i = 0; i < this._impl.face_tracker_anchor_count(v); i++) {
                serializer.sendMessage(14, msg => {
                    msg.type(k);
                    msg.int(i);
                    msg.string(this._impl.face_tracker_anchor_id(v, i));
                });
            }
            for (let i = 0; i < this._impl.face_tracker_anchor_count(v); i++) {
                serializer.sendMessage(15, msg => {
                    msg.type(k);
                    msg.int(i);
                    msg.matrix4x4(this._impl.face_tracker_anchor_pose_raw(v, i));
                });
            }
            for (let i = 0; i < this._impl.face_tracker_anchor_count(v); i++) {
                serializer.sendMessage(16, msg => {
                    msg.type(k);
                    msg.int(i);
                    msg.identityCoefficients(this._impl.face_tracker_anchor_identity_coefficients(v, i));
                });
            }
            for (let i = 0; i < this._impl.face_tracker_anchor_count(v); i++) {
                serializer.sendMessage(17, msg => {
                    msg.type(k);
                    msg.int(i);
                    msg.expressionCoefficients(this._impl.face_tracker_anchor_expression_coefficients(v, i));
                });
            }
        }
        for (let [k, v] of this._face_mesh_by_instance) {
            let pipeline = this._pipeline_id_by_face_mesh_id.get(k);
            if (!pipeline)
                continue;
            let serializer = this.serializersByPipelineId.get(pipeline);
            if (!serializer)
                continue;
        }
        for (let [k, v] of this._face_landmark_by_instance) {
            let pipeline = this._pipeline_id_by_face_landmark_id.get(k);
            if (!pipeline)
                continue;
            let serializer = this.serializersByPipelineId.get(pipeline);
            if (!serializer)
                continue;
        }
        for (let [k, v] of this._barcode_finder_by_instance) {
            let pipeline = this._pipeline_id_by_barcode_finder_id.get(k);
            if (!pipeline)
                continue;
            let serializer = this.serializersByPipelineId.get(pipeline);
            if (!serializer)
                continue;
            serializer.sendMessage(8, msg => {
                msg.type(k);
                msg.int(this._impl.barcode_finder_found_number(v));
            });
            for (let i = 0; i < this._impl.barcode_finder_found_number(v); i++) {
                serializer.sendMessage(9, msg => {
                    msg.type(k);
                    msg.int(i);
                    msg.string(this._impl.barcode_finder_found_text(v, i));
                });
            }
            for (let i = 0; i < this._impl.barcode_finder_found_number(v); i++) {
                serializer.sendMessage(10, msg => {
                    msg.type(k);
                    msg.int(i);
                    msg.barcodeFormat(this._impl.barcode_finder_found_format(v, i));
                });
            }
        }
        for (let [k, v] of this._instant_world_tracker_by_instance) {
            let pipeline = this._pipeline_id_by_instant_world_tracker_id.get(k);
            if (!pipeline)
                continue;
            let serializer = this.serializersByPipelineId.get(pipeline);
            if (!serializer)
                continue;
            serializer.sendMessage(4, msg => {
                msg.type(k);
                msg.matrix4x4(this._impl.instant_world_tracker_anchor_pose_raw(v));
            });
        }
    }
}
