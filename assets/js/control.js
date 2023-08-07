// GLOBAL VARS
const OPACITY_LEVEL = '.4';
var SHOPPING_LIST;
var LAST_ID = 1;
var hub;



function save() {
  var cookie_shopping_list = SHOPPING_LIST.map(({ id, ...item }) => item);
  cookie_shopping_list = cookie_shopping_list.filter((w) => !w.removed);
  cookie_shopping_list = cookie_shopping_list.map(({ removed, ...item }) => item);
  const shopping_list_string = JSON.stringify(cookie_shopping_list);
  document.cookie = `shopping_list=${shopping_list_string}; expires=Fri, 31 Dec 9999 23:59:59 GMT"`;
}

function sl_open() {
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
    "name": str,
    "amount": 1,
    "cost": 0
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
  let checked_status = hub.get_current_list().get_item_by_id(item_id).SLI_Checked;
  hub.get_current_list().get_item_by_id(item_id).SLI_Checked = !checked_status;
  UI.mark_item(item, !checked_status);
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
  hub = new Hub();
  hub.open();
  UI.draw_list(hub.get_current_list());
  return;

  SHOPPING_LIST = sl_open();
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