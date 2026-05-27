let foods = JSON.parse(localStorage.getItem("foods")) || [];
console.log("JS is working 🚀");
alert("JS is connected 🚀");
if (foods.length === 0) {
    foods = [
        { id: 1, name: "Pizza", price: 450, image: "pizza.jpg", category: "food" },
        { id: 2, name: "Burger", price: 500, image: "burger.jpg", category: "food" },
        { id: 3, name: "Pasta", price: 300, image: "pasta.jpg", category: "food" },
        { id: 4, name: "Macaroni", price: 250, image: "macoron.jpg", category: "food" },
        { id: 5, name: "Chicken Wrap", price: 350, image: "chicken wrap.jpg", category: "food" },
        { id: 6, name: "Ice Cream", price: 150, image: "icecream.jpg", category: "dessert" },
        { id: 7, name: "Coffee", price: 100, image: "coffee.jpg", category: "drink" }
    ];

    localStorage.setItem("foods", JSON.stringify(foods));
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================= CART ================= */

function addToCart(id) {
    let food = foods.find(f => f.id === id);
    if (!food) return;

    let existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            quantity: 1
        });
    }

    saveCart();
    updateCart();
showToast("Added to cart 🛒");  

document.querySelector(".cart").classList.add("active");
}

function removeItem(id) {
    let item = cart.find(i => i.id === id);

    if (item) {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }

    saveCart();
    updateCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function saveFoods() {
    localStorage.setItem("foods", JSON.stringify(foods));
}

/* ================= CART UI ================= */

function updateCart() {
    let cartList = document.getElementById("cart-items");
    let totalEl = document.getElementById("total");

    if (!cartList || !totalEl) return;

    if (cart.length === 0) {
        cartList.innerHTML = `
            <p style="text-align:center; color:#888;">
                🛒 Your cart is empty
            </p>
        `;
        totalEl.textContent = 0;
        return;
    }

    cartList.innerHTML = "";

    let total = 0;

    cart.forEach((item) => {
        let li = document.createElement("li");

        li.innerHTML = `
            ${item.name} x${item.quantity} - ${item.price * item.quantity} Birr
            <button onclick="removeItem(${item.id})">❌</button>
        `;

        cartList.appendChild(li);

        total += item.price * item.quantity;
    });

    totalEl.textContent = total;
}

/* ================= CHECKOUT ================= */

function placeOrder() {
    let message = document.getElementById("message");

    if (cart.length === 0) {
        message.textContent = "Your cart is empty 😅";
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
        items: cart,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    saveCart();
    updateCart();

   let modal = document.getElementById("orderModal");
let summary = document.getElementById("orderSummary");

cart = [];
saveCart();
updateCart();

let itemsText = cart.map(item =>
    `${item.name} x${item.quantity}`
).join(", ");

summary.textContent = "You ordered: " + itemsText;

modal.style.display = "flex"; 

}
/* ================= DARK MODE ================= */

function toggleDarkMode() {
    document.body.classList.toggle("dark");

    let btn = document.getElementById("darkBtn");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("dark", "on");

        if (btn) {
            btn.textContent = "☀️ Light Mode";
        }

    } else {
        localStorage.setItem("dark", "off");

        if (btn) {
            btn.textContent = "🌙 Dark Mode";
        }
    }
}

window.onload = function () {

    // DARK MODE
    let btn = document.getElementById("darkBtn");

    if (localStorage.getItem("dark") === "on") {
        document.body.classList.add("dark");

        if (btn) {
            btn.textContent = "☀️ Light Mode";
        }
    }

    renderFoods();
    updateCart();

    // USER NAME
    let user = localStorage.getItem("user");

    if (user) {
        let userDisplay = document.getElementById("userDisplay");

if (userDisplay) {
    userDisplay.textContent = "👋 " + user;
}
};


/* ================= ADMIN ================= */

function addFood() {
    let name = document.getElementById("foodName").value;
    let price = Number(document.getElementById("foodPrice").value);
    let image = document.getElementById("foodImage").value;
    let category = document.getElementById("foodCategory").value;

    if (!name || !image || isNaN(price) || price <= 0) {
        alert("Please fill all fields correctly 😅");
        return;
    }

    let food = {
        id: Date.now(),
        name,
        price,
        image,
        category
    };

    foods.push(food);

    saveFoods();
    renderFoods();

    document.getElementById("foodName").value = "";
    document.getElementById("foodPrice").value = "";
    document.getElementById("foodImage").value = "";
}

/* ================= RENDER FOODS ================= */

function renderFoods() {
    let container = document.querySelector(".foods");
    container.innerHTML = "";

    foods.forEach((food, index) => {
        let card = document.createElement("div");
        card.classList.add("card", food.category);

       card.innerHTML = `
    <div class="badge">${food.category}</div>

    <img src="${food.image}">
    <h3>${food.name}</h3>
    <p>${food.price} Birr</p>

    <button onclick="addToCart(${food.id})">Add to Cart</button>

    <button onclick="deleteFood(${index})">🗑 Delete</button>
    <button onclick="editFood(${index})">✏ Edit</button>
`; 
        container.appendChild(card);
    });
}

/* ================= DELETE / EDIT ================= */

function deleteFood(index) {
    foods.splice(index, 1);
    saveFoods();
    renderFoods();
}

function editFood(index) {
    let newName = prompt("Enter new name:", foods[index].name);
    let newPrice = prompt("Enter new price:", foods[index].price);

    if (newName !== null && newPrice !== null) {
        foods[index].name = newName;
        foods[index].price = Number(newPrice);

        saveFoods();
        renderFoods();
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
function showToast(message) {
    let toast = document.createElement("div");

    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";

    toast.style.background = "#ff6b00";
    toast.style.color = "white";

    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "12px";

    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";

    toast.style.zIndex = "9999";

    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "0.3s";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 50);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
    }, 2000);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}
function searchFood() {
    let input = document.getElementById("search").value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    let found = false;

    cards.forEach(card => {
        let name = card.querySelector("h3").textContent.toLowerCase();

        if (name.includes(input)) {
            card.style.display = "block";
            found = true;
        } else {
            card.style.display = "none";
        }
    });

    // optional message
    let container = document.querySelector(".foods");

    let msg = document.getElementById("no-results");

    if (!msg) {
        msg = document.createElement("p");
        msg.id = "no-results";
        msg.style.textAlign = "center";
        msg.style.marginTop = "20px";
        msg.style.fontWeight = "bold";
        container.appendChild(msg);
    }

    msg.textContent = found ? "" : "No food found 😅";
}
function filterCategory() {
    let value = document.getElementById("filter").value;
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        if (value === "all") {
            card.style.display = "block";
        } else {
            if (card.classList.contains(value)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        }
    });
}
function toggleCart() {
    let cart = document.querySelector(".cart");
    cart.classList.toggle("active");
}
function closeModal() {
    document.getElementById("orderModal").style.display = "none";
}