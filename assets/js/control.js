function add_item() {
    const newItem = document.createElement("div");
    newItem.classList.add("sl-list-item");
    newItem.innerHTML = `
        <input type="checkbox" class="sl-list-item-checkbox">
        <div class="sl-list-item-text">Хлеб</div>
    `;
    const shoppingList = document.getElementById("shopping-list");
    shoppingList.appendChild(newItem);
}