// StarterForm.js
import Col from 'react-materialize/lib/Col'
import Row from 'react-materialize/lib/Row'

import StarterFormApplicationType from './StarterFormApplicationType'
import StarterFormBuild from './StarterFormBuild'
import StarterFormCloudProvider from './StarterFormCloudProvider'
import StarterFormJavaVersion from './StarterFormJavaVersion'
import StarterFormLang from './StarterFormLang'
import StarterFormMicronautVersion from './StarterFormMicronautVersion'
import StarterFormName from './StarterFormName'
import StarterFormPackage from './StarterFormPackage'
import StarterFormTestFramework from './StarterFormTestFramework'

const StarterForm = ({ onError }) => {
  return (
    <Row className="mn-starter-form-main">
      <Col s={12} m={6} l={4}>
        <StarterFormApplicationType />
      </Col>
      <Col s={8} m={6} l={4}>
          <StarterFormCloudProvider />
      </Col>
      <Col s={4} m={6} l={4}>
        <StarterFormJavaVersion />
      </Col>
      <Col s={12} m={6} l={4}>
        <StarterFormName />
      </Col>
      <Col s={12} m={12} l={8}>
        <StarterFormPackage />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <StarterFormMicronautVersion />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <StarterFormLang />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <StarterFormBuild />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <StarterFormTestFramework />
      </Col>
    </Row>
  )
}

export default StarterForm
