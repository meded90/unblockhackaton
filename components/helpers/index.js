import _ from 'lodash';

export function generateFormData(fullData: object, keys: string[]): object {
  const data = {};
  keys.forEach(key => _.set(data, key, _.get(fullData, key)));
  return data;
}

export function getValueFromEvent(e: any): boolean | string {
  // support custom element
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}

interface rule {
  required?: boolean;
}

export function checkIsRequired(rules: rule | rule[]): boolean {
  if (rules) {
    if (Array.isArray(rules)) return rules.filter(({ required }) => required).length > 0;
    return Boolean(rules.required);
  }
  return false;
}
