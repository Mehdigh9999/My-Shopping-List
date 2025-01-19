    const products = [
        { id: 0, name: "Juice Box", price: 10, stock: 10 },
        { id: 1, name: "Biscuits", price: 20, stock: 15 },
        { id: 2, name: "Coffee Mug", price: 15, stock: 8 },
        { id: 3, name: "Gift Card", price: 25, stock: 5 }
    ];
    // Cart data
    const cart = new Map(); // Stores item name and quantity
    const cartElements = new Map(); // Stores itemId and corresponding DOM elements
    // DOM Elements
    const checkOutBtn = document.getElementById('checkout');
    const productsContainer = document.getElementById("product-list");
    const cartItems = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const confirmationModal = document.getElementById("confirmation-modal");
    let confirmDeleteBtn = document.getElementById("confirm-delete");
    const cancelDeleteBtn = document.getElementById("cancel");
    //event listeners
    document.querySelectorAll('.add-to-cart').forEach((button, index) => {
        button.addEventListener('click', function () {
            addToCartHandler(button, index);
        });
    });
    
    // Function to handle adding products to cart
    function addToCartHandler(button, index) {
        let product = products[index];
        let { id: productId, name: productName, price: productPrice, stock: productStock } = product;
    
        let requestedNum;
        while (true) {
            requestedNum = prompt(`How many ${productName} would you like to add?`);
    
            if (requestedNum === null) break; // User canceled => break the loop
            requestedNum = requestedNum.trim();
    
            if (!/^\d+$/.test(requestedNum)) {
                alert("Invalid input. Please enter a valid positive integer.");
                continue;
            }
    
            let num = Number(requestedNum);
            if (num > 0 && num <= productStock) {
                product.stock -= num;
                addToUserList(productName, num);
                updateCart(productId, productName);
                break;
            } else {
                alert(`Invalid input. Please enter a number ≤ ${productStock}.`);
            }
        }
    }
    
    function addToUserList(itemName, requestedAmount) {
        cart.set(itemName, (cart.get(itemName) || 0) + Number(requestedAmount));
    }
    
    function updateCart(itemId, productName) {
        let elId = `id${itemId}`;
        let newList = document.createElement('li');
        newList.id = elId;
        newList.className = 'items';
        newList.dataset.id = itemId;
        newList.textContent = `${productName} Number: ${cart.get(productName)}`;
    
        if (cart.size !== 0 && cartElements.has(itemId) && cart.get(productName) !== 0) {
            document.getElementById(elId).textContent = `${productName} Number: ${cart.get(productName)}`;
        } else if (cart.size !== 0 && !cartElements.has(itemId) && Number(cart.get(productName)) !== 0) {
            cartElements.set(itemId, newList);
            cartItems.appendChild(newList);
            addListener(newList);
        }
    }
    
    function addListener(item) {
        item.addEventListener('click', function () {
            deleteConfirmHandling(item.dataset.id);
        });
    }
    
    function toggleConfirmBox() {
        document.querySelector('.modal').classList.toggle('modal-visible');
    }
    
    function deleteConfirmHandling(itemId) {
        const itemName = products.find(p => p.id == itemId)?.name;
        if (!itemName) return console.error("Item not found!");
    
        toggleConfirmBox();
        
        cancelDeleteBtn.addEventListener('click', toggleConfirmBox);
    
        // Remove old event listeners before adding a new one
        confirmDeleteBtn.replaceWith(confirmDeleteBtn.cloneNode(true));
        confirmDeleteBtn = document.getElementById("confirm-delete");
    
        confirmDeleteBtn.addEventListener('click', () => {
            deleteItem(Number(itemId));
        });
    }
    
    function deleteItem(itemId) {
        let product = products.find(p => p.id === itemId);
        if (!product) return console.error("Product not found!");
        let itemName = product.name;
        let requestedAmount = cart.get(itemName);
    
        if (!requestedAmount) return console.warn("No item found in cart.");
    
        cart.delete(itemName);
        product.stock += Number(requestedAmount);
    
        console.log(`Deleted: ${itemName} (Amount: ${requestedAmount})`);
        toggleConfirmBox();
        cartElements.delete(Number(itemId));
    
        let element = document.getElementById(`id${itemId}`);
        if (element) element.remove();
    }
    
    function counter() {
        let totalNumber = 0;
        let totalPrice = 0;
    
        cart.forEach((value, key) => {
            const itemPrice = products.find(p => p.name === key)?.price || 0; // Ensure itemPrice is valid
            totalNumber += Number(value);
            totalPrice += value * itemPrice; // FIXED: Correct price calculation
        });
    
        totalPriceElement.innerHTML = `${totalPrice.toFixed(2)}`; // Ensures proper decimal formatting
    }

    checkOutBtn.addEventListener('click', counter);