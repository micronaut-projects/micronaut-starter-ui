// StarterForm.js
import Col from 'react-materialize/lib/Col'
import Row from 'react-materialize/lib/Row'

import StarterFormMicronautVersion from './StarterFormMicronautVersion'
import StarterFormName from './StarterFormName'
import StarterFormPackage from './StarterFormPackage'
import StarterFormTestFramework from './StarterFormTestFramework'
import StarterFormBuild from './StarterFormBuild'
import StarterFormLang from './StarterFormLang'
import StarterFormJavaVersion from './StarterFormJavaVersion'
import StarterFormApplicationType from './StarterFormApplicationType'

const StarterForm = ({ onError }) => {
  return (
    <Row className="mn-starter-form-main">
      <Col s={8} m={6} l={3}>
        <StarterFormApplicationType />
      </Col>
      <Col s={4} m={6} l={3}>
        <StarterFormJavaVersion />
      </Col>
      <Col s={8} m={6} l={3}>
        <StarterFormName />
      </Col>
      <Col s={4} m={6} l={3}>
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
