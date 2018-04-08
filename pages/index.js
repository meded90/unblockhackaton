// @flow
import React from 'react'
import Configurator from "../blocks/Configurator";
import Page from "../components/Page";
import TableCoins from "../blocks/TableCoins";

const elemnent = (props) => {
  return <div>
    <Configurator/>
    <TableCoins/>
  </div>
}

export default Page(elemnent);