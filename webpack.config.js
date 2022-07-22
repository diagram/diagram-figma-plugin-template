const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const path = require('path')
const webpack = require('webpack')

module.exports = (env, argv) => {
    const mode = argv.mode === 'production' ? 'production' : 'development'
    const isDevMode = mode == 'development'

    return {
        mode,
        devtool: argv.mode === 'production' ? false : 'inline-source-map',
        entry: {
            ui: './src/ui/ui.tsx',
            code: './src/plugin/code.ts',
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.svg/,
                    type: 'asset/inline',
                },
            ],
        },
        resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
        },
        optimization: isDevMode
            ? {}
            : {
                  minimize: true,
                  minimizer: [new TerserPlugin()],
              },
        plugins: [
            new webpack.DefinePlugin({
                global: {}, // fix missing symbol error when running in developer VM
            }),
            new HtmlWebpackPlugin({
                inject: 'body',
                template: './template/template.html',
                filename: 'ui.html',
                chunks: ['ui'],
                cache: false,
            }),
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
        ],
    }
}
