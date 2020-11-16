import { Version } from '../VersionSupports'

it('Test Version Compare', () => {
  expect(new Version('1.1').gte('1')).toEqual(true)
  expect(new Version('1.1').gte('1.1.0')).toEqual(true)
  expect(new Version('1').gte('1.0.0')).toEqual(true)
  expect(new Version('1').gte(new Version('1.0.0'))).toEqual(true)

  expect(new Version('1.1.1').gte('1.1')).toEqual(true)
  expect(new Version('1.1.2').gte('1')).toEqual(true)
  expect(new Version('1.1.2').gte('1.1.1')).toEqual(true)
  expect(new Version('1.2.2').gte('1.1.2')).toEqual(true)
  expect(new Version('1.2.2').gte('1.1.2')).toEqual(true)

  expect(new Version('1.2.2').gte('1.2.3')).toEqual(false)
  expect(new Version('1.2.2').gte('1.2.3-SNAPSHOT')).toEqual(false)
  expect(new Version('1.2.2-SNAPSHOT').gte('1.2.3')).toEqual(false)
  expect(new Version('1.2-SNAPSHOT2').gte('1.2.1')).toEqual(false)
})

it('Version Based', () => {
  expect(new Version('SNAPSHOT-1').basedVersion()).toEqual('0.0.0')
  expect(new Version('1.0-RC1').basedVersion()).toEqual('1.0.0')
  expect(new Version('1.1-RC1').basedVersion()).toEqual('1.1.0')
  expect(new Version('1').basedVersion()).toEqual('1.0.0')
  expect(new Version('1.1').basedVersion()).toEqual('1.1.0')
  expect(new Version('1-SNAPSHOT').basedVersion()).toEqual('1.0.0')
})
