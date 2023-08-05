// GLOBAL VARS
const OPACITY_LEVEL = '.4';
var SHOPPING_LIST;
var LAST_ID = 1;

class ShoppingList {
  constructor(name) {
    this.SL_Name = name;
    this.SL_Items = [];
    this.SL_LastID = 1;
  }
}

class ShoppingListItem {
  constructor(name, cost, amount, checked, shopping_list) {
    this.SLI_Name = name;
    this.SLI_Cost = cost;
    this.SLI_Amount = amount;
    this.SLI_Checked = checked;
    shopping_list.SL_Items.push(this);
    this.SLI_Id = shopping_list.SL_LastID++;
    
    this.Removed = false;
  }
}

function save() {
  var cookie_shopping_list = SHOPPING_LIST.map(({ id, ...item }) => item);
  cookie_shopping_list = cookie_shopping_list.filter((w) => !w.removed);
  cookie_shopping_list = cookie_shopping_list.map(({ removed, ...item }) => item);
  const shopping_list_string = JSON.stringify(cookie_shopping_list);
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


function get_list_item_by_its_input(input_item) {
  return input_item.parentElement.parentElement;
}


function get_id_by_ui_item(item) {
  return +item.id.substring(19);
}


function get_sl_item_by_id(item_id) {
  return SHOPPING_LIST.find((w) => w.id === +item_id);
}


function unremove_ticked(right_side, shopping_list_item) {
  right_side.innerHTML = '';
  shopping_list_item.removed = false;
  delete_ticked_toggle_visibility();
  save();
}


function parse_item(str) {
  return {
          "id": '',
          "removed": false,
          "name": str,
          "cost":  '1', 
          "amount": '1',
          "checked": false
        };
}


function delete_ticked_toggle_visibility() {
  document.querySelector('#shoplist-delete-ticked').style.display = (SHOPPING_LIST.find((w) => w.checked && !w.removed)) ? 'inline-block' : 'none';
}


function ui_mark_item(item, checked_status) {
  if (checked_status) {
    item.querySelector('.shoplist-list-item-checkbox').classList.add('sl-item-checkbox-ticked');
  } else {
    item.querySelector('.shoplist-list-item-checkbox').classList.remove('sl-item-checkbox-ticked');
    if (SHOPPING_LIST.find((w) => w.id === get_id_by_ui_item(item)).removed) {
      unremove_ticked(item.querySelector('.shoplist-list-item-right'), SHOPPING_LIST.find((w) => w.id === get_id_by_ui_item(item)));
    }
  }

  delete_ticked_toggle_visibility();
}


function sl_mark_item(item_id, checked_status) {
  get_sl_item_by_id(item_id).checked = checked_status;
}


function toggle_mark_item(item) {
  let item_id = get_id_by_ui_item(item);
  let checked_status = get_sl_item_by_id(item_id).checked;
  sl_mark_item(item_id, !checked_status);
  ui_mark_item(item, !checked_status);
}


function ui_create_item(name, cost, amount, translucent) {
  var ele_ListItem = document.createElement('div');
  ele_ListItem.className = 'shoplist-list-item';
  // if (!translucent) {
  //   ele_ListItem.addEventListener('mousedown', (event) => {
  //     let shiftX = event.clientX - ele_ListItem.getBoundingClientRect().left;
  //     let shiftY = event.clientY - ele_ListItem.getBoundingClientRect().top;

  //     ele_ListItem.style.position = 'absolute';
  //     ele_ListItem.style.zIndex = 1000;
  //     // переместим в body, чтобы мяч был точно не внутри position:relative
  //     document.body.append(ele_ListItem);
  //     // и установим абсолютно спозиционированный мяч под курсор
  //     console.log(event.target.closest('.shoplist-list-item'));

  //     moveAt(event.pageX, event.pageY);

  //     // передвинуть мяч под координаты курсора
  //     // и сдвинуть на половину ширины/высоты для центрирования
  //     function moveAt(pageX, pageY) {
  //       ele_ListItem.style.left = pageX - shiftX + 'px';
  //       ele_ListItem.style.top = pageY - shiftY + 'px';
  //     }

  //     function onMouseMove(event) {
  //       moveAt(event.pageX, event.pageY);
  //     }

  //     // (3) перемещать по экрану
  //     document.addEventListener('mousemove', onMouseMove);

  //     // (4) положить мяч, удалить более ненужные обработчики событий
  //     ele_ListItem.onmouseup = function() {
  //       document.removeEventListener('mousemove', onMouseMove);
  //       ele_ListItem.onmouseup = null;
  //     };

  //   });
  // }
  

  let ele_ListItemLeft = document.createElement('div');
  ele_ListItemLeft.className = 'shoplist-list-item-left';
  ele_ListItem.appendChild(ele_ListItemLeft);

  let ele_ListItemCB = document.createElement('div');
  ele_ListItemCB.className = 'shoplist-list-item-cb';
  ele_ListItemLeft.appendChild(ele_ListItemCB);

  let ele_listItemCB_cb = document.createElement('button');
  ele_listItemCB_cb.className = 'shoplist-list-item-checkbox';
  if (!translucent) {
    ele_listItemCB_cb.addEventListener('click', () => {
      toggle_mark_item(ele_listItemCB_cb.parentElement.parentElement.parentElement);
      save();
    });
  }
  
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

  if (action_by_enter == 'add') {
    ele_ListItemTextInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (ele_ListItemTextInput.value === '') {
          ui_turn_input_to_add(get_list_item_by_its_input(ele_ListItemTextInput));
        } else {
          let new_item_content = parse_item(ele_ListItemTextInput.value);
          let assigned_id = sl_append_item(new_item_content);
          ui_append_item(new_item_content, assigned_id);
        }
      }
    });
    // ele_ListItemTextInput.addEventListener('focusout', (event) => {
    //   if (ele_ListItemTextInput.value === '') {
    //     ui_turn_input_to_add(get_list_item_by_its_input(ele_ListItemTextInput));
    //   } else {
    //     let new_item_content = parse_item(ele_ListItemTextInput.value);
    //     let assigned_id = sl_append_item(new_item_content);
    //     ui_append_item(new_item_content, assigned_id);
    //     ui_turn_input_to_add(document.querySelector('#shoplist-add-pseudoitem'));
    //   }
    // });
  } else if (action_by_enter == 'edit') {
    ele_ListItemTextInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (ele_ListItemTextInput.value === '') {
          sl_drop_item(get_list_item_by_its_input(ele_ListItemTextInput).id.substring(19));
          save();
          get_list_item_by_its_input(ele_ListItemTextInput).remove();
        } else {
          let edited_item = ui_turn_input_to_item(get_list_item_by_its_input(ele_ListItemTextInput));
          sl_edit_item(ele_ListItemTextInput.value, edited_item.id.substring(19));
          save();
        }
      }
    });
  }

  return ele_ListItemTextInput;
}


function ui_append_item(item, item_id) {
  var ele_ListItem = ui_create_item(item.name, item.cost, item.amount, false);
  ele_ListItem.id = 'shopping-list-item-' + item_id;
  ele_ListItem.querySelector('.shoplist-list-item-text').addEventListener('click', () => {display_edit_item_field(ele_ListItem)});

  document.querySelector(".shoplist-list").appendChild(ele_ListItem);
  
  if (document.querySelector('#shoplist-add-pseudoitem')) {
    document.querySelector('#shoplist-add-pseudoitem').remove();
    ui_append_add();
    ui_turn_add_to_input();
  }

  return ele_ListItem;
}


function ui_create_add() {
  let ele_ListItemAdd = ui_create_item('Add...', '', '', true);
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
  let ele_ListItem = ui_create_item(parsed.name, parsed.cost, parsed.amount, false);
  ele_ListItem.querySelector('.shoplist-list-item-text').addEventListener('click', () => {display_edit_item_field(ele_ListItem)});
  ele_ListItem.id = input_item.id;


  input_item.replaceWith(ele_ListItem);

  return ele_ListItem;
}


function sl_append_item(item) {
  item.id = LAST_ID++;
  SHOPPING_LIST.push(item);
  save();

  return item.id;
}



function sl_edit_item(item, item_id) {
  get_sl_item_by_id(item_id).name = item;
}


function sl_drop_item(item_id) {
  SHOPPING_LIST = SHOPPING_LIST.filter((w) => w.id != +item_id)
}


function stop_inputing() {
  let eles_ListItemTB = document.querySelectorAll('.shoplist-list-item-textbox');

  for (let i = 0; i < eles_ListItemTB.length; i++) {
    const ele_ListItemTB = eles_ListItemTB[i];
    if (ele_ListItemTB.value === '') {
      if (!(get_list_item_by_its_input(ele_ListItemTB).id == 'shoplist-add-pseudoitem')) {
        sl_drop_item(get_list_item_by_its_input(ele_ListItemTB).id.substring(19));
        save();
      }
      get_list_item_by_its_input(ele_ListItemTB).remove();
    } else {
      let edited_item = ui_turn_input_to_item(get_list_item_by_its_input(ele_ListItemTB));
      sl_edit_item(ele_ListItemTB.value, edited_item.id.substring(19));
      save();
    }
  }
}


function display_new_item_field() {
  const ele_ListItemAdd = document.querySelector('#shoplist-add-pseudoitem');
  const ele_ListItemAddText = ele_ListItemAdd.querySelector('.shoplist-list-item-text');
  stop_inputing();

  if (ele_ListItemAddText) {
    ui_turn_add_to_input();
  } else {
    
    ui_append_add();
    ui_turn_add_to_input();
  }
}


function display_edit_item_field(item) {
  stop_inputing();
  if (!document.querySelector('#shoplist-add-pseudoitem')) {
    ui_append_add();
  }
  ui_turn_item_to_input(item);
}


function delete_ticked() {
  SHOPPING_LIST.forEach(shopping_list_item => {
    if (shopping_list_item.checked) {
      shopping_list_item.removed = true;
      let right_side = document.querySelector('#shopping-list-item-' + String(shopping_list_item.id)).querySelector('.shoplist-list-item-right');
      right_side.innerHTML = '';
      
      let ele_ListItemRight_a = document.createElement('a');
      ele_ListItemRight_a.innerText = 'Unremove';
      ele_ListItemRight_a.addEventListener('click', () => {
        unremove_ticked(right_side, shopping_list_item);
      })
      right_side.appendChild(ele_ListItemRight_a);
    }
  });

  delete_ticked_toggle_visibility();
  save();
}


function event_load() {
  SHOPPING_LIST = open();
  for (let i = 0; i < SHOPPING_LIST.length; i++) {
    const shopping_list_item = SHOPPING_LIST[i];
    shopping_list_item.id = LAST_ID++;
    if (!shopping_list_item.checked) {
      shopping_list_item.checked = false;
    }
    if (!shopping_list_item.removed) {
      shopping_list_item.removed = false;
    }
    let _appended = ui_append_item(shopping_list_item, shopping_list_item.id);
    if (shopping_list_item.checked) {
      ui_mark_item(_appended, true);
    }
  }
  ui_append_add();

  return;
}


document.addEventListener('DOMContentLoaded', event_load); 

