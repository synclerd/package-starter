# Provider package starter project
A started project to get started on developing a provider package. It includes sample provider, typescript support, npm scripts to build and test (in an android device) packages easily.

### Requirements
- NodeJs
- NPM
- ADB
- Android Device (preferebly emulator) with app installed and `Developer mode` on.

### Documentation

#### Building the package

- `git clone` this (`package-starter`)
- Open terminal
- `cd` to root dir of this project.
- `npm install`
- `npm run test`
- You should see `Ran all test suites`.
- Modify files in `./src` to your needs.
- Build package with `npm run build`


#### Running the package in android app
- Serve package with `npm run serve` (Only need to do once)
- Ensure running `adb devices` returns one device and the android app is installed.
- Run `npm run help` to see command line options and adjust parameters in `scripts` in `package.json`
- Install and run package on an android device with `npm run execute`
- Android app should install the package (uninstalls rest packages to avoid conflict) and launch search screen.

#### Publishing the package
- Upload `manifest.json` and generated package file (`index.js`/`express.json`) in `./dist` directory.
- Reach out to a vendor to include your package manifest url in their manifest (as seen in `/src/manifest.vendor.json`)

#### Publishing vendor manifest
- Only publish a vendor manifest if you are a vendor maintainer. **Do not publish** vendor manifest just for your package. 
- Urge existing vendors to include your package before you deploy your own. Ideally there should be only ONE vendor that has all packages. 
- Multiple vendors will confuse users and make configuration complicated. Avoid this at all cost.
- To publish a vendor manifest, upload `./dist/manifest.vendor.json`.
- Use a url shortener (preferebly `bit.ly`) to shorten the url that can be easily typed in the app.
- Share this shortened url to users.

### Migration guide
- For `Express` packages drop your existing express package in place of `/src/express.json`.
- For `Kosmos` packages import your javascript in `/src`, adapt it until typescript errors are gone.
- Change `/src/manifest.json` as needed. Ensure the `type` (possible values are `express` and `kosmos`) and `url` field (points to the the generated `index.js`/`express.json` after publishing) reflect correct values.
- Build, test and publish your package using documentation above.

See Express package doc [./docs/express.md](./docs/express.md)

