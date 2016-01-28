/*
  Add Fish Form
  <AddFishForm />
*/
import React from 'react';

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

export default AddFishForm;
