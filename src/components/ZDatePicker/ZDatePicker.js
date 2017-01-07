import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import DatePicker from 'material-ui/DatePicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import s from './ZDatePicker.css';
import muiTheme from '../../core/mui';
import fetch from '../../core/fetch';

// const DatePicker = require('react-datepicker');
const moment = require('moment');

const ZDatePicker = React.createClass({
  getInitialState: function() {
    return {
      endDate: new Date(),
      clientEmail: '',
    };
  },

  handleDateChange: function(date) {
    this.setState({
      endDate: date,
    });
  },

  handleEmailChange: function(event) {
    this.setState({
      clientEmail: event.target.value,
    });
  },

  determineAddBtnDisability: function() {
    return !this.state.endDate || !this.state.clientEmail;
  },

  addEvent: async function() {
    const user = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation {createUserEvent(event:${event}){id,email,events{clientEmail}}}`,
        variables: {
          event: {
            endDate: this.state.endDate,
            clientEmail: this.state.clientEmail,
          }
        }
      }),
      credentials: 'include',
    });

    console.log(user);
  },

  render: function() {
    return (
      <div className={s['react-datepicker_container']}>

        <div className={s['react-datepicker_inline_block']}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <DatePicker
              hintText="Select an end-date"
              container="inline"
              onChange={this.handleDateChange}
              defaultDate={this.state.endDate}
            />
          </MuiThemeProvider>
        </div>
        <input
          type="email"
          className={s['react-datepicker_input']}
          onChange={this.handleEmailChange}
          value={this.state.clientEmail}
          placeholder="Client email"
        />

        <button
          className={s['react-datepicker_add_button']}
          onClick={this.addEvent}
          disabled={this.determineAddBtnDisability()}>
          Add
        </button>
      </div>
    );
  },
});

export default withStyles(s)(ZDatePicker);
