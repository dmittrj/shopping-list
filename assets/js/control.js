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
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  } catch (error) {
    return null;
  }
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
  if (document.querySelector('#shoplist-share-text')) {
    return;
  }

  const key = generate_key(16);
  const list_to_share = JSON.stringify({"list": hub.get_current_list().to_json(),
                                        "title": hub.get_current_list().SL_Name});
  const list_to_send = aes_encrypt(list_to_share, key);
  let response = await fetch('assets/server/p2p_share.php', {
    method: 'POST',
    body: list_to_send
  });
  let atr_share = await response.text();

  let link_to_copy = window.location.href + '?share=' + atr_share + '&key=' + key;
  let ele_listInfoText = UI.create_info_block('Tap to copy this link and send it to your partner', link_to_copy);
  ele_listInfoText.id = 'shoplist-share-text';
  ele_listInfoText.querySelector('#sl-info-block-button').addEventListener('click', () => {
    const link = ele_listInfoText.querySelector('#sl-info-block-button');
    const range = document.createRange();
    range.selectNode(link);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();

    if (document.querySelector('.shoplist-list-info-pop-up')) {
      document.querySelector('.shoplist-list-info-pop-up').remove();
    }

    let eleCopyPopUp = document.createElement('div');
    eleCopyPopUp.classList.add('shoplist-list-info-pop-up');
    eleCopyPopUp.innerText = 'Copied';
    eleCopyPopUp.addEventListener('animationend', () => {
      setTimeout(() => {
        eleCopyPopUp.style.animation = 'shoplist-ani-pop-up-fading .35s ease-out forwards'
        eleCopyPopUp.addEventListener('animationend', () => {
          eleCopyPopUp.remove();
        })
      }, 2000);
    });

    document.querySelector('#shoplist-list').appendChild(eleCopyPopUp);
  });
  document.querySelector('#shoplist-list').insertBefore(ele_listInfoText, document.querySelector('#shoplist-list').firstElementChild);
}

async function collaborate_list(isOn) {
  if (isOn) {
    hub.get_current_list().SL_CollaborationInfo.status = 'Owner';
    if (!hub.get_current_list().SL_CollaborationInfo.source) {
      hub.get_current_list().SL_CollaborationInfo.key = generate_key(16);
      const list_to_share = JSON.stringify({"list": hub.get_current_list().to_json(),
                                        "title": hub.get_current_list().SL_Name});
      const list_to_send = aes_encrypt(list_to_share, hub.get_current_list().SL_CollaborationInfo.key);
      let response = await fetch('assets/server/collaborate_send_list.php', {
        method: 'POST',
        body: list_to_send
      });
      let atr_share = await response.text();
      hub.get_current_list().SL_CollaborationInfo.source = atr_share;

      let link_to_copy = window.location.href + '?invite=' + atr_share + '&key=' + hub.get_current_list().SL_CollaborationInfo.key;
      let ele_listInfoText = UI.create_info_block('Tap to copy this link and send it to your partner', link_to_copy);
      ele_listInfoText.id = 'shoplist-share-text';
      ele_listInfoText.querySelector('#sl-info-block-button').addEventListener('click', () => {
        const link = ele_listInfoText.querySelector('#sl-info-block-button');
        const range = document.createRange();
        range.selectNode(link);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();

        if (document.querySelector('.shoplist-list-info-pop-up')) {
          document.querySelector('.shoplist-list-info-pop-up').remove();
        }

        let eleCopyPopUp = document.createElement('div');
        eleCopyPopUp.classList.add('shoplist-list-info-pop-up');
        eleCopyPopUp.innerText = 'Copied';
        eleCopyPopUp.addEventListener('animationend', () => {
          setTimeout(() => {
            eleCopyPopUp.style.animation = 'shoplist-ani-pop-up-fading .35s ease-out forwards'
            eleCopyPopUp.addEventListener('animationend', () => {
              eleCopyPopUp.remove();
            })
          }, 2000);
        });

        document.querySelector('#shoplist-list').appendChild(eleCopyPopUp);
      });
      document.querySelector('#shoplist-list').insertBefore(ele_listInfoText, document.querySelector('#shoplist-list').firstElementChild);
    }
  } else {
    hub.get_current_list().SL_CollaborationInfo.status = 'Off';
  }
}


async function event_load() {
  hub = new Hub();
  hub.open();
  hub.fix_current_list();
  
  UI.draw_list(hub.get_current_list(), true);

  document.querySelector('#button-options').addEventListener('click', () => {
    UI.open_options_popup();
  });
  document.querySelector('#pop-up-rename').addEventListener('click', () => {
    UI.close_options_popup();
    UI.turn_title_to_input();
  });
  document.querySelector('#pop-up-delete').addEventListener('click', () => {
    UI.close_options_popup();
    hub.get_current_list().SL_Removed = !hub.get_current_list().SL_Removed;
    UI.toggle_delete_list_action();
    UI.draw_list(hub.get_current_list(), true);
    hub.save();
  });
  document.querySelector('#pop-up-share').addEventListener('click', () => {
    UI.close_options_popup();
    share_list();
  });
  document.querySelector('#pop-up-collaborate-toggle').addEventListener('change', () => {
    collaborate_list(document.querySelector('#pop-up-collaborate-toggle').checked);
  })
  document.querySelector('#pop-up-mode-switch').addEventListener('click', () => {
    UI.close_options_popup();
    document.querySelector('#pop-up-mode-switch a').innerText = 'Turn to ' + (hub.DarkMode ? 'dark' : 'light') + ' mode';
    hub.dark_mode_toggle();
    UI.dark_mode_switch(hub.DarkMode);
  });
  if (hub.DarkMode) {
    document.querySelector('#pop-up-mode-switch a').innerText = 'Turn to ' + (!hub.DarkMode ? 'dark' : 'light') + ' mode';
    UI.dark_mode_switch(hub.DarkMode);
  }
  document.querySelector('#pop-up-cancel').addEventListener('click', () => {
    UI.close_options_popup();
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const share = urlParams.get('share');
  const invite = urlParams.get('invite');
  const key = urlParams.get('key');
  if (share && key) {
    let response = await fetch(`assets/server/p2p_get.php?id=${share}`, {
      method: 'GET'
    });
    let text = await response.text();
    let decrypted_list = aes_decrypt(text, key);
    if (decrypted_list) {
      let json = JSON.parse(decrypted_list);
      let sl = new ShoppingList(json?.title, 0);
      json?.list.forEach(sl_item => {
        sl.append(new ShoppingListItem(sl_item.name, sl_item.cost, sl_item.amount, sl_item.checked, sl.SL_LastID++));
      });

      UI.draw_list(sl, false);
      hub.CurrentList = null;

      let ele_listInfoText = UI.create_info_block('This&nbsp;is the&nbsp;viewing mode of&nbsp;the&nbsp;list that was shared with you, it&nbsp;is&nbsp;not&nbsp;saved', 'Save');

      ele_listInfoText.querySelector('#sl-info-block-button').addEventListener('click', () => {
        sl.SL_Id = hub.LastID++;
        hub.ShoppingLists.push(sl);
        hub.CurrentList = sl.SL_Id;
        UI.draw_list_of_lists();
        UI.draw_list(hub.get_current_list(), true);
        hub.save();
      });
      document.querySelector('#shoplist-list').insertBefore(ele_listInfoText, document.querySelector('#shoplist-list').firstElementChild);
    }
    
    const url = window.location.href;
    const cleanUrl = url.split('?')[0];
    window.history.replaceState(null, null, cleanUrl);
  }

  if (invite && key) {
    let response = await fetch(`assets/server/collaborate_get_list.php?id=${invite}`, {
      method: 'GET'
    });
    let text = await response.text();
    let actual_list = JSON.parse(text).actual_list;
    let variation = JSON.parse(text).variation;
    let decrypted_list = aes_decrypt(actual_list, key);
    console.log(decrypted_list);
    if (decrypted_list) {
      let json = JSON.parse(decrypted_list);
      let sl = new ShoppingList(json?.title, 0);
      sl.SL_CollaborationInfo = {"status": 'Editor',
                                 "key": key,
                                 "variation": variation,
                                 "source": invite};
      json?.list.forEach(sl_item => {
        sl.append(new ShoppingListItem(sl_item.name, sl_item.cost, sl_item.amount, sl_item.checked, sl.SL_LastID++));
      });

      UI.draw_list(sl, false);
      hub.CurrentList = null;

      let ele_listInfoText = UI.create_info_block('You have been invited to&nbsp;work together on&nbsp;the list', 'Accept invitation');

      ele_listInfoText.querySelector('#sl-info-block-button').addEventListener('click', () => {
        sl.SL_Id = hub.LastID++;
        hub.ShoppingLists.push(sl);
        hub.CurrentList = sl.SL_Id;
        UI.draw_list_of_lists();
        UI.draw_list(hub.get_current_list(), true);
        hub.save();
      });
      document.querySelector('#shoplist-list').insertBefore(ele_listInfoText, document.querySelector('#shoplist-list').firstElementChild);
    }
    
    const url = window.location.href;
    const cleanUrl = url.split('?')[0];
    window.history.replaceState(null, null, cleanUrl);
  }

  UI.draw_list_of_lists();
}


document.addEventListener('DOMContentLoaded', event_load);