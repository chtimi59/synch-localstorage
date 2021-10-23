/* eslint-disable */

require('dotenv').config();

const { DefinePlugin } = require('webpack');
const path = require('path');
const child_process = require('child_process');
const AssetsPlugin = require('assets-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const isDevelopment = process.env.NODE_ENV !== 'production';
const withHotReloading = process.env.HOT_RELOAD === 'true';

const serverHost = process.env.HOST || 'localhost';
const serverPort = process.env.PORT || 9888;
const sourcePath = path.join(__dirname, 'src');
const outputPath = path.join(__dirname, 'dist');

const guessGitBranch = () => {
    let branch;
    try {
        branch = child_process.execFileSync(
            'git',
            ['symbolic-ref', '-q', 'HEAD'],
            { encoding: 'utf-8' },
        );
    } catch (e) {
        return 'null';
    }
    branch = branch.replace(/^refs\/heads\//, '');
    return JSON.stringify(branch);
};

const guessGitCommit = () => {
    let commit;
    try {
        commit = child_process.execFileSync(
            'git',
            ['rev-parse', '--short', 'HEAD'],
            { encoding: 'utf-8' },
        );
    } catch (e) {
        return 'null';
    }
    return JSON.stringify(commit);
};

const guessGitTag = () => {
    let commit;
    try {
        commit = child_process.execFileSync('git', ['describe', '--tags'], {
            encoding: 'utf-8',
        });
    } catch (e) {
        return 'null';
    }
    return JSON.stringify(commit);
};

const config = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': sourcePath, // should reflect tsconfig.json
        },
    },
    entry: {
        main: '@/index',
    },
    output: {
        path: outputPath,
        filename: 'bundle-[fullhash].js',
        sourceMapFilename: 'bundle-[fullhash]-map.js',
        chunkFilename: 'bundle-[name]-[chunkhash].js',
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new CopyPlugin(
            {
                patterns: [
                    { from: 'static' }
                ],
            },
            { symlink: true },
        ),
        new HtmlWebpackPlugin({
            template: 'templates/index.html',
            inject: false
        }),
        // For React Fast Refresh
        withHotReloading && new ReactRefreshWebpackPlugin(),
        new AssetsPlugin(),
        new Dotenv({ systemvars: true }),
        new DefinePlugin({
            'process.env.KD_GIT_BRANCH':
                DefinePlugin.runtimeValue(guessGitBranch),
            'process.env.KD_GIT_COMMIT':
                DefinePlugin.runtimeValue(guessGitCommit),
            'process.env.KD_GIT_TAG': DefinePlugin.runtimeValue(guessGitTag),
        }),
    ].filter(Boolean),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: sourcePath,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            getCustomTransformers: () => ({
                                before: withHotReloading
                                    ? [ReactRefreshTypeScript()]
                                    : [],
                            }),
                        },
                    },
                ].filter(Boolean),
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                include: path.resolve(sourcePath, 'assets'),
                use: 'file-loader',
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                use: 'file-loader',
            },
            {
                test: /\.svg$/,
                include: path.resolve(sourcePath, 'assets'),
                use: [
                    'raw-loader',
                    {
                        loader: 'svgo-loader',
                        options: { plugins: [{ removeDimensions: true }] },
                    },
                ].filter(Boolean),
            },
            {
                test: /\.csv$/,
                use: 'raw-loader',
            },
            {
                test: /\.svg$/,
                include: path.resolve(sourcePath, 'inline-assets'),
                use: 'raw-loader',
            },
        ],
    },
    // For webpack-dev-server
    devServer: {
        contentBase: outputPath,
        compress: true,
        historyApiFallback: true,
        host: serverHost,
        port: serverPort,
        before(app, _server, _compiler) {
            app.use('/', (req, _res, next) => {
                console.log(
                    `${new Date().toISOString()} [${
                        req.headers['x-forwarded-for'] || req.ip
                    }] ${req.method} ${req.originalUrl}`,
                );
                next();
            });
        },
    },
};

module.exports = config;
