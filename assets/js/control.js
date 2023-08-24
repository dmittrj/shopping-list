// GLOBAL VARS
const OPACITY_LEVEL = '.4';
var hub;



function get_id_by_ui_item(item) {
  return +item.id.substring(19);
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


async function share_list() {
  const list_to_share = hub.get_current_list().to_json();
  let response = await fetch('assets/server/p2p_share.php', {
    method: 'POST',
    body: JSON.stringify(list_to_share)
  });
  let text = await response.text();
  console.log(text);
}


function event_load() {
  hub = new Hub();
  hub.open();
  UI.draw_list(hub.get_current_list());
  UI.draw_list_of_lists();

  document.querySelector('#button-options').addEventListener('click', () => {
    UI.open_options_popup();
  });
  document.querySelector('#pop-up-rename').addEventListener('click', () => {
    UI.close_options_popup();
    UI.turn_title_to_input();
  });
  document.querySelector('#pop-up-delete').addEventListener('click', () => {
    UI.close_options_popup();
    hub.get_current_list().SL_Removed = true;
    hub.save();

    UI.draw_list(hub.get_current_list());
  });
  document.querySelector('#pop-up-share').addEventListener('click', () => {
    UI.close_options_popup();

    share_list();
  });
  document.querySelector('#pop-up-mode-switch').addEventListener('click', () => {
    UI.close_options_popup();
    document.querySelector('#pop-up-mode-switch').innerText = 'Turn to ' + (hub.DarkMode ? 'dark' : 'light') + ' mode';
    hub.dark_mode_toggle();
    UI.dark_mode_switch(hub.DarkMode);
  });
  if (hub.DarkMode) {
    document.querySelector('#pop-up-mode-switch').innerText = 'Turn to ' + (!hub.DarkMode ? 'dark' : 'light') + ' mode';
    UI.dark_mode_switch(hub.DarkMode);
  }
  document.querySelector('#pop-up-cancel').addEventListener('click', () => {
    UI.close_options_popup();
  });
}


document.addEventListener('DOMContentLoaded', event_load);