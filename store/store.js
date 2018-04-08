// @flow
import Global from './Global';
import ConfigurateStore from "./ConfiguratorStore";
import WebSocket from "./WebSocket";

let stores = null;

function CreateStore(isServer) {

  return {
    ws: new WebSocket(isServer, stores),
    global: new Global(isServer, stores),
    configurator: new ConfigurateStore(isServer, stores),
  }

}

export function initStore(isServer) {
  console.log('initStore');
  if (stores === null) {
    stores = CreateStore(isServer);
  }
  return stores
}