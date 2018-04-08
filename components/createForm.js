import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getValueFromEvent } from './helpers';
import { toJS, extendObservable, action, observable, ObservableMap } from 'mobx';
import AsyncValidator from 'async-validator';
import set from 'lodash/set';
import get from 'lodash/get';

const DEFAULT_VALIDATE_TRIGGER = 'onChange';
const DEFAULT_TRIGGER = DEFAULT_VALIDATE_TRIGGER;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field].length);
}

function createForm(options = {}) {
  const {
    store: gStore,
    prefix = '', // support lodash.get
    defaultItemProps = {},
    displayDefaultLabel = true,
  } = options;

  function decorate(WrappedComponent) {
    class WrapForm extends Component {
      static childContextTypes = {
        form: PropTypes.object,
        defaultItemProps: PropTypes.object,
        displayDefaultLabel: PropTypes.bool,
      };

      static defaultProps = {
        editable: true,
      };

      errors = observable.map();
      fieldOptions = {};
      store = {};

      validateFields = callback => {
        const needValidateName = [];
        const rules = Object.keys(this.fieldOptions).reduce((o, name) => {
          const fieldRules = this.fieldOptions[name].rules;

          if (fieldRules) {
            needValidateName.push(name);
            o[name] = fieldRules;
          }

          return o;
        }, {});
        const validator = new AsyncValidator(rules);

        return new Promise((res, rej) => {
          const values = toJS(this.getTargetFields());
          // flatten values that need validate
          const flattenValue = needValidateName.reduce((o, cur) => {
            o[cur] = this.getField(cur);

            return o;
          }, {});

          validator.validate(
            flattenValue,
            // eslint-disable-next-line handle-callback-err
            action((err, fields) => {
              this.errors.merge(fields);

              if (fields) {
                if (callback) {
                  return callback(fields);
                }

                return rej(fields);
              }

              return res(values);
            })
          );
        }).catch(errors => {
          const errorsMap = new ObservableMap();

          for (const name in errors) {
            errorsMap.set(name, errors[name]);
          }
          extendObservable(this, {
            errors: errorsMap,
          });

          return Promise.reject(errors);
        });
      };

      getFieldError = name => this.errors.get(name);

      /**
       * not support filter name now
       */
      getFieldsError = () => this.errors.toJS();

      getStore = () => this.props.store || gStore || this.store;

      isEditable = () => this.props.editable;

      getFieldDecorator = (name, customFieldOption = {}) => element =>
        React.cloneElement(element, this.getFieldProps(name, customFieldOption));

      getFieldProps = (name, customFieldOption = {}) => {
        const store = this.getStore();

        if (!store) throw new Error('Must pass `store` with Mobx instance.');
        if (!name) {
          throw new Error('Must call `getFieldProps` with valid name string!');
        }

        const storeOptions = (store.__options && store.__options[name]) || {};

        const fieldOption = {
          getValueFromEvent,
          name,
          valuePropName: 'value',
          trigger: DEFAULT_TRIGGER,
          validateTrigger: DEFAULT_VALIDATE_TRIGGER,
          appendProps: {},
          ...storeOptions,
          ...customFieldOption,
        };

        const {
          trigger,
          validateTrigger,
          valuePropName,
          parseValue,
          appendProps,
          initialValue,
          otherProps,
        } = fieldOption;

        const path = prefix ? `${prefix}.${name}` : name;

        // if (!has(store, path)) extendObservable(store, set({}, path, initialValue));

        const value = this.getField(name);

        this.fieldOptions[name] = fieldOption;

        const props = {
          [valuePropName]: parseValue ? parseValue(value) : toJS(value),
          [trigger]: this.createHandler(fieldOption, validateTrigger === trigger),
          'data-field-name': name,
          ...appendProps,
          ...otherProps,
        };

        if (!this.isEditable()) {
          props.disabled = true;
        }

        if (validateTrigger !== trigger)
          props[validateTrigger] = this.createValidateHandler(fieldOption);

        return props;
      };

      removeFieldOption(name) {
        delete this.fieldOptions[name];
      }

      getChildContext() {
        return {
          form: this,
          defaultItemProps: this.props.defaultItemProps || defaultItemProps,
          displayDefaultLabel,
        };
      }

      getTargetFields() {
        const store = this.getStore();

        return prefix ? get(store, prefix) : store;
      }

      getField(path, defaultValue) {
        const store = this.getStore();

        return get(store, prefix ? `${prefix}.${path}` : path, defaultValue);
      }

      setField(path, value) {
        const store = this.getStore();

        return set(store, prefix ? `${prefix}.${path}` : path, value);
      }

      getResetErrors() {
        return this.errors.keys().reduce((o, name) => {
          o[name] = [];

          return o;
        }, {});
      }

      validateField(name, value, rules) {
        if (!rules) return;
        const validator = new AsyncValidator({ [name]: rules });

        validator.validate(
          { [name]: value },
          action('validateField', (err, fields) => {
            this.errors.set(name, err || []);

            // hasErrors(this.getFieldsError());
          })
        );
      }

      createHandler({ name, onChange, rules }, needValidate = false) {
        return (...params) => {
          const value = getValueFromEvent(...params);

          if (this.isEditable()) {
            if (onChange) {
              onChange(value);
            }
            if (needValidate) {
              this.validateField(name, value, rules);
            }

            this.setField(name, value);
          }
        };
      }

      createValidateHandler({ name, rules }) {
        return (...params) => {
          const value = getValueFromEvent(...params);

          this.validateField(name, value, rules);
        };
      }

      render() {
        // use __counter to force update
        // because mobx will prevent update of Component when prop not changed.
        return <WrappedComponent {...this.props} form={this} ref={this.props.rootRef} />;
      }
    }

    return WrapForm;
  }

  return decorate;
}

export default createForm;
