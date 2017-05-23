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
import 'style/splash.scss'
import events from 'events'
import {Wiggle} from './Wiggle'
import StartAudioContext from 'startaudiocontext'
import Tone from 'Tone/core/Tone'

export class Splash extends events.EventEmitter {
	constructor(container){
		super()

		const splash = document.createElement('div')
		splash.id = 'splash'
		container.appendChild(splash)

		const titleContainer = document.createElement('div')
		titleContainer.id = 'titleContainer'
		splash.appendChild(titleContainer)

		const title = document.createElement('div')
		title.id = 'title'
		title.textContent = Config.title
		titleContainer.appendChild(title)

		const subtitle = document.createElement('div')
		subtitle.id = 'subtitle'
		subtitle.textContent = Config.subtitle
		titleContainer.appendChild(subtitle)

		const playButton = document.createElement('div')
		playButton.id = 'playButton'
		titleContainer.appendChild(playButton)

		const playButtonFill = document.createElement('div')
		playButtonFill.id = 'playButtonFill'
		playButton.appendChild(playButtonFill)

		const playButtonText = document.createElement('div')
		playButtonText.id = 'text'
		playButtonText.textContent = 'PLAY'
		playButtonFill.appendChild(playButtonText)

		const playButtonImage = document.createElement('div')
		playButtonImage.id = 'image'
		playButtonFill.appendChild(playButtonImage)

		playButton.addEventListener('click', e => {
			splash.classList.add('invisible')
			this.emit('play')
		})

		StartAudioContext(Tone.context, playButton)

		//the loader
		const loader = new Wiggle(splash)

		// the page title
		document.querySelector('title').textContent = Config.title

		// the badges
		const badges = document.createElement('div')
		badges.id = 'badges'
		splash.appendChild(badges)

		const aiExperiments = document.createElement('a')
		aiExperiments.id = 'aiExperiments'
		aiExperiments.href = 'https://aiexperiments.withgoogle.com'
		aiExperiments.target = '_blank'
		aiExperiments.classList.add('badge')
		badges.appendChild(aiExperiments)

		// break
		const break0 = document.createElement('div')
		break0.classList.add('badgeBreak')
		badges.appendChild(break0)

		const googleFriends = document.createElement('a')
		googleFriends.id = 'googleFriends'
		googleFriends.classList.add('badge')
		badges.appendChild(googleFriends)

		//break two
		const break1 = document.createElement('div')
		break1.classList.add('badgeBreak')
		badges.appendChild(break1)

		const magenta = document.createElement('a')
		magenta.href = 'https://magenta.tensorflow.org/'
		magenta.target = '_blank'
		magenta.id = 'magentaLink'
		magenta.classList.add('badge')
		const imgHtml = '<div id="img"></div>'
		magenta.innerHTML = imgHtml + '<div id="text">Built using <span>Magenta</span></div>'
		badges.appendChild(magenta)

		const privacyAndTerms = document.createElement('div')
		privacyAndTerms.id = 'privacyAndTerms'
		privacyAndTerms.innerHTML = '<a target="_blank" href="https://www.google.com/intl/en/policies/privacy/">Privacy</a><span>&</span><a target="_blank" href="https://www.google.com/intl/en/policies/terms/">Terms</a>'
		splash.appendChild(privacyAndTerms)

	}
}