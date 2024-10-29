//Problem Statement: Shopping List Application
//Create a shopping list application that allows users to:

//Add items with quantity and category
//Filter items by category
//  Mark items as purchased
//Show statistics about purchased vs pending items
//Delete items from the list
//Edit existing items

import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ShoppingService } from './shoppingService';
import { ShoppingItem } from './shopping-list-types';
@Component({
    standalone: true,
    selector: 'shopping-list',
    imports: [FormsModule, CommonModule, HttpClientModule],
    template: `
        <!-- Same template as before but with loading status -->
        <!-- Main Container -->
        <div class="shopping-container">
            <!-- Header with Statistics -->
            @if (isLoading) {
                <div class="loading-spinner">Loading...</div>
            }
            <!-- Error Message -->
            @if (error) {
                <div class="error-message">{{ errorMessage }}
                    <button (click)="loadItems()">Retry</button>
                </div>
            }
                <header class="header">
                <h1>My Shopping List</h1>
                <div class="stats">
                    <p>Total Items: {{ items.length }}</p>
                    <p>Purchased: {{ getPurchasedCount() }}</p>
                    <p>Remaining: {{ items.length - getPurchasedCount() }}</p>
                </div>
            </header>

            <!-- Add New Item Form -->
            @if (isAddingItem) {
                <div class="add-item-form">
                    <input
                        type="text"
                        [(ngModel)]="newItem.name"
                        placeholder="Item name"
                    >
                    <input
                        type="number"
                        [(ngModel)]="newItem.quantity"
                        placeholder="Quantity"
                        min="1"
                    >
                    <select [(ngModel)]="newItem.category">
                        <option value="grocery">Grocery</option>
                        <option value="household">Household</option>
                        <option value="electronics">Electronics</option>
                        <option value="other">Other</option>
                    </select>
                    <button (click)="addItem()">Add Item</button>
                    <button (click)="cancelAdd()">Cancel</button>
                </div>
            } @else {
                <button (click)="startAddingItem()" class="add-button">
                    Add New Item
                </button>
            }

            <!-- Category Filter -->
            <div class="filter-section">
                <label>Filter by Category:</label>
                <select [(ngModel)]="selectedCategory">
                    <option value="all">All Categories</option>
                    <option value="grocery">Grocery</option>
                    <option value="household">Household</option>
                    <option value="electronics">Electronics</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <!-- Shopping List -->
            <div class="shopping-list">
                @if (getFilteredItems().length === 0) {
                    <p class="empty-message">No items found</p>
                } @else {
                    @for (item of getFilteredItems(); track item.id) {
                        <div class="item-card" [class.purchased]="item.isPurchased">
                            @if (editingItemId === item.id) {
                                <!-- Edit Mode -->
                                <div class="edit-mode">
                                    <input
                                        type="text"
                                        [(ngModel)]="editingItem.name"
                                        placeholder="Item name"
                                    >
                                    <input
                                        type="number"
                                        [(ngModel)]="editingItem.quantity"
                                        placeholder="Quantity"
                                        min="1"
                                    >
                                    <select [(ngModel)]="editingItem.category">
                                        <option value="grocery">Grocery</option>
                                        <option value="household">Household</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <button (click)="saveEdit(item.id)">Save</button>
                                    <button (click)="cancelEdit()">Cancel</button>
                                </div>
                            } @else {
                                <!-- View Mode -->
                                <div class="item-info">
                                    <h3>{{ item.name }}</h3>
                                    <p>Quantity: {{ item.quantity }}</p>
                                    <p>Category: {{ item.category }}</p>
                                </div>
                                <div class="item-actions">
                                    <input
                                        type="checkbox"
                                        [checked]="item.isPurchased"
                                        (change)="togglePurchased(item.id)"
                                    >
                                    <button (click)="startEdit(item)">Edit</button>
                                    <button (click)="deleteItem(item.id)">Delete</button>
                                </div>
                            }
                        </div>
                    }
                }
            </div>
        </div>
    `,
    styles: `

        .loading-spinner {
            text-align: center;
            font-size: 1.5em;
            margin: 20px;
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
        }
        .error-message {
            text-align: center;
            font-size: 1.5em;
            margin: 20px;
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
        }
        .shopping-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }

        .header {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .stats {
            display: flex;
            gap: 20px;
            margin-top: 10px;
        }

        .add-item-form {
            display: grid;
            gap: 10px;
            margin: 20px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
        }

        .filter-section {
            margin: 20px 0;
        }

        .item-card {
            padding: 15px;
            border: 1px solid #ddd;
            margin: 10px 0;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .purchased {
            background-color: #e8f5e9;
            opacity: 0.8;
        }

        .item-info {
            flex: 1;
        }

        .item-actions {
            display: flex;
            gap: 10px;
        }

        .edit-mode {
            display: grid;
            gap: 10px;
            width: 100%;
        }

        button {
            padding: 8px 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover {
            background-color: #0056b3;
        }

        .add-button {
            width: 100%;
            padding: 15px;
            font-size: 1.1em;
        }

        .empty-message {
            text-align: center;
            color: #666;
            padding: 20px;
        }
    `
})
export class ShoppingListComponent implements OnInit {
    // State management
    items: ShoppingItem[] = [   ];
    isLoading = false;
    errorMessage = '';
    selectedCategory = 'all';
    editingItem: Partial<ShoppingItem> ={}
    editingItemId: number | null = null;
    isAddingItem = false;
    error = false;

    newItem: Partial<ShoppingItem> = {
        name: '',
        quantity: 1,
        category: 'other',
        isPurchased: false
    };

    constructor(private shoppingService: ShoppingService) {}

    ngOnInit(): void {
        this.loadItems();
    }
    cancelAdd(): void {
        this.isAddingItem = false;
        this.resetNewItem();
    }
    startAddingItem(): void {
        this.isAddingItem = true;
    }
    startEdit(item: ShoppingItem): void {
        this.editingItem = {...item};
        this.editingItemId = item.id;
    }

    loadItems(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.shoppingService.getItems().subscribe({
            next: (items) => {
                this.items = items;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load items. Please try again later.';
                this.isLoading = false;
            }
        })
    }

    addItem(): void {
        if (!this.newItem.name || !this.newItem.quantity) return;
        this.isLoading = true;
        this.shoppingService.addItem(this.newItem as Omit<ShoppingItem, 'id'>).subscribe({
            next: (item) => {
                this.items.push(item);
                this.isLoading = false;
                this.isAddingItem = false;
                this.resetNewItem();
            },
            error: (error) => {
                this.errorMessage = 'Failed to add item. Please try again later.';
                this.error = true;
                this.isLoading = false;
            }
        })
    }
    resetNewItem(): void {
        this.newItem = { name: '', quantity: 1, category: 'other', isPurchased: false };
    }
    cancelEdit(): void {
        this.editingItem = {};
        this.editingItemId = null;
    }

    saveEdit(id: number): void {
        if (!this.editingItem.name || !this.editingItem.quantity) return;
    this.isLoading = true;
    this.shoppingService.updateItem(this.editingItem as ShoppingItem).subscribe({
        next: (item) => {
            this.items = this.items.map(existingItem => 
                existingItem.id === id ? item : existingItem
            );
            this.isLoading = false;
            this.cancelEdit();
        },
        error: (error) => {
            this.errorMessage = 'Failed to update item. Please try again later.';
            this.error = true;
            this.isLoading = false;
        }
    })
}
getPurchasedCount(): number {
    return this.items.filter(item => item.isPurchased).length;
}

    deleteItem(id: number): void {
        this.isLoading = true;
        this.shoppingService.deleteItem(id).subscribe({
            next: () => {
                this.items = this.items.filter(item => item.id !== id);
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to delete item. Please try again later.';
                this.error = true;
                this.isLoading = false;
            }
        })
    }

    togglePurchased(id: number): void {
        const item = this.items.find(item => item.id === id);
        if (!item) {
            return
        }
        this.isLoading = true;
        this.shoppingService.updatePurchasedStatus(id, !item.isPurchased).subscribe({
            next: () => {
                const index = this.items.findIndex(item => item.id === id);
                if (index !== -1) {
                    this.items[index].isPurchased = !item.isPurchased;
                }
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to update purchased status. Please try again later.';
                this.isLoading = false;
                this.error = true;
            }
        })
    }

    getFilteredItems(): ShoppingItem[] {
        if(this.selectedCategory === 'all') {
            return this.items;
        }
        return this.items.filter(item => item.category === this.selectedCategory);
    }
}