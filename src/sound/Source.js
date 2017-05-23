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

import MultiSampler from 'Tone/instrument/MultiSampler'
import Tone from 'Tone/core/Tone'
import {Config} from 'Config'

const unpitched = ['cat', 'dog', 'thunder', 'cow', 'bike_bell', 'goose']

export class Source {
	constructor(folder, mixA){
		//generate the sample urls
		const urls = {}
		const isUnpitched = unpitched.findIndex(file => folder.includes(file)) !== -1
		const dontPitch = mixA === 0 && isUnpitched

		if (dontPitch){
			urls[60] = `${Config.audioFolder}/${folder}/${mixA}_60.mp3`
		} else {
			for (let i = 0; i <= (Config.octaves * (12/Config.samplingInterval)); i++){
				const midiNote = i * Config.samplingInterval + Config.rootNote
				urls[midiNote] = `${Config.audioFolder}/${folder}/${mixA}_${midiNote}.mp3`
			}
		}

		this._sampler = new MultiSampler(urls, {
			volume : -Infinity,
			release : 0.3,
		}).toMaster()

	}

	noteOn(note){
		this._sampler.triggerAttack(note, '+0.05', Math.random() * 0.3 + 0.6)
	}

	noteOff(note){
		this._sampler.triggerRelease(note, '+0.05')
	}

	set volume(vol){
		this._sampler.volume.value = Tone.gainToDb(vol * 0.4)
		// this._sampler.volume.cancelScheduledValues()
		// this._sampler.volume.rampTo(Tone.gainToDb(vol * 0.8), 0.02)
	}

	get volume(){
		return 	this._sample.dbToGain(this._sampler.volume)
	}

	get loaded(){
		return this._sampler.loaded
	}

	dispose(){
		this._sampler.dispose()
	}
}