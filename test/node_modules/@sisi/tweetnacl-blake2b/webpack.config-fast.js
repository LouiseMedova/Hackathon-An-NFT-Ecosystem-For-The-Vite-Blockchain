module.exports = {
  entry: './nacl-fast.js',
  output: {
    library: 'nacl',
    filename: 'nacl-fast.min.js'
  },
  node: { Buffer: false }
};
