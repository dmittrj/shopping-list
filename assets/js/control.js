// GLOBAL VARS
const OPACITY_LEVEL = '.4';
var SHOPPING_LIST;

function save() {
  const shopping_list_string = JSON.stringify(SHOPPING_LIST);
  document.cookie = `shopping_list=${shopping_list_string}; expires=Fri, 31 Dec 9999 23:59:59 GMT"`;
}

function open() {
  const cookies = document.cookie.split("; ");
  const cookieName = "shopping_list=";

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    if (cookie.indexOf(cookieName) === 0) {
      const cookieValue = cookie.substring(cookieName.length);
      try {
        return JSON.parse(cookieValue);
      } catch (error) {
        return [];
      }
    }
  }
  return [];
}


function parse_item(str) {
  return {"name": str,
          "cost":  '1', 
          "amount": '1'};
}


function ui_create_item(name, cost, amount) {
  var ele_ListItem = document.createElement('div');
  ele_ListItem.className = 'shoplist-list-item';

  let ele_ListItemLeft = document.createElement('div');
  ele_ListItemLeft.className = 'shoplist-list-item-left';
  ele_ListItem.appendChild(ele_ListItemLeft);

  let ele_ListItemCB = document.createElement('div');
  ele_ListItemCB.className = 'shoplist-list-item-cb';
  ele_ListItemLeft.appendChild(ele_ListItemCB);

  let ele_listItemCB_cb = document.createElement('button');
  ele_listItemCB_cb.className = 'shoplist-list-item-checkbox';
  ele_ListItemCB.appendChild(ele_listItemCB_cb);

  let ele_ListItemText = document.createElement('div');
  ele_ListItemText.className = 'shoplist-list-item-text';
  ele_ListItemText.innerText = name;
  ele_ListItemLeft.appendChild(ele_ListItemText);

  let ele_ListItemRight = document.createElement('div');
  ele_ListItemRight.className = 'shoplist-list-item-right';
  ele_ListItem.appendChild(ele_ListItemRight);

  return ele_ListItem;
}


function ui_create_input(action_by_enter) {
  const ele_ListItemTextInput = document.createElement('input');
  ele_ListItemTextInput.classList.add('shoplist-list-item-textbox');
  ele_ListItemTextInput.setAttribute('spellcheck', 'false');
  ele_ListItemTextInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      if (ele_ListItemTextInput.value === '') {
        ui_turn_input_to_add(ele_ListItemTextInput.parentElement.parentElement);
      } else {
        if (action_by_enter == 'add') {
          let new_item_content = parse_item(ele_ListItemTextInput.value);
          sl_append_item(new_item_content);
          ui_append_item(new_item_content);
        } else if (action_by_enter == 'edit') {
          let edited_item = ui_turn_input_to_item(ele_ListItemTextInput.parentElement.parentElement);
          let edited_item_text = edited_item.querySelector('.shoplist-list-item-text')
          edited_item_text.addEventListener('click', () => { display_edit_item_field(edited_item) });
        }
      }
    }
  });

  return ele_ListItemTextInput;
}


function ui_append_item(item) {
  var ele_ListItem = ui_create_item(item.name, item.cost, item.amount);
  ele_ListItem.querySelector('.shoplist-list-item-text').addEventListener('click', () => {display_edit_item_field(ele_ListItem)});

  document.querySelector(".shoplist-list").appendChild(ele_ListItem);
  
  if (document.querySelector('#shoplist-add-pseudoitem')) {
    document.querySelector('#shoplist-add-pseudoitem').remove();
    ui_append_add();
    ui_turn_add_to_input();
  }
}


function ui_create_add() {
  let ele_ListItemAdd = ui_create_item('Add...', '', '');
  ele_ListItemAdd.style.opacity = OPACITY_LEVEL;
  ele_ListItemAdd.id = 'shoplist-add-pseudoitem';
  ele_ListItemAdd.querySelector('.shoplist-list-item-text').addEventListener('click', display_new_item_field);
  return ele_ListItemAdd;
}


function ui_append_add() {
  var ele_ListItem = ui_create_add();

  document.querySelector(".shoplist-list").appendChild(ele_ListItem);

  return ele_ListItem;
}


function ui_turn_add_to_input() {
  const ele_ListItemAdd = document.querySelector('#shoplist-add-pseudoitem');
  const ele_ListItemAddText = ele_ListItemAdd.querySelector('.shoplist-list-item-text');
  
  const ele_ListItemTextInput = ui_create_input('add');
  ele_ListItemAdd.style.opacity = '1';

  ele_ListItemAddText.replaceWith(ele_ListItemTextInput);
  ele_ListItemTextInput.focus();
}


function ui_turn_item_to_input(item) {
  const ele_ListItemText = item.querySelector('.shoplist-list-item-text');
  
  const ele_ListItemTextInput = ui_create_input('edit');
  ele_ListItemTextInput.value = ele_ListItemText.innerText;

  ele_ListItemText.replaceWith(ele_ListItemTextInput);
  ele_ListItemTextInput.focus();
}


function ui_turn_input_to_add(input_item) {
  let ele_ListItem = ui_create_add();

  input_item.replaceWith(ele_ListItem);
}


function ui_turn_input_to_item(input_item) {
  let parsed = parse_item(input_item.querySelector('.shoplist-list-item-textbox').value);
  let ele_ListItem = ui_create_item(parsed.name, parsed.cost, parsed.amount);

  input_item.replaceWith(ele_ListItem);

  return ele_ListItem;
}


function sl_append_item(item) {
  SHOPPING_LIST.push(item);
  save();
}


function stop_inputing() {
  let eles_ListItemTB = document.querySelectorAll('.shoplist-list-item-textbox');

  for (let i = 0; i < eles_ListItemTB.length; i++) {
    const ele_ListItemTB = eles_ListItemTB[i];
    if (ele_ListItemTB.value === '') {
      ele_ListItemTB.parentElement.parentElement.remove();
    } else {
      ui_turn_input_to_item(ele_ListItemTB.parentElement.parentElement);
    }
    
  }
}


function display_new_item_field() {
  const ele_ListItemAdd = document.querySelector('#shoplist-add-pseudoitem');
  const ele_ListItemAddText = ele_ListItemAdd.querySelector('.shoplist-list-item-text');

  if (ele_ListItemAddText) {
    ui_turn_add_to_input();
  } else {
    stop_inputing();
    ui_append_add();
    ui_turn_add_to_input();
  }
}


function display_edit_item_field(item) {
  ui_turn_item_to_input(item);
}


function event_load() {
  SHOPPING_LIST = open();
  for (let i = 0; i < SHOPPING_LIST.length; i++) {
    const shopping_list_item = SHOPPING_LIST[i];
    ui_append_item(shopping_list_item);
  }
  ui_append_add();

  return;
}

document.addEventListener('DOMContentLoaded', event_load); 

