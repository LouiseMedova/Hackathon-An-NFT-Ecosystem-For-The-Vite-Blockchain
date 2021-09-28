module.exports = {
  entry: './nacl.js',
  output: {
    library: 'nacl',
    filename: 'nacl.min.js'
  },
  node: { Buffer: false }
};
