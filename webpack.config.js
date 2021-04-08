const Path = require("path");

// Import the core config
const webpackConfig = require("@silverstripe/webpack-config");
const {
    resolveJS,
    externalJS,
    moduleJS,
    pluginJS,
    moduleCSS,
    pluginCSS,
} = webpackConfig;

const ENV = process.env.NODE_ENV;
const PATHS = {
    MODULES: "node_modules",
    FILES_PATH: "../",
    ROOT: Path.resolve(),
    SRC: Path.resolve("client/src"),
    DIST: Path.resolve("client/dist"),
};

const config = [
    {
        name: "css",
        entry: {
            queuedjobprogressfield: `${PATHS.SRC}/styles/queuedjobprogressfield.scss`,
        },
        output: {
            path: PATHS.DIST,
            filename: "styles/[name].css",
        },
        devtool: ENV !== "production" ? "source-map" : "",
        module: moduleCSS(ENV, PATHS),
        plugins: pluginCSS(ENV, PATHS),
    },
];

module.exports = config;
