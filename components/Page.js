import React from 'react'
import { initStore } from "../store/store";
import Layout from "./layout/index";
import _ from "lodash";

export default ComposedComponent => class extends React.Component {
  static getInitialProps({ req }) {
    const isServer = !!req;
    return { isServer }
  }

  render() {
    return <Layout isServer={ this.props.isServer } pathname={ _.get(this.props, 'url.pathname', '/') }>
      <ComposedComponent/>
    </Layout>
  }
}