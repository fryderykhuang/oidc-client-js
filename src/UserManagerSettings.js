// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import OidcClientSettings from './OidcClientSettings';
import RedirectNavigator from './RedirectNavigator';
import PopupNavigator from './PopupNavigator';
import IFrameNavigator from './IFrameNavigator';
import WebStorageStateStore from './WebStorageStateStore';
import Global from './Global';

const DefaultAccessTokenExpiringNotificationTime = 60;

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

export default class UserManagerSettings extends OidcClientSettings {
    constructor({
        popup_redirect_uri,
        popupWindowFeatures,
        popupWindowTarget,
        silent_redirect_uri,
        silentRequestTimeout,
        automaticSilentRenew = false,
        accessTokenExpiringNotificationTime = DefaultAccessTokenExpiringNotificationTime,
        redirectNavigator = new RedirectNavigator(),
        popupNavigator = new PopupNavigator(),
        iframeNavigator = new IFrameNavigator(),
        userStore = new WebStorageStateStore({store: Global.sessionStorage})
    } = {}) {
        super(arguments[0]);
        try {
            var iever = detectIE();
            if (iever !== false && iever < 12) {
                userStore = new WebStorageStateStore({store: Global.localStorage});
            }
        }
        catch (e) {
            console.log(e);
        }

        this._popup_redirect_uri = popup_redirect_uri;
        this._popupWindowFeatures = popupWindowFeatures;
        this._popupWindowTarget = popupWindowTarget;

        this._silent_redirect_uri = silent_redirect_uri;
        this._silentRequestTimeout = silentRequestTimeout;
        this._automaticSilentRenew = !!automaticSilentRenew;
        this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;

        this._redirectNavigator = redirectNavigator;
        this._popupNavigator = popupNavigator;
        this._iframeNavigator = iframeNavigator;

        this._userStore = userStore;
    }

    get popup_redirect_uri() {
        return this._popup_redirect_uri;
    }

    get popupWindowFeatures() {
        return this._popupWindowFeatures;
    }

    get popupWindowTarget() {
        return this._popupWindowTarget;
    }

    get silent_redirect_uri() {
        return this._silent_redirect_uri;
    }

    get silentRequestTimeout() {
        return this._silentRequestTimeout;
    }

    get automaticSilentRenew() {
        return !!(this.silent_redirect_uri && this._automaticSilentRenew);
    }

    get accessTokenExpiringNotificationTime() {
        return this._accessTokenExpiringNotificationTime;
    }

    get redirectNavigator() {
        return this._redirectNavigator;
    }

    get popupNavigator() {
        return this._popupNavigator;
    }

    get iframeNavigator() {
        return this._iframeNavigator;
    }

    get userStore() {
        return this._userStore;
    }
}
