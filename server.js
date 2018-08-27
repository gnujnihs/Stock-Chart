import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from './webpack.config.js';

const app = express();
const PORT = 2000;
app.use(webpackMiddleware(webpack(webpackConfig)));

app.post('/', (req, res) => {
  console.log(req.query);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
