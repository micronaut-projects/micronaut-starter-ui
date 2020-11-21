import { expect } from 'chai'
import 'mocha'

import MicronautLaunchSDK, { LAUNCH_URL, SNAPSHOT_LAUNCH_URL } from '../index'
import { MicronautLaunchError } from '../MicronautLaunchError'
import { ApplicationTypeInfo, Feature, SelectOptions } from '../TypeDefs'
import { ApplicationTypeTestable } from './TestingTypes'

runTests({
    Snapshot: SNAPSHOT_LAUNCH_URL,
    Launch: LAUNCH_URL,
})

async function runTests(tests: Record<string, string>) {
    for (let service in tests) {
        const sdk = new MicronautLaunchSDK({ baseUrl: tests[service] })
        const options = await sdk.selectOptions()
        loadTests(service, sdk, options)
    }
    run() // Calls the mocha run from --delay
}

function loadTests(
    service: string,
    sdk: MicronautLaunchSDK,
    options: SelectOptions
) {
    describe(`Testing Micronaut ${service} SDK`, () => {
        describe(`${service} : Create Actions`, () => {
            it(`Test Create Preview`, async () => {
                const result = await sdk.preview({
                    name: 'test',
                    package: 'example.com',
                    type: ApplicationTypeTestable.DEFAULT,
                })
                expect(result.contents).instanceOf(Object)
            })

            it(`Test Create Invalid Preview`, async () => {
                let error: any
                try {
                    await sdk.preview({
                        name: 'test',
                        package: 'example.com',
                        type: 'FAKE',
                    })
                } catch (mnError) {
                    error = mnError
                }
                expect(error).to.be.an.instanceof(MicronautLaunchError)
                expect(error.message).not.to.be.empty
                expect(error.status).equals(400)
            })

            it(`Test Create Zip`, async () => {
                const result = await sdk.create({
                    name: 'test',
                    package: 'example.com',
                    type: ApplicationTypeTestable.DEFAULT,
                })
                expect(result).is.not.null
            })
        })

        describe(`${service} : Informational Type Info`, () => {
            it('Version Should Return Corectly', async () => {
                const result = await sdk.versions()
                expect(result.versions).not.null
                expect(result._links).not.null
            })

            it(`Select Options Should Return Corectly`, async () => {
                const result = await sdk.selectOptions()
                Object.values(result).forEach((key) => {
                    expect(key.options).not.null
                    expect(key.defaultOption).not.null
                })
            })
        })

        describe(`${service} : Application Type Activities`, () => {
            it('Application Types Return', async () => {
                const result = await sdk.applicationTypes()

                expect(result.types).instanceOf(Array)
                expect(result._links).not.null
                result.types.forEach((type: ApplicationTypeInfo) => {
                    expect(type.description).not.null
                    expect(type.value).not.null
                    expect(type.name).not.null
                    expect(type.label).not.null
                    expect(type.title).not.null
                })
            })
        })

        describe(`${service} : Test Dynamic Select Options`, () => {
            Object.values(options.type.options).forEach(
                async (appType: ApplicationTypeInfo) => {
                    const type = appType.value
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
                        response.features.forEach((feature: Feature) => {
                            expect(feature.category).not.null
                            expect(feature.description).not.null
                            expect(feature.name).not.null
                            expect(feature.title).not.null
                            expect(feature.preview).not.null
                        })
                    })
                }
            )
        })
    })
    run()
}
