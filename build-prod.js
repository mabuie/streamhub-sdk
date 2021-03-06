({
  paths: {
    jquery: 'lib/jquery/jquery.min',
    base64: 'lib/base64/base64',
    almond: 'lib/almond/almond',
    text: 'lib/requirejs-text/text',
    hogan: 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
    hgn: 'lib/requirejs-hogan-plugin/hgn'
  },
  packages: [{
    name: "streamhub-sdk",
    location: "src"
  }],
  baseUrl: '.',
  name: "streamhub-sdk",
  include: ['almond'],
  stubModules: ['text', 'hgn'],
  out: "streamhub-sdk.min.js",
  namespace: 'Livefyre',
  pragmasOnSave: {
    excludeHogan: true
  },
  optimize: "uglify2",
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  },
  onBuildRead: function(moduleName, path, contents) {
    if (moduleName == "jquery") {
      contents = "define([], function(require, exports, module) {" + contents + "});";
    }
    return contents;
  }
})
