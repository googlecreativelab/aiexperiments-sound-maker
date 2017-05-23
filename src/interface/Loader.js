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

import Buffer from 'Tone/core/Buffer'
import 'style/loader.scss'
import {Config} from 'Config'

export class Loader {
	constructor(container, keyboard, waveform){

		this._keyboard = keyboard
		this._waveform = waveform

		Buffer.on('load', () => this.hide())

		this._loader = document.createElement('div')
		this._loader.id = 'loader'
		this._loader.innerHTML = `<svg class="circular" viewBox="25 25 50 50">
									<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
								</svg>`
		container.appendChild(this._loader)

		this._loaded = []

		//initial loader bar
		this.load()
	}

	load(folder){
		if (Config.interfaceSounds){
			this._keyboard.active = false
			this._loader.classList.add('visible')
			this._keyboard.element.classList.add('loading')
			this._waveform.element.classList.add('loading')
		}
	}

	hide(){
		this._keyboard.active = true
		this._keyboard.element.classList.remove('loading')
		this._waveform.element.classList.remove('loading')
		this._loader.classList.remove('visible')
	}

	_progress(prog){
		this._loader.style.width = `${prog*100}%`
		this._loader.style.opacity = 1-prog*0.9
	}
}