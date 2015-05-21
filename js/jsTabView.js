var jsTabView = (function() {
    'use strict';

    var ACTIVE_CLASS = 'active',
        HEADER_CLASS = 'header',
        HEADERS_CONTAINER_CLASS = 'tab-headers',
        CONTENT_CONTAINER_CLASS = 'tab-headers';;

    function TabView(selector) {
        this.$headers = document.querySelector(selector + ' .' + HEADERS_CONTAINER_CLASS);
        this.$content = document.querySelector(selector + ' .' + CONTENT_CONTAINER_CLASS);

        this.tabsCount = 0;
        this.tabs = {};
        this.contents = {};
    }

    /**
     * Sets tab to active.
     * @param tabId tab identifier
     * @returns {boolean} is operation successfull or not
     */
    TabView.prototype.setActive = function(tabId) {
        if (!tabId || !(tabId in this.tabs)) {
            return false;
        }
        var tabView = this;

        Object.keys(this.tabs).forEach(function(tabKey) {
            tabView.tabs[tabKey].classList.remove(ACTIVE_CLASS);
        });

        this.tabs[tabId].classList.add(ACTIVE_CLASS);
        this.setContent(this.contents[tabId]);

        return true;
    };

    /**
     * Changes tab title of specified by id tab or active tab title.
     * @param newTabName
     * @param tabId
     * @returns {boolean} is operation successfull or not
     */
    TabView.prototype.changeTitle = function(newTabName, tabId) {
        var targetTabId = tabId || _getActiveTabId(this.tabs);

        if (!tabId in this.tabs) {
            return false;
        }

        this.tabs[targetTabId].innerText = newTabName;
        return true;
    };

    /**
     * Sets tab content.
     * @param content
     * @param tabId
     * @returns {boolean} is operation successfull or not
     */
    TabView.prototype.setContent = function(content, tabId) {
        var activeTabId = _getActiveTabId(this.tabs),
            targetTabId = tabId || activeTabId;

        if (!targetTabId in this.contents) {
            return false;
        }

        this.contents[targetTabId] = content;
        if (activeTabId === targetTabId) {
            this.$content.innerHTML = content;
        }
        return true;
    };

    /**
     * Deletes tab by name or current active tab.
     * @param tabId
     * @returns {boolean} is operation successfull or not
     */
    TabView.prototype.deleteTab = function(tabId) {
        var activeTabId = _getActiveTabId(this.tabs),
            tabIdToDelete = tabId || activeTabId,
            delTab = delete this.tabs[tabIdToDelete],
            delContent = delete this.contents[tabIdToDelete];

        if (activeTabId === tabIdToDelete) {
            if (this.tabsCount > 0) {
                // TODO:
            }
        }

        if (delTab && delContent) {
            --this.tabsCount;
            return true;
        }
        return false;
    };

    /**
     * Adds tab and it's content. Sets tab active if it's the only one.
     * @param title
     * @param tabName
     * @param content
     * @returns {string} new tab id
     */
    TabView.prototype.addTab = function(title, content) {
        var tab = this,
            newTabId = _getNewTabId(this.tabs),
            newHeaderElement = document.createElement('div');

        newHeaderElement.className += HEADER_CLASS;
        newHeaderElement.innerHTML = content;
        newHeaderElement.innerText = title;

        this.$headers.appendChild(newHeaderElement);
        ++this.tabsCount;
        this.tabs[newTabId] = newHeaderElement;
        this.contents[newTabId] = content;

        if (this.tabsCount < 2) {
            _schedule(function() {
                tab.setActive(newTabId);
            });
        }

        return newTabId;
    };


    /* PRIVATE FUNCTIONS */

    function _getActiveTabId(tabs) {
        for (var key in tabs) {
            if (tabs[key].className.indexOf(ACTIVE_CLASS)) {
                return key;
            }
        }
    }

    function _schedule(fn, delay) {
        var intervalId = setTimeout(fn, delay || 0);
        return function() {
            clearTimeout(intervalId);
        };
    }

    function _getNewTabId(obj) {
        var newId;
        do {
            newId = Math.random().toString();
        } while (!newId || (newId in obj));
        return newId;
    }


    return TabView;

})();
