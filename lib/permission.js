var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UAParser } from "ua-parser-js";
let parser = new UAParser();
let _permissionGrantedCamera = false;
let _permissionGrantedMotion = true;
let _permissionDeniedCamera = false;
let _permissionDeniedMotion = false;
if (!window.DeviceOrientationEvent || !window.DeviceOrientationEvent.requestPermission) {
    _permissionGrantedMotion = true;
}
function checkForCameraPermission() {
    return __awaiter(this, void 0, void 0, function* () {
        if (navigator.permissions && navigator.permissions.query) {
            try {
                let res = yield navigator.mediaDevices.getUserMedia({
                    video: true
                });
                let tracks = res.getTracks();
                tracks.forEach(t => t.stop());
                _permissionGrantedCamera = true;
                _permissionDeniedCamera = false;
                // alert('kamera: tak');
            }
            catch (err) {
                _permissionGrantedCamera = false;
                _permissionDeniedCamera = true;
                // alert('kamera: nie');
            }
            // try {
            //     let res = yield navigator.permissions.query({ name: "camera" });
            //     _permissionDeniedCamera = res.state === 'denied';
            //     _permissionGrantedCamera = res.state === 'granted';
            //     alert('Kamera: ' + (_permissionGrantedCamera ? 'tak' : 'nie'));
            // }
            // catch (ex) { }
        }
    });
}
checkForCameraPermission();

export function permissionGrantedCamera() { return _permissionGrantedCamera; }
export function permissionGrantedMotion() { return _permissionGrantedMotion; }
export function permissionDeniedCamera() { return _permissionDeniedCamera; }
export function permissionDeniedMotion() { return _permissionDeniedMotion; }
export function permissionDeniedAny() { return _permissionDeniedCamera || _permissionDeniedMotion; }
export function permissionGrantedAll() { return _permissionGrantedCamera && _permissionGrantedMotion; }
export function permissionRequestAll() {
    return __awaiter(this, void 0, void 0, function* () {
        yield permissionRequestMotion();
        yield permissionRequestCamera();
    });
}
export function permissionRequestCamera() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let res = yield navigator.mediaDevices.getUserMedia({
                video: true
            });
            let tracks = res.getTracks();
            tracks.forEach(t => t.stop());
            _permissionGrantedCamera = true;
            _permissionDeniedCamera = false;
        }
        catch (err) {
            _permissionGrantedCamera = false;
            _permissionDeniedCamera = true;
        }
    });
}
export function permissionRequestMotion() {
    return __awaiter(this, void 0, void 0, function* () {
        if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
            let permissionResult = yield window.DeviceOrientationEvent.requestPermission();
            if (permissionResult !== 'granted') {
                _permissionGrantedMotion = false;
                _permissionDeniedMotion = true;
                return false;
            }
        }
        // No motion permissions or granted
        _permissionGrantedMotion = true;
        _permissionDeniedMotion = false;
    });
}
export function permissionRequestUI() {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkForCameraPermission();
        if (permissionGrantedAll()) {
            return true;
        }
        let div = document.createElement("div");
        div.classList.add("zappar-permission-request");
        div.innerHTML = `
    <style>
        .zappar-permission-request {
            /*visibility: hidden;*/
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            z-index: 1000;
            background-color: rgba(0, 0, 0, 0.9);
            font-family: sans-serif;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .zappar-inner {
            max-width: 400px;
            text-align: center;
        }
        .zappar-title {
            font-size: 20px;
        }
        .zappar-text {
            font-size: 14px;
            padding: 15px;
        }
        .zappar-inner > button {
            background: none;
            outline: none;
            border: 2px solid white;
            border-radius: 10px;
            color: white;
            padding: 10px 40px;
            text-transform: uppercase;
        }
    </style>
    <div class="zappar-inner">
<!--        <div class="zappar-title">??adowanie...</div>-->
        <div class="zappar-title">Ju?? prawie gotowe...</div>
        <div class="zappar-text">Aby zapewni?? rozszerzon?? rzeczywisto????, potrzebujemy dost??pu do kamery Twojego urz??dzenia i czujnik??w ruchu.</div>
        <button id="zappar-permission-request-button">Kontynuuj</button>
    </div>
`;
        document.body.append(div);
        let button = div.querySelector("#zappar-permission-request-button");


        setTimeout(async () => {
            button.click();
        }, 100);


        return yield new Promise(resolve => {
            button === null || button === void 0 ? void 0 : button.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                yield permissionRequestAll();
                div.remove();
                while (true) {
                    yield nextFrame();
                    if (permissionDeniedAny()) {
                        resolve(false);
                        return;
                    }
                    if (permissionGrantedAll()) {
                        resolve(true);
                        return;
                    }
                }
            }));
        });
    });
}
function nextFrame() {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
}
export function permissionDeniedUI() {
    switch (parser.getBrowser().name) {
        case "Chrome":
            permissionDeniedUIChrome();
            break;
        default:
            permissionDeniedUIIOS();
            break;
    }
}
function permissionDeniedUIIOS() {
    let div = document.createElement("div");
    div.classList.add("zappar-permission-request");
    div.innerHTML = `
    <style>
        .zappar-permission-request {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            z-index: 1000;
            background-color: rgba(0, 0, 0, 0.9);
            font-family: sans-serif;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .zappar-inner {
            max-width: 400px;
            text-align: center;
        }
        .zappar-title {
            font-size: 20px;
        }
        .zappar-text {
            font-size: 14px;
            padding: 15px;
        }
        .zappar-inner > button {
            background: none;
            outline: none;
            border: 2px solid white;
            border-radius: 10px;
            color: white;
            padding: 10px 40px;
            text-transform: uppercase;
        }
    </style>
    <div class="zappar-inner">
        <div class="zappar-title">Permission is Needed</div>
        <div class="zappar-text">Permission to access your device's camera and motion sensors is necessary for this experience. Please reload the page to try again.</div>
        <button id="zappar-permission-reload-button">Reload</button>
    </div>
`;
    document.body.append(div);
    let button = div.querySelector("#zappar-permission-reload-button");
    button === null || button === void 0 ? void 0 : button.addEventListener("click", () => window.location.reload());
}
function permissionDeniedUIChrome() {
    let div = document.createElement("div");
    div.classList.add("zappar-permission-request");
    div.innerHTML = `
    <style>
        .zappar-permission-request {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            z-index: 1000;
            background-color: rgba(0, 0, 0, 0.9);
            font-family: sans-serif;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .zappar-inner {
            width: 400px;
            text-align: center;
        }
        .zappar-title {
            font-size: 20px;
        }
        .zappar-text {
            font-size: 14px;
            padding: 15px;
        }
        .zappar-inner > button {
            background: none;
            outline: none;
            border: 2px solid white;
            border-radius: 10px;
            color: white;
            padding: 10px 40px;
            text-transform: uppercase;
        }
    </style>
    <div class="zappar-inner">
        <div class="zappar-title">Permission is Needed</div>
        <div class="zappar-text">Permission to access your device's camera and motion sensors is necessary for this experience.<br/><br/>To grant access, please tap the ! button in the address bar of your browser, then "Site settings", and finally "Clear and reset". You can then reload the page to try again.</div>
        <button id="zappar-permission-reload-button">Reload</button>
    </div>
`;
    document.body.append(div);
    let button = div.querySelector("#zappar-permission-reload-button");
    button === null || button === void 0 ? void 0 : button.addEventListener("click", () => window.location.reload());
}
