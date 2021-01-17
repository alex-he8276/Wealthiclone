import React from 'react';
import Paper from '@material-ui/core/Paper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import FormDialog from './FormDialog';

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 500,
  },
});

export default function TransactionsTable(props) {
  // const [transactions, setTransactions] = React.useState([]);

  // const handleAddTransaction = (newTransaction) => {
  //   setTransactions(newTransaction)
  //   setTransactions((prev) => {
  //     return [
  //       newTransaction
  //     ]
  //   })
  // }

  return (
    <Paper className="holdingsTable">
      <Typography style={{ display: 'inline-block' }} variant="h4">Transactions</Typography>
      <FormDialog/>
      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticker</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Total ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.transactions.map((row) => (
              <Row key={row.index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

function Row(props) {
  const classes = useStyles();
  const { row } = props;

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {row.ticker}
        </TableCell>
        <TableCell align="right">{row.date}</TableCell>
        <TableCell align="right">{row.tType}</TableCell>
        <TableCell align="right">{row.quantity}</TableCell>
        <TableCell align="right">{row.price}</TableCell>
        <TableCell align="right">{row.total}</TableCell>
      </TableRow>
    </React.Fragment>
  )
}