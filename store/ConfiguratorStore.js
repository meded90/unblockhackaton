// @flow

import { computed, extendObservable, observable } from "mobx";
import _ from "lodash";
import "isomorphic-fetch";

export interface ICoinItem {
  id: string,
  name: string,
  waves_address: string,
  hash_algorythm: string,
  mm_address: string,
  block_time: string,
  block_reward: string,
  last_block: string,
  difficulty: string,
  net_hash: number,
  est_rewards: number,
  est_rewards_24h: number,
  exchange_rate: number,

  count_miners?: number,
  userWAVES?: number,
  userUSD?: number,
  profit?: number,
  profitability?: number,
}

export default class ConfigurateStore {
  constructor(isServer, stores) {
    this.isServer = isServer
    this.stores = stores
  }

  defaultCoin = {
    name: '',
    waves_address: '',
    hash_algorythm: '',
    mm_address: '',
    block_time: '',
    block_reward: '',
    last_block: '',
    difficulty: '',
    net_hash: 0,
    est_rewards: 0,
    est_rewards_24h: 0,
    exchange_rate: 0,
    count_miners: null,
    userWAVES: null,
    userUSD: null,
    profit: null,
    profitability: null,
  }
  defaultCoins = [
    {
      id: '1',
      name: 'IBM',
    },
    {
      id: '2',
      name: 'Apple',
    }
  ]
  @observable costElectrics = 0.1;
  @observable hashRate = 5;
  @observable power = 1000;
  @observable other = 1;
  @observable addressWAVS = '';
  @observable selfMining = '';

  @computed
  get costDey() {
    const result = this.power * this.costElectrics * 24 / 1000;
    return this.toFormat(result, 4)
  }

  toFormat(value: number, precision: number = 2) {
    if (_.isNumber(value) && !_.isNaN(value)) {
      return Number(value.toFixed(precision))
    }
    return '–'
  }


  @observable list: ICoinItem = [];
  @observable listStatus: 'init';

  WAVEStoUSD = 3.57;

  getProfitability(id) {
    const { userUSD } = this.getProfit(id);

    const profitability = this.toFormat((userUSD / this.costDey) * 100, 0);
    return profitability;

  }

  getCoinsByID(id) {
    return _.find(this.list, (item: ICoinItem) => item.id === id);
  }

  getProfit(id) {
    const coin =this.getCoinsByID(id)

    const COINtoWAVES = coin.exchange_rate;
    const WAVEStoUSD = this.WAVEStoUSD;
    const hashRateUser = this.hashRate || 0;
    const hashRateNet = coin.net_hash;
    const estRewards24h = coin.est_rewards_24h;


    const pricent = hashRateUser / (hashRateUser + hashRateNet);
    const userRewards = estRewards24h * pricent;

    const userWAVES = this.toFormat(userRewards * COINtoWAVES, 8);
    const userUSD = this.toFormat(userRewards * WAVEStoUSD, 2);
    const profit = this.toFormat(userUSD - this.costDey, 2);
    if (!this.isServer) {
      extendObservable(coin, {
          userWAVES,
          userUSD,
          profit,
        }
      )
    }
    return {
      userWAVES,
      userUSD,
      profit,
    }
  }

  fetch(url) {
    return fetch(url).then(function (response) {
      return response.json();
    })

  }

  fetchCoins(): Promise<void> {
    if (this.listStatus === 'fetching'
    ) {
      return Promise.resolve();
    }
    this.listStatus = "fetching";

    this.fetch('http://82.202.246.102:8220/api/v1.0/orders')
    // return Promise.resolve([
    //   {
    //     id: '1',
    //     waves_address: '',
    //     hash_algorythm: 'sha256',
    //     mm_address: '',
    //     block_time: '2m 30s',
    //     block_reward: '12.50',
    //     last_block: '287,521',
    //     difficulty: '198,972,843.378',
    //     net_hash: 2.65,
    //     est_rewards: 0.0358,
    //     est_rewards_24h: 7.8618,
    //     exchange_rate: 0.5,
    //     count_miners: 2,
    //   }
    // ])
      .then(this.fetchCoinsSuccess)
      .catch(this.fetchCoinsError);
  }

  fetchCoinsSuccess = (data: ICoinItem): Promise<void> => {
    this.listStatus = 'success';

    for (let i = 0; i < data.length; i++) {
      let obj = data[ i ];
      data[ i ] = Object.assign({}, this.defaultCoin, obj);
      const coin = _.find(this.defaultCoins, (item: ICoinItem) => item.id === obj.id);
      obj = data[ i ];
      if (coin) {
        data[ i ] = Object.assign({}, obj, coin)
      }
    }
    this.list = data
  };

  fetchCoinsError = (error: Error): Promise<void> => {
    this.listStatus = 'error';
    console.error(error)
  };
}
