const fs = require('fs');
const path = require('path');

const projectDirectory = path.resolve(`${__dirname}${path.sep}..${path.sep}..${path.sep}..`);
const testDirectory = path.join(projectDirectory, 'test');
const setupFileName = 'setupAppCenter.js';
const packageJsonFile = path.join(`${projectDirectory}`, 'package.json');

// Update project.json
var packageJsonContent;
try {
    packageJsonContent = fs.readFileSync(packageJsonFile, 'utf8');
} catch (e) {
    console.log("Could not read package.json file");
    return;
}
var projectJson = JSON.parse(packageJsonContent);
if (projectJson.hasOwnProperty('jest')) {
    const setupFileNameValue = `.${path.sep}test${path.sep}${setupFileName}`;
    if (projectJson.jest.setupFiles === undefined) {
        projectJson.jest.setupFiles = [setupFileNameValue];
    } else {
        if (projectJson.jest.setupFiles.indexOf(setupFileNameValue) == -1) {
            projectJson.jest.setupFiles.push(setupFileNameValue);
        }
    }
    fs.writeFileSync(packageJsonFile, JSON.stringify(projectJson));
}

// Create setup mock file for Jest
if(!fs.existsSync(testDirectory)) {
    fs.mkdirSync(testDirectory);
}

fs.writeFileSync(`${testDirectory}/${setupFileName}`, `
jest.mock('NativeModules', () => {
    return {
        AppCenterReactNativeCrashes:{
            generateTestCrash: jest.fn(),
            hasCrashedInLastSession: jest.fn(),
            lastSessionCrashReport: jest.fn(),
            isEnabled: jest.fn(),
            setEnabled: jest.fn(),
            notifyUserConfirmation: jest.fn(),
            setListener: jest.fn()
        },
        AppCenterReactNativePush: {
            setEnabled: jest.fn(),
            isEnabled: jest.fn(),
            setListener: jest.fn()
        }
    };
});`
);
