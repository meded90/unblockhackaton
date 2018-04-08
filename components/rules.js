import { keccak256 } from 'js-sha3';
// TODO - fix Latinic
const regAdress = /^[\s\dA-Za-z,.\-"']+$/gi;
const regName = /^[\s\dA-Za-z'.-]+$/gi;

export const isName = {
  pattern: regName,
  message: "Please use latin characters and symbols '.-",
};

export const isAddress = {
  pattern: regAdress,
  message: 'Please use latin characters and symbols ,.-"\'',
};

export const notEnoughCharacters = { min: 2, message: 'Not enough characters' };

export const isRequired = {
  validator(rule, value, callback, source, options) {
    const errors = [];

    const isEmptyString = value => {
      if (typeof value === 'string') {
        const parts = value.split(' ').length;

        if (parts === 1) {
          return !value.length;
        }

        if (value.length - parts < 0) {
          return true;
        }
      }

      return false;
    };

    if (value === undefined || value === null || isEmptyString(value)) {
      errors.push('Please fill in this field!');
    }
    callback(errors);
  },
};

export const isNumber = {
  pattern: /^[\d]+$/gi,
  message: 'Numbers only, no dash or any other separator.',
  whitespace: true,
};

export const isFloatingNumber = {
  pattern: /^[+-]?([0-9]*[.])?[0-9]+$/gi,
  message: 'Numbers only, no dash or any other separator.',
  whitespace: true,
};

export const isWebsite = {
  pattern: /^((https?|s?ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
  message: 'Website url not correct',
};

export const isEmail = {
  pattern: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
  message: 'E-mail not correct',
};

export const def = {
  name: [isName, notEnoughCharacters],
  address: [isAddress, notEnoughCharacters],
};
function isChecksumAddress(address) {
  // Check each case
  const addressClear = address.replace('0x', '');
  const addressHash = keccak256(addressClear.toLowerCase());

  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 && addressClear[i].toUpperCase() !== addressClear[i]) ||
      (parseInt(addressHash[i], 16) <= 7 && addressClear[i].toLowerCase() !== addressClear[i])
    ) {
      return false;
    }
  }

  return true;
}

function isValidEthereumAddress(address) {
  const ADDRESS_LATOKRN = '0xE50365f5D679CB98a1dd62D6F6e58e59321BcdDf';

  if (address === ADDRESS_LATOKRN) {
    return false;
  }
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  }
  // Otherwise check each case
  return isChecksumAddress(address);
}

export const ethereumAddress = [
  isRequired,
  {
    validator(rule, value, callback, source, options) {
      const errors = [];

      if (!isValidEthereumAddress(value)) {
        errors.push('Please enter valid address!');
      }
      callback(errors);
    },
  },
];

export const isNotEmptyImageList = {
  validator(rule, value, callback, source, options) {
    const errors = [];

    if (!value || value.length === 0) {
      errors.push('Please add image here!');
    }
    callback(errors);
  },
};

export const isConfirm = {
  validator(rule, value, callback, source, options) {
    const errors = [];

    if (value !== true) {
      errors.push('You must confirm this block before next actions');
    }
    callback(errors);
  },
};

export const isBoolean = {
  validator(rule, value, callback, source, options) {
    const errors = [];

    if (typeof value !== 'boolean') {
      errors.push('You must fill this field!');
    }
    callback(errors);
  },
};
