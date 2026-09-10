var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.production.min.js
var require_react_production_min = __commonJS({
  "node_modules/react/cjs/react.production.min.js"(exports) {
    "use strict";
    var l = Symbol.for("react.element");
    var n = Symbol.for("react.portal");
    var p = Symbol.for("react.fragment");
    var q = Symbol.for("react.strict_mode");
    var r = Symbol.for("react.profiler");
    var t = Symbol.for("react.provider");
    var u = Symbol.for("react.context");
    var v = Symbol.for("react.forward_ref");
    var w = Symbol.for("react.suspense");
    var x = Symbol.for("react.memo");
    var y = Symbol.for("react.lazy");
    var z = Symbol.iterator;
    function A(a) {
      if (null === a || "object" !== typeof a) return null;
      a = z && a[z] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var B = { isMounted: function() {
      return false;
    }, enqueueForceUpdate: function() {
    }, enqueueReplaceState: function() {
    }, enqueueSetState: function() {
    } };
    var C = Object.assign;
    var D = {};
    function E(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    E.prototype.isReactComponent = {};
    E.prototype.setState = function(a, b) {
      if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, a, b, "setState");
    };
    E.prototype.forceUpdate = function(a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    };
    function F() {
    }
    F.prototype = E.prototype;
    function G(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    var H = G.prototype = new F();
    H.constructor = G;
    C(H, E.prototype);
    H.isPureReactComponent = true;
    var I = Array.isArray;
    var J = Object.prototype.hasOwnProperty;
    var K = { current: null };
    var L = { key: true, ref: true, __self: true, __source: true };
    function M(a, b, e) {
      var d, c = {}, k = null, h2 = null;
      if (null != b) for (d in void 0 !== b.ref && (h2 = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
      var g = arguments.length - 2;
      if (1 === g) c.children = e;
      else if (1 < g) {
        for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
        c.children = f;
      }
      if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
      return { $$typeof: l, type: a, key: k, ref: h2, props: c, _owner: K.current };
    }
    function N(a, b) {
      return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
    }
    function O(a) {
      return "object" === typeof a && null !== a && a.$$typeof === l;
    }
    function escape(a) {
      var b = { "=": "=0", ":": "=2" };
      return "$" + a.replace(/[=:]/g, function(a2) {
        return b[a2];
      });
    }
    var P = /\/+/g;
    function Q(a, b) {
      return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
    }
    function R(a, b, e, d, c) {
      var k = typeof a;
      if ("undefined" === k || "boolean" === k) a = null;
      var h2 = false;
      if (null === a) h2 = true;
      else switch (k) {
        case "string":
        case "number":
          h2 = true;
          break;
        case "object":
          switch (a.$$typeof) {
            case l:
            case n:
              h2 = true;
          }
      }
      if (h2) return h2 = a, c = c(h2), a = "" === d ? "." + Q(h2, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
        return a2;
      })) : null != c && (O(c) && (c = N(c, e + (!c.key || h2 && h2.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
      h2 = 0;
      d = "" === d ? "." : d + ":";
      if (I(a)) for (var g = 0; g < a.length; g++) {
        k = a[g];
        var f = d + Q(k, g);
        h2 += R(k, b, e, f, c);
      }
      else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h2 += R(k, b, e, f, c);
      else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
      return h2;
    }
    function S(a, b, e) {
      if (null == a) return a;
      var d = [], c = 0;
      R(a, d, "", "", function(a2) {
        return b.call(e, a2, c++);
      });
      return d;
    }
    function T(a) {
      if (-1 === a._status) {
        var b = a._result;
        b = b();
        b.then(function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
        }, function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
        });
        -1 === a._status && (a._status = 0, a._result = b);
      }
      if (1 === a._status) return a._result.default;
      throw a._result;
    }
    var U = { current: null };
    var V = { transition: null };
    var W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
    function X() {
      throw Error("act(...) is not supported in production builds of React.");
    }
    exports.Children = { map: S, forEach: function(a, b, e) {
      S(a, function() {
        b.apply(this, arguments);
      }, e);
    }, count: function(a) {
      var b = 0;
      S(a, function() {
        b++;
      });
      return b;
    }, toArray: function(a) {
      return S(a, function(a2) {
        return a2;
      }) || [];
    }, only: function(a) {
      if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
      return a;
    } };
    exports.Component = E;
    exports.Fragment = p;
    exports.Profiler = r;
    exports.PureComponent = G;
    exports.StrictMode = q;
    exports.Suspense = w;
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
    exports.act = X;
    exports.cloneElement = function(a, b, e) {
      if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
      var d = C({}, a.props), c = a.key, k = a.ref, h2 = a._owner;
      if (null != b) {
        void 0 !== b.ref && (k = b.ref, h2 = K.current);
        void 0 !== b.key && (c = "" + b.key);
        if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
        for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
      }
      var f = arguments.length - 2;
      if (1 === f) d.children = e;
      else if (1 < f) {
        g = Array(f);
        for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
        d.children = g;
      }
      return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h2 };
    };
    exports.createContext = function(a) {
      a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
      a.Provider = { $$typeof: t, _context: a };
      return a.Consumer = a;
    };
    exports.createElement = M;
    exports.createFactory = function(a) {
      var b = M.bind(null, a);
      b.type = a;
      return b;
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(a) {
      return { $$typeof: v, render: a };
    };
    exports.isValidElement = O;
    exports.lazy = function(a) {
      return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
    };
    exports.memo = function(a, b) {
      return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
    };
    exports.startTransition = function(a) {
      var b = V.transition;
      V.transition = {};
      try {
        a();
      } finally {
        V.transition = b;
      }
    };
    exports.unstable_act = X;
    exports.useCallback = function(a, b) {
      return U.current.useCallback(a, b);
    };
    exports.useContext = function(a) {
      return U.current.useContext(a);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(a) {
      return U.current.useDeferredValue(a);
    };
    exports.useEffect = function(a, b) {
      return U.current.useEffect(a, b);
    };
    exports.useId = function() {
      return U.current.useId();
    };
    exports.useImperativeHandle = function(a, b, e) {
      return U.current.useImperativeHandle(a, b, e);
    };
    exports.useInsertionEffect = function(a, b) {
      return U.current.useInsertionEffect(a, b);
    };
    exports.useLayoutEffect = function(a, b) {
      return U.current.useLayoutEffect(a, b);
    };
    exports.useMemo = function(a, b) {
      return U.current.useMemo(a, b);
    };
    exports.useReducer = function(a, b, e) {
      return U.current.useReducer(a, b, e);
    };
    exports.useRef = function(a) {
      return U.current.useRef(a);
    };
    exports.useState = function(a) {
      return U.current.useState(a);
    };
    exports.useSyncExternalStore = function(a, b, e) {
      return U.current.useSyncExternalStore(a, b, e);
    };
    exports.useTransition = function() {
      return U.current.useTransition();
    };
    exports.version = "18.3.1";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV !== "production") {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var ReactVersion = "18.3.1";
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactCurrentDispatcher = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactCurrentBatchConfig = {
          transition: null
        };
        var ReactCurrentActQueue = {
          current: null,
          // Used to reproduce behavior of `batchedUpdates` in legacy mode.
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false
        };
        var ReactCurrentOwner = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactDebugCurrentFrame = {};
        var currentExtraStackFrame = null;
        function setExtraStackFrame(stack) {
          {
            currentExtraStackFrame = stack;
          }
        }
        {
          ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
            {
              currentExtraStackFrame = stack;
            }
          };
          ReactDebugCurrentFrame.getCurrentStack = null;
          ReactDebugCurrentFrame.getStackAddendum = function() {
            var stack = "";
            if (currentExtraStackFrame) {
              stack += currentExtraStackFrame;
            }
            var impl = ReactDebugCurrentFrame.getCurrentStack;
            if (impl) {
              stack += impl() || "";
            }
            return stack;
          };
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var ReactSharedInternals = {
          ReactCurrentDispatcher,
          ReactCurrentBatchConfig,
          ReactCurrentOwner
        };
        {
          ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
          ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
        }
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var didWarnStateUpdateForUnmountedComponent = {};
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
              return;
            }
            error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
            didWarnStateUpdateForUnmountedComponent[warningKey] = true;
          }
        }
        var ReactNoopUpdateQueue = {
          /**
           * Checks whether or not this composite component is mounted.
           * @param {ReactClass} publicInstance The instance we want to test.
           * @return {boolean} True if mounted, false otherwise.
           * @protected
           * @final
           */
          isMounted: function(publicInstance) {
            return false;
          },
          /**
           * Forces an update. This should only be invoked when it is known with
           * certainty that we are **not** in a DOM transaction.
           *
           * You may want to call this when you know that some deeper aspect of the
           * component's state has changed but `setState` was not called.
           *
           * This will not invoke `shouldComponentUpdate`, but it will invoke
           * `componentWillUpdate` and `componentDidUpdate`.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueForceUpdate: function(publicInstance, callback, callerName) {
            warnNoop(publicInstance, "forceUpdate");
          },
          /**
           * Replaces all of the state. Always use this or `setState` to mutate state.
           * You should treat `this.state` as immutable.
           *
           * There is no guarantee that `this.state` will be immediately updated, so
           * accessing `this.state` after calling this method may return the old value.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} completeState Next state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
            warnNoop(publicInstance, "replaceState");
          },
          /**
           * Sets a subset of the state. This only exists because _pendingState is
           * internal. This provides a merging strategy that is not available to deep
           * properties which is confusing. TODO: Expose pendingState or don't use it
           * during the merge.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} partialState Next partial state to be merged with state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} Name of the calling function in the public API.
           * @internal
           */
          enqueueSetState: function(publicInstance, partialState, callback, callerName) {
            warnNoop(publicInstance, "setState");
          }
        };
        var assign = Object.assign;
        var emptyObject = {};
        {
          Object.freeze(emptyObject);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
            throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          }
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        {
          var deprecatedAPIs = {
            isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
            replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
          };
          var defineDeprecationWarning = function(methodName, info) {
            Object.defineProperty(Component.prototype, methodName, {
              get: function() {
                warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
                return void 0;
              }
            });
          };
          for (var fnName in deprecatedAPIs) {
            if (deprecatedAPIs.hasOwnProperty(fnName)) {
              defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
            }
          }
        }
        function ComponentDummy() {
        }
        ComponentDummy.prototype = Component.prototype;
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
        pureComponentPrototype.constructor = PureComponent;
        assign(pureComponentPrototype, Component.prototype);
        pureComponentPrototype.isPureReactComponent = true;
        function createRef() {
          var refObject = {
            current: null
          };
          {
            Object.seal(refObject);
          }
          return refObject;
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          var warnAboutAccessingKey = function() {
            {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function defineRefPropWarningGetter(props, displayName) {
          var warnAboutAccessingRef = function() {
            {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
        function warnIfStringRefCannotBeAutoConverted(config) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
              var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        var ReactElement = function(type, key, ref, self, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function createElement2(type, config, children) {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          var self = null;
          var source = null;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              {
                warnIfStringRefCannotBeAutoConverted(config);
              }
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            self = config.__self === void 0 ? null : config.__self;
            source = config.__source === void 0 ? null : config.__source;
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            {
              if (Object.freeze) {
                Object.freeze(childArray);
              }
            }
            props.children = childArray;
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          {
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
          }
          return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
          return newElement;
        }
        function cloneElement(element, config, children) {
          if (element === null || element === void 0) {
            throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
          }
          var propName;
          var props = assign({}, element.props);
          var key = element.key;
          var ref = element.ref;
          var self = element._self;
          var source = element._source;
          var owner = element._owner;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              owner = ReactCurrentOwner.current;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            var defaultProps;
            if (element.type && element.type.defaultProps) {
              defaultProps = element.type.defaultProps;
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                if (config[propName] === void 0 && defaultProps !== void 0) {
                  props[propName] = defaultProps[propName];
                } else {
                  props[propName] = config[propName];
                }
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            props.children = childArray;
          }
          return ReactElement(element.type, key, ref, self, source, owner, props);
        }
        function isValidElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        var SEPARATOR = ".";
        var SUBSEPARATOR = ":";
        function escape(key) {
          var escapeRegex = /[=:]/g;
          var escaperLookup = {
            "=": "=0",
            ":": "=2"
          };
          var escapedString = key.replace(escapeRegex, function(match) {
            return escaperLookup[match];
          });
          return "$" + escapedString;
        }
        var didWarnAboutMaps = false;
        var userProvidedKeyEscapeRegex = /\/+/g;
        function escapeUserProvidedKey(text) {
          return text.replace(userProvidedKeyEscapeRegex, "$&/");
        }
        function getElementKey(element, index) {
          if (typeof element === "object" && element !== null && element.key != null) {
            {
              checkKeyStringCoercion(element.key);
            }
            return escape("" + element.key);
          }
          return index.toString(36);
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if (type === "undefined" || type === "boolean") {
            children = null;
          }
          var invokeCallback = false;
          if (children === null) {
            invokeCallback = true;
          } else {
            switch (type) {
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                }
            }
          }
          if (invokeCallback) {
            var _child = children;
            var mappedChild = callback(_child);
            var childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
            if (isArray(mappedChild)) {
              var escapedChildKey = "";
              if (childKey != null) {
                escapedChildKey = escapeUserProvidedKey(childKey) + "/";
              }
              mapIntoArray(mappedChild, array, escapedChildKey, "", function(c) {
                return c;
              });
            } else if (mappedChild != null) {
              if (isValidElement(mappedChild)) {
                {
                  if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                    checkKeyStringCoercion(mappedChild.key);
                  }
                }
                mappedChild = cloneAndReplaceKey(
                  mappedChild,
                  // Keep both the (mapped) and old keys if they differ, just as
                  // traverseAllChildren used to do for objects as children
                  escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                  (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? (
                    // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                    // eslint-disable-next-line react-internal/safe-string-coercion
                    escapeUserProvidedKey("" + mappedChild.key) + "/"
                  ) : "") + childKey
                );
              }
              array.push(mappedChild);
            }
            return 1;
          }
          var child;
          var nextName;
          var subtreeCount = 0;
          var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              child = children[i];
              nextName = nextNamePrefix + getElementKey(child, i);
              subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            }
          } else {
            var iteratorFn = getIteratorFn(children);
            if (typeof iteratorFn === "function") {
              var iterableChildren = children;
              {
                if (iteratorFn === iterableChildren.entries) {
                  if (!didWarnAboutMaps) {
                    warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                  }
                  didWarnAboutMaps = true;
                }
              }
              var iterator = iteratorFn.call(iterableChildren);
              var step;
              var ii = 0;
              while (!(step = iterator.next()).done) {
                child = step.value;
                nextName = nextNamePrefix + getElementKey(child, ii++);
                subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
              }
            } else if (type === "object") {
              var childrenString = String(children);
              throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
            }
          }
          return subtreeCount;
        }
        function mapChildren(children, func, context) {
          if (children == null) {
            return children;
          }
          var result = [];
          var count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function countChildren(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        }
        function forEachChildren(children, forEachFunc, forEachContext) {
          mapChildren(children, function() {
            forEachFunc.apply(this, arguments);
          }, forEachContext);
        }
        function toArray(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        }
        function onlyChild(children) {
          if (!isValidElement(children)) {
            throw new Error("React.Children.only expected to receive a single React element child.");
          }
          return children;
        }
        function createContext(defaultValue) {
          var context = {
            $$typeof: REACT_CONTEXT_TYPE,
            // As a workaround to support multiple concurrent renderers, we categorize
            // some renderers as primary and others as secondary. We only expect
            // there to be two concurrent renderers at most: React Native (primary) and
            // Fabric (secondary); React DOM (primary) and React ART (secondary).
            // Secondary renderers store their context values on separate fields.
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            // Used to track how many concurrent renderers this context currently
            // supports within in a single renderer. Such as parallel server rendering.
            _threadCount: 0,
            // These are circular
            Provider: null,
            Consumer: null,
            // Add these to use same hidden class in VM as ServerContext
            _defaultValue: null,
            _globalName: null
          };
          context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context: context
          };
          var hasWarnedAboutUsingNestedContextConsumers = false;
          var hasWarnedAboutUsingConsumerProvider = false;
          var hasWarnedAboutDisplayNameOnConsumer = false;
          {
            var Consumer = {
              $$typeof: REACT_CONTEXT_TYPE,
              _context: context
            };
            Object.defineProperties(Consumer, {
              Provider: {
                get: function() {
                  if (!hasWarnedAboutUsingConsumerProvider) {
                    hasWarnedAboutUsingConsumerProvider = true;
                    error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
                  }
                  return context.Provider;
                },
                set: function(_Provider) {
                  context.Provider = _Provider;
                }
              },
              _currentValue: {
                get: function() {
                  return context._currentValue;
                },
                set: function(_currentValue) {
                  context._currentValue = _currentValue;
                }
              },
              _currentValue2: {
                get: function() {
                  return context._currentValue2;
                },
                set: function(_currentValue2) {
                  context._currentValue2 = _currentValue2;
                }
              },
              _threadCount: {
                get: function() {
                  return context._threadCount;
                },
                set: function(_threadCount) {
                  context._threadCount = _threadCount;
                }
              },
              Consumer: {
                get: function() {
                  if (!hasWarnedAboutUsingNestedContextConsumers) {
                    hasWarnedAboutUsingNestedContextConsumers = true;
                    error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                  }
                  return context.Consumer;
                }
              },
              displayName: {
                get: function() {
                  return context.displayName;
                },
                set: function(displayName) {
                  if (!hasWarnedAboutDisplayNameOnConsumer) {
                    warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName);
                    hasWarnedAboutDisplayNameOnConsumer = true;
                  }
                }
              }
            });
            context.Consumer = Consumer;
          }
          {
            context._currentRenderer = null;
            context._currentRenderer2 = null;
          }
          return context;
        }
        var Uninitialized = -1;
        var Pending = 0;
        var Resolved = 1;
        var Rejected = 2;
        function lazyInitializer(payload) {
          if (payload._status === Uninitialized) {
            var ctor = payload._result;
            var thenable = ctor();
            thenable.then(function(moduleObject2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var resolved = payload;
                resolved._status = Resolved;
                resolved._result = moduleObject2;
              }
            }, function(error2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var rejected = payload;
                rejected._status = Rejected;
                rejected._result = error2;
              }
            });
            if (payload._status === Uninitialized) {
              var pending = payload;
              pending._status = Pending;
              pending._result = thenable;
            }
          }
          if (payload._status === Resolved) {
            var moduleObject = payload._result;
            {
              if (moduleObject === void 0) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", moduleObject);
              }
            }
            {
              if (!("default" in moduleObject)) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
              }
            }
            return moduleObject.default;
          } else {
            throw payload._result;
          }
        }
        function lazy(ctor) {
          var payload = {
            // We use these fields to store the result.
            _status: Uninitialized,
            _result: ctor
          };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: payload,
            _init: lazyInitializer
          };
          {
            var defaultProps;
            var propTypes;
            Object.defineProperties(lazyType, {
              defaultProps: {
                configurable: true,
                get: function() {
                  return defaultProps;
                },
                set: function(newDefaultProps) {
                  error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  defaultProps = newDefaultProps;
                  Object.defineProperty(lazyType, "defaultProps", {
                    enumerable: true
                  });
                }
              },
              propTypes: {
                configurable: true,
                get: function() {
                  return propTypes;
                },
                set: function(newPropTypes) {
                  error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  propTypes = newPropTypes;
                  Object.defineProperty(lazyType, "propTypes", {
                    enumerable: true
                  });
                }
              }
            });
          }
          return lazyType;
        }
        function forwardRef(render) {
          {
            if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
              error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
            } else if (typeof render !== "function") {
              error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render);
            } else {
              if (render.length !== 0 && render.length !== 2) {
                error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
              }
            }
            if (render != null) {
              if (render.defaultProps != null || render.propTypes != null) {
                error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
              }
            }
          }
          var elementType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!render.name && !render.displayName) {
                  render.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function memo(type, compare) {
          {
            if (!isValidElementType(type)) {
              error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
            }
          }
          var elementType = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: compare === void 0 ? null : compare
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!type.name && !type.displayName) {
                  type.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        function resolveDispatcher() {
          var dispatcher = ReactCurrentDispatcher.current;
          {
            if (dispatcher === null) {
              error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
            }
          }
          return dispatcher;
        }
        function useContext(Context) {
          var dispatcher = resolveDispatcher();
          {
            if (Context._context !== void 0) {
              var realContext = Context._context;
              if (realContext.Consumer === Context) {
                error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
              } else if (realContext.Provider === Context) {
                error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
              }
            }
          }
          return dispatcher.useContext(Context);
        }
        function useState(initialState) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useState(initialState);
        }
        function useReducer(reducer, initialArg, init) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useReducer(reducer, initialArg, init);
        }
        function useRef(initialValue) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useRef(initialValue);
        }
        function useEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useEffect(create, deps);
        }
        function useInsertionEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useInsertionEffect(create, deps);
        }
        function useLayoutEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useLayoutEffect(create, deps);
        }
        function useCallback(callback, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useCallback(callback, deps);
        }
        function useMemo(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useMemo(create, deps);
        }
        function useImperativeHandle(ref, create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useImperativeHandle(ref, create, deps);
        }
        function useDebugValue(value, formatterFn) {
          {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDebugValue(value, formatterFn);
          }
        }
        function useTransition() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useTransition();
        }
        function useDeferredValue(value) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useDeferredValue(value);
        }
        function useId() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useId();
        }
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher$1.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component2) {
          var prototype = Component2.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              setExtraStackFrame(stack);
            } else {
              setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function getDeclarationErrorAddendum() {
          if (ReactCurrentOwner.current) {
            var name = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
        function getSourceInfoErrorAddendum(source) {
          if (source !== void 0) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, "");
            var lineNumber = source.lineNumber;
            return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
          }
          return "";
        }
        function getSourceInfoErrorAddendumForProps(elementProps) {
          if (elementProps !== null && elementProps !== void 0) {
            return getSourceInfoErrorAddendum(elementProps.__source);
          }
          return "";
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
        function validateExplicitKey(element, parentType) {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          {
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        function createElementWithValidation(type, props, children) {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendumForProps(props);
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            {
              error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
          }
          var element = createElement2.apply(this, arguments);
          if (element == null) {
            return element;
          }
          if (validType) {
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], type);
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
        var didWarnAboutDeprecatedCreateFactory = false;
        function createFactoryWithValidation(type) {
          var validatedFactory = createElementWithValidation.bind(null, type);
          validatedFactory.type = type;
          {
            if (!didWarnAboutDeprecatedCreateFactory) {
              didWarnAboutDeprecatedCreateFactory = true;
              warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.");
            }
            Object.defineProperty(validatedFactory, "type", {
              enumerable: false,
              get: function() {
                warn("Factory.type is deprecated. Access the class directly before passing it to createFactory.");
                Object.defineProperty(this, "type", {
                  value: type
                });
                return type;
              }
            });
          }
          return validatedFactory;
        }
        function cloneElementWithValidation(element, props, children) {
          var newElement = cloneElement.apply(this, arguments);
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], newElement.type);
          }
          validatePropTypes(newElement);
          return newElement;
        }
        function startTransition(scope, options) {
          var prevTransition = ReactCurrentBatchConfig.transition;
          ReactCurrentBatchConfig.transition = {};
          var currentTransition = ReactCurrentBatchConfig.transition;
          {
            ReactCurrentBatchConfig.transition._updatedFibers = /* @__PURE__ */ new Set();
          }
          try {
            scope();
          } finally {
            ReactCurrentBatchConfig.transition = prevTransition;
            {
              if (prevTransition === null && currentTransition._updatedFibers) {
                var updatedFibersCount = currentTransition._updatedFibers.size;
                if (updatedFibersCount > 10) {
                  warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.");
                }
                currentTransition._updatedFibers.clear();
              }
            }
          }
        }
        var didWarnAboutMessageChannel = false;
        var enqueueTaskImpl = null;
        function enqueueTask(task) {
          if (enqueueTaskImpl === null) {
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              var nodeRequire = module && module[requireString];
              enqueueTaskImpl = nodeRequire.call(module, "timers").setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                {
                  if (didWarnAboutMessageChannel === false) {
                    didWarnAboutMessageChannel = true;
                    if (typeof MessageChannel === "undefined") {
                      error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning.");
                    }
                  }
                }
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          }
          return enqueueTaskImpl(task);
        }
        var actScopeDepth = 0;
        var didWarnNoAwaitAct = false;
        function act(callback) {
          {
            var prevActScopeDepth = actScopeDepth;
            actScopeDepth++;
            if (ReactCurrentActQueue.current === null) {
              ReactCurrentActQueue.current = [];
            }
            var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
            var result;
            try {
              ReactCurrentActQueue.isBatchingLegacy = true;
              result = callback();
              if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
                var queue = ReactCurrentActQueue.current;
                if (queue !== null) {
                  ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                  flushActQueue(queue);
                }
              }
            } catch (error2) {
              popActScope(prevActScopeDepth);
              throw error2;
            } finally {
              ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
            }
            if (result !== null && typeof result === "object" && typeof result.then === "function") {
              var thenableResult = result;
              var wasAwaited = false;
              var thenable = {
                then: function(resolve, reject) {
                  wasAwaited = true;
                  thenableResult.then(function(returnValue2) {
                    popActScope(prevActScopeDepth);
                    if (actScopeDepth === 0) {
                      recursivelyFlushAsyncActWork(returnValue2, resolve, reject);
                    } else {
                      resolve(returnValue2);
                    }
                  }, function(error2) {
                    popActScope(prevActScopeDepth);
                    reject(error2);
                  });
                }
              };
              {
                if (!didWarnNoAwaitAct && typeof Promise !== "undefined") {
                  Promise.resolve().then(function() {
                  }).then(function() {
                    if (!wasAwaited) {
                      didWarnNoAwaitAct = true;
                      error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);");
                    }
                  });
                }
              }
              return thenable;
            } else {
              var returnValue = result;
              popActScope(prevActScopeDepth);
              if (actScopeDepth === 0) {
                var _queue = ReactCurrentActQueue.current;
                if (_queue !== null) {
                  flushActQueue(_queue);
                  ReactCurrentActQueue.current = null;
                }
                var _thenable = {
                  then: function(resolve, reject) {
                    if (ReactCurrentActQueue.current === null) {
                      ReactCurrentActQueue.current = [];
                      recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                    } else {
                      resolve(returnValue);
                    }
                  }
                };
                return _thenable;
              } else {
                var _thenable2 = {
                  then: function(resolve, reject) {
                    resolve(returnValue);
                  }
                };
                return _thenable2;
              }
            }
          }
        }
        function popActScope(prevActScopeDepth) {
          {
            if (prevActScopeDepth !== actScopeDepth - 1) {
              error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
            }
            actScopeDepth = prevActScopeDepth;
          }
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          {
            var queue = ReactCurrentActQueue.current;
            if (queue !== null) {
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  if (queue.length === 0) {
                    ReactCurrentActQueue.current = null;
                    resolve(returnValue);
                  } else {
                    recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                  }
                });
              } catch (error2) {
                reject(error2);
              }
            } else {
              resolve(returnValue);
            }
          }
        }
        var isFlushing = false;
        function flushActQueue(queue) {
          {
            if (!isFlushing) {
              isFlushing = true;
              var i = 0;
              try {
                for (; i < queue.length; i++) {
                  var callback = queue[i];
                  do {
                    callback = callback(true);
                  } while (callback !== null);
                }
                queue.length = 0;
              } catch (error2) {
                queue = queue.slice(i + 1);
                throw error2;
              } finally {
                isFlushing = false;
              }
            }
          }
        }
        var createElement$1 = createElementWithValidation;
        var cloneElement$1 = cloneElementWithValidation;
        var createFactory = createFactoryWithValidation;
        var Children = {
          map: mapChildren,
          forEach: forEachChildren,
          count: countChildren,
          toArray,
          only: onlyChild
        };
        exports.Children = Children;
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
        exports.act = act;
        exports.cloneElement = cloneElement$1;
        exports.createContext = createContext;
        exports.createElement = createElement$1;
        exports.createFactory = createFactory;
        exports.createRef = createRef;
        exports.forwardRef = forwardRef;
        exports.isValidElement = isValidElement;
        exports.lazy = lazy;
        exports.memo = memo;
        exports.startTransition = startTransition;
        exports.unstable_act = act;
        exports.useCallback = useCallback;
        exports.useContext = useContext;
        exports.useDebugValue = useDebugValue;
        exports.useDeferredValue = useDeferredValue;
        exports.useEffect = useEffect;
        exports.useId = useId;
        exports.useImperativeHandle = useImperativeHandle;
        exports.useInsertionEffect = useInsertionEffect;
        exports.useLayoutEffect = useLayoutEffect;
        exports.useMemo = useMemo;
        exports.useReducer = useReducer;
        exports.useRef = useRef;
        exports.useState = useState;
        exports.useSyncExternalStore = useSyncExternalStore;
        exports.useTransition = useTransition;
        exports.version = ReactVersion;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production_min();
    } else {
      module.exports = require_react_development();
    }
  }
});

// src/client/i18n.ts
var React = __toESM(require_react(), 1);
var QQBOT_LOCALE_NAMESPACE = "dsh-qqbot";
var EN = Object.freeze({
  "$locale": "en",
  // ── 通用 / 通知 ──
  "\u672A\u77E5\u9519\u8BEF": "Unknown error",
  "\u72B6\u6001\u8BFB\u53D6\u5931\u8D25": "Failed to read status",
  "RPC \u8C03\u7528\u5931\u8D25": "RPC call failed",
  "\u5DF2\u8BBE\u4E3A\u4E3B\u673A\u5668\u4EBA": "Set as primary bot",
  "\u673A\u5668\u4EBA\u5DF2\u542F\u7528": "Bot enabled",
  "\u673A\u5668\u4EBA\u5DF2\u505C\u7528": "Bot disabled",
  "\u673A\u5668\u4EBA\u5DF2\u5220\u9664": "Bot removed",
  "\u5DF2\u91CD\u65B0\u53D1\u8D77\u8FDE\u63A5\uFF0C\u8BF7\u7A0D\u5019\u67E5\u770B\u72B6\u6001": "Reconnection started; check the status shortly",
  "\u4E0D\u9650\u5236": "No limit",
  "\u6A21\u578B": "Model",
  "\u8DDF\u968F Host \u9ED8\u8BA4": "Follow host default",
  "\u5173\u95ED": "Close",
  "\u53D6\u6D88": "Cancel",
  "\u786E\u5B9A": "OK",
  "\u786E\u8BA4\u64CD\u4F5C": "Confirm",
  "\u786E\u8BA4\u5220\u9664": "Delete",
  "\u786E\u8BA4\u7981\u7528": "Disable",
  "\u5237\u65B0": "Refresh",
  "\u5237\u65B0\u4E2D\u2026": "Refreshing\u2026",
  "\u52A0\u8F7D\u4E2D\u2026": "Loading\u2026",
  // ── 状态文案 ──
  "\u5DF2\u505C\u7528": "Disabled",
  "\u5DF2\u8FDE\u63A5": "Connected",
  "\u6B63\u5728\u8FDE\u63A5": "Connecting",
  "\u672A\u8FDE\u63A5": "Not connected",
  "\u4E3B\u673A\u5668\u4EBA\u5DF2\u8FDE\u63A5": "Primary bot connected",
  "\u90E8\u5206\u673A\u5668\u4EBA\u5DF2\u8FDE\u63A5": "Some bots connected",
  "\u5168\u90E8\u672A\u8FDE\u63A5": "All bots disconnected",
  "\u672A\u914D\u7F6E\u673A\u5668\u4EBA": "No bots configured",
  "\u4E3B\u673A\u5668\u4EBA": "Primary bot",
  "\u5DF2\u542F\u7528": "Enabled",
  "\u672A\u914D\u7F6E": "Not configured",
  "\u8FD0\u884C\u6B63\u5E38": "Running",
  "\u8FDE\u63A5\u672A\u5C31\u7EEA": "Connection not ready",
  "\u5C1A\u672A\u68C0\u67E5": "Not checked yet",
  "QQ \u8FDE\u63A5\u672A\u5C31\u7EEA\uFF0C\u63D2\u4EF6\u4F1A\u81EA\u52A8\u91CD\u8BD5\u3002": "QQ connection not ready; the plugin will retry automatically.",
  "\u7A7A\u95F2": "Idle",
  "\u8FDE\u63A5\u4E2D": "Connecting",
  "\u91CD\u8FDE\u4E2D": "Reconnecting",
  "\u5DF2\u65AD\u5F00": "Disconnected",
  "\u5F02\u5E38": "Error",
  // ── 列表视图 ──
  "\uFF0B \u6DFB\u52A0\u673A\u5668\u4EBA": "+ Add bot",
  "\u626B\u7801\u63A5\u5165": "Scan QR to connect",
  "\u624B\u52A8\u586B\u5199": "Manual entry",
  "\u8FD8\u6CA1\u6709\u914D\u7F6E\u6210\u529F\u7684\u673A\u5668\u4EBA": "No bot configured yet",
  "\u70B9\u51FB\u4E0A\u65B9\u300C\uFF0B \u6DFB\u52A0\u673A\u5668\u4EBA\u300D\uFF0C\u7528\u624B\u673A QQ \u626B\u7801\uFF0C\u6216\u624B\u52A8\u586B\u5199 AppID / AppSecret\u3002\u914D\u7F6E\u6210\u529F\u540E\u5373\u53EF\u5728\u8BE6\u60C5\u4E2D\u8BBE\u7F6E\u884C\u4E3A\u53C2\u6570\u3002": "Click \u201C+ Add bot\u201D above, scan the QR code with the mobile QQ app, or enter the AppID / AppSecret manually. Once connected, behavior settings become available in the bot details.",
  "\u70B9\u51FB\u673A\u5668\u4EBA\u5361\u7247\u53EF\u8FDB\u5165\u8BE6\u60C5\uFF1A\u67E5\u770B QQ \u8FDE\u63A5\u72B6\u6001\u3001\u8C03\u6574\u884C\u4E3A\u914D\u7F6E\u3002": "Click a bot card to open its details: view the QQ connection status and adjust behavior settings.",
  // ── 扫码面板 ──
  "\u7ED1\u5B9A\u6210\u529F": "Linked",
  "\u626B\u7801\u5931\u8D25": "QR scan failed",
  "\u6B63\u5728\u5237\u65B0\u4E8C\u7EF4\u7801": "Refreshing QR code",
  "\u7B49\u5F85\u624B\u673A QQ \u626B\u7801": "Waiting for mobile QQ to scan",
  "\u4E8C\u7EF4\u7801\u672A\u751F\u6210": "QR code not generated",
  "\u7528\u4E8E\u7ED1\u5B9A QQ \u673A\u5668\u4EBA\u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801": "One-time QR code for linking the QQ bot",
  "\u6B63\u5728\u5237\u65B0\u4E8C\u7EF4\u7801\u2026": "Refreshing QR code\u2026",
  "\u8FD8\u6CA1\u6709\u751F\u6210\u4E8C\u7EF4\u7801": "No QR code yet",
  "\u51E0\u79D2\u540E\u4F1A\u81EA\u52A8\u51FA\u73B0\u65B0\u7684\u4E00\u5F20": "A new one will appear in a few seconds",
  "\u70B9\u51FB\u4E0B\u65B9\u300C\u751F\u6210\u4E8C\u7EF4\u7801\u300D\u5F00\u59CB": "Click \u201CGenerate QR code\u201D below to start",
  "\u4E8C\u7EF4\u7801\u6709\u6548\u65F6\u95F4": "QR code valid for",
  "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801": "Regenerate QR code",
  "\u751F\u6210\u4E8C\u7EF4\u7801": "Generate QR code",
  "\u53D6\u6D88\u626B\u7801": "Cancel scanning",
  "\u624B\u673A QQ \u626B\u7801\u63A5\u5165": "Scan with mobile QQ",
  "\u63A8\u8350\u65B9\u5F0F\u3002\u626B\u7801\u540E QQ \u4F1A\u628A\u673A\u5668\u4EBA\u7684 AppID \u4E0E AppSecret \u76F4\u63A5\u4E0B\u53D1\u7ED9\u672C\u673A dsh\uFF0C\u4E0D\u9700\u8981\u624B\u52A8\u590D\u5236\uFF0C\u4FDD\u5B58\u540E\u7ACB\u5373\u751F\u6548\u3002": "Recommended. After scanning, QQ delivers the bot\u2019s AppID and AppSecret straight to the local dsh \u2014 nothing to copy by hand, and it takes effect immediately once saved.",
  "\u64CD\u4F5C\u6B65\u9AA4": "Steps",
  "\u70B9\u51FB\u4E8C\u7EF4\u7801\u4E0B\u65B9\u7684\u300C\u751F\u6210\u4E8C\u7EF4\u7801\u300D\uFF0C\u51FA\u73B0\u4E8C\u7EF4\u7801\u540E\u5F00\u59CB 5 \u5206\u949F\u5012\u8BA1\u65F6\u3002": "Click \u201CGenerate QR code\u201D below the QR area; a 5-minute countdown starts once it appears.",
  "\u6253\u5F00\u624B\u673A QQ\uFF0C\u4ECE\u53F3\u4E0A\u89D2\u300C\uFF0B\u300D\u83DC\u5355\u8FDB\u5165\u300C\u626B\u4E00\u626B\u300D\uFF0C\u626B\u63CF\u8FD9\u5F20\u4E8C\u7EF4\u7801\u3002": "Open mobile QQ, tap \u201C+\u201D in the top-right corner, choose \u201CScan\u201D, and scan this code.",
  "\u6309 QQ \u9875\u9762\u63D0\u793A\u5B8C\u6210\u786E\u8BA4\uFF0C\u628A\u8FD9\u4E2A\u673A\u5668\u4EBA\u6388\u6743\u7ED9\u672C\u673A dsh \u4F7F\u7528\u3002": "Follow the QQ prompts to confirm and authorize this bot for the local dsh.",
  "\u672C\u9875\u6BCF 2 \u79D2\u68C0\u67E5\u4E00\u6B21\u7ED3\u679C\uFF0C\u7ED1\u5B9A\u6210\u529F\u540E\u4F1A\u81EA\u52A8\u8FDB\u5165\u673A\u5668\u4EBA\u8BE6\u60C5\u9875\u3002": "This page checks the result every 2 seconds and opens the bot details automatically once linked.",
  "\u4E8C\u7EF4\u7801 5 \u5206\u949F\u5185\u6709\u6548\uFF1B\u8FC7\u671F\u540E\u4F1A\u81EA\u52A8\u6362\u4E00\u5F20\u65B0\u7684\uFF0C\u4E0D\u9700\u8981\u624B\u52A8\u5237\u65B0\u9875\u9762\u3002": "The QR code is valid for 5 minutes; a new one is generated automatically when it expires \u2014 no need to refresh the page.",
  "\u626B\u7801\u671F\u95F4\u8BF7\u4FDD\u6301\u672C\u8BBE\u7F6E\u9875\u6253\u5F00\uFF0C\u5173\u95ED\u9875\u9762\u4F1A\u4E2D\u65AD\u7B49\u5F85\u3002": "Keep this settings page open while scanning; closing it interrupts the wait.",
  "\u51ED\u636E\u4F1A\u5199\u5165 ~/.dsh/qqbot/credentials.json\uFF08\u4EC5\u5F53\u524D\u7528\u6237\u53EF\u8BFB\uFF09\uFF0C\u5199\u5165\u540E\u7ACB\u5373\u751F\u6548\uFF0C\u4E0D\u9700\u8981\u91CD\u542F dsh\u3002": "Credentials are written to ~/.dsh/qqbot/credentials.json (readable by the current user only), take effect immediately, and require no dsh restart.",
  // ── 手动填写面板 ──
  "\u624B\u52A8\u586B\u5199 AppID / AppSecret": "Enter AppID / AppSecret manually",
  "\u9002\u5408\u5DF2\u7ECF\u5728 QQ \u5F00\u653E\u5E73\u53F0\u521B\u5EFA\u8FC7\u673A\u5668\u4EBA\u7684\u60C5\u51B5\uFF1A\u5148\u4ECE\u5F00\u653E\u5E73\u53F0\u628A\u51ED\u636E\u590D\u5236\u51FA\u6765\uFF0C\u518D\u56DE\u5230\u8FD9\u91CC\u586B\u5199\u4FDD\u5B58\u3002": "For bots already created on the QQ Open Platform: copy the credentials there first, then come back here to save them.",
  "\u7B2C 1 \u6B65 \xB7 \u5728 QQ \u5F00\u653E\u5E73\u53F0\u53D6\u5F97\u51ED\u636E": "Step 1 \xB7 Get the credentials from the QQ Open Platform",
  "\u6253\u5F00 QQ \u5F00\u653E\u5E73\u53F0": "Open the QQ Open Platform",
  "\u6D4F\u89C8\u5668\u8BBF\u95EE q.qq.com\uFF0C\u7528 QQ \u767B\u5F55\u3002": "Visit q.qq.com in a browser and sign in with QQ.",
  "\u9009\u62E9\u673A\u5668\u4EBA": "Pick the bot",
  "\u5728\u673A\u5668\u4EBA\u5217\u8868\u91CC\u70B9\u5F00\u8981\u63A5\u5165\u7684\u673A\u5668\u4EBA\uFF1B\u8FD8\u6CA1\u6709\u7684\u8BDD\u5148\u521B\u5EFA\u4E00\u4E2A\u3002": "Open the bot you want to connect from the bot list; create one first if none exists.",
  "\u590D\u5236 AppID \u4E0E AppSecret": "Copy the AppID and AppSecret",
  "\u8FDB\u5165\u8BE5\u673A\u5668\u4EBA\u7684\u300C\u5F00\u53D1\u8BBE\u7F6E\u300D\u9875\u9762\uFF0C\u590D\u5236 AppID\uFF08\u673A\u5668\u4EBA ID\uFF09\u4E0E AppSecret\uFF08\u673A\u5668\u4EBA\u5BC6\u94A5\uFF09\u3002": "Open the bot\u2019s \u201CDeveloper settings\u201D page and copy the AppID (bot ID) and the AppSecret (bot key).",
  "\u7B2C 2 \u6B65 \xB7 \u586B\u5230\u8FD9\u91CC\u5E76\u4FDD\u5B58": "Step 2 \xB7 Fill them in here and save",
  "\u673A\u5668\u4EBA ID": "Bot ID",
  "\u5F00\u53D1\u8BBE\u7F6E\u91CC\u7684\u673A\u5668\u4EBA\u5BC6\u94A5": "The bot key from Developer settings",
  "\u4FDD\u5B58\u5E76\u542F\u7528": "Save and enable",
  "\u4FDD\u5B58\u540E\u51ED\u636E\u5199\u5165 ~/.dsh/qqbot/credentials.json\uFF08\u6743\u9650 0600\uFF09\uFF0C\u7ACB\u5373\u751F\u6548\uFF0C\u5E76\u81EA\u52A8\u8BBE\u4E3A\u5F53\u524D\u4F7F\u7528\u7684\u673A\u5668\u4EBA\u3002": "After saving, the credentials are written to ~/.dsh/qqbot/credentials.json (mode 0600), take effect immediately, and the bot becomes the primary one automatically.",
  "\u8FD9\u91CC\u4E0D\u4F1A\u6821\u9A8C\u51ED\u636E\u662F\u5426\u6B63\u786E\u3002\u4FDD\u5B58\u540E\u8BF7\u5230\u673A\u5668\u4EBA\u8BE6\u60C5\u770B\u300C\u8FDE\u63A5\u72B6\u6001\u300D\uFF1A\u663E\u793A\u300C\u8FD0\u884C\u6B63\u5E38\u300D\u624D\u662F\u63A5\u901A\uFF1B\u672A\u5C31\u7EEA\u5C31\u70B9\u300C\u91CD\u8BD5\u8FDE\u63A5\u300D\u3002": "Credentials are not validated here. After saving, check \u201CConnection status\u201D in the bot details: \u201CRunning\u201D means connected; if not ready, click \u201CRetry connection\u201D.",
  "\u6D88\u606F\u63A5\u6536\u8D70 WebSocket \u957F\u8FDE\u63A5\uFF0C\u5F00\u653E\u5E73\u53F0\u4E0D\u9700\u8981\u586B\u56DE\u8C03\u5730\u5740\uFF1B\u4F46\u673A\u5668\u4EBA\u56DE\u590D\u8981\u8D70 OpenAPI\uFF0C\u9700\u8981\u628A\u672C\u673A\u51FA\u53E3 IP \u52A0\u8FDB\u5F00\u653E\u5E73\u53F0\u7684 IP \u767D\u540D\u5355\u3002": "Messages are received over a WebSocket long connection, so no callback URL is needed on the Open Platform; but replies go through the OpenAPI, which requires adding this machine\u2019s outbound IP to the platform\u2019s IP allowlist.",
  "AppSecret \u4FDD\u5B58\u540E\u4E0D\u518D\u56DE\u663E\uFF1B\u9700\u8981\u66F4\u6362\u65F6\u91CD\u65B0\u586B\u4E00\u6B21\u4FDD\u5B58\u5373\u53EF\u8986\u76D6\u3002": "The AppSecret is never shown again after saving; to change it, simply fill it in and save again to overwrite.",
  // ── 添加页 ──
  "\u2190 \u8FD4\u56DE\u5217\u8868": "\u2190 Back to list",
  "\u6DFB\u52A0\u673A\u5668\u4EBA": "Add bot",
  "\u4E24\u79CD\u65B9\u5F0F\u4EFB\u9009\u5176\u4E00\uFF1A\u626B\u7801\u7531 QQ \u81EA\u52A8\u4E0B\u53D1\u51ED\u636E\uFF1B\u624B\u52A8\u586B\u5199\u9700\u8981\u4F60\u5148\u53BB QQ \u5F00\u653E\u5E73\u53F0\u590D\u5236 AppID / AppSecret\u3002\u63A5\u5165\u6210\u529F\u540E\u51ED\u636E\u7ACB\u5373\u751F\u6548\uFF0C\u5E76\u81EA\u52A8\u6210\u4E3A\u5F53\u524D\u4F7F\u7528\u7684\u673A\u5668\u4EBA\u3002": "Choose either way: scanning lets QQ deliver the credentials automatically; manual entry requires copying the AppID / AppSecret from the QQ Open Platform first. Once connected, the credentials take effect immediately and the bot becomes the primary one.",
  // ── 详情页骨架 ──
  "\u672A\u9009\u62E9\u673A\u5668\u4EBA": "No bot selected",
  "\u8FDE\u63A5\u72B6\u6001": "Connection status",
  "\u6700\u8FD1\u8FDE\u63A5": "Last connected",
  "QQ \u673A\u5668\u4EBA": "QQ Bot",
  "QQ \u673A\u5668\u4EBA\u8BBE\u7F6E": "QQ Bot settings",
  "\u628A QQ \u673A\u5668\u4EBA\u63A5\u5165 DeepSeek Harness": "Connect QQ bots to DeepSeek Harness",
  // ── 运行统计 ──
  "\u8FD0\u884C\u7EDF\u8BA1": "Run statistics",
  "\u8BE5\u673A\u5668\u4EBA\u7684\u6301\u4E45\u8FD0\u884C\u8BA1\u6570\uFF08\u91CD\u542F\u4E0D\u6E05\u96F6\uFF09\uFF1B\u6570\u503C\u4E0D\u4F1A\u81EA\u52A8\u5237\u65B0\uFF0C\u9700\u8981\u65F6\u70B9\u300C\u5237\u65B0\u300D\u3002": "Persistent run counters for this bot (kept across restarts); they do not refresh automatically \u2014 click \u201CRefresh\u201D when needed.",
  "\u590D\u4F4D": "Reset",
  "\u590D\u4F4D\u4E2D\u2026": "Resetting\u2026",
  "\u628A\u8BE5\u673A\u5668\u4EBA\u7684\u8FD0\u884C\u8BA1\u6570\u6E05\u96F6\uFF08\u7ACB\u5373\u751F\u6548\u5E76\u843D\u76D8\uFF09": "Zero out this bot's run counters (takes effect and persists immediately)",
  "\u6536\u5230\u6D88\u606F": "Messages received",
  "\u521B\u5EFA\u4F1A\u8BDD": "Sessions created",
  "\u88AB\u52A8\u56DE\u590D": "Passive replies",
  "\u4E3B\u52A8\u6D88\u606F": "Proactive messages",
  "\u7ED1\u5B9A\u4F1A\u8BDD": "Bound sessions",
  "\u5F85\u56DE\u590D\u961F\u5217": "Reply queue",
  "\u7FA4\u6D88\u606F\u7F13\u51B2": "Group buffer",
  "\u9519\u8BEF": "Errors",
  // ── 会话与模型 ──
  "\u4F1A\u8BDD\u4E0E\u6A21\u578B": "Session & model",
  "\u51B3\u5B9A\u8FD9\u4E2A\u673A\u5668\u4EBA\u4EE5\u4EC0\u4E48\u8EAB\u4EFD\u3001\u5728\u54EA\u4E2A\u76EE\u5F55\u3001\u7528\u54EA\u4E2A\u6A21\u578B\u5E72\u6D3B\uFF1B\u6BCF\u4E2A\u673A\u5668\u4EBA\u5F7C\u6B64\u72EC\u7ACB\uFF0C\u6539\u52A8\u53EA\u5BF9\u4E4B\u540E\u65B0\u5EFA\u7684\u4F1A\u8BDD\u751F\u6548\u3002": "Controls which identity, directory, and model this bot works with; each bot is independent, and changes apply only to newly created sessions.",
  "\u5DE5\u4F5C\u533A\u76EE\u5F55": "Workspace directory",
  "QQ \u6D88\u606F\u521B\u5EFA\u7684\u4F1A\u8BDD\u90FD\u5728\u8FD9\u4E2A\u76EE\u5F55\u91CC\u8BFB\u5199\u6587\u4EF6\u3002\u7559\u7A7A\u5219\u4F7F\u7528\u9ED8\u8BA4\u5DE5\u4F5C\u533A\uFF1B\u6539\u52A8\u53EA\u5BF9\u65B0\u5EFA\u4F1A\u8BDD\u751F\u6548\u3002": "Sessions created from QQ messages read and write files inside this directory. Leave empty for the default workspace; changes apply only to new sessions.",
  "\u9009\u62E9\u76EE\u5F55": "Choose directory",
  "\u9ED8\u8BA4\u5DE5\u4F5C\u533A\uFF08~/.dsh/file\uFF09": "Default workspace (~/.dsh/file)",
  "\u8FD9\u4E2A\u673A\u5668\u4EBA\u4F1A\u8BDD\u4F7F\u7528\u7684\u6A21\u578B\uFF1B\u7559\u7A7A\u5219\u8DDF\u968F\u5BBF\u4E3B\u9ED8\u8BA4\u6A21\u578B\u3002\u5207\u6362\u540E\u5DF2\u6709\u4F1A\u8BDD\u9700\u8981\u91CD\u7F6E\u624D\u4F1A\u751F\u6548\u3002": "The model used by this bot\u2019s sessions; leave empty to follow the host default. Existing sessions need a reset for the change to apply.",
  "\u8DDF\u968F\u9ED8\u8BA4\u6A21\u578B": "Follow default model",
  "\u51B3\u5B9A\u673A\u5668\u4EBA\u7684\u884C\u4E8B\u98CE\u683C\u4E0E\u53EF\u7528\u5DE5\u5177\u3002@ \u673A\u5668\u4EBA\u548C\u5355\u804A\u6D88\u606F\u90FD\u8D70\u8FD9\u4E2A Preset\uFF1B\u7FA4\u91CC\u975E @ \u7684\u56DE\u590D\u8D70\u804A\u5929 Preset\uFF08\u9ED8\u8BA4\u8DDF\u968F\u672C Preset\uFF0C\u4EC5\u53EF\u5728 bots.json \u914D\u7F6E\uFF09\uFF0C\u4E0D\u4F1A\u6267\u884C\u5DE5\u5177\u3002": "Sets the bot\u2019s behavior style and available tools. @-mentions and direct messages use this Preset; non-@ group replies use the chat preset (follows this Preset by default, configurable only in bots.json) and never run tools.",
  // ── 消息与回复策略（开关）──
  "\u6D88\u606F\u4E0E\u56DE\u590D\u7B56\u7565": "Message & reply policy",
  "\u63A7\u5236\u8FD9\u4E2A\u673A\u5668\u4EBA\u300C\u542C\u54EA\u4E9B\u6D88\u606F\u3001\u600E\u4E48\u56DE\u300D\uFF0C\u6BCF\u4E2A\u673A\u5668\u4EBA\u5F7C\u6B64\u72EC\u7ACB\u3002\u6240\u6709\u5F00\u5173\u6539\u5B8C\u7ACB\u5373\u751F\u6548\uFF0C\u4E0D\u9700\u8981\u91CD\u542F\u3002": "Controls which messages this bot listens to and how it replies; each bot is independent. Every switch takes effect immediately \u2014 no restart needed.",
  "\u7FA4\u5168\u91CF\u6D88\u606F\u56DE\u590D": "Reply to all group messages",
  "\u5F00\u542F\u540E\uFF0C\u7FA4\u91CC\u6CA1\u6709 @ \u673A\u5668\u4EBA\u7684\u6D88\u606F\u4E5F\u4F1A\u53C2\u4E0E\u4EF7\u503C\u8BC4\u5206\uFF0C\u8FBE\u5230\u9608\u503C\u624D\u56DE\u590D\uFF1B@ \u673A\u5668\u4EBA\u7684\u6D88\u606F\u59CB\u7EC8\u56DE\u590D\u5E76\u53EF\u4F7F\u7528\u5DE5\u5177\u3002\u5173\u95ED\u540E\uFF0C\u673A\u5668\u4EBA\u53EA\u5904\u7406 @ \u5B83\u7684\u7FA4\u6D88\u606F\u3002": "When on, group messages that do not @ the bot also go through value scoring and get a reply only above the threshold; @-mentions are always answered and can use tools. When off, only messages that @ the bot are processed.",
  "\u63A5\u53D7\u5355\u804A\u6D88\u606F": "Accept direct messages",
  "\u662F\u5426\u54CD\u5E94 QQ \u79C1\u804A\uFF08C2C\uFF09\u6D88\u606F\u3002\u5173\u95ED\u540E\u673A\u5668\u4EBA\u53EA\u5904\u7406\u7FA4\u6D88\u606F\uFF0C\u79C1\u804A\u4E00\u5F8B\u5FFD\u7565\u3002": "Whether to respond to QQ direct (C2C) messages. When off, the bot processes group messages only and ignores DMs.",
  "\u54CD\u5E94\u673A\u5668\u4EBA\u6D88\u606F": "Respond to bot messages",
  "\u5F00\u542F\u540E\uFF0C\u5176\u4ED6\u673A\u5668\u4EBA\u53D1\u51FA\u7684\u6D88\u606F\u4E5F\u4F1A\u89E6\u53D1\u672C\u673A\u5668\u4EBA\u56DE\u590D\u3002\u9ED8\u8BA4\u5173\u95ED\uFF1A\u5176\u4ED6\u673A\u5668\u4EBA\u7684\u6D88\u606F\u4E00\u5F8B\u5FFD\u7565\uFF0C\u9632\u6B62\u540C\u7FA4\u7684\u591A\u4E2A\u673A\u5668\u4EBA\u4E92\u76F8\u89E6\u53D1\u3001\u5FAA\u73AF\u5237\u5C4F\u3002\u6CE8\u610F QQ \u5E73\u53F0\u5728\u7FA4\u804A\u91CC\u901A\u5E38\u4E0D\u5411\u673A\u5668\u4EBA\u63A8\u9001\u5176\u4ED6\u673A\u5668\u4EBA\u7684\u6D88\u606F\uFF0C\u6B64\u5F00\u5173\u53EA\u5728\u5E73\u53F0\u786E\u5B9E\u63A8\u9001\u65F6\u624D\u6709\u5B9E\u9645\u6548\u679C\u3002": "When on, messages sent by other bots can also trigger replies from this bot. Off by default: other bots' messages are always ignored, preventing multiple bots in the same group from triggering each other in a loop. Note: the QQ platform usually does not push other bots' messages to a bot in groups, so this switch only takes effect when the platform actually delivers them.",
  "Markdown \u56DE\u590D": "Markdown replies",
  "\u4F18\u5148\u4EE5 QQ Markdown \u683C\u5F0F\u53D1\u9001\uFF0C\u6392\u7248\u66F4\u597D\u770B\uFF1B\u82E5\u5E73\u53F0\u62D2\u7EDD\u8BE5\u683C\u5F0F\uFF0C\u4F1A\u81EA\u52A8\u964D\u7EA7\u4E3A\u7EAF\u6587\u672C\u91CD\u53D1\uFF0C\u4E0D\u4F1A\u4E22\u6D88\u606F\u3002": "Send in QQ Markdown format first for nicer layout; if the platform rejects it, the message is resent as plain text automatically \u2014 nothing is lost.",
  "\u56DE\u590D\u5F15\u7528\u539F\u8BDD": "Quote the user's message",
  "\u56DE\u590D\u4EE5 QQ \u539F\u751F\u5F15\u7528\u5361\u7247\u5B9A\u4F4D\u5230\u7528\u6237\u90A3\u6761\u539F\u6D88\u606F\uFF08message_reference\uFF0C\u8D70\u4E3B\u52A8\u6D88\u606F\u901A\u9053\u53D1\u9001\uFF0C\u4E0D\u4E0E msg_id \u540C\u4F20\u2014\u2014\u624B\u673A\u7AEF\u4E24\u8005\u540C\u4F20\u4F1A\u5806\u53E0\u91CD\u590D\u5F15\u7528\uFF09\u3002\u4EC5\u7FA4\u804A\u751F\u6548\uFF0C\u5355\u804A\u4E00\u5F8B\u4E0D\u5F15\u7528\uFF1Aoff=\u4E0D\u5F15\u7528\uFF1Bat=\u4EC5\u7FA4 @ \u56DE\u590D\uFF08\u63A8\u8350\uFF09\uFF1Ball=\u7FA4\u804A\u5168\u90E8\u56DE\u590D\u3002\u5361\u7247\u53D1\u9001\u5931\u8D25\u65F6\u81EA\u52A8\u964D\u7EA7\u4E3A\u666E\u901A\u88AB\u52A8\u56DE\u590D\uFF08\u65E0\u5361\u7247\uFF0C\u5185\u5BB9\u4E0D\u4E22\uFF09\u3002\u6B64\u5916\uFF0C\u7528\u6237\u5F15\u7528\u804A\u5929\u91CC\u67D0\u6761\u6D88\u606F\u65F6\uFF0C\u88AB\u5F15\u7528\u7684\u539F\u6587\u4F1A\u59CB\u7EC8\u6CE8\u5165\u6A21\u578B\u4E0A\u4E0B\u6587\uFF0C\u8BA9\u5B83\u77E5\u9053\u5BF9\u65B9\u5728\u56DE\u5E94\u4EC0\u4E48\u3002": "Replies quote the user's original message via QQ's native quote card (message_reference), sent over the proactive-message channel without msg_id \u2014 sending both together makes mobile QQ show the same content twice. Group chats only \u2014 DMs are never quoted: off = no quote; at = group @-mentions only (recommended); all = every group reply. If the card fails to send, the reply falls back to a plain passive reply (no card, nothing lost). Also, when a user quotes another message, the quoted text is always injected into the model context.",
  "\u56DE\u590D\u5F15\u7528\u539F\u8BDD\u8303\u56F4": "Quote reply scope",
  "off\uFF08\u4E0D\u5F15\u7528\uFF09": "off (no quote)",
  "at\uFF08\u4EC5\u7FA4 @\uFF0C\u63A8\u8350\uFF09": "at (group @-mentions only, recommended)",
  "all\uFF08\u7FA4\u804A\u5168\u90E8\u56DE\u590D\uFF09": "all (every group reply)",
  "\u5F15\u7528\u5B57\u6570\u4E0A\u9650": "Quote preview length",
  "\u6587\u672C\u5F15\u7528\u6700\u591A\u663E\u793A\u591A\u5C11\u5B57\uFF08\u4EC5\u4E3B\u52A8\u6D88\u606F\u56DE\u9000\u4E3A\u6587\u672C\u5F15\u7528\u65F6\u4F7F\u7528\uFF1B\u539F\u751F\u5F15\u7528\u6C14\u6CE1\u7531 QQ \u5BA2\u6237\u7AEF\u81EA\u884C\u622A\u65AD\uFF09\uFF0C\u8D85\u51FA\u90E8\u5206\u4EE5\u7701\u7565\u53F7\u7ED3\u5C3E\u3002": "How many characters of the quoted text to show when a reply falls back to a text quote (proactive messages only; native quote cards are truncated by the QQ client itself); longer text ends with an ellipsis.",
  // ── 群聊聊天 Preset / secretEnv 凭据引用 ──
  "\u7FA4\u804A\u804A\u5929 Preset": "Group chat preset",
  "\u7FA4\u5185\u975E @ \u7684\u5168\u91CF\u6D88\u606F\uFF08\u53EA\u804A\u5929\u3001\u4E0D\u6267\u884C\u5DE5\u5177\uFF09\u4F7F\u7528\u7684 Preset\uFF1B\u7559\u7A7A\u5219\u8DDF\u968F\u4E0A\u65B9 Agent Preset\u3002\u7528\u4E8E\u8BA9\u7FA4\u5168\u91CF\u56DE\u590D\u98CE\u683C\u4E0E @/\u5355\u804A\u533A\u5206\u5F00\u3002": "Preset used for full group messages that do not @ the bot (chat only, no tools); leave empty to follow the Agent Preset above. Use it to give group-wide replies a style distinct from @-mentions and DMs.",
  "\u8DDF\u968F Agent Preset": "Follow Agent Preset",
  "AppSecret \u51ED\u636E\u5F15\u7528\uFF08secretEnv\uFF09": "AppSecret credential reference (secretEnv)",
  "AppSecret \u51ED\u636E\u5F15\u7528": "AppSecret credential reference",
  "DSH \u51ED\u636E\u5F15\u7528\u4F5C\u4E3A AppSecret \u7684\u66FF\u4EE3\u6765\u6E90\uFF08\u4F18\u5148\u7EA7\u9AD8\u4E8E\u660E\u6587 AppSecret\uFF09\u3002\u586B\u5199\u540E\u673A\u5668\u4EBA\u5728\u8FD0\u884C\u65F6\u51ED\u6B64\u5F15\u7528\u89E3\u6790\u51FA\u771F\u5B9E\u5BC6\u94A5\uFF0C\u65E0\u9700\u5728\u5F00\u653E\u5E73\u53F0\u660E\u6587\u4FDD\u5B58\u3002\u7559\u7A7A\u5219\u4F7F\u7528\u626B\u7801/\u624B\u52A8\u586B\u5199\u7684 AppSecret\u3002": "A DSH credential reference used instead of a plaintext AppSecret (takes priority over it). When set, the bot resolves the real secret from this reference at runtime, so no plaintext secret needs to be kept on the open platform. Leave empty to use the AppSecret from QR login / manual entry.",
  "\u5982 my-qq-app-secret\uFF08\u7559\u7A7A\u4E0D\u542F\u7528\uFF09": "e.g. my-qq-app-secret (leave empty to disable)",
  // ── 新功能开关（多模态 / 记忆 / 欢迎语 / 表情撤回 / 语音 / 敏感词 / 配额）──
  "\u4E3B\u52A8\u6D88\u606F\u65E5\u914D\u989D": "Daily proactive quota",
  "\u5355\u65E5\u6700\u591A\u53D1\u9001\u591A\u5C11\u6761\u4E3B\u52A8\u6D88\u606F\uFF08\u5B9A\u65F6\u6D88\u606F\u3001\u6B22\u8FCE\u8BED\u3001\u51FA\u7BB1\u8865\u53D1\u3001AI \u53D1\u56FE\u90FD\u8BA1\u5165\uFF09\u30020 \u8868\u793A\u4E0D\u9650\u5236\u2014\u2014\u4F46 QQ \u5E73\u53F0\u4E3B\u52A8\u6D88\u606F\u914D\u989D\u6781\u5C11\uFF0C\u8D85\u53D1\u4F1A\u88AB\u9650\u6D41\uFF0C\u5EFA\u8BAE\u4FDD\u6301\u9ED8\u8BA4 50\u3002": "How many proactive messages may be sent per day at most (scheduled messages, welcome greetings, outbox redelivery, and AI-sent images all count). 0 means unlimited \u2014 but the QQ platform's proactive quota is tiny; over-sending gets rate-limited. Keep the default 50.",
  "\u591A\u6A21\u6001\u6D88\u606F": "Multimodal messages",
  "\u7FA4\u91CC/\u79C1\u804A\u53D1\u6765\u7684\u56FE\u7247\u3001\u6587\u4EF6\u3001\u8BED\u97F3\u4F1A\u4EE5\u9644\u4EF6\u5F62\u5F0F\u6CE8\u5165\u4F1A\u8BDD\u4E0A\u4E0B\u6587\uFF1A\u89C6\u89C9\u6A21\u578B\u53EF\u4EE5\u76F4\u63A5\u770B\u56FE\uFF0C\u8BED\u97F3\u4F18\u5148\u4F7F\u7528\u5E73\u53F0\u81EA\u5E26\u8F6C\u5199\u6587\u672C\u3002\u5173\u95ED\u540E\u975E\u6587\u5B57\u5185\u5BB9\u53EA\u4FDD\u7559\u5360\u4F4D\u8BF4\u660E\u3002": "Images, files, and voice from groups/DMs are injected into the session context as attachments: vision models can see the images directly, and voice uses the platform's built-in transcript first. When off, non-text content is reduced to a placeholder note.",
  "\u957F\u671F\u8BB0\u5FC6": "Long-term memory",
  "\u6BCF\u4E2A\u7FA4/\u5355\u804A\u7EF4\u62A4\u4E00\u4EFD\u6301\u4E45\u8BB0\u5FC6\uFF08\u8DE8 /new \u4FDD\u7559\uFF09\u3002\u5BF9\u8BDD\u91CC\u8BF4\u300C\u8BB0\u4F4F\u67D0\u4E8B\u300DAI \u4F1A\u81EA\u52A8\u5199\u5165\uFF1B\u7528 /\u8BB0\u5FC6 \u67E5\u770B\u3001/\u6E05\u7A7A\u8BB0\u5FC6 \u6E05\u7A7A\u3002": "Each group/DM keeps a persistent memory (survives /new). Say \u201Cremember something\u201D in chat and the AI writes it down automatically; use /memory to view and /forget to clear it.",
  "\u6B22\u8FCE\u8BED": "Welcome message",
  "\u65B0\u6210\u5458\u8FDB\u7FA4\u6216\u65B0\u597D\u53CB\u6DFB\u52A0\u65F6\uFF0C\u673A\u5668\u4EBA\u81EA\u52A8\u53D1\u9001\u6B22\u8FCE\u8BED\uFF08\u6587\u6848\u89C1\u4E0B\u65B9\u8F93\u5165\u6846\uFF0C{nick} \u4F1A\u66FF\u6362\u4E3A\u5BF9\u65B9\u6807\u8BC6\uFF09\u3002\u8D70\u4E3B\u52A8\u6D88\u606F\u901A\u9053\uFF0C\u6D88\u8017\u6BCF\u65E5\u914D\u989D\u3002": "When a new member joins a group or adds the bot as a friend, the bot sends a welcome message automatically (text in the input below; {nick} is replaced with their identifier). Sent via the proactive channel and counts against the daily quota.",
  "\u8868\u60C5\u64A4\u56DE": "Emoji-recall",
  "\u4EFB\u4F55\u4EBA\u5BF9\u673A\u5668\u4EBA\u53D1\u51FA\u7684\u6D88\u606F\u70B9 \u{1F5D1}\uFE0F \u8868\u60C5\u56DE\u5E94\uFF0C\u673A\u5668\u4EBA\u5C31\u64A4\u56DE\u90A3\u6761\u6D88\u606F\uFF08\u9700\u8981\u5E73\u53F0\u7684\u300C\u6D88\u606F\u64A4\u56DE\u300D\u6743\u9650\uFF09\u3002": "Anyone reacting \u{1F5D1}\uFE0F to a message the bot sent makes the bot recall that message (requires the platform's \u201Cmessage recall\u201D permission).",
  "\u8BED\u97F3\u6D88\u606F\u5904\u7406": "Voice message handling",
  "\u6536\u5230\u8BED\u97F3\u6D88\u606F\u65F6\u5982\u4F55\u5904\u7406\uFF1Aoff=\u5FFD\u7565\uFF1Bnote=\u4F7F\u7528\u5E73\u53F0\u81EA\u5E26\u7684\u8F6C\u5199\u6587\u672C\uFF08\u63A8\u8350\uFF0C\u65E0\u8F6C\u5199\u65F6\u663E\u793A\u5360\u4F4D\uFF09\uFF1Bdownload=\u628A\u97F3\u9891\u5730\u5740\u6CE8\u5165\u4E0A\u4E0B\u6587\uFF1Basr=\u8C03\u7528\u4E0B\u65B9\u81EA\u5B9A\u4E49\u8F6C\u5199\u670D\u52A1\uFF08POST {url} \u2192 {text}\uFF09\uFF1Bstt=\u4E0B\u8F7D\u8BED\u97F3\u672C\u5730\u8F6C\u7801\u540E\u8C03\u7528 OpenAI \u517C\u5BB9 /audio/transcriptions \u8F6C\u5199\uFF08\u5931\u8D25\u81EA\u52A8\u56DE\u9000\u5E73\u53F0\u8F6C\u5199\u6587\u672C\uFF09\u3002": "How to handle incoming voice messages: off = ignore; note = use the platform's built-in transcript (recommended; shows a placeholder when none); download = inject the audio URL into context; asr = call the custom transcription service below (POST {url} \u2192 {text}); stt = download the audio, convert it locally and call an OpenAI-compatible /audio/transcriptions endpoint (falls back to the platform transcript on failure).",
  "\u8BED\u97F3\u6D88\u606F\u5904\u7406\u65B9\u5F0F": "Voice message handling mode",
  "off\uFF08\u5FFD\u7565\u8BED\u97F3\uFF09": "off (ignore voice)",
  "note\uFF08\u5E73\u53F0\u8F6C\u5199\uFF0C\u63A8\u8350\uFF09": "note (platform transcript, recommended)",
  "stt\uFF08STT \u670D\u52A1\u81EA\u52A8\u8F6C\u5199\uFF09": "stt (auto-transcribe via STT service)",
  "download\uFF08\u6CE8\u5165\u97F3\u9891\u5730\u5740\uFF09": "download (inject audio URL)",
  "asr\uFF08\u81EA\u5B9A\u4E49\u8F6C\u5199\u670D\u52A1\uFF09": "asr (custom transcription service)",
  "\u81EA\u5B9A\u4E49\u8F6C\u5199\u670D\u52A1": "Custom transcription service",
  "voiceTranscription=asr \u65F6\u4F7F\u7528\u7684 HTTP \u670D\u52A1\u5730\u5740\uFF1A\u673A\u5668\u4EBA POST { url: <\u97F3\u9891\u5730\u5740> }\uFF0C\u670D\u52A1\u8FD4\u56DE { text: <\u8F6C\u5199\u6587\u672C> }\u3002\u7559\u7A7A\u5219\u56DE\u9000\u4E3A\u5360\u4F4D\u8BF4\u660E\u3002": "HTTP service used when voiceTranscription=asr: the bot POSTs { url: <audio URL> } and the service returns { text: <transcript> }. Leave empty to fall back to a placeholder note.",
  "https://\u2026\uFF08\u7559\u7A7A\u4E0D\u542F\u7528\uFF09": "https://\u2026 (leave empty to disable)",
  "\u81EA\u5B9A\u4E49\u8F6C\u5199\u670D\u52A1\u5730\u5740": "Custom transcription service URL",
  "STT \u670D\u52A1\u5730\u5740\uFF08Base URL\uFF09": "STT service base URL",
  "voiceTranscription=stt \u65F6\u4F7F\u7528\uFF0COpenAI \u517C\u5BB9\u7684\u63A5\u53E3\u6839\u5730\u5740\uFF08\u4E0D\u542B /audio/transcriptions \u540E\u7F00\uFF09\u3002\u8BED\u97F3\u4F1A\u5148\u4E0B\u8F7D\u5230\u672C\u5730\uFF08SILK \u81EA\u52A8\u8F6C WAV\uFF09\u518D\u4E0A\u4F20\u8F6C\u5199\u3002": "Used when voiceTranscription=stt: the root URL of an OpenAI-compatible endpoint (without the /audio/transcriptions suffix). Voice files are downloaded locally (SILK auto-converted to WAV) before being uploaded for transcription.",
  "STT \u670D\u52A1\u5730\u5740": "STT service base URL",
  "https://api.openai.com/v1\uFF08\u7559\u7A7A\u4E0D\u542F\u7528\uFF09": "https://api.openai.com/v1 (leave empty to disable)",
  "STT \u670D\u52A1 API Key": "STT service API key",
  "voiceTranscription=stt \u65F6\u4F7F\u7528\uFF0C\u4EE5 Bearer \u65B9\u5F0F\u643A\u5E26\u3002\u4EC5\u4FDD\u5B58\u5728\u672C\u673A bots.json\uFF0C\u4E0D\u4F1A\u968F\u6D88\u606F\u5916\u53D1\uFF08\u8F6C\u5199\u8BF7\u6C42\u9664\u5916\uFF09\u3002": "Used when voiceTranscription=stt, sent as a Bearer token. Stored only in the local bots.json and never sent with messages (except the transcription request itself).",
  "sk-\u2026\uFF08\u7559\u7A7A\u4E0D\u542F\u7528\uFF09": "sk-\u2026 (leave empty to disable)",
  "STT \u6A21\u578B": "STT model",
  "voiceTranscription=stt \u65F6\u4F7F\u7528\u7684\u8F6C\u5199\u6A21\u578B\u540D\uFF0C\u5982 whisper-1\u3002": "Transcription model used when voiceTranscription=stt, e.g. whisper-1.",
  "TTS \u670D\u52A1\u5730\u5740\uFF08Base URL\uFF09": "TTS service base URL",
  "\u5F00\u542F\u300C\u8BED\u97F3\u56DE\u590D\u300D\u65F6\u4F7F\u7528\uFF0COpenAI \u517C\u5BB9\u7684\u63A5\u53E3\u6839\u5730\u5740\uFF08\u4E0D\u542B /audio/speech \u540E\u7F00\uFF09\u3002\u5408\u6210\u7684 WAV \u8BED\u97F3\u76F4\u63A5\u4F5C\u4E3A QQ \u8BED\u97F3\u6D88\u606F\u53D1\u9001\u3002": "Used when \u201CText-to-speech replies\u201D is on: the root URL of an OpenAI-compatible endpoint (without the /audio/speech suffix). The synthesized WAV is sent directly as a QQ voice message.",
  "TTS \u670D\u52A1\u5730\u5740": "TTS service base URL",
  "TTS \u670D\u52A1 API Key": "TTS service API key",
  "\u5F00\u542F\u300C\u8BED\u97F3\u56DE\u590D\u300D\u65F6\u4F7F\u7528\uFF0C\u4EE5 Bearer \u65B9\u5F0F\u643A\u5E26\u3002\u4EC5\u4FDD\u5B58\u5728\u672C\u673A bots.json\u3002": "Used when \u201CText-to-speech replies\u201D is on, sent as a Bearer token. Stored only in the local bots.json.",
  "TTS \u6A21\u578B / \u53D1\u97F3\u4EBA": "TTS model / voice",
  "TTS \u6A21\u578B\u540D\uFF08\u5982 tts-1\uFF09\u4E0E\u53D1\u97F3\u4EBA\uFF08voice\uFF0C\u5982 alloy / nova / shimmer\uFF09\u3002": "TTS model name (e.g. tts-1) and voice (e.g. alloy / nova / shimmer).",
  "\u6B63\u5728\u8F93\u5165\u72B6\u6001": "Typing indicator",
  "\u79C1\u804A\u6536\u5230\u6D88\u606F\u540E\uFF0CAI \u5904\u7406\u671F\u95F4\u5411\u5BF9\u65B9\u663E\u793A\u300C\u5BF9\u65B9\u6B63\u5728\u8F93\u5165\u2026\u300D\uFF08QQ \u5E73\u53F0\u80FD\u529B\u4EC5\u9650\u5355\u804A\uFF09\uFF0C\u56DE\u590D\u53D1\u51FA\u540E\u81EA\u52A8\u505C\u6B62\uFF1B\u5904\u7406\u8D85\u8FC7 5 \u5206\u949F\u81EA\u52A8\u5173\u95ED\u4EE5\u9632\u72B6\u6001\u6C38\u6302\u3002\u53D1\u9001\u5931\u8D25\u4E0D\u5F71\u54CD\u6B63\u5E38\u56DE\u590D\u3002": "When a DM arrives, shows \u201Ctyping\u2026\u201D to the other side while the AI is processing (QQ platform capability is DM-only); stops automatically once the reply is sent, or after 5 minutes as a failsafe. Send failures never affect normal replies.",
  "\u8BED\u97F3\u56DE\u590D\uFF08\u6587\u5B57\u8F6C\u8BED\u97F3\uFF09": "Voice replies (text-to-speech)",
  "\u79C1\u804A\u56DE\u590D\u81EA\u52A8\u7ECF TTS \u670D\u52A1\u5408\u6210\u8BED\u97F3\u6C14\u6CE1\u53D1\u9001\uFF08QQ \u5E73\u53F0\u8BED\u97F3\u6D88\u606F\u4EC5\u652F\u6301\u5355\u804A\uFF0C\u7FA4\u804A\u4ECD\u53D1\u6587\u5B57\uFF09\u3002\u9700\u914D\u7F6E\u4E0B\u65B9 TTS \u670D\u52A1\uFF08OpenAI \u517C\u5BB9 /audio/speech\uFF09\uFF1B\u5408\u6210\u6216\u53D1\u9001\u5931\u8D25\u81EA\u52A8\u56DE\u9000\u6587\u5B57\u56DE\u590D\uFF0C\u5185\u5BB9\u4E0D\u4E22\u3002": "DM replies are automatically synthesized into voice bubbles via the TTS service (QQ voice messages are DM-only; groups still get text). Requires the TTS service below (OpenAI-compatible /audio/speech); on synthesis or send failure the bot falls back to the text reply \u2014 no content is lost.",
  "TTS \u6A21\u578B\u540D": "TTS model",
  "TTS \u53D1\u97F3\u4EBA": "TTS voice",
  "\u6309\u94AE\u5BA1\u6279": "Button approvals",
  "AI \u6267\u884C\u654F\u611F\u64CD\u4F5C\u524D\u53EF\u53D1\u9001\u300C\u2705\u5141\u8BB8 / \u274C\u62D2\u7EDD\u300D\u6309\u94AE\u6D88\u606F\uFF0C\u70B9\u51FB\u5373\u56DE\u4F20\u51B3\u5B9A\uFF1B\u8D85\u65F6\u672A\u70B9\u51FB\u89C6\u4E3A\u62D2\u7EDD\u3002\u5BA1\u6279\u6D88\u606F\u5360\u7528\u4E3B\u52A8\u6D88\u606F\u914D\u989D\u3002": "Before performing sensitive operations the AI can send a \u201C\u2705 Allow / \u274C Deny\u201D button message; a click returns the decision immediately, and no click within the timeout counts as denial. Approval messages consume the proactive-message quota.",
  "\u6587\u4EF6\u5185\u5BB9\u8BC6\u522B": "File content ingestion",
  "\u6536\u5230\u6587\u672C\u7C7B\u6587\u4EF6\uFF08txt/md/json/csv/\u4EE3\u7801\u7B49\uFF0C\u22641MB\uFF09\u65F6\u81EA\u52A8\u4E0B\u8F7D\u5E76\u622A\u53D6\u6B63\u6587\u6CE8\u5165\u6A21\u578B\u4E0A\u4E0B\u6587\uFF0CAI \u76F4\u63A5\u8BFB\u61C2\u6587\u4EF6\u5185\u5BB9\u518D\u56DE\u590D\uFF1B\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF08docx/pdf \u7B49\uFF09\u4EC5\u5217\u6587\u4EF6\u540D\u3002\u9700\u914D\u5408\u300C\u9644\u4EF6\u8F6C\u53D1\u300D\u5F00\u5173\u3002": "When a text-like file (txt/md/json/csv/code, \u22641MB) arrives, its content is downloaded and excerpted into the model context so the AI can read it before replying; binary files (docx/pdf etc.) are listed by name only. Requires the \u201CAttachment forwarding\u201D switch.",
  "\u6B22\u8FCE\u8BED\u6587\u6848": "Welcome text",
  "\u5F00\u542F\u300C\u6B22\u8FCE\u8BED\u300D\u540E\u53D1\u9001\u7684\u5185\u5BB9\uFF1B{nick} \u4F1A\u66FF\u6362\u4E3A\u65B0\u6210\u5458\u6807\u8BC6\u3002\u7559\u7A7A\u4F7F\u7528\u9ED8\u8BA4\u6587\u6848\u300C\u6B22\u8FCE {nick}\uFF01@\u6211\u5373\u53EF\u4E0E\u6211\u5BF9\u8BDD\u3002\u300D\u3002": "Content sent when \u201CWelcome message\u201D is on; {nick} is replaced with the new member's identifier. Leave empty to use the default \u201CWelcome {nick}! @me to chat with me.\u201D.",
  "\u6B22\u8FCE {nick}\uFF01@\u6211\u5373\u53EF\u4E0E\u6211\u5BF9\u8BDD\u3002": "Welcome {nick}! @me to chat with me.",
  "\u654F\u611F\u8BCD\u5217\u8868": "Banned words",
  "\u9017\u53F7\u5206\u9694\u3002\u7FA4\u6D88\u606F\u5305\u542B\u5176\u4E2D\u4EFB\u610F\u4E00\u8BCD\u65F6\uFF0C\u673A\u5668\u4EBA\u64A4\u56DE\u8BE5\u6D88\u606F\u5E76\u8DF3\u8FC7\u56DE\u590D\uFF08\u9700\u8981\u6D88\u606F\u64A4\u56DE\u6743\u9650\uFF1B\u65E0\u6743\u9650\u65F6\u4EC5\u62E6\u622A\u56DE\u590D\uFF09\u3002": "Comma-separated. If a group message contains any of these words, the bot recalls the message and skips replying (requires message-recall permission; without it, only the reply is blocked).",
  "\u8BCD1, \u8BCD2\uFF08\u7559\u7A7A\u4E0D\u542F\u7528\uFF09": "word1, word2 (leave empty to disable)",
  "0\uFF08\u4E0D\u9650\uFF09": "0 (unlimited)",
  "\u88AB\u52A8\u5931\u8D25\u8F6C\u4E3B\u52A8\u6D88\u606F": "Fall back to proactive messages",
  "\u88AB\u52A8\u56DE\u590D\u8D85\u65F6\u6216\u5931\u8D25\u65F6\uFF0C\u6539\u7528\u4E3B\u52A8\u6D88\u606F\u63A5\u53E3\u8865\u53D1\u4E00\u6B21\u3002\u4E3B\u52A8\u6D88\u606F\u6BCF\u65E5\u914D\u989D\u6781\u5C11\uFF0C\u4EC5\u5728\u6392\u67E5\u95EE\u9898\u65F6\u4E34\u65F6\u5F00\u542F\u3002": "When a passive reply times out or fails, retry once via the proactive-message API. The daily proactive quota is tiny \u2014 enable only temporarily while debugging.",
  "\u6D88\u606F\u672C\u5730\u5F52\u6863": "Local message archive",
  "\u628A\u6536\u5230\u7684\u6D88\u606F\u4E0E\u53D1\u51FA\u7684\u56DE\u590D\u5199\u5165 ~/.dsh/qqbot/archive/\uFF0C\u4F5C\u4E3A\u5BA1\u8BA1\u8F68\u8FF9\u7559\u6863\uFF0C\u65B9\u4FBF\u4E8B\u540E\u6392\u67E5\u3002": "Writes received messages and sent replies to ~/.dsh/qqbot/archive/ as an audit trail for later troubleshooting.",
  // ── 回复调优 ──
  "\u56DE\u590D\u8C03\u4F18": "Reply tuning",
  "\u8C03\u8282\u8FD9\u4E2A\u673A\u5668\u4EBA\u300C\u56DE\u5F97\u591A\u4E0D\u591A\u3001\u5207\u5F97\u591A\u788E\u300D\uFF0C\u6BCF\u4E2A\u673A\u5668\u4EBA\u5F7C\u6B64\u72EC\u7ACB\u3002\u6539\u5B8C\u7ACB\u5373\u751F\u6548\uFF0C\u5EFA\u8BAE\u5148\u6309\u9ED8\u8BA4\u503C\u8DD1\u4E00\u6BB5\u65F6\u95F4\u518D\u5FAE\u8C03\u3002": "Tunes how often this bot replies and how finely replies are split; each bot is independent. Changes apply immediately \u2014 run with defaults for a while before fine-tuning.",
  "0\uFF08\u5168\u90E8\u56DE\u590D\uFF09": "0 (reply to all)",
  "0\uFF08\u5173\u95ED\uFF09": "0 (off)",
  "\u7FA4\u6D88\u606F\u4EF7\u503C\u9608\u503C": "Group message value threshold",
  "AT \u4E0A\u4E0B\u6587\u6761\u6570": "AT context messages",
  "\u7FA4\u56DE\u590D\u6700\u5C0F\u95F4\u9694": "Min group reply interval",
  "\u540C\u4EBA\u56DE\u590D\u95F4\u9694": "Same-sender reply interval",
  "\u5206\u7247\u5B57\u7B26\u6570": "Chunk size (chars)",
  "\u6BCF\u6761\u6D88\u606F\u6700\u5927\u56DE\u590D": "Max replies per message",
  "0\u201310 \u5206\u3002\u673A\u5668\u4EBA\u7ED9\u6BCF\u6761\u7FA4\u6D88\u606F\u6253\u5206\uFF0C\u53EA\u6709\u8FBE\u5230\u5206\u6570\u624D\u4F1A\u56DE\u590D\uFF1B\u5206\u6570\u8D8A\u9AD8\u8D8A\u5B89\u9759\u3002\u8BBE\u4E3A 0 \u8868\u793A\u7FA4\u91CC\u6240\u6709\u6D88\u606F\u90FD\u56DE\u590D\uFF08\u5BB9\u6613\u5237\u5C4F\uFF09\u3002@ \u673A\u5668\u4EBA\u7684\u6D88\u606F\u4E0D\u53D7\u6B64\u9650\u5236\uFF0C\u4E00\u5B9A\u4F1A\u56DE\u590D\u3002": "0\u201310 points. The bot scores every group message and replies only when the score is reached; the higher the score, the quieter the bot. 0 means it replies to every group message (prone to flooding). Messages that @ the bot bypass this and always get a reply.",
  "@ \u673A\u5668\u4EBA\u65F6\uFF0C\u989D\u5916\u9644\u5E26\u7FA4\u91CC\u6700\u8FD1 N \u6761\u6D88\u606F\u4E00\u8D77\u9001\u7ED9\u6A21\u578B\uFF0C\u8BA9\u5B83\u542C\u61C2\u4E0A\u4E0B\u6587\u3002\u8BBE\u4E3A 0 \u5219\u53EA\u53D1\u9001\u88AB @ \u7684\u8FD9\u4E00\u6761\u3002\u6761\u6570\u8D8A\u591A\u8D8A\u806A\u660E\uFF0C\u4E5F\u8D8A\u8017 token\u3002": "When the bot is @-mentioned, the latest N group messages are attached for context so the model understands the conversation. 0 sends only the @-mention itself. More context is smarter but costs more tokens.",
  "\u540C\u4E00\u4E2A\u7FA4\u91CC\uFF0C\u4E24\u6B21\u300C\u975E @ \u89E6\u53D1\u300D\u7684\u56DE\u590D\u4E4B\u95F4\u81F3\u5C11\u8981\u9694\u8FD9\u4E48\u4E45\uFF0C\u7528\u6765\u9632\u6B62\u673A\u5668\u4EBA\u5237\u5C4F\u3002@ \u673A\u5668\u4EBA\u7684\u56DE\u590D\u4E0D\u53D7\u9650\u5236\u3002": "In one group, two replies triggered without an @-mention are at least this far apart, preventing flooding. @-mention replies are not throttled.",
  "\u540C\u4E00\u4E2A\u4EBA\u5728\u8FD9\u4E48\u77ED\u7684\u65F6\u95F4\u5185\u4E0D\u4F1A\u88AB\u56DE\u590D\u7B2C\u4E8C\u6B21\uFF0C\u907F\u514D\u88AB\u540C\u4E00\u4E2A\u4EBA\u8FDE\u7EED\u5237\u5C4F\u3002": "The same person will not get a second reply within this window, preventing one user from spamming the bot.",
  "QQ \u5355\u6761\u6D88\u606F\u6709\u957F\u5EA6\u9650\u5236\uFF0C\u8D85\u957F\u7684\u56DE\u590D\u4F1A\u6309\u8FD9\u4E2A\u5B57\u6570\u5207\u6210\u591A\u6761\u4F9D\u6B21\u53D1\u9001\u3002\u592A\u5C0F\u4F1A\u5207\u5F97\u5F88\u788E\uFF0C\u592A\u5927\u4F1A\u88AB\u5E73\u53F0\u622A\u65AD\u3002": "A single QQ message has a length limit; longer replies are split into chunks of this size and sent in order. Too small splits messages into fragments; too large gets truncated by the platform.",
  "\u4E00\u6761\u7528\u6237\u6D88\u606F\u6700\u591A\u89E6\u53D1\u51E0\u6B21\u88AB\u52A8\u56DE\u590D\uFF08QQ \u5E73\u53F0\u786C\u4E0A\u9650\u4E3A 5\uFF09\u3002\u8C03\u5C0F\u53EF\u4EE5\u907F\u514D\u673A\u5668\u4EBA\u4E00\u6B21\u6027\u8FDE\u53D1\u591A\u6761\u3002": "How many passive replies one user message may trigger at most (the QQ platform hard-caps at 5). Lower it to avoid the bot sending many messages at once.",
  // ── 连接与移除 ──
  "\u8FDE\u63A5\u4E0E\u79FB\u9664": "Connection & removal",
  "\u7BA1\u7406\u673A\u5668\u4EBA\u7684\u542F\u7528\u72B6\u6001\u3001\u8BBE\u4E3A\u4E3B\u673A\u5668\u4EBA\u3001\u91CD\u5EFA QQ \u957F\u8FDE\u63A5\uFF0C\u6216\u5220\u9664\u63A5\u5165\u914D\u7F6E\u3002": "Manage the bot\u2019s enabled state, set it as primary, rebuild the QQ long connection, or delete the integration.",
  "\u505C\u7528\u6B64\u673A\u5668\u4EBA": "Disable this bot",
  "\u542F\u7528\u6B64\u673A\u5668\u4EBA": "Enable this bot",
  "\u505C\u7528\u7684\u673A\u5668\u4EBA\u4E0D\u4F1A\u5EFA\u7ACB QQ \u957F\u8FDE\u63A5\uFF0C\u4E5F\u4E0D\u4F1A\u63A5\u6536\u6216\u56DE\u590D\u6D88\u606F\uFF1B\u5176\u5B83\u5DF2\u542F\u7528\u7684\u673A\u5668\u4EBA\u4E0D\u53D7\u5F71\u54CD\u3002": "A disabled bot keeps no QQ long connection and neither receives nor replies to messages; other enabled bots are unaffected.",
  "\u505C\u7528": "Disable",
  "\u542F\u7528": "Enable",
  "\u672A\u663E\u5F0F\u6307\u5B9A\u673A\u5668\u4EBA\u65F6\uFF08\u914D\u7F6E\u7F16\u8F91\u3001\u4E3B\u52A8\u6D88\u606F\u3001\u5B9A\u65F6\u4EFB\u52A1\uFF09\uFF0C\u9ED8\u8BA4\u4F5C\u7528\u4E8E\u4E3B\u673A\u5668\u4EBA\u3002\u6240\u6709\u300C\u5DF2\u542F\u7528\u300D\u7684\u673A\u5668\u4EBA\u90FD\u4F1A\u540C\u65F6\u63A5\u6536\u5E76\u56DE\u590D\u6D88\u606F\u3002": "When no bot is specified explicitly (config editing, proactive messages, scheduled tasks), the primary bot is the default. All enabled bots receive and reply simultaneously.",
  "\u68C0\u67E5\u8FDE\u63A5": "Check connection",
  "\u91CD\u8BD5\u8FDE\u63A5": "Retry connection",
  "\u6309\u5F53\u524D\u51ED\u636E\u91CD\u65B0\u5EFA\u7ACB QQ WebSocket \u957F\u8FDE\u63A5\u3002\u6536\u4E0D\u5230\u6D88\u606F\u65F6\u5148\u70B9\u5B83\u6392\u67E5\u3002": "Rebuilds the QQ WebSocket long connection with the current credentials. Click this first when messages stop arriving.",
  "\u68C0\u67E5\u4E2D\u2026": "Checking\u2026",
  "\u79FB\u9664\u63A5\u5165": "Remove integration",
  "\u5220\u9664\u8FD9\u4E2A\u673A\u5668\u4EBA\u7684\u51ED\u636E\u4E0E\u914D\u7F6E\uFF0C\u5220\u9664\u540E\u5B83\u4F1A\u7ACB\u523B\u505C\u6B62\u63A5\u6536\u6D88\u606F\uFF0C\u4E14\u65E0\u6CD5\u64A4\u9500\u3002": "Deletes this bot\u2019s credentials and configuration. It stops receiving messages immediately and the action cannot be undone.",
  // ── 目录选择弹窗 ──
  "\u9009\u62E9\u5DE5\u4F5C\u533A\u76EE\u5F55": "Choose workspace directory",
  "\u9010\u7EA7\u6D4F\u89C8\u5E76\u9009\u5B9A\u673A\u5668\u4EBA\u8BFB\u53D6\u6587\u4EF6\u7684\u6587\u4EF6\u5939": "Browse level by level and pick the folder the bot may read files from",
  "\u6B63\u5728\u8BFB\u53D6\u76EE\u5F55\u2026": "Reading directory\u2026",
  "\u4E0A\u4E00\u7EA7": "Up one level",
  "\u5355\u51FB\u9009\u4E2D\uFF0C\u53CC\u51FB\u8FDB\u5165": "Click to select, double-click to enter",
  "\u8BE5\u76EE\u5F55\u4E0B\u6CA1\u6709\u5B50\u6587\u4EF6\u5939": "No subfolders in this directory",
  "\u5355\u51FB\u9009\u4E2D\uFF0C\u53CC\u51FB\u8FDB\u5165\uFF1B\u672A\u9009\u4E2D\u65F6\u9009\u5B9A\u5F53\u524D\u6D4F\u89C8\u7684\u76EE\u5F55": "Click to select, double-click to enter; with nothing selected, the currently browsed directory is chosen",
  "\u9009\u5B9A\u6B64\u6587\u4EF6\u5939": "Choose this folder",
  // ── 补齐：扫码步骤标题 / 设为主机器人按钮 / 补充说明小标题（实现时遗漏）──
  "\u8BF4\u660E": "Note",
  "\u624B\u673A QQ \u626B\u4E00\u626B": "Scan with mobile QQ",
  "\u5728 QQ \u91CC\u786E\u8BA4\u7ED1\u5B9A": "Confirm in QQ",
  "\u7B49\u5F85\u81EA\u52A8\u8DF3\u8F6C": "Wait for auto-redirect",
  "\u8BBE\u4E3A\u4E3B\u673A\u5668\u4EBA": "Set as primary bot",
  // ── 概览第一行按钮 + 定时/归档弹窗（范围 Tab、分组标题、时间轴角色）──
  "\u5B9A\u65F6\u6D88\u606F": "Scheduled",
  "\u6D88\u606F\u5F52\u6863": "Archive",
  "\u5F53\u524D\u673A\u5668\u4EBA": "Current bot",
  "\u6240\u6709\u673A\u5668\u4EBA": "All bots",
  "\u7FA4\u804A\u4EFB\u52A1": "Group tasks",
  "\u5355\u804A\u4EFB\u52A1": "Direct chats",
  "\u7528\u6237": "User",
  "\u673A\u5668\u4EBA": "Bot",
  "\u4E0A\u6B21\u5931\u8D25": "Last failed",
  // ── 定时消息编辑表单（字段 + 提示）──
  "\u53D1\u9001\u8303\u56F4": "Target chat",
  "\u53D1\u9001\u5230\u7FA4\u804A\u8FD8\u662F\u5355\u804A\u3002\u6539\u52A8\u8303\u56F4\u540E\u8BF7\u786E\u8BA4\u4E0B\u65B9 openid \u4E0E\u4E4B\u5339\u914D\u3002": "Send to a group or a direct chat. After changing this, make sure the openid below matches.",
  "\u7FA4\u804A": "Group",
  "\u5355\u804A": "Direct chat",
  "\u63A5\u6536\u65B9 openid": "Recipient openid",
  "\u63A5\u6536\u6D88\u606F\u7684\u7FA4\u6216\u7528\u6237 openid\uFF08o \u5F00\u5934\u7684\u957F\u4E32\uFF09\u3002\u673A\u5668\u4EBA\u6536\u5230\u8FC7\u8BE5\u7FA4/\u8BE5\u7528\u6237\u6D88\u606F\u540E\uFF0C\u53EF\u8BA9 AI \u7528 /session \u67E5\u5230\u3002": 'The openid (long id starting with "o") of the group or user receiving the message. Once the bot has seen that group/user, ask the AI to run /session to look it up.',
  "\u7FA4\u6216\u7528\u6237\u7684 openid": "group or user openid",
  "\u53D1\u9001\u7C7B\u578B": "Schedule type",
  "\u6BCF\u5929=\u5230\u70B9\u6BCF\u65E5\u53D1\u9001\u4E00\u6B21\uFF1B\u95F4\u9694=\u6309\u5206\u949F\u5FAA\u73AF\u53D1\u9001\u3002": "Daily = sent once at the set time each day; Interval = sent repeatedly every N minutes.",
  "\u6BCF\u5929\uFF08\u6307\u5B9A\u65F6\u523B\uFF09": "Daily (set time)",
  "\u95F4\u9694\uFF08\u5FAA\u73AF\u5206\u949F\uFF09": "Interval (minutes)",
  "\u6BCF\u5929\u53D1\u9001\u65F6\u95F4": "Daily time",
  "\u4E0A\u6D77\u65F6\u95F4\uFF08UTC+8\uFF09\uFF1B\u70B9\u51FB\u8F93\u5165\u6846\u7528\u65F6\u95F4\u9009\u62E9\u5668\u9009\u53D6\u3002": "Asia/Shanghai time (UTC+8); click the field to pick a time.",
  "\u95F4\u9694\u5206\u949F": "Interval minutes",
  "\u4E24\u6B21\u53D1\u9001\u4E4B\u95F4\u7684\u95F4\u9694\u5206\u949F\u6570\uFF0C\u6700\u5C0F 5 \u5206\u949F\u3002\u95F4\u9694\u8D8A\u5C0F\u6D88\u8017\u7684\u4E3B\u52A8\u6D88\u606F\u914D\u989D\u8D8A\u591A\u3002": "Minutes between sends, minimum 5. Shorter intervals consume more proactive-message quota.",
  "\u53D1\u9001\u65B9\u5F0F": "Send mode",
  "\u76F4\u63A5\u53D1\u9001=\u5230\u70B9\u539F\u6837\u53D1\u9001\u4E0B\u65B9\u5185\u5BB9\uFF1BAI \u751F\u6210=\u628A\u4E0B\u65B9\u5185\u5BB9\u4F5C\u4E3A\u6307\u4EE4\u4EA4\u7ED9 AI\uFF0C\u751F\u6210\u7ED3\u679C\u518D\u56DE\u590D\uFF08\u4F1A\u521B\u5EFA\u4F1A\u8BDD\u3001\u6D88\u8017 token\uFF09\u3002": "Direct = send the text below as-is at send time; AI = treat the text below as a prompt for the AI and send its generated reply (creates a session, costs tokens).",
  "\u76F4\u63A5\u53D1\u9001\u6587\u672C": "Send text directly",
  "AI \u751F\u6210\u5185\u5BB9": "Generate with AI",
  "\u5185\u5BB9": "Content",
  "\u7ED9 AI \u7684\u751F\u6210\u6307\u4EE4\uFF08\u5982\u300C\u64AD\u62A5\u4ECA\u5929\u7684\u5929\u6C14\u300D\uFF09\uFF0C\u5230\u70B9\u7531 AI \u751F\u6210\u5185\u5BB9\u540E\u53D1\u9001\u3002": `Prompt for the AI (e.g. "report today's weather"); the AI generates and sends the content at send time.`,
  "\u5230\u70B9\u76F4\u63A5\u53D1\u9001\u7684\u6587\u672C\uFF0C\u4E0A\u9650 2000 \u5B57\u3002": "Text sent as-is at send time, up to 2000 characters.",
  "\u603B\u7ED3\u4ECA\u5929\u7684\u5F85\u529E": "e.g. summarize today's todos",
  "\u8BB0\u5F97\u559D\u6C34": "e.g. drink some water",
  "\u5B9A\u65F6\u6D88\u606F\u5185\u5BB9": "Scheduled message content",
  "\u4FDD\u5B58\u540E\u7ACB\u5373\u751F\u6548\u5E76\u91CD\u65B0\u8BA1\u7B97\u4E0B\u6B21\u53D1\u9001\u65F6\u95F4": "Takes effect immediately on save; the next send time is recomputed.",
  "\u4FDD\u5B58\u4E2D\u2026": "Saving\u2026",
  "\u4FDD\u5B58\u4FEE\u6539": "Save changes",
  "\u7F16\u8F91": "Edit",
  "\u4ECE GitHub \u68C0\u67E5\u65B0\u7248\u672C\uFF1B\u53D1\u73B0\u65B0\u7248\u672C\u4F1A\u81EA\u52A8\u4E0B\u8F7D\u5E76\u66F4\u65B0\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548": "Check GitHub for a new version; if found it is downloaded and applied automatically. Restart DSH to take effect.",
  "\u5DF2\u66F4\u65B0 \u2713": "Updated \u2713",
  "\u68C0\u67E5\u66F4\u65B0": "Check for updates",
  "\u6B63\u5728\u68C0\u67E5\u66F4\u65B0\u2026": "Checking for updates\u2026",
  "\u4F8B\u5982\uFF1A\u603B\u7ED3\u4ECA\u5929\u7684\u5F85\u529E": "e.g. summarize today's todos",
  // ── 定时消息与归档（详情页卡片 + 两个独立弹窗）──
  "\u5B9A\u65F6\u6D88\u606F\u4E0E\u5F52\u6863": "Scheduled messages & archive",
  "\u5B9A\u65F6\u6D88\u606F\uFF1A\u67E5\u770B / \u5220\u9664\u8FD9\u4E2A\u673A\u5668\u4EBA\u5DF2\u8BBE\u7F6E\u7684\u5B9A\u65F6\u53D1\u9001\u4EFB\u52A1\uFF08\u804A\u5929\u91CC\u7684 /\u5B9A\u65F6 \u547D\u4EE4\u4E0E AI \u8BBE\u7F6E\u7684\u4EFB\u52A1\u90FD\u5728\u8FD9\u91CC\uFF09\u3002\u6D88\u606F\u5F52\u6863\uFF1A\u53EA\u8BFB\u67E5\u770B\u672C\u5730\u843D\u76D8\u7684\u6700\u8FD1\u6536\u53D1\u8BB0\u5F55\uFF0C\u6309\u5F53\u524D\u673A\u5668\u4EBA\u8FC7\u6EE4\u3002": "Scheduled messages: view/remove timed tasks set for this bot (both /schedule chat commands and AI-created ones). Archive: read-only view of recent locally archived messages, filtered by the current bot.",
  "\u5B9A\u65F6\u6D88\u606F\u7BA1\u7406": "Scheduled message manager",
  "\u5217\u51FA\u8FD9\u4E2A\u673A\u5668\u4EBA\u540D\u4E0B\u7684\u5168\u90E8\u5B9A\u65F6\u6D88\u606F\uFF08\u6BCF\u5929\u5B9A\u65F6\u4E0E\u95F4\u9694\u5FAA\u73AF\uFF09\uFF0C\u53EF\u5355\u6761\u5220\u9664\uFF1B\u5220\u9664\u7ACB\u5373\u751F\u6548\u5E76\u843D\u76D8\u3002": "Lists all scheduled messages under this bot (daily and interval), each removable; removal takes effect immediately and is persisted.",
  "\u67E5\u770B\u5B9A\u65F6\u6D88\u606F": "View scheduled messages",
  "\u5F00\u542F\u300C\u6D88\u606F\u672C\u5730\u5F52\u6863\u300D\u540E\uFF0C\u6536\u53D1\u7684\u6D88\u606F\u4F1A\u5199\u5165 ~/.dsh/qqbot/archive/\uFF08\u6309\u5929\u5206\u6587\u4EF6\uFF09\u3002\u8FD9\u91CC\u53EA\u8BFB\u5C55\u793A\u6700\u8FD1\u7684\u8BB0\u5F55\uFF0C\u6700\u65B0\u5728\u524D\u3002": 'With "message archiving" on, sent/received messages are written to ~/.dsh/qqbot/archive/ (one file per day). This shows recent records read-only, newest first.',
  "\u67E5\u770B\u5F52\u6863": "View archive",
  // ── replyLocale 下拉 ──
  "\u56DE\u590D\u8BED\u8A00\uFF08replyLocale\uFF09": "Reply language (replyLocale)",
  "\u56DE\u590D\u8BED\u8A00": "Reply language",
  "\u673A\u5668\u4EBA\u76F4\u63A5\u53D1\u7ED9 QQ \u7528\u6237\u7684\u7CFB\u7EDF\u6587\u6848\uFF08/help\u3001/status\u3001\u5B9A\u65F6\u6D88\u606F\u7528\u6CD5\u3001\u6B22\u8FCE\u8BED\u7B49\uFF09\u4F7F\u7528\u7684\u8BED\u8A00\u3002\u4E2D\u6587\u4E3A\u6E90\u8BED\u8A00\uFF1B\u9009\u62E9 English \u65F6\u8FD9\u4E9B\u6587\u6848\u81EA\u52A8\u7FFB\u8BD1\u4E3A\u82F1\u6587\uFF0C\u672A\u547D\u4E2D\u7684\u5185\u5BB9\u4FDD\u6301\u539F\u6587\u4E0D\u4E22\u4FE1\u606F\u3002AI \u5BF9\u8BDD\u5185\u5BB9\u672C\u8EAB\u4E0D\u53D7\u5F71\u54CD\u3002": "Language for system texts the bot sends directly to QQ users (/help, /status, schedule usage, welcome message, etc.). Chinese is the source language; choosing English translates them, and unmatched texts stay as-is so no information is lost. AI conversation content is unaffected.",
  "\u4E2D\u6587\uFF08\u9ED8\u8BA4\uFF09": "Chinese (default)",
  // ── 定时消息弹窗 ──
  "\u8FD9\u4E2A\u673A\u5668\u4EBA\u540D\u4E0B\u7684\u5168\u90E8\u5B9A\u65F6\u53D1\u9001\u4EFB\u52A1\uFF08\u542B\u804A\u5929\u547D\u4EE4\u4E0E AI \u8BBE\u7F6E\u7684\uFF09": "All scheduled send tasks under this bot (from chat commands and AI alike)",
  "\u6B63\u5728\u8BFB\u53D6\u5B9A\u65F6\u6D88\u606F\u2026": "Loading scheduled messages\u2026",
  "\u8FD8\u6CA1\u6709\u5B9A\u65F6\u6D88\u606F\u3002\u53EF\u5728\u804A\u5929\u91CC\u53D1 /\u5B9A\u65F6 \u6BCF\u5929 09:00 \u5185\u5BB9\u3001\u8BA9 AI \u5E2E\u4F60\u8BBE\u7F6E\uFF0C\u6216\u70B9\u4E0A\u65B9\u300C\uFF0B \u65B0\u589E\u300D\u3002": "No scheduled messages yet. Send /schedule daily 09:00 text in chat, ask the AI to set one up, or click \u201C+ New\u201D above.",
  "\uFF0B \u65B0\u589E": "+ New",
  "\u65B0\u589E\u5B9A\u65F6\u6D88\u606F": "New scheduled message",
  "\u521B\u5EFA": "Create",
  "AI \u751F\u6210": "AI-generated",
  "\u6765\u81EA\u8BBE\u7F6E\u9875": "From settings",
  "\u6765\u81EA AI": "From AI",
  "\u6765\u81EA\u804A\u5929\u547D\u4EE4": "From chat command",
  "\u4E0A\u6B21\u5931\u8D25\uFF1A": "Last failed: ",
  "\u5220\u9664\u4E2D\u2026": "Removing\u2026",
  "\u786E\u5B9A\u5220\u9664\u8FD9\u6761\u5B9A\u65F6\u6D88\u606F\uFF1F\u5220\u9664\u540E\u7ACB\u5373\u505C\u6B62\u53D1\u9001\u3002": "Remove this scheduled message? It stops sending immediately.",
  // ── 定时任务启用 / 禁用 ──
  "\u7981\u7528": "Disable",
  "\u5DF2\u7981\u7528": "Disabled",
  "\u7981\u7528\u4E2D\u2026": "Disabling\u2026",
  "\u542F\u7528\u4E2D\u2026": "Enabling\u2026",
  "\u5DF2\u7981\u7528\uFF0C\u4E0D\u4F1A\u6267\u884C": "Disabled \u2014 will not run",
  "\u786E\u5B9A\u7981\u7528\u8FD9\u6761\u5B9A\u65F6\u4EFB\u52A1\uFF1F\u7981\u7528\u540E\u4E0D\u518D\u6267\u884C\uFF0C\u53EF\u968F\u65F6\u91CD\u65B0\u542F\u7528\u3002": "Disable this scheduled task? It stops running until you re-enable it.",
  // ── 定时任务 AI 脚本生成 ──
  "\u547D\u4EE4\u6765\u6E90": "Command source",
  "\u624B\u5199\u547D\u4EE4": "Manual command",
  "AI \u751F\u6210\u811A\u672C": "AI-generate script",
  "AI \u811A\u672C\u63CF\u8FF0\u8BCD": "AI script prompt",
  "\u811A\u672C\u751F\u6210\u4E2D\u2026": "Generating script\u2026",
  "\u811A\u672C\u751F\u6210\u5931\u8D25": "Script generation failed",
  "\u751F\u6210\u5B8C\u6210\u540E\u5F00\u59CB\u6267\u884C\uFF1B\u5DF2\u8FC7\u7684\u89E6\u53D1\u65F6\u523B\u4E0D\u8865\u8DD1": "Runs once the script is ready; missed times are not replayed",
  "\u811A\u672C\u751F\u6210\u4E2D\u2026\u5B8C\u6210\u540E\u81EA\u52A8\u56DE\u586B\u547D\u4EE4\u5E76\u6309\u8BA1\u5212\u6267\u884C\u3002": "Generating script\u2026 The command is filled in automatically when done, then the schedule resumes.",
  "\u624B\u5199\u547D\u4EE4=\u81EA\u5DF1\u5199\u5B8C\u6574\u547D\u4EE4\u884C\uFF1BAI \u751F\u6210\u811A\u672C=\u53EA\u5199\u4EFB\u52A1\u63CF\u8FF0\uFF0C\u4FDD\u5B58\u540E\u7531 AI \u540E\u53F0\u751F\u6210\u811A\u672C\u5E76\u81EA\u52A8\u56DE\u586B\u547D\u4EE4\u3002": "Manual command = write the full command line yourself; AI-generate script = just describe the task, and AI writes the script in the background and fills in the command automatically.",
  "\u63CF\u8FF0\u8FD9\u4E2A\u5B9A\u65F6\u4EFB\u52A1\u8981\u505A\u7684\u4E8B\uFF08\u5982\u300C\u6293\u53D6\u67D0\u7F51\u9875\u4ECA\u65E5\u4EF7\u683C\u5E76\u8F93\u51FA\u4E00\u884C\u6587\u672C\u300D\uFF09\u3002\u4FDD\u5B58\u540E AI \u540E\u53F0\u751F\u6210\u811A\u672C\uFF1A\u751F\u6210\u671F\u95F4\u4EFB\u52A1\u4E0D\u6267\u884C\uFF1B\u5B8C\u6210\u540E\u81EA\u52A8\u6309\u8BA1\u5212\u6267\u884C\uFF08\u5DF2\u8FC7\u7684\u89E6\u53D1\u65F6\u523B\u4E0D\u8865\u8DD1\uFF09\u3002": `Describe what this scheduled task should do (e.g. "fetch today's price from a page and print one line"). After saving, AI generates the script in the background: the task does not run until it is ready, then resumes on schedule (missed times are not replayed).`,
  // ── 归档弹窗 ──
  "\u672C\u5730\u843D\u76D8\u7684\u6700\u8FD1\u6536\u53D1\u8BB0\u5F55\uFF08\u53EA\u8BFB\uFF0C\u6700\u65B0\u5728\u524D\uFF1B\u6309\u5F53\u524D\u673A\u5668\u4EBA\u8FC7\u6EE4\uFF09": "Recent locally archived messages (read-only, newest first; filtered by the current bot)",
  "\u672C\u5730\u843D\u76D8\u7684\u6536\u53D1\u8BB0\u5F55\uFF08\u6309\u5F53\u524D\u673A\u5668\u4EBA\u8FC7\u6EE4\uFF09\uFF1A\u5DE6\u680F\u9009\u65E5\u671F\u67E5\u770B\u5185\u5BB9\uFF0C\xD7 \u5220\u9664\u8BE5\u5929\u5F52\u6863": "Locally archived messages (filtered by the current bot): pick a date on the left to view it, click \xD7 to delete that day's archive",
  "\u6B63\u5728\u8BFB\u53D6\u5F52\u6863\u2026": "Loading archive\u2026",
  "\u8BE5\u5929\u6CA1\u6709\u8BB0\u5F55\u3002\u5F00\u542F\u300C\u6D88\u606F\u672C\u5730\u5F52\u6863\u300D\u5E76\u6536\u5230\u6D88\u606F\u540E\uFF0C\u8FD9\u91CC\u4F1A\u51FA\u73B0\u8BB0\u5F55\u3002": 'No records on this day. Records appear here once "message archiving" is on and messages arrive.',
  "\u5F52\u6863\u65E5\u671F\u6587\u4EF6": "Archive date files",
  "\u6682\u65E0\u5F52\u6863\u6587\u4EF6": "No archive files yet",
  "\u5220\u9664\u8BE5\u5929\u5F52\u6863\uFF08\u4EC5\u6B64\u673A\u5668\u4EBA\u7684\u8BB0\u5F55\uFF09": "Delete this day's archive (only this bot's records)",
  "\u6536\u5230": "Received",
  "\u56DE\u590D": "Reply",
  "\u4E3B\u52A8": "Proactive",
  "\u4F1A\u8BDD": "Session",
  // ── 安全开关（回复净化 / SSRF 防护 / 本地路径白名单） ──
  "\u56DE\u590D\u5185\u5BB9\u51C0\u5316": "Reply sanitization",
  "\u53D1\u9001\u524D\u5265\u79BB\u6A21\u578B\u8F93\u51FA\u91CC\u7684 system-reminder\u3001<think> \u7B49\u9690\u85CF\u6807\u7B7E\u5757\uFF0C\u9632\u6B62\u5185\u90E8\u63D0\u793A\u8BCD\u4E0E\u63A8\u7406\u8FC7\u7A0B\u6CC4\u6F0F\u7ED9\u804A\u5929\u5BF9\u8C61\u3002\u4EC5\u5F71\u54CD\u53D1\u9001\u5185\u5BB9\uFF0C\u5F52\u6863\u4E0E\u6A21\u578B\u4E0A\u4E0B\u6587\u4FDD\u7559\u539F\u6587\u3002": "Strips hidden tag blocks such as system-reminder and <think> from model output before sending, preventing internal prompts and reasoning from leaking to chat partners. Only affects outgoing content; archives and model context keep the original text.",
  "\u5A92\u4F53\u94FE\u63A5\u5B89\u5168\u6821\u9A8C\uFF08SSRF \u9632\u62A4\uFF09": "Media URL safety check (SSRF guard)",
  "AI \u53D1\u56FE/\u53D1\u6587\u4EF6/\u53D1\u8BED\u97F3\u65F6\uFF0C\u6821\u9A8C URL \u4E0D\u6307\u5411\u5185\u7F51\u6216\u4FDD\u7559\u5730\u5740\uFF08127.0.0.1\u3001192.168.x.x\u3001169.254 \u5143\u6570\u636E\u7B49\uFF09\uFF0CQQ \u5B98\u65B9\u57DF\u540D\u76F4\u901A\u3002\u9632\u6B62\u6A21\u578B\u88AB\u8BF1\u5BFC\u8BA9\u672C\u673A\u8BF7\u6C42\u5185\u7F51\u670D\u52A1\u3002\u5173\u95ED\u540E\u4EC5\u8981\u6C42 http/https \u534F\u8BAE\u3002": "When the AI sends images/files/voice, URLs are checked against intranet and reserved addresses (127.0.0.1, 192.168.x.x, 169.254 metadata, etc.); official QQ domains pass through. Prevents the model from being tricked into probing intranet services. When off, only the http/https scheme is enforced.",
  "\u672C\u5730\u6587\u4EF6\u8DEF\u5F84\u767D\u540D\u5355": "Local path whitelist",
  "AI \u53D1\u56FE/\u53D1\u6587\u4EF6/\u53D1\u8BED\u97F3\u65F6\uFF0C\u672C\u673A\u8DEF\u5F84\u5FC5\u987B\u4F4D\u4E8E\u5DE5\u4F5C\u533A\u76EE\u5F55\u6216\u63D2\u4EF6\u6570\u636E\u76EE\u5F55\u5185\uFF0C\u9632\u6B62\u628A\u4EFB\u610F\u672C\u673A\u6587\u4EF6\uFF08\u5982\u51ED\u636E\u3001\u5BC6\u94A5\uFF09\u53D1\u9001\u7ED9\u804A\u5929\u5BF9\u8C61\u3002\u5173\u95ED\u540E\u5141\u8BB8\u4EFB\u610F\u672C\u673A\u8DEF\u5F84\uFF08\u4E0D\u63A8\u8350\uFF09\u3002": "When the AI sends images/files/voice, local paths must reside inside the workspace or plugin data directory, preventing arbitrary local files (credentials, keys, etc.) from being sent to chat partners. When off, any local path is allowed (not recommended).",
  // ── 按群配置（群级覆盖） ──
  "\u6309\u7FA4\u914D\u7F6E": "Per-group config",
  "\u4E3A\u7279\u5B9A\u7FA4\u5355\u72EC\u8986\u76D6\u884C\u4E3A\u914D\u7F6E\uFF08\u9608\u503C/\u51B7\u5374/\u654F\u611F\u8BCD/\u4E0A\u4E0B\u6587\u7B49\uFF09\uFF0C\u5176\u4F59\u5B57\u6BB5\u8DDF\u968F\u673A\u5668\u4EBA\u9ED8\u8BA4\u3002\u9002\u5408\u628A\u67D0\u4E00\u4E2A\u7FA4\u8C03\u5F97\u66F4\u6D3B\u8DC3\u6216\u66F4\u5B89\u9759\uFF0C\u800C\u4E0D\u5F71\u54CD\u5176\u4ED6\u7FA4\u3002": "Override behavior settings (threshold/cooldowns/banned words/context, etc.) for specific groups; everything else follows the bot default. Useful for making one group more or less chatty without affecting others.",
  "\u8FD8\u6CA1\u6709\u6309\u7FA4\u8986\u76D6\u914D\u7F6E\uFF0C\u6240\u6709\u7FA4\u90FD\u4F7F\u7528\u4E0A\u65B9\u673A\u5668\u4EBA\u9ED8\u8BA4\u914D\u7F6E\u3002": "No per-group overrides yet; every group uses the bot defaults above.",
  "\u8986\u76D6\u5B57\u6BB5\u672A\u8BBE\u7F6E\u65F6\u8DDF\u968F\u673A\u5668\u4EBA\u9ED8\u8BA4\uFF1B\u5168\u90E8\u6E05\u7A7A\u5E76\u4FDD\u5B58\u5373\u5220\u9664\u8BE5\u7FA4\u8986\u76D6\u3002": "Fields left unset follow the bot default; clearing every field and saving removes the override for that group.",
  "\u6DFB\u52A0\u7FA4\u8986\u76D6": "Add group override",
  "\u7F16\u8F91\u7FA4\u8986\u76D6": "Edit group override",
  "\u5220\u9664": "Delete",
  "\u7FA4": "Group",
  "\u65E0\u8986\u76D6\u5B57\u6BB5": "No overridden fields",
  "\u8BF7\u586B\u5199\u7FA4 openid": "Please enter the group openid",
  "\u7559\u7A7A/\u9009\u62E9\u300C\u8DDF\u968F\u9ED8\u8BA4\u300D\u7684\u5B57\u6BB5\u7EE7\u7EED\u4F7F\u7528\u673A\u5668\u4EBA\u7EA7\u914D\u7F6E\uFF0C\u4EC5\u6B64\u7FA4\u751F\u6548": 'Fields left empty or set to "Follow default" keep using the bot-level config; changes apply to this group only.',
  "\u7FA4 openid": "Group openid",
  "\u8981\u5355\u72EC\u914D\u7F6E\u7684\u7FA4 openid\uFF08o \u5F00\u5934\u7684\u957F\u4E32\uFF09\u3002\u53EF\u5728\u7FA4\u91CC\u8BA9 AI \u7528 /session \u67E5\u770B\u3002": 'The openid of the group to configure (a long id starting with "o"). Ask the AI to run /session in that group to find it.',
  "\u7FA4\u5168\u91CF\u56DE\u590D": "Full group reply",
  "\u8BE5\u7FA4\u975E @ \u6D88\u606F\u662F\u5426\u53C2\u4E0E\u4EF7\u503C\u8BC4\u5206\u5E76\u56DE\u590D\u3002": "Whether non-@ messages in this group are value-scored and answered.",
  "\u8DDF\u968F\u9ED8\u8BA4": "Follow default",
  "\u4EF7\u503C\u9608\u503C": "Value threshold",
  "\u4EC5\u7FA4\u5168\u91CF\u56DE\u590D\u5F00\u542F\u65F6\u6709\u6548\uFF1A0-10 \u5206\uFF0C\u8FBE\u5230\u9608\u503C\u624D\u56DE\u590D\u3002": "Only effective when full group reply is on: score 0-10; the bot replies at or above the threshold.",
  "@ \u4E0A\u4E0B\u6587\u6761\u6570": "@ context messages",
  "@ \u673A\u5668\u4EBA\u65F6\u9644\u5E26\u7684\u672C\u7FA4\u6700\u8FD1\u6D88\u606F\u6761\u6570\u3002": "How many recent group messages are attached when someone @-mentions the bot.",
  "\u540C\u7FA4\u51B7\u5374": "Group cooldown",
  "\u8BE5\u7FA4\u4E24\u6B21\u5168\u91CF\u56DE\u590D\u7684\u6700\u5C0F\u95F4\u9694\uFF08@ \u56DE\u590D\u4E0D\u53D7\u9650\uFF09\u3002": "Minimum interval between two full replies in this group (@ replies are not limited).",
  "\u540C\u4EBA\u51B7\u5374": "Per-sender cooldown",
  "\u540C\u4E00\u4EBA\u5728\u8BE5\u7FA4\u4E24\u6B21\u88AB\u56DE\u590D\u7684\u6700\u5C0F\u95F4\u9694\u3002": "Minimum interval between replies to the same sender in this group.",
  "\u5206\u7247\u957F\u5EA6": "Chunk length",
  "\u5355\u6761\u56DE\u590D\u7684\u6700\u5927\u5B57\u7B26\u6570\uFF0C\u8D85\u8FC7\u4F1A\u62C6\u6210\u591A\u6761\u53D1\u9001\u3002": "Max characters per reply; longer replies are split into multiple messages.",
  "\u6BCF\u6761\u6D88\u606F\u56DE\u590D\u4E0A\u9650": "Replies per message",
  "\u8BE5\u7FA4\u6BCF\u6761\u7528\u6237\u6D88\u606F\u6700\u591A\u88AB\u52A8\u56DE\u590D\u51E0\u6761\uFF08\u5E73\u53F0\u4E0A\u9650 5\uFF09\u3002": "Max passive replies per user message in this group (platform limit: 5).",
  "\u8BE5\u7FA4\u56DE\u590D\u662F\u5426\u4F18\u5148\u4F7F\u7528 QQ Markdown\u3002": "Whether replies in this group prefer QQ Markdown.",
  "\u8BE5\u7FA4\u662F\u5426\u7EF4\u62A4\u8DE8\u4F1A\u8BDD\u957F\u671F\u8BB0\u5FC6\u3002": "Whether this group maintains cross-session long-term memory.",
  // 聊天 Preset（agentPresetChat）已从群覆盖弹窗移除，仅 bots.json 可配；词条保留备用。
  "\u4EC5\u8BE5\u7FA4\u751F\u6548\u7684\u654F\u611F\u8BCD\uFF08\u9017\u53F7\u5206\u9694\uFF09\uFF0C\u547D\u4E2D\u5373\u64A4\u56DE\u5E76\u8DF3\u8FC7\u56DE\u590D\uFF1B\u4E0E\u673A\u5668\u4EBA\u7EA7\u654F\u611F\u8BCD\u53E0\u52A0\u3002": "Banned words that only apply to this group (comma-separated). A hit recalls the message and skips the reply; combined with bot-level banned words.",
  "\u8BCD1, \u8BCD2\uFF08\u7559\u7A7A\u8DDF\u968F\u9ED8\u8BA4\uFF09": "word1, word2 (leave empty to follow default)",
  "\u4FDD\u5B58\u540E\u7ACB\u5373\u751F\u6548\uFF0C\u65E0\u9700\u91CD\u542F": "Takes effect immediately after saving \u2014 no restart needed",
  // ── 定时任务管理（daily / interval / cron / at × 文本 / AI / 执行命令）──
  "\u5B9A\u65F6\u4EFB\u52A1\u7BA1\u7406": "Scheduled task manager",
  "\u652F\u6301 daily / interval / cron / at \u56DB\u79CD\u89E6\u53D1\u6761\u4EF6\uFF0C\u4EE5\u53CA \u6587\u672C / AI \u751F\u6210 / \u6267\u884C\u547D\u4EE4 \u4E09\u79CD\u6267\u884C\u65B9\u5F0F\u3002": "Four triggers \u2014 daily / interval / cron / at \u2014 and three actions: text / AI-generated / run a command.",
  "\u5F85\u8865\u7B97": "TBD",
  "\u65B0\u589E\u5B9A\u65F6\u4EFB\u52A1": "New scheduled task",
  "\u6B63\u5728\u8BFB\u53D6\u5B9A\u65F6\u4EFB\u52A1\u2026": "Loading scheduled tasks\u2026",
  "\u8FD8\u6CA1\u6709\u5B9A\u65F6\u4EFB\u52A1\u3002\u53EF\u5728\u804A\u5929\u91CC\u53D1 /\u5B9A\u65F6 \u6BCF\u5929 09:00 \u5185\u5BB9\u3001\u8BA9 AI \u5E2E\u4F60\u8BBE\u7F6E\uFF0C\u6216\u70B9\u4E0A\u65B9\u300C\uFF0B \u65B0\u589E\u300D\u3002": "No scheduled tasks yet. Send /schedule daily 09:00 text in chat, ask the AI to set one up, or click \u201C+ New\u201D above.",
  "\u786E\u5B9A\u5220\u9664\u8FD9\u6761\u5B9A\u65F6\u4EFB\u52A1\uFF1F\u5220\u9664\u540E\u7ACB\u5373\u505C\u6B62\u53D1\u9001\u3002": "Delete this scheduled task? It stops firing immediately.",
  "\u4FDD\u5B58\u540E\u7ACB\u5373\u751F\u6548\u5E76\u91CD\u65B0\u8BA1\u7B97\u4E0B\u6B21\u89E6\u53D1\u65F6\u95F4": "Takes effect immediately on save; the next run time is recomputed.",
  // 编辑表单 · ① 发送给谁
  "\u2460 \u53D1\u9001\u7ED9\u8C01": "\u2460 Recipient",
  "\u51B3\u5B9A\u8FD9\u6761\u4EFB\u52A1\u5F80\u54EA\u4E2A\u7FA4\u6216\u54EA\u4E2A\u7528\u6237\u53D1\u3002": "Decides which group or user this task sends to.",
  "\u7FA4\u804A\u6216\u5355\u804A\uFF1B\u6539\u52A8\u8303\u56F4\u540E\u8BF7\u786E\u8BA4\u4E0B\u65B9 openid \u4E0E\u4E4B\u5339\u914D\u3002": "Group or direct chat; after changing this, make sure the openid below matches.",
  "\u63A5\u6536\u6D88\u606F\u7684\u7FA4\u6216\u7528\u6237 openid\u3002\u673A\u5668\u4EBA\u6536\u5230\u8FC7\u8BE5\u7FA4/\u8BE5\u7528\u6237\u6D88\u606F\u540E\uFF0C\u53EF\u8BA9 AI \u7528 /session \u67E5\u5230\u3002": "The openid of the group or user that receives the message. Once the bot has seen them, ask the AI to run /session to look it up.",
  // 编辑表单 · ② 什么时候触发
  "\u2461 \u4EC0\u4E48\u65F6\u5019\u89E6\u53D1": "\u2461 When it fires",
  "\u9009\u62E9\u89E6\u53D1\u6761\u4EF6\u5E76\u586B\u5199\u5BF9\u5E94\u53C2\u6570\u3002": "Pick a trigger and fill in its parameters.",
  "\u89E6\u53D1\u6761\u4EF6": "Trigger",
  "\u6BCF\u5929=\u6307\u5B9A\u65F6\u523B\uFF1B\u95F4\u9694=\u6309\u5206\u949F\u5FAA\u73AF\uFF1Bcron=\u6807\u51C6\u8868\u8FBE\u5F0F\uFF08\u53EF\u5E26\u65F6\u533A\uFF09\uFF1B\u4E00\u6B21\u6027 at=\u7EDD\u5BF9\u65F6\u95F4\uFF0C\u5230\u70B9\u540E\u81EA\u52A8\u5220\u9664\u3002": "daily = at a set time; interval = every N minutes; cron = a standard expression (with time zone); one-time at = an absolute time, removed after it fires.",
  "\u6BCF\u5929": "Daily",
  "\u95F4\u9694": "Interval",
  "\u4E00\u6B21\u6027 at": "One-time at",
  "\u6309\u6240\u9009\u65F6\u533A\u89E3\u91CA\uFF1B\u70B9\u51FB\u8F93\u5165\u6846\u53EF\u7528\u65F6\u95F4\u9009\u62E9\u5668\u3002": "Interpreted in the selected time zone; click the field to use the time picker.",
  "\u65F6\u533A": "Time zone",
  "daily \u9ED8\u8BA4\u6309\u4E2D\u56FD\u6807\u51C6\u65F6\u95F4\u53D1\u9001\uFF1B\u5982\u9700\u6309\u5176\u4ED6\u65F6\u533A\uFF0C\u8BF7\u6539\u7528 cron\u3002": "daily defaults to China Standard Time; switch to cron if you need another time zone.",
  "cron \u8868\u8FBE\u5F0F\u6309\u8BE5\u65F6\u533A\u89E3\u91CA\u3002": "The cron expression is interpreted in this time zone.",
  "at \u65F6\u95F4\u6309\u8BE5\u65F6\u533A\u89E3\u91CA\u3002": "The one-time time is interpreted in this time zone.",
  "\u81EA\u5B9A\u4E49\uFF08\u624B\u52A8\u8F93\u5165 IANA \u65F6\u533A\uFF09": "Custom (enter an IANA time zone)",
  "\u81EA\u5B9A\u4E49\u65F6\u533A": "Custom time zone",
  "\u4E24\u6B21\u53D1\u9001\u4E4B\u95F4\u7684\u95F4\u9694\uFF0C\u6700\u5C0F 5 \u5206\u949F\u3002\u95F4\u9694\u8D8A\u5C0F\u6D88\u8017\u7684\u4E3B\u52A8\u6D88\u606F\u914D\u989D\u8D8A\u591A\u3002": "Gap between two sends, minimum 5 minutes. Shorter intervals consume more proactive-message quota.",
  "\u5206\u949F": "min",
  "\u5FEB\u6377": "Quick",
  "5 \u5206": "5m",
  "10 \u5206": "10m",
  "15 \u5206": "15m",
  "30 \u5206": "30m",
  "1 \u5C0F\u65F6": "1h",
  "2 \u5C0F\u65F6": "2h",
  "6 \u5C0F\u65F6": "6h",
  "12 \u5C0F\u65F6": "12h",
  "24 \u5C0F\u65F6": "24h",
  "cron \u8868\u8FBE\u5F0F": "Cron expression",
  "\u6807\u51C6 5 \u6BB5\uFF1A\u5206 \u65F6 \u65E5 \u6708 \u5468\uFF08\u5982 0 9 * * 1-5 = \u5DE5\u4F5C\u65E5 9 \u70B9\uFF09\u3002\u652F\u6301 */\u6B65\u957F\u3001\u8303\u56F4\u3001\u5217\u8868\u3001\u6708\u4EFD\u4E0E\u661F\u671F\u82F1\u6587\u540D\u3002": "Standard 5 fields: minute hour day month weekday (e.g. 0 9 * * 1-5 = 9am on weekdays). Supports */step, ranges, lists, and month/weekday names.",
  "at \u65F6\u95F4": "One-time run at",
  "\u4E00\u6B21\u6027\u89E6\u53D1\u65F6\u95F4\uFF0C\u5230\u70B9\u6267\u884C\u4E00\u6B21\u540E\u81EA\u52A8\u5220\u9664\u3002": "A one-off time \u2014 the task runs once and is then removed automatically.",
  "\u661F\u671F\u8FC7\u6EE4\uFF08\u53EF\u9009\uFF09": "Weekday filter (optional)",
  "\u4EC5\u5728\u8FD9\u4E9B\u661F\u671F\u89E6\u53D1\uFF1B\u4E0D\u9009 = \u6BCF\u5929\u30020=\u5468\u65E5\u3002": "Fires only on these weekdays; selecting none means every day. 0 = Sunday.",
  "\u661F\u671F\u8FC7\u6EE4": "Weekday filter",
  "\u5DE5\u4F5C\u65E5": "Weekdays",
  "\u5468\u672B": "Weekend",
  "\u672A\u6765 5 \u5E74\u5185\u65E0\u5339\u914D\uFF0C\u8BF7\u68C0\u67E5\u8868\u8FBE\u5F0F": "No match within the next 5 years \u2014 check the expression",
  "\u8868\u8FBE\u5F0F\u8FD8\u4E0D\u5B8C\u6574\u6216\u975E\u6CD5\uFF08\u5E94\u4E3A 5 \u6BB5\uFF1A\u5206 \u65F6 \u65E5 \u6708 \u5468\uFF09": "Expression is incomplete or invalid (5 fields expected: minute hour day month weekday)",
  // 编辑表单 · ③ 到点做什么
  "\u2462 \u5230\u70B9\u505A\u4EC0\u4E48": "\u2462 What it does",
  "\u9009\u62E9\u6267\u884C\u65B9\u5F0F\u5E76\u586B\u5199\u5185\u5BB9\u3002": "Pick an action and fill in its content.",
  "\u6267\u884C\u65B9\u5F0F": "Action",
  "\u6587\u672C=\u5230\u70B9\u539F\u6837\u53D1\u9001\uFF1BAI \u751F\u6210=\u628A\u5185\u5BB9\u5F53\u6307\u4EE4\u4EA4\u7ED9 AI \u751F\u6210\u540E\u56DE\u590D\uFF1B\u6267\u884C\u547D\u4EE4=\u5230\u70B9\u8DD1\u4E00\u6761\u547D\u4EE4\u5E76\u628A\u8F93\u51FA\u63A8\u9001\u7ED9\u7528\u6237\u3002": "text = send as-is; AI = treat the content as a prompt and reply with what the AI generates; run command = execute a command and push its output to the user.",
  "\u6267\u884C\u547D\u4EE4\u5E76\u63A8\u9001\u7ED3\u679C": "Run a command and push its output",
  "\u8981\u6267\u884C\u7684\u547D\u4EE4": "Command to run",
  "\u5230\u70B9\u7531\u670D\u52A1\u7AEF\u6267\u884C\u8FD9\u6761\u547D\u4EE4\u884C\uFF0C\u6355\u83B7 stdout/stderr \u4E0E\u9000\u51FA\u7801\u540E\u63A8\u9001\u7ED9\u7528\u6237\u3002\u652F\u6301 python / powershell -File / .bat / node / vbs(cscript //Nologo) / perl / php / ruby \u7B49\u3002": "The server runs this command line at the scheduled time, captures stdout/stderr plus the exit code, then pushes the result to the user. Supports python / powershell -File / .bat / node / vbs (cscript //Nologo) / perl / php / ruby and more.",
  "\u6A21\u677F": "Templates",
  "bat \u6279\u5904\u7406": "Batch file (.bat)",
  "\u5DE5\u4F5C\u76EE\u5F55\uFF08\u53EF\u9009\uFF09": "Working directory (optional)",
  "\u547D\u4EE4\u7684\u5DE5\u4F5C\u76EE\u5F55\uFF1B\u7559\u7A7A\u5219\u4F7F\u7528\u63D2\u4EF6\u8FDB\u7A0B\u76EE\u5F55\u3002\u811A\u672C\u91CC\u7528\u76F8\u5BF9\u8DEF\u5F84\u65F6\u5EFA\u8BAE\u586B\u5199\u3002": "Working directory for the command; leave empty for the plugin process directory. Recommended when the script uses relative paths.",
  "\u4F8B\u5982 C:/scripts": "e.g. C:/scripts",
  "\u5DE5\u4F5C\u76EE\u5F55": "Working directory",
  "\u7ED3\u679C\u5904\u7406": "Result handling",
  "raw = \u76F4\u63A5\u628A\u547D\u4EE4\u8F93\u51FA\u63A8\u9001\u7ED9\u7528\u6237\uFF1Bai = \u5148\u628A\u8F93\u51FA\u4EA4\u7ED9 AI \u6574\u7406\u6210\u7B80\u6D01\u64AD\u62A5\u518D\u63A8\u9001\uFF08\u8F93\u51FA\u5F88\u957F\u6216\u542B\u566A\u97F3\u65F6\u63A8\u8350\uFF09\u3002": "raw = push the command output as-is; ai = let the AI turn it into a short report first (recommended when output is long or noisy).",
  "raw\uFF1A\u76F4\u63A5\u63A8\u9001\u539F\u59CB\u8F93\u51FA": "raw: push raw output",
  "ai\uFF1A\u4EA4\u7ED9 AI \u6574\u7406\u540E\u63A8\u9001": "ai: summarize with AI, then push",
  "\u4F8B\u5982\uFF1A\u8BB0\u5F97\u559D\u6C34": "e.g. drink some water",
  "\u5B9A\u65F6\u4EFB\u52A1\u5185\u5BB9": "Scheduled task content",
  "\u547D\u4EE4 \u2192 AI \u64AD\u62A5": "command \u2192 AI report",
  "\u547D\u4EE4 \u2192 \u539F\u59CB\u8F93\u51FA": "command \u2192 raw output",
  // 校验提示（编辑表单）
  "\u8BF7\u586B\u5199\u63A5\u6536\u65B9 openid\uFF08\u7FA4\u6216\u7528\u6237\uFF09": "Enter the recipient openid (group or user)",
  "\u65F6\u95F4\u683C\u5F0F\u5E94\u4E3A HH:mm\uFF08\u5982 09:30\uFF09": "Time must look like HH:mm (e.g. 09:30)",
  "\u95F4\u9694\u4E0D\u80FD\u5C0F\u4E8E 5 \u5206\u949F": "Interval must be at least 5 minutes",
  "cron \u8868\u8FBE\u5F0F\u975E\u6CD5\uFF08\u6807\u51C6 5 \u6BB5\uFF0C\u5982 0 9 * * 1-5\uFF09": "Invalid cron expression (standard 5 fields, e.g. 0 9 * * 1-5)",
  "\u8BF7\u9009\u62E9\u6709\u6548\u7684 at \u65F6\u95F4": "Pick a valid one-time date and time",
  "at \u65F6\u95F4\u5FC5\u987B\u665A\u4E8E\u5F53\u524D\u65F6\u95F4": "The one-time time must be later than now",
  "\u65F6\u533A\u683C\u5F0F\u4E0D\u6B63\u786E\uFF08\u5E94\u4E3A IANA \u65F6\u533A\uFF0C\u5982 Asia/Shanghai\uFF09": "Invalid time zone (expected an IANA zone such as Asia/Shanghai)",
  "\u8BF7\u586B\u5199\u8981\u6267\u884C\u7684\u547D\u4EE4\uFF08\u5982 python C:/scripts/report.py\uFF09": "Enter the command to run (e.g. python C:/scripts/report.py)",
  "\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A": "Content must not be empty",
  // 时区下拉（常用 IANA 时区）
  "\u4E2D\u56FD\u6807\u51C6\u65F6\u95F4 \xB7 Asia/Shanghai\uFF08UTC+8\uFF09": "China Standard Time \xB7 Asia/Shanghai (UTC+8)",
  "\u4E2D\u56FD\u9999\u6E2F \xB7 Asia/Hong_Kong\uFF08UTC+8\uFF09": "Hong Kong, China \xB7 Asia/Hong_Kong (UTC+8)",
  "\u4E2D\u56FD\u53F0\u6E7E \xB7 Asia/Taipei\uFF08UTC+8\uFF09": "Taiwan, China \xB7 Asia/Taipei (UTC+8)",
  "\u65B0\u52A0\u5761 \xB7 Asia/Singapore\uFF08UTC+8\uFF09": "Singapore \xB7 Asia/Singapore (UTC+8)",
  "\u65E5\u672C \xB7 Asia/Tokyo\uFF08UTC+9\uFF09": "Japan \xB7 Asia/Tokyo (UTC+9)",
  "\u97E9\u56FD \xB7 Asia/Seoul\uFF08UTC+9\uFF09": "Korea \xB7 Asia/Seoul (UTC+9)",
  "\u5370\u5EA6 \xB7 Asia/Kolkata\uFF08UTC+5:30\uFF09": "India \xB7 Asia/Kolkata (UTC+5:30)",
  "\u963F\u8054\u914B \xB7 Asia/Dubai\uFF08UTC+4\uFF09": "UAE \xB7 Asia/Dubai (UTC+4)",
  "\u4FC4\u7F57\u65AF \xB7 Europe/Moscow\uFF08UTC+3\uFF09": "Russia \xB7 Europe/Moscow (UTC+3)",
  "\u4E2D\u6B27 \xB7 Europe/Berlin\uFF08UTC+1/+2\uFF09": "Central Europe \xB7 Europe/Berlin (UTC+1/+2)",
  "\u82F1\u56FD \xB7 Europe/London\uFF08UTC+0/+1\uFF09": "United Kingdom \xB7 Europe/London (UTC+0/+1)",
  "\u5DF4\u897F \xB7 America/Sao_Paulo\uFF08UTC-3\uFF09": "Brazil \xB7 America/Sao_Paulo (UTC-3)",
  "\u7F8E\u56FD\u4E1C\u90E8 \xB7 America/New_York\uFF08UTC-5/-4\uFF09": "US Eastern \xB7 America/New_York (UTC-5/-4)",
  "\u7F8E\u56FD\u4E2D\u90E8 \xB7 America/Chicago\uFF08UTC-6/-5\uFF09": "US Central \xB7 America/Chicago (UTC-6/-5)",
  "\u7F8E\u56FD\u5C71\u5730 \xB7 America/Denver\uFF08UTC-7/-6\uFF09": "US Mountain \xB7 America/Denver (UTC-7/-6)",
  "\u7F8E\u56FD\u897F\u90E8 \xB7 America/Los_Angeles\uFF08UTC-8/-7\uFF09": "US Pacific \xB7 America/Los_Angeles (UTC-8/-7)",
  "\u6FB3\u5927\u5229\u4E9A \xB7 Australia/Sydney\uFF08UTC+10/+11\uFF09": "Australia \xB7 Australia/Sydney (UTC+10/+11)",
  "\u65B0\u897F\u5170 \xB7 Pacific/Auckland\uFF08UTC+12/+13\uFF09": "New Zealand \xB7 Pacific/Auckland (UTC+12/+13)",
  "\u534F\u8C03\u4E16\u754C\u65F6 \xB7 UTC\uFF08UTC+0\uFF09": "Coordinated Universal Time \xB7 UTC (UTC+0)",
  "\u8BF7\u81F3\u5C11\u8BBE\u7F6E\u4E00\u4E2A\u8986\u76D6\u5B57\u6BB5\uFF1A\u5168\u90E8\u300C\u8DDF\u968F\u9ED8\u8BA4\u300D\u7B49\u540C\u4E8E\u4E0D\u6DFB\u52A0\u8BE5\u7FA4\u8986\u76D6\u3002": 'Set at least one override field: leaving everything at "Follow default" is the same as not adding this group override.',
  "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5": "Save failed; please retry later",
  "\u4FDD\u5B58": "Save",
  // ── openid 归档下拉（id-picker + 两个弹窗的新提示）──
  "\u63A5\u6536\u6D88\u606F\u7684\u7FA4\u6216\u7528\u6237 openid\u3002\u70B9\u51FB\u8F93\u5165\u6846\u53EF\u4ECE\u6D88\u606F\u5F52\u6863\u4E0B\u62C9\u9009\u62E9\uFF1A\u7FA4\u804A\u5019\u9009\u663E\u793A\u7FA4 id\uFF0C\u5355\u804A\u5019\u9009\u663E\u793A\u7528\u6237 id \u4E0E\u6635\u79F0\uFF1B\u4E5F\u53EF\u76F4\u63A5\u7C98\u8D34\u3002": "The openid of the group or user receiving messages. Click the field to pick from archived chats: group candidates show the group id, DM candidates show the user id and nickname; pasting one in works too.",
  "\u8981\u5355\u72EC\u914D\u7F6E\u7684\u7FA4 openid\uFF08o \u5F00\u5934\u7684\u957F\u4E32\uFF09\u3002\u70B9\u51FB\u8F93\u5165\u6846\u53EF\u4ECE\u6D88\u606F\u5F52\u6863\u4E0B\u62C9\u9009\u62E9\uFF0C\u5019\u9009\u6807\u6CE8\u300C\u7FA4 id\u300D\uFF1B\u4E5F\u53EF\u76F4\u63A5\u7C98\u8D34\u3002": 'The openid of the group to configure (a long id starting with "o"). Click the field to pick from archived chats \u2014 candidates are labelled "Group id"; pasting one in works too.',
  "\u5F52\u6863\u4F1A\u8BDD\u5019\u9009": "Archived chat candidates",
  "\u6B63\u5728\u8BFB\u53D6\u5F52\u6863\u4F1A\u8BDD\u2026": "Loading archived chats\u2026",
  "\u5F52\u6863\u91CC\u8FD8\u6CA1\u6709\u8BE5\u7C7B\u578B\u7684\u4F1A\u8BDD\u8BB0\u5F55\uFF0C\u53EF\u76F4\u63A5\u7C98\u8D34 openid": "No chats of this type in the archive yet \u2014 you can paste an openid directly",
  "\u6CA1\u6709\u5339\u914D\u7684\u5019\u9009\uFF0C\u53EF\u76F4\u63A5\u7C98\u8D34 openid": "No matching candidates \u2014 you can paste an openid directly",
  // ── 宿主（host）返回的错误/提示文案（经 errText 嵌入设置页提示条，2026-09-10 补齐） ──
  "\u6CA1\u6709\u53EF\u7528\u7684\u673A\u5668\u4EBA\uFF08\u8BF7\u5148\u6DFB\u52A0\u673A\u5668\u4EBA\uFF09": "No bot available (add a bot first)",
  "appId \u4E0E appSecret \u5FC5\u586B": "appId and appSecret are required",
  "\u7F3A\u5C11 appId": "Missing appId",
  "\u7F3A\u5C11 id": "Missing id",
  "\u7F3A\u5C11 scope/openid": "Missing scope/openid",
  "scope/openid/content \u5FC5\u586B": "scope/openid/content are required",
  "enabled \u5FC5\u987B\u662F\u5E03\u5C14\u503C": "enabled must be a boolean",
  "\u8C03\u5EA6\u5668\u4E0D\u53EF\u7528": "Scheduler unavailable",
  "\u673A\u5668\u4EBA\u4E0D\u5B58\u5728": "Bot does not exist",
  "\u626B\u7801\u7ED3\u679C\u7F3A\u5C11\u51ED\u636E": "QR scan result is missing credentials",
  "\u7A7A\u54CD\u5E94": "Empty response",
  "type \u5FC5\u987B\u662F daily / interval / cron / at \u4E4B\u4E00": "type must be one of daily / interval / cron / at",
  "\u5185\u5BB9\u8FC7\u957F\uFF08\u4E0A\u9650 2000 \u5B57\uFF09": "Content too long (limit: 2000 characters)",
  "\u5DE5\u5177\u6A21\u5F0F\u5FC5\u987B\u586B\u5199\u8981\u6267\u884C\u7684\u547D\u4EE4\uFF08\u5982 python C:/scripts/report.py\uFF09\uFF0C\u6216\u586B\u5199 AI \u811A\u672C\u63CF\u8FF0\u8BCD": "Command mode requires a command to run (e.g. python C:/scripts/report.py), or an AI script prompt",
  "AI \u811A\u672C\u63CF\u8FF0\u8BCD\u8FC7\u957F\uFF08\u4E0A\u9650 2000 \u5B57\uFF09": "AI script prompt too long (limit: 2000 characters)",
  "\u5DE5\u4F5C\u76EE\u5F55\uFF08cwd\uFF09\u5FC5\u987B\u662F\u5B57\u7B26\u4E32": "Working directory (cwd) must be a string",
  "\u7ED3\u679C\u5904\u7406\uFF08resultMode\uFF09\u5FC5\u987B\u662F raw \u6216 ai": "Result handling (resultMode) must be raw or ai",
  "weekdays \u5FC5\u987B\u662F\u975E\u7A7A\u6570\u5B57\u6570\u7EC4": "weekdays must be a non-empty numeric array",
  "weekdays \u5143\u7D20\u5FC5\u987B\u662F 0-6\uFF080=\u5468\u65E5\uFF09": "weekdays entries must be 0-6 (0 = Sunday)",
  "at \u5FC5\u987B\u662F\u5408\u6CD5 ISO \u65F6\u95F4": "at must be a valid ISO time",
  "time \u683C\u5F0F\u5E94\u4E3A HH:mm\uFF08\u4E0A\u6D77\u65F6\u95F4\uFF0C\u5982 09:30\uFF09": "time must look like HH:mm (Shanghai time, e.g. 09:30)",
  "\u672A\u627E\u5230\u8BE5\u5B9A\u65F6\u4EFB\u52A1": "Scheduled task not found",
  "\u672A\u627E\u5230\u8BE5\u5B9A\u65F6\u6D88\u606F": "Scheduled message not found",
  "\u5B9A\u65F6\u4EFB\u52A1\u4E0D\u5B58\u5728\uFF08\u53EF\u80FD\u5DF2\u88AB\u5220\u9664\uFF09": "Scheduled task not found (it may have been removed)",
  "\u5DF2\u6D4B\u8BD5\u53D1\u9001\u4E00\u6B21\uFF08\u4E0D\u8BA1\u5165\u4E3B\u52A8\u6D88\u606F\u914D\u989D\uFF09": "Test sent once (not counted against the proactive-message quota)",
  "\u5DF2\u6D3E\u53D1\uFF08\u73AF\u5883\u65E0\u4F1A\u8BDD\u603B\u7EBF\uFF0C\u65E0\u6CD5\u786E\u8BA4\u6295\u9012\uFF0C\u8BF7\u7A0D\u540E\u67E5\u770B\u804A\u5929\uFF09": "Dispatched (no session bus in this environment; delivery cannot be confirmed \u2014 check the chat later)",
  "\u5DF2\u6D3E\u53D1\uFF08\u65E0 deliveryId\uFF0C\u65E0\u6CD5\u786E\u8BA4\u6295\u9012\uFF0C\u8BF7\u7A0D\u540E\u67E5\u770B\u804A\u5929\uFF09": "Dispatched (no deliveryId; delivery cannot be confirmed \u2014 check the chat later)",
  // ── 定时任务弹窗（2026-09-10 覆盖检查补齐） ──
  "\u4E00": "Mon",
  "\u4E8C": "Tue",
  "\u4E09": "Wed",
  "\u56DB": "Thu",
  "\u4E94": "Fri",
  "\u516D": "Sat",
  "\u65E5": "Sun",
  "\u5F00": "on",
  "\u5173": "off",
  "\u672C\u673A\u65F6\u533A": "Local time zone",
  "\u6D4B\u8BD5": "Test",
  "\u6D4B\u8BD5\u4E2D\u2026": "Testing\u2026",
  "\u6267\u884C\u5931\u8D25": "Run failed",
  "\u5DF2\u6D4B\u8BD5\u53D1\u9001\u4E00\u6B21": "Test sent once",
  "\u6D4B\u8BD5\u53D1\u9001\u4E00\u6B21\uFF08\u4E0D\u8BA1\u5165\u4E3B\u52A8\u6D88\u606F\u914D\u989D\uFF09": "Send a test once (not counted against the proactive-message quota)",
  "\u8BF7\u586B\u5199 AI \u811A\u672C\u63CF\u8FF0\u8BCD\uFF08\u5982\uFF1A\u6293\u53D6\u67D0\u7F51\u9875\u4ECA\u65E5\u4EF7\u683C\u5E76\u8F93\u51FA\uFF09": "Enter the AI script prompt (e.g. fetch today's price from a webpage and print it)",
  "\u4F8B\u5982\uFF1A\u8BBF\u95EE https://example.com/price \u6293\u53D6\u4ECA\u65E5\u4EF7\u683C\uFF0C\u8F93\u51FA\u4E00\u884C\u300C\u4ECA\u65E5\u4EF7\u683C\uFF1Axx \u5143\u300D": "e.g. fetch today's price from https://example.com/price and print one line like \u201CToday's price: xx yuan\u201D"
});
var en = EN;
var zh = Object.freeze(Object.fromEntries(
  Object.keys(EN).map((key) => [key, key === "$locale" ? "zh" : key])
));
var translate = (key) => key;
function setTranslator(next) {
  translate = typeof next === "function" ? next : (key) => key;
}
function isEnglish() {
  return translate("$locale") === "en";
}
function translateDynamic(text) {
  let m;
  m = /^保存失败：([\s\S]+)$/.exec(text);
  if (m) return `Save failed: ${localizeText(m[1])}`;
  m = /^操作失败：([\s\S]+)$/.exec(text);
  if (m) return `Operation failed: ${localizeText(m[1])}`;
  m = /^删除失败：([\s\S]+)$/.exec(text);
  if (m) return `Removal failed: ${localizeText(m[1])}`;
  m = /^重试失败：([\s\S]+)$/.exec(text);
  if (m) return `Retry failed: ${localizeText(m[1])}`;
  m = /^检查失败：([\s\S]+)$/.exec(text);
  if (m) return `Check failed: ${localizeText(m[1])}`;
  m = /^更新失败：([\s\S]+)$/.exec(text);
  if (m) return `Update failed: ${localizeText(m[1])}`;
  m = /^测试发送失败：([\s\S]+)$/.exec(text);
  if (m) return `Test send failed: ${localizeText(m[1])}`;
  m = /^上次生成失败：([\s\S]+)$/.exec(text);
  if (m) return `Last generation failed: ${localizeText(m[1])}`;
  m = /^归档读取失败：(.+)（可直接粘贴 openid）$/.exec(text);
  if (m) return `Archive read failed: ${localizeText(m[1])} (you can paste an openid directly)`;
  m = /^上次失败：([\s\S]+)$/.exec(text);
  if (m) return `Last failed: ${localizeText(m[1])}`;
  m = /^已配置机器人（(\d+)）$/.exec(text);
  if (m) return `Configured bots (${m[1]})`;
  m = /^扫码成功，AppID (.+) 已启用$/.exec(text);
  if (m) return `QR link succeeded; AppID ${m[1]} is enabled`;
  m = /^凭据已保存，AppID (.+) 已启用$/.exec(text);
  if (m) return `Credentials saved; AppID ${m[1]} is enabled`;
  m = /^工作区已保存：(.+)（对新建会话生效）$/.exec(text);
  if (m) return `Workspace saved: ${m[1]} (applies to new sessions)`;
  m = /^确定删除机器人 (.+)？删除后该机器人停止接收消息。$/.exec(text);
  if (m) return `Remove bot ${m[1]}? It will stop receiving messages after removal.`;
  m = /^QQ 连接未就绪：(.+)。插件会自动重试。$/.exec(text);
  if (m) return `QQ connection not ready: ${m[1]}. The plugin will retry automatically.`;
  m = /^(扫码接入|手动填写) · 保存于 (.+)$/.exec(text);
  if (m) return `${localizeText(m[1])} \xB7 saved at ${m[2]}`;
  m = /^保存于 (.+)$/.exec(text);
  if (m) return `Saved at ${m[1]}`;
  m = /^([\d.]+) 分钟$/.exec(text);
  if (m) return `${m[1]} min`;
  m = /^([\d.]+) 秒$/.exec(text);
  if (m) return `${m[1]} s`;
  m = /^(\d+) 分$/.exec(text);
  if (m) return `${m[1]} pt`;
  m = /^(\d+) 条$/.exec(text);
  if (m) return `${m[1]} msgs`;
  m = /^(\d+) 字$/.exec(text);
  if (m) return `${m[1]} chars`;
  m = /^(\d+) 条\/天$/.exec(text);
  if (m) return `${m[1]}/day`;
  m = /^每天 (\d{1,2}:\d{2})$/.exec(text);
  if (m) return `Daily at ${m[1]}`;
  m = /^每 (\d+) 分钟$/.exec(text);
  if (m) return `Every ${m[1]} min`;
  m = /^下次发送 (.+)$/.exec(text);
  if (m) return `Next send: ${m[1]}`;
  m = /^群 (.+) 的覆盖配置已保存（立即生效）$/.exec(text);
  if (m) return `Override for group ${m[1]} saved (takes effect immediately)`;
  m = /^确定删除群 (.+) 的覆盖配置？删除后该群恢复使用机器人默认配置。$/.exec(text);
  if (m) return `Delete the override for group ${m[1]}? That group will fall back to the bot's default config.`;
  m = /^全量回复 (开|关)$/.exec(text);
  if (m) return `Full reply ${m[1] === "\u5F00" ? "on" : "off"}`;
  m = /^阈值 (\d+)$/.exec(text);
  if (m) return `Threshold ${m[1]}`;
  m = /^上下文 (\d+) 条$/.exec(text);
  if (m) return `Context ${m[1]} msgs`;
  m = /^群冷却 不限制$/.exec(text);
  if (m) return "Group cooldown: no limit";
  m = /^群冷却 ([\d.]+) (分钟|秒)$/.exec(text);
  if (m) return `Group cooldown ${m[1]} ${m[2] === "\u5206\u949F" ? "min" : "s"}`;
  m = /^同人冷却 不限制$/.exec(text);
  if (m) return "Sender cooldown: no limit";
  m = /^同人冷却 ([\d.]+) (分钟|秒)$/.exec(text);
  if (m) return `Sender cooldown ${m[1]} ${m[2] === "\u5206\u949F" ? "min" : "s"}`;
  m = /^分片 (\d+)$/.exec(text);
  if (m) return `Chunk ${m[1]}`;
  m = /^回复上限 (\d+)$/.exec(text);
  if (m) return `Max ${m[1]} replies`;
  m = /^Markdown (开|关)$/.exec(text);
  if (m) return `Markdown ${m[1] === "\u5F00" ? "on" : "off"}`;
  m = /^记忆 (开|关)$/.exec(text);
  if (m) return `Memory ${m[1] === "\u5F00" ? "on" : "off"}`;
  m = /^敏感词 (\d+) 个$/.exec(text);
  if (m) return `${m[1]} banned words`;
  m = /^聊天 Preset (.+)$/.exec(text);
  if (m) return `Chat preset ${m[1]}`;
  m = /^共 (\d+) 个候选，输入关键词继续过滤$/.exec(text);
  if (m) return `${m[1]} candidates \u2014 type to filter more`;
  m = /^群聊 · 最近发言成员：(.+)$/.exec(text);
  if (m) return `Group \xB7 recent speaker: ${m[1]}`;
  m = /^群 id：(.+)$/.exec(text);
  if (m) return `Group id: ${m[1]}`;
  m = /^用户 id：(.+)$/.exec(text);
  if (m) return `User id: ${m[1]}`;
  m = /^(.+?)（成员 (.+?)）$/.exec(text);
  if (m) return `${localizeText(m[1])} (member: ${m[2]})`;
  m = /^(群|用户) (.+)$/.exec(text);
  if (m) return `${m[1] === "\u7FA4" ? "Group" : "User"} ${m[2]}`;
  m = /^（AI 生成中）([\s\S]+)$/.exec(text);
  if (m) return `(AI generating) ${m[1]}`;
  m = /^已生成脚本：(.+?)。修改描述词并保存会重新生成。$/.exec(text);
  if (m) return `Generated script: ${m[1]}. Edit the prompt and save to regenerate.`;
  m = /^共 (\d+) 条（每个群\/单聊最多 (\d+) 条）$/.exec(text);
  if (m) return `${m[1]} in total (max ${m[2]} per chat)`;
  m = /^所有机器人共 (\d+) 条（每个群\/单聊最多 (\d+) 条）$/.exec(text);
  if (m) return `All bots: ${m[1]} in total (max ${m[2]} per chat)`;
  m = /^已显示最近 (\d+) 条（更早记录仍在归档文件里）$/.exec(text);
  if (m) return `Showing latest ${m[1]} (older records remain in the archive files)`;
  m = /^共 (\d+) 条$/.exec(text);
  if (m) return `${m[1]} in total`;
  m = /^所有机器人共 (\d+) 条$/.exec(text);
  if (m) return `All bots: ${m[1]} in total`;
  m = /^共 (\d+) 条记录$/.exec(text);
  if (m) return `${m[1]} record(s) in total`;
  m = /^(\d+) 分钟$/.exec(text);
  if (m) return `${m[1]} min`;
  m = /^(\d+) 小时$/.exec(text);
  if (m) return `${m[1]} h`;
  m = /^该任务归属机器人 (.+)$/.exec(text);
  if (m) return `This task belongs to bot ${m[1]}`;
  m = /^每 (\d+) 小时$/.exec(text);
  if (m) return `Every ${m[1]} h`;
  m = /^一次性 (.+)$/.exec(text);
  if (m) return `Once at ${m[1]}`;
  m = /^下次运行：(.+)$/.exec(text);
  if (m) return `Next run: ${m[1]}`;
  m = /^下次 (.+)$/.exec(text);
  if (m) return `Next: ${localizeText(m[1])}`;
  m = /^当前：(.+)$/.exec(text);
  if (m) return `Current: ${localizeText(m[1])}`;
  m = /^本机时区 · (.+)$/.exec(text);
  if (m) return `Local time zone \xB7 ${m[1]}`;
  m = /^(\d+) 分$/.exec(text);
  if (m) return `${m[1]}m`;
  m = /^(\d+) 条记录$/.exec(text);
  if (m) return `${m[1]} record(s)`;
  m = /^删除 (.+) 归档$/.exec(text);
  if (m) return `Delete the ${m[1]} archive`;
  m = /^确定删除 (.+) 的归档记录？此机器人该天的记录将被清除，其他机器人的记录保留。$/.exec(text);
  if (m) return `Delete the ${m[1]} archive records? This bot's records for that day are cleared; other bots' records are kept.`;
  m = /^暂无新版本（当前 v(.+) 已是最新）$/.exec(text);
  if (m) return `No new version (v${m[1]} is the latest)`;
  m = /^发现新版本 v(.+)，正在自动更新…$/.exec(text);
  if (m) return `New version v${m[1]} found; updating automatically\u2026`;
  m = /^已自动更新到 v(.+)（备份于安装目录 \.update-backup\/），重启 DSH 后生效$/.exec(text);
  if (m) return `Updated to v${m[1]} (old files backed up in .update-backup/ inside the install directory). Restart DSH to take effect.`;
  m = /^未找到机器人 (.+)$/.exec(text);
  if (m) return `Bot not found: ${m[1]}`;
  m = /^目录不存在: (.+)$/.exec(text);
  if (m) return `Directory does not exist: ${m[1]}`;
  m = /^不是目录: (.+)$/.exec(text);
  if (m) return `Not a directory: ${m[1]}`;
  m = /^无法读取目录: (.+)$/.exec(text);
  if (m) return `Cannot read directory: ${localizeText(m[1])}`;
  m = /^未找到该定时消息（序号 1-(\d+)）$/.exec(text);
  if (m) return `Scheduled message not found (index 1-${m[1]})`;
  m = /^每个群\/单聊最多 (\d+) 条定时任务$/.exec(text);
  if (m) return `Max ${m[1]} scheduled tasks per group/DM`;
  m = /^机器人 (.+) 不可用（已删除或未启用）$/.exec(text);
  if (m) return `Bot ${m[1]} is unavailable (removed or disabled)`;
  m = /^保存未生效：群 (.+) 的覆盖未写入配置，请重试$/.exec(text);
  if (m) return `Save did not take effect: the override for group ${m[1]} was not written; please retry`;
  m = /^会话 (.+)$/.exec(text);
  if (m) return `Session ${m[1]}`;
  m = /^周([一二三四五六日\d、]+)$/.exec(text);
  if (m) {
    const wd = { "\u4E00": "Mon", "\u4E8C": "Tue", "\u4E09": "Wed", "\u56DB": "Thu", "\u4E94": "Fri", "\u516D": "Sat", "\u65E5": "Sun", "\u3001": ", " };
    return `Week ${[...m[1]].map((c) => wd[c] ?? c).join("")}`;
  }
  return text;
}
function localizeText(value) {
  if (typeof value !== "string") return value;
  const exact = translate(value);
  if (exact !== value || !isEnglish()) return exact;
  return translateDynamic(value);
}
var LOCALIZED_PROPS = Object.freeze([
  "aria-label",
  "alt",
  "placeholder",
  "title",
  "label"
]);
function localizeChild(child) {
  if (typeof child === "string") return localizeText(child);
  if (Array.isArray(child)) return child.map(localizeChild);
  return child;
}
function h(type, props = {}, ...children) {
  let localizedProps = props;
  if (props) {
    for (const key of LOCALIZED_PROPS) {
      if (typeof props[key] === "string") {
        if (localizedProps === props) localizedProps = { ...props };
        localizedProps[key] = localizeText(props[key]);
      }
    }
  }
  return React.createElement(type, localizedProps, ...children.map(localizeChild));
}
export {
  QQBOT_LOCALE_NAMESPACE,
  en,
  h,
  isEnglish,
  localizeText,
  setTranslator,
  zh
};
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
