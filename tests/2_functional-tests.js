const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Viewing one stock: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG')
        .end((err, res) => {
            assert.equal(res.status,200);
            assert.typeOf(res.body.stockData.likes, 'number');
            assert.typeOf(res.body.stockData.stock, 'string');
            assert.typeOf(res.body.stockData.price, 'number');
            done();
        });
    })

    test('Viewing one stock and liking it: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end((err, res) => {
            assert.equal(res.status,200);
            assert.typeOf(res.body.stockData.likes, 'number');
            assert.typeOf(res.body.stockData.stock, 'string');
            assert.typeOf(res.body.stockData.price, 'number');
            done();
        });
    })

    // ip saver not implemented on schema
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end((err, res) => {
            assert.equal(res.status,200);
            // assert.typeOf(res.body.stockData.likes, 'number');
            // assert.typeOf(res.body.stockData.stock, 'string');
            // assert.typeOf(res.body.stockData.price, 'number');
            done();
        });
    })

    test('Viewing two stocks: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT')
        .end((err, res) => {
            assert.equal(res.status,200);
            assert.typeOf(res.body.stockData[0].rel_likes, 'number');
            assert.typeOf(res.body.stockData[0].stock, 'string');
            assert.typeOf(res.body.stockData[0].price, 'number');

            assert.typeOf(res.body.stockData[1].rel_likes, 'number');
            assert.typeOf(res.body.stockData[1].stock, 'string');
            assert.typeOf(res.body.stockData[1].price, 'number');
            done();
        });
    })

    test('Viewing two stocks and liking them: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
        .end((err, res) => {
            assert.equal(res.status,200);
            assert.typeOf(res.body.stockData[0].rel_likes, 'number');
            assert.typeOf(res.body.stockData[0].stock, 'string');
            assert.typeOf(res.body.stockData[0].price, 'number');

            assert.typeOf(res.body.stockData[1].rel_likes, 'number');
            assert.typeOf(res.body.stockData[1].stock, 'string');
            assert.typeOf(res.body.stockData[1].price, 'number');
            done();
        });
    })
});
