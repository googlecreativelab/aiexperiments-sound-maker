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

import 'style/waveform.scss'
import Analyser from 'Tone/component/Analyser'
import Master from 'Tone/core/Master'
import Zero from 'Tone/signal/Zero'
import {Config} from 'Config'
import Names from 'sound/Names'
import TWEEN from 'tween.js'

export class Waveform {
	constructor(container){
		const waveformContainer = this.element = document.createElement('div')
		waveformContainer.id = 'waveform'
		container.appendChild(waveformContainer)

		const canvas = document.createElement('canvas')
		waveformContainer.appendChild(canvas)

		const context = canvas.getContext('2d')
		let width = context.canvas.width
		let height = context.canvas.height

		const analyser = new Analyser('waveform', window.screen.width > 600 ? 512 : 128)
		analyser.returnType = 'float'
		Master.connect(analyser)
		const zeros = new Zero()
		zeros.connect(analyser)

		this._mix = 0.5
		this._currentMix = this._mix

		function resize(){
			context.canvas.width = waveformContainer.offsetWidth * 2
			context.canvas.height = waveformContainer.offsetHeight * 2
			width = context.canvas.width
			height = context.canvas.height
		}

		window.addEventListener('resize', resize)
		resize()

		const animate = () => {
			requestAnimationFrame(animate)
			
			const waveformGradient = context.createLinearGradient(0, 0, width, height)
			if (this._currentMix > 0.5){
				waveformGradient.addColorStop(0 + (this._currentMix - 0.5)*2, Config.teal)
				waveformGradient.addColorStop(1, Config.purple)
			} else {
				waveformGradient.addColorStop(0, Config.teal)
				waveformGradient.addColorStop(this._currentMix * 2, Config.purple)
				// waveformGradient.addColorStop(1, Config.teal)
			}

			context.clearRect(0, 0, width, height)
			const values = analyser.analyse()
			context.beginPath()
			context.lineJoin = 'round'
			context.lineCap = 'round'
			context.lineWidth = 8
			context.strokeStyle = waveformGradient
			const amp = values.reduce((acc, v) => acc + v * v) / values.length
			const max = Math.max.apply(null, values.map(Math.abs));
			let norm = 1
			if (max > 1){
				norm = 1/max
			}
			let drift = 0.2 * Math.min(Math.pow(amp, 0.5) * 2, 1)
			if (isNaN(drift)){
				drift = 0
			}
			const span = 0.9 - drift

			for (let i = 0, len = values.length; i < len; i++){
				let sign = values[i] > 0 ? 1 : -1
				let val = values[i]
				val *= norm
				val = (val+1)/2
				const x = width * span * (i / len) + width * (1-span)/2
				const y = val * height * 0.9 + height * 0.05
				if (i === 0){
					context.moveTo(x, y)
				} else {
					context.lineTo(x, y)
				}
			}
			context.stroke()
		}
		animate()
	}

	set mix(mix){
		this._mix = 1 - mix
		this._currentMix = this._mix
		if (this._tween){
			this._tween.stop()
		}
	}

	previewColor(folder){
		if (this._tween){
			this._tween.stop()
		}
		const self = this
		//which side is the mix on
		let mix = 1
		if (Names[0].findIndex(obj => obj.folder === folder) !== -1){
			mix = 0
		}
		this._currentMix = mix
		this._tween = new TWEEN.Tween({
			mix
		}).to({mix : this._mix}, 1000)
			.onUpdate(function(){
				self._currentMix = this.mix
			})
			.delay(300)
			.start()
	}
}