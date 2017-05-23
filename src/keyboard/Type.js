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

export class Type extends events.EventEmitter{
	constructor(){

		super()

		this._active = true

		const activeKeys = []

		const keyMapping = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75, 79, 76, 80, 186, 222]

		this.rootNote = 60

		document.body.addEventListener('keydown', (e) => {
			if (this._active){
				const interval = getInterval(e)
				if (interval !== -1 && activeKeys.indexOf(interval) === -1){
					activeKeys.push(interval)
					this.emit('keyDown', interval + this.rootNote)
				}
			}
		})

		document.body.addEventListener('keyup', (e) => {
			if (this._active){
				const interval = getInterval(e)
				if (interval !== -1 && activeKeys.indexOf(interval) !== -1){
					activeKeys.splice(activeKeys.indexOf(interval), 1)
					this.emit('keyUp', interval + this.rootNote)
				}
			}
		})

		function getInterval(e){
			if (keyMapping.indexOf(e.keyCode) !== -1){
				return keyMapping.indexOf(e.keyCode)
			} else {
				return -1
			}
		}
	}

	set active(val){
		this._active = val
	}
}