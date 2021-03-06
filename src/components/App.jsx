import React, { useEffect, useState } from "react";
import Header from "./Header";
import HoldingsTable from "./HoldingsTable";
import TransactionsTable from "./TransactionsTable";
import MyResponsiveLine from "./LineGraph";
import Paper from '@material-ui/core/Paper';

// Some sort of prototyping 
// const rows = [
//   createData('AAPL', 23.7, 10, 1000.00, 1200.20, 200.20, 43.11),
//   createData('GNOG', 10.1, 20, 939.01, 1112.20, 179.1, 13.11),
// ];

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
      <Paper style={{ height: 500, margin: '20px 20%', padding: '30px'}}>
      <h3>PLACEHOLDER VALUES</h3>
        <MyResponsiveLine>
        </MyResponsiveLine>
      </Paper>
      <TransactionsTable transactions={transactions} />
      <HoldingsTable rows={holdings} />
    </div>
  );
}

export default App;
