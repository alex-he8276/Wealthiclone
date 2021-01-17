import React, { useEffect, useState } from "react";
import Header from "./Header";
import HoldingsTable from "./HoldingsTable";
import TransactionsTable from "./TransactionsTable";

// Some sort of prototyping 
// const rows = [
//   createData('AAPL', 23.7, 10, 1000.00, 1200.20, 200.20, 43.11),
//   createData('GNOG', 10.1, 20, 939.01, 1112.20, 179.1, 13.11),
// ];

// function createData(name, weight, quantity, book, market, unrealized, daily) {
//   return {
//     name,
//     weight,
//     quantity,
//     book,
//     market,
//     unrealized,
//     daily,
//     history: [
//       { date: '2020-01-05', type: 'BUY', quantity: 3, price: 12.334, total: 121.93 },
//       { date: '2020-01-05', type: 'SELL', quantity: 11, price: 13.334, total: 321.12 },
//     ],
//   };
// }

function App() {

  const [transactions, setTransactions] = useState([]);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const transactionsUrl = `/transactions`
    fetch(transactionsUrl)
      .then(response => response.json())
      .then(data => {
        setTransactions(data);
      });

    const holdingssUrl = `/holdings`
    fetch(holdingssUrl)
      .then(response => response.json())
      .then(data => {
        setHoldings(data);
      });
  }, [])

  return (
    <div className="App">
      <Header />
      <TransactionsTable transactions={transactions} />
      <HoldingsTable rows={holdings} />
    </div>
  );
}

export default App;
