/* eslint no-undef: 0 */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {readFileSync} = require("fs");
const server = require('../src/server/index');
const Books = require('../src/server/models/books');
const generateData = require('../bin/generateData');
const db = require('../src/server/models/connector');

const should = chai.should();
chai.use(chaiHttp);



describe('routes : books', () => {

  let bookIds;

  beforeEach(async () => {
    await generateData(2, 5);

    const books = await Books.all();
    bookIds = books.map((b) => b.id);
  });

  describe('GET /api/v1/books', () => {
    it('should return all books', (done) => {
      chai.request(server)
        .get('/api/v1/books')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data.length.should.eql(5);
          res.body.data[0].should.include.keys(
            'id', 'author_name', 'date', 'description', 'image', 'title'
          );
          done();
        });
    });
  });

  describe('GET /api/v1/books/:id', () => {
    it('should respond with a single book', (done) => {
      chai.request(server)
        .get(`/api/v1/books/${bookIds[0]}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(
            'id', 'author_name', 'date', 'description', 'image', 'title'
          );
          done();
        });
    });
  });

  describe('POST /api/v1/books', () => {
    it('should return the book that was added', (done) => {
      chai.request(server)
        .post('/api/v1/books')
        .set('Content-Type','multipart/form-data')
        .attach('file', readFileSync('test/file.test'), 'file.test')
        .field('author', 'Max')
        .field('date', '2018-11-10')
        .field('description', 'Descriptione')
        .field('title', 'Title of the book')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(201);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data.should.include.keys(
            'id', 'author_name', 'date', 'description', 'image', 'title'
          );
          done();
        });
    });
  });

  describe('PUT /api/v1/books', () => {
    it('should return the book that was updated', (done) => {
      chai.request(server)
        .put(`/api/v1/books/${bookIds[0]}`)
        .set('Content-Type','multipart/form-data')
        .attach('file', readFileSync('test/file.test'), 'file.test')
        .field('author', 'Max1')
        .field('date', '2018-11-10')
        .field('description', 'Descriptione')
        .field('title', 'Title of the book')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(201);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data.should.include.keys(
            'id', 'author_name', 'date', 'description', 'image', 'title'
          );
          res.body.data.author_name.should.eql('Max1');
          done();
        });
    });
  });

  afterEach(async () => {
    await db.query('DELETE FROM authors');
    bookIds.splice(0, bookIds.length);
  });

  after(() => {
    db.end();
  });

});