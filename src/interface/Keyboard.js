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

import KeyboardUI from 'keyboard/Keyboard'
import 'style/keyboard.scss'
import events from 'events'
import {Config} from 'Config'
import Draw from 'Tone/core/Draw'

export class Keyboard extends events.EventEmitter{
	constructor(container){

		super()

		const keyboardContainer = this.element = document.createElement('div')
		keyboardContainer.id = 'keyboardContainer'
		container.appendChild(keyboardContainer)

		const keyboard = this._keyboard = new KeyboardUI(keyboardContainer, {
			rootNote : 48,
			octaves : 4,
			sustain : 2500
		})

		function resize(){
			const keyWidth = 30
			let octaves = Math.round((keyboardContainer.clientWidth / keyWidth) / 12)
			octaves = Math.max(octaves, 1)
			octaves = Math.min(octaves, 7)
			let bassNote = 48
			if (octaves > 5){
				bassNote -= (octaves - 5) * 12
			}
			if (octaves === 1){
				bassNote = 60
			}
			Config.rootNote = bassNote
			Config.octaves = octaves
			keyboard.rootNote = bassNote
			keyboard.octaves = octaves
		}

		window.addEventListener('resize', resize)
		resize()

		keyboard.on('keyDown', key => {
			//range check
			if (key >= Config.rootNote && key <= (Config.rootNote + 12 * Config.octaves)){
				this.emit('keyDown', key)
			}
		})

		keyboard.on('keyUp', key => {
			//range check
			if (key >= Config.rootNote && key <= (Config.rootNote + 12 * Config.octaves)){
				this.emit('keyUp', key)
			}
		})

		// create a stylesheet
		this._styleSheet = (function() {
			var style = document.createElement('style')
			style.appendChild(document.createTextNode(''))
			document.head.appendChild(style)
			return style.sheet
		})();
	}

	noteOn(num){
		this._keyboard.keyDown(num)
	}

	noteOff(num){
		this._keyboard.keyUp(num)
	}

	set active(active){
		this._keyboard.active = active
	}

	set color(color){
		if (this._styleSheet.cssRules.length){
			this._styleSheet.cssRules[0].style.cssText = `background-color:${color}!important;`
		} else {
			this._styleSheet.insertRule(`#keyboard { background-color:${color}!important;}`, 0)
		}
	}
}