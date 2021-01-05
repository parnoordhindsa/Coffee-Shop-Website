function start() {
  loadEditMenu();
  loadCustomer();
  makeOrderTable();
}

window.onload = start;

// MENU

function loadEditMenu() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8080/Menu", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      menu = JSON.parse(this.responseText);
      var menuTable =
        "<table style='background-color:rgba(0,0,0,0.1);width:100%;margin-right:20%' border='2' id='menu-table'>";
      if (menu.length > 0) {
        for (row in menu) {
          menuTable +=
            "<tr id='" +
            menu[row].menuID +
            "'><td>" +
            menu[row].item +
            "</td><td>" +
            "$" +
            menu[row].price +
            "</td><td style='background-color:rgba(0,0,0,0.2)'><button style='background-color:rgba(0,0,0,0);border:none;font-size:15px;font-weight:700;color:white;cursor:pointer;' id='changePrice" +
            menu[row].menuID +
            "'onclick = 'changeItemPrice(" +
            menu[row].menuID +
            ")'>Change Price</button></td><td style='background-color:rgba(0,0,0,0.2)'><button style='background-color:rgba(0,0,0,0);border:none;font-size:15px;font-weight:700;color:white;cursor:pointer;' id='removeItemFromMenu" +
            menu[row].menuID +
            "'onclick = 'removeItemFromMenu(" +
            menu[row].menuID +
            ")'>Remove</button></td></tr>";
        }
        menuTable += "</table>";
        document.getElementById("menu-div").innerHTML = menuTable;
      } else {
        document.getElementById("menu-div").innerHTML =
          "The menu is currently empty.";
      }

      var arrayC = [];
      for (row in menu) {
        let id = document.getElementById("changePrice" + menu[row].menuID);
        arrayC.push(id);
      }
      var arrayC = [];
      for (row in menu) {
        let id = document.getElementById(
          "removeItemFromMenu" + menu[row].menuID
        );
        arrayC.push(id);
      }
    }
  };
}

function changeItemPrice(id) {
  var newPrice = prompt("Enter new price: ");
  if (newPrice != null) {
    var xhttp = new XMLHttpRequest();
    xhttp.open(
      "PUT",
      "http://localhost:8080/changeItemPrice/" + id + "/" + newPrice,
      true
    );
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        loadEditMenu();
      }
    };
    row = { menuID: id, price: newPrice };
  }
}

function removeItemFromMenu(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8080/removeItemFromMenu/" + id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      loadEditMenu();
    }
  };
}

function addItemToMenu() {
  var xhttp = new XMLHttpRequest();
  var params =
    "item=" +
    document.getElementById("menu-item").value +
    "&price=" +
    document.getElementById("item-price").value;
  xhttp.open("POST", "http://localhost:8080/addItemToMenu", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(params);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      loadEditMenu();
    }
  };
}

// CUSTOMER

var order = {};
var item = {};
var itemPrice = {};
var customer;

function loadCustomer() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8080/Menu", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      customer = JSON.parse(this.responseText);
      var customerTable =
        "<table style='background-color:rgba(0,0,0,0.1)' border='2' id='menu-table'>";
      if (customer.length > 0) {
        for (row in customer) {
          customerTable +=
            "<tr id='" +
            customer[row].menuID +
            "'><td>" +
            customer[row].item +
            "</td><td>" +
            "$" +
            customer[row].price +
            "</td><td style='background-color:rgba(0,0,0,0.2)'><button style='background-color:rgba(0,0,0,0);border:none;font-size:15px;font-weight:700;color:white;cursor:pointer;' id='addItem" +
            customer[row].menuID +
            "' onclick ='addItemToOrder(" +
            customer[row].menuID +
            ")'>Add</button></td><td style='background-color:rgba(0,0,0,0.2)'><button style='background-color:rgba(0,0,0,0);border:none;font-size:15px;font-weight:700;color:white;cursor:pointer;' id='removeItem" +
            customer[row].menuID +
            "' onclick ='removeItemFromOrder(" +
            customer[row].menuID +
            ")'>Remove</button></tr>";
        }
        customerTable += "</table>";
        document.getElementById("menuShow").innerHTML = customerTable;
      } else {
        document.getElementById("menuShow").innerHTML =
          "Sorry, Nothing's here!";
      }

      var arrayC = [];
      for (row in customer) {
        let id = document.getElementById("addItem" + customer[row].menuID);
        arrayC.push(id);
      }
      var arrayC = [];
      for (row in customer) {
        let id = document.getElementById("removeItem" + customer[row].menuID);
        arrayC.push(id);
      }
      var myDate = new Date();
      var hrs = myDate.getHours();
      var greet;
      if (hrs < 12) {
        greet = "Good Morning";
      } else if (hrs >= 12 && hrs <= 17) {
        greet = "Good Afternoon";
      } else if (hrs >= 17 && hrs <= 24) {
        greet = "Good Evening";
      }
      document.getElementById("lblGreetings").innerHTML =
        " <p style=text-align:center;margin-top:5%> <b>" +
        greet +
        "</b> and welcome to Coffee Shop! </p>";
    }
  };
}

function showOrders() {
  var customerTable =
    "<table style='background-color:rgba(0,0,0,0.1)' border='2' id='order-table'>";
  customerTable +=
    "<tr><th style='font-weight:400'>Item</th><th style='font-weight:400'>Price</th><th style='font-weight:400'>Quantity</th>";
  for (itm in order) {
    customerTable +=
      "<tr><td>" +
      item[itm] +
      "</td><td>" +
      itemPrice[itm] +
      "</td><td>" +
      order[itm] +
      "</td>";
  }

  customerTable +=
    "<tr><td>Total Price</td><td></td><td>" + totalOrderPrice() + "</td>";
  customerTable += "</table>";
  document.getElementById("selectItem").innerHTML = customerTable;
}

function addItemToOrder(itemID) {
  if (!(itemID in order)) {
    order[itemID] = 1;
    for (row in customer) {
      if (itemID == customer[row].menuID) {
        item[itemID] = customer[row].item;
        itemPrice[itemID] = customer[row].price;
      }
    }
  } else {
    order[itemID] += 1;
  }

  showOrders();
}

function removeItemFromOrder(itemID) {
  if (itemID in order) {
    order[itemID] -= 1;
    if (order[itemID] == 0) {
      delete order[itemID];
      delete item[itemID];
      delete itemPrice[itemID];
    }
  }

  showOrders();
}

function addOrder() {
  if (Object.keys(order).length == 0) {
    alert("You must grab something first!!");
  } else {
    var orderData = {};
    orderData[item[Object.keys(item)[0]]] = order[Object.keys(order)[0]];

    var totalPrice = totalOrderPrice();
    var params =
      "detail=" +
      JSON.stringify(orderData) +
      "&total=" +
      totalPrice +
      "&isCompleted=0";
    var http = new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/addOrder", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        var orderNumber = http.responseText;
        alert("Here is your Order Number: " + orderNumber);
        document.getElementById("selectItem").innerHTML = "";
        order = {};
      }
    };
    http.send(params);
  }
}

function totalOrderPrice() {
  var total = 0.0;
  for (row in customer) {
    if (customer[row].menuID in order) {
      total += customer[row].price * order[customer[row].menuID];
    }
  }

  return total;
}

// DISPLAY ORDERS

var displayOrder;

function makeOrderTable() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8080/upcomingOrders", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      displayOrder = JSON.parse(this.responseText);
      var orderTable =
        "<table style='background-color:rgba(0,0,0,0.1);width:110%;margin-left:-5%' border='2' id='order-table'>";
      for (row in displayOrder) {
        orderTable +=
          "<tr id='" +
          displayOrder[row].orderID +
          "'><td>" +
          "Order Number: " +
          displayOrder[row].orderID +
          "</td><td>" +
          "Order Details: " +
          displayOrder[row].orderDetail +
          "</td><td>" +
          "Total Price: $" +
          displayOrder[row].totalPrice +
          "</td><td style='background-color:rgba(0,0,0,0.2)'><button style='background-color:rgba(0,0,0,0);border:none;font-size:15px;font-weight:700;color:white;cursor:pointer;' id='orderCompleted" +
          displayOrder[row].orderID +
          "'onclick='completedOrder(" +
          displayOrder[row].orderID +
          ")'>Complete</button></td></tr>";
      }
      orderTable += "</table>";

      document.getElementById("allOrders").innerHTML = orderTable;
      var arrayC = [];
      for (row in displayOrder) {
        var id = document.getElementById(
          "orderCompleted" + displayOrder[row].orderID
        );
        arrayC.push(id);
      }
    }
  };
}

function completedOrder(rowID) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      makeOrderTable();
    }
  };

  xhttp.open("PUT", "http://localhost:8080/completedOrders/" + rowID, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

setTimeout(makeOrderTable, 10000);

// ORDER STATUS

function orderStatus() {
  http = new XMLHttpRequest();
  http.open(
    "GET",
    "http://localhost:8080/orderStatus/" +
      document.getElementById("orderID").value,
    true
  );
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      var data = JSON.parse(http.responseText);
      if (data.length == 1) {
        document.getElementById("getOrderID").innerHTML =
          "Order number: " + document.getElementById("orderID").value;
        var isCompleted =
          data[0].isCompleted == 0
            ? "In process!"
            : "Completed and Ready to pick up!";
        document.getElementById("getStatus").innerHTML =
          "Order Status: " + isCompleted;
        document.getElementById("orderID").value = "";
      } else {
        alert("Your Order Number is incorrect or cancelled!");
      }
    }
  };
  http.send();
}

function cancelOrder() {
  http = new XMLHttpRequest();
  http.open(
    "POST",
    "http://localhost:8080/cancelOrder/" +
      document.getElementById("orderID").value,
    true
  );
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      var data = http.responseText;

      if (data == "1") {
        alert("You order is cancelled!");
      } else {
        alert("Sorry, order cannot be cancelled!");
      }
    }
  };
  http.send();
}

// END
