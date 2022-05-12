function __totango2(options) {
  "use strict";

  // For IE8 and earlier version.
  if (!Date.now) {
    Date.now = function() {
      return new Date().valueOf();
    }
  }

  var valueFromEntityObj = function(entity, keys) {
     if (!entity) {
       return null;
     }
     for (var i = 0; i < keys.length; ++i) {
       if (entity[keys[i]]) {
         return entity[keys[i]];
       }
     }
  },
  attributeInKeys = function(att,map) {
    for (var x in map) {
      var keys = map[x].keys;
      for (var i = 0; i < keys.length; ++i) {
        if (att == keys[i]) {
          return true;
        }
      }
    }
    return false;
  },
  translateToCanonicalAttributeNames = function (entity,map) {
    if (!entity) {
      return entity;
    }
    for (var x in map) {
      var keys = map[x].keys;
      for (var i = 0; i < keys.length; ++i) {
        if (entity[keys[i]]) {
          var tmp = entity[keys[i]];
          delete entity[keys[i]];
          entity[x] = tmp;
        }
      }
    }
    return entity;
  };

  this.setOptions = function(options) {
    if (!options) return;
    if( options.heartbeat_timeout_sec == undefined ){
    	options.heartbeat_timeout_sec = 60;
    }
    if( options.heartbeat_idle_timeout_sec == undefined ){
    	options.heartbeat_idle_timeout_sec = 60;
    }
    if( typeof options.allow_empty_accounts === 'undefined' ){
    	options.allow_empty_accounts = true;
    }	
    this.allow_empty_accounts = options.allow_empty_accounts
    //options.heartbeat_timeout_sec = options.heartbeat_timeout_sec == undefined ? 60 : options.heartbeat_timeout_sec;
    //options.heartbeat_idle_timeout_sec = options.heartbeat_idle_timeout_sec == undefined ? 60 : options.heartbeat_idle_timeout_sec;
    this.service_id = options.service_id || this.service_id;
    this.heartbeat_timeout_ms = (options.disable_heartbeat || options.heartbeat_timeout_sec < 30) ? -1 : options.heartbeat_timeout_sec * 1000;
    this.heartbeat_idle_timeout_ms = options.heartbeat_idle_timeout_sec * 1000;
    this.username = options.username || this.username;
    this.module = options.module;
    this.account = this.account || {};
    
    this.user = this.user || {};
    if( typeof options.user === "string" ){
    	this.user.id = options.user;
    } else if (typeof options.user === "object") {
      this.user = this.merge(options.user);
    }
    if( typeof options.username === "string" ){
    	this.user.id = this.user.id || options.username;
    }
    
    if (typeof options.account === "string") {
      this.account.id = options.account;  
    } else if (typeof options.account === "object") {
      this.account = this.merge(options.account);
    }
  }

  this.track = function track(activity, module, org, user) {
    var userObject = user;
    this.user = this.user || {};
    userObject = this.merge(userObject,this.user);
    userObject = this.merge(userObject, user);
    userObject = this.getUserObject(userObject);
    if( typeof user === "string" ){
    	userObject.id = user;
    }
    if (! userObject.id ) {
      // no user, no tracking 
      return null;
    }

    var account = org;
    this.account = this.account || {};
    account = this.merge(account, this.account);
    account = this.merge(account, org);
    account = this.getAccount(account);
    if (typeof org === 'string') {
      account.id = org;
    }
    
    if( !account.id && !this.allow_empty_accounts ){
    	return null;
    }
    
    module = module || this.module;

    var src = [];
    var proto = (("https:" == document.location.protocol) ? "https://" : "http://");
    
    src.push("sdr_s=" + this.service_id);
    if (account.id) {
      src.push("sdr_o=" + encodeURIComponent(account.id));
    }
    if (account.fid) {
      src.push("sdr_ofid=" + encodeURIComponent(account.fid));
    }
    if (userObject) {
      src.push("sdr_u=" + encodeURIComponent(userObject.id));
    }
    if (activity) {
      src.push("sdr_a=" + encodeURIComponent(activity));
    }
    if (module) {
      src.push("sdr_m=" + encodeURIComponent(module));
    }
    if (account.name) {
      src.push("sdr_odn=" + encodeURIComponent(account.name));
    }
    if (account.attributes) {
      src.push(account.attributes);
    }
    if(userObject.attributes){
    	src.push(userObject.attributes);
    }
    src.push("sdrurl=" + encodeURIComponent(document.location.href));
    src.push("r=" + Math.random());
    src.push("sdr_heartbeat=" + encodeURIComponent(options.heartbeat_timeout_sec));
    src.push("sdr_heartbeat_idle=" + encodeURIComponent(options.heartbeat_idle_timeout_sec));
    var img = new Image();
    img.src = (proto + "sdr.totango.com/pixel.gif/?") + src.join('&');
    this.savecookie("totango.org_attributes", "", 0);
    this.savecookie("totango.user_attributes", "", 0);
    return img;
  }
  this.identify = function(org, user) {
    var account = this.getAccount(org);
    var userObject = this.getUserObject(user);
    this.user = this.merge({},userObject);
    this.account = this.merge({}, account);
    if (this.account.attributes) {
      this.account.attributes = this.deserialize('sdr_o.', this.account.attributes);
    }
    if(this.user.attributes){
    	this.user.attributes = this.deserialize("sdr.u.", this.user.attributes);
    }
    this.savecookie("totango.org_name", account.id || '', 1);
    this.savecookie("totango.user", userObject.id || '', 1);
    this.savecookie("totango.org_dn", account.name || '', 1);
    this.savecookie("totango.org_ofid", account.fid || '', 1);

    if (null != account.id && null != account.attributes && "" != account.attributes) {
      return this.track(null, null, account, userObject);
    } else if (null != account.attributes) {
      this.savecookie("totango.org_attributes", account.attributes || '', 180);
      return null;
    }
  }
  this.setAccountAttributes = function(org) {
    this.clearAttributes();
    var account = this.getAccount(org);
    if (null != account.id && null != account.attributes && "" != account.attributes) {
      return this.track(null, null, account, null);
    } else {
      this.savecookie("totango.org_attributes", account.attributes, 1);
      return null;
    }
  }
  this.setUserAttributes = function(org,user) {
	    this.clearUserAttributes();
	    var userObject = this.getUserObject(user);
	    var account = this.getAccount(org);
	    if (null != userObject.id && null != userObject.attributes && "" != userObject.attributes) {
	      return this.track(null, null, account, userObject);
	    } else {
	      this.savecookie("totango.user_attributes", user.attributes, 1);
	      return null;
	    }
	  }
  this.getAccount = function(org) {
    var map = {
        id: {keys: ['id', 'o'], func: function(self){return self.getOrg()}},
        fid: {keys: ['fid', 'ofid'], func: function(self){return self.getOrgId()}},
        name: {keys: ['name', 'odn'], func: function(self){return self.getOrgDisplayName()}},
        attributes: {keys: ['attributes'], func: function(self){return null}}};
    
    var result = {};
    if (org != null && typeof org === 'object') {
      org = translateToCanonicalAttributeNames(org,map);
      if (org.attributes) {
        org.attributes = this.deserialize('', org.attributes);
      }
      org = this.merge(this.account, org);
      for (var attr in map) {
        var binding = map[attr];
        var value = valueFromEntityObj(org, binding.keys) || binding.func(this) || result[attr];
        if (value) {
          result[attr] = value;
        }
      }
      // add extra attributes, if exist
      for (var att in org) {
        if (! attributeInKeys(att,map)) {
          result.attributes = result.attributes || {};
          result.attributes[att] = org[att];
        }
      }
    } else {
      result.id = org || map.id.func(this);
    }
    var cookieAttributes = this.getCookieAttributes();
    result.attributes = this.merge(cookieAttributes, result.attributes);
    result.attributes = this.serialize('sdr_o.', result.attributes);
    if (!result.attributes) {
      delete result.attributes;
    }
    return result;
  }
  this.serialize = function (prefix, hash) {
    var ser = [];
    for (var a in hash) {
      ser.push(encodeURIComponent(prefix + a) + '=' + encodeURIComponent(hash[a]));
    }
    return ser.join('&');
  }
  this.deserialize = function (prefix, stringOrObject) {
    if (! stringOrObject) {
      return {};
    }
    if (typeof stringOrObject === 'object') {
      return stringOrObject;
    }
    var pairs = stringOrObject.split('&');
    var ret = {};
    for(var i = 0; i < pairs.length; i++ ) {
      var check = pairs[i].split('=');
      var key = decodeURIComponent(check[0]).substr(prefix.length);
      ret[key] = decodeURIComponent(check[1]);
    }
    return ret;
  }
  this.getCookieAttributes = function () {
    var str = this.readcookie("totango.org_attributes");
    return this.deserialize('sdr_o.', str);
  }
  this.getUserCookieAttributes = function(){
	  var str = this.readcookie("totango.user_attributes");
	    return this.deserialize('sdr_u.', str);
  }
  this.getOrgId = function () {
    return this.readcookie("totango.org_ofid");
  }
  this.getOrgDisplayName = function () {
    return this.readcookie("totango.org_dn");
  }
  this.getOrg = function () {
    return this.readcookie("totango.org_name");
  }
  this.getUserId = function () {
	  var userId;
	  if( this.user ){
		  userId = this.user.id;
	  }
	  return userId || this.readcookie("totango.user");
  }
  this.getUser = function(){
	  return this.user.id || this.readcookie("totango.user");
  }
  this.getUserObject = function (user) {
	  var map = {
		        id: {keys: ['id', 'u'], func: function(self){return self.getUserId()}},
		        attributes: {keys: ['attributes'], func: function(self){return null}}};
		    
		    var result = {};
		    if (user != null && typeof user === 'object') {
		    	user = translateToCanonicalAttributeNames(user,map);
		      if (user.attributes) {
		    	  user.attributes = this.deserialize('', user.attributes);
		      }
		      user = this.merge(this.user, user);
		      for (var attr in map) {
		        var binding = map[attr];
		        var value = valueFromEntityObj(user, binding.keys) || binding.func(this) || result[attr];
		        if (value) {
		          result[attr] = value;
		        }
		      }
		      // add extra attributes, if exist
		      for (var att in user) {
		        if (! attributeInKeys(att,map)) {
		          result.attributes = result.attributes || {};
		          result.attributes[att] = user[att];
		        }
		      }
		    } else {
		      result.id = user || map.id.func(this);
		    }
		    var cookieAttributes = this.getUserCookieAttributes();
		    result.attributes = this.merge(cookieAttributes, result.attributes);
		    result.attributes = this.serialize('sdr_u.', result.attributes);
		    if (!result.attributes) {
		      delete result.attributes;
		    }
		    return result;
  }
  this.savecookie = function savecookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (((typeof (days) != "undefined") ? days : 3) * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    var cookie = name + "=" + value + expires + "; path=/";
	if ("https:" == document.location.protocol)
		cookie += "; secure"
	document.cookie = cookie;
  }
  this.readcookie = function readcookie(name) {
    var re = new RegExp("(?:^| )" + name + "=([^;]*)", "i");
    var matches = document.cookie.match(re);
    return (matches && matches.length == 2) ? matches[1] : null;
  }
  this.clearAttributes = function(){
    this.savecookie("totango.org_attributes","",0);
    if (this.account) {
      delete this.account.attributes;
    }
  }
  this.clearUserAttributes = function(){
	  this.savecookie("totango.user_attributes","",0);
	    if (this.user) {
	      delete this.user.attributes;
	    }
  }
  this.clear = function () {
    this.clearAttributes();
    this.clearUserAttributes();
    this.savecookie("totango.org_dn","",0);
    this.savecookie("totango.org_name","",0);
    this.savecookie("totango.org_ofid","",0);
    this.savecookie("totango.user","",0);
    
    this.savecookie("totango.heartbeat.last_module", "", 0);
    this.savecookie("totango.heartbeat.last_ts", "", 0);
  }
  this.heartbeat = function() {
    if (this.heartbeat_timeout_ms > 0) {
    	var module = this.module || '__system';
    	var last_module = this.readcookie("totango.heartbeat.last_module");
    	var last_sent_heartbeat_ts = this.readcookie("totango.heartbeat.last_ts");
    	if( last_module && last_module == module ){
    		if( Date.now() - new Date(last_sent_heartbeat_ts).valueOf() < 60000 ){
    			return null;
    		}
    	}
      if (this.isIdle()) {
        return null;
      }
      var img = this.track('__heartbeat', this.module || '__system');
      
      this.savecookie("totango.heartbeat.last_module",module);
  	  this.savecookie("totango.heartbeat.last_ts", Date.now());
  	  
      var self = this;
      window.__totangoTrackTimer = setTimeout(function(){self.heartbeat()}, this.heartbeat_timeout_ms);
    }
    return img;
  }
  this.startTracking = function() {
    if (!window.__totangoTrackTimer) {
      this.lastUserInteraction = Date.now();
      if (this.heartbeat_timeout_ms > 0) {
        this.attachListeners();
      }
    }
    this.heartbeat();
  }
  this.attachListeners = function() {
    var self = this;
    var target = function(){self.onUserInteraction()};
    this.addEvent(document, "keyup", target);
    this.addEvent(document, "mousemove", target);
    this.addEvent(document, "click", target);
    this.addEvent(window, "scroll", target);
  };
  /**
   * CrossBrowser efent attachement
   * @param  {DomElement}   el Dom Element to attach the event
   * @param  {string}   ev name of the event with on prefix
   * @param  {Function} fn callback function to run when event is fired
   */
  this.addEvent = (function () {
    var setListener;
    return function (el, ev, fn) {
      if (!setListener) {
        if (el.addEventListener) {
          setListener = function (el, ev, fn) {
            el.addEventListener(ev, fn, false);
          };
        } else if (el.attachEvent) {
          setListener = function (el, ev, fn) {
            el.attachEvent('on' + ev, fn);
          };
        } else {
          setListener = function (el, ev, fn) {
            el['on' + ev] =  fn;
          };
        }
      }
      setListener(el, ev, fn);
   };
  }());

  this.isIdle = function() {
    return Date.now() - this.lastUserInteraction > this.heartbeat_idle_timeout_ms;
  };
  this.onUserInteraction = function() {
    var wasIdle = this.isIdle();
    this.lastUserInteraction = Date.now();
    if (wasIdle) {
      this.heartbeat();
    }
  }
  this.merge = function(o1, o2) {
    var o3 = {};
    this.extend(o3, o1);
    this.extend(o3, o2);
    return o3;
  }
  this.extend = function(o1, o2) {
    for (var p in o2) {
      if (typeof o2[p] === 'object') {
        if (typeof o1[p] !== 'object') {
          o1[p] = {};
        }
        this.extend(o1[p], o2[p]);
      } else if (o2.hasOwnProperty(p)) {
        o1[p] = o2[p];
      }
    }
  }

  this.go = function(options) {
    this.setOptions(options);
    if (this.user.id) {
      this.startTracking();
      return 1;
    } else {
      return -2;
    }
  }
  this.go(options);
}

if (window.totango_options) {
  var tracker_name = window.totango_options.tracker_name || "totango";
  window[tracker_name] = new __totango2(window.totango_options);
}
