const Koa = require('koa');
const formidable = require('koa2-formidable');
const serve = require('koa-static');
const path = require('path');

const indexRoutes = require('./routes/index');
const booksRoutes = require('./routes/books');

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(serve(path.join(__dirname, '/public')));
app.use(formidable());
app.use(indexRoutes.routes());
app.use(booksRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`); // eslint-disable-line no-console
});

module.exports = server;