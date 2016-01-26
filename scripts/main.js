let React = require('react');
let ReactDOM = require('react-dom');

let ReactRouter = require('react-router');
let Router = ReactRouter.Router;
let Route = ReactRouter.Route;
let Navigation = ReactRouter.Navigation;
let History = ReactRouter.History;
let createBrowserHistory = require('history/lib/createBrowserHistory');

let h = require('./helpers');

// Firebase
let Rebase = require('re-base');
let base = Rebase.createClass('https://reactjs-cotd.firebaseio.com/');

let Catalyst = require('react-catalyst');

/*
    App
*/
let App = React.createClass({
  mixins: [Catalyst.LinkedStateMixin],
  getInitialState: function() {
      return {
        fishes: {},
        order: {}
      }
  },
  componentDidMount: function() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });

    let localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  },
  componentWillUpdate: function(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  },
  addToOrder: function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order: this.state.order });
  },
  removeFromOrder: function(key) {
    delete this.state.order[key];
    this.setState({ order: this.state.order });
  },
  addFish: function(fish) {
    let uniqueKey = (new Date()).getTime();

    // update the state object
    this.state.fishes['fish-' + uniqueKey] = fish;

    // set the state
    this.setState({ fishes: this.state.fishes });
    return;
  },
  removeFish: function(key) {
    if (confirm("Are you sure you want to remove this fish?")) {
      this.state.fishes[key] = null;
      this.setState({ fishes: this.state.fishes });
    }
  },
  loadSamples: function() {
    this.setState({
      fishes: require('./sample-fishes')
    });
  },
  renderFish: function(key) {
    return (
      <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
    )
  },
  render: function() {
    return (
        <div className="catch-of-the-day">
            <div className="menu">
                <Header tagline="Fresh Seafood Good" />
                <ul className="list-of-fishes">
                  {Object.keys(this.state.fishes).map(this.renderFish)}
                </ul>
            </div>
            <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
            <Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState} removeFish={this.removeFish} />
        </div>
    )
  }
});

/* Fish
  <Fish />
*/
let Fish = React.createClass({
  onButtonClick: function() {
    this.props.addToOrder(this.props.index);
  },
  render: function() {
    let details = this.props.details;
    let isAvailable = (details.status === 'available' ? true : false);
    let buttonText = (isAvailable ? 'Add to Order' : 'Soult Out!');
    return (
      <li className="menu-fish">
        <img src={details.image} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    )
  }
});

/*
  Add Fish Form
  <AddFishForm />
*/
let AddFishForm = React.createClass({
  createFish:  function(e) {
    e.preventDefault();

    let refs = this.refs;

    // get data from the form
    let fish = {
      name: refs.name.value,
      price: refs.price.value,
      status: refs.status.value,
      desc: refs.desc.value,
      image: refs.image.value
    };

    // Add Fish to the App State
    this.props.addFish(fish);
    this.refs.fishForm.reset();
  },
  render: function() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fist Name" />
        <input type="text" ref="price" placeholder="Fish Name" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to image" />
        <button type="submit">+ Add Item </button>
      </form>
     )
  }
});

/*
    Header
*/
let Header = React.createClass({
  render: function() {
    return (
        <header className="top">
            <h1>Catch
              <span className="ofThe">
                <span className="of">of</span>
                <span className="the">the</span>
              </span>
              Day
            </h1>
            <h3 className="tagline"><span>{this.props.tagline}</span></h3>
        </header>
    )
  }
});

/*
    Order
*/
let Order = React.createClass({
  renderOrder: function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={this.props.removeFromOrder.bind(null, key)}>&times;</button>

    if (!fish) {
      return <li key={key}>Sorry, fish no longer available! {removeButton}</li>
    }

    return (
      <li key={key}>
        {count}lbs
        {fish.name}
        <span className="price">{h.formatPrice(count * fish.price)}</span>
        {removeButton}
      </li>
    )
  },
  render: function() {
    let orderIds = Object.keys(this.props.order);
    let total = orderIds.reduce((prevTotal, key) => {
      let fish = this.props.fishes[key];
      let count = this.props.order[key];
      let isAvailable = fish && fish.status === 'available';

      if (fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);
    return (
        <div className="order-wrap">
          <h2 className="order-title">Your Order</h2>
            <ul className="order">
              {orderIds.map(this.renderOrder)}
              <li className="total">
                <strong>Total:</strong>
                {h.formatPrice(total)}
              </li>
            </ul>
        </div>
    )
  }
});

/*
    Inventory
*/
let Inventory = React.createClass({
  renderInventory: function(key) {
    var linkState = this.props.linkState;

    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState('fishes.'+ key +'.name')} />
        <input type="text" valueLink={linkState('fishes.'+ key +'.price')} />

        <select valueLink={linkState('fishes.'+ key +'.status')}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>

        <textarea type="text" valueLink={linkState('fishes.'+ key +'.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.'+ key +'.image')} />

        <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>

      </div>
    )
  },
  render: function() {
    return (
      <div>
        <h2>Inventory</h2>

        {Object.keys(this.props.fishes).map(this.renderInventory)}

        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
});

/*
    Store Picker
    This will let us make <StorePicker/>
*/

let StorePicker = React.createClass({
  mixins: [History],
  goToStore: function(e) {
    e.preventDefault();

    let storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId);
  },
  render: function() {
    let name = "bruno";
    return (
        <form className="store-selector" onSubmit={this.goToStore}>
            <h2>Please enter a store {name}</h2>
            <input type="text" defaultValue={h.getFunName()} ref="storeId"/>
            <input type="Submit"/>
        </form>
    )
  }
});

/*
  Not Found
*/
let NotFound = React.createClass({
  render: function() {
    return <h1>Not Found!!</h1>
  }
});

/*
  Routes
*/
let routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
