/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import events from 'events'
import 'style/carousel.scss'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'

export class Carousel extends events.EventEmitter {
	constructor(container, names){
		super()

		//make the carousel wrapper
		const wrapper = document.createElement('div')
		wrapper.classList.add('carousel')
		container.appendChild(wrapper)

		const carousel = this._carousel = document.createElement('div')
		carousel.classList.add('carousel-wrapper')
		carousel.classList.add('swiper-wrapper')
		wrapper.appendChild(carousel)

		this._names = names
		//all the child elements
		for (let i = 0; i < names.length; i++){
			const item = this._createItem(names[i])
			carousel.appendChild(item)
		}

		//prev/next buttons
		const nextButton = document.createElement('div')
		nextButton.id = 'next'
		nextButton.classList.add('navigation')
		wrapper.appendChild(nextButton)
		const prevButton = document.createElement('div')
		prevButton.id = 'prev'
		prevButton.classList.add('navigation')
		wrapper.appendChild(prevButton)

		const swiper = this._swiper = new Swiper(wrapper, {
			direction: 'vertical',
			slidesPerView: 3,
			spaceBetween: 10,
			nextButton,
			prevButton,
			buttonDisabledClass : 'inactive',
			initialSlide : 0,
			centeredSlides : true,
			loop : true,
			loopedSlides : names.length, 
			slideActiveClass : 'active',
		})

		swiper.on('slideChangeEnd', (e) => {
			this.emit('change', this.active)
			this.highlight()
		})

		//indiciator square
		const indicator = document.createElement('div')
		indicator.id = 'indicator'
		wrapper.appendChild(indicator)
		// indicator.addEventListener('click', this.highlight.bind(this))
		//resize the indicator
		function sizeIndicator(){
			indicator.style.height = carousel.querySelector('.item').clientHeight + 'px'
		}
		sizeIndicator()
		window.addEventListener('resize', sizeIndicator)

		// add two fades
		for (let i = 0; i < 2; i++){
			const fade = document.createElement('span')
			fade.classList.add('fade')
			wrapper.appendChild(fade)			
		}


	}

	highlight(){
		const el = this._carousel.querySelector('.active')
		this.emit('click', this.active)
		el.classList.add('highlight')
		setTimeout(() => {
			el.classList.remove('highlight')
		}, 300)
	}

	get active(){
		const element = this._names[this._swiper.activeIndex % this._names.length]
		return element.folder
	}

	_createItem(content){
		const item = document.createElement('div')
		item.classList.add('item')
		item.classList.add('swiper-slide')
		const contentEl = document.createElement('div')
		contentEl.id = 'content'
		contentEl.textContent = content.name
		item.appendChild(contentEl)
		return item
	}
}