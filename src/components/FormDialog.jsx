import React from "react";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
const transactionTypes = ['BUY', 'SELL', 'DEPOSIT', 'WITHDRAWAL', 'DIVIDEND', 'FEE'];

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const [transaction, setTransaction] = React.useState({
    date: new Date(),
    ticker: "",
    tType: "",
    quantity: "",
    price: ""
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (selectedDate) => {
    setTransaction((prev) => {
      return {
        ...prev,
        date: selectedDate
      }
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setTransaction(prevValue => {
      return {
        ...prevValue,
        [name]: value
      };
    });
  }

  const handleSubmit = async () => {
    transaction.date = transaction.date.toLocaleDateString();
    
    await fetch('/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    // const body = await response.text();
    // // setState({ responseToPost: body });
    
    // // handleClose(props.handleAddTransaction(transaction));
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen} style={{ float: 'right' }} aria-label="add">
        <PlaylistAddIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle>Add a Transaction</DialogTitle>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <DialogContent>
            <DialogContentText>
              To add a transaction, please enter all the following details. Your holdings will automatically update.
          </DialogContentText>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                style={{ display: 'block' }}
                inputVariant="outlined"
                format="MM/dd/yyyy"
                margin="dense"
                label="Transaction Date"
                name="date"
                onChange={handleDateChange}
                value={transaction.date}
                maxDate={new Date()}
                fullWidth
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              style={{ display: 'block' }}
              required
              name="ticker"
              value={transaction.ticker}
              onChange={handleChange}
              label="Ticker"
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              required
              select
              name="tType"
              value={transaction.tType}
              label="Transaction Type"
              margin="dense"
              onChange={handleChange}
              variant="outlined"
              fullWidth
            >
              {transactionTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              name="quantity"
              value={transaction.quantity}
              onChange={handleChange}
              label="Quantity"
              type="number"
              margin="dense"
              variant="outlined"
              InputProps={{ inputProps: { min: 1 } }}
              fullWidth
            />
            <TextField
              required
              name="price"
              value={transaction.price}
              onChange={handleChange}
              label="Price ($)"
              type="number"
              margin="dense"
              variant="outlined"
              InputProps={{ inputProps: { step: '0.01', placeholder: '0.00' } }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>

      </Dialog>
    </React.Fragment>
  )
}

