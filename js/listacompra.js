'use strict';

var ListaCompra = (function() {
  var listElement, editElement, detailSection;
  var itemsList = [];

    $('#clear-list').click(function() {
        var r = confirm("Se borrará la lista. Estás seguro?");
        if (r === true) {
            localStorage.removeItem('shopping-list');
            itemsList = [];
            utils.templates.clear(listElement);
            $('.addItemForm').addClass('hidden');
        }
    });

    $('#add-item').click(function() {
        $('.addItemForm').removeClass('hidden');
    });

    $('#save').click(function() {
        if ($('.new-name').val().trim() === '') {
            return false;
        }
        var newElement = {
            product: $('.new-name').val().trim(),
            brand: '',
            quantity: $('.new-quantity').val().trim(),
            id: itemsList.length,
            status: '',
            price: '',
            market: '',
            promotion: ''
        };
        if (itemsList == null) {
            itemsList = [];
        }
        itemsList.push(JSON.parse(JSON.stringify(newElement))); // push cloned object
        localStorage.setItem('shopping-list',JSON.stringify(itemsList));
        $('.addItemForm').addClass('hidden').each(function() {
            this.reset();
        });
        newElement.quantity = (newElement.quantity) ? ' (' + newElement.quantity + ')' : ' '
        utils.templates.prepend(listElement, [newElement]);
    });


    $('body').delegate('.remove', 'click', function() {
        var el = $(this).parents('li');
        var item = el.attr('data-id');
        itemsList[item].removed = true;
        localStorage.setItem('shopping-list',JSON.stringify(itemsList));
        el.remove();
    });

    $('body').delegate('.listElement', 'swiperight', function() {
        var item = $(this).attr('data-id');
        itemsList[item].crossed = true;
        localStorage.setItem('shopping-list',JSON.stringify(itemsList));
        $(this).addClass('crossed');
    });

    $('body').delegate('.listElement.crossed', 'swipeleft', function() {
        var item = $(this).attr('data-id');
        itemsList[item].crossed = false;
        localStorage.setItem('shopping-list',JSON.stringify(itemsList));
        $(this).removeClass('crossed');
    });

    $('body').delegate('.listElement', 'taphold', function() {
        var item = $(this).attr('data-id');
        showDetail(item);
    });


    function init() {
        listElement = document.getElementById('buying-list');

        editElement = document.getElementById('editItem');
        detailSection = document.getElementById('detail');

        detailSection.querySelector('button').addEventListener('click', goBack);
    };

    function saveEdited() {
        var id = $('#id').val();
        var quantity = $('#quantity').val();
        var element = {
            product: $('#product').val(),
            quantity: quantity || '',
            brand: $('#brand').val() || '',
            id: id,
            status: $('#status').val(),
            price: $('#price').val() || '',
            market: $('#market').val() || '',
            promotion: $('#promotion').val() || ''
        };
        itemsList[id] = element;
        localStorage.setItem('shopping-list',JSON.stringify(itemsList));
        $('#buying-list li[data-id=' + id + '] .quantity').html((quantity) ? ' (' + quantity + ')': ' ');
    }

  function goBack(e) {
    saveEdited();
    detailSection.addEventListener('transitionend', function tend() {
      detailSection.removeEventListener('transitionend', tend);
      detailSection.classList.remove('back-to-right');
      detailSection.classList.remove('right-to-left');
    });

    detailSection.classList.add('back-to-right');
  }


  function showDetail(item) {
      detailSection.classList.add('right-to-left');
      $('.detailsHeader').html('Detalles de ' + itemsList[item].product);
      for (var element in itemsList[item]) {
         $('#' + element).val(itemsList[item][element])
      }
  }

    function listItems() {
        var sl = localStorage.getItem('shopping-list');
        if (sl) {
            itemsList = JSON.parse(localStorage.getItem('shopping-list'));
        }

        var aux = [];
        for (var i = 0; i < itemsList.length; i++) {
            aux.push({
                product: itemsList[i].product,
                quantity: (itemsList[i].quantity) ? ' (' + itemsList[i].quantity + ')' : ' ',
                id: itemsList[i].id,
                status: (itemsList[i].removed) ? 'removed' : ((itemsList[i].crossed) ? 'crossed' : '')
            });
        }
        utils.templates.prepend(listElement, aux);
    }

  return {
    listItems: listItems,
    init: init
  }
})();
