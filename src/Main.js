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

import {Keyboard} from './interface/Keyboard'
import {Selectors} from './interface/Selectors'
import {Waveform} from './interface/Waveform'
import {Slider} from './interface/Slider'
import 'style/main.scss'
import {Sound} from 'sound/Sound'
import {Loader} from 'interface/Loader'
import {Orientation} from 'interface/Orientation'
import {Splash} from 'splash/Splash'
import {Config} from 'Config'
import {Supported} from 'splash/Supported'

const supported = new Supported()

if (supported.works){

	const keyboard = new Keyboard(document.body)
	let ready = false
	const carousels = new Selectors(document.body)
	const waveform = new Waveform(document.body)
	const loader = new Loader(document.body, keyboard, waveform)
	const slider = new Slider(document.body)
	const orientation = new Orientation(document.body)

	const sound = new Sound(carousels)
	sound.set(carousels.folder)
	sound.mix = slider.value
	keyboard.color = slider.color

	keyboard.on('keyDown', key => {
		if (ready){
			sound.noteOn(key)
		}
	})

	keyboard.on('keyUp', key => {
		if (ready){
			sound.noteOff(key)
		}
	})

	slider.on('value', (val, color) => {
		sound.mix = val
		waveform.mix = val
		keyboard.color = color
	})

	slider.on('mousedown', () => {
		if (Config.interfaceSounds){
			keyboard.noteOn(60)
			sound.noteOn(60)
		}
	})
	slider.on('mouseup', () => {
		if (Config.interfaceSounds){
			keyboard.noteOff(60)
			sound.noteOff(60)
		}
	})

	carousels.on('change', folder => {
		loader.load()
		sound.set(folder)
		sound.mix = slider.value
	})


	carousels.on('click', file => {
		if (Config.interfaceSounds){
			waveform.previewColor(file)
		}
	})

	// SPLASH //////////////////////////////////////////////

	const splash = new Splash(document.body)
	splash.on('about', () => {
		ready = false
	})
	splash.on('play', () => {
		ready = true
	})

}