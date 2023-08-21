// Import the React modules for using state and effect.
import { useState, useEffect } from 'react'

// Import the default styles module. Edit this CSS file, or use a new one, to
// define your own application styles.
import styles from '../styles/Home.module.css'

// Import the Supabase client from utils.
import { supabase } from '../utils/supabaseConnection';

export default function ShoppingList() {
    // Establish the state variables.
    const [newShoppingItem, setNewShoppingItem] = useState('');
    const [shoppingListItems, setShoppingListItems] = useState([]);

    // Have the app fetch the shopping list on load.
    useEffect(() => {
        fetchShoppingList()
    }, [])

    // Retrieve the shopping list items.
    const fetchShoppingList = async () => {
        // Clear the shopping list first.
        setShoppingListItems([]);

        // Execute a Supabase query to fetch the shopping list.
        try {
            // Select all items that have not been marked purchased.
            let { data, error } = await supabase
                .from('shopping_list')
                .select('*')
                .eq('checked', 'false');

            // Handle any errors.
            if (error) { throw error }

            // Upon a successful response, update the shopping list.
            if (data) {
                setShoppingListItems(data);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Mark an item as purchased.
    const markItemPurchased = async (itemId, doMarkPurchased) => {
        try {
            // Update the record with the appropriate item ID.
            let { data, error } = await supabase
                .from('shopping_list')
                .update({ checked: doMarkPurchased })
                .match({ id: itemId });

            // Handle any errors.
            if (error) { throw error }

            if (data) {
                console.log(data);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Add a new item to the shopping list.
    const addNewShoppingItem = async () => {
        try {
            // Insert the new item, providing the item name. The rest gets
            // filled in automatically.
            let { data, error } = await supabase
                .from('shopping_list')
                .insert({ item: newShoppingItem });

            // Handle any errors.
            if (error) { throw error }

            // Upon success, update the shopping list.
            if (data) {
                console.log(data);

                fetchShoppingList();
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Process the shopping list and render the HTML for each item.
    const renderShoppingList = (shoppingList) => {
        if (shoppingList.length > 0) {
            return (shoppingList.map((item) => {
                const itemStatusCheckbox = <input type="checkbox" onChange={ (e) => markItemPurchased(item.id, e.target.checked) } />
                return (
                    <div key={"item-" + item.id} className={styles.card}>
                        <strong>{item.item}</strong>
                        {itemStatusCheckbox}
                    </div>
                );
            }))
        } else {
            return (
                <div className={styles.card}>
                    <strong>No items!</strong>
                </div>
            );
        }
    }

    // Render the ShoppingList component display.
    return (
        <div className={styles.grid}>
            <div>
                {renderShoppingList(shoppingListItems)}
            </div>
            <div>
                <div className={styles.card}>
                    <h2>Add New Item</h2>
                    <p>
                        <input type="text" onChange={ (e) => { setNewShoppingItem(e.target.value) } } />
                        <button onClick={addNewShoppingItem}>Add</button>
                    </p>
                </div>
            </div>
        </div>
    )
}
