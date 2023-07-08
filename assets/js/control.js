function event_item_edit(textElement) {
  alert('You are trying to edit item')
}

function event_item_enter(inputElement, event) {
  if (event.key === 'Enter') {
    const text = inputElement.value;

    if (text === '') {
      document.querySelector('.shoplist-list').innerHTML += `<div class="shoplist-list-item" onclick="add_item(this)">
          <div class="shoplist-list-item-element">
              <button class="shoplist-list-item-checkbox"></button>
              <div class="shoplist-list-item-add">add...</div>
          </div>
          <div class="shoplist-list-item-cost"></div>
      </div>`;
    } 
    else 
    {
      const textElement = document.createElement('div');
      textElement.classList.add('shoplist-list-item-name');
      textElement.textContent = text;
      textElement.addEventListener('click', event => {
        event_item_edit(textElement);
      });
      inputElement.replaceWith(textElement);
      textElement.onclick = null;
      

      // создание элементов
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const button = document.createElement('button');
      const div3 = document.createElement('input');
      const div4 = document.createElement('div');

      // добавление классов к элементам
      div1.classList.add('shoplist-list-item');
      div2.classList.add('shoplist-list-item-element');
      button.classList.add('shoplist-list-item-checkbox');
      div3.classList.add('shoplist-list-item-textbox');
      div4.classList.add('shoplist-list-item-cost');

      div1.addEventListener('keydown', event => {
        event_item_enter(inputElement, event);
      });

      // добавление дочерних элементов
      div1.appendChild(div2);
      div1.appendChild(div4);
      div2.appendChild(button);
      div2.appendChild(div3);

      // добавление элемента на страницу
      const parentElement = document.querySelector('.shoplist-list'); // замените на нужный родительский элемент
      parentElement.appendChild(div1);
      div3.focus();
    }
  }
}

function add_item(element) {
  const addElement = element.querySelector('.shoplist-list-item-add');
  const inputElement = document.createElement('input');
  inputElement.classList.add('shoplist-list-item-textbox');
  inputElement.setAttribute('spellcheck', 'false');
  addElement.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener('keydown', event => {
    event_item_enter(inputElement, event);
  });
}

