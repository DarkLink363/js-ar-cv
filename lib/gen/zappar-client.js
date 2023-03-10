import { MessageSerializer } from "../serializer";
import { MessageDeserializer } from "../deserializer";
export class zappar_client {
    constructor(_messageSender) {
        this._messageSender = _messageSender;
        this._globalState = {
            log_level: 1,
        };
        this.serializer = new MessageSerializer(ab => {
            this._messageSender(ab);
        });
        this.deserializer = new MessageDeserializer();
        this._latestId = 1;
        this._pipeline_state_by_instance = new Map();
        this._camera_source_state_by_instance = new Map();
        this._sequence_source_state_by_instance = new Map();
        this._image_tracker_state_by_instance = new Map();
        this._face_tracker_state_by_instance = new Map();
        this._face_mesh_state_by_instance = new Map();
        this._face_landmark_state_by_instance = new Map();
        this._barcode_finder_state_by_instance = new Map();
        this._instant_world_tracker_state_by_instance = new Map();
        this.impl = {
            log_level: () => {
                return this._globalState.log_level;
            },
            log_level_set: (level) => {
                this.serializer.sendMessage(34, m => {
                    m.logLevel(level);
                });
            },
            analytics_project_id_set: (id) => {
                this.serializer.sendMessage(31, m => {
                    m.string(id);
                });
            },
            // #### pipeline ####
            pipeline_create: () => {
                let newId = (this._latestId++);
                let s = {
                    current_frame_user_data: 0,
                    camera_model: new Float32Array([300, 300, 160, 120, 0, 0]),
                    camera_pose: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
                    camera_frame_camera_attitude: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
                    camera_frame_device_attitude: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
                    frame_number: 0,
                };
                this._pipeline_state_by_instance.set(newId, s);
                this.serializer.sendMessage(27, m => {
                    m.type(newId);
                });
                return newId;
            },
            pipeline_destroy: (o) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this._pipeline_state_by_instance.delete(o);
                this.serializer.sendMessage(28, m => {
                    m.type(o);
                });
            },
            pipeline_frame_update: (o) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(9, m => {
                    m.type(o);
                });
            },
            pipeline_frame_number: (o) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.frame_number;
            },
            pipeline_camera_model: (o) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.camera_model;
            },
            pipeline_camera_frame_user_data: (o) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.current_frame_user_data;
            },
            pipeline_camera_frame_submit: (o, data, width, height, user_data, camera_to_device_transform, camera_model, user_facing) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(8, m => {
                    m.type(o);
                    m.dataWithLength(data);
                    m.int(width);
                    m.int(height);
                    m.int(user_data);
                    m.matrix4x4(camera_to_device_transform);
                    m.cameraModel(camera_model);
                    m.bool(user_facing);
                });
            },
            pipeline_camera_frame_submit_raw_pointer: (o, data, dataLength, format, width, height, user_data, camera_to_device_transform, rotation, camera_model, user_facing) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
            },
            pipeline_camera_frame_camera_attitude: (o) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.camera_frame_camera_attitude;
            },
            pipeline_camera_frame_device_attitude: (o) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.camera_frame_device_attitude;
            },
            pipeline_motion_accelerometer_submit: (o, time, x, y, z) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(10, m => {
                    m.type(o);
                    m.timestamp(time);
                    m.float(x);
                    m.float(y);
                    m.float(z);
                });
            },
            pipeline_motion_rotation_rate_submit: (o, time, x, y, z) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(11, m => {
                    m.type(o);
                    m.timestamp(time);
                    m.float(x);
                    m.float(y);
                    m.float(z);
                });
            },
            pipeline_motion_attitude_submit: (o, time, x, y, z) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(12, m => {
                    m.type(o);
                    m.timestamp(time);
                    m.float(x);
                    m.float(y);
                    m.float(z);
                });
            },
            pipeline_motion_attitude_matrix_submit: (o, mat) => {
                let s = this._pipeline_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(13, m => {
                    m.type(o);
                    m.matrix4x4(mat);
                });
            },
            // #### camera_source ####
            camera_source_create: (pipeline, device_id) => {
                let newId = (this._latestId++);
                let s = {};
                this._camera_source_state_by_instance.set(newId, s);
                this.serializer.sendMessage(29, m => {
                    m.type(newId);
                    m.type(pipeline);
                    m.string(device_id);
                });
                return newId;
            },
            camera_source_destroy: (o) => {
                let s = this._camera_source_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this._camera_source_state_by_instance.delete(o);
                this.serializer.sendMessage(30, m => {
                    m.type(o);
                });
            },
            // #### sequence_source ####
            sequence_source_create: (pipeline) => {
                let newId = (this._latestId++);
                let s = {};
                this._sequence_source_state_by_instance.set(newId, s);
                this.serializer.sendMessage(35, m => {
                    m.type(newId);
                    m.type(pipeline);
                });
                return newId;
            },
            sequence_source_destroy: (o) => {
                let s = this._sequence_source_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this._sequence_source_state_by_instance.delete(o);
                this.serializer.sendMessage(36, m => {
                    m.type(o);
                });
            },
            // #### image_tracker ####
            image_tracker_create: (pipeline) => {
                let newId = (this._latestId++);
                let s = {
                    enabled: true,
                    target_loaded_version: -1,
                    anchor_count: 0,
                    anchor_id: [],
                    anchor_pose: [],
                };
                this._image_tracker_state_by_instance.set(newId, s);
                this.serializer.sendMessage(2, m => {
                    m.type(newId);
                    m.type(pipeline);
                });
                return newId;
            },
            image_tracker_destroy: (o) => {
                let s = this._image_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this._image_tracker_state_by_instance.delete(o);
                this.serializer.sendMessage(14, m => {
                    m.type(o);
                });
            },
            image_tracker_target_load_from_memory: (o, data) => {
                let s = this._image_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(4, m => {
                    m.type(o);
                    m.dataWithLength(data);
                });
            },
            image_tracker_target_loaded_version: (o) => {
                let s = this._image_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.target_loaded_version;
            },
            image_tracker_enabled: (o) => {
                let s = this._image_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.enabled;
            },
            image_tracker_enabled_set: (o, enabled) => {
                let s = this._image_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(3, m => {
                    m.type(o);
                    m.bool(enabled);
                });
            },
            image_tracker_anchor_count: (o) => {
                let s = this._image_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.anchor_count;
            },
            image_tracker_anchor_id: (o, indx) => {
                let s = this._image_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.anchor_id[indx];
            },
            image_tracker_anchor_pose_raw: (o, indx) => {
                let s = this._image_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.anchor_pose[indx];
            },
            // #### face_tracker ####
            face_tracker_create: (pipeline) => {
                let newId = (this._latestId++);
                let s = {
                    enabled: true,
                    model_loaded: -1,
                    max_faces: 1,
                    anchor_count: 0,
                    anchor_id: [],
                    anchor_pose: [],
                    anchor_identity_coefficients: [],
                    anchor_expression_coefficients: [],
                };
                this._face_tracker_state_by_instance.set(newId, s);
                this.serializer.sendMessage(20, m => {
                    m.type(newId);
                    m.type(pipeline);
                });
                return newId;
            },
            face_tracker_destroy: (o) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this._face_tracker_state_by_instance.delete(o);
                this.serializer.sendMessage(21, m => {
                    m.type(o);
                });
            },
            face_tracker_model_load_from_memory: (o, data) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(22, m => {
                    m.type(o);
                    m.dataWithLength(data);
                });
            },
            face_tracker_model_loaded_version: (o) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.model_loaded;
            },
            face_tracker_enabled_set: (o, enabled) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(23, m => {
                    m.type(o);
                    m.bool(enabled);
                });
            },
            face_tracker_enabled: (o) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.enabled;
            },
            face_tracker_max_faces_set: (o, num) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(24, m => {
                    m.type(o);
                    m.int(num);
                });
            },
            face_tracker_max_faces: (o) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.max_faces;
            },
            face_tracker_anchor_count: (o) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.anchor_count;
            },
            face_tracker_anchor_id: (o, indx) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.anchor_id[indx];
            },
            face_tracker_anchor_pose_raw: (o, indx) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.anchor_pose[indx];
            },
            face_tracker_anchor_identity_coefficients: (o, indx) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.anchor_identity_coefficients[indx];
            },
            face_tracker_anchor_expression_coefficients: (o, indx) => {
                let s = this._face_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.anchor_expression_coefficients[indx];
            },
            // #### face_mesh ####
            face_mesh_create: () => {
                let newId = (this._latestId++);
                let s = {};
                this._face_mesh_state_by_instance.set(newId, s);
                this.serializer.sendMessage(25, m => {
                    m.type(newId);
                });
                return newId;
            },
            face_mesh_destroy: (o) => {
                let s = this._face_mesh_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this._face_mesh_state_by_instance.delete(o);
                this.serializer.sendMessage(26, m => {
                    m.type(o);
                });
            },
            // #### face_landmark ####
            face_landmark_create: (landmark) => {
                let newId = (this._latestId++);
                let s = {};
                this._face_landmark_state_by_instance.set(newId, s);
                this.serializer.sendMessage(32, m => {
                    m.type(newId);
                    m.faceLandmarkName(landmark);
                });
                return newId;
            },
            face_landmark_destroy: (o) => {
                let s = this._face_landmark_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this._face_landmark_state_by_instance.delete(o);
                this.serializer.sendMessage(33, m => {
                    m.type(o);
                });
            },
            // #### barcode_finder ####
            barcode_finder_create: (pipeline) => {
                let newId = (this._latestId++);
                let s = {
                    enabled: true,
                    number_found: 0,
                    found_text: [],
                    found_format: [],
                    formats: (1 << 17) - 1,
                };
                this._barcode_finder_state_by_instance.set(newId, s);
                this.serializer.sendMessage(16, m => {
                    m.type(newId);
                    m.type(pipeline);
                });
                return newId;
            },
            barcode_finder_destroy: (o) => {
                let s = this._barcode_finder_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this._barcode_finder_state_by_instance.delete(o);
                this.serializer.sendMessage(17, m => {
                    m.type(o);
                });
            },
            barcode_finder_enabled_set: (o, enabled) => {
                let s = this._barcode_finder_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(18, m => {
                    m.type(o);
                    m.bool(enabled);
                });
            },
            barcode_finder_enabled: (o) => {
                let s = this._barcode_finder_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.enabled;
            },
            barcode_finder_found_number: (o) => {
                let s = this._barcode_finder_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.number_found;
            },
            barcode_finder_found_text: (o, indx) => {
                let s = this._barcode_finder_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.found_text[indx];
            },
            barcode_finder_found_format: (o, indx) => {
                let s = this._barcode_finder_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.found_format[indx];
            },
            barcode_finder_formats: (o) => {
                let s = this._barcode_finder_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.formats;
            },
            barcode_finder_formats_set: (o, f) => {
                let s = this._barcode_finder_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(19, m => {
                    m.type(o);
                    m.barcodeFormat(f);
                });
            },
            // #### instant_world_tracker ####
            instant_world_tracker_create: (pipeline) => {
                let newId = (this._latestId++);
                let s = {
                    enabled: true,
                    pose: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
                };
                this._instant_world_tracker_state_by_instance.set(newId, s);
                this.serializer.sendMessage(5, m => {
                    m.type(newId);
                    m.type(pipeline);
                });
                return newId;
            },
            instant_world_tracker_destroy: (o) => {
                let s = this._instant_world_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this._instant_world_tracker_state_by_instance.delete(o);
                this.serializer.sendMessage(15, m => {
                    m.type(o);
                });
            },
            instant_world_tracker_enabled_set: (o, enabled) => {
                let s = this._instant_world_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(6, m => {
                    m.type(o);
                    m.bool(enabled);
                });
            },
            instant_world_tracker_enabled: (o) => {
                let s = this._instant_world_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.enabled;
            },
            instant_world_tracker_anchor_pose_raw: (o) => {
                let s = this._instant_world_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                return s.pose;
            },
            instant_world_tracker_anchor_pose_set_from_camera_offset_raw: (o, x, y, z, orientation) => {
                let s = this._instant_world_tracker_state_by_instance.get(o);
                if (!s)
                    throw new Error("This object has been destroyed");
                this.serializer.sendMessage(7, m => {
                    m.type(o);
                    m.float(x);
                    m.float(y);
                    m.float(z);
                    m.instantTrackerTransformOrientation(orientation);
                });
            },
        };
    }
    processMessages(a) {
        this.deserializer.setData(a);
        this.deserializer.forMessages((messageId, msg) => {
            switch (messageId) {
                case 7: {
                    let handle = msg.type();
                    let inst = this._pipeline_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.frame_number = msg.int();
                    break;
                }
                case 6: {
                    let handle = msg.type();
                    let inst = this._pipeline_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.camera_model = msg.cameraModel();
                    break;
                }
                case 5: {
                    let handle = msg.type();
                    let inst = this._pipeline_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.current_frame_user_data = msg.int();
                    break;
                }
                case 11: {
                    let handle = msg.type();
                    let inst = this._pipeline_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.camera_frame_camera_attitude = msg.matrix4x4();
                    break;
                }
                case 12: {
                    let handle = msg.type();
                    let inst = this._pipeline_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.camera_frame_device_attitude = msg.matrix4x4();
                    break;
                }
                case 19: {
                    let handle = msg.type();
                    let inst = this._image_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.target_loaded_version = msg.int();
                    break;
                }
                case 1: {
                    let handle = msg.type();
                    let inst = this._image_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.anchor_count = msg.int();
                    break;
                }
                case 2: {
                    let handle = msg.type();
                    let inst = this._image_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    let indx = msg.int();
                    inst.anchor_id[indx] = msg.string();
                    break;
                }
                case 3: {
                    let handle = msg.type();
                    let inst = this._image_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    let indx = msg.int();
                    inst.anchor_pose[indx] = msg.matrix4x4();
                    break;
                }
                case 18: {
                    let handle = msg.type();
                    let inst = this._face_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.model_loaded = msg.int();
                    break;
                }
                case 13: {
                    let handle = msg.type();
                    let inst = this._face_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.anchor_count = msg.int();
                    break;
                }
                case 14: {
                    let handle = msg.type();
                    let inst = this._face_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    let indx = msg.int();
                    inst.anchor_id[indx] = msg.string();
                    break;
                }
                case 15: {
                    let handle = msg.type();
                    let inst = this._face_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    let indx = msg.int();
                    inst.anchor_pose[indx] = msg.matrix4x4();
                    break;
                }
                case 16: {
                    let handle = msg.type();
                    let inst = this._face_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    let indx = msg.int();
                    inst.anchor_identity_coefficients[indx] = msg.identityCoefficients();
                    break;
                }
                case 17: {
                    let handle = msg.type();
                    let inst = this._face_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    let indx = msg.int();
                    inst.anchor_expression_coefficients[indx] = msg.expressionCoefficients();
                    break;
                }
                case 8: {
                    let handle = msg.type();
                    let inst = this._barcode_finder_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.number_found = msg.int();
                    break;
                }
                case 9: {
                    let handle = msg.type();
                    let inst = this._barcode_finder_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    let indx = msg.int();
                    inst.found_text[indx] = msg.string();
                    break;
                }
                case 10: {
                    let handle = msg.type();
                    let inst = this._barcode_finder_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    let indx = msg.int();
                    inst.found_format[indx] = msg.barcodeFormat();
                    break;
                }
                case 4: {
                    let handle = msg.type();
                    let inst = this._instant_world_tracker_state_by_instance.get(handle);
                    if (!inst)
                        return;
                    inst.pose = msg.matrix4x4();
                    break;
                }
            }
        });
    }
}
