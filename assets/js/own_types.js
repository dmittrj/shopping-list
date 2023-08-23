class ShoppingList {
    constructor(name, id) {
        this.SL_Name = name;
        this.SL_Id = id;
        this.SL_Items = [];
        this.SL_LastID = 0;

        this.SL_Removed = false;
    }

    save() {

    }

    append(sl_item) {
        this.SL_Items.push(sl_item);
        hub.save();
        return sl_item;
    }


    drop_item(id) {
      this.SL_Items = this.SL_Items.filter((w) => w.SLI_Id !== id);
    }

    get_item_by_id(id) {
      return this.SL_Items.find((w) => w.SLI_Id === id);
    }


    get_checked() {
      return this.SL_Items.find((w) => w.SLI_Checked && !w.SLI_Removed);
    }
}
  

class ShoppingListItem {
    constructor(name, cost, amount, checked, id) {
      this.SLI_Name = name;
      this.SLI_Cost = cost;
      this.SLI_Amount = amount;
      this.SLI_Checked = checked;
      this.SLI_Id = id;
  
      this.SLI_Removed = false;
    }


    edit_name(new_name) {
      this.SLI_Name = new_name;
    }


    edit_cost(new_cost) {
      this.SLI_Cost = new_cost;
    }
}
  
  
class UI {
    static clear_list() {
      document.querySelector('#shoplist-list').innerHTML = '';
    }


    static delete_ticked_toggle_visibility() {
      document.querySelector('#shoplist-delete-ticked').style.display = (hub.get_current_list().get_checked()) ? 'inline-block' : 'none';
    }


    static add_item_toggle_visibility() {
      document.querySelector('#shoplist-add-item').style.display = (hub.get_current_list().SL_Removed) ? 'none' : 'inline-block';
    }


    static mark_item(item, checked_status) {
      if (checked_status) {
        item.querySelector('.shoplist-list-item-checkbox').classList.add('sl-item-checkbox-ticked');
      } else {
        item.querySelector('.shoplist-list-item-checkbox').classList.remove('sl-item-checkbox-ticked');
        if (hub.get_current_list().get_item_by_id(get_id_by_ui_item(item)).SLI_Removed) {
          unremove_ticked(item.querySelector('.shoplist-list-item-right'), hub.get_current_list().get_item_by_id(get_id_by_ui_item(item)));
        }
      }
      UI.delete_ticked_toggle_visibility();
    }


    static create_item(name, cost, amount, checked, id, translucent) {
      var ele_ListItem = document.createElement('div');
      ele_ListItem.className = 'shoplist-list-item';
      ele_ListItem.id = id;
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
          hub.save();
        });
      }
      if (checked) {
        ele_listItemCB_cb.classList.add('sl-item-checkbox-ticked');
      }
      
      ele_ListItemCB.appendChild(ele_listItemCB_cb);

      let ele_ListItemText = document.createElement('div');
      ele_ListItemText.className = 'shoplist-list-item-text';
      ele_ListItemText.innerText = name;
      ele_ListItemLeft.appendChild(ele_ListItemText);

      let ele_ListItemRight = document.createElement('div');
      ele_ListItemRight.className = 'shoplist-list-item-right';

      let ele_ListItemRightCost = document.createElement('div');
      ele_ListItemRightCost.innerText = cost;

      // let ele_ListItemRightAmount = document.createElement('div');
      // ele_ListItemRightAmount.innerText = amount.length === 0 ? '' : 'x' + amount;

      ele_ListItemRight.appendChild(ele_ListItemRightCost);
      // ele_ListItemRight.appendChild(ele_ListItemRightAmount);

      ele_ListItem.appendChild(ele_ListItemRight);

      return ele_ListItem;
    }


    static create_add() {
      let ele_ListItemAdd = UI.create_item('Add...', '', '', false, 'shoplist-add-pseudoitem', true);
      ele_ListItemAdd.style.opacity = OPACITY_LEVEL;
      ele_ListItemAdd.querySelector('.shoplist-list-item-text').addEventListener('click', UI.display_new_item_field);
      return ele_ListItemAdd;
    }


    static append_item(list_item) {
      var ele_ListItem = UI.create_item(list_item.SLI_Name, list_item.SLI_Cost, list_item.SLI_Amount, list_item.SLI_Checked, 'shopping-list-item-' + list_item.SLI_Id, false);

      UI.assign_click_actions(ele_ListItem, 'item');
      
      document.querySelector(".shoplist-list").appendChild(ele_ListItem);
      
      if (document.querySelector('#shoplist-add-pseudoitem')) {
        document.querySelector('#shoplist-add-pseudoitem').remove();
        UI.append_add();
        UI.turn_add_to_input();
      }

      if (list_item.SLI_Checked) {
        UI.mark_item(ele_ListItem, true);
      }

      if (list_item.SLI_Removed) {
        let right_side = document.querySelector('#shopping-list-item-' + String(list_item.SLI_Id)).querySelector('.shoplist-list-item-right');
        right_side.innerHTML = '';
        
        let ele_ListItemRight_a = document.createElement('a');
        ele_ListItemRight_a.innerText = 'Unremove';
        ele_ListItemRight_a.addEventListener('click', () => {
          unremove_ticked(right_side, list_item);
        })
        right_side.appendChild(ele_ListItemRight_a);
      }

      return ele_ListItem;
    }


    static get_list_item_by_its_input(input_item) {
      return input_item.parentElement.parentElement;
    }


    static display_new_item_field() {
      const ele_ListItemAdd = document.querySelector('#shoplist-add-pseudoitem');
      const ele_ListItemAddText = ele_ListItemAdd?.querySelector('.shoplist-list-item-text');
      UI.stop_inputing();
    
      if (ele_ListItemAddText === null) {
        UI.append_add();
      }
      UI.turn_add_to_input();
    }


    static display_edit_item_field(item) {
      UI.stop_inputing();
      if (!document.querySelector('#shoplist-add-pseudoitem')) {
        UI.append_add();
      }
      UI.make_item_editable(item, 'name');
    }


    static display_edit_cost_field(item) {
      UI.stop_inputing();
      if (!document.querySelector('#shoplist-add-pseudoitem')) {
        UI.append_add();
      }
      UI.turn_cost_to_input(item);
    }


    static assign_click_actions(item, item_type) {
      if (item_type == 'item') {
        item.querySelector('.shoplist-list-item-text').addEventListener('click', () => {UI.display_edit_item_field(item)});
        item.querySelector('.shoplist-list-item-right div').addEventListener('click', () => {UI.display_edit_cost_field(item)});
      }
    }


    static create_input(action_by_enter) {
      const ele_ListItemTextInput = document.createElement('input');
      ele_ListItemTextInput.classList.add('shoplist-list-item-textbox');
      ele_ListItemTextInput.setAttribute('spellcheck', 'false');
    
      if (action_by_enter == 'add') {
        ele_ListItemTextInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            ele_ListItemTextInput.onblur = null;
            if (ele_ListItemTextInput.value === '') {
              UI.turn_input_to_add(UI.get_list_item_by_its_input(ele_ListItemTextInput));
            } else {
              let new_item_content = parse_item(ele_ListItemTextInput.value);
              let new_item = hub.get_current_list().append(new ShoppingListItem(new_item_content.name, new_item_content.cost, new_item_content.amount, false, hub.get_current_list().SL_LastID++));
              UI.append_item(new_item);
            }
          }
        });

        ele_ListItemTextInput.onblur = function() {
          if (ele_ListItemTextInput.value === '') {
            UI.turn_input_to_add(UI.get_list_item_by_its_input(ele_ListItemTextInput));
          } else {
            let new_item_content = parse_item(ele_ListItemTextInput.value);
            let new_item = hub.get_current_list().append(new ShoppingListItem(new_item_content.name, new_item_content.cost, new_item_content.amount, false, hub.get_current_list().SL_LastID++));
            UI.append_item(new_item);
            if (document.querySelector('#shoplist-add-pseudoitem')) {
              document.querySelector('#shoplist-add-pseudoitem input').onblur = null;
              document.querySelector('#shoplist-add-pseudoitem').remove();
            }
            UI.append_add();
          }
        }

      } else if (action_by_enter == 'edit-name') {
        ele_ListItemTextInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            ele_ListItemTextInput.onblur = null;
            if (ele_ListItemTextInput.value === '') {
              hub.get_current_list().drop_item(+UI.get_list_item_by_its_input(ele_ListItemTextInput).id.substring(19));
              hub.save();
              UI.get_list_item_by_its_input(ele_ListItemTextInput).remove();
            } else {
              let edited_item = UI.turn_input_to_item(UI.get_list_item_by_its_input(ele_ListItemTextInput));
              hub.get_current_list().get_item_by_id(+edited_item.id.substring(19)).edit_name(ele_ListItemTextInput.value);
              hub.save();
            }
          }
        });

        ele_ListItemTextInput.onblur = function() {
          if (ele_ListItemTextInput.value === '') {
            hub.get_current_list().drop_item(+UI.get_list_item_by_its_input(ele_ListItemTextInput).id.substring(19));
            hub.save();
            UI.get_list_item_by_its_input(ele_ListItemTextInput).remove();
          } else {
            let edited_item = UI.turn_input_to_item(UI.get_list_item_by_its_input(ele_ListItemTextInput));
            hub.get_current_list().get_item_by_id(+edited_item.id.substring(19)).edit_name(ele_ListItemTextInput.value);
            hub.save();
          }
        };
      } else if (action_by_enter == 'edit-cost') {
        ele_ListItemTextInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            ele_ListItemTextInput.onblur = null;
            let edited_item = UI.turn_input_to_cost(UI.get_list_item_by_its_input(ele_ListItemTextInput));
            hub.get_current_list().get_item_by_id(+edited_item.id.substring(19)).edit_cost(ele_ListItemTextInput.value);
            hub.save();
          }
        });

        ele_ListItemTextInput.onblur = function() {
          ele_ListItemTextInput.onblur = null;
          let edited_item = UI.turn_input_to_cost(UI.get_list_item_by_its_input(ele_ListItemTextInput));
          hub.get_current_list().get_item_by_id(+edited_item.id.substring(19)).edit_cost(ele_ListItemTextInput.value);
          hub.save();
        };
      }
    
      return ele_ListItemTextInput;
    }


    static append_add() {
      var ele_ListItem = UI.create_add();
      document.querySelector("#shoplist-list").appendChild(ele_ListItem);
      return ele_ListItem;
    }


    static turn_add_to_input() {
      const ele_ListItemAdd = document.querySelector('#shoplist-add-pseudoitem');
      const ele_ListItemAddText = ele_ListItemAdd.querySelector('.shoplist-list-item-text');
      
      const ele_ListItemTextInput = UI.create_input('add');
      ele_ListItemAdd.style.opacity = '1';
    
      ele_ListItemAddText.replaceWith(ele_ListItemTextInput);
      ele_ListItemTextInput.focus();
    }
    
    
    static turn_item_to_input(item) {
      const ele_ListItemText = item.querySelector('.shoplist-list-item-text');
      
      const ele_ListItemTextInput = UI.create_input('edit-name');
      ele_ListItemTextInput.value = ele_ListItemText.innerText;
    
      ele_ListItemText.replaceWith(ele_ListItemTextInput);
      ele_ListItemTextInput.focus();
    }


    static turn_cost_to_input(item) {
      const ele_ListItemText = item.querySelector('.shoplist-list-item-right div');
      
      const ele_ListItemTextInput = UI.create_input('edit-cost');
      ele_ListItemTextInput.value = ele_ListItemText.innerText;
      ele_ListItemTextInput.style.textAlign = 'right';
    
      ele_ListItemText.replaceWith(ele_ListItemTextInput);
      ele_ListItemTextInput.focus();
    }


    static make_item_editable(item, element_to_edit) {
      if (element_to_edit == 'name') {
        UI.turn_item_to_input(item);
      } else if (element_to_edit == 'cost') {
        UI.turn_cost_to_input(item);
      }
    }
    
    
    static turn_input_to_add(input_item) {
      let ele_ListItem = UI.create_add();
    
      input_item.replaceWith(ele_ListItem);
    }


    static make_item_uneditable(item) {

    }
    
    
    static turn_input_to_item(input_item) {
      let id = +input_item.id.substring(19);
      let ele_ListItem = UI.create_item(input_item.querySelector('.shoplist-list-item-textbox').value, hub.get_current_list().get_item_by_id(id).SLI_Cost, hub.get_current_list().get_item_by_id(id).SLI_Amount, hub.get_current_list().get_item_by_id(id).SLI_Checked, input_item.id, false);
      UI.assign_click_actions(ele_ListItem, 'item');

    
      input_item.replaceWith(ele_ListItem);
    
      return ele_ListItem;
    }


    static turn_input_to_cost(input_item) {
      let id = +input_item.id.substring(19);
      let ele_ListItem = UI.create_item(hub.get_current_list().get_item_by_id(id).SLI_Name, input_item.querySelector('.shoplist-list-item-textbox').value, hub.get_current_list().get_item_by_id(id).SLI_Amount, hub.get_current_list().get_item_by_id(id).SLI_Checked, input_item.id, false);
      UI.assign_click_actions(ele_ListItem, 'item');
    
      input_item.replaceWith(ele_ListItem);
    
      return ele_ListItem;
    }


    static turn_input_to_title() {
      if (document.querySelector('#shoplist-title').value === '') {
        if (hub.get_current_list().SL_Name === '') {
          hub.get_current_list().SL_Name = 'Shopping List';
        }
        document.querySelector('#shoplist-title').value = hub.get_current_list().SL_Name;
      }
      hub.get_current_list().SL_Name = document.querySelector('#shoplist-title').value;

      let eleTitle_input = document.createElement('h1');
      eleTitle_input.classList.add('shoplist-title');
      eleTitle_input.innerText = document.querySelector('#shoplist-title').value;
      eleTitle_input.id = 'shoplist-title';
      document.querySelector('#shoplist-title').replaceWith(eleTitle_input);

      UI.draw_list_of_lists();

      let ele_listTitle_span = document.createElement('span');
      ele_listTitle_span.classList.add('shoplist-title-button');
      ele_listTitle_span.addEventListener('click', () => {
        UI.toggle_lists_list_display();
      });

      document.querySelector('#shoplist-title').appendChild(ele_listTitle_span);
    }


    static turn_title_to_input() {
      let eleTitle_input = document.createElement('input');
      eleTitle_input.classList.add('shoplist-title-input');
      eleTitle_input.value = document.querySelector('#shoplist-title').innerText;
      eleTitle_input.id = 'shoplist-title';
      eleTitle_input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          eleTitle_input.onblur = null;
          UI.turn_input_to_title();
          hub.save();
        }
      });

      eleTitle_input.onblur = function() {
        eleTitle_input.onblur = null;
        UI.turn_input_to_title();
        hub.save();
      };
      document.querySelector('#shoplist-title').replaceWith(eleTitle_input);
      eleTitle_input.select();
    }


    static toggle_lists_list_display() {
      let isListOfListsVisible = document.querySelector('#shopping-lists-list').getAttribute('data-visible');
      isListOfListsVisible = isListOfListsVisible == 'true' ? 'false' : 'true';
      document.querySelector('#shopping-lists-list').setAttribute('data-visible', isListOfListsVisible);
    }


    static draw_list(list) {
      document.querySelector('#shoplist-title').innerText = list.SL_Name;

      let ele_listTitle_span = document.createElement('span');
      ele_listTitle_span.classList.add('shoplist-title-button');
      ele_listTitle_span.addEventListener('click', () => {
        UI.toggle_lists_list_display();
      });

      document.querySelector('#shoplist-title').appendChild(ele_listTitle_span);
      UI.clear_list();

      UI.delete_ticked_toggle_visibility();
      UI.add_item_toggle_visibility();

      if (list.SL_Removed) {
        let ele_listInfoText = document.createElement('p');
        ele_listInfoText.innerText = 'This list has been removed';
        ele_listInfoText.classList.add('shoplist-list-info-text');

        let ele_listInfoTextBr = document.createElement('br');

        let ele_listInfoTextRestoreButton = document.createElement('a');
        ele_listInfoTextRestoreButton.innerText = 'Restore';
        ele_listInfoTextRestoreButton.classList.add('shoplist-list-info-text');
        ele_listInfoTextRestoreButton.classList.add('shoplist-list-info-link');
        ele_listInfoTextRestoreButton.addEventListener('click', () => {
          list.SL_Removed = false;
          UI.draw_list(list);

          hub.save();
        });

        document.querySelector('#shoplist-list').appendChild(ele_listInfoText);
        ele_listInfoText.appendChild(ele_listInfoTextBr);
        ele_listInfoText.appendChild(ele_listInfoTextRestoreButton);
        return;
      }

      for (let i = 0; i < list.SL_Items.length; i++) {
        const list_item = list.SL_Items[i];
        UI.append_item(list_item);
      }

      UI.append_add();
    }


    static draw_list_of_lists() {
      document.querySelector('#shopping-lists-list list').innerHTML = '';

      hub.ShoppingLists.forEach(s_list => {
        let _ele_slListsList_li = document.createElement('li');
        _ele_slListsList_li.innerText = s_list.SL_Name;

        if (s_list.SL_Id == hub.CurrentList) {
          _ele_slListsList_li.classList.add('sl-list-current');
        } else {
          _ele_slListsList_li.addEventListener('click', () => {
            hub.switch_list(s_list.SL_Id);
            UI.draw_list_of_lists();
            UI.draw_list(hub.get_current_list());
            UI.toggle_lists_list_display();
          });
        }

        document.querySelector('#shopping-lists-list list').appendChild(_ele_slListsList_li);
      });

      let ele_slListsList_li = document.createElement('li');
      ele_slListsList_li.innerText = 'Add list...';
      ele_slListsList_li.addEventListener('click', () => {
        let new_list = hub.add_list('New list');
        hub.switch_list(new_list.SL_Id);
        UI.draw_list_of_lists();
        UI.draw_list(hub.get_current_list());
        UI.turn_title_to_input();
        UI.toggle_lists_list_display();
        hub.save();
      })

      document.querySelector('#shopping-lists-list list').appendChild(ele_slListsList_li);
    }


    static stop_inputing() {
      let eles_ListItemTB = document.querySelectorAll('.shoplist-list-item-textbox');
    
      for (let i = 0; i < eles_ListItemTB.length; i++) {
        const ele_ListItemTB = eles_ListItemTB[i];
        if (ele_ListItemTB.value === '') {
          if (!(UI.get_list_item_by_its_input(ele_ListItemTB).id == 'shoplist-add-pseudoitem')) {
            hub.get_current_list().drop_item(+UI.get_list_item_by_its_input(ele_ListItemTB).id.substring(19));
            hub.save();
          }
          UI.get_list_item_by_its_input(ele_ListItemTB).remove();
        } else {
          let edited_item = UI.turn_input_to_item(UI.get_list_item_by_its_input(ele_ListItemTB));
          hub.get_current_list().get_item_by_id(+edited_item.id.substring(19)).edit_name(ele_ListItemTB.value);
          hub.save();
        }
      }
    }


    static open_options_popup() {
      document.querySelector('#shoplist-pop-up').style.display = 'block';
    }


    static close_options_popup() {
      document.querySelector('#shoplist-pop-up').style.display = 'none';
    }
}
  
  
class Hub {
    constructor() {
      this.ShoppingLists = [];
      this.CurrentList = 0;
      this.LastID = 0;
    }


    get_cookies() {
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

    app_to_string() {
      let temp_shopping_lists = [];
      this.ShoppingLists.forEach(sl => {
        if (sl.SL_Removed) {
          return;
        }
        let temp_shopping_list = [];
        sl.SL_Items.forEach(sl_item => {
          if (sl_item.SLI_Removed) {
            return;
          }
          temp_shopping_list.push({"name": sl_item.SLI_Name,
                                   "cost": sl_item.SLI_Cost,
                                   "amount": sl_item.SLI_Amount,
                                   "checked": sl_item.SLI_Checked});
        });
        temp_shopping_lists.push({"name": sl.SL_Name,
                                  "items": temp_shopping_list});
      });
      let cookie_to_save = {
        "version": 'v1.1',
        "current_list": this.CurrentList,
        "content": temp_shopping_lists
      }
      const shopping_list_string = JSON.stringify(cookie_to_save);
      return shopping_list_string;
    }


    open_v1(cookies) {
      cookies?.content.forEach(sl => {
        let new_item = this.add_list(sl.name, this.LastID++);
        this.CurrentList = this.LastID - 1;
        sl.items.forEach(sl_item => {
          new_item.append(new ShoppingListItem(sl_item.name, sl_item.cost, sl_item.amount, sl_item.checked, new_item.SL_LastID++));
        });
      });

      if (cookies?.content.length == 0) {
        this.add_list('Shopping List');
        this.CurrentList = 0;
      }
    }
  

    open() {
      let cookies = this.get_cookies();

      if (cookies?.version == 'v1') {
        this.open_v1(cookies);
        return;
      }

      if (cookies?.version == 'v1.1' || (localStorage?.shopping_list && JSON.parse(localStorage?.shopping_list).version == 'v1.1')) {
        if (cookies?.version == 'v1.1') {
          this.open_v1(cookies);
        } else {
          this.open_v1(JSON.parse(localStorage?.shopping_list));
        }
        return;
      }

      this.add_list('Shopping List');
      this.CurrentList = this.LastID - 1;
      return;

    }

    save() {
      const shopping_list_string = this.app_to_string();
      if (this.ShoppingLists.length == 1 && this.ShoppingLists[0].SL_Items.length <= 10) {
        document.cookie = `shopping_list=${shopping_list_string}; expires=Fri, 31 Dec 9999 23:59:59 GMT"`;
        localStorage.removeItem("shopping_list");
      } else {
        document.cookie = `shopping_list=; expires=Fri, 31 Dec 9999 23:59:59 GMT"`;
        localStorage.shopping_list = shopping_list_string;
      }
    }

    add_list(name) {
      let new_list = new ShoppingList(name, this.LastID++);
      this.ShoppingLists.push(new_list);
      return new_list;
    }

    get_current_list() {
      return this.ShoppingLists.find((w) => w.SL_Id === this.CurrentList);
    }

    switch_list(id) {
      this.CurrentList = id;
    }
}