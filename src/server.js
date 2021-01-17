const iex = require('./config/iex');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 5000;
const uri = "mongodb+srv://username:password@cluster0.rdgkw.mongodb.net/dbName?retryWrites=true&w=majority";
const dbName = "database";
const client = new MongoClient(uri, { useNewUrlParser: true });
let transactions = [];
const holdings = [];

async function run() {
  try {
    await client.connect();
    console.log("Connected correctly to server");

    //Use collection transactions
    const db = client.db(dbName);
    const transactionsCol = db.collection("transactions");
    transactionsCol.find().toArray()
    .then(data => {
      transactions = data;
    });

    // ========================
    // Middlewares
    // ========================
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // ========================
    // Routes
    // ========================
    app.post('/transaction', (req, res) => {
      req.body.total = req.body.quantity * req.body.price;
      transactions.push({
        id: transactions.length,
        date: req.body.date,
        ticker: req.body.ticker,
        tType: req.body.tType,
        quantity: parseInt(req.body.quantity),
        price: Number(req.body.price),
        total: parseInt(req.body.quantity) * Number(req.body.price),
      });
      transactionsCol.insertOne(transactions[transactions.length - 1])
      .then(res.send(transactions))
      .catch((err) => console.log(err));
    });

    app.get('/transactions', (req, res) => {
      JSON.stringify(transactions);
      res.send(transactions);
    });

    app.get('/holdings', async (req, res) => {
      transactions.forEach((transaction) => {

        if (transaction.tType === 'BUY') {
          deltaQuantity = transaction.quantity;
        } else if (transaction.tType === 'SELL') {
          deltaQuantity = -transaction.quantity;
        }

        const index = holdings.findIndex(holding => holding.ticker == transaction.ticker);

        if (index >= 0) {
          const currentHolding = holdings[index];
          if (transaction.tType === 'BUY') {
            currentHolding.averagePrice = ((currentHolding.averagePrice * currentHolding.quantity) + transaction.price * deltaQuantity) / (deltaQuantity + currentHolding.quantity)
            currentHolding.bookValue += transaction.total;
          } else if (transaction.tType === 'SELL') {
            currentHolding.averagePrice = ((currentHolding.averagePrice * currentHolding.quantity) + transaction.price * deltaQuantity) / (deltaQuantity + currentHolding.quantity)
            currentHolding.bookValue += deltaQuantity * transaction.price;
          }
          currentHolding.quantity += deltaQuantity;

        } else {
          // Add new holdings object
          holdings.push({
            ticker: transaction.ticker,
            quantity: deltaQuantity,
            bookValue: transaction.total,
            averagePrice: transaction.price,
          })
        }

      })

      //Loop thru all holdings and call api
      await callApi(holdings);

      JSON.stringify(holdings);
      res.send(holdings);
    });

    // ========================
    // Listen
    // ========================
    app.listen(port, () => console.log(`Listening on port ${port}`));

  } catch (err) {
    console.log(err.stack);
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Determines price data and
const callApi = async (holdings) => {
  let total = 0;
  for (let holding of holdings) {
    const apiUrl = `${iex.iex.base_url}/stock/${holding.ticker}/chart/5d?token=${iex.iex.api_token}&displayPercent=true`
    const response = await fetch(apiUrl);
    const data = await response.json();
    const prevDay = data[data.length - 1];
    holding.currentPrice = prevDay.close;
    holding.marketValue = holding.currentPrice * holding.quantity;
    holding.unrealizedPL = holding.marketValue - holding.bookValue;
    holding.dayPL = `${(prevDay.change * holding.quantity)} ${prevDay.changePercent}`;
    total += holding.marketValue;
  }

  for (let holding of holdings) {
    holding.weight = (holding.marketValue / total) * 100;
  }
}