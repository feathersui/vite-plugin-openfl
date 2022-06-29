const child_process = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const vite = require("vite");

module.exports = function openflPlugin() {
  /** @type vite.ResolvedConfig */ let config = null;
  return {
    name: "openfl",
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith(".hx")) {
        //if a Haxe source file changes, restart the server
        ctx.server.restart();
      }
    },
    config() {
      const projectXmlPath = path.resolve(process.cwd(), "project.xml");
      const hxml = getHXML(projectXmlPath);
      if (!hxml) {
        cb(new Error("Command `lime display html5` failed."));
        return;
      }
      const jsOutputPath = getJSOutputPath(hxml);
      if (!jsOutputPath) {
        cb(new Error("Failed to detect OpenFL html5 output file path."));
        return;
      }
      const projectPath = path.dirname(projectXmlPath);
      const fullOutputFolder = path.resolve(
        projectPath,
        path.dirname(jsOutputPath)
      );
      const ignorePath = `${fullOutputFolder}/**`;
      return {
        server: {
          watch: {
            ignored: [ignorePath],
          },
        },
      };
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    resolveId(source, importer) {
      if (!/\/project\.xml$/.test(importer)) {
        return;
      }

      const hxml = getHXML(importer);
      if (!hxml) {
        cb(new Error("Command `lime display html5` failed."));
        return;
      }
      const jsOutputPath = getJSOutputPath(hxml);
      if (!jsOutputPath) {
        cb(new Error("Failed to detect OpenFL html5 output file path."));
        return;
      }
      const projectDir = path.dirname(importer);
      const outDir = path.dirname(path.resolve(projectDir, jsOutputPath));
      if (!path.isAbsolute(source)) {
        const absoluteSource = path.resolve(outDir, source);
        if (fs.existsSync(absoluteSource)) {
          return {
            id: absoluteSource,
          };
        }
      }
    },
    transform(code, id, options) {
      if (!/\/project\.xml$/.test(id)) {
        return;
      }

      const projectXml = fs.readFileSync(id, {
        encoding: "utf8",
      });

      const haxelibs = getHaxelibs(projectXml);
      const usesGenes = haxelibs.includes("genes");

      const isServeCommand = config.command === "serve";
      const projectDir = path.dirname(id);
      const mode = isServeCommand ? "-debug" : "-release";
      const templateDir = path.join(
        "templates",
        usesGenes ? "genes" : "default"
      );
      const result = child_process.spawnSync("haxelib", [
        "run",
        "lime",
        "build",
        id,
        "html5",
        mode,
        `--template=${path.resolve(__dirname, templateDir)}`,
      ]);
      const logger = vite.createLogger("info");
      result.output.forEach((line) => {
        if (!line) {
          return;
        }
        logger.info(line.toString());
      });
      if (result.status !== 0) {
        this.error("OpenFL Build Failed with status code: " + result.status);
        return;
      }
      const hxml = getHXML(id);
      if (!hxml) {
        cb(new Error("Command `lime display html5` failed."));
        return;
      }
      const jsOutputPath = getJSOutputPath(hxml);
      if (!jsOutputPath) {
        cb(new Error("Failed to detect OpenFL html5 output file path."));
        return;
      }
      return {
        code: fs.readFileSync(path.resolve(projectDir, jsOutputPath), {
          encoding: "utf8",
        }),
      };
    },
  };
};

function getHaxelibs(projectXML) {
  const haxelibRegExp = /<haxelib\s+name=\"(.*?)\".*?\/>/g;
  let haxelibElement = haxelibRegExp.exec(projectXML);
  if (!haxelibElement) {
    return [];
  }
  const haxelibs = [];
  while (haxelibElement) {
    const haxelib = haxelibElement[1];
    haxelibs.push(haxelib);
    haxelibElement = haxelibRegExp.exec(projectXML);
  }
  return haxelibs;
}

function getHXML(id) {
  const result = child_process.spawnSync("haxelib", [
    "run",
    "lime",
    "display",
    id,
    "html5",
  ]);
  if (result.status !== 0) {
    console.error(result.output.toString());
    return null;
  }
  return result.output.toString();
}

function getJSOutputPath(hxml) {
  const jsArg = /\-js (.+)/.exec(hxml);
  if (!jsArg) {
    return null;
  }
  return jsArg[1];
}
