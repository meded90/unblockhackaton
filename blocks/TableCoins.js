// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import ConfiguratorStore, { ICoinItem } from "../store/ConfiguratorStore";
import { Button, Table } from "antd";
import { ColumnProps } from "antd/lib/table/interface";
import { toJS } from "mobx";

interface ITableCoinsProps {
  configurator: ConfiguratorStore
}

interface IProfitProps {
  coin: ICoinItem,
  configurator: ConfiguratorStore

}


@inject('configurator')
@observer
class Profit extends React.Component<IProfitProps> {
  render() {
    let { configurator, coin } = this.props;

    const {
      userWAVES,
      userUSD,
      profit
    } = configurator.getProfit(coin.id);

    return <div>
      WAVES { userWAVES } <br/>
      ${ userUSD } <br/>
      <strong> ${ profit }</strong>
    </div>
  }
}

@inject('configurator')
@observer
class Profitability extends React.Component<IProfitProps> {
  render() {
    let { configurator, coin } = this.props;

    const profitability = configurator.getProfitability(coin.id);

    return <div>
      <strong> %{ profitability }</strong>
    </div>
  }
}

@inject('configurator')
@observer
class Difficulty extends React.Component<IProfitProps> {
  render() {
    let { configurator, coin } = this.props;

    const dataSource = configurator.getCoinsByID(coin.id);

    return <div>
      { dataSource.difficulty || '–' } <br/>
      { dataSource.net_hash || '–' } Mh/s <br/>
      Miners: { dataSource.count_miners || '–' }
    </div>
  }
}


@inject('configurator')
@observer
class Action extends React.Component<IProfitProps> {
  render() {
    let { configurator, coin } = this.props;

    return <div>
      <Button onClick={configurator.start()} type={'danger'}>Stop</Button>
      <Button>Start</Button>
    </div>
  }
}


@inject('configurator')
@observer
export default class TableCoins extends React.Component<ITableCoinsProps> {

  componentDidMount() {
    this.props.configurator.fetchCoins()
  }

  handlerRowKey = (dataSource: ICurrencyExtend, index) => String(dataSource.id);


  columns: Array<ColumnProps<ICoinItem>> = [
    {
      title: '#',
      key: 'id',
      render: (text, dataSource) => dataSource.id
    },
    {
      title: 'Name',
      key: 'name',
      render: (text, dataSource) => {
        return <div>
          { dataSource.name } <br/>
          ({ dataSource.hash_algorythm })
        </div>
      },
    },
    {
      title: <div>
        Block Time
        <br/>
        Block Reward
        <br/>
        Last Block
      </div>,
      key: 'blocks',
      render: (text, dataSource) => {
        return <div>
          BT: { dataSource.block_time } <br/>
          BR: { dataSource.block_reward } <br/>
          LB: { dataSource.last_block }
        </div>
      },
    },
    {
      title: <div>
        Difficulty <br/>
        NetHash <br/>
        Count miners
      </div>,
      key: 'difficulty',
      render: (text, dataSource) => <Difficulty coin={ dataSource }/>,
    },
    {
      title: <div>
        Est. Rewards <br/>
        Est. Rewards 24h
      </div>,
      key: 'est',
      render: (text, dataSource) => {
        return <div>
          { dataSource.est_rewards } <br/>
          { dataSource.est_rewards_24h }
        </div>
      },
    },
    {
      title: 'Exchange Rate',
      key: 'ExchangeRate',
      render: (text, dataSource) => dataSource.exchange_rate,
    },
    {
      title: <div>
        Rev. WAVES <br/>
        Rev. $ <br/>
        Profit $/day <br/>
      </div>,
      key: 'profit',
      render: (text, dataSource: ICoinItem) => (<Profit coin={ dataSource }/>)
    },
    {
      title: <div>Profitability
      </div>,
      key: 'Profitability',
      render: (text, dataSource: ICoinItem) => (<Profitability coin={ dataSource }/>)
    },
    {
      title: <div>Action</div>,
      key: 'action',
      render: (text, dataSource: ICoinItem) => (<Action coin={ dataSource }/>)
    }
  ]

  render() {
    let list = [];
    for (var i = 0; i < this.props.configurator.list.length; i++) {
      var obj = this.props.configurator.list[ i ];
      list.push(toJS(obj))
    }

    return <div>
      <Table
        bordered
        loading={ this.props.configurator.listStatus !== 'success' && this.props.configurator.listStatus !== 'init' }
        scroll={ { x: 100 } }
        columns={ this.columns }
        dataSource={ list }
        size="middle"
        rowKey={ this.handlerRowKey }
        pagination={ false }
      />
    </div>
  }

}

