function event_item_edit(textElement) {
  const div3 = document.createElement('input');
  div3.classList.add('shoplist-list-item-textbox');
  div3.value = textElement.innerHTML;
  div3.addEventListener('keydown', event => {
    event_item_enter(div3, event, false);
  });
  textElement.replaceWith(div3);
  div3.focus();
}

function event_item_enter(inputElement, event, newItems) {
  if (event.key === 'Enter') {
    const text = inputElement.value;

    if (text === '') {
      const divItem = document.createElement('div');
      divItem.classList.add('shoplist-list-item');
      divItem.addEventListener('click', add_item);
      ell = divItem;

      const divElement = document.createElement('div');
      divElement.classList.add('shoplist-list-item-element');
      divItem.appendChild(divElement);

      const button = document.createElement('button');
      button.classList.add('shoplist-list-item-checkbox');
      divElement.appendChild(button);

      const divAdd = document.createElement('div');
      divAdd.classList.add('shoplist-list-item-add');
      divAdd.innerHTML = 'add...';
      divElement.appendChild(divAdd);

      const divCost = document.createElement('div');
      divCost.classList.add('shoplist-list-item-cost');
      //divCost.innerHTML = '59 ₽';
      divItem.appendChild(divCost);
      inputElement.parentElement.parentElement.replaceWith(divItem);
    } 
    else 
    {
      const textElement = document.createElement('div');
      textElement.classList.add('shoplist-list-item-name');
      textElement.textContent = text;
      inputElement.replaceWith(textElement);
      textElement.parentElement.parentElement.addEventListener('click', () => {
        event_item_edit(textElement);
      });

      if (!newItems) {
        return;
      }
      

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

      div3.addEventListener('keydown', event => {
        event_item_enter(div3, event, true);
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

var ell;

function add_item() {
  element = ell;
  console.log('add');
  const addElement = element.querySelector('.shoplist-list-item-add');
  const inputElement = document.createElement('input');
  inputElement.classList.add('shoplist-list-item-textbox');
  inputElement.setAttribute('spellcheck', 'false');
  element.removeEventListener('click', add_item);
  addElement.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener('keydown', event => {
    event_item_enter(inputElement, event, true);
  });
}


function event_load() {
  const divItem = document.createElement('div');
  divItem.classList.add('shoplist-list-item');
  divItem.addEventListener('click', add_item);
  ell = divItem;

  const divElement = document.createElement('div');
  divElement.classList.add('shoplist-list-item-element');
  divItem.appendChild(divElement);

  const button = document.createElement('button');
  button.classList.add('shoplist-list-item-checkbox');
  divElement.appendChild(button);

  const divAdd = document.createElement('div');
  divAdd.classList.add('shoplist-list-item-add');
  divAdd.innerHTML = 'add...';
  divElement.appendChild(divAdd);

  const divCost = document.createElement('div');
  divCost.classList.add('shoplist-list-item-cost');
  //divCost.innerHTML = '59 ₽';
  divItem.appendChild(divCost);

  const parentElement = document.querySelector('.shoplist-list'); // замените на нужный родительский элемент
  parentElement.appendChild(divItem);
}

document.addEventListener('DOMContentLoaded', event_load);

