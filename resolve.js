import Math from 'mathjs';
var PREFIXES = Math.type.Unit.PREFIXES;
var BASE_UNITS = Math.type.Unit.BASE_UNITS;

var cssUnits = {
  PIXELS: 'px',
  EM: 'em',
  EX: 'ex',
  CH: 'ch',
  REM: 'rem',
  POINTS: 'pt',
  VH: 'vh',
  VW: 'vw',
  VMIN: 'vmin',
  VMAX: 'vmax'
};

Object.keys(cssUnits).forEach(function (unitKey) {
  BASE_UNITS[unitKey] = {
    dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0],
    key: unitKey
  };

  var unit = cssUnits[unitKey];

  Math.type.Unit.UNITS[unit] = {
    name: unit,
    base: BASE_UNITS[unitKey],
    prefixes: PREFIXES.NONE,
    value: 1,
    offset: 0,
    dimensions: BASE_UNITS[unitKey].dimensions
  };
});

module.exports = (exp) => {
  if (exp.indexOf('power(') >= 0) {
    const start = exp.indexOf('(') + 1,
      end = exp.indexOf(')'),
      numWithUnit = exp.substring(start, end),
      num = numWithUnit.replace(/([^a-zA-Z]+)([a-zA-Z]*)$/, '$1'),
      unit = numWithUnit.replace(/([^a-zA-Z]+)([a-zA-Z]*)$/, '$2');
    exp = exp.substring(0, start) + num + ')';

  }
  const result = Math.eval(exp),
    formatted = result.toString().replace(/(.+) ([a-zA-Z]+)$/, '$1$2');
  return formatted;
};