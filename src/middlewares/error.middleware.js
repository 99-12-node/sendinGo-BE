module.exports = (err, req, res, next) => {
  console.error('\x1b[31m%s\x1b[0m', err);
  const code = err.statusCode ? err.statusCode : 500;
  return res.status(code).json({ message: err.message });
};
