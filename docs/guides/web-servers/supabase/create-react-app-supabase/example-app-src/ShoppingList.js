// Import the React modules for building the component.
import React, { Component } from 'react';

// Import the Supabase client from utils.
import { supabase } from './utils'

class ShoppingList extends Component {
    // Establish the components state variables.
    state = {
        newShoppingItem: '',
        shoppingListItems: []
    }

    // Have the component fetch a fresh shopping list on load.
    componentDidMount() {
        this.fetchShoppingList();
    }

    // Retrieve the shopping list items.
    fetchShoppingList = async () => {
        // Clear the list as represented in the state.
        this.setState({
            ...this.state,
            shoppingListItems: []
        });

        // Execute a query via the Supabase client to fetch the shopping list.
        // For this example, the list excludes any items already marked
        // "purchased" (checked = true).
        try {
            let { data, error } = await supabase
                .from('shopping_list')
                .select('*')
                .eq('checked', 'false');

            if (error) { throw error }

            if (data) {
                this.setState({
                    ...this.state,
                    shoppingListItems: data
                });
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Mark an item as purchased.
    markItemPurchased = async (itemId, doMarkPurchased) => {
        // Call to the backend to update the item record.
        try {
            let { data, error } = await supabase
                .from('shopping_list')
                .update({ checked: doMarkPurchased })
                .match({ id: itemId });

            if (error) { throw error }

            if (data) {
                console.log(data);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Add a new item to the shopping list.
    addNewItem = async () => {
        // Have the backend insert a new record with the given item name.
        try {
            let { data, error } = await supabase
                .from('shopping_list')
                .insert({ item: this.state.newItemName });

            if (error) { throw error }

            if (data) {
                console.log(data);

                // Create an updated version of the shopping list, adding the
                // new item to it.
                const updatedShoppingList = this.state.shoppingListItems;
                updatedShoppingList.push(data[0])

                // Update the application state with the updated list.
                this.setState({
                    ...this.state,
                    shoppingListItems: updatedShoppingList
                });
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Process a shopping and render it to HTML.
    renderShoppingList = (shoppingList) => {
        if (shoppingList.length > 0) {
            return (shoppingList.map((item) => {
                const itemStatusCheckbox = <input type="checkbox" onChange={ (e) => this.markItemPurchased(item.id, e.target.checked) } />
                return (
                    <div className="shoppingListContainer">
                        <strong>{item.item}</strong>
                        {itemStatusCheckbox}
                    </div>
                );
            }))
        } else {
            return (<div><strong>No items!</strong></div>)
        }
    }

    // Render the ShoppingList component display.
    render () {
        return (
            <div>
                <div style={{ display: 'grid', columnGap: '.5em', rowGap: '1em', padding: '3em' }}>
                    <div style={{ gridColumnStart: 1, gridColumnEnd: 2 }}>
                        <h2>Shopping List</h2>
                        <div>{ this.renderShoppingList(this.state.shoppingListItems) }</div>
                    </div>
                </div>
                <div style={{ width: '50%', margin: 'auto' }}>
                    <h2>Add New Item</h2>
                    <div>
                        <input type="text" onChange={ (e) => { this.setState({ ...this.state, newItemName: e.target.value }) } } />
                        <button onClick={this.addNewItem}>Add</button>
                    </div>
                </div>
            </div>
        )
    }
}

// Have the class exported. The export then gets used in App.js.
export default ShoppingList;

