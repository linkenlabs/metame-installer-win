"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var child_process = require("child_process");
var fs = require("fs");
var metame_common_1 = require("metame-common");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    //    static executeCommand(command: string): Promise<any> {
    //       return new Promise<any>(function (resolve, reject) {
    //         child_process.exec(command, (error, stdout, stderr) => {
    //         if (error) {
    //             reject(error);
    //             return;
    //         }
    //                 resolve({
    //                     error: error,
    //                     stdout: stdout,
    //                     stderr: stderr
    //                 });
    //             });
    //         });
    //     }
    Utils.deleteFile = function (path) {
        var copyCmd = "del /F \"" + path + "\"";
        child_process.execSync(copyCmd, { stdio: [0, 1, 2] });
    };
    Utils.copyFile = function (source, destination) {
        //check file exists
        if (!fs.existsSync(source)) {
            throw source + " file does not exist";
        }
        if (source == destination) {
            return;
        }
        var copyCmd = "copy \"" + source + "\" \"" + destination + "\"\"";
        child_process.execSync(copyCmd, { stdio: [0, 1, 2] });
    };
    Utils.compile = function (solutionPath) {
        return __awaiter(this, void 0, void 0, function () {
            var msBuildPath, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.getMsBuildPath()];
                    case 1:
                        msBuildPath = _a.sent();
                        cmd = "\"" + msBuildPath + "\" " + solutionPath + " /p:Configuration=Release /t:Clean;Build";
                        return [4 /*yield*/, metame_common_1.executeCommand(cmd)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.getMsBuildPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vsWherePath, cmd, result, lines, relevantEntry, installationPath, msBuildPaths, buildPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vsWherePath = process.env["ProgramFiles(x86)"] + "\\Microsoft Visual Studio\\Installer\\vswhere.exe";
                        if (!fs.existsSync(vsWherePath)) {
                            throw "Cannot find vswhere.exe at location " + vsWherePath;
                        }
                        cmd = "\"" + vsWherePath + "\" -version 15.0";
                        return [4 /*yield*/, metame_common_1.executeCommand(cmd)];
                    case 1:
                        result = _a.sent();
                        lines = result.stdout.split("\r\n");
                        relevantEntry = lines.find(function (line) {
                            return line.startsWith("installationPath:");
                        });
                        installationPath = relevantEntry.split(": ")[1];
                        msBuildPaths = [installationPath + "\\MSBuild\\15.0\\Bin\\MSBuild.exe",
                            installationPath + "\\MSBuild\\Current\\Bin\\MSBuild.exe"];
                        buildPath = msBuildPaths.find(function (path) { return fs.existsSync(path); });
                        if (!buildPath) {
                            throw "Cannot find MSBuild.exe";
                        }
                        return [2 /*return*/, buildPath];
                }
            });
        });
    };
    Utils.getSignToolPath = function () {
        var signTool = process.env["ProgramFiles(x86)"] + "\\Windows Kits\\10\\bin\\10.0.17763.0\\x64\\signtool.exe";
        if (!fs.existsSync(signTool)) {
            throw "Path does not exist: " + signTool;
        }
        return signTool;
    };
    Utils.getInsigniaPath = function () {
        var insignia = process.env["ProgramFiles(x86)"] + "\\WiX Toolset v3.11\\bin\\insignia.exe";
        if (!fs.existsSync(insignia)) {
            throw "Path does not exist: " + insignia;
        }
        return insignia;
    };
    return Utils;
}());
exports.Utils = Utils;
