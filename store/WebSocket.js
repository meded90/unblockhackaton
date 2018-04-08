import io from 'socket.io-client';
import { observable } from "mobx/lib/mobx";

export default class WebSocket {
  @observable isConnect = false

  constructor(stores) {
    this.stores = stores;
    this.socket = null;
  }

  listen() {
    if (!this.isConnect && !this.socket) {
      this.socket = io('80.93.177.136:80'
        // , {
        // transports: ['websocket'],
        // }
      );

      this.socket.on('connect', function () {
        console.log('connect');
        this.isConnect = true;
      });

      this.socket.on('event', function (data) {
        console.log('event', data);
      });
      this.socket.on('disconnect', function () {
        console.log('disconnect');
        this.isConnect = false;
      });
      this.socket.on('message', function () {
        console.log('message');
        console.log('event', data);
      });
    }

    return Promise.resolve();
  }

  testGet() {
    this.listen()
    this.socket.send('hi world');
    this.socket.emit('message', 'world');
    // fetch('http://80.93.177.136/api/v1.0/blockchains').then((data)=>{
    //   console.log(data);
    // })
  }

  subscribe(evtName, handler) {
    this.socket.on(evtName, handler);
  }

  unsubscribe(evtName) {
    this.socket.off(evtName);
  }
}
