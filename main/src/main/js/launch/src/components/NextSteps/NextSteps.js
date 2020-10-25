import React, {useMemo} from 'react'
import Modal from "react-materialize/lib/Modal";
import {Icon, Row, Col, Button} from "react-materialize";
import CopyToClipboard from '../CopyToClipboard';

const NextSteps = ({name, buildTool, info, theme='light', onClose, onStartOver}) => {
    const { htmlUrl, cloneUrl} = info
    const action = useMemo(()=>{
            if(buildTool === "maven") {
                return `./mvnw mn:run`
            } else if(buildTool === 'gradle') {
                return `./gradlew run`
            }
    }, [buildTool])


    const cmdData = useMemo(()=>{
        switch (info.type) {
            case 'clone':
                return {action: "Clone the repo", cmd: `git clone ${cloneUrl}`}
            case "zip":
                return {action: "unzip the archive", cmd: `unzip ${name}.zip`}
            default:
                return null
        }
    }, [info.type, cloneUrl, name])


    const cdCmd = `cd ${name}`

    return <Modal
        open={info.show}
        options={{onCloseEnd:onClose}}
        className={`modal-lg ${theme} next-steps`}

        actions={[
            <Button waves="light" modal="close" flat>
                Close
            </Button>,
            <Button waves="light" onClick={onStartOver} flat>
                Start Over
            </Button>
        ]}
        >
        <h5 class='title'>Your Micronaut app is ready for takeoff.</h5>

        {htmlUrl &&
            <div className='next-steps-wrapper'>
               <h5 class='heading'>View your new repo on GitHub</h5>
               <Row className="next-steps-row">
                    <Col className='text'>{htmlUrl}</Col>
                    <Col className="icon"><a target='_blank' rel='noopener noreferrer' href={htmlUrl}><Icon>link</Icon></a></Col>
                </Row>
            </div>
        }

        {cmdData &&
            <div className='next-steps-wrapper'>
               <h5 class='heading'>{cmdData.action}</h5>
                <Row className="next-steps-row">
                    <Col className='text'>{cmdData.cmd}</Col>
                    <Col className="icon"><CopyToClipboard value={cmdData.cmd}/></Col>
                </Row>
            </div>
        }

        <div className='next-steps-wrapper'>
           <h5 class='heading'>cd into the project</h5>
            <Row className="next-steps-row">
                <Col className='text'>{cdCmd}</Col>
                <Col className="icon"><CopyToClipboard value={cdCmd}/></Col>
            </Row>
        </div>

        <div className='next-steps-wrapper'>
            <h5 class='heading'>Launch!</h5>
            <Row className="next-steps-row">
                <Col className='text'>{action}</Col>
                <Col className="icon"><CopyToClipboard value={action}/></Col>
            </Row>
        </div>

        <p className='info'>Learn more at <a href='https://micronaut.io/documentation.html'>Mirconaut Guides</a></p>
    </Modal>
}

export default NextSteps