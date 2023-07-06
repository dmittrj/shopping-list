function add_item() {
    const newItem = document.createElement("div");
    newItem.classList.add("sl-list-item");
    newItem.innerHTML = `
        <input type="checkbox" class="sl-list-item-checkbox">
        <div class="sl-list-item-text" onclick="edit_item(this)">Хлеб</div>
    `;
    const shoppingList = document.getElementById("shopping-list");
    shoppingList.appendChild(newItem);
}


function edit_hhhitem(element) {
    const inputElement = document.createElement('input'); // создаем новый элемент input
    inputElement.value = element.innerHTML; // копируем содержимое div в значение input
    inputElement.classList.add('sl-list-item-input'); // добавляем класс sl-input
    inputElement.autofocus = true; // устанавливаем фокус на элемент

    element.replaceWith(inputElement); // заменяем div на input
}

function edit_item(divElement) {
    const inputElement = document.createElement('input'); // создаем новый элемент input
    inputElement.value = divElement.innerHTML; // копируем содержимое div в значение input
    inputElement.classList.add('sl-list-item-input'); // добавляем класс sl-input
    inputElement.autofocus = true; // устанавливаем фокус на элемент
  
    inputElement.addEventListener('blur', function() { // добавляем обработчик события blur
      const divText = inputElement.value; // получаем текст из input
      const newDivElement = document.createElement('div'); // создаем новый элемент div
      newDivElement.innerHTML = divText; // устанавливаем текст из input в div
      newDivElement.classList.add('sl-list-item-text'); // добавляем класс sl-input
      newDivElement.addEventListener('click', function() { // добавляем обработчик события click
        edit_item(newDivElement); // заменяем div на input
      });
      inputElement.replaceWith(newDivElement); // заменяем input на div
    });
  
    divElement.replaceWith(inputElement); // заменяем div на input
  }