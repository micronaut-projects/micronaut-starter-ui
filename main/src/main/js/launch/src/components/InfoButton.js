// Footer.js
import React, { useCallback, useMemo, useState } from 'react'
import { Button } from 'react-materialize'
import Icon from 'react-materialize/lib/Icon'
import Modal from 'react-materialize/lib/Modal'
import { HELP_SHORTCUT, SHORTCUT_REGISTRY } from '../constants/shortcuts'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'

const InfoButton = ({ className = '', theme, style }) => {
  const [open, setOpen] = useState(false)

  const onShow = useCallback(() => {
    setOpen(true)
  }, [])

  const options = useMemo(() => {
    return {
      onCloseStart: () => setOpen(false),
    }
  }, [setOpen])

  useKeyboardShortcuts(HELP_SHORTCUT.keys, onShow)

  return (
    <>
      <Button
        style={style}
        onClick={onShow}
        floating
        className={`${theme} ${className}`}
      >
        <Icon>info</Icon>
      </Button>
      <Modal
        header="What's this?"
        className={`${theme} modal modal-fixed-footer modal-lg info-modal`}
        actions={
          <Button waves="light" modal="close" flat>
            Close
          </Button>
        }
        open={open}
        options={options}
      >
        <div className="info-contents">
          <p>
            Micronaut Launch is a web application that allows you to create
            Micronaut projects through an interface instead of using the console
            CLI. You can set the application type, the project name, the
            language (Java, Kotlin, Groovy), the build tool (Maven, Gradle), the
            Java version and the features you need to develop your software.
          </p>
          <div className="shortcut-legend">
            <label>
              <b>Keyboard Shortcuts</b>
            </label>
            <ul style={{ marginTop: 0 }}>
              {SHORTCUT_REGISTRY.map((sc) => (
                <li key={sc.textValue}>
                  <span className={`${theme} pill`}>{sc.textValue}</span>{' '}
                  {sc.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default InfoButton
