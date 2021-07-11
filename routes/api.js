'use strict';
const fetch = require('node-fetch');
const mongoose = require('mongoose');

module.exports = function (app) {

  mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});

  const schema = new mongoose.Schema({
    stock: String,
    price: Number,
    likes: {type: Number, default: 0}
  });

  const Stock = mongoose.model('Stock', schema);

  app.route('/api/stock-prices')
    .get(async (req, res) => {
      const stock = req.query.stock;
      const like = req.query.like

      let stock1, stock2,data1,data2,parsed1,parsed2;

      if(stock.length === 2){

        stock1 = stock[0];
        stock2 = stock[1];
        data1 = await fetch('https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock1 + '/quote');
        data2 = await fetch('https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock2 + '/quote');
        parsed1 = await data1.json();
        parsed2 = await data2.json();

        const stockData1 = {
          stock: parsed1.symbol,
          price: parsed1.close
        }

        const stockData2 = {
          stock: parsed2.symbol,
          price2: parsed2.close
        }

        const query1 = {stock: stockData1.stock};
        const query2 = {stock: stockData2.stock};

        let update1, update2;
        if(like){
          update1 = { price: stockData1.price, $inc: {likes : 1} };
          update2 = { price: stockData2.price, $inc: {likes : 1} };
        } else {
          update1 = { price: stockData1.price };
          update2 = { price: stockData2.price };
        }
        const options = {upsert: true, new: true, setDefaultsOnInsert: true,useFindAndModify:false};
        const model1 = await Stock.findOneAndUpdate(query1, update1, options);
        const model2 = await Stock.findOneAndUpdate(query2, update2, options);
        const rel = model1.likes - model2.likes;

        res.json({
          stockData: [
            {
              stock: parsed1.symbol,
              price: parsed1.close,
              rel_likes: rel
            },
            {
              stock: parsed2.symbol,
              price: parsed2.close,
              rel_likes: -rel
            }
          ]
        });
        return;
      }

      const data = await fetch('https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + stock + '/quote');
      const parsed = await data.json();
      const stockData = {
        stock: parsed.symbol,
        price: parsed.close
      }
      const query = {stock: stockData.stock};
      let update;
      if(like)
        update = { price: stockData.price, $inc: {likes : 1} };
      else
        update = { price: stockData.price };
      const options = {upsert: true, new: true, setDefaultsOnInsert: true,useFindAndModify:false};
      const model = await Stock.findOneAndUpdate(query, update, options);
      res.json({
        stockData: model
      });
    });
    
};
