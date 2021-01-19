import React from 'react';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';

import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 500,
  },
});

function Row(props) {
  const classes = useStyles();
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.ticker}
        </TableCell>
        <TableCell align="right">{row.weight.toFixed(2)}</TableCell>
        <TableCell align="right">{row.quantity}</TableCell>
        <TableCell align="right">{row.bookValue.toFixed(2)}</TableCell>
        <TableCell align="right">{row.marketValue.toFixed(2)}</TableCell>
        <TableCell align="right">{row.unrealizedPL.toFixed(2)}</TableCell>
        <TableCell align="right">{row.averagePrice.toFixed(2)}</TableCell>
        <TableCell align="right">{row.currentPrice.toFixed(2)}</TableCell>
        <TableCell align="right">{row.dayPL.toFixed(2) + " %"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="history">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price ($)</TableCell>
                    <TableCell>Total ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {
                    row.map((transaction) => (
                    <TableRow key={transaction.date}>
                      <TableCell component="th" scope="row">
                        {transaction.date}
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell align="right">{transaction.quantity}</TableCell>
                      <TableCell align="right">$ {transaction.price}</TableCell>
                      <TableCell align="right">${transaction.total}</TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>

  )

}
export default function HoldingsTable(props) {
  return (
    <Paper className="holdingsTable">
      <Typography style={{display: 'inline-block'}} variant="h4">Holdings</Typography>
      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell align="right">Weight (%)</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Book Value</TableCell>
              <TableCell align="right">Market Value</TableCell>
              <TableCell align="right">Unrealized P&L</TableCell>
              <TableCell align="right">Avg Cost</TableCell>
              <TableCell align="right">Last Close</TableCell>
              <TableCell align="right">P&L Day</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row) => (
              <Row key={row.ticker} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}