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
export default class HowStart extends React.Component<IConfiguratorProps> {
  render() {
    let configurator = this.props.configurator;
    return <Card>

      <h1>How Start</h1>
      <h2>1 Step</h2>
      <p>download docker <a href="#0">here</a></p>
      <h2>2 Step</h2>
      <p>generate startup code</p>
      <Form store={ configurator }>
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
          <Col span={6}>
            <Input name="addressWAVS" label="Address WAVES"/>
          </Col>
        </Row>
      </Form>
      <h2>3 Step</h2>
      <p>Run this cat in the folder with the docker file</p>
      <code>
        docker run -it -d --name amrbz/mm /
        -e EQUIP_HASHRATE={configurator.hashRate} /
        -e POWER_COMSUMPTION={configurator.power} /
        -e ELECTRICITY_PRICE={configurator.costElectrics} /
        -e WAVES_WALLET={configurator.addressWAVS} /
        amrbz/mm /opt/src/bitcoind -testnet
      </code>
    </Card>
  }
}