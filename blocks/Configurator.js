// @flow

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Col, Row,Button } from "antd";
import Form from "../components/Form";
import { Input } from "../components/fields";
import ConfigurateStore from "../store/ConfiguratorStore";
import Global from "../store/Global";
import WebSocket from "../store/WebSocket";

interface IConfiguratorProps {
  configurator: ConfigurateStore;
  global: Global;
  ws: WebSocket;
}

@inject('configurator','global','ws')
@observer
export default class Configurator extends React.Component<IConfiguratorProps> {
  componentDidMount(){
    this.props.global.start();
  }
  handlerOnClick = ()=>{
    this.props.ws.testGet()

  }
  render() {
    return <Card>
      <Form store={ this.props.configurator }>
        <Row gutter={20}>
          <Col span={6}>
            <Input name="costElectrics" label="Cost electrics" addonAfter="$/kWh"/>
          </Col>
          <Col span={6}>
            <Input name="hashRate" label="Hash rate" addonAfter="Mh/s"/>
          </Col>
          <Col span={6}>
            <Input name="power" label="Power" addonAfter="W"/>
          </Col>
          <Col span={6} style={{marginTop:30}}>
            Daily cost: <strong>${this.props.configurator.costDey}</strong>
          </Col>
        </Row>
      </Form>
    </Card>
  }
}