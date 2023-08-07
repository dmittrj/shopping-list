class ShoppingList {
    constructor(name, id) {
        this.SL_Name = name;
        this.SL_Id = id;
        this.SL_Items = [];
        this.SL_LastID = 0;
    }

    save() {

    }

    append(sl_item) {
        this.SL_Items.push(sl_item);
        hub.save();
        return sl_item;
    }


    drop(id) {
      this.SL_Items = this.SL_Items.filter((w) => w.SLI_Id !== id);
    }

    get_item_by_id(id) {
      return this.SL_Items.find((w) => w.SLI_Id === id);
    }
}
  

class ShoppingListItem {
    constructor(name, cost, amount, checked, id) {
      this.SLI_Name = name;
      this.SLI_Cost = cost;
      this.SLI_Amount = amount;
      this.SLI_Checked = checked;
      this.SLI_Id = id;
  
      this.Removed = false;
    }


    edit(name, cost, amount) {
      this.SLI_Name = name;
      this.SLI_Cost = cost;
      this.SLI_Amount = amount;
    }
}
  
  
class UI {
    static clear_list() {
      document.querySelector('#shoplist-list').innerHTML = '';
    }


    static create_item(name, cost, amount, checked, translucent) {
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
          UI.toggle_mark_item(ele_listItemCB_cb.parentElement.parentElement.parentElement);
          hub.save();
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


    static create_add() {
      let ele_ListItemAdd = UI.create_item('Add...', '', '', false, true);
      ele_ListItemAdd.style.opacity = OPACITY_LEVEL;
      ele_ListItemAdd.id = 'shoplist-add-pseudoitem';
      ele_ListItemAdd.querySelector('.shoplist-list-item-text').addEventListener('click', UI.display_new_item_field);
      return ele_ListItemAdd;
    }


    static append_item(list_item) {
      var ele_ListItem = UI.create_item(list_item.SLI_Name, list_item.SLI_Cost, list_item.SLI_Amount, list_item.SLI_Checked, false);
      ele_ListItem.id = 'shopping-list-item-' + list_item.SLI_Id;
      ele_ListItem.querySelector('.shoplist-list-item-text').addEventListener('click', () => { UI.display_edit_item_field(ele_ListItem) });

      document.querySelector(".shoplist-list").appendChild(ele_ListItem);
      
      if (document.querySelector('#shoplist-add-pseudoitem')) {
        document.querySelector('#shoplist-add-pseudoitem').remove();
        UI.append_add();
        UI.turn_add_to_input();
      }

      return ele_ListItem;
    }


    static get_list_item_by_its_input(input_item) {
      return input_item.parentElement.parentElement;
    }


    static display_new_item_field() {
      const ele_ListItemAdd = document.querySelector('#shoplist-add-pseudoitem');
      const ele_ListItemAddText = ele_ListItemAdd.querySelector('.shoplist-list-item-text');
      UI.stop_inputing();
    
      if (ele_ListItemAddText) {
        UI.turn_add_to_input();
      } else {
        UI.append_add();
        UI.turn_add_to_input();
      }
    }


    static display_edit_item_field(item) {
      UI.stop_inputing();
      if (!document.querySelector('#shoplist-add-pseudoitem')) {
        UI.append_add();
      }
      UI.turn_item_to_input(item);
    }


    static create_input(action_by_enter) {
      const ele_ListItemTextInput = document.createElement('input');
      ele_ListItemTextInput.classList.add('shoplist-list-item-textbox');
      ele_ListItemTextInput.setAttribute('spellcheck', 'false');
    
      if (action_by_enter == 'add') {
        ele_ListItemTextInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            if (ele_ListItemTextInput.value === '') {
              UI.turn_input_to_add(UI.get_list_item_by_its_input(ele_ListItemTextInput));
            } else {
              let new_item_content = parse_item(ele_ListItemTextInput.value);
              let new_item = hub.get_current_list().append(new ShoppingListItem(new_item_content.name, new_item_content.cost, new_item_content.amount, false, hub.get_current_list().SL_LastID++));
              UI.append_item(new_item);
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
              hub.get_current_list().drop(+UI.get_list_item_by_its_input(ele_ListItemTextInput).id.substring(19));
              hub.save();
              get_list_item_by_its_input(ele_ListItemTextInput).remove();
            } else {
              let edited_item = UI.turn_input_to_item(UI.get_list_item_by_its_input(ele_ListItemTextInput));
              hub.get_current_list().get_item_by_id(+edited_item.id.substring(19)).edit(ele_ListItemTextInput.value, null, null);
              hub.save();
            }
          }
        });
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
      
      const ele_ListItemTextInput = UI.create_input('edit');
      ele_ListItemTextInput.value = ele_ListItemText.innerText;
    
      ele_ListItemText.replaceWith(ele_ListItemTextInput);
      ele_ListItemTextInput.focus();
    }
    
    
    static turn_input_to_add(input_item) {
      let ele_ListItem = UI.create_add();
    
      input_item.replaceWith(ele_ListItem);
    }
    
    
    static turn_input_to_item(input_item) {
      let parsed = parse_item(input_item.querySelector('.shoplist-list-item-textbox').value);
      let ele_ListItem = UI.create_item(parsed.name, parsed.cost, parsed.amount, false);
      ele_ListItem.querySelector('.shoplist-list-item-text').addEventListener('click', () => {UI.display_edit_item_field(ele_ListItem)});
      ele_ListItem.id = input_item.id;
    
    
      input_item.replaceWith(ele_ListItem);
    
      return ele_ListItem;
    }


    static draw_list(list) {
      document.querySelector('#shoplist-title').innerText = list.SL_Name;
      UI.clear_list();

      for (let i = 0; i < list.length; i++) {
        const list_item = list[i];
        UI.append_item(list_item);
      }

      UI.append_add();
    }


    static stop_inputing() {
      let eles_ListItemTB = document.querySelectorAll('.shoplist-list-item-textbox');
    
      for (let i = 0; i < eles_ListItemTB.length; i++) {
        const ele_ListItemTB = eles_ListItemTB[i];
        if (ele_ListItemTB.value === '') {
          if (!(UI.get_list_item_by_its_input(ele_ListItemTB).id == 'shoplist-add-pseudoitem')) {
            hub.get_current_list().drop(+UI.get_list_item_by_its_input(ele_ListItemTB).id.substring(19));
            hub.save();
          }
          UI.get_list_item_by_its_input(ele_ListItemTB).remove();
        } else {
          let edited_item = UI.turn_input_to_item(UI.get_list_item_by_its_input(ele_ListItemTB));
          hub.get_current_list().get_item_by_id(+edited_item.id.substring(19)).edit(ele_ListItemTB.value, null, null);
          hub.save();
        }
      }
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
  
    open() {
      this.add_list('Shopping List');
      this.CurrentList = 0;
    }

    save() {
      let temp_shopping_lists = [];
      this.ShoppingLists.forEach(sl => {
        let temp_shopping_list = [];
        sl.SL_Items.forEach(sl_item => {
          temp_shopping_list.push({"name": sl_item.SLI_Name,
                                   "cost": sl_item.SLI_Cost,
                                   "amount": sl_item.SLI_Amount});
        });
        temp_shopping_lists.push({"name": sl.SL_Name,
                                  "items": temp_shopping_list});
      });
      const shopping_list_string = JSON.stringify(temp_shopping_lists);

      document.cookie = `shopping_list=${shopping_list_string}; expires=Fri, 31 Dec 9999 23:59:59 GMT"`;
    }

    add_list(name) {
      this.ShoppingLists.push(new ShoppingList(name, this.LastID++));
    }

    get_current_list() {
      return this.ShoppingLists.find((w) => w.SL_Id === this.CurrentList);
    }
}