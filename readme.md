# Shopping List App

Simple free secure shopping list web application without registration

## Test, use

Download files, upload them to your server and follow _index.html_

## Features

### Quick start
Make lists right out of the box — the first time the application is launched, it immediately creates the first empty list

<img src="Screenshots/readme-1.jpg" />

### Items
Add items to the list, mark the purchased ones

<img src="Screenshots/readme-2.jpg" />

### Price recognition
Enter the price of the product when adding a list item and it will be displayed on the right

<table>
  <tr>
    <td><img src="Screenshots/readme-3.jpg" /></td>
    <td><img src="Screenshots/readme-4.jpg" /></td>
  </tr>
</table>

### Multiple lists
You can create as many lists as you want for different purposes

<img src="Screenshots/readme-5.jpg" />

### List clearing
You can clean up your list by deleting all the items marked with a tick. You will have the opportunity to restore these items before the page is reloaded

<img src="Screenshots/readme-6.jpg" />

### List sharing
You can share your shopping list with another person. You just need to click on the "Share List" button and send a link  

It's secure: the list is stored on the server in encrypted form, and only you and your partner have the key to the cipher

<table>
  <tr>
    <td><img src="Screenshots/readme-8.jpg" /></td>
    <td><img src="Screenshots/readme-9.jpg" /></td>
  </tr>
</table>

### List collaborating

### Beautiful Dark Mode
You can switch your interface to Dark mode

<img src="Screenshots/readme-7.jpg" />

### No registration
All your lists are saved in cookies or in your browser's local storage

### Safety
Your shopping lists are not saved anywhere except on your device  
If you have shared the list, it is stored on the server in encrypted form. Only you have the encryption key     
#### Where is your data stored?  
|Condition                   |Storage|
|----------------------------|-------|
|One list, less than 10 items|Cookies|
|One list, 10 items or more  |Local Storage|
|Multiple lists              |Local Storage|
|Shared list                 |Server (encrypted)|

## Technology stack
* _Frontend languages:_ HTML, CSS, JavaScript
* Flex boxes
* CSS variables
* Cookie storage
* Local storage
* AES encryption
* _Backend language:_ PHP
* GET and POST requests
* MySQL
