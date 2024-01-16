import { PackageManifest } from 'package-sdk';
import { Provider1, SamplePackage } from './../src/SamplePackage';

const samplePackage = new SamplePackage();

const packageManifest: PackageManifest = require('./manifest.json')

describe("SamplePackage", () => {

    it("Manifest", async () => {
        expect(packageManifest.id).toBe("an.universally.unique.id.to.identify.your.package")
        expect(packageManifest.name).toBe("Sample Package")
        expect(packageManifest.type).toBe("kosmos")
        expect(packageManifest.url).toBeTruthy()
        expect(packageManifest.version).toBeGreaterThan(0)
    })

    it("Providers", async () => {

        const meta = await samplePackage.createProviderMetadata();

        expect(meta).toBeTruthy()
    })

})
