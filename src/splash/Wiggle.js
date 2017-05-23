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

import {Config} from 'Config'
import TWEEN from 'tween.js'

export class Wiggle {
	constructor(container){

		const canvas = document.createElement('canvas')
		container.appendChild(canvas)

		const context = canvas.getContext('2d')
		let width = context.canvas.width
		let height = context.canvas.height
		let gradient = context.createLinearGradient(0, 0, width, height)
		let progress = 0
		let waveHeight = 0.1

		function resize(){
			context.canvas.width = canvas.offsetWidth * 2
			context.canvas.height = canvas.offsetHeight * 2
			width = context.canvas.width
			height = context.canvas.height

			gradient = context.createLinearGradient(0, 0, width, height)
			gradient.addColorStop(0, Config.purple)
			gradient.addColorStop(1, Config.teal)
			animate(progress)
		}

		window.addEventListener('resize', resize)
		resize()

		function animate(prog){
			progress = prog
			const wavH = waveHeight*height
			context.clearRect(0, 0, width, height)
			context.beginPath()
			context.lineJoin = 'round'
			context.lineWidth = 5
			context.strokeStyle = gradient
			const span = 0.9
			const hideEdges = 10
			const segments = 3000
			let lastVal = 0
			const halfPi = Math.PI/2
			for (let i = 0; i < prog*segments; i++){
				const x = (width + hideEdges*2) * (i / segments)-hideEdges
				const amnt = i/segments*width/8.5
				const harmonics = 2
				let wave = 0
				const position = Math.sin(amnt)
				const crossOver = 0.7
				if (Math.abs(position) < crossOver){
					for (let h = 0; h < harmonics; h++){
						const amp = 1/(2*h+1)
						wave += amp * Math.sin(amnt*(h*2+1))
					}
					lastVal = wave
				} else {
					wave = lastVal
				}
				// const y = ((wave+1)/2)*height*span + height*(1-span)/2
				const y = (wave * wavH + height)/2
				if (i === 0){
					context.moveTo(x, y)
				} else {
					context.lineTo(x, y)
				}
			}
			context.stroke()
		}

		const delay = 300
		const duration = 1400
		const posTween = new TWEEN.Tween({
			position: 0,
		}).to({
			position: 1,
		}, duration).onUpdate(function(){
			animate(this.position, this.height)
		}).easing(TWEEN.Easing.Cubic.InOut).delay(delay).start()
			/*.onComplete(function(){
				cancelAnimationFrame(animationId)
			})*/

		const delayOffset = 200
		const heightTween = new TWEEN.Tween({
			height : 0.1,
		}).to({
			height: 0.8,
		}, duration - delayOffset).onUpdate(function(){
			waveHeight = this.height
		}).easing(TWEEN.Easing.Elastic.Out).delay(delay + delayOffset).start()

		let animationId = -1
		function loop(){
			animationId = requestAnimationFrame(loop)
			TWEEN.update()
		}
		loop()
	}
}