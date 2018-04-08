// @flow

import { action, observable } from "mobx";

export default class Global {
  @observable lastUpdate = 0;
  @observable light = false;

  constructor (isServer, lastUpdate) {
    this.lastUpdate = lastUpdate;
    this.start();
  }

  @action start = () => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.lastUpdate = Date.now();
      this.light = true
    }, 1000)
  }

  stop = () => clearInterval(this.timer)
}
