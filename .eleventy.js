
module.exports = function(config) {
    config.addPassthroughCopy('./src/images');
    config.addPassthroughCopy('./src/css');
    config.addPassthroughCopy('./src/js');
    config.addPassthroughCopy({
      "node_modules/d3/dist/d3.js": "/js/d3.min.js",
      "node_modules/d3-selection-multi/build/d3-selection-multi.js": "/js/d3-selection-multi.min.js"
    });

    config.input
    return {
        dir: {
          input: 'src',
          output: 'dist'
        },
        passthroughFileCopy: true
    };
};
  