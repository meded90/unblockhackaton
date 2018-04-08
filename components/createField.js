import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { checkIsRequired } from './helpers';
import _ from 'lodash';

interface IfieldParams {
  component: any;
  wrapper: any;
  componentParams?: any;
  wrapperParams?: any;
}

interface IMobxFormItemProps {
  name: string;
  fieldParams: IfieldParams;
  label?: string;
  required?: any;
  rules?: ReadonlyArray<object>;
  [propName: string]: any;
}

@observer
class MobxFormItem extends React.Component<IMobxFormItemProps> {
  static contextTypes = {
    form: PropTypes.object, // the form object
    defaultItemProps: PropTypes.object, // global default FormItem props
    displayDefaultLabel: PropTypes.bool, // display the default label if not set
  };

  rules: any;
  isRequired: boolean;

  constructor(props: IMobxFormItemProps) {
    super(props);

    this.rules = props.rules || _.get(props, 'fieldParams.componentParams.rules') || [];

    const hasRequiredRule = checkIsRequired(this.rules);

    if (props.required && !hasRequiredRule) {
      // add required rule
      this.rules = this.rules.concat({ required: true, message: 'Please fill in this field!' });
    }

    this.isRequired = hasRequiredRule || props.required;
  }

  componentWillUnmount() {
    const { removeFieldOption } = this.context.form;

    removeFieldOption.call(this.context.form, this.props.name);
  }

  render() {
    const { getFieldProps } = this.context.form;
    const {
      onChange,
      label,
      labelCol,
      wrapperCol,
      wrapperClassName,
      name,
      fieldParams,
      rules,
      normalize,
      ...otherProps
    } = this.props;

    const {
      component: Component,
      wrapper: Wrapper,
      wrapperParams = {},
      componentParams = {},
    } = fieldParams;

    // generate component props
    const componentProps = getFieldProps(name, {
      ...componentParams,
      rules: this.rules,
      otherProps,
      onChange,
    });

    // generate wrapper props
    const wrapperProps = {
      ...this.props,
      ...wrapperParams,
      label,
      labelCol,
      wrapperCol,
      className: wrapperClassName,
      required: this.isRequired,
    };

    const err = this.context.form.getFieldError(name);

    if (err) {
      const hasError = Boolean(err.length);

      wrapperProps.validateStatus = hasError ? 'error' : 'success';
      wrapperProps.help = hasError && err.map(({ message }) => message).join(' ');
    }

    let onValueChange = componentProps.onChange;

    if (typeof normalize === 'function') {
      onValueChange = value => {
        const normalizeValue = normalize(value);

        if (normalizeValue !== false) {
          componentProps.onChange(normalizeValue);
        }
      };
    }

    return (
      <Wrapper {...wrapperProps} {...this.context.defaultItemProps}>
        <Component {...componentProps} onChange={onValueChange} />
      </Wrapper>
    );
  }
}

export default (fieldParams: IfieldParams): any => props => (
  <MobxFormItem {...props} fieldParams={fieldParams} />
);
