// Footer.js
import React, { useMemo } from 'react'
import { Button } from 'react-materialize'
import Modal from 'react-materialize/lib/Modal'
import Icon from 'react-materialize/lib/Icon'
import { MicronautStarterSDK } from '../../micronaut'
import Row from 'react-materialize/lib/Row'
import Col from 'react-materialize/lib/Col'
import CopyToClipboard from '../CopyToClipboard'

export default function OtherCommands({
  className = '',
  theme,
  style,
  baseUrl,
  createPayload,
  trigger,
}) {
  const actions = useMemo(() => {
    if (!baseUrl) return []
    const createCommand = MicronautStarterSDK.createCommand(
      createPayload,
      baseUrl
    )
    return [
      { link: createCommand.toCli(), title: 'Using the Micronaut CLI' },
      { link: createCommand.toCurl(), title: 'Using cURL' },
    ]
  }, [createPayload, baseUrl])

  return (
    <Modal
      header="Other ways to build this configuration."
      className={`modal-lg ${theme} next-steps other-configuration`}
      fixedFooter
      actions={
        <Button waves="light" modal="close" flat>
          Close
        </Button>
      }
      trigger={trigger}
    >
      {actions.map((action) => {
        return (
          <div key={action.link} className="next-steps-wrapper">
            <h6 className="heading">{action.title}</h6>
            <Row className="next-steps-row multi-line">
              <Col className="text">{action.link}</Col>
              <Col className="icon">
                <CopyToClipboard value={action.link} />
              </Col>
            </Row>
          </div>
        )
      })}
    </Modal>
  )
}
