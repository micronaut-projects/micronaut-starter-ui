// ShareModal.js
import React, { forwardRef, useMemo } from 'react'

import { Button } from 'react-materialize'
import Col from 'react-materialize/lib/Col'
import Modal from 'react-materialize/lib/Modal'
import Row from 'react-materialize/lib/Row'
import messages from '../../constants/messages.json'
import { fullyQualifySharableLink } from '../../helpers/Routing'
import CopyToClipboard from '../CopyToClipboard'

const ShareModal = ({ sharable, theme, trigger, onClose }, ref) => {
  const actions = useMemo(() => {
    return [
      {
        title: messages.share.config,
        link: fullyQualifySharableLink(sharable),
      },
      {
        title: messages.share.preview,
        link: fullyQualifySharableLink(sharable, { action: 'preview' }),
      },
      {
        title: messages.share.diff,
        link: fullyQualifySharableLink(sharable, { action: 'diff' }),
        exclude: !`${sharable}`.includes('features'),
      },
      {
        title: messages.share.zip,
        link: fullyQualifySharableLink(sharable, { action: 'create' }),
      },
    ].filter((i) => !i.exclude)
  }, [sharable])

  return (
    <Modal
      header={messages.share.header}
      className={'share ' + theme}
      fixedFooter
      options={{
        onCloseStart: onClose,
        startingTop: '5%',
        endingTop: '5%',
      }}
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
            <Row className="next-steps-row">
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

export default forwardRef(ShareModal)
