// ShareModal.js
import React, { forwardRef, useMemo } from 'react'

import { Button } from 'react-materialize'
import Col from 'react-materialize/lib/Col'
import Modal from 'react-materialize/lib/Modal'
import Row from 'react-materialize/lib/Row'
import messages from '../../constants/messages.json'
import {
  fullyQualifySharableLink,
  ACTIVITY_KEY,
  FEATURES_KEY,
  PREVIEW_ACTIVITY,
  DIFF_ACTIVITY,
  CREATE_ACTIVITY,
} from '../../helpers/Routing'
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
        link: fullyQualifySharableLink(sharable, {
          [ACTIVITY_KEY]: PREVIEW_ACTIVITY,
        }),
      },
      {
        title: messages.share.diff,
        link: fullyQualifySharableLink(sharable, {
          [ACTIVITY_KEY]: DIFF_ACTIVITY,
        }),
        exclude: !`${sharable}`.includes(FEATURES_KEY),
      },
      {
        title: messages.share.zip,
        link: fullyQualifySharableLink(sharable, {
          [ACTIVITY_KEY]: CREATE_ACTIVITY,
        }),
      },
    ].filter((i) => !i.exclude)
  }, [sharable])

  return (
    <Modal
      header={messages.share.header}
      className={`modal-lg ${theme} next-steps share`}
      fixedFooter
      options={{
        onCloseStart: onClose,
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
      <p className="info">
        Once you’ve gotten your new project started, you can continue your
        journey by reviewing our{' '}
        <a href="https://micronaut.io/documentation.html">documentation</a> and{' '}
        <a href="https://micronaut.io/learn.html">learning resources</a>
      </p>
    </Modal>
  )
}

export default forwardRef(ShareModal)
