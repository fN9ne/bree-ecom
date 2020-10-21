// include('libs/isotope.pkgd.min.js');
// include('libs/jquery.inputmask.min.js');
// include('libs/wNumb.min.js');
// include('libs/slick.min.js');
// include('libs/imagesloaded.pkgd.min.js');
// include('libs/nouislider.min.js');;
function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else{
		document.querySelector('body').classList.add('no-webp');
	}
});;
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());

/*
let block = document.querySelector('.click');
block.addEventListener("click", function (e) {
	alert('Все ок ;)');
});
*/

/*
//Объявляем переменные
const parent_original = document.querySelector('.content__blocks_city');
const parent = document.querySelector('.content__column_river');
const item = document.querySelector('.content__block_item');
//Слушаем изменение размера экрана
window.addEventListener('resize', move);
//Функция
function move(){
	const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (viewport_width <= 992) {
		if (!item.classList.contains('done')) {
			parent.insertBefore(item, parent.children[2]);
			item.classList.add('done');
		}
	} else {
		if (item.classList.contains('done')) {
			parent_original.insertBefore(item, parent_original.children[2]);
			item.classList.remove('done');
		}
	}
}
//Вызываем функцию
move();
*/;
// include('ibg.js');
// include('animOnScroll.js');;
$(document).ready(function(){
	$('.header__burger').click(function(){
		$(".header__burger, .menu-header__body, .menu-header__area, .actions").toggleClass('_active');
		$('body').toggleClass('_lock')
		$('.actions__item').each(function(){
			$(this).removeClass('_active');
		});
	});
	/* da */
	function cartValueQ() {
		let cartItem = $(".cart-item");
		let cpiqVal = cartItem.length;
		let cartQuantity = $('#cart-items-quantity');
		let cpiqQuantity = $("#cart-popup-items-quantity");
		cartQuantity.html(cpiqVal);
		cpiqQuantity.html(cpiqVal);
	};
	cartValueQ();

	$('.actions__item').click(function(){
		$(".header__burger, .menu-header__body, .menu-header__area, .actions").removeClass('_active');
		if ($(this).hasClass('_active')){
			$('.actions__item').each(function(){
				$(this).removeClass('_active');
				$('body').removeClass('_lock')
			});
		} else {
			$('.actions__item').each(function(){
				$(this).addClass('_active');
			});
			$(this).removeClass('_active');
			$('body').addClass('_lock')
			$('.actions__item').each(function(){
				$(this).toggleClass('_active');
			});
		};
	});

	/* search */
	$('.actions__item, .header__burger').click(function(){
		if ($('.actions__search').hasClass('_active')) {
			$('.search-popup').addClass('_search-active');
			$('.header').addClass('_search-active');
		} else{
			$('.search-popup').removeClass('_search-active');
			$('.header').removeClass('_search-active');
		};
	});

	/* search */
	$('#footer-email').on('focus blur', function(){
		if ($(this).val().length > 0) {
			$(this).addClass('_active');
			$('#footer-button').addClass('_active');
		} else{
			$(this).removeClass('_active');
			$('#footer-button').removeClass('_active');
		}
	});

	function totalCost() {
		let sum = 0;
		$(".cart-item__cost").each(function() {
			sum += Number($(this).text());
		});
		return sum;
	};
	$("#total-cost").html(totalCost());

	// 
	let cartPlus = $(".cart-item__plus");
	let cartMinus = $(".cart-item__minus");
	cartPlus.click(function() {
		let numberBox = $(this).closest(".cart-item").find(".cart-item__number");
		let number = Number(numberBox.html());
		numberBox.html(number+1);
	});
	cartMinus.click(function() {
		let numberBox = $(this).closest(".cart-item").find(".cart-item__number");
		let number = Number(numberBox.html());
		if (number === 1) {
			// 
		} else {
			numberBox.html(number-1);
		};
	});
	// 
	
	$(".actions__cart").click(function() {
		if (!$(".cart-popup").hasClass("_cart-active")) {
			$(".cart-popup").addClass("_cart-active");
		}
	});

	$(".cart-popup__area, .cart-popup__close").click(function() {
		$(".cart-popup").removeClass("_cart-active");
		$(".actions__item").each(function() {
			$(this).removeClass("_active");
			$("body").removeClass("_lock");
		});
	});

	/* search-popup > search items */
	$('.found-item').addClass('_active');
	let foundContainer = $('#search-items-container');
	function searchPopupItemQ() {
		let foundItemsQuantity = $('.found-item._active').length;
		let found = $('#search-items-quantity');
		found.html(foundItemsQuantity);
		if (foundItemsQuantity == 0) {
			foundContainer.css("display", "none");
		} else {
			foundContainer.css("display", "inline");
		}
	};
	searchPopupItemQ();
	$('.search-popup__delete').click(function(){
		$('#search').val('');
		$('.found-item').each(function(){
			$(this).addClass('_active')
		});
		searchPopupItemQ();
	});
	/* what */
	let search = $('#search');
	search.on('input', function() {
		let searchValue = search.val().toUpperCase();
		if (searchValue == 0) {
			$('.found-item').each(function(){
				$(this).addClass('_active')
			});
		} else {
			indexOfSearch(searchValue);
		}
		searchPopupItemQ();
	});
	function indexOfSearch(searchValue) {
		let foundItem = $('.found-item__name');
		foundItem.each(function() {
			if ($(this).text().toUpperCase().indexOf(searchValue) === -1) {
				$(this).closest($('.found-item')).removeClass('_active');
			} else {
				$(this).closest($('.found-item')).addClass('_active');
			};
		});
	};
})