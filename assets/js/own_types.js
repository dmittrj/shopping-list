class ShoppingList {
    constructor(name) {
        this.SL_Name = name;
        this.SL_Items = [];
        this.SL_LastID = 1;
    }

    save() {

    }

    append(sl_item) {
        this.SL_Items.push(sl_item);
    }
}
  

class ShoppingListItem {
    constructor(name, cost, amount, checked) {
      this.SLI_Name = name;
      this.SLI_Cost = cost;
      this.SLI_Amount = amount;
      this.SLI_Checked = checked;
  
      this.Removed = false;
    }
}
  
  
class UI {
    constructor() {
      
    }
  
    static m() {
  
    }
}
  
  
class Hub {
    constructor() {
      this.ShoppingLists = [];
    }
  
    open() {
      this.ShoppingLists.push(new ShoppingList('Shopping List'));
    }
}