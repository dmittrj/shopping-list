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

function aes_encrypt(message, key) {
  const ciphertext = CryptoJS.AES.encrypt(message, key).toString();
  return ciphertext;
}

function aes_decrypt(ciphertext, key) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

function generate_key(length) {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


async function share_list() {
  const key = generate_key(16);
  const list_to_share = JSON.stringify(hub.get_current_list().to_json());
  const list_to_send = aes_encrypt(list_to_share, key);
  let response = await fetch('assets/server/p2p_share.php', {
    method: 'POST',
    body: list_to_send
  });
  let text = await response.text();

  link_to_copy = window.location.href + '?share=' + text + '&key=' + key;

  let ele_listInfoText = document.createElement('p');
  ele_listInfoText.innerText = 'Copy this link and send it to your partner';
  ele_listInfoText.classList.add('shoplist-list-info-text');

  let ele_listInfoTextBr = document.createElement('br');

  let ele_listInfoTextRestoreButton = document.createElement('a');
  ele_listInfoTextRestoreButton.innerText = link_to_copy;
  ele_listInfoTextRestoreButton.href = link_to_copy;
  ele_listInfoTextRestoreButton.classList.add('shoplist-list-info-text');
  ele_listInfoTextRestoreButton.classList.add('shoplist-list-info-link');

  document.querySelector('#shoplist-list').insertBefore(ele_listInfoText, document.querySelector('#shoplist-list').firstElementChild);
  ele_listInfoText.appendChild(ele_listInfoTextBr);
  ele_listInfoText.appendChild(ele_listInfoTextRestoreButton);
}


async function event_load() {
  hub = new Hub();
  hub.open();
  UI.draw_list(hub.get_current_list());

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

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const share = urlParams.get('share');
  const key = urlParams.get('key');
  if (share && key) {
    let response = await fetch(`assets/server/p2p_get.php?id=${share}`, {
      method: 'GET'
    });
    let text = await response.text();
    let json = JSON.parse(aes_decrypt(text, key));
    console.log(json);

    //let sl = hub.add_list('Shared List');
    let sl = new ShoppingList("Shared List", 0);
    json.forEach(sl_item => {
      sl.append(new ShoppingListItem(sl_item.name, sl_item.cost, sl_item.amount, sl_item.checked, sl.SL_LastID++));
    });

    UI.draw_list(sl);
    hub.CurrentList = null;

    let ele_listInfoText = document.createElement('p');
    ele_listInfoText.innerHTML = 'This&nbsp;is the&nbsp;viewing mode of&nbsp;the&nbsp;list that was shared with you, it&nbsp;is&nbsp;not&nbsp;saved';
    ele_listInfoText.classList.add('shoplist-list-info-text');

    let ele_listInfoTextBr = document.createElement('br');

    let ele_listInfoTextRestoreButton = document.createElement('a');
    ele_listInfoTextRestoreButton.innerText = "Save";
    ele_listInfoTextRestoreButton.classList.add('shoplist-list-info-text');
    ele_listInfoTextRestoreButton.classList.add('shoplist-list-info-link');
    ele_listInfoTextRestoreButton.addEventListener('click', () => {
      sl.SL_Id = hub.LastID++;
      hub.ShoppingLists.push(sl);
      hub.CurrentList = sl.SL_Id;
      UI.draw_list_of_lists();
      hub.save();
      ele_listInfoText.remove();
    });
    document.querySelector('#shoplist-list').insertBefore(ele_listInfoText, document.querySelector('#shoplist-list').firstElementChild);
    ele_listInfoText.appendChild(ele_listInfoTextBr);
    ele_listInfoText.appendChild(ele_listInfoTextRestoreButton);
  }

  UI.draw_list_of_lists();
}


document.addEventListener('DOMContentLoaded', event_load);