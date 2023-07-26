// GLOBAL VARS
var SHOPPING_LIST;


function get_shopping_list() {
  var shopping_list_items = document.getElementsByClassName('shoplist-list-item');
  var shopping_list = [];
  for (let i = 0; i < shopping_list_items.length; i++) {
    const element = shopping_list_items[i].querySelector('.shoplist-list-item-element');
    if (element.querySelector('.shoplist-list-item-name')) {
      shopping_list[shopping_list.length] = element.querySelector('.shoplist-list-item-name').innerHTML;
    }
  }

  return shopping_list;
}

function save() {
  const shopping_list_string = JSON.stringify(get_shopping_list());
  document.cookie = `shopping_list=${shopping_list_string}; expires=Fri, 31 Dec 9999 23:59:59 GMT"`;
}

function open() {
  const cookies = document.cookie.split("; ");
  const cookieName = "shopping_list=";
  let slist = null;

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    if (cookie.indexOf(cookieName) === 0) {
      const cookieValue = cookie.substring(cookieName.length);
      return JSON.parse(cookieValue);
    }
  }

  return new Array();

  let html = "";

  slist.forEach(element => {
    html += `<div class="shoplist-list-item">
      <div class="shoplist-list-item-element">
          <button class="shoplist-list-item-checkbox"></button>
          <div class="shoplist-list-item-name">` + element + `</div>
      </div>
      <div class="shoplist-list-item-cost">59 ₽</div>
    </div>`;
  });
  

  document.querySelector('.shoplist-list').innerHTML = html + document.querySelector('.shoplist-list').innerHTML;

  console.log(slist);
}

function create_item(name, cost, amount) {
  var ele_ListItem = document.createElement('div');
  ele_ListItem.className = 'shoplist-list-item';

  let ele_ListItemCB = document.createElement('div');
  ele_ListItemCB.className = 'shoplist-list-item-cb';
  ele_ListItem.appendChild(ele_ListItemCB);

  let ele_ListItemText = document.createElement('div');
  ele_ListItemText.className = 'shoplist-list-item-text';
  ele_ListItemText.innerText = name;
  ele_ListItemText.addEventListener('click', display_new_item_field);
  ele_ListItem.appendChild(ele_ListItemText);

  let ele_ListItemRight = document.createElement('div');
  ele_ListItemRight.className = 'shoplist-list-item-right';
  ele_ListItem.appendChild(ele_ListItemRight);

  return ele_ListItem;
}

function draw_append_item(item) {
  var ele_ListItem = create_item(item, '0', '1');

  document.querySelector(".shoplist-list").appendChild(ele_ListItem);
}


function draw_append_add() {
  var ele_ListItem = create_item('Add...', '0', '1');
  ele_ListItem.style.opacity = '.5'
  ele_ListItem.id = 'shoplist-add-pseudoitem'

  document.querySelector(".shoplist-list").appendChild(ele_ListItem);
}


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

      save();
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

      save();

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

  save();
}


function display_new_item_field() {
  const ele_ListItemAdd = document.querySelector('#shoplist-add-pseudoitem');
  const ele_ListItemAddText = ele_ListItemAdd.querySelector('.shoplist-list-item-text');

  if (ele_ListItemAddText) {
    const ele_ListItemTextInput = document.createElement('input');
    ele_ListItemTextInput.classList.add('shoplist-list-item-textbox');
    ele_ListItemTextInput.setAttribute('spellcheck', 'false');
    ele_ListItemAdd.style.opacity = '1';

    ele_ListItemAddText.replaceWith(ele_ListItemTextInput);
    ele_ListItemTextInput.focus();
  } else {

  }
  
}


function event_load() {
  SHOPPING_LIST = open();
  for (let i = 0; i < SHOPPING_LIST.length; i++) {
    const shopping_list_item = SHOPPING_LIST[i];
    draw_append_item(shopping_list_item);
  }
  draw_append_add();

  return;







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

  open();
}

document.addEventListener('DOMContentLoaded', event_load); 

