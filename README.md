# OpenFL Plugin for Vite

A custom plugin to build [OpenFL](https://openfl.org) (and [Feathers UI](https://feathersui.com/)) projects with [Vite](http://vitejs.dev).

## Usage

Create a new directory for your project.

Create the necessary files for an OpenFL project, including _project.xml_ inside the project's root directory and your _.hx_ source files. Then, follow the remaining steps to setup Vite and vite-plugin-openfl.

In a terminal, run the following command in the root of your project to create a _package.json_ file:

```sh
npm init -y
```

Then, run the following command to install the required dependencies:

```sh
npm install --save-dev vite vite-plugin-openfl
```

Open the _package.json_ file, and modify the `scripts` section:

```json
"scripts": {
  "start": "vite",
  "build": "vite build"
}
```

Create a _vite.config.js_ file in the root of your project:

```js
import { defineConfig } from "vite";
import openflPlugin from "vite-plugin-openfl";

export default defineConfig({
  plugins: [openflPlugin()],
});
```

To start a local development server, run the following command. Then, open _http://localhost:3000/_ in a web browser.

```sh
npm start
```

To build a production JavaScript bundle, run the following command:

```sh
npm run build
```
