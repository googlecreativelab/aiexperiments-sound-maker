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

import 'style/orientation.scss'

export class Orientation {
	constructor(container){
		const element = document.createElement('div')
		element.id = 'orientation'

		const text = document.createElement('div')
		text.id = 'text'
		text.textContent = 'rotate your phone'
		element.appendChild(text)

		const img = document.createElement('div')
		img.id = 'rotatePhone'
		element.appendChild(img)

		//test if mobile
		const isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))
		if (isMobile){
			container.appendChild(element)
			document.body.classList.add('mobile')
		}
	}
}