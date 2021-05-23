// Link.react.test.js
import React from 'react'
import { create, act } from 'react-test-renderer'

import { useApplicationForm } from '../useApplicationForm'

const TestView = ({ initialData }) => {
  const { form } = useApplicationForm(initialData)

  return (
    <>
      <div className="type">{`${form.type}`}</div>
      <div className="test">{`${form.test}`}</div>
      <div className="build">{`${form.build}`}</div>
      <div className="lang">{`${form.lang}`}</div>
      <div className="javaVersion">{`${form.javaVersion}`}</div>
      <div className="name">{`${form.name}`}</div>
      <div className="package">{`${form.package}`}</div>
    </>
  )
}

const TEST_DATA = [
  { initialData: {}, hasError: false },
  { initialData: { javaVersion: 'JDK_12' }, hasError: false },
  { initialData: { test: 'JUNIT' }, hasError: false },
  { initialData: { lang: 'Java' }, hasError: false },
  { initialData: { test: 'KOTEST' }, hasError: false },
  { initialData: { package: 'com.pretend' }, hasError: false },
  { initialData: { name: 'pretendo' }, hasError: false },
]

TEST_DATA.forEach(({ initialData, hasError }) => {
  it(`Initial Form Data with "${Object.keys(initialData).join(',')}"`, () => {
    let testRenderer
    act(() => {
      testRenderer = create(<TestView initialData={initialData} />)
    })

    const testInstance = testRenderer.root
    expect(testRenderer.toJSON()).toMatchSnapshot()

    expect(testInstance.findByProps({ className: 'test' }).children).toEqual([
      `${initialData.test || null}`,
    ])

    expect(testInstance.findByProps({ className: 'build' }).children).toEqual([
      `${initialData.build || null}`,
    ])

    expect(testInstance.findByProps({ className: 'lang' }).children).toEqual([
      `${initialData.lang || null}`,
    ])

    expect(
      testInstance.findByProps({ className: 'javaVersion' }).children
    ).toEqual([`${initialData.javaVersion || ''}`])

    expect(testInstance.findByProps({ className: 'name' }).children).toEqual([
      `${initialData.name || 'demo'}`,
    ])

    expect(testInstance.findByProps({ className: 'package' }).children).toEqual(
      [`${initialData.package || 'com.example'}`]
    )
  })
})
