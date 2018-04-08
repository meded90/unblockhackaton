import React, { ReactNode } from 'react';
import createForm from './createForm';
import createField from './createField';
import cn from 'classnames';

const defaultClassName = 'ant-form';

export interface FormProps {
  renderElement?: string;
  className?: string;
  onSubmit?: Function;
  children?: ReactNode;
  layout?: 'horizontal' | 'vertical' | 'inline';
}

class FormBasic extends React.PureComponent<FormProps, any> {
  render() {
    const { renderElement, className, onSubmit, layout = 'vertical', children } = this.props;
    const renderTagName = renderElement || 'form';

    const formProps = {
      className: cn(defaultClassName, className, 'ant-form-' + layout),
      onSubmit: renderTagName === 'form' ? onSubmit : null,
    };

    return React.createElement(renderTagName, formProps, children);
  }
}

export default createForm()(FormBasic);

export { createForm, createField };
