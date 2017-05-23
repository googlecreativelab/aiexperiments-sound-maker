/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import events from 'events'

const offsets = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6]

class KeyboardElement extends events.EventEmitter {

	constructor(container, lowest=36, octaves=4, sustain=Infinity){
		super()
		this._container = document.createElement('div')
		this._container.id = 'keyboard'
		this._bindTouchEvents(this._container)
		container.appendChild(this._container)

		this._keys = {}

		this._mousedown = false

		this.active = true

		this.sustain = sustain

		this.resize(lowest, octaves)

		document.body.addEventListener('mousemove', e => {
			const element = document.elementFromPoint(e.pageX, e.pageY)
			if (!element.classList.contains('key')){
				this._mousedown = false
			}
		})

	}

	resize(lowest, octaves){
		this._keys = {}
		// clear the previous ones
		this._container.innerHTML = ''
		// each of the keys
		const keyWidth = (1 / 7) / octaves
		for (let i = lowest; i < lowest + octaves * 12; i++){
			let key = document.createElement('div')
			key.classList.add('key')
			let isSharp = ([1, 3, 6, 8, 10].indexOf(i % 12) !== -1)
			key.classList.add(isSharp ? 'accidental' : 'natural')
			this._container.appendChild(key)
			// position the element
			let noteOctave = Math.floor(i / 12) - Math.floor(lowest / 12)
			let offset = offsets[i % 12] + noteOctave * 7
			const keyMargin = keyWidth * (isSharp ? 0.14 : 0)
			key.style.width = `${(keyWidth - keyMargin)*100}%`
			key.style.left = `${(offset * keyWidth + keyMargin/2) * 100}%`
			
			key.id = i.toString()
			this._bindMouseEvents(key)
			this._keys[i] = key

		}
	}

	_bindTouchEvents(container){
		const elementFromTouch = (touch) => {
			return document.elementFromPoint(touch.pageX, touch.pageY)
		}

		const forEachTouch = (e, fn) => {
			e.preventDefault()
			for (let i = 0; i < e.changedTouches.length; i++){
				const touch = e.changedTouches[i]
				const element = document.elementFromPoint(touch.pageX, touch.pageY)
				if (element){
					fn(element, e.changedTouches[i])
				}
			}
		}

		container.addEventListener('touchstart',  e => {
			forEachTouch(e, (element, touch) => {
				if (!element.classList.contains('active')){
					this.emit('keyDown', parseInt(element.id))
					element.classList.add(`touch_${touch.identifier}`)
					element.classList.add('active')
				}
			})
		})

		container.addEventListener('touchend',  e => {
			forEachTouch(e, (element, touch) => {
				this.emit('keyUp', parseInt(element.id))
				element.classList.remove(`touch_${touch.identifier}`)
				element.classList.remove('active')
			})
		})

		container.addEventListener('touchcancel',  e => {
			forEachTouch(e, (element, touch) => {
				this.emit('keyUp', parseInt(element.id))
				element.classList.remove(`touch_${touch.identifier}`)
				element.classList.remove('active')
			})
		})

		container.addEventListener('touchmove', e => {
			forEachTouch(e, (element, touch) => {
				if (!element.classList.contains('active')){
					//remove the previous touch
					const previousEl = container.querySelector(`.touch_${touch.identifier}`)
					this.emit('keyUp', parseInt(previousEl.id))
					previousEl.classList.remove(`touch_${touch.identifier}`)
					previousEl.classList.remove('active')
					//add the new one
					this.emit('keyDown', parseInt(element.id))
					element.classList.add(`touch_${touch.identifier}`)
					element.classList.add('active')
				}
			})
		})

		//ignore long press/context menu
		container.addEventListener('contextmenu', e => e.preventDefault())
	}

	_bindMouseEvents(key){

		key.addEventListener('mouseenter', (e) => {
			if (this._mousedown){
				const noteNum = parseInt(e.target.id)
				this.emit('keyDown', noteNum)
			}
		})

		key.addEventListener('mouseout', (e) => {
			if (this._mousedown){
				const noteNum = parseInt(e.target.id)
				this.keyUp(noteNum)
				this.emit('keyUp', noteNum)
			}
		})

		key.addEventListener('mousedown', (e) => {
			e.preventDefault()
			if (!this._mousedown){
				this._mousedown = true
				const noteNum = parseInt(e.target.id)
				this.emit('keyDown', noteNum)
			}
		})

		key.addEventListener('mouseup', (e) => {
			e.preventDefault()
			if (this._mousedown){
				this._mousedown = false
				const noteNum = parseInt(e.target.id)
				this.emit('keyUp', noteNum)
			}
		})

	}

	keyDown(noteNum){
		if (this._keys.hasOwnProperty(noteNum)){
			const key = this._keys[noteNum]
			if (!key.classList.contains('active')){
				key.classList.add('active')
			}
		}
	}

	keyUp(noteNum){
		if (this._keys.hasOwnProperty(noteNum)){
			const key = this._keys[noteNum]
			key.classList.remove('active')
		}	
	}

	clear(){
		for (let noteNum in this._keys){
			this._keys[noteNum].classList.remove('active')
		}
	}

	set color(color){
		this._container.style.backgroundColor = color
	}

	set active(active){
		if (active){
			this._container.classList.add('active')
		} else {
			this._container.classList.remove('active')
		}
	}
}

export {KeyboardElement}