//Problem Statement: Shopping List Application
//Create a shopping list application that allows users to:

//Add items with quantity and category
//Filter items by category
//  Mark items as purchased
//Show statistics about purchased vs pending items
//Delete items from the list
//Edit existing items
export interface ShoppingItem {
    id: number;
    name: string;
    quantity: number;
    category: 'grocery' | 'household' | 'electronics' | 'other';
    isPurchased: boolean;
}