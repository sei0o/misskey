import * as request from 'request-promise-native';
import * as debug from 'debug';
import { IObject } from './type';
import config from '../../config';

const log = debug('misskey:activitypub:resolver');

export default class Resolver {
	private history: Set<string>;
	private timeout = 10 * 1000;

	constructor() {
		this.history = new Set();
	}

	public async resolveCollection(value: any) {
		const collection = typeof value === 'string'
			? await this.resolve(value)
			: value;

		switch (collection.type) {
		case 'Collection':
			collection.objects = collection.items;
			break;

		case 'OrderedCollection':
			collection.objects = collection.orderedItems;
			break;

		default:
			throw new Error(`unknown collection type: ${collection.type}`);
		}

		return collection;
	}

	public async resolve(value: any): Promise<IObject> {
		if (value == null) {
			throw new Error('resolvee is null (or undefined)');
		}

		if (typeof value !== 'string') {
			return value;
		}

		if (this.history.has(value)) {
			throw new Error('cannot resolve already resolved one');
		}

		this.history.add(value);

		const object = await request({
			url: value,
			timeout: this.timeout,
			headers: {
				'User-Agent': config.user_agent,
				Accept: 'application/activity+json, application/ld+json'
			},
			json: true
		}).catch(e => {
			throw new Error(`request error: ${e.message}`);
		});

		if (object === null || (
			Array.isArray(object['@context']) ?
				!object['@context'].includes('https://www.w3.org/ns/activitystreams') :
				object['@context'] !== 'https://www.w3.org/ns/activitystreams'
		)) {
			log(`invalid response: ${value}`);
			throw new Error('invalid response');
		}

		return object;
	}
}
