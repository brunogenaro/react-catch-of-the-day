/*
    Store Picker
    This will let us make <StorePicker/>
*/
import React from 'react';
import { History } from 'react-router';
import h from '../helpers';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

@autobind
class StorePicker extends React.Component {
  mixins: [History]

  goToStore(e) {
    e.preventDefault();

    let storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId);
  }

  render() {
    let name = "bruno";
    return (
        <form className="store-selector" onSubmit={this.goToStore}>
            <h2>Please enter a store {name}</h2>
            <input type="text" defaultValue={h.getFunName()} ref="storeId"/>
            <input type="Submit"/>
        </form>
    )
  }
}

reactMixin.onClass(StorePicker, History);

export default StorePicker;
