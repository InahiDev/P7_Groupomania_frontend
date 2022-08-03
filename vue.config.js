const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "./src/styles/utils/_variables.scss";
          @import "./src/styles/utils/_mixins.scss";
          @import "./src/styles/utils/_functions.scss";
          @import "./src/styles/utils/_extensions.scss";
        `
      }
    }
  }
})
