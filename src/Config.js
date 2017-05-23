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

import 'style/main.scss'

// reference colors
const refPurple = document.createElement('div')
refPurple.id = 'purple'
document.body.appendChild(refPurple)
const purple = window.getComputedStyle(refPurple, null).getPropertyValue('background-color')
refPurple.remove()

const refTeal = document.createElement('div')
refTeal.id = 'teal'
document.body.appendChild(refTeal)
const teal = window.getComputedStyle(refTeal, null).getPropertyValue('background-color')
refTeal.remove()

export const Config = {
	samplingInterval : 4,
	interfaceSounds : true,
	rootNote : 60,
	octaves : 2,
	interpolationCount : 4,
	title : 'NSynth: Sound Maker',
	subtitle : 'Make unusual new sounds with machine learning.',
	audioFolder : './sounds',
	teal : teal,
	purple : purple,
}