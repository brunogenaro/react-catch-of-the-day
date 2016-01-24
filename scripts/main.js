let React = require('react');
let ReactDOM = require('react-dom');

let ReactRouter = require('react-router');
let Router = ReactRouter.Router;
let Route = ReactRouter.Route;
let Navigation = ReactRouter.Navigation;
let History = ReactRouter.History;
let createBrowserHistory = require('history/lib/createBrowserHistory');

let h = require('./helpers');

/*
    App
*/
let App = React.createClass({
  render: function() {
    return (
        <div className="catch-of-the-day">
            <div className="menu">
                <Header tagline="Fresh Seafood Good" />
            </div>
            <Order/>
            <Inventory/>
        </div>
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
  render: function() {
    return (
        <p>Order</p>
    )
  }
});

/*
    Inventory
*/
let Inventory = React.createClass({
  render: function() {
    return (
        <p>Inventory</p>
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