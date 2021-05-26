// Footer.js
import React, { useMemo } from 'react'
import { Button } from 'react-materialize'
import Modal from 'react-materialize/lib/Modal'
import Row from 'react-materialize/lib/Row'
import Col from 'react-materialize/lib/Col'
import CopyToClipboard from '../CopyToClipboard'
import { useCreateCommand } from '../../state/store'

export default function OtherCommands({ theme, trigger }) {
  const createCommand = useCreateCommand()
  const actions = useMemo(() => {
    if (!createCommand) return []
    return [
      { link: createCommand.toCli(), title: 'Using the Micronaut CLI' },
      { link: createCommand.toCurl(), title: 'Using cURL' },
    ]
  }, [createCommand])

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
