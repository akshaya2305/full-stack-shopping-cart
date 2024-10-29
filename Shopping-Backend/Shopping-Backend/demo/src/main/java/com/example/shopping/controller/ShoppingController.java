package com.example.shopping.controller;

import com.example.shopping.model.ShoppingItem;
import com.example.shopping.repository.ShoppingItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shopping")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular dev server
public class ShoppingController {

    @Autowired
    private ShoppingItemRepository repository;

    // GET all items
    @GetMapping("/items")
    public List<ShoppingItem> getAllItems() {
        return repository.findAll();
    }

    // GET items by category
    @GetMapping("/items/category/{category}")
    public List<ShoppingItem> getItemsByCategory(@PathVariable String category) {
        return repository.findByCategory(category);
    }

    // POST new item
    @PostMapping("/items")
    public ShoppingItem createItem(@RequestBody ShoppingItem item) {
        return repository.save(item);
    }

    // PUT update item
    @PutMapping("/items/{id}")
    public ResponseEntity<ShoppingItem> updateItem(
            @PathVariable Long id,
            @RequestBody ShoppingItem itemDetails
    ) {
        ShoppingItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        item.setName(itemDetails.getName());
        item.setQuantity(itemDetails.getQuantity());
        item.setCategory(itemDetails.getCategory());
        item.setIsPurchased(itemDetails.getIsPurchased());
        
        return ResponseEntity.ok(repository.save(item));
    }

    // DELETE item
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        ShoppingItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        repository.delete(item);
        return ResponseEntity.ok().build();
    }

    // PATCH update purchase status
    @PatchMapping("/items/{id}/purchase-status")
    public ResponseEntity<ShoppingItem> updatePurchaseStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> status
    ) {
        ShoppingItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        item.setIsPurchased(status.get("isPurchased"));
        return ResponseEntity.ok(repository.save(item));
    }
}
