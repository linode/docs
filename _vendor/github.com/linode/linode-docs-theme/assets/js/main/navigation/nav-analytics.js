import { smartQueue, getCookie, setCookie, supportsCookies, createUUID } from '../helpers';

const unspecificedUserToken = 'unspecified';
const userTokenCookieName = 'linode_anonymous_usertoken';

var debug = 0 ? console.log.bind(console, '[nav-analytics]') : function () {};

export class AnalyticsEventsCollector {
	constructor(searchConfig, getLastQueryID, trustecm) {
		this.headers = {
			'X-Algolia-Application-Id': searchConfig.app_id,
			'X-Algolia-API-Key': searchConfig.api_key,
		};

		(this.getLastQueryID = getLastQueryID), (this.urlEvents = `https://insights.algolia.io/1/events`);
		this.trustecm = trustecm;
		this.anonomousUserToken = unspecificedUserToken;
		if (supportsCookies()) {
			this.anonomousUserToken = getCookie(userTokenCookieName);
			if (!this.anonomousUserToken) {
				this.anonomousUserToken = `anonomous-${createUUID()}`;

				// Set the cookie for 30 days,
				setCookie(userTokenCookieName, this.anonomousUserToken, 30 * 24 * 60 * 60 * 1000);
			}
		}

		var self = this;
		this.eventQueue = smartQueue(
			(items, restOfQueue) => {
				self.postEvents(items);
			},
			{
				max: 20, // limit
				interval: 3000, // 3s
				throttle: true, // Ensure only max is processed at interval
				onPause: () => {},
				onEmpty: (queue, type) => {},
			}
		);

		// Algolia analytics.
		if (searchConfig.click_analytics) {
			const mergedIndex = searchConfig.indexName(searchConfig.sections_merged.index);
			const userToken = () => {
				if (trustecm.functional) {
					return this.anonomousUserToken;
				}
				return unspecificedUserToken;
			};
			const createEventFromObjectID = (objectID, eventType, eventName) => {
				const event = {
					eventType: eventType,
					eventName: eventName,
					index: mergedIndex,
					userToken: userToken(),
					timestamp: Date.now(),
					objectIDs: [objectID],
				};
				return event;
			};

			const createEventFromItem = (item) => {
				if (!item.objectID) {
					throw new Error('Item has no objectID');
				}
				const event = {
					eventType: item.eventType ? item.eventType : 'view',
					eventName: item.eventName ? item.eventName : 'Guide Viewed',
					index: item.__index ? item.__index : mergedIndex,
					queryID: item.__queryID ? item.__queryID : '',
					userToken: userToken(),
					timestamp: Date.now(),
					objectIDs: [item.objectID],
				};
				if (event.queryID && item.__position) {
					event.positions = [item.__position];
				}
				return event;
			};
			this.handler = {
				pushItem: (item) => {
					this.eventQueue.push(createEventFromItem(item));
				},
				clickHit: (hit, eventName) => {
					if (!hit.__queryID) {
						// The Explorer node expansions are separate Algolia queries, but they don't have a queryID,
						// and they're logically tied to the main search.
						hit.__queryID = this.getLastQueryID();

						// Click events needs to have a position.
						// We attach Explorer click events to the main search results, but
						// we have no way of connecting this item to a position in that listing,
						// just assign it a position of 1.
						hit.__position = 1;
					}
					const item = createEventFromItem(hit);
					item.eventType = 'click';
					item.eventName = eventName;
					this.eventQueue.push(item);
				},
				convertObject: (objectID, eventName) => {
					const event = createEventFromObjectID(objectID, 'conversion', eventName);
					event.queryID = this.getLastQueryID();
					this.eventQueue.push(event);
				},
			};
		} else {
			// Set up some dummy handlers.
			this.handler = {
				click: () => {},
				view: () => {},
				conversion: () => {},
			};
		}
	}

	postEvents(events) {
		debug('POST', events);
		fetch(this.urlEvents, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({ events: events }),
		})
			.then((res) => {
				if (!res.ok) {
					return res.text().then((text) => {
						throw new Error(text);
					});
				} else {
					return res.json();
				}
			})
			.catch((err) => {
				console.log('Sending events to Algolia failed:', err);
			});
	}
}
