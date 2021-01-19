const iex = require('./config/iex');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 5000;

const uri = "mongodb+srv://un:pw@cluster0.rdgkw.mongodb.net/database?retryWrites=true&w=majority"; const dbName = "database";
const client = new MongoClient(uri, { useNewUrlParser: true });
let transactions = [];
let holdings = [];

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

      const holdingsCol = db.collection("holdings");
      holdingsCol.find().toArray()
      .then(data => {
        holdings = data;
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
      // Create holdings array
      const newTransaction = transactions[transactions.length - 1];

      if (newTransaction && !newTransaction.exported) {
        newTransaction.exported = true;
        if (newTransaction.tType === 'BUY') {
          deltaQuantity = newTransaction.quantity;
        } else if (newTransaction.tType === 'SELL') {
          deltaQuantity = -newTransaction.quantity;
        }
  
        const index = holdings.findIndex(holding => holding.ticker == newTransaction.ticker);
  
        if (index >= 0) {
          const currentHolding = holdings[index];
          if (newTransaction.tType === 'BUY') {
            currentHolding.averagePrice = ((currentHolding.averagePrice * currentHolding.quantity) + newTransaction.price * deltaQuantity) / (deltaQuantity + currentHolding.quantity)
            currentHolding.bookValue += newTransaction.total;
          } else if (newTransaction.tType === 'SELL') {
            currentHolding.averagePrice = ((currentHolding.averagePrice * currentHolding.quantity) + newTransaction.price * deltaQuantity) / (deltaQuantity + currentHolding.quantity)
            currentHolding.bookValue += deltaQuantity * newTransaction.price;
          }
          currentHolding.quantity += deltaQuantity;
        } else {
          holdings.push({
            ticker: newTransaction.ticker,
            quantity: deltaQuantity,
            bookValue: newTransaction.total,
            averagePrice: newTransaction.price,
          })
        }
      }


      // Call api to fetch price info for all holdings
      await callApi(holdings, holdingsCol);

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

// Fetches price data and determine weight calculations
const callApi = async (holdings, holdingsCol) => {
  let total = 0;
  for (let holding of holdings) {
    if (holding.lastUpdated !== new Date().toDateString()) {
      const apiUrl = `${iex.iex.base_url}/stock/${holding.ticker}/chart/5d?token=${iex.iex.api_token}&displayPercent=true`
      const response = await fetch(apiUrl);
      const data = await response.json();
      const prevDay = data[data.length - 1];
      holding.currentPrice = prevDay.close;
      // holding.dayPL = `${(prevDay.change * holding.quantity)} ${prevDay.changePercent}`;
      holding.dayPL = prevDay.changePercent;
      holding.lastUpdated = new Date().toDateString();
    }
    holding.marketValue = holding.currentPrice * holding.quantity;
    holding.unrealizedPL = holding.marketValue - holding.bookValue;
    total += holding.marketValue;
  }

  for (let holding of holdings) {
    holding.weight = (holding.marketValue / total) * 100;
  }

  //FUTURE: ONLY REPLACE ENTRIES THAT MUST BE UPDATED
  const result = await holdingsCol.deleteMany({});
  console.log("Deleted " + result.deletedCount + " documents");
  await holdingsCol.insertMany(holdings, { ordered: true })
}