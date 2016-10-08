// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import Global from './Global';

export default class WebStorageStateStore {
    constructor({prefix = "oidc.", store = Global.localStorage} = {}) {
        /**
         * detect IE
         * returns version of IE or false, if browser is not Internet Explorer
         */
        function detectIE() {
            var ua = window.navigator.userAgent;

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        }

        var iever = detectIE();
        if (iever !== false && detectIE() < 12) {
            this._store = window.localStorage; //Global.localStorage;
        } else {
            this._store = store;
        }

        this._prefix = prefix;
    }

    set(key, value) {
        Log.info("WebStorageStateStore.set", key);

        key = this._prefix + key;

        this._store.setItem(key, value);

        return Promise.resolve();
    }

    get(key) {
        Log.info("WebStorageStateStore.get", key);

        key = this._prefix + key;

        let item = this._store.getItem(key);

        return Promise.resolve(item);
    }

    remove(key) {
        Log.info("WebStorageStateStore.remove", key);

        key = this._prefix + key;

        let item = this._store.getItem(key);
        this._store.removeItem(key);

        return Promise.resolve(item);
    }

    getAllKeys() {
        Log.info("WebStorageStateStore.getAllKeys");

        var keys = [];

        for (let index = 0; index < this._store.length; index++) {
            let key = this._store.key(index);

            if (key.indexOf(this._prefix) === 0) {
                keys.push(key.substr(this._prefix.length));
            }
        }

        return Promise.resolve(keys);
    }
}
