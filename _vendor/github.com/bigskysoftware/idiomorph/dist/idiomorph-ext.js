// base IIFE to define idiomorph
var Idiomorph = (function () {
        'use strict';

        //=============================================================================
        // AND NOW IT BEGINS...
        //=============================================================================
        let EMPTY_SET = new Set();

        // default configuration values, updatable by users now
        let defaults = {
            morphStyle: "outerHTML",
            callbacks : {
                beforeNodeAdded: noOp,
                afterNodeAdded: noOp,
                beforeNodeMorphed: noOp,
                afterNodeMorphed: noOp,
                beforeNodeRemoved: noOp,
                afterNodeRemoved: noOp,
                beforeAttributeUpdated: noOp,

            },
            head: {
                style: 'merge',
                shouldPreserve: function (elt) {
                    return elt.getAttribute("im-preserve") === "true";
                },
                shouldReAppend: function (elt) {
                    return elt.getAttribute("im-re-append") === "true";
                },
                shouldRemove: noOp,
                afterHeadMorphed: noOp,
            }
        };

        //=============================================================================
        // Core Morphing Algorithm - morph, morphNormalizedContent, morphOldNodeTo, morphChildren
        //=============================================================================
        function morph(oldNode, newContent, config = {}) {

            if (oldNode instanceof Document) {
                oldNode = oldNode.documentElement;
            }

            if (typeof newContent === 'string') {
                newContent = parseContent(newContent);
            }

            let normalizedContent = normalizeContent(newContent);

            let ctx = createMorphContext(oldNode, normalizedContent, config);

            return morphNormalizedContent(oldNode, normalizedContent, ctx);
        }

        function morphNormalizedContent(oldNode, normalizedNewContent, ctx) {
            if (ctx.head.block) {
                let oldHead = oldNode.querySelector('head');
                let newHead = normalizedNewContent.querySelector('head');
                if (oldHead && newHead) {
                    let promises = handleHeadElement(newHead, oldHead, ctx);
                    // when head promises resolve, call morph again, ignoring the head tag
                    Promise.all(promises).then(function () {
                        morphNormalizedContent(oldNode, normalizedNewContent, Object.assign(ctx, {
                            head: {
                                block: false,
                                ignore: true
                            }
                        }));
                    });
                    return;
                }
            }

            if (ctx.morphStyle === "innerHTML") {

                // innerHTML, so we are only updating the children
                morphChildren(normalizedNewContent, oldNode, ctx);
                return oldNode.children;

            } else if (ctx.morphStyle === "outerHTML" || ctx.morphStyle == null) {
                // otherwise find the best element match in the new content, morph that, and merge its siblings
                // into either side of the best match
                let bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);

                // stash the siblings that will need to be inserted on either side of the best match
                let previousSibling = bestMatch?.previousSibling;
                let nextSibling = bestMatch?.nextSibling;

                // morph it
                let morphedNode = morphOldNodeTo(oldNode, bestMatch, ctx);

                if (bestMatch) {
                    // if there was a best match, merge the siblings in too and return the
                    // whole bunch
                    return insertSiblings(previousSibling, morphedNode, nextSibling);
                } else {
                    // otherwise nothing was added to the DOM
                    return []
                }
            } else {
                throw "Do not understand how to morph style " + ctx.morphStyle;
            }
        }


        /**
         * @param possibleActiveElement
         * @param ctx
         * @returns {boolean}
         */
        function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
            return ctx.ignoreActiveValue && possibleActiveElement === document.activeElement;
        }

        /**
         * @param oldNode root node to merge content into
         * @param newContent new content to merge
         * @param ctx the merge context
         * @returns {Element} the element that ended up in the DOM
         */
        function morphOldNodeTo(oldNode, newContent, ctx) {
            if (ctx.ignoreActive && oldNode === document.activeElement) {
                // don't morph focused element
            } else if (newContent == null) {
                if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;

                oldNode.remove();
                ctx.callbacks.afterNodeRemoved(oldNode);
                return null;
            } else if (!isSoftMatch(oldNode, newContent)) {
                if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
                if (ctx.callbacks.beforeNodeAdded(newContent) === false) return oldNode;

                oldNode.parentElement.replaceChild(newContent, oldNode);
                ctx.callbacks.afterNodeAdded(newContent);
                ctx.callbacks.afterNodeRemoved(oldNode);
                return newContent;
            } else {
                if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) return oldNode;

                if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) {
                    // ignore the head element
                } else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
                    handleHeadElement(newContent, oldNode, ctx);
                } else {
                    syncNodeFrom(newContent, oldNode, ctx);
                    if (!ignoreValueOfActiveElement(oldNode, ctx)) {
                        morphChildren(newContent, oldNode, ctx);
                    }
                }
                ctx.callbacks.afterNodeMorphed(oldNode, newContent);
                return oldNode;
            }
        }

        /**
         * This is the core algorithm for matching up children.  The idea is to use id sets to try to match up
         * nodes as faithfully as possible.  We greedily match, which allows us to keep the algorithm fast, but
         * by using id sets, we are able to better match up with content deeper in the DOM.
         *
         * Basic algorithm is, for each node in the new content:
         *
         * - if we have reached the end of the old parent, append the new content
         * - if the new content has an id set match with the current insertion point, morph
         * - search for an id set match
         * - if id set match found, morph
         * - otherwise search for a "soft" match
         * - if a soft match is found, morph
         * - otherwise, prepend the new node before the current insertion point
         *
         * The two search algorithms terminate if competing node matches appear to outweigh what can be achieved
         * with the current node.  See findIdSetMatch() and findSoftMatch() for details.
         *
         * @param {Element} newParent the parent element of the new content
         * @param {Element } oldParent the old content that we are merging the new content into
         * @param ctx the merge context
         */
        function morphChildren(newParent, oldParent, ctx) {

            let nextNewChild = newParent.firstChild;
            let insertionPoint = oldParent.firstChild;
            let newChild;

            // run through all the new content
            while (nextNewChild) {

                newChild = nextNewChild;
                nextNewChild = newChild.nextSibling;

                // if we are at the end of the exiting parent's children, just append
                if (insertionPoint == null) {
                    if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;

                    oldParent.appendChild(newChild);
                    ctx.callbacks.afterNodeAdded(newChild);
                    removeIdsFromConsideration(ctx, newChild);
                    continue;
                }

                // if the current node has an id set match then morph
                if (isIdSetMatch(newChild, insertionPoint, ctx)) {
                    morphOldNodeTo(insertionPoint, newChild, ctx);
                    insertionPoint = insertionPoint.nextSibling;
                    removeIdsFromConsideration(ctx, newChild);
                    continue;
                }

                // otherwise search forward in the existing old children for an id set match
                let idSetMatch = findIdSetMatch(newParent, oldParent, newChild, insertionPoint, ctx);

                // if we found a potential match, remove the nodes until that point and morph
                if (idSetMatch) {
                    insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
                    morphOldNodeTo(idSetMatch, newChild, ctx);
                    removeIdsFromConsideration(ctx, newChild);
                    continue;
                }

                // no id set match found, so scan forward for a soft match for the current node
                let softMatch = findSoftMatch(newParent, oldParent, newChild, insertionPoint, ctx);

                // if we found a soft match for the current node, morph
                if (softMatch) {
                    insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
                    morphOldNodeTo(softMatch, newChild, ctx);
                    removeIdsFromConsideration(ctx, newChild);
                    continue;
                }

                // abandon all hope of morphing, just insert the new child before the insertion point
                // and move on
                if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;

                oldParent.insertBefore(newChild, insertionPoint);
                ctx.callbacks.afterNodeAdded(newChild);
                removeIdsFromConsideration(ctx, newChild);
            }

            // remove any remaining old nodes that didn't match up with new content
            while (insertionPoint !== null) {

                let tempNode = insertionPoint;
                insertionPoint = insertionPoint.nextSibling;
                removeNode(tempNode, ctx);
            }
        }

        //=============================================================================
        // Attribute Syncing Code
        //=============================================================================

        /**
         * @param attr {String} the attribute to be mutated
         * @param to {Element} the element that is going to be updated
         * @param updateType {("update"|"remove")}
         * @param ctx the merge context
         * @returns {boolean} true if the attribute should be ignored, false otherwise
         */
        function ignoreAttribute(attr, to, updateType, ctx) {
            if(attr === 'value' && ctx.ignoreActiveValue && to === document.activeElement){
                return true;
            }
            return ctx.callbacks.beforeAttributeUpdated(attr, to, updateType) === false;
        }

        /**
         * syncs a given node with another node, copying over all attributes and
         * inner element state from the 'from' node to the 'to' node
         *
         * @param {Element} from the element to copy attributes & state from
         * @param {Element} to the element to copy attributes & state to
         * @param ctx the merge context
         */
        function syncNodeFrom(from, to, ctx) {
            let type = from.nodeType

            // if is an element type, sync the attributes from the
            // new node into the new node
            if (type === 1 /* element type */) {
                const fromAttributes = from.attributes;
                const toAttributes = to.attributes;
                for (const fromAttribute of fromAttributes) {
                    if (ignoreAttribute(fromAttribute.name, to, 'update', ctx)) {
                        continue;
                    }
                    if (to.getAttribute(fromAttribute.name) !== fromAttribute.value) {
                        to.setAttribute(fromAttribute.name, fromAttribute.value);
                    }
                }
                // iterate backwards to avoid skipping over items when a delete occurs
                for (let i = toAttributes.length - 1; 0 <= i; i--) {
                    const toAttribute = toAttributes[i];
                    if (ignoreAttribute(toAttribute.name, to, 'remove', ctx)) {
                        continue;
                    }
                    if (!from.hasAttribute(toAttribute.name)) {
                        to.removeAttribute(toAttribute.name);
                    }
                }
            }

            // sync text nodes
            if (type === 8 /* comment */ || type === 3 /* text */) {
                if (to.nodeValue !== from.nodeValue) {
                    to.nodeValue = from.nodeValue;
                }
            }

            if (!ignoreValueOfActiveElement(to, ctx)) {
                // sync input values
                syncInputValue(from, to, ctx);
            }
        }

        /**
         * @param from {Element} element to sync the value from
         * @param to {Element} element to sync the value to
         * @param attributeName {String} the attribute name
         * @param ctx the merge context
         */
        function syncBooleanAttribute(from, to, attributeName, ctx) {
            if (from[attributeName] !== to[attributeName]) {
                let ignoreUpdate = ignoreAttribute(attributeName, to, 'update', ctx);
                if (!ignoreUpdate) {
                    to[attributeName] = from[attributeName];
                }
                if (from[attributeName]) {
                    if (!ignoreUpdate) {
                        to.setAttribute(attributeName, from[attributeName]);
                    }
                } else {
                    if (!ignoreAttribute(attributeName, to, 'remove', ctx)) {
                        to.removeAttribute(attributeName);
                    }
                }
            }
        }

        /**
         * NB: many bothans died to bring us information:
         *
         *  https://github.com/patrick-steele-idem/morphdom/blob/master/src/specialElHandlers.js
         *  https://github.com/choojs/nanomorph/blob/master/lib/morph.jsL113
         *
         * @param from {Element} the element to sync the input value from
         * @param to {Element} the element to sync the input value to
         * @param ctx the merge context
         */
        function syncInputValue(from, to, ctx) {
            if (from instanceof HTMLInputElement &&
                to instanceof HTMLInputElement &&
                from.type !== 'file') {

                let fromValue = from.value;
                let toValue = to.value;

                // sync boolean attributes
                syncBooleanAttribute(from, to, 'checked', ctx);
                syncBooleanAttribute(from, to, 'disabled', ctx);

                if (!from.hasAttribute('value')) {
                    if (!ignoreAttribute('value', to, 'remove', ctx)) {
                        to.value = '';
                        to.removeAttribute('value');
                    }
                } else if (fromValue !== toValue) {
                    if (!ignoreAttribute('value', to, 'update', ctx)) {
                        to.setAttribute('value', fromValue);
                        to.value = fromValue;
                    }
                }
            } else if (from instanceof HTMLOptionElement) {
                syncBooleanAttribute(from, to, 'selected', ctx)
            } else if (from instanceof HTMLTextAreaElement && to instanceof HTMLTextAreaElement) {
                let fromValue = from.value;
                let toValue = to.value;
                if (ignoreAttribute('value', to, 'update', ctx)) {
                    return;
                }
                if (fromValue !== toValue) {
                    to.value = fromValue;
                }
                if (to.firstChild && to.firstChild.nodeValue !== fromValue) {
                    to.firstChild.nodeValue = fromValue
                }
            }
        }

        //=============================================================================
        // the HEAD tag can be handled specially, either w/ a 'merge' or 'append' style
        //=============================================================================
        function handleHeadElement(newHeadTag, currentHead, ctx) {

            let added = []
            let removed = []
            let preserved = []
            let nodesToAppend = []

            let headMergeStyle = ctx.head.style;

            // put all new head elements into a Map, by their outerHTML
            let srcToNewHeadNodes = new Map();
            for (const newHeadChild of newHeadTag.children) {
                srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
            }

            // for each elt in the current head
            for (const currentHeadElt of currentHead.children) {

                // If the current head element is in the map
                let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
                let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
                let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
                if (inNewContent || isPreserved) {
                    if (isReAppended) {
                        // remove the current version and let the new version replace it and re-execute
                        removed.push(currentHeadElt);
                    } else {
                        // this element already exists and should not be re-appended, so remove it from
                        // the new content map, preserving it in the DOM
                        srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
                        preserved.push(currentHeadElt);
                    }
                } else {
                    if (headMergeStyle === "append") {
                        // we are appending and this existing element is not new content
                        // so if and only if it is marked for re-append do we do anything
                        if (isReAppended) {
                            removed.push(currentHeadElt);
                            nodesToAppend.push(currentHeadElt);
                        }
                    } else {
                        // if this is a merge, we remove this content since it is not in the new head
                        if (ctx.head.shouldRemove(currentHeadElt) !== false) {
                            removed.push(currentHeadElt);
                        }
                    }
                }
            }

            // Push the remaining new head elements in the Map into the
            // nodes to append to the head tag
            nodesToAppend.push(...srcToNewHeadNodes.values());
            log("to append: ", nodesToAppend);

            let promises = [];
            for (const newNode of nodesToAppend) {
                log("adding: ", newNode);
                let newElt = document.createRange().createContextualFragment(newNode.outerHTML).firstChild;
                log(newElt);
                if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
                    if (newElt.href || newElt.src) {
                        let resolve = null;
                        let promise = new Promise(function (_resolve) {
                            resolve = _resolve;
                        });
                        newElt.addEventListener('load', function () {
                            resolve();
                        });
                        promises.push(promise);
                    }
                    currentHead.appendChild(newElt);
                    ctx.callbacks.afterNodeAdded(newElt);
                    added.push(newElt);
                }
            }

            // remove all removed elements, after we have appended the new elements to avoid
            // additional network requests for things like style sheets
            for (const removedElement of removed) {
                if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
                    currentHead.removeChild(removedElement);
                    ctx.callbacks.afterNodeRemoved(removedElement);
                }
            }

            ctx.head.afterHeadMorphed(currentHead, {added: added, kept: preserved, removed: removed});
            return promises;
        }

        //=============================================================================
        // Misc
        //=============================================================================

        function log() {
            //console.log(arguments);
        }

        function noOp() {
        }

        /*
          Deep merges the config object and the Idiomoroph.defaults object to
          produce a final configuration object
         */
        function mergeDefaults(config) {
            let finalConfig = {};
            // copy top level stuff into final config
            Object.assign(finalConfig, defaults);
            Object.assign(finalConfig, config);

            // copy callbacks into final config (do this to deep merge the callbacks)
            finalConfig.callbacks = {};
            Object.assign(finalConfig.callbacks, defaults.callbacks);
            Object.assign(finalConfig.callbacks, config.callbacks);

            // copy head config into final config  (do this to deep merge the head)
            finalConfig.head = {};
            Object.assign(finalConfig.head, defaults.head);
            Object.assign(finalConfig.head, config.head);
            return finalConfig;
        }

        function createMorphContext(oldNode, newContent, config) {
            config = mergeDefaults(config);
            return {
                target: oldNode,
                newContent: newContent,
                config: config,
                morphStyle: config.morphStyle,
                ignoreActive: config.ignoreActive,
                ignoreActiveValue: config.ignoreActiveValue,
                idMap: createIdMap(oldNode, newContent),
                deadIds: new Set(),
                callbacks: config.callbacks,
                head: config.head
            }
        }

        function isIdSetMatch(node1, node2, ctx) {
            if (node1 == null || node2 == null) {
                return false;
            }
            if (node1.nodeType === node2.nodeType && node1.tagName === node2.tagName) {
                if (node1.id !== "" && node1.id === node2.id) {
                    return true;
                } else {
                    return getIdIntersectionCount(ctx, node1, node2) > 0;
                }
            }
            return false;
        }

        function isSoftMatch(node1, node2) {
            if (node1 == null || node2 == null) {
                return false;
            }
            return node1.nodeType === node2.nodeType && node1.tagName === node2.tagName
        }

        function removeNodesBetween(startInclusive, endExclusive, ctx) {
            while (startInclusive !== endExclusive) {
                let tempNode = startInclusive;
                startInclusive = startInclusive.nextSibling;
                removeNode(tempNode, ctx);
            }
            removeIdsFromConsideration(ctx, endExclusive);
            return endExclusive.nextSibling;
        }

        //=============================================================================
        // Scans forward from the insertionPoint in the old parent looking for a potential id match
        // for the newChild.  We stop if we find a potential id match for the new child OR
        // if the number of potential id matches we are discarding is greater than the
        // potential id matches for the new child
        //=============================================================================
        function findIdSetMatch(newContent, oldParent, newChild, insertionPoint, ctx) {

            // max id matches we are willing to discard in our search
            let newChildPotentialIdCount = getIdIntersectionCount(ctx, newChild, oldParent);

            let potentialMatch = null;

            // only search forward if there is a possibility of an id match
            if (newChildPotentialIdCount > 0) {
                let potentialMatch = insertionPoint;
                // if there is a possibility of an id match, scan forward
                // keep track of the potential id match count we are discarding (the
                // newChildPotentialIdCount must be greater than this to make it likely
                // worth it)
                let otherMatchCount = 0;
                while (potentialMatch != null) {

                    // If we have an id match, return the current potential match
                    if (isIdSetMatch(newChild, potentialMatch, ctx)) {
                        return potentialMatch;
                    }

                    // computer the other potential matches of this new content
                    otherMatchCount += getIdIntersectionCount(ctx, potentialMatch, newContent);
                    if (otherMatchCount > newChildPotentialIdCount) {
                        // if we have more potential id matches in _other_ content, we
                        // do not have a good candidate for an id match, so return null
                        return null;
                    }

                    // advanced to the next old content child
                    potentialMatch = potentialMatch.nextSibling;
                }
            }
            return potentialMatch;
        }

        //=============================================================================
        // Scans forward from the insertionPoint in the old parent looking for a potential soft match
        // for the newChild.  We stop if we find a potential soft match for the new child OR
        // if we find a potential id match in the old parents children OR if we find two
        // potential soft matches for the next two pieces of new content
        //=============================================================================
        function findSoftMatch(newContent, oldParent, newChild, insertionPoint, ctx) {

            let potentialSoftMatch = insertionPoint;
            let nextSibling = newChild.nextSibling;
            let siblingSoftMatchCount = 0;

            while (potentialSoftMatch != null) {

                if (getIdIntersectionCount(ctx, potentialSoftMatch, newContent) > 0) {
                    // the current potential soft match has a potential id set match with the remaining new
                    // content so bail out of looking
                    return null;
                }

                // if we have a soft match with the current node, return it
                if (isSoftMatch(newChild, potentialSoftMatch)) {
                    return potentialSoftMatch;
                }

                if (isSoftMatch(nextSibling, potentialSoftMatch)) {
                    // the next new node has a soft match with this node, so
                    // increment the count of future soft matches
                    siblingSoftMatchCount++;
                    nextSibling = nextSibling.nextSibling;

                    // If there are two future soft matches, bail to allow the siblings to soft match
                    // so that we don't consume future soft matches for the sake of the current node
                    if (siblingSoftMatchCount >= 2) {
                        return null;
                    }
                }

                // advanced to the next old content child
                potentialSoftMatch = potentialSoftMatch.nextSibling;
            }

            return potentialSoftMatch;
        }

        function parseContent(newContent) {
            let parser = new DOMParser();

            // remove svgs to avoid false-positive matches on head, etc.
            let contentWithSvgsRemoved = newContent.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, '');

            // if the newContent contains a html, head or body tag, we can simply parse it w/o wrapping
            if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
                let content = parser.parseFromString(newContent, "text/html");
                // if it is a full HTML document, return the document itself as the parent container
                if (contentWithSvgsRemoved.match(/<\/html>/)) {
                    content.generatedByIdiomorph = true;
                    return content;
                } else {
                    // otherwise return the html element as the parent container
                    let htmlElement = content.firstChild;
                    if (htmlElement) {
                        htmlElement.generatedByIdiomorph = true;
                        return htmlElement;
                    } else {
                        return null;
                    }
                }
            } else {
                // if it is partial HTML, wrap it in a template tag to provide a parent element and also to help
                // deal with touchy tags like tr, tbody, etc.
                let responseDoc = parser.parseFromString("<body><template>" + newContent + "</template></body>", "text/html");
                let content = responseDoc.body.querySelector('template').content;
                content.generatedByIdiomorph = true;
                return content
            }
        }

        function normalizeContent(newContent) {
            if (newContent == null) {
                // noinspection UnnecessaryLocalVariableJS
                const dummyParent = document.createElement('div');
                return dummyParent;
            } else if (newContent.generatedByIdiomorph) {
                // the template tag created by idiomorph parsing can serve as a dummy parent
                return newContent;
            } else if (newContent instanceof Node) {
                // a single node is added as a child to a dummy parent
                const dummyParent = document.createElement('div');
                dummyParent.append(newContent);
                return dummyParent;
            } else {
                // all nodes in the array or HTMLElement collection are consolidated under
                // a single dummy parent element
                const dummyParent = document.createElement('div');
                for (const elt of [...newContent]) {
                    dummyParent.append(elt);
                }
                return dummyParent;
            }
        }

        function insertSiblings(previousSibling, morphedNode, nextSibling) {
            let stack = []
            let added = []
            while (previousSibling != null) {
                stack.push(previousSibling);
                previousSibling = previousSibling.previousSibling;
            }
            while (stack.length > 0) {
                let node = stack.pop();
                added.push(node); // push added preceding siblings on in order and insert
                morphedNode.parentElement.insertBefore(node, morphedNode);
            }
            added.push(morphedNode);
            while (nextSibling != null) {
                stack.push(nextSibling);
                added.push(nextSibling); // here we are going in order, so push on as we scan, rather than add
                nextSibling = nextSibling.nextSibling;
            }
            while (stack.length > 0) {
                morphedNode.parentElement.insertBefore(stack.pop(), morphedNode.nextSibling);
            }
            return added;
        }

        function findBestNodeMatch(newContent, oldNode, ctx) {
            let currentElement;
            currentElement = newContent.firstChild;
            let bestElement = currentElement;
            let score = 0;
            while (currentElement) {
                let newScore = scoreElement(currentElement, oldNode, ctx);
                if (newScore > score) {
                    bestElement = currentElement;
                    score = newScore;
                }
                currentElement = currentElement.nextSibling;
            }
            return bestElement;
        }

        function scoreElement(node1, node2, ctx) {
            if (isSoftMatch(node1, node2)) {
                return .5 + getIdIntersectionCount(ctx, node1, node2);
            }
            return 0;
        }

        function removeNode(tempNode, ctx) {
            removeIdsFromConsideration(ctx, tempNode)
            if (ctx.callbacks.beforeNodeRemoved(tempNode) === false) return;

            tempNode.remove();
            ctx.callbacks.afterNodeRemoved(tempNode);
        }

        //=============================================================================
        // ID Set Functions
        //=============================================================================

        function isIdInConsideration(ctx, id) {
            return !ctx.deadIds.has(id);
        }

        function idIsWithinNode(ctx, id, targetNode) {
            let idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
            return idSet.has(id);
        }

        function removeIdsFromConsideration(ctx, node) {
            let idSet = ctx.idMap.get(node) || EMPTY_SET;
            for (const id of idSet) {
                ctx.deadIds.add(id);
            }
        }

        function getIdIntersectionCount(ctx, node1, node2) {
            let sourceSet = ctx.idMap.get(node1) || EMPTY_SET;
            let matchCount = 0;
            for (const id of sourceSet) {
                // a potential match is an id in the source and potentialIdsSet, but
                // that has not already been merged into the DOM
                if (isIdInConsideration(ctx, id) && idIsWithinNode(ctx, id, node2)) {
                    ++matchCount;
                }
            }
            return matchCount;
        }

        /**
         * A bottom up algorithm that finds all elements with ids inside of the node
         * argument and populates id sets for those nodes and all their parents, generating
         * a set of ids contained within all nodes for the entire hierarchy in the DOM
         *
         * @param node {Element}
         * @param {Map<Node, Set<String>>} idMap
         */
        function populateIdMapForNode(node, idMap) {
            let nodeParent = node.parentElement;
            // find all elements with an id property
            let idElements = node.querySelectorAll('[id]');
            for (const elt of idElements) {
                let current = elt;
                // walk up the parent hierarchy of that element, adding the id
                // of element to the parent's id set
                while (current !== nodeParent && current != null) {
                    let idSet = idMap.get(current);
                    // if the id set doesn't exist, create it and insert it in the  map
                    if (idSet == null) {
                        idSet = new Set();
                        idMap.set(current, idSet);
                    }
                    idSet.add(elt.id);
                    current = current.parentElement;
                }
            }
        }

        /**
         * This function computes a map of nodes to all ids contained within that node (inclusive of the
         * node).  This map can be used to ask if two nodes have intersecting sets of ids, which allows
         * for a looser definition of "matching" than tradition id matching, and allows child nodes
         * to contribute to a parent nodes matching.
         *
         * @param {Element} oldContent  the old content that will be morphed
         * @param {Element} newContent  the new content to morph to
         * @returns {Map<Node, Set<String>>} a map of nodes to id sets for the
         */
        function createIdMap(oldContent, newContent) {
            let idMap = new Map();
            populateIdMapForNode(oldContent, idMap);
            populateIdMapForNode(newContent, idMap);
            return idMap;
        }

        //=============================================================================
        // This is what ends up becoming the Idiomorph global object
        //=============================================================================
        return {
            morph,
            defaults
        }
    })();
(function(){
    function createMorphConfig(swapStyle) {
        if (swapStyle === 'morph' || swapStyle === 'morph:outerHTML') {
            return {morphStyle: 'outerHTML'}
        } else if (swapStyle === 'morph:innerHTML') {
            return {morphStyle: 'innerHTML'}
        } else if (swapStyle.startsWith("morph:")) {
            return Function("return (" + swapStyle.slice(6) + ")")();
        }
    }

    htmx.defineExtension('morph', {
        isInlineSwap: function(swapStyle) {
            let config = createMorphConfig(swapStyle);
            return config.swapStyle === "outerHTML" || config.swapStyle == null;
        },
        handleSwap: function (swapStyle, target, fragment) {
            let config = createMorphConfig(swapStyle);
            if (config) {
                return Idiomorph.morph(target, fragment.children, config);
            }
        }
    });
})()
