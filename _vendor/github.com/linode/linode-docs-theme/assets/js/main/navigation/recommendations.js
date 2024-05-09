import { LRUMap } from '../helpers/lru';
import { normalizeAlgoliaResult } from '../search/search-store';

var debug = 0 ? console.log.bind(console, '[nav-recommendations]') : function () {};

export class RecommendationsFetcher {
	constructor(searchConfig) {
		this.headers = {
			'X-Algolia-Application-Id': searchConfig.recommendations.app_id,
			'X-Algolia-API-Key': searchConfig.recommendations.api_key,
			'Content-Type': 'application/json',
		};
		this.targetIndex = searchConfig.recommendations.target_index;
		this.urlRecommendations = `https://${searchConfig.recommendations.app_id}-dsn.algolia.net/1/indexes/*/recommendations`;
		this.cache = new LRUMap(20); // Query cache.

		this.queues = new Map();

		debug('constructor', this.targetIndex, this.urlRecommendations);
	}

	async fetch(objectID, targetArray, model = 'related-products') {
		let request = {
			indexName: this.targetIndex,
			model: model,
			threshold: 25,
			maxRecommendations: 3,
			objectID: objectID,
		};

		let key = JSON.stringify(request);

		let cached = this.cache.get(key);
		if (cached) {
			debug('cached', objectID, model, cached.length);
			targetArray.length = 0;
			targetArray.push(...cached);
			return;
		}

		// Check if this key is in flight.
		let queue = this.queues.get(key);
		if (queue) {
			queue.push(targetArray);
			debug('in flight', objectID);
			return;
		} else {
			queue = [];
			queue.push(targetArray);
			this.queues.set(key, queue);
		}

		let url = this.urlRecommendations;
		let headers = this.headers;
		let body = JSON.stringify({ requests: [request] });

		let response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: body,
		});

		if (!response.ok) {
			console.warn(`[nav-recommendations] fetchRecommendations failed: ${response.status} ${response.statusText}`);
			targetArray.length = 0;
			return;
		}

		let json = await response.json();
		let result = json.results[0];

		normalizeAlgoliaResult(result);

		let hits = await result.hits;

		this.cache.set(key, hits);

		debug('fetch', objectID, model, hits.length);

		// Drain the queue.
		queue = this.queues.get(key);
		this.queues.delete(key);
		queue.forEach((arr) => {
			arr.length = 0;
			arr.push(...hits);
			debug('drain', objectID, model, hits.length);
		});
	}
}
