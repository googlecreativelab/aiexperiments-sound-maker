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

import {Carousel} from './Carousel'
import Names from 'sound/Names'
import Folders from 'sound/Folders'
import 'style/selector.scss'
import events from 'events'

export class Selectors extends events.EventEmitter {
	constructor(container){
		super()
		//create the selector container
		const selector = document.createElement('div')
		selector.id = 'selector'
		container.appendChild(selector)

		//create two carousels
		const leftCarousel = this._leftCarousel = new Carousel(selector, Names[0])
		const rightCarousel = this._rightCarousel = new Carousel(selector, Names[1])

		//the plus sign
		const plusSign = document.createElement('div')
		plusSign.id = 'plusSign'
		selector.appendChild(plusSign)

		leftCarousel.on('change', () => {
			this.emit('change', this.folder)
		})
		rightCarousel.on('change', () => {
			this.emit('change', this.folder)
		})

		leftCarousel.on('click', () => this.emit('click', this._leftCarousel.active))
		rightCarousel.on('click', () => this.emit('click', this._rightCarousel.active))
	}

	get swapped(){
		const comboA = this._leftCarousel.active + '_' + this._rightCarousel.active
		return !Folders.includes(comboA)
	}

	get folder(){
		const comboA = this._leftCarousel.active + '_' + this._rightCarousel.active
		const comboB = this._rightCarousel.active + '_' + this._leftCarousel.active
		if (Folders.includes(comboA)){
			return comboA
		} else if (Folders.includes(comboB)){
			return comboB
		}
	}
}