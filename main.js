const rspack = require("@rspack/core");
const refreshPlugin = require("@rspack/plugin-react-refresh");
const isDev = process.env.NODE_ENV === "development";

const cleanup = new FinalizationRegistry(key => {
    console.log('gc: ', key)
});

async function run() {
    const compiler = rspack({
        context: __dirname,
        entry: {
            main: "./src/main.jsx"
        },
        resolve: {
            extensions: ["...", ".ts", ".tsx", ".jsx"]
        },
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    type: "asset"
                },
                {
                    test: /\.(jsx?|tsx?)$/,
                    use: [
                        {
                            loader: "builtin:swc-loader",
                            options: {
                                sourceMap: true,
                                jsc: {
                                    parser: {
                                        syntax: "typescript",
                                        tsx: true
                                    },
                                    transform: {
                                        react: {
                                            runtime: "automatic",
                                            development: isDev,
                                            refresh: isDev
                                        }
                                    }
                                },
                                env: {
                                    targets: [
                                        "chrome >= 87",
                                        "edge >= 88",
                                        "firefox >= 78",
                                        "safari >= 14"
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new rspack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }),
            new rspack.ProgressPlugin({}),
            new rspack.HtmlRspackPlugin({
                template: "./index.html"
            }),
            isDev ? new refreshPlugin() : null
        ].filter(Boolean)
    });

    const foo = {}
    cleanup.register(compiler, 'compiler');
    cleanup.register(foo, 'foo');
    compiler.run((err, stats) => {
        if (err) {
            console.log(err)
        } else {
            console.log('done: ', foo);
        }
    });
}
run();


setTimeout(() => {
    console.log('try')
    global.gc();
}, 1000)

setTimeout(() => {
    console.log('end')
}, 4000)
