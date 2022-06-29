# OpenFL Plugin for Vite

A custom plugin to build [OpenFL](https://openfl.org) (and [Feathers UI](https://feathersui.com/)) projects with [Vite](http://vitejs.dev).

## Usage

```js
// vite.config.js
import { defineConfig } from "vite";
import openflPlugin from "vite-plugin-openfl";

export default defineConfig({
  plugins: [openflPlugin()],
});
```
