import React from 'react';
import { getStore } from './redux';
import { Provider } from 'react-redux';
import { Container, AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import ToDoManager from './pages/todo-manager';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { BrowserRouter as Router } from 'react-router-dom';

const myStore = getStore();

/**
 * Main app component. Hooks up the Redux store and provides the app bar. The main app logic is all handled
 * within the ToDoManager.
 */
export default function App() {

  const classes = useStyles();

  return (
    <Provider store={myStore}>
      <Router>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
              <EventAvailableIcon fontSize="large" className={classes.icon} />
              <Typography variant="h6">Organize My Life</Typography>
            </Toolbar>
          </AppBar>
          <Container fixed>
            <ToDoManager />
          </Container>
        </MuiPickersUtilsProvider>
      </Router>
    </Provider>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1)
  },
  appBar: {
    marginBottom: '20px'
  }
}));