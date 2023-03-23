module.exports = (model) => {
  return Object.entries(model).reduce((acc, [k, v]) => {
    if (k.split('.').length > 1) {
      const key = k.split('.')[k.split('.').length - 1];
      acc[key] = v;
    } else {
      acc[k] = v;
    }
    return acc;
  }, {});
};
