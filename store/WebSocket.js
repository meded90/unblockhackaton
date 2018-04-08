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
      this.socket = io('80.93.177.136:80');


      this.subscribe('message', (data) => {
        console.log('!!!! data \n', data, '\n !!!!');
      })

      this.socket.on('event', (data) => {
        console.log('event', data);
      });

      this.socket.on('connect', () => {
        console.log('connect');
        this.isConnect = true;
        this.startManing('1')
        setTimeout(() => {
          this.stopManing('1')
        }, 1000)
      });


      this.socket.on('disconnect', () => {
        console.log('disconnect');
        this.isConnect = false;
      });

      this.socket.on('message', () => {
        console.log('message');
        console.log('event', data);
      });
    }

    return Promise.resolve();
  }

  testGet() {
    this.listen();
    this.socket.emit('start', '1');
    // fetch('http://80.93.177.136/api/v1.0/blockchains').then((data)=>{
    //   console.log(data);
    // })
  }

  startManing(id,cb) {
    this.socket.emit('start', id, function (data) {
      console.log('!!!! data \n', data, '\n !!!!');
      cb && cb()
    });
  }

  stopManing(id,cb) {
    this.socket.emit('stop', id, function (data) {
      console.log('!!!! data \n', data, '\n !!!!');
      cb && cb()
    });
  }

  subscribe(evtName, handler) {
    this.socket.on(evtName, handler);
  }

  unsubscribe(evtName) {
    this.socket.off(evtName);
  }
}
