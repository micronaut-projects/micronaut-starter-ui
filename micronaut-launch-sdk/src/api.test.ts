import { expect } from 'chai'
import 'mocha'

import MicronautLaunchSDK, { SNAPSHOT_LAUNCH_URL } from '.'
import { ApplicationType } from './TypeDefs'

describe('Test Api', () => {
    const sdk = new MicronautLaunchSDK({ baseUrl: SNAPSHOT_LAUNCH_URL })

    it(`Test Create Zip`, async () => {
        const result = await sdk.create({
            name: 'test',
            package: 'example.com',
            type: ApplicationType.DEFAULT,
        })
        expect(result).not.null
    })

    it(`Test Create Preview`, async () => {
        const result = await sdk.preview({
            name: 'test',
            package: 'example.com',
            type: ApplicationType.DEFAULT,
        })
        expect(result.contents).instanceOf(Object)
    })

    it('Version Should Return Corectly', async () => {
        const result = await sdk.versions()
        expect(result.versions).not.null
        expect(result._links).not.null
    })

    it('Select Options Should Return Corectly', async () => {
        const result = await sdk.selectOptions()
        Object.values(result).forEach((key) => {
            expect(key.options).not.null
            expect(key.defaultOption).not.null
        })
    })

    it('Application Types Return', async () => {
        const result = await sdk.applicationTypes()

        expect(result.types).instanceOf(Array)
        expect(result._links).not.null
        result.types.forEach((type) => {
            expect(type.description).not.null
            expect(type.value).not.null
            expect(type.name).not.null
            expect(type.label).not.null
            expect(type.title).not.null
        })
    })

    Object.values(ApplicationType).forEach(async (type) => {
        it(`Application Types ${type} is Return`, async () => {
            const response = await sdk.applicationTypeInfo({ type })
            expect(response).not.null
            expect(response.description).not.null
            expect(response.value).equal(type)
            expect(response.name).not.null
            expect(response.label).not.null
            expect(response.title).not.null
        })

        it(`Application Types ${type} Features are returned`, async () => {
            const response = await sdk.features({ type })
            expect(response.features.length).greaterThan(0)
            response.features.forEach((feature) => {
                expect(feature.category).not.null
                expect(feature.description).not.null
                expect(feature.name).not.null
                expect(feature.title).not.null
                expect(feature.preview).not.null
            })
        })
    })
})
