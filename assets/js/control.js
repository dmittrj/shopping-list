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
  let ele_ListItem = UI.create_item(shopping_list_item.SLI_Name, shopping_list_item.SLI_Cost, shopping_list_item.SLI_Amount, shopping_list_item.SLI_Checked, 'shopping-list-item-' + shopping_list_item.SLI_Id, false);

  UI.assign_click_actions(ele_ListItem, 'item');
  right_side.parentElement.replaceWith(ele_ListItem);
  shopping_list_item.SLI_Removed = false;
  UI.delete_ticked_toggle_visibility();
  hub.save();
}


function parse_item(inputString) {
  let name = "";
  let cost = "0";
  let amount = "1";

  const currencies = ["$", "€", "₽", "rub", "р.", "£", "dollar"];
  const units = ["units"];

  var words = inputString.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (currencies.includes(words[i])) {
      cost = words[i - 1] + words[i];
      words[i - 1] = "";
      words[i] = "";
    }
  }

  for (let i = 0; i < words.length; i++) {
    name += String(words[i]) + " ";
  }

  name = name.trim();

  return {
    "name": name,
    "amount": amount,
    "cost": cost
  };
}


function toggle_mark_item(item) {
  let item_id = get_id_by_ui_item(item);
  let checked_status = hub.get_current_list().get_item_by_id(item_id).SLI_Checked;
  hub.get_current_list().get_item_by_id(item_id).SLI_Checked = !checked_status;
  UI.mark_item(item, !checked_status);
}


function delete_ticked() {
  hub.get_current_list().SL_Items.forEach(shopping_list_item => {
    if (shopping_list_item.SLI_Checked) {
      shopping_list_item.SLI_Removed = true;
      let right_side = document.querySelector('#shopping-list-item-' + String(shopping_list_item.SLI_Id)).querySelector('.shoplist-list-item-right');
      right_side.innerHTML = '';
      
      let ele_ListItemRight_a = document.createElement('a');
      ele_ListItemRight_a.innerText = 'Unremove';
      ele_ListItemRight_a.addEventListener('click', () => {
        unremove_ticked(right_side, shopping_list_item);
      })
      right_side.appendChild(ele_ListItemRight_a);
    }
  });

  UI.delete_ticked_toggle_visibility();
  hub.save();
}


function event_load() {
  hub = new Hub();
  hub.open();
  UI.draw_list(hub.get_current_list());
}


document.addEventListener('DOMContentLoaded', event_load);