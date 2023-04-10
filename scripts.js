import {
  adbeDash,
  jsonapi,
} from './client.js';

import auth from './auth.js';

jsonapi.auth = auth;

window.adbeDash = adbeDash;
window.auth = auth;
window.jsonapi = jsonapi;

function createListItem(text) {
    const listItem = document.createElement('li');
    listItem.textContent = text;
  
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = ' x';
    deleteBtn.classList.add('delete-btn');
    attachDeleteHandler(deleteBtn);
  
    listItem.appendChild(deleteBtn);
    return listItem;
  }
  
  function attachDeleteHandler(deleteBtn) {
    deleteBtn.addEventListener('click', function () {
      const confirmDelete = confirm('Are you sure you want to delete this item?');
      if (confirmDelete) {
        deleteBtn.parentElement.remove();
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const addItemBtn = document.getElementById('addItemBtn');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    const addItemForm = document.getElementById('addItemForm');
    const listSelection = document.getElementById('listSelection');
    const itemText = document.getElementById('itemText');
    const lists = document.querySelectorAll('.list ul');
  
    // Attach delete handlers to existing list items
    const existingDeleteBtns = document.querySelectorAll('.delete-btn');
    existingDeleteBtns.forEach(attachDeleteHandler);
  
    addItemBtn.addEventListener('click', function () {
      modal.style.display = 'block';
    });
  
    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  
    window.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  
    addItemForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const selectedItem = parseInt(listSelection.value);
      const newItemText = itemText.value;
  
      if (newItemText.trim() !== '') {
        const listItem = createListItem(newItemText);
        lists[selectedItem].appendChild(listItem);
      }
  
      itemText.value = '';
      modal.style.display = 'none';
    });
  });
  