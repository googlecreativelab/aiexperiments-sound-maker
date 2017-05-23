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

import 'style/slider.scss'
import events from 'events'
import chroma from 'chroma-js'
import {Config} from 'Config'

export class Slider extends events.EventEmitter {
	constructor(container){

		super()

		const slider = document.createElement('div')
		slider.id = 'slider'
		container.appendChild(slider)

		const input = this._input = document.createElement('input')
		input.type = 'range'
		input.min = 0
		input.max = 100
		input.value = 50
		slider.appendChild(input)

		const thumb = this._thumb = document.createElement('thumb')
		thumb.id = 'thumb'
		slider.appendChild(thumb)

		input.addEventListener('touchstart', this._thumbDown.bind(this))
		input.addEventListener('touchend', this._thumbUp.bind(this))
		input.addEventListener('mousedown', this._thumbDown.bind(this))
		input.addEventListener('mouseup', this._thumbUp.bind(this))
		input.addEventListener('mouseover', e => thumb.classList.add('hover'))
		input.addEventListener('mouseout', e => thumb.classList.remove('hover'))
		this._chromaScale = chroma.scale([Config.teal, Config.purple])
		input.addEventListener('input', this._setThumb.bind(this))
		this._setThumb()
	}

	get value(){
		return 1 - parseInt(this._input.value) / 100
	}

	get color(){
		return this._setThumb()
	}

	_setThumb(){
		const color = this._chromaScale(this.value).hex()
		this._thumb.style.left = `calc(${this._input.value}% - ${Math.round(this._thumb.offsetWidth * (1-this.value))}px)`
		this._thumb.style.backgroundColor = color
		this.emit('value', this.value, color)
		return color
	}

	_thumbDown(){
		this.emit('mousedown')
		this._thumb.classList.add('active')
	}

	_thumbUp(){
		this._thumb.classList.remove('active')
		this.emit('mouseup')
	}
}