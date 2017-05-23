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

import {Source} from './Source'
import {Config} from 'Config'
import Master from 'Tone/core/Master'
import Frequency from 'Tone/type/Frequency'

Master.volume.value = 2

export class Sound {
	constructor(carousel){
		this._sources = []
		this._carousel = carousel

		this._mix = 0.5
	}
	set(folder){
		// dispose the old stuff
		this._sources.map(source => source.dispose())
		this._sources = []
		for (let i = 0; i <= Config.interpolationCount; i++){
			const source = new Source(folder, i, Config.interpolationCount - i)
			this._sources.push(source)
		}
	}

	set mix(val){
		//get the closest interpolation step
		if (this._carousel.swapped){
			val = 1 - val
		}
		this._mix = val
		const floor = Math.floor(val * Config.interpolationCount)
		const ceil = Math.ceil(val * Config.interpolationCount)
		if (floor !== ceil){
			const dist = val * Config.interpolationCount - floor
			this._sources[floor].volume = 1-dist
			this._sources[ceil].volume = dist
		} else {
			this._sources[ceil].volume = 1
		}
		this._sources.forEach((src, i) => {
			if (i !== ceil && i !== floor){
				src.volume = 0
			}
		})
	}

	noteOn(midi, time){
		if (this.loaded){
			const note = Frequency(midi, 'midi').toNote()
			this._sources.forEach(source => source.noteOn(note, time))
		}
	}

	noteOff(midi, time){
		if (this.loaded){
			const note = Frequency(midi, 'midi').toNote()
			this._sources.forEach(source => source.noteOff(note, time))
		}
	}

	get loaded(){
		let isLoaded = true
		this._sources.forEach(source => isLoaded = source.loaded && isLoaded)
		return isLoaded;
	}
}