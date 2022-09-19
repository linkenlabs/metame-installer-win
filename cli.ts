#! /usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import * as common from "metame-common";

async function main() {
  if (process.argv.length != 4) {
    throw `Incorrect number of parameters. Expected 4, actual ${process.argv.length}. Arguments: ${process.argv}`;
  }

  var electronSetupFile = path.resolve(process.argv[2]);
  console.log("electronSetupFile: " + electronSetupFile);

  var outputPath = process.argv[3];
  console.log("outputPath: " + outputPath);

  if (!fs.existsSync(electronSetupFile)) {
    throw `Input setup file does not exist: ${electronSetupFile}`;
  }

  if (fs.existsSync(outputPath)) {
    throw `Output path already exists: ${outputPath}`;
  }

  var installerProjectDir = path.resolve(`${__dirname}\\..\\MetaMe.Installer`);
  var projectDir = `${installerProjectDir}\\`;
  var projectSetupFile = `${projectDir}electron-builder-setup.exe`;

  console.log("Cleanup....");
  common.deleteFile(projectSetupFile);

  console.log("Copying file...");
  common.copyFile(electronSetupFile, projectSetupFile);

  try {
    let solutionPath: string = path.resolve(
      `${__dirname}\\..\\MetaMe.Installer.sln`
    );
    console.log("Building release version...");
    await common.compile(solutionPath);
    var outDir = `bin\\Release\\`;
    var targetFile = `${projectDir}${outDir}MetaMe-Installer.exe`;

    // http://wixtoolset.org/documentation/manual/v3/overview/insignia.html
    console.log("Detaching burn engine from installer...");
    var insigniaExe = common.getInsigniaPath();
    var burnEnginePath = `${projectDir}${outDir}engine.exe`;

    var insigniaDetachCmd = `"${insigniaExe}" -ib "${targetFile}" -o "${burnEnginePath}"`;
    await common.executeCommand(insigniaDetachCmd);

    //sign the engine
    console.log("Sign the engine...");
    var signToolExe = common.getSignToolPath();
    var signEngineCmd = `"${signToolExe}" sign /tr http://timestamp.comodoca.com /td sha256 /fd sha256 /a /v "${burnEnginePath}"`;
    await common.executeCommand(signEngineCmd);

    console.log("Reattaching burn engine...");
    var reattachCmd = `"${insigniaExe}" -ab "${burnEnginePath}" "${targetFile}" -o "${targetFile}"`;
    await common.executeCommand(reattachCmd);

    console.log("Sign the bundle...");
    var signBundleCmd = `"${signToolExe}" sign /tr http://timestamp.comodoca.com /td sha256 /fd sha256 /a /v "${targetFile}"`;
    await common.executeCommand(signBundleCmd);

    console.log("Copying to destination...");
    common.copyFile(targetFile, outputPath);

  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();
