import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError } from "rxjs";
import { ShoppingItem } from "./shopping-list-types";
import { throwError } from "rxjs";  // Import throwError for error handling

@Injectable({
    providedIn: 'root'
})
export class ShoppingService {
    private apiUrl = "http://localhost:8080/api/shopping";

    constructor(private http: HttpClient) {}

    // Fetch all items
    getItems(): Observable<ShoppingItem[]> {
        return this.http.get<ShoppingItem[]>(`${this.apiUrl}/items`).pipe(
            catchError(this.handleError)  // Add error handling
        );
    }

    // Fetch items by category
    getItemsByCategory(category: string): Observable<ShoppingItem[]> {
        return this.http.get<ShoppingItem[]>(`${this.apiUrl}/items/category/${category}`).pipe(
            catchError(this.handleError)  // Add error handling
        );
    }

    // Post new item
    addItem(item: Omit<ShoppingItem, 'id'>): Observable<ShoppingItem> {
        return this.http.post<ShoppingItem>(`${this.apiUrl}/items`, item).pipe(
            catchError(this.handleError)  // Add error handling
        );
    }

    // PUT update item
    updateItem(item: ShoppingItem): Observable<ShoppingItem> {
        return this.http.put<ShoppingItem>(`${this.apiUrl}/items/${item.id}`, item).pipe(
            catchError(this.handleError)  // Add error handling
        );
    }

    // DELETE item
    deleteItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/items/${id}`).pipe(
            catchError(this.handleError)  // Add error handling
        );
    }

    // Update purchased status
    updatePurchasedStatus(id: number, isPurchased: boolean): Observable<ShoppingItem> {
        return this.http.patch<ShoppingItem>(`${this.apiUrl}/items/${id}/purchasedStatus`, { isPurchased }).pipe(
            catchError(this.handleError)  // Add error handling
        );
    }

    // Handle error function
    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);  // Log the error to the console
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }
}