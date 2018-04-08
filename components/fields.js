import React from 'react';
import { Form, Input as AntInput, } from 'antd';
import { createField } from './Form';
import { formItemLayout } from './layouts';

const defaultWrapper = Form.Item;

const defaultFieldParams = {
  wrapper: defaultWrapper,
  wrapperParams: { ...formItemLayout, hasFeedback: true },
  component: AntInput,
};

export const Input = createField({
  ...defaultFieldParams,
  component: (props) => {
    return <AntInput { ...props } onChange={ (val) => {
      props.onChange(val.target.value)
    } }/>
  }
});
