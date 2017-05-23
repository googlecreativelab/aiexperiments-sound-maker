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

import {Type} from 'Type'
import events from 'events'
import {KeyboardElement} from 'Element'
import {Midi} from 'Midi'

class Keyboard extends events.EventEmitter{
	constructor(container, {
			rootNote = 48, 
			octaves = 4,
			sustain = Infinity
		} = {}){
		super()

		/**
		 * The keyboard attributes
		 * @type {Number}
		 * @private
		 */
		this._rootNote = rootNote
		this._octaves = octaves

		/**
		 * If the keyboard is active or not
		 * @type {Boolean}
		 * @private
		 */
		this._active = true

		/**
		 * The sustain time in milliseconds of the note
		 * @type {Number}
		 */
		this.sustain = sustain

		/**
		 * the timeouts for stopping the notes
		 */
		this._timeouts = {}

		/**
		 * The audio key keyboard
		 * @type {AudioKeys}
		 */
		this._keyboardKeys = new Type()
		this._keyboardKeys.on('keyDown', note => this._triggerEvent('keyDown', note))
		this._keyboardKeys.on('keyUp', note => this._triggerEvent('keyUp', note))

		/**
		 * The piano interface
		 */
		this._keyboardInterface = new KeyboardElement(container, rootNote, octaves, sustain)
		this._keyboardInterface.on('keyDown', note => this._triggerEvent('keyDown', note))
		this._keyboardInterface.on('keyUp', note => this._triggerEvent('keyUp', note))

		/**
		 * resize handler
		 */
		window.addEventListener('resize', this._resize.bind(this))

		//the midi input
		this._midi = new Midi()
		this._midi.on('keyDown', note => this._triggerEvent('keyDown', note))
		this._midi.on('keyUp', note => this._triggerEvent('keyUp', note))
	}

	get octaves(){
		return this._octaves
	}
	set octaves(octaves){
		this._octaves = octaves
		this._resize()
	}

	get rootNote(){
		return this._rootNote
	}
	set rootNote(rootNote){
		this._rootNote = rootNote
		this._resize()
	}

	set active(active){
		this._active = active
		this._keyboardInterface.active = active
		this._keyboardKeys.active = active
		if (!active){
			this._keyboardInterface.clear()
		}
	}

	get active(){
		return this._active
	}

	set color(color){
		this._keyboardInterface.color = color
	}

	keyDown(note){
		this._keyboardInterface.keyDown(note)
	}

	keyUp(note){
		this._keyboardInterface.keyUp(note)
	}

	_triggerEvent(event, note){
		if (this.active){
			this[event](note)
			this.emit(event, note)
		}
	}

	_resize(){
		this._keyboardInterface.resize(this._rootNote, this._octaves)
		if (this._octaves > 2){
			this._keyboardKeys.rootNote = this._rootNote + 12
		} else {
			this._keyboardKeys.rootNote = this._rootNote
		}
	}
}

module.exports = Keyboard