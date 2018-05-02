/* eslint no-undef: 0 */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {readFileSync} = require("fs");
const server = require('../src/server/index');
const Books = require('../src/server/models/books');
const db = require('../src/server/models/connector');

const should = chai.should();
chai.use(chaiHttp);



describe('routes : books', () => {

  const ids = [];

  beforeEach(async () => {
    const book = {
      author: 'Bob',
      date: '2017-11-02',
      description: 'Desc1',
      title: 'Title',
      image: 'filename'
    };
    ids.push(await Books.add(book));
    ids.push(await Books.add(book));
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
          res.body.data.length.should.eql(2);
          res.body.data[0].should.include.keys(
            'id', 'author', 'date', 'description', 'image', 'title'
          );
          done();
        });
    });
  });

  describe('GET /api/v1/books/:id', () => {
    it('should respond with a single book', (done) => {
      chai.request(server)
        .get(`/api/v1/books/${ids[0]}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(
            'id', 'author', 'date', 'description', 'image', 'title'
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
            'id', 'author', 'date', 'description', 'image', 'title'
          );
          done();
        });
    });
  });

  describe('PUT /api/v1/books', () => {
    it('should return the book that was updated', (done) => {
      chai.request(server)
        .put(`/api/v1/books/${ids[0]}`)
        .set('Content-Type','multipart/form-data')
        // .attach('file', readFileSync('test/file.test'), 'file.test')
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
            'id', 'author', 'date', 'description', 'image', 'title'
          );
          done();
        });
    });
  });

  afterEach(async () => {
    await db.query('DELETE FROM books');
    ids.splice(0, ids.length);
  });

  after(() => {
    db.end();
  });

});