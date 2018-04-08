// @flow
import * as React from 'react'
import { Provider } from 'mobx-react'
import enUS from 'antd/lib/locale-provider/en_US';
import { Breadcrumb, Layout, LocaleProvider, Menu } from 'antd';
import Router from 'next/router'
import Head from 'next/head'
import { initStore } from '../../store/store'
import './layout.less';

const { Header, Content, Footer } = Layout;
const { Item } = Menu;

type Props = {
  children?: React.Node,
  title?: string,
  pathname: string
}

export default class Counter extends React.Component<Props, any> {
  static defaultProps = {
    title: 'This is the default title',
    pathname: '/'
  }

  constructor(props) {
    super(props)
  }

  render() {
    this.store = initStore(this.props.isServer);
    this.store.ws.listen();
    const { children, title, pathname } = this.props;
    return (
      <div>

        <Provider { ...this.store }>
          <LocaleProvider locale={ enUS }>

            <Layout className="layout" style={ {
              minHeight: '100vh'
            } }>
              <Head>
                <title>{ title }</title>
                <meta charSet='utf-8'/>
                <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
                <link rel="stylesheet" href="/_next/static/style.css"/>
              </Head>

              <Header>
                <div className="logo"/>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  selectedKeys={ [ pathname ] }
                  defaultSelectedKeys={ [ pathname ] }
                  style={ { lineHeight: '64px' } }
                  onClick={ select => {
                    Router.push(select.key)
                  } }
                >
                  <Item key="/">Platform</Item>
                  <Item key="/start">How start</Item>
                </Menu>
              </Header>

              <Content style={ { padding: '0 50px' } }>

                <Breadcrumb style={ { margin: '16px 0' } }>
                  <Breadcrumb.Item key={ 'home' }>Home</Breadcrumb.Item>
                  {
                    pathname.split('/').map((item) => {

                      return <Breadcrumb.Item key={ item }>{ item }</Breadcrumb.Item>
                    })
                  }
                </Breadcrumb>

                { children }
              </Content>

              <Footer style={ { textAlign: 'center' } }>
                Mommy's Mainers ©2018 Created by LATOKEN Team
              </Footer>
            </Layout>
          </LocaleProvider>
        </Provider>
      </div>
    )
  }
}