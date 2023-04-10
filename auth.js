const _Array = Array;

const _Array_isArray = _Array.isArray;

const _Array_prototype = _Array.prototype;

const _Array_prototype_filter_call = _Array_prototype.filter.call.bind(_Array_prototype.filter);

const _Array_prototype_includes_call = _Array_prototype.includes.call.bind(_Array_prototype.includes);

const _Function = Function;

const _Function_prototype = _Function.prototype;

const _Object = Object;

const _Object_defineProperty = _Object.defineProperty;

const _Object_defineProperties = _Object.defineProperties;

const _Object_getOwnPropertyDescriptors = _Object.getOwnPropertyDescriptors;

const _Object_prototype = _Object.prototype;

const _Object_prototype_hasOwnProperty_call = _Object_prototype.hasOwnProperty.call.bind(_Object_prototype.hasOwnProperty);

const _Object_setPrototypeOf = _Object.setPrototypeOf;

const _Symbol = Symbol;

const _undefined = undefined;

const _Symbol_for = _Symbol.for;

const S_Instance = `Instance`;

const S_instance = `instance`;

const PREFIX = S_Instance + `.`;

const S_function$1 = `function`;

const S_object$1 = `object`;

const S_prototype = `prototype`;

const S_value = `value`;

const S_Value$1 = `Value`;

const S_length = `length`;

const S_push = `push`;

const S_splice = `splice`;

const S_returnValue = `return` + S_Value$1;

const S_Property$1 = `Property`;

const S_get$1 = `get`;

const S_set = `set`;

const S_delete = `delete`;

const S_deleteProperty = S_delete + S_Property$1;

const S_defineProperty = `define` + S_Property$1;

const S_modify = `modify`;

const S_beforeInstance = `before` + S_Instance;

const S_change$1 = `change`;

const S_destroy = `destroy`;

const S___id__ = `__id__`;

const S___type__$1 = `__type__`;

const SYMBOL_EVENT_HANDLERS = _Symbol_for(PREFIX + `eventHandlers`);

const isClassOrFunctionConstructor = fn => typeof fn === S_function$1 && _Object_prototype_hasOwnProperty_call(fn, S_prototype);

const _null = null;

const isNullOrUndefined = value => value === _null || value === _undefined;

const _Object_getPrototypeOf = _Object.getPrototypeOf;

const setProto = (instance, __type__, prototype = __type__?.prototype) => {
  if (instance && prototype && _Object_getPrototypeOf(instance) !== prototype) {
    _Object_setPrototypeOf(instance, prototype);
  }
};

const throwError = message => {
  throw Error(message);
};

const getConstructor = (instance, prototype) => instance && (prototype = _Object_getPrototypeOf(instance)) && prototype.constructor;

const findType = instance => _Object_prototype_hasOwnProperty_call(instance, S___type__$1) ? instance.__type__ : getConstructor(instance);

const _Object_create = _Object.create;

const _BigInt = BigInt;

const _Date = Date;

const _Math = Math;

const TIMESTAMP_START = _Date.UTC(2020);

let c = crypto;

let random = c.getRandomValues(new BigUint64Array(1))[0];

let birthplace = random << 20n;

let millisecond;

let counter = 0n;

const sid = () => {
  let now = _Date.now();
  return (_BigInt(now - TIMESTAMP_START) << 84n) + birthplace + ((now === millisecond ? ++counter : (millisecond = now, 
  counter = 0n)) << 8n) + _BigInt(_Math.floor(_Math.random() * 256));
};

var C = {};

var R = {};

const dispatch$1 = function(evt, instance = this, handlersByEvent, handler) {
  do {
    if (_Object_prototype_hasOwnProperty_call(instance, SYMBOL_EVENT_HANDLERS) && (handlersByEvent = instance[SYMBOL_EVENT_HANDLERS]?.[evt.type])) {
      for (handler of handlersByEvent.slice()) {
        handler(evt);
      }
    }
  } while ((instance = _Object_getPrototypeOf(instance)) && instance !== _Object_prototype);
  return evt;
};

const off = function(name, fn, instance = this, handlers, handlersByEvent, index) {
  if (_Object_prototype_hasOwnProperty_call(instance, SYMBOL_EVENT_HANDLERS) && (handlers = instance[SYMBOL_EVENT_HANDLERS]) && (handlersByEvent = handlers[name]) && (index = handlersByEvent.indexOf(fn), 
  index !== -1)) {
    handlersByEvent.splice(index, 1);
  }
};

const on = function(name, fn, instance = this, handlers, handlersByEvent) {
  if (!_Object_prototype_hasOwnProperty_call(instance, SYMBOL_EVENT_HANDLERS)) {
    _Object_defineProperty(instance, SYMBOL_EVENT_HANDLERS, {
      value: _Object_create(_null)
    });
  }
  handlers = instance[SYMBOL_EVENT_HANDLERS];
  handlersByEvent = handlers[name] = handlers[name] || [];
  if (!handlersByEvent.includes(fn)) {
    handlersByEvent.push(fn);
  }
};

const EventTarget = function(instance) {
  instance.on = instance.addEventListener = on;
  instance.off = instance.removeEventListener = off;
  instance.dispatchEvent = instance.dispatch = instance.trigger = dispatch$1;
};

EventTarget(EventTarget.prototype);

const get = function(propertyName, instance = this, __type__ = findType(instance), event) {
  event = dispatch$1({
    type: S_get$1,
    detail: {
      __type__: __type__,
      instance: instance,
      property: propertyName
    }
  }, instance);
  return _Object_prototype_hasOwnProperty_call(event, S_returnValue) ? event.returnValue : (instance.__proxyTarget__ || instance)[propertyName];
};

const set = function(propertyName, value, instance = this, _skipChange, __type__ = findType(instance), previousValue = instance[propertyName], event, returnValue) {
  event = dispatch$1({
    type: S_set,
    detail: {
      __type__: __type__,
      instance: instance,
      property: propertyName,
      previousValue: previousValue,
      value: value
    }
  }, instance);
  returnValue = event.returnValue;
  value = returnValue?.value ?? value;
  (instance.__proxyTarget__ || instance)[propertyName] = value;
  dispatch$1({
    type: S_modify,
    detail: {
      __type__: __type__,
      instance: instance,
      property: propertyName,
      previousValue: previousValue,
      value: value
    }
  }, instance);
  if (!_skipChange && previousValue !== value) {
    dispatch$1({
      type: S_change$1,
      detail: {
        __type__: __type__,
        instance: instance,
        changes: new Map([ [ propertyName, {
          to: value,
          from: previousValue
        } ] ]),
        added: [ value ],
        removed: isNullOrUndefined(previousValue) ? [] : [ previousValue ]
      }
    }, instance);
  }
  return value;
};

const defineProperty = function(propertyName, descriptor, instance = this, _skipChange, __type__ = findType(instance), value, previousValue = instance[propertyName], event, returnValue) {
  event = dispatch$1({
    type: S_defineProperty,
    detail: {
      __type__: __type__,
      instance: instance,
      property: propertyName,
      descriptor: descriptor
    }
  }, instance);
  returnValue = event.returnValue;
  instance = returnValue?.instance || instance;
  propertyName = returnValue?.property ?? propertyName;
  descriptor = returnValue?.descriptor || descriptor;
  if (_Object_prototype_hasOwnProperty_call(descriptor, S_value)) {
    value = descriptor.value;
  } else if (_Object_prototype_hasOwnProperty_call(descriptor, S_get$1)) {
    value = descriptor.get.call(instance);
  } else ;
  _Object_defineProperty(instance.__proxyTarget__ || instance, propertyName, descriptor);
  dispatch$1({
    type: S_modify,
    detail: {
      __type__: __type__,
      instance: instance,
      property: propertyName,
      descriptor: descriptor,
      previousValue: previousValue,
      value: value
    }
  }, instance);
  if (!_skipChange && previousValue !== value) {
    dispatch$1({
      type: S_change$1,
      detail: {
        __type__: __type__,
        instance: instance,
        changes: new Map([ [ propertyName, {
          to: value,
          from: previousValue
        } ] ]),
        added: [ value ],
        removed: isNullOrUndefined(previousValue) ? [] : [ previousValue ]
      }
    }, instance);
  }
  return instance;
};

const deleteProperty = function(propertyName, instance = this, _skipChange, __type__ = findType(instance), previousValue = instance[propertyName], response, event, returnValue) {
  event = dispatch$1({
    type: S_deleteProperty,
    detail: {
      __type__: __type__,
      instance: instance,
      property: propertyName,
      previousValue: previousValue
    }
  }, instance);
  returnValue = event.returnValue;
  instance = returnValue?.instance || instance;
  propertyName = returnValue?.property ?? propertyName;
  response = delete (instance.__proxyTarget__ || instance)[propertyName];
  dispatch$1({
    type: S_modify,
    detail: {
      __type__: __type__,
      instance: instance,
      property: propertyName,
      previousValue: previousValue
    }
  }, instance);
  if (!_skipChange) {
    dispatch$1({
      type: S_change$1,
      detail: {
        __type__: __type__,
        instance: instance,
        changes: new Map([ [ propertyName, {
          from: previousValue
        } ] ]),
        added: [],
        removed: [ previousValue ]
      }
    }, instance);
  }
  return response;
};

const assign$1 = function(properties, instance = this, _skipChange, propertyName, previousValue, value, changes = new Map) {
  for (propertyName in properties) {
    if (!_Object_prototype_hasOwnProperty_call(properties, propertyName)) {
      continue;
    }
    previousValue = instance[propertyName];
    value = set(propertyName, properties[propertyName], instance, 1);
    if (previousValue !== value) {
      changes.set(propertyName, {
        to: value,
        from: previousValue
      });
    }
  }
  if (!_skipChange && changes.size) {
    dispatch$1({
      type: S_change$1,
      detail: {
        __type__: findType(instance),
        instance: instance,
        changes: changes,
        added: [],
        removed: []
      }
    }, instance);
  }
};

const destroy = function(instance = this, _skipChange, __type__ = findType(instance), isArray, i, removed = [], changes = new Map) {
  dispatch$1({
    type: S_destroy,
    detail: {
      __type__: __type__,
      instance: instance
    }
  }, instance);
  if (isArray = _Array_isArray(instance)) {
    for (i = instance.length - 1; i >= 0; i--) {
      removed.push(instance[i]);
      changes.set(i, {
        from: instance[i]
      });
      deleteProperty(i, instance, 1);
    }
    set(S_length, 0, instance);
  }
  for (i in instance) {
    if (_Object_prototype_hasOwnProperty_call(instance, i) && i !== S___type__$1) {
      if (!isArray) {
        removed.push(instance[i]);
        changes.set(i, {
          from: instance[i]
        });
      }
      deleteProperty(i, instance, 1);
    }
  }
  deleteProperty(S___type__$1, instance, 1);
  if (!_skipChange) {
    dispatch$1({
      type: S_change$1,
      detail: {
        __type__: __type__,
        instance: instance,
        changes: changes,
        added: [],
        removed: removed
      }
    }, instance);
  }
  return instance;
};

let Instance$1;

let Instance_prototype$3;

Instance$1 = function Instance(properties, _this = this, __id__ = properties?.__id__, instance = __id__ && C[__id__], instanceFoundInCache = instance, __type__, beforeInstanceEvent, returnValue, i) {
  {
    beforeInstanceEvent = dispatch$1({
      type: S_beforeInstance,
      detail: {
        properties: properties,
        instance: instance,
        this: _this
      }
    }, Instance_prototype$3);
  }
  returnValue = beforeInstanceEvent.returnValue;
  __type__ = returnValue?.__type__ || properties?.__type__ || new.target || Instance;
  instance = returnValue?.instance || instance || _this !== globalThis && _this || _Object_create(__type__.prototype ? __type__.prototype : Instance_prototype$3);
  if (returnValue?.initialized || instance && instanceFoundInCache === instance) {
    properties && !returnValue?.noAssign && assign$1(properties, instance);
    return instance;
  }
  __type__ = __type__.__proxy__ || __type__;
  if (globalThis.__proxy__) {
    i = instance.__proxyTarget__ = instance;
    instance = new Proxy(instance, {
      get(instance, propertyName) {
        return get(propertyName, instance);
      },
      set(instance, propertyName, value) {
        set(propertyName, value, instance);
        return true;
      },
      defineProperty(instance, propertyName, descriptor) {
        defineProperty(propertyName, descriptor, instance);
        return true;
      },
      deleteProperty(instance, propertyName) {
        deleteProperty(propertyName, instance);
        return true;
      }
    });
    i.__proxy__ = instance;
    if (i.prototype && i.prototype.constructor) {
      i.prototype.constructor = instance;
    }
  }
  setProto(instance, isClassOrFunctionConstructor(__type__) ? __type__ : Instance);
  instance.__type__ = __type__;
  if (!__id__) {
    instance.__id__ = __id__ = sid().toString(32);
  }
  C[__id__] = instance;
  dispatch$1({
    type: S_instance,
    detail: {
      __type__: __type__,
      properties: properties,
      instance: instance
    }
  }, Instance_prototype$3);
  properties && (delete properties.__type__, assign$1(properties, instance));
  return instance;
};

Instance$1.C = C;

Instance$1.R = R;

Instance$1.EventTarget = EventTarget;

Instance$1.sid = sid;

Instance_prototype$3 = Instance$1.prototype;

Instance_prototype$3.get = get;

Instance_prototype$3.set = set;

Instance_prototype$3.defineProperty = defineProperty;

Instance_prototype$3.deleteProperty = deleteProperty;

Instance_prototype$3.assign = assign$1;

Instance_prototype$3.destroy = destroy;

EventTarget(Instance_prototype$3);

on(S_destroy, ((evt, detail = evt.detail, instance = detail.instance, id = instance.__id__) => {
  if (id) {
    delete C[id];
    delete R[id];
  }
}), Instance_prototype$3);

on(S_set, ((evt, detail = evt.detail, instance = detail.instance, propertyName = detail.property, value = detail.value, id, ref) => {
  if (value && typeof value === S_object$1 && (id = value.__ref__)) {
    if (ref = C[id]) {
      evt.returnValue = evt.returnValue || {};
      evt.returnValue.value = ref;
      return;
    }
    R[id] = R[id] || [];
    R[id].push([ instance, propertyName ]);
  }
}), Instance_prototype$3);

on(S_change$1, ((evt, detail = evt.detail, instance = detail.instance, changes = detail.changes, propertyName, change, value, previousValue, ref, obj2, i) => {
  for ([propertyName, change] of changes) {
    value = change.to;
    previousValue = change.from;
    if (propertyName === S___type__$1) {
      setProto(instance, isClassOrFunctionConstructor(value) ? value : Instance$1);
    } else if (propertyName === S___id__) {
      if (previousValue) {
        delete C[previousValue];
      }
      if (value) {
        C[value] = instance;
        if (R[value]) {
          for (ref of R[value]) {
            obj2 = ref[0];
            if (_Array_isArray(obj2)) {
              i = _Array.prototype.findIndex.call(obj2, (item => item.__ref__ === value));
              i = i === -1 ? _undefined : i;
            } else {
              i = ref[1];
            }
            if (i !== _undefined && obj2[i] !== instance) {
              set(i, instance, obj2);
            }
          }
          delete R[value];
        }
      }
    }
  }
}), Instance_prototype$3);

var Instance$2 = Instance$1;

const append = function(...items) {
  let changes = new Map, _this = this, len = _this.length, argCount = items.length;
  for (let item of items) {
    changes.set(len, {
      to: item
    });
    set(len, item, _this, 1);
    ++len;
  }
  set(S_length, len, _this, 1);
  if (argCount) {
    dispatch$1({
      type: S_change$1,
      detail: {
        instance: _this,
        changes: changes,
        added: items,
        removed: []
      }
    }, _this);
  }
  return len;
};

const prepend = function(...items) {
  let changes = new Map, _this = this, len = _this.length, argCount = items.length, k, j, from, fromPresent, fromValue, to, item;
  if (argCount > 0) {
    k = len;
    while (k > 0) {
      from = k - 1;
      to = k + argCount - 1;
      fromPresent = _Object_prototype_hasOwnProperty_call(_this, from);
      if (fromPresent) {
        fromValue = _this[from];
        changes.set(to, {
          to: fromValue,
          from: _this[to]
        });
        set(to, fromValue, _this, 1);
      } else {
        changes.set(to, {
          from: _this[to]
        });
        deleteProperty(to, _this, 1);
      }
      k = k - 1;
    }
    j = 0;
    for (item of items) {
      changes.set(j, {
        to: item,
        from: _this[j]
      });
      set(j, item, _this, 1);
      j++;
    }
  }
  set(S_length, len + argCount, _this, 1);
  if (argCount) {
    dispatch$1({
      type: S_change$1,
      detail: {
        instance: _this,
        changes: changes,
        added: items,
        removed: []
      }
    }, _this);
  }
  return len + argCount;
};

const removeLast = function() {
  let changes = new Map, _this = this, len = _this.length, newLen, item;
  if (len == 0) {
    set(S_length, 0, _this, 1);
    return undefined;
  } else {
    newLen = len - 1;
    item = _this[newLen];
    changes.set(newLen, {
      from: item
    });
    deleteProperty(newLen, _this, 1);
    set(S_length, newLen, _this, 1);
    dispatch$1({
      type: S_change$1,
      detail: {
        instance: _this,
        changes: changes,
        added: [],
        removed: [ item ]
      }
    }, _this);
    return item;
  }
};

const removeFirst = function() {
  let changes = new Map, _this = this, len = _this.length, first, k, from, fromPresent, fromVal, to;
  if (len == 0) {
    set(S_length, 0, _this, 1);
    return undefined;
  }
  first = _this[0];
  k = 1;
  while (k < len) {
    from = k;
    to = k - 1;
    fromPresent = _Object_prototype_hasOwnProperty_call(_this, from);
    if (fromPresent) {
      fromVal = _this[from];
      changes.set(to, {
        to: fromVal,
        from: _this[to]
      });
      set(to, fromVal, _this, 1);
    } else {
      deleteProperty(to, _this, 1);
    }
    ++k;
  }
  changes.set(len - 1, {
    from: _this[len - 1]
  });
  deleteProperty(len - 1, _this, 1);
  set(S_length, len - 1, _this, 1);
  dispatch$1({
    type: S_change$1,
    detail: {
      instance: _this,
      changes: changes,
      added: [],
      removed: [ first ]
    }
  }, _this);
  return first;
};

const _Number = Number;

const _Math_max = _Math.max;

const _Math_min = _Math.min;

const replace = function(start, deleteCount, ...items) {
  let changes = new Map, _this = this, len = _this.length, relativeStart = _Number(start) || 0, actualStart = relativeStart < 0 ? _Math_max(len + relativeStart, 0) : _Math_min(relativeStart, len), insertCount = items?.length ?? 0, itemCount = insertCount, actualDeleteCount = start === _undefined ? 0 : deleteCount === _undefined ? len - actualStart : _Math_max(0, _Math_min(_Number(deleteCount) || 0, len - actualStart)), A = [], k, from, fromValue, to, item;
  k = 0;
  while (k < actualDeleteCount) {
    from = actualStart + k;
    if (_Object_prototype_hasOwnProperty_call(_this, from)) {
      fromValue = _this[from];
      A[k] = fromValue;
    }
    ++k;
  }
  if (itemCount < actualDeleteCount) {
    k = actualStart;
    while (k < len - actualDeleteCount) {
      from = k + actualDeleteCount;
      to = k + itemCount;
      if (_Object_prototype_hasOwnProperty_call(_this, from)) {
        fromValue = _this[from];
        changes.set(to, {
          to: fromValue,
          from: _this[to]
        });
        set(to, fromValue, _this, 1);
      } else {
        changes.set(to, {
          from: _this[to]
        });
        deleteProperty(to, _this, 1);
      }
      ++k;
    }
    k = len;
    while (k > len - actualDeleteCount + itemCount) {
      changes.set(k - 1, {
        from: _this[k - 1]
      });
      deleteProperty(k - 1, _this, 1);
      --k;
    }
  } else if (itemCount > actualDeleteCount) {
    k = len - actualDeleteCount;
    while (k > actualStart) {
      from = k + actualDeleteCount - 1;
      to = k + itemCount - 1;
      if (_Object_prototype_hasOwnProperty_call(_this, from)) {
        fromValue = _this[from];
        changes.set(to, {
          to: fromValue,
          from: _this[to]
        });
        set(to, fromValue, _this, 1);
      } else {
        changes.set(to, {
          from: _this[to]
        });
        deleteProperty(to, _this, 1);
      }
      --k;
    }
  }
  k = actualStart;
  for (item of items) {
    changes.set(k, {
      to: item,
      from: _this[k]
    });
    set(k, item, _this, 1);
    ++k;
  }
  set(S_length, len - actualDeleteCount + itemCount, _this, 1);
  if (actualDeleteCount > 0 || itemCount > 0) {
    dispatch$1({
      type: S_change$1,
      detail: {
        instance: _this,
        changes: changes,
        added: items,
        removed: A
      }
    }, _this);
  }
  return A;
};

const _Math_floor = _Math.floor;

const flip = function() {
  let changes = new Map, _this = this, len = _this.length, middle = _Math_floor(len / 2), lower = 0, lowerExists, lowerValue, upper, upperExists, upperValue;
  while (lower !== middle) {
    upper = len - lower - 1;
    if (lowerExists = _Object_prototype_hasOwnProperty_call(_this, lower)) {
      lowerValue = _this[lower];
    }
    if (upperExists = _Object_prototype_hasOwnProperty_call(_this, upper)) {
      upperValue = _this[upper];
    }
    if (lowerExists && upperExists) {
      changes.set(lower, {
        to: upperValue,
        from: lowerValue
      });
      changes.set(upper, {
        to: lowerValue,
        from: upperValue
      });
      set(lower, upperValue, _this, 1);
      set(upper, lowerValue, _this, 1);
    } else if (!lowerExists && upperExists) {
      set(lower, upperValue, _this, 1);
      deleteProperty(upper, _this, 1);
    } else if (lowerExists && !upperExists) {
      deleteProperty(lower, _this, 1);
      set(upper, lowerValue, _this, 1);
    }
    ++lower;
  }
  dispatch$1({
    type: S_change$1,
    detail: {
      instance: _this,
      changes: changes,
      added: [],
      removed: []
    }
  }, _this);
  return _this;
};

const order = function(comparefn) {
  let changes = new Map, _this = this, len = _this.length, items = _this.slice(), itemCount, j = 0, to, from;
  _Array_prototype.sort.call(items, comparefn);
  itemCount = items.length;
  while (j < itemCount) {
    from = _this[j];
    to = items[j];
    if (from !== to) {
      changes.set(j, {
        to: to,
        from: from
      });
      set(j, to, _this, 1);
    }
    ++j;
  }
  while (j < len) {
    changes.set(j, {
      to: _undefined,
      from: _this[j]
    });
    deleteProperty(j, _this, 1);
    ++j;
  }
  if (changes.size) {
    dispatch$1({
      type: S_change$1,
      detail: {
        instance: _this,
        changes: changes,
        added: [],
        removed: []
      }
    }, _this);
  }
  return _this;
};

let Collection;

let Collection_prototype$1;

Collection = class Collection extends _Array {
  constructor(array = [], properties, _this, c, i, il) {
    super();
    _this = this;
    properties && assign$1(properties, _this, 1);
    if (globalThis.__proxy__) {
      c = _this.__proxyTarget__ = _this;
      _this = new Proxy(_this, {
        get(c, propertyName) {
          return get(propertyName, c);
        },
        set(c, propertyName, value) {
          set(propertyName, value, c);
          return true;
        },
        deleteProperty(c, propertyName) {
          deleteProperty(propertyName, c);
          return true;
        }
      });
      c.__proxy__ = _this;
    }
    for (i = 0, il = array.length; i < il; i++) {
      set(i, array[i], _this, 1);
    }
    dispatch$1({
      type: S_change$1,
      detail: {
        instance: _this,
        changes: new Map(_this.map(((item, i) => [ i, {
          from: undefined,
          to: item
        } ]))),
        added: _this,
        removed: []
      }
    }, _this);
    return _this;
  }
  static get [_Symbol.species]() {
    return _Array;
  }
};

Collection_prototype$1 = Collection.prototype;

Collection_prototype$1.get = get;

Collection_prototype$1.set = set;

Collection_prototype$1.deleteProperty = deleteProperty;

Collection_prototype$1.assign = assign$1;

Collection_prototype$1.destroy = destroy;

Collection_prototype$1.append = append;

Collection_prototype$1.prepend = prepend;

Collection_prototype$1.removeLast = removeLast;

Collection_prototype$1.removeFirst = removeFirst;

Collection_prototype$1.replace = replace;

Collection_prototype$1.flip = flip;

Collection_prototype$1.order = order;

[ `copyWithin`, `pop`, S_push, `reverse`, `shift`, `sort`, S_splice, `unshift` ].forEach((method => {
  Collection_prototype$1[method] = function(...args) {
    let _this = this, result;
    result = _Array_prototype[method].apply(_this, args);
    dispatch$1({
      type: S_change$1,
      detail: {
        instance: _this,
        changes: new Map,
        added: [],
        removed: []
      }
    }, _this);
    return result;
  };
}));

EventTarget(Collection_prototype$1);

on(S_set, ((evt, detail = evt.detail, instance = detail.instance, propertyName = detail.property, value = detail.value, id, ref) => {
  if (value && typeof value === S_object$1 && (id = value.__ref__)) {
    if (ref = C[id]) {
      evt.returnValue = evt.returnValue || {};
      evt.returnValue.value = ref;
      return;
    }
    R[id] = R[id] || [];
    R[id].push([ instance, propertyName ]);
  }
}), Collection_prototype$1);

var Collection$1 = Collection;

const S_alization = `alization`;

const S_owned = "owned";

const S_Value = "Value";

const S_Element = "Element";

const S_dElement = "d" + S_Element;

const S___type__ = "__type__";

const S_Name = "Name";

const S_name = "name";

const S_ackage = "ackage";

const S_Package = "P" + S_ackage;

const S_package = "p" + S_ackage;

const S_packagedElement = S_package + S_dElement;

const S_Type = "Type";

const S_Class = "Class";

const S_ownedAttribute = S_owned + "Attribute";

const S_Model = "Model";

const S_ifier = "ifier";

const S_Classifier = S_Class + S_ifier;

const S_isAbstract = "isAbstract";

const S_Interface = "Interface";

const S_interface = "interface";

const S_Realization = "Re" + S_alization;

const S_InterfaceRealization = S_Interface + S_Realization;

const S_interfaceRealization = S_interface + S_Realization;

const S_implementingClassifier = "implementing" + S_Classifier;

const S_contract = "contract";

const S_PrimitiveType = "Primitive" + S_Type;

const S_globalName = "global" + S_Name;

const S___primitive__ = `__primitive__`;

const S_string = "string";

const S_number = "number";

const S_bigint = "bigint";

const S_function = "function";

const S_object = "object";

const S_UnlimitedNatural = "UnlimitedNatural";

const S_numeration = "numeration";

const S_Enumeration = "E" + S_numeration;

const S_Generalization = "Gener" + S_alization;

const S_generalization = "gener" + S_alization;

const S_general = "general";

const S_specific = "specific";

const S_roperty = "roperty";

const S_Property = "P" + S_roperty;

const S_defaultValue = "default" + S_Value;

const S_primary = "primary";

const S_foreign = "foreign";

const findGeneral = classifier => {
  let generalization = classifier.generalization, general;
  if (generalization) {
    general = generalization.general;
  } else if ((generalization = getConstructor(classifier.prototype)) && generalization !== _Function && generalization !== _Object && generalization !== Instance$2 && isClassOrFunctionConstructor(generalization)) {
    general = generalization;
  }
  return general;
};

const findGeneralChain = classifier => {
  if (!classifier) return [];
  let general = classifier, generalChain = [ general ];
  while (general = findGeneral(general)) {
    generalChain.push(general);
  }
  return generalChain;
};

const SYMBOL_INHERITANCE_TREE = _Symbol_for(`Metamodel.inheritanceTree`);

const findInheritanceTree = (classifier, generalChain) => {
  let tree, inserted, interfaceRealizationList, interfaceRealization, aInterface, interfaceGeneralChain, interfaceGeneral, general, i, il, k, kl, l, level, previous, classifierProxyTarget;
  classifierProxyTarget = classifier.__proxyTarget__ || classifier;
  classifier = classifier.__proxy__ || classifier;
  if (!(tree = classifierProxyTarget[SYMBOL_INHERITANCE_TREE])) {
    tree = [];
    inserted = new Map;
    generalChain = generalChain || findGeneralChain(classifier);
    for (i = 0, il = generalChain.length; i < il; i++) {
      general = generalChain[i];
      tree[i] = tree[i] || [];
      tree[i].unshift(general);
      if ((interfaceRealizationList = general?.interfaceRealization) && (interfaceRealizationList = interfaceRealizationList.slice())) {
        (l = interfaceRealizationList.length) && interfaceRealizationList.sort(((a, b) => _Number(_BigInt(a.order || l) - _BigInt(b.order || l))));
        for (interfaceRealization of interfaceRealizationList) {
          if ((aInterface = interfaceRealization?.contract) && (interfaceGeneralChain = findGeneralChain(aInterface))) {
            for (k = 0, kl = interfaceGeneralChain.length; k < kl; k++) {
              interfaceGeneral = interfaceGeneralChain[k];
              level = i + k;
              previous = inserted.get(interfaceGeneral);
              tree[level] = tree[level] || [];
              if (!previous) {
                tree[level].push(interfaceGeneral);
                inserted.set(interfaceGeneral, level);
              } else if (previous > level) {
                tree[previous].splice(tree[previous].indexOf(interfaceGeneral), 1);
                tree[level].push(interfaceGeneral);
                inserted.set(interfaceGeneral, level);
              }
            }
          }
        }
      }
    }
    classifierProxyTarget[SYMBOL_INHERITANCE_TREE] = tree;
  }
  return tree;
};

findInheritanceTree.i = classifier => {
  if (!classifier) return;
  let items, item;
  (classifier.__proxyTarget__ || classifier)[SYMBOL_INHERITANCE_TREE] = 0;
  if (items = classifier.specialization) {
    for (item of items) {
      findInheritanceTree.i(item.specific);
    }
  }
  if (items = classifier.interfaceImplementation) {
    for (item of items) {
      findInheritanceTree.i(item.implementingClassifier);
    }
  }
};

const SYMBOL_ATTRIBUTES = _Symbol_for(`Metamodel.attributes`);

const computeAttributes = classifier => {
  if (!classifier) return {};
  let attributes, c, ownedAttributeList, property, name;
  if (!(attributes = classifier[SYMBOL_ATTRIBUTES])) {
    attributes = {};
    for (c of findInheritanceTree(classifier).flat()) {
      if (ownedAttributeList = c.ownedAttribute) {
        for (property of ownedAttributeList) {
          (name = property?.name) && !attributes[name] && (attributes[name] = property);
        }
      }
    }
    (classifier.__proxyTarget__ || classifier)[SYMBOL_ATTRIBUTES] = attributes;
  }
  return attributes;
};

computeAttributes.i = classifier => {
  if (!classifier) return;
  let items, item;
  (classifier.__proxyTarget__ || classifier)[SYMBOL_ATTRIBUTES] = 0;
  if (items = classifier.specialization) {
    for (item of items) {
      computeAttributes.i(item.specific);
    }
  }
  if (items = classifier.interfaceImplementation) {
    for (item of items) {
      computeAttributes.i(item.implementingClassifier);
    }
  }
};

const findAttribute$1 = function(name, classifier = this) {
  return computeAttributes(classifier)[name];
};

const findPrimaryIdentifier = (classifier, c, identifierList, primaryIdentifier) => {
  for (c of findInheritanceTree(classifier).flat()) {
    if (c && (identifierList = c.identifier) && (primaryIdentifier = identifierList.find((i => i.type === S_primary)))) {
      return primaryIdentifier;
    }
  }
};

const findIdentifierPropertyNames = (identifier, names = [], identifierPropertyList, identifierProperty, property, il) => {
  if (identifierPropertyList = identifier?.identifierProperty) {
    il = identifierPropertyList.length;
    if (il > 1) {
      identifierPropertyList.sort(((a, b) => (a.order || il) - (b.order || il)));
    }
    for (identifierProperty of identifierPropertyList) {
      (property = identifierProperty.property) && property.name && names.push(property.name);
    }
  }
  return names;
};

const _JSON = JSON;

const _JSON_parse = _JSON.parse;

const DELIMITER$1 = `--`;

const fromIdString = (id, identifier) => {
  let name, Type, i, il, parts, part, identifierPropertyList, identifierProperty, property, idObject = {};
  if (id && (parts = id.split(DELIMITER$1)) && identifier && (identifierPropertyList = identifier.identifierProperty) && (il = identifierPropertyList.length) && il === parts.length) {
    if (il > 1) {
      identifierPropertyList.sort(((a, b) => (a.order || il) - (b.order || il)));
    }
    for (i = 0; i < il; i++) {
      if ((identifierProperty = identifierPropertyList[i]) && (property = identifierProperty.property) && (name = property.name) && (Type = property.type) && (part = parts[i])) {
        part = _JSON_parse(`"${part.replace(/~-~/g, `-`)}"`);
        part = Type(part);
        idObject[name] = part;
      } else {
        return;
      }
    }
    return idObject;
  }
};

const _JSON_stringify = _JSON.stringify;

const DELIMITER = `--`;

const toIdString = (instance, identifier) => {
  let name, i, il, parts = [], identifierPropertyList, identifierProperty, property, value, typeOfValue;
  if (identifier && (identifierPropertyList = identifier.identifierProperty) && (il = identifierPropertyList.length)) {
    if (il > 1) {
      identifierPropertyList.sort(((a, b) => (a.order || il) - (b.order || il)));
    }
    for (i = 0; i < il; i++) {
      if ((identifierProperty = identifierPropertyList[i]) && (property = identifierProperty.property) && (name = property.name) && _Object_prototype_hasOwnProperty_call(instance, name) && !isNullOrUndefined(instance[name])) {
        value = instance[name];
        typeOfValue = typeof value;
        value = _JSON_stringify(value);
        parts.push(typeOfValue === S_string || typeOfValue === S_bigint ? value.substring(1, value.length - 1).replace(/-/g, `~-~`) : value);
      } else {
        return;
      }
    }
    return parts.join(DELIMITER);
  }
};

const mirrorProperty = (to, toName, from, fromName) => {
  let toHasOwnProperty = _Object_prototype_hasOwnProperty_call(to, toName);
  if (!from || !fromName || !_Object_prototype_hasOwnProperty_call(from, fromName)) {
    if (toHasOwnProperty) {
      deleteProperty(toName, to);
    }
  } else {
    if (!toHasOwnProperty || toHasOwnProperty && to[toName] !== from[fromName]) {
      set(toName, from[fromName], to);
    }
  }
};

const mirrorIdentifier = (to, toIdentifier, from, fromIdentifier) => {
  let toIdentifierPropertyNames = findIdentifierPropertyNames(toIdentifier), fromIdentifierPropertyNames = findIdentifierPropertyNames(fromIdentifier), i, il;
  for (i = 0, il = toIdentifierPropertyNames.length; i < il; i++) {
    mirrorProperty(to, toIdentifierPropertyNames[i], from, fromIdentifierPropertyNames[i]);
  }
};

const SYMBOL_CACHE_PRIMARY_IDENTIFIER = _Symbol_for(`Metamodel.cache.primary`);

const addOrRemoveFromPrimaryCache = (__type__, instance, primaryId, shouldRemove, classifiers, classifier) => {
  if (primaryId) {
    classifiers = findInheritanceTree(__type__).flat();
    for (classifier of classifiers) {
      let primaryCache = _Object_prototype_hasOwnProperty_call(classifier, SYMBOL_CACHE_PRIMARY_IDENTIFIER) ? classifier[SYMBOL_CACHE_PRIMARY_IDENTIFIER] : classifier[SYMBOL_CACHE_PRIMARY_IDENTIFIER] = {};
      if (shouldRemove) {
        delete primaryCache[primaryId];
      } else {
        primaryCache[primaryId] = instance.__proxy__ || instance;
      }
    }
  }
};

const SYMBOL_INDEX = _Symbol_for(`Metamodel.index`);

const addOrRemoveFromIndex = (identifier, instance, id, shouldRemove) => {
  if (!identifier || !id) {
    return;
  }
  let indexes = _Object_prototype_hasOwnProperty_call(identifier, SYMBOL_INDEX) ? identifier[SYMBOL_INDEX] : identifier[SYMBOL_INDEX] = {}, index, i;
  index = indexes[id] = indexes[id] || [];
  instance = instance.__proxy__ || instance;
  if (shouldRemove) {
    i = index.indexOf(instance);
    if (i !== -1) {
      index.splice(i, 1);
    }
  } else {
    if (!index.includes(instance)) {
      index.push(instance);
    }
  }
};

const isMany$1 = upperValue => upperValue > 1 || upperValue === `*`;

const findOpposite = (property, association = property.association) => {
  let opposite, memberEndList, first, second;
  if ((memberEndList = association?.memberEnd) && memberEndList.length > 1) {
    first = memberEndList[0];
    second = memberEndList[1];
    if (first === property) {
      opposite = second;
    } else if (second === property) {
      opposite = first;
    } else {
      if (first.name !== property.name) {
        opposite = first;
      } else if (second.name !== property.name) {
        opposite = second;
      } else ;
    }
  }
  return opposite;
};

get.call.bind(get);

set.call.bind(set);

deleteProperty.call.bind(deleteProperty);

defineProperty.call.bind(defineProperty);

assign$1.call.bind(assign$1);

destroy.call.bind(destroy);

const Collection_append = append.call.bind(append);

prepend.call.bind(prepend);

removeFirst.call.bind(removeFirst);

removeLast.call.bind(removeLast);

const Collection_replace = replace.call.bind(replace);

order.call.bind(order);

flip.call.bind(flip);

const updateProperty = (property, instance, value, isDelete) => {
  let propertyName, valueIsNullOrUndefined, hasTheOwnProperty, isInstancePropertyEqualToValue, index;
  if (property && instance && (propertyName = property.name)) {
    valueIsNullOrUndefined = isNullOrUndefined(value);
    hasTheOwnProperty = _Object_prototype_hasOwnProperty_call(instance, propertyName);
    instance = instance.__proxyTarget__ || instance;
    value = value?.__proxy__ || value;
    if (isMany$1(property.upperValue)) {
      if (valueIsNullOrUndefined) ; else {
        if (_Array_isArray(value)) ; else if (hasTheOwnProperty && instance[propertyName]) {
          index = instance[propertyName].indexOf(value);
          isInstancePropertyEqualToValue = index !== -1;
          if (isDelete) {
            if (isInstancePropertyEqualToValue) {
              Collection_replace(instance[propertyName], index, 1);
            }
          } else {
            if (!isInstancePropertyEqualToValue) {
              Collection_append(instance[propertyName], value);
            }
          }
        } else ;
      }
    } else {
      isInstancePropertyEqualToValue = instance[propertyName] === value;
      if (valueIsNullOrUndefined) {
        if (isDelete) {
          if (hasTheOwnProperty) {
            deleteProperty(propertyName, instance);
          }
        } else {
          if (!isInstancePropertyEqualToValue) {
            set(propertyName, value, instance);
          }
        }
      } else {
        if (isDelete) {
          if (hasTheOwnProperty && isInstancePropertyEqualToValue) {
            deleteProperty(propertyName, instance);
          }
        } else {
          if (!hasTheOwnProperty || hasTheOwnProperty && !isInstancePropertyEqualToValue) {
            set(propertyName, value, instance);
          }
        }
      }
    }
  }
};

const _Object_keys = _Object.keys;

const extractPackage = instance => {
  if (!instance) {
    return;
  }
  let __type__ = findType(instance), t = __type__?.name, p;
  if (t === `Package` || t === `Model`) {
    p = instance;
  } else if (t === `Class` || t === `Interface` || t === `Association` || t === `DataType` || t === `Enumeration` || t === `PrimitiveType` || t === `InstanceSpecification` || t === `EnumerationLiteral`) {
    p = instance.owningPackage;
  } else if (t === `Property` || t === `Identifier`) {
    p = instance.class?.owningPackage || instance.interface?.owningPackage;
  } else if (t === `IdentifierProperty`) {
    p = instance.identifier?.class?.owningPackage || instance.identifier?.interface?.owningPackage;
  } else if (t === `Generalization`) {
    p = instance.specific?.owningPackage;
  } else if (t === `InterfaceRealization`) {
    p = instance.implementingClassifier?.owningPackage;
  } else if (t === `PackageImport`) {
    p = instance.importingNamespace;
  }
  return p;
};

const isFromPackage = (instance, packageId) => {
  if (!instance) {
    return false;
  }
  let __type__ = findType(instance), t = __type__?.name, p, infiniteLoopInsurance = 0;
  p = extractPackage(instance);
  do {
    if (p && p.id == packageId || (t === `PackageImport` && instance.importingNamespace?.id == packageId || instance.importingNamespaceId == packageId || instance.importedPackage?.id == packageId || instance.importedPackageId == packageId)) {
      return true;
    }
  } while (infiniteLoopInsurance++ < 25 && p && (p = p.owningPackage));
  return false;
};

const toRef = (value, packageId, ownedPackageImportIdList) => {
  let typeofValue = typeof value;
  if ((typeofValue === `object` || typeofValue === `function`) && value !== null && value.__id__ && (!packageId || isFromPackage(value, packageId) || ownedPackageImportIdList?.some((pId => isFromPackage(value, pId))))) {
    return {
      __ref__: value.__id__
    };
  }
};

const jsonify = (p, pretty) => {
  let packageId = p.id;
  let ownedPackageImportIdList = p.ownedPackageImport?.map((pi => pi.importedPackageId));
  let serialized = new Set;
  let instances = [];
  JSON.stringify(p, (function(key, value) {
    let v;
    if (serialized.has(value)) {
      v = undefined;
    } else if (toRef(value, packageId)) {
      serialized.add(value);
      let attributes = computeAttributes(findType(value));
      v = {};
      let instance = {};
      for (let propertyName in value) {
        if (!_Object_prototype_hasOwnProperty_call(value, propertyName)) {
          continue;
        }
        let propertyValue = value[propertyName];
        let typeofPropertyValue = typeof propertyValue;
        let newValue;
        if (typeofPropertyValue !== `object` && typeofPropertyValue !== `function`) {
          if (propertyName === `__id__` || attributes[propertyName]) {
            instance[propertyName] = propertyValue;
          }
        } else if (propertyValue && (propertyName === `__type__` || attributes[propertyName])) {
          if (_Array_isArray(propertyValue)) {
            newValue = propertyValue.map((item => toRef(item, packageId, ownedPackageImportIdList))).filter((item => item));
            if (newValue.length) {
              instance[propertyName] = newValue;
            }
          } else if (propertyName === `__type__`) {
            instance[propertyName] = toRef(propertyValue);
          } else if (newValue = toRef(propertyValue, packageId, ownedPackageImportIdList)) {
            instance[propertyName] = newValue;
          } else if (`toJSON` in propertyValue) {
            instance[propertyName] = propertyValue.toJSON();
          }
        }
        if (propertyName === `__type__` || attributes[propertyName] || typeofPropertyValue !== `object` && typeofPropertyValue !== `function`) {
          v[propertyName] = propertyValue;
        }
      }
      instances.push(instance);
    } else if (_Array_isArray(value)) {
      v = value;
    }
    return v;
  }));
  let json;
  if (pretty) {
    json = JSON.stringify(instances, (function(key, value) {
      if (_Array_isArray(value)) {
        return value.sort(((a, b) => {
          if (a.__id__ === p.__id__) {
            return -1;
          } else if (b.__id__ === p.__id__) {
            return 1;
          } else if (a.__id__ && b.__id__) {
            a = a.__id__;
            b = b.__id__;
          } else if (a.__ref__ && b.__ref__) {
            a = a.__ref__;
            b = b.__ref__;
          }
          return a > b ? 1 : -1;
        }));
      } else if (typeof value === S_object) {
        let obj = {};
        _Object_keys(value).sort().forEach((propertyName => obj[propertyName] = value[propertyName]));
        return obj;
      }
      return value;
    }), `  `);
  } else {
    json = JSON.stringify(instances);
  }
  return json;
};

const applyAttributes = (instance, __type__ = findType(instance), properties) => {
  let ownedAttributeList, propertyName, property;
  ownedAttributeList = computeAttributes(__type__);
  for (propertyName in ownedAttributeList) {
    if (_Object_prototype_hasOwnProperty_call(ownedAttributeList, propertyName) && (property = ownedAttributeList[propertyName]) && (!properties || !_Object_prototype_hasOwnProperty_call(properties, propertyName)) && !_Object_prototype_hasOwnProperty_call(instance, propertyName)) {
      if (isMany$1(property.upperValue)) {
        set(propertyName, [], instance);
      } else if (_Object_prototype_hasOwnProperty_call(property, S_defaultValue)) {
        set(propertyName, property.defaultValue, instance);
      }
    }
  }
};

const replaceWithInstance = (obj, fallback, __id__) => (__id__ = obj.__id__) && C[__id__] || fallback;

const replaceCollectionItem = (collection, instance) => {
  if (!collection) {
    return;
  }
  let replaced = false;
  for (let i = collection.length - 1; i >= 0; i--) {
    let item = collection[i];
    if (item.__id__ == instance.__id__) {
      if (!replaced) {
        replaced = true;
        if (item !== instance) {
          set(i, instance, collection);
        }
      } else {
        replace.call(collection, i, 1);
      }
    }
  }
  if (!replaced) {
    set(collection.length, instance, collection);
  }
};

const resurrect = (json, properties = {}, shouldReplace) => {
  resurrect.a = 1;
  let refsSelf = new Set;
  let refsType = new Set;
  let refsDataType = new Set;
  let refsByObj = new Map;
  let storeRef = (obj1, obj2, propertyName) => {
    if (!refsByObj.has(obj1)) {
      refsByObj.set(obj1, []);
    }
    refsByObj.get(obj1).push([ obj2, propertyName ]);
    if (obj1 === obj2) {
      refsSelf.add(obj1);
    } else if (propertyName === S___type__) {
      refsType.add(obj1);
    } else if (obj1?.__type__?.metaclass === S_Class || obj1?.__type__?.metaclass === S_Enumeration || obj1?.__type__?.metaclass === S_PrimitiveType) {
      refsDataType.add(obj1);
    }
  };
  let SYMBOL_OWNER = _Symbol("owner");
  let objsById = {};
  let refsById = {};
  let parsed = _JSON_parse(json, (function(key, value) {
    let _this = this, typeofValue = typeof value, id, ref, backref;
    if (typeofValue === S_object) {
      if (id = value.__ref__) {
        if (ref = C[id]) {
          return ref;
        }
        if (ref = objsById[id]) {
          storeRef(ref, _this, key);
          return ref;
        }
        refsById[id] = refsById[id] || [];
        refsById[id].push([ _this, key ]);
      } else if (id = value.__id__) {
        objsById[id] = value;
        storeRef(value, _this, key);
        if (refsById[id]) {
          for (backref of refsById[id]) {
            storeRef(value, backref[0], backref[1]);
            backref[0][backref[1]] = value;
          }
          delete refsById[id];
        }
      } else if (_Array_isArray(value)) {
        value[SYMBOL_OWNER] = [ _this, key ];
      } else ;
    }
    return value;
  }));
  let refsByObjPrioritized = new Map;
  for (let obj1 of refsSelf) {
    refsByObjPrioritized.set(obj1, refsByObj.get(obj1));
    refsType.delete(obj1);
    refsDataType.delete(obj1);
    refsByObj.delete(obj1);
  }
  for (let obj1 of refsType) {
    refsByObjPrioritized.set(obj1, refsByObj.get(obj1));
    refsDataType.delete(obj1);
    refsByObj.delete(obj1);
  }
  for (let obj1 of refsDataType) {
    refsByObjPrioritized.set(obj1, refsByObj.get(obj1));
    refsByObj.delete(obj1);
  }
  for (let [obj1, refs] of refsByObj) {
    refsByObjPrioritized.set(obj1, refs);
  }
  let instances = [];
  for (let [obj1, refs] of refsByObjPrioritized) {
    let instance;
    let __type__;
    if ((__type__ = obj1.__type__) && isClassOrFunctionConstructor(__type__)) {
      instance = new __type__(obj1);
    } else {
      instance = new Instance$2(obj1);
    }
    instances.push(instance);
    for (let ref of refs) {
      let obj2 = ref[0];
      let instance2 = replaceWithInstance(obj2, obj2);
      let propertyName = ref[1];
      if (_Array_isArray(instance2)) {
        let owner = instance2[SYMBOL_OWNER];
        let ownerObject = replaceWithInstance(owner[0], owner[0]);
        let collection = ownerObject[owner[1]] || instance2;
        replaceCollectionItem(collection, instance);
        if (instance2 !== collection) {
          replaceCollectionItem(instance2, instance);
        }
      } else {
        if (instance2[propertyName] !== instance) {
          set(propertyName, instance, instance2);
        }
        if (instance2 !== obj2 && obj2[propertyName] !== instance) {
          set(propertyName, instance, obj2);
        }
      }
    }
    if (instance.__type__ === instance) {
      Instance$2(instance);
      applyAttributes(instance, instance, instance);
    }
  }
  for (let instance of instances) {
    let properties = {};
    let typeofVal;
    for (let propertyName in instance) {
      if (!_Object_prototype_hasOwnProperty_call(instance, propertyName)) {
        continue;
      }
      let val = instance[propertyName];
      if ((typeofVal = typeof val) && typeofVal !== S_object && typeofVal !== S_function) {
        properties[propertyName] = val;
      }
    }
    assign$1(properties, instance);
  }
  let model;
  if (Array.isArray(parsed)) {
    model = C[parsed[0].__id__];
  } else {
    model = C[parsed.__id__];
  }
  assign$1(properties, model);
  resurrect.a = 0;
  return model;
};

const _Infinity = Infinity;

const _isNaN = isNaN;

let UnlimitedNatural, prototype, cache = new Map;

UnlimitedNatural = function(value) {
  let instance = this;
  if (value instanceof UnlimitedNatural) {
    return value;
  }
  if (value === `*` || value === _null) {
    value = _Infinity;
  } else if (typeof value === S_string) {
    value = _Number(value);
  }
  if (!(value === _Infinity || !_isNaN(value) && typeof value === S_number && value >= 0 && _Number.isInteger(value))) {
    throwError(S_UnlimitedNatural + ` must be a positive Integer, Infinity, or "*"`);
  }
  if (cache.has(value)) {
    return cache.get(value);
  }
  if (!(instance instanceof UnlimitedNatural)) {
    return new UnlimitedNatural(value);
  }
  instance.v = value;
  cache.set(value, instance);
};

prototype = UnlimitedNatural.prototype;

prototype.toJSON = function() {
  return this.v === _Infinity ? `*` : this.v;
};

prototype[_Symbol.toPrimitive] = function(hint) {
  return hint === S_string && this.v === _Infinity ? `*` : this.v;
};

UnlimitedNatural.MANY = new UnlimitedNatural(_Infinity);

var UnlimitedNatural$1 = UnlimitedNatural;

globalThis.UnlimitedNatural = UnlimitedNatural$1;

BigInt.prototype.toJSON = function() {
  return this.toString();
};

const Instance_prototype$2 = Instance$2.prototype;

const Collection_prototype = Collection$1.prototype;

const Symbol_hasInstance = _Symbol.hasInstance;

const P = new WeakMap;

const handleIndexes = (__type__, instance, value, previousValue, property, isModify, identifier, identifierType, identifierProperty, identifierPropertyList, identifierPropertyNames, associationEnd, associationEndList, associationEndClassifier, associationEndName, opposite, oppositeIdentifier, oppositeIdentifierPropertyNames, oppositeName, id, name, i, il, isDelete = value === _undefined) => {
  if (!isMany$1(property.upperValue)) {
    if (identifierPropertyList = property.identifierProperty) {
      for (identifierProperty of identifierPropertyList) {
        if ((identifier = identifierProperty.identifier) && (identifierType = identifier.type)) {
          id = toIdString(instance, identifier);
          if (identifierType === S_primary) {
            addOrRemoveFromPrimaryCache(__type__, instance, id, !isModify);
          } else if (identifierType === S_foreign) {
            addOrRemoveFromIndex(identifier, instance, id, !isModify);
          }
          if (isModify && (associationEndList = identifier.associationEnd)) {
            for (associationEnd of associationEndList) {
              let inheritanceTree, item, oppositeAssociationEnd, oppositeIdentifier, oppositeInstance;
              if ((associationEndClassifier = associationEnd.class || associationEnd.interface) && (inheritanceTree = findInheritanceTree(__type__).flat()) && inheritanceTree.includes(associationEndClassifier) && (associationEndName = associationEnd.name) && (oppositeAssociationEnd = findOpposite(associationEnd)) && (oppositeIdentifier = oppositeAssociationEnd.identifier) && (oppositeInstance = instance[associationEndName])) {
                if (isMany$1(associationEnd.upperValue)) {
                  if (identifierType === S_primary) {
                    for (item of oppositeInstance) {
                      mirrorIdentifier(item, oppositeIdentifier, instance, identifier);
                    }
                  }
                } else {
                  if (identifierType === S_primary) {
                    mirrorIdentifier(oppositeInstance, oppositeIdentifier, instance, identifier);
                  }
                }
              }
            }
          }
        }
      }
    }
    if (isModify && (!value || typeof value !== S_object || !value.__ref__) && (identifier = property.identifier) && identifier.type === S_foreign && (identifierPropertyNames = findIdentifierPropertyNames(identifier)) && (opposite = findOpposite(property)) && (oppositeIdentifier = opposite.identifier) && (oppositeIdentifierPropertyNames = findIdentifierPropertyNames(oppositeIdentifier))) {
      for (i = 0, il = identifierPropertyNames.length; i < il; i++) {
        name = identifierPropertyNames[i];
        oppositeName = oppositeIdentifierPropertyNames[i];
        if (isDelete) {
          if (previousValue && instance[name] === previousValue[oppositeName] && instance[name] !== _undefined) {
            set(name, _undefined, instance);
          }
        } else {
          mirrorProperty(instance, name, value, oppositeName);
        }
      }
    }
  }
};

const associateOppositeByIdentifier = (__type__, instance, property, identifier, identifierType, identifierProperty, identifierPropertyList, associationEnd, associationEndList, associationEndClassifier, associationEndName, id) => {
  if (!isMany$1(property.upperValue)) {
    if (identifierPropertyList = property.identifierProperty) {
      for (identifierProperty of identifierPropertyList) {
        if ((identifier = identifierProperty.identifier) && (identifierType = identifier.type)) {
          id = toIdString(instance, identifier);
          if (associationEndList = identifier.associationEnd) {
            for (associationEnd of associationEndList) {
              let inheritanceTree, valueInCache, item, oppositeAssociationEnd, oppositeIdentifier, oppositeInstance, oppositeClass;
              if ((associationEndClassifier = associationEnd.class || associationEnd.interface) && (inheritanceTree = findInheritanceTree(__type__).flat()) && inheritanceTree.includes(associationEndClassifier) && (associationEndName = associationEnd.name) && (oppositeAssociationEnd = findOpposite(associationEnd)) && (oppositeIdentifier = oppositeAssociationEnd.identifier)) {
                oppositeInstance = instance[associationEndName];
                if (isMany$1(associationEnd.upperValue)) {
                  if (!oppositeInstance) {
                    continue;
                  }
                  if (identifierType === S_primary) {
                    if (id) {
                      if (oppositeIdentifier[SYMBOL_INDEX] && oppositeIdentifier[SYMBOL_INDEX][id] && _Array_isArray(oppositeIdentifier[SYMBOL_INDEX][id])) {
                        for (item of oppositeIdentifier[SYMBOL_INDEX][id]) {
                          !oppositeInstance.includes(item) && Collection_prototype.append.call(oppositeInstance, item);
                        }
                      }
                    }
                  } else if (identifierType === S_foreign) {
                    Collection_prototype.replace.call(oppositeInstance, 0);
                  }
                } else {
                  if (identifierType === S_primary) ; else if (identifierType === S_foreign) {
                    if (oppositeIdentifier.type === S_primary && (oppositeClass = oppositeIdentifier.class || oppositeIdentifier.interface) && oppositeClass[SYMBOL_CACHE_PRIMARY_IDENTIFIER] && id && (valueInCache = oppositeClass[SYMBOL_CACHE_PRIMARY_IDENTIFIER][id])) {
                      if (oppositeInstance !== valueInCache) {
                        set(associationEndName, valueInCache, instance);
                      }
                    } else if (!isNullOrUndefined(oppositeInstance) && id !== toIdString(oppositeInstance, oppositeIdentifier)) {
                      deleteProperty(associationEndName, instance);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const modifyProperty = (__type__, instance, propertyName, value, previousValue, operation, property, Type) => {
  if (property = findAttribute$1(propertyName, __type__)) {
    if (isMany$1(property.upperValue)) {
      if (!(isNullOrUndefined(value) || _Array_isArray(value))) {
        throwError(`"${propertyName}" must be an array-like`);
      }
      if (isNullOrUndefined(previousValue) || !(previousValue instanceof Collection$1)) {
        previousValue = new Collection$1(value, {
          instance: instance,
          name: propertyName,
          __type__: property.type
        });
      } else {
        if (resurrect.a) {
          Collection_prototype.append.call(previousValue, ..._Array_prototype_filter_call(value, (item => !_Array_prototype_includes_call(previousValue, item))));
        } else {
          Collection_prototype.replace.call(previousValue, 0, _undefined, ...value || []);
        }
      }
      value = previousValue;
      operation(value);
    } else {
      Type = property.type;
      if (!isNullOrUndefined(value) && isClassOrFunctionConstructor(Type)) {
        if (Type.__primitive__ || globalThis[Type.name] === Type) {
          if (Type.__primitive__?.name?.toLowerCase() !== typeof value || Type.name?.toLowerCase() !== typeof value) {
            value = Type(value);
            operation(value);
          }
        } else {
          if (P.has(value)) {
            let i = P.get(value);
            if (i) {
              operation(i);
            }
          } else if (!resurrect.a && !(value instanceof Type)) {
            try {
              P.set(value);
              let i = new Type(value);
              P.set(value, i);
              operation(i);
            } catch (e) {}
          }
        }
      }
    }
    handleIndexes(__type__, instance, value, previousValue, property);
  }
};

Instance_prototype$2.on(S_beforeInstance, (evt => {
  let detail = evt.detail, properties = detail.properties, _this = detail.this, instance = detail.instance, originalInstance, returnValue, __type__ = properties?.__type__, metaclass, primaryIdentifier, primaryId, i;
  if (evt?.returnValue?.instance || evt?.returnValue?.__type__) {
    return;
  }
  if (instance) {
    returnValue = evt.returnValue = evt.returnValue || {};
    returnValue.instance = instance;
    returnValue.initialized = true;
    if (P.has(properties)) {
      returnValue.noAssign = true;
    }
    return;
  }
  instance = originalInstance = _this;
  P.set(properties);
  if (__type__ && _Object_prototype_hasOwnProperty_call(__type__, S_isAbstract) && __type__.isAbstract) {
    throwError(__type__.name + ` is abstract`);
  }
  if (__type__ && _Object_prototype_hasOwnProperty_call(__type__, SYMBOL_CACHE_PRIMARY_IDENTIFIER) && (primaryIdentifier = findPrimaryIdentifier(__type__)) && (primaryId = toIdString(properties, primaryIdentifier)) && (i = __type__[SYMBOL_CACHE_PRIMARY_IDENTIFIER][primaryId])) {
    evt.returnValue = evt.returnValue || {};
    evt.returnValue.instance = i;
    evt.returnValue.initialized = true;
    return;
  }
  metaclass = __type__?.metaclass;
  if (metaclass === S_Class) {
    if (!isClassOrFunctionConstructor(instance)) {
      instance = function(properties = {}, i = new.target && this) {
        properties.__type__ = properties.__type__ || instance.__proxy__ || instance;
        return Instance$2(properties, i);
      };
    }
    if (properties?.metaclass === S_Class && !isClassOrFunctionConstructor(instance.prototype)) {
      instance.prototype = function(properties = {}, i = new.target && this) {
        properties.__type__ = properties.__type__ || new.target;
        return Instance$2(properties, i);
      };
      instance.prototype.prototype = Instance_prototype$2;
      instance.prototype.constructor = instance;
      evt.returnValue = evt.returnValue || {};
      evt.returnValue.__type__ = instance;
    }
    setProto(instance.prototype, isClassOrFunctionConstructor(properties?.generalization?.general) ? properties?.generalization?.general : Instance$2);
  } else if (metaclass === S_Enumeration) {
    if (!isClassOrFunctionConstructor(instance)) {
      instance = function(name) {
        return instance.ownedLiteral && instance.ownedLiteral.find((ol => ol.name === name));
      };
    }
    _Object_defineProperty(instance, Symbol_hasInstance, {
      value: i => instance.ownedLiteral.includes(i)
    });
  } else if (metaclass === S_PrimitiveType) {
    properties.__primitive__ = properties.__primitive__ || properties.globalName && globalThis[properties.globalName];
    let __primitive__ = properties.__primitive__;
    if (!__primitive__) {
      throwError(S___primitive__ + ` or ` + S_globalName + ` required`);
    }
    if (!isClassOrFunctionConstructor(instance)) {
      instance = function(value) {
        return __primitive__(value);
      };
    }
    _Object_defineProperty(instance, Symbol_hasInstance, {
      value: i => _Function[Symbol_hasInstance].call(instance, i) || _Function[Symbol_hasInstance].call(__primitive__, i)
    });
    _Object_setPrototypeOf(instance.prototype, __primitive__.prototype);
    __type__.__primitive__ = __type__.__primitive__ || [];
    __type__.__primitive__.push(__primitive__);
    let descriptors = _Object_getOwnPropertyDescriptors(__primitive__);
    delete descriptors.name;
    delete descriptors.length;
    delete descriptors.prototype;
    _Object_defineProperties(instance, descriptors);
  }
  metaclass = properties?.metaclass;
  if (metaclass === S_Classifier) {
    instance.prototype.call = _Function_prototype.call;
    instance.prototype.apply = _Function_prototype.apply;
    instance.prototype.bind = _Function_prototype.bind;
    instance.prototype[Symbol_hasInstance] = _Function_prototype[Symbol_hasInstance];
  } else if (metaclass === S_Interface) {
    _Object_defineProperty(instance.prototype, Symbol_hasInstance, {
      value: function(i, _this = this) {
        return findInheritanceTree(findType(i)).flat().includes(_this);
      }
    });
  } else if (metaclass === S_PrimitiveType) {
    instance.__primitive__ = instance.__primitive__ || [];
    _Object_defineProperty(instance, Symbol_hasInstance, {
      value: i => _Function[Symbol_hasInstance].call(instance, i) || instance.__primitive__.includes(i)
    });
  }
  if (isClassOrFunctionConstructor(instance)) {
    try {
      _Object_defineProperty(instance, S_name, {
        value: properties.name || instance.name,
        enumerable: true,
        writable: true
      });
    } catch (e) {}
  }
  if (instance !== originalInstance) {
    evt.returnValue = evt.returnValue || {};
    evt.returnValue.instance = instance;
  }
}));

Instance_prototype$2.on(S_instance, (evt => {
  let detail = evt.detail, properties = detail.properties, __type__ = detail.__type__, instance = detail.instance;
  P.set(properties, instance);
  applyAttributes(instance, __type__, properties);
}));

Instance_prototype$2.on(S_set, (evt => {
  let detail = evt.detail;
  modifyProperty(detail.__type__, detail.instance, detail.property, detail.value, detail.previousValue, (v => (evt.returnValue = evt.returnValue || {}, 
  evt.returnValue.value = v)));
}));

Instance_prototype$2.on(S_defineProperty, (evt => {
  let detail = evt.detail, instance = detail.instance, descriptor = detail.descriptor, value;
  if (_Object_prototype_hasOwnProperty_call(descriptor, S_value)) {
    value = descriptor.value;
  } else if (_Object_prototype_hasOwnProperty_call(descriptor, S_get$1)) {
    value = descriptor.get.call(instance);
  } else ;
  modifyProperty(detail.__type__, instance, detail.property, value, detail.previousValue, (v => {
    if (_Object_prototype_hasOwnProperty_call(descriptor, S_value)) {
      descriptor.value = v;
    } else {
      descriptor.set.call(instance, v);
    }
  }));
}));

Instance_prototype$2.on(S_deleteProperty, (evt => {
  let detail = evt.detail;
  modifyProperty(detail.__type__, detail.instance, detail.property, detail.value, detail.previousValue, (() => {}));
}));

Instance_prototype$2.on(S_modify, (evt => {
  let detail = evt.detail, instance = detail.instance, __type__ = detail.__type__, propertyName = detail.property, property;
  if (property = findAttribute$1(propertyName, __type__)) {
    handleIndexes(__type__, instance, detail.value, detail.previousValue, property, 1);
  }
}));

Instance_prototype$2.on(S_change$1, (evt => {
  let detail = evt.detail, instance = detail.instance, __type__ = detail.__type__, changes = detail.changes, metaclass = __type__?.metaclass, propertyName, change, property, opposite, specific;
  if (metaclass === S_Property) {
    computeAttributes.i(instance.class || instance.interface);
  }
  for ([propertyName, change] of changes) {
    let value = change.to;
    let previousValue = change.from;
    if (metaclass === S_Classifier || metaclass === S_Class || metaclass === S_Interface) {
      if (propertyName === S_generalization) {
        computeAttributes.i(instance);
        findInheritanceTree.i(instance);
        setProto(instance.prototype, isClassOrFunctionConstructor(value?.general) ? value?.general : Instance$2);
      }
    } else if (metaclass === S_Generalization) {
      if (propertyName === S_specific) {
        if (value) {
          computeAttributes.i(value);
          findInheritanceTree.i(value);
          setProto(value.prototype, isClassOrFunctionConstructor(instance.general) ? instance.general : Instance$2);
        }
      } else if (propertyName === S_general) {
        if (specific = instance.specific) {
          setProto(specific.prototype, isClassOrFunctionConstructor(value) ? value : Instance$2);
        }
      }
    } else if (metaclass === S_InterfaceRealization) {
      if (propertyName === S_implementingClassifier) {
        if (value) {
          computeAttributes.i(value);
          findInheritanceTree.i(value);
        }
      }
      if (propertyName === S_contract) {
        if (specific = instance.implementingClassifier) {
          computeAttributes.i(specific);
          findInheritanceTree.i(specific);
        }
      }
    }
    if (property = findAttribute$1(propertyName, __type__)) {
      associateOppositeByIdentifier(__type__, instance, property);
      if (!isMany$1(property.upperValue) && (opposite = findOpposite(property))) {
        updateProperty(opposite, previousValue, instance, 1);
        if (value) {
          updateProperty(opposite, value, instance);
        }
      }
    }
  }
}));

Instance_prototype$2.on(S_destroy, (evt => {
  let detail = evt.detail, instance = detail.instance, __type__ = detail.__type__, identifierList, identifier, identifierType;
  if (identifierList = __type__.identifier) {
    for (identifier of identifierList) {
      identifierType = identifier.type;
      if (identifierType === S_primary) {
        addOrRemoveFromPrimaryCache(__type__, instance, toIdString(instance, identifier), 1);
      } else if (identifierType === S_foreign) {
        addOrRemoveFromIndex(identifier, instance, toIdString(instance, identifier), 1);
      }
    }
  }
}));

Collection_prototype.on(S_set, (evt => {
  let detail = evt.detail, collection = detail.instance, index = detail.property, value = detail.value, instance = collection?.instance, __type__ = instance && findType(instance), propertyName = collection?.name, operation, property, Type;
  if (!resurrect.a && typeof index !== `symbol` && !isNaN(Number(index)) && (property = findAttribute$1(propertyName, __type__))) {
    Type = property.type;
    if (!isNullOrUndefined(value) && isClassOrFunctionConstructor(Type)) {
      operation = value => {
        evt.returnValue = evt.returnValue || {};
        evt.returnValue.value = value;
      };
      if (P.has(value)) {
        let i = P.get(value);
        if (i) {
          operation(i);
        }
      } else if (!(value instanceof Type)) {
        try {
          P.set(value);
          let i = new Type(value);
          P.set(value, i);
          operation(i);
        } catch (e) {}
      }
    }
  }
}));

Collection_prototype.on(S_change$1, (evt => {
  let detail = evt.detail, collection = detail.instance, added = detail.added, removed = detail.removed, instance = collection?.instance, __type__ = instance && findType(instance), metaclass = __type__?.metaclass, propertyName = collection?.name, property, opposite, item;
  if (metaclass === S_Package || metaclass === S_Model) {
    if (propertyName === S_packagedElement) {
      for (item of added) {
        item.name && set(item.name, item, instance);
      }
    }
  } else if (metaclass === S_Classifier || metaclass === S_Class || metaclass === S_Interface) {
    if (propertyName === S_ownedAttribute) {
      computeAttributes.i(instance);
    } else if (propertyName === S_interfaceRealization) {
      computeAttributes.i(instance);
      findInheritanceTree.i(instance);
    }
  }
  if ((property = findAttribute$1(propertyName, __type__)) && (opposite = findOpposite(property))) {
    for (item of removed) {
      !collection.includes(item) && updateProperty(opposite, item, instance, 1);
    }
    for (item of added) {
      collection.includes(item) && updateProperty(opposite, item, instance);
    }
  }
}));

var MetamodelCore = Object.freeze({
  __proto__: null,
  Instance: Instance$2,
  Collection: Collection$1,
  resurrect: resurrect,
  jsonify: jsonify,
  findType: findType,
  computeAttributes: computeAttributes,
  findAttribute: findAttribute$1,
  findGeneral: findGeneral,
  findGeneralChain: findGeneralChain,
  findInheritanceTree: findInheritanceTree,
  addOrRemoveFromIndex: addOrRemoveFromIndex,
  SYMBOL_INDEX: SYMBOL_INDEX,
  addOrRemoveFromPrimaryCache: addOrRemoveFromPrimaryCache,
  SYMBOL_CACHE_PRIMARY_IDENTIFIER: SYMBOL_CACHE_PRIMARY_IDENTIFIER,
  findIdentifierPropertyNames: findIdentifierPropertyNames,
  findPrimaryIdentifier: findPrimaryIdentifier,
  fromIdString: fromIdString,
  mirrorIdentifier: mirrorIdentifier,
  mirrorProperty: mirrorProperty,
  toIdString: toIdString,
  findOpposite: findOpposite,
  isMany: isMany$1,
  updateProperty: updateProperty
});

const Instance_prototype$1 = Instance$2.prototype;

const assign = Instance_prototype$1.assign;

const dispatch = Instance_prototype$1.dispatch;

const SYMBOL_CLEAN = Symbol.for(`JSONAPI.clean`);

const JSONAPI_CONTENT_TYPE = `application/vnd.api+json`;

const S_Content_Type = `Content-Type`;

let request;

if (typeof fetch !== `undefined`) {
  request = async (url, config) => await fetch(url, config);
} else {
  let https;
  request = async (url, config) => {
    if (!https) {
      https = await import("https");
    }
    url = new URL(url);
    let options = {
      method: config.method || "GET",
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: config.headers || {}
    };
    return new Promise(((resolve, reject) => {
      let req = https.request(options, (res => {
        let data = "";
        res.on("data", (chunk => {
          data += chunk.toString("utf8");
        }));
        res.on("end", (() => {
          try {
            resolve({
              status: res.status,
              json: () => JSON.parse(data)
            });
          } catch (e) {
            reject(e);
          }
        }));
      }));
      req.on("error", (e => {
        reject(e);
      }));
      if (config.body) {
        req.write(config.body);
      }
      req.end();
    }));
  };
}

const JSONAPI = config => {
  let jsonapi = {}, toId, toObject, toInstance;
  if (config.auth) {
    jsonapi.auth = config.auth;
  }
  if (config.toType) {
    jsonapi.toType = config.toType;
  }
  toInstance = jsonapi.toInstance = (Type, doc) => {
    let toType = jsonapi.toType, AType, instance;
    if (!toType) {
      throw Error(`jsonapi.toType not set`);
    }
    AType = toType(doc.type, Type);
    instance = new AType(doc.attributes);
    instance[SYMBOL_CLEAN] = true;
    return instance;
  };
  toId = jsonapi.toIdString = (instance, __type__) => {
    let primaryIdentifier;
    __type__ = __type__ || findType(instance);
    primaryIdentifier = findPrimaryIdentifier(__type__);
    return toIdString(instance, primaryIdentifier);
  };
  toObject = jsonapi.toObject = instance => {
    let __type__, property, propertyName, typeofValue, value, obj = {};
    __type__ = findType(instance);
    for (propertyName in instance) {
      if (!_Object_prototype_hasOwnProperty_call(instance, propertyName) || (property = findAttribute$1(propertyName, __type__)) && property.association) {
        continue;
      }
      value = instance[propertyName];
      typeofValue = typeof value;
      if (value && (typeofValue === S_object || typeofValue === S_function) && `toJSON` in value) {
        value = value.toJSON();
        typeofValue = typeof value;
      }
      if (value === undefined) {
        value = null;
      }
      if (typeofValue !== S_object && typeofValue !== S_function) {
        obj[propertyName] = value;
      }
    }
    return obj;
  };
  jsonapi.find = async Type => {
    let items = [], item, auth = jsonapi.auth, packageId, TypeId, response, responseData;
    if (!auth) {
      throw Error(`jsonapi.auth not set`);
    }
    await auth.initialized;
    if (!auth.headers) {
      if (!await auth.authorize()) {
        return;
      }
    }
    if (Type && (TypeId = toId(Type)) && (packageId = toId(Type.owningPackage))) {
      response = await request(`${config.baseUrl}${packageId}/${TypeId}/`, {
        headers: {
          Authorization: auth.headers.Authorization,
          [S_Content_Type]: JSONAPI_CONTENT_TYPE
        }
      });
      responseData = await response.json();
      if (responseData.errors && responseData.errors.length) {
        if (response.status == 401) {
          await auth.authorize({
            force: true
          });
        } else {
          throw Error(responseData.errors.map((e => e.detail)).join(`\n`));
        }
      } else if (responseData.data) {
        for (item of responseData.data) {
          items.push(toInstance(Type, item));
        }
      }
    }
    return items;
  };
  jsonapi.findById = async (Type, idObject) => {
    let instance, instanceId, auth = jsonapi.auth, TypeId, packageId, response, responseData;
    if (!auth) {
      throw Error(`jsonapi.auth not set`);
    }
    await auth.initialized;
    if (!auth.headers) {
      if (!await auth.authorize()) {
        return;
      }
    }
    if (Type && (TypeId = toId(Type)) && (packageId = toId(Type.owningPackage)) && (instanceId = toId(idObject, Type))) {
      response = await request(`${config.baseUrl}${packageId}/${TypeId}/${instanceId}`, {
        headers: {
          Authorization: auth.headers.Authorization,
          [S_Content_Type]: JSONAPI_CONTENT_TYPE
        }
      });
      responseData = await response.json();
      if (responseData.errors && responseData.errors.length) {
        if (response.status == 401) {
          await auth.authorize({
            force: true
          });
        } else {
          throw Error(responseData.errors.map((e => e.detail)).join(`\n`));
        }
      } else if (responseData.data) {
        instance = toInstance(Type, responseData.data);
      }
    }
    return instance;
  };
  jsonapi.findRelated = async (instance, propertyName) => {
    let instanceId, Type, items = [], item, auth = jsonapi.auth, TypeId, packageId, response, responseData;
    if (!auth) {
      throw Error(`jsonapi.auth not set`);
    }
    instance.__proxyTarget__ || instance, instance = instance.__proxy__ || instance;
    await auth.initialized;
    if (!auth.headers) {
      if (!await auth.authorize()) {
        return;
      }
    }
    if (instance && (Type = findType(instance)) && (TypeId = toId(Type)) && (packageId = toId(Type.owningPackage)) && (instanceId = toId(instance))) {
      response = await request(`${config.baseUrl}${packageId}/${TypeId}/${instanceId}/${propertyName}`, {
        headers: {
          Authorization: auth.headers.Authorization,
          [S_Content_Type]: JSONAPI_CONTENT_TYPE
        }
      });
      responseData = await response.json();
      if (responseData.errors && responseData.errors.length) {
        if (response.status == 401) {
          await auth.authorize({
            force: true
          });
        } else {
          throw Error(responseData.errors.map((e => e.detail)).join(`\n`));
        }
      } else if (responseData.data) {
        if (_Array_isArray(responseData.data)) {
          for (item of responseData.data) {
            items.push(toInstance(Type, item));
          }
          return items;
        } else {
          return toInstance(Type, responseData.data);
        }
      }
    } else {
      throw Error(`no "Type"`);
    }
  };
  jsonapi.save = async instance => {
    let i, instanceId, response, responseData, auth = jsonapi.auth, Type, TypeId, packageId;
    if (!auth) {
      throw Error(`jsonapi.auth not set`);
    }
    i = instance.__proxyTarget__ || instance, instance = instance.__proxy__ || instance;
    await auth.initialized;
    if (!auth.headers) {
      if (!await auth.authorize()) {
        return;
      }
    }
    if (instance && !instance[SYMBOL_CLEAN] && (Type = findType(instance)) && (TypeId = toId(Type)) && (packageId = toId(Type.owningPackage))) {
      if (instanceId = toId(instance)) {
        response = await request(`${config.baseUrl}${packageId}/${TypeId}/${instanceId}`, {
          method: `PATCH`,
          headers: {
            Authorization: auth.headers.Authorization,
            [S_Content_Type]: JSONAPI_CONTENT_TYPE
          },
          body: _JSON_stringify({
            data: {
              id: instanceId,
              type: TypeId,
              attributes: toObject(instance)
            }
          })
        });
      } else {
        response = await request(`${config.baseUrl}${packageId}/${TypeId}`, {
          method: `POST`,
          headers: {
            Authorization: auth.headers.Authorization,
            [S_Content_Type]: JSONAPI_CONTENT_TYPE
          },
          body: _JSON_stringify({
            data: {
              type: TypeId,
              attributes: toObject(instance)
            }
          })
        });
      }
      responseData = await response.json();
      if (responseData.errors && responseData.errors.length) {
        if (response.status == 401) {
          await auth.authorize({
            force: true
          });
        } else {
          throw Error(responseData.errors.map((e => e.detail)).join(`\n`));
        }
      } else if (responseData.data) {
        assign(responseData.data.attributes, instance);
        i[SYMBOL_CLEAN] = true;
      }
    }
    return instance;
  };
  jsonapi.delete = async instance => {
    let instanceId, auth = jsonapi.auth, Type, TypeId, packageId, response, responseData;
    if (!auth) {
      throw Error(`jsonapi.auth not set`);
    }
    instance.__proxyTarget__ || instance, instance = instance.__proxy__ || instance;
    await auth.initialized;
    if (!auth.headers) {
      if (!await auth.authorize()) {
        return;
      }
    }
    if (instance && (Type = findType(instance)) && (TypeId = toId(Type)) && (packageId = toId(Type.owningPackage)) && (instanceId = toId(instance))) {
      response = await request(`${config.baseUrl}${packageId}/${TypeId}/${instanceId}`, {
        method: `DELETE`,
        headers: {
          Authorization: auth.headers.Authorization,
          [S_Content_Type]: JSONAPI_CONTENT_TYPE
        }
      });
      responseData = await response.json();
      if (responseData.errors && responseData.errors.length) {
        if (response.status == 401) {
          await auth.authorize({
            force: true
          });
        } else {
          throw Error(responseData.errors.map((e => e.detail)).join(`\n`));
        }
      } else if (responseData.data) ;
    }
    return instance;
  };
  jsonapi.unclean = instance => {
    instance[SYMBOL_CLEAN] = false;
    dispatch({
      type: "unclean",
      detail: {
        instance: instance
      }
    }, instance);
  };
  return jsonapi;
};

JSONAPI.SYMBOL_CLEAN = SYMBOL_CLEAN;

let S0 = `{"__ref__":"Metamodel:`, S1$1 = `"},"__id__":"Metamodel:`, S2$1 = `},{"__type__"`, S3$1 = `,"identifier`, S4$1 = `,"lowerValue":"1","upperValue":1,"`, S5$1 = `,"owningPackage`, S6$1 = `,"association`, S7$1 = `{"__ref__":"1c`, S8$1 = `","lowerValue":"0","upperValue":`, S9$1 = `autoGenerate":fals`, S10$1 = `,"x":50,"y":50,"width":350,"height":35`, S11$1 = `,"classId":"`, S12$1 = `pdjjcp2g42i900`, S13$1 = `","id":"`, S14$1 = `","name":"`, S15$1 = `","typeId":"`, S16$1 = `,"class"`, S17$1 = `0v8ed5hphio500`, S18$1 = `,"type"`, S19 = `,"__id__":"`, S20 = `,"general`, S21 = `roperty`, S22 = `,"ownedAttribute":`, S23 = `Id":"`, S24 = `"},"typedElement":`, S25 = `","__type__"`, S26 = `,"specifi`, S27 = `,"metaclass":"`, S28 = `,"memberEnd":`, S29 = `},{"name":"`, S30 = `,"height":`, S31 = `ization"`, S32 = `,"width":`, S33 = `,"isAbstract":`, S34 = `"},{"__ref__":"1`, S35 = `:"foreign`, S36 = `","sqlDataType":"`, S37 = `implementingClassifie`, S38 = `Metamodel:`, S39 = `,"upperValue":1,"lowerValue":"`, S40 = `,"id":"2`, S41 = `dentifie`, S42 = `","defaultValue":`, S43 = `interfac`, S44 = `ackage`, S45 = `0k88ntq2i5oa800`, S46 = `h7fs1g1g9chca00`, S47 = `onrgeprdvq4b004`, S48 = `","globalName":"`, S49 = `Migratio`, S50 = `downstrea`, S51 = `importingNamespac`, S52 = `96ng88fkcv4dlr1m2p9a002`, S53 = `dElemen`, S54 = `,"specia`, S55 = `hhffspf9rmdmc6hiopk007`, S56 = `","x":`, S57 = `ssociatio`, S58 = `true,"x":`, S59 = `numeratio`, json = `[{"__type__":${S0}14"},"p${S44}Import":[{"__ref__":"12o0f4422m5scuhomhota005c"}]${S19}${S38}1${S13$1}1${S14$1}Metamodel","version":"1.4.0","p${S44}${S53}t":[${S0}12"},${S0}14"},${S0}21"},${S0}16"},${S0}15"},${S0}184"},${S0}23"},${S0}22"},${S0}18"},${S0}13"},${S0}176"},${S0}207"},${S0}4"},${S0}17"},${S0}19"},${S0}20"},${S0}7"},${S0}6"},${S0}8"},${S0}9"},${S0}136"},${S0}147"},${S7$1}6ql3un6${S12$1}6e"},${S7$1}fg1ue48${S17$1}2l"},${S0}11"},${S0}10"},${S0}5"},${S0}202"},${S0}61"},${S0}195"},${S0}54"},${S0}53"},${S0}2"},${S0}211"},${S0}217"},${S0}52"},${S0}162"},${S0}161"},${S0}163"},${S0}164"},${S0}165"},${S7$1}6qmeiv6${S12$1}5u"},${S7$1}6qmgoam${S12$1}7k"},${S7$1}6qlaqo6${S12$1}4s"},${S7$1}fg3kl18${S17$1}5i"},${S0}55"},${S0}56"},${S0}180"},${S0}194"},${S0}57"},${S0}60"},${S0}58"},${S0}62"},${S0}59"},${S0}221"}]${S29}Model${S25}:${S0}12${S1$1}14${S13$1}14"${S27}Model${S56}-1107,"y":1191${S32}514${S30}493${S5$1}${S23}1"${S20}${S31}:${S0}51"}${S5$1}":${S0}1"}${S29}Class${S25}:${S0}12${S24}[${S0}150"},${S0}152"},${S0}100"},${S0}111"}]${S19}${S38}12${S13$1}12"${S27}Class${S56}1200,"y":3086${S32}551${S30}645${S5$1}${S23}1"${S20}${S31}:${S0}46"}${S22}[${S0}168"},${S0}169"},${S0}171"},${S0}87"},${S0}88"}]${S33}false${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}150${S13$1}150${S14$1}upstream"${S4$1}class${S23}147${S15$1}12"${S6$1}${S23}164"${S3$1}${S23}154"${S6$1}":${S0}164"}${S3$1}":${S0}154"}${S16$1}:${S0}147"},"${S9$1}e${S18$1}:${S0}12"}${S29}P${S21}${S25}:${S0}12${S24}[${S0}173"},${S7$1}6qmeil6${S12$1}0o"},${S7$1}6qmgo06${S12$1}5f"},${S0}87"},${S0}94"},${S0}118"},${S0}113"}]${S19}${S38}21${S13$1}21"${S27}P${S21}${S56}2297,"y":1404${S32}628${S30}755${S5$1}${S23}1"${S20}${S31}:${S0}44"}${S22}[${S0}32"},${S0}107"},${S0}108"},${S0}109"},${S7$1}6qmeifm${S12$1}0h"},${S7$1}6qmgnr6${S12$1}32"},${S0}172"},${S0}175"},${S0}179"},${S0}99"},${S0}100"},${S0}102"},${S0}103"},${S0}106"},${S0}104"},${S0}105"},${S0}101"}]${S3$1}":[${S0}178"},${S0}69"},${S0}70"},${S0}71"}]${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}173${S14$1}ownedAttribute${S15$1}21${S8$1}"*"${S11$1}176"${S16$1}:${S0}176"}${S3$1}${S23}63"${S3$1}":${S0}63"},"id":"173"${S6$1}":${S0}180"},"${S9$1}e${S18$1}:${S0}21"}${S6$1}${S23}180"${S29}Interface${S25}:${S0}12${S24}[${S0}201"},${S0}179"},${S0}193"}]${S19}${S38}176"${S22}[${S0}173"},${S0}196"},${S0}189"}],"id":"176${S56}354,"y":2024${S32}658${S30}596${S27}Interface"${S5$1}${S23}1"${S20}${S31}:${S0}174"}${S33}false${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}201","${S9$1}e${S11$1}22"${S16$1}:${S0}22"}${S6$1}":${S0}202"}${S4$1}type${S23}176${S14$1}${S43}e${S13$1}201"${S3$1}":${S0}200"}${S18$1}:${S0}176"}${S6$1}${S23}202"${S3$1}${S23}200"${S29}I${S41}r${S25}:${S0}12${S24}[${S0}196"},${S0}116"},${S0}88"},${S0}105"}]${S19}${S38}22${S13$1}22${S56}1956,"y":2453${S32}571${S30}375${S5$1}${S23}1"${S20}${S31}:${S0}35"}${S22}[${S0}201"},${S0}114"},${S0}112"},${S0}198"},${S0}110"},${S0}111"},${S0}113"}]${S3$1}":[${S0}200"},${S0}72"}]${S27}I${S41}r"${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}196","${S9$1}e${S11$1}176"${S6$1}":${S0}202"}${S3$1}${S23}63"${S3$1}":${S0}63"},"lowerValue":"0","upperValue":"*${S15$1}22${S14$1}i${S41}r${S13$1}196"${S18$1}:${S0}22"}${S16$1}:${S0}176"}${S6$1}${S23}202"${S2$1}:${S0}16${S1$1}202"${S28}[${S0}201"},${S0}196"}]${S10$1}0${S5$1}${S23}1${S14$1}A_${S43}e_i${S41}r${S13$1}202"${S33}false${S5$1}":${S0}1"}${S29}A${S57}n${S25}:${S0}12${S1$1}16${S13$1}16"${S27}A${S57}n${S56}1403,"y":1111${S32}565${S30}543${S5$1}${S23}1"${S20}${S31}:${S0}48"}${S22}[${S0}94"}]${S5$1}":${S0}1${S24}[${S0}103"}]${S2$1}:${S0}15${S1$1}48${S13$1}48"${S20}${S23}9"${S26}c${S23}16"${S20}":${S0}9"}${S26}c":${S0}16"}${S29}Generalization${S25}:${S0}12${S1$1}15${S13$1}15"${S27}General${S31},"x":1465,"y":758${S32}528${S30}291${S5$1}${S23}1"${S20}${S31}:${S0}34"}${S22}[${S0}93"},${S0}92"},${S0}91"},${S0}90"}]${S3$1}":[${S0}66"},${S0}65"}]${S5$1}":${S0}1${S24}[${S0}81"},${S0}82"}]${S2$1}:${S0}15${S1$1}34${S13$1}34"${S20}${S23}4"${S20}":${S0}4"}${S26}c${S23}15"${S26}c":${S0}15"}${S29}Element${S25}:${S0}12"},"${S43}eReal${S31}:[${S0}218${S34}b74sluiihhs8g879qnol0017"}]${S19}${S38}4${S13$1}4"${S27}Element"${S33}${S58}-138,"y":-428${S32}389${S30}200${S5$1}${S23}1"${S54}l${S31}:[${S0}34"},${S0}36"},${S0}203"},${S0}137"},${S7$1}6qlnqd6${S12$1}76"},${S0}148"},${S0}33"},${S0}181"},${S0}35"}]${S5$1}":${S0}1"}${S2$1}:${S0}184${S1$1}218","${S37}r${S23}4","contract":${S0}221"}${S40}18","${S37}r":${S0}4"},"contract${S23}221"${S29}InterfaceRealization${S25}:${S0}12${S1$1}184"${S22}[${S0}183"},${S0}188"},${S0}190"},${S0}193"},${S0}197"}]${S3$1}":[${S0}187"},${S0}192"},${S0}186"}],"id":"184${S56}622,"y":1605${S32}649${S30}315${S27}InterfaceReal${S31}${S33}false${S5$1}${S23}1"${S20}${S31}:${S0}181"}${S5$1}":${S0}1${S24}[${S0}182"},${S0}189"}]${S2$1}:${S0}21${S1$1}183"${S3$1}P${S21}":[${S0}185"}]${S11$1}184${S14$1}${S37}rId${S15$1}26"${S4$1}id":"183","${S9$1}e${S18$1}:${S0}26"}${S16$1}:${S0}184"}${S2$1}:${S0}23${S1$1}185","p${S21}${S23}183${S13$1}185"${S3$1}":${S0}187"},"p${S21}":${S0}183"}${S3$1}${S23}187"${S29}I${S41}rP${S21}${S25}:${S0}12${S1$1}23${S13$1}23${S56}3069,"y":2327${S32}494${S30}325${S5$1}${S23}1"${S20}${S31}:${S0}36"}${S22}[${S0}115"},${S0}116"},${S0}117"},${S0}118"},${S0}119"}]${S3$1}":[${S0}73"},${S0}74"}]${S27}I${S41}rP${S21}"${S5$1}":${S0}1${S24}[${S0}114"},${S0}106"}]${S2$1}:${S0}15${S1$1}36${S13$1}36"${S20}${S23}4"${S26}c${S23}23"${S26}c":${S0}23"}${S20}":${S0}4"}${S2$1}:${S0}21${S1$1}115${S13$1}115${S14$1}i${S41}rId"${S11$1}23${S15$1}26"${S3$1}P${S21}":[${S0}130"}]${S4$1}type":${S0}26"}${S16$1}:${S0}23"}${S2$1}:${S0}23${S1$1}130${S13$1}130"${S3$1}${S23}73","p${S21}${S23}115"${S3$1}":${S0}73"},"p${S21}":${S0}115"}${S2$1}:${S0}22${S1$1}73${S13$1}73"${S18$1}${S35}"${S11$1}23"${S3$1}P${S21}":[${S0}130"}]${S6$1}End":[${S0}116"}]${S16$1}:${S0}23"}${S2$1}:${S0}21${S1$1}116${S13$1}116${S14$1}i${S41}r${S8$1}1${S11$1}23${S15$1}22"${S6$1}${S23}61"${S3$1}${S23}73"${S6$1}":${S0}61"}${S3$1}":${S0}73"}${S16$1}:${S0}23"}${S18$1}:${S0}22"}${S2$1}:${S0}16${S1$1}61${S13$1}61${S14$1}A_i${S41}r_i${S41}rP${S21}"${S5$1}${S23}1"${S28}[${S0}116"},${S0}114"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}114${S13$1}114${S14$1}i${S41}rP${S21}${S8$1}"*"${S11$1}22${S15$1}23"${S6$1}${S23}61"${S3$1}${S23}63","${S9$1}e${S3$1}":${S0}63"}${S6$1}":${S0}61"}${S18$1}:${S0}23"}${S16$1}:${S0}22"}${S2$1}:${S0}22${S1$1}63${S13$1}63"${S18$1}:"primary"${S3$1}P${S21}":[${S0}120"}]${S6$1}End":[${S0}173"},${S0}196"},${S0}114"},${S0}96"},${S0}182"},${S0}81"},${S0}82"},${S0}204"},${S0}212"},${S0}89"},${S0}167"},${S0}166"},${S0}142"},${S0}168"},${S0}169"},${S7$1}6qmeifm${S12$1}0h"},${S7$1}6qmgnr6${S12$1}32"},${S7$1}6qlaqam${S12$1}6e"},${S7$1}fg3kkio${S17$1}16${S34}85rqj1c${S45}60${S34}${S52}1"},${S0}79${S34}85rqiu8${S45}2s"},${S0}189"},${S0}87"},${S0}88"},${S0}94"},${S0}106"},${S0}113"}],"${S43}e":${S0}221"},"${S43}e${S23}221"${S2$1}:${S0}23${S1$1}120${S13$1}120"${S3$1}${S23}63","p${S21}${S23}75","p${S21}":${S0}75"}${S3$1}":${S0}63"}${S2$1}:${S0}21${S1$1}75${S13$1}75${S14$1}id","autoGenerate":true,"unsigned":true,"type${S23}26"${S18$1}:${S0}26"}${S3$1}P${S21}":[${S0}120"}]${S4$1}${S43}e":${S0}221"},"${S43}e${S23}221"${S29}Integer${S25}:${S0}18${S24}[${S0}183"},${S0}115"},${S0}75"},${S0}92"},${S0}90"},${S0}213"},${S0}205"},${S0}77"},${S0}138"},${S0}140"},${S0}160"},${S0}151"},${S7$1}6qmeim6${S12$1}84"},${S7$1}6qlaqfm${S12$1}fs"},${S7$1}6qmgo16${S12$1}33"},${S0}149"},${S7$1}fg3kkpo${S17$1}ak"},${S7$1}${S55}d"},${S0}85"},${S0}83"},${S0}97"},${S0}175"},${S0}190"},${S0}197"},${S0}198"},${S0}99"},${S0}110"},${S0}102"},${S0}117"},${S0}104"},${S0}119${S34}dtbohlc${S46}64${S34}dtbodbr${S46}39"}]${S19}${S38}26${S13$1}26${S48}BigInt${S36}BIGINT"${S5$1}${S23}2"${S5$1}":${S0}2"}${S10$1}0${S29}PrimitiveType${S25}:${S0}12${S1$1}18${S13$1}18"${S27}PrimitiveType${S56}-106,"y":2655${S32}524${S30}566${S5$1}${S23}1"${S22}[${S0}170"}]${S20}${S31}:${S0}49"}${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}170${S13$1}170${S14$1}globalName"${S11$1}18${S15$1}24"${S18$1}:${S0}24"}${S4$1}class":${S0}18"}${S29}String${S25}:${S0}18${S24}[${S0}170"},${S0}95"},${S7$1}fg5uiio${S17$1}71"},${S7$1}fg8qfso${S17$1}37"},${S7$1}fg8qloo${S17$1}4h"},${S7$1}fg92obo${S17$1}07"},${S0}29"},${S0}76"},${S0}112"},${S0}172"},${S0}171"}]${S19}${S38}24${S13$1}24${S48}String${S36}VARCHAR(255)"${S5$1}${S23}2"${S5$1}":${S0}2"}${S10$1}0${S2$1}:${S0}21${S1$1}95${S13$1}95${S14$1}sqlDataType"${S11$1}17${S15$1}24"${S4$1}class":${S0}17"}${S18$1}:${S0}24"}${S29}DataType${S25}:${S0}12${S1$1}17${S13$1}17"${S27}DataType${S56}-226,"y":1589${S32}472${S30}555${S5$1}${S23}1"${S54}l${S31}:[${S0}49"},${S0}50"}]${S22}[${S0}95"}]${S20}${S31}:${S0}47"}${S5$1}":${S0}1"}${S2$1}:${S0}15${S1$1}49${S13$1}49"${S20}${S23}17"${S26}c${S23}18"${S20}":${S0}17"}${S26}c":${S0}18"}${S2$1}:${S0}15${S1$1}50${S13$1}50"${S20}${S23}17"${S26}c${S23}19"${S26}c":${S0}19"}${S20}":${S0}17"}${S29}E${S59}n${S25}:${S0}12${S1$1}19${S13$1}19"${S27}E${S59}n${S56}-650,"y":2645${S32}499${S30}566${S5$1}${S23}1"${S22}[${S0}96"}]${S20}${S31}:${S0}50"}${S5$1}":${S0}1${S24}[${S0}98"}]${S2$1}:${S0}21${S1$1}96${S13$1}96${S14$1}ownedLiteral${S8$1}"*"${S11$1}19${S15$1}20"${S6$1}${S23}56"${S3$1}${S23}63"${S18$1}:${S0}20"}${S6$1}":${S0}56"}${S16$1}:${S0}19"}${S3$1}":${S0}63"}${S29}E${S59}nLiteral${S25}:${S0}12${S1$1}20${S13$1}20"${S27}E${S59}nLiteral${S56}-830,"y":1966${S32}522${S30}323${S5$1}${S23}1"${S20}${S31}:${S0}42"}${S22}[${S0}97"},${S0}98"}]${S3$1}":[${S0}67"}]${S5$1}":${S0}1${S24}[${S0}96"}]${S2$1}:${S0}15${S1$1}42${S13$1}42"${S20}${S23}7"${S20}":${S0}7"}${S26}c${S23}20"${S26}c":${S0}20"}${S29}InstanceSpecification${S25}:${S0}12${S1$1}7${S13$1}7"${S27}InstanceSpecification"${S33}false,"x":-305,"y":1011${S32}436${S30}282${S5$1}${S23}1"${S20}${S31}:${S0}41"}${S54}l${S31}:[${S0}42"}]${S5$1}":${S0}1"}${S2$1}:${S0}15${S1$1}41${S13$1}41"${S20}${S23}6"${S26}c${S23}7"${S26}c":${S0}7"}${S20}":${S0}6"}${S29}P${S44}ableElement${S25}:${S0}12${S1$1}6${S13$1}6"${S27}P${S44}ableElement"${S33}${S58}-9,"y":151${S32}492${S30}275${S5$1}${S23}1"${S54}l${S31}:[${S0}41"},${S0}39"},${S0}40"}]${S22}[${S0}78"},${S0}77"}]${S3$1}":[${S0}64"}]${S20}${S31}:${S0}37"}${S5$1}":${S0}1${S24}[${S0}89"}]${S2$1}:${S0}15${S1$1}39${S13$1}39"${S20}${S23}6"${S26}c${S23}8"${S26}c":${S0}8"}${S20}":${S0}6"}${S29}Type${S25}:${S0}12${S1$1}8${S13$1}8"${S27}Type"${S33}${S58}363,"y":520${S32}499${S30}421${S5$1}${S23}1"${S54}l${S31}:[${S0}45"}]${S22}[${S0}79"},${S0}132"},${S0}133"},${S0}134"},${S0}135${S34}85rqiu8${S45}2s"}]${S20}${S31}:${S0}39"}${S5$1}":${S0}1${S24}[${S0}84"}]${S2$1}:${S0}15${S1$1}45${S13$1}45"${S20}${S23}8"${S26}c${S23}9"${S26}c":${S0}9"}${S20}":${S0}8"}${S29}Classifier${S25}:${S0}12${S24}[${S0}188"},${S0}93"},${S0}91"}]${S19}${S38}9${S13$1}9"${S27}Classifier"${S33}${S58}169,"y":1000${S32}551${S30}520${S5$1}${S23}1"${S54}l${S31}:[${S0}48"},${S0}46"},${S0}47"},${S0}174"}]${S22}[${S0}182"},${S0}81"},${S0}82"},${S0}80"}]${S20}${S31}:${S0}45"}${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}188${S14$1}${S37}r${S15$1}9"${S4$1}class${S23}184${S13$1}188"${S6$1}":${S0}195"},"${S9$1}e${S3$1}":${S0}187"}${S18$1}:${S0}9"}${S16$1}:${S0}184"}${S6$1}${S23}195"${S3$1}${S23}187"${S2$1}:${S0}16${S1$1}195"${S28}[${S0}188"},${S0}182"}],"name":"A_${S43}eRealization_${S37}r"${S10$1}0,"id":"195"${S5$1}${S23}1"${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}182${S14$1}${S43}eRealization${S15$1}184${S8$1}"*"${S11$1}9"${S3$1}${S23}63${S13$1}182"${S6$1}${S23}195","${S9$1}e${S6$1}":${S0}195"}${S16$1}:${S0}9"}${S3$1}":${S0}63"}${S18$1}:${S0}184"}${S2$1}:${S0}22${S1$1}187"${S6$1}End":[${S0}188"}]${S3$1}P${S21}":[${S0}185"}]${S11$1}184"${S18$1}${S35}${S13$1}187"${S16$1}:${S0}184"}${S2$1}:${S0}21${S1$1}93${S13$1}93${S14$1}specific${S8$1}1${S11$1}15${S15$1}9"${S6$1}${S23}54"${S3$1}${S23}66"${S3$1}":${S0}66"}${S6$1}":${S0}54"}${S18$1}:${S0}9"}${S16$1}:${S0}15"}${S2$1}:${S0}22${S1$1}66${S13$1}66"${S18$1}${S35}"${S11$1}15"${S3$1}P${S21}":[${S0}123"}]${S6$1}End":[${S0}93"}]${S16$1}:${S0}15"}${S2$1}:${S0}23${S1$1}123${S13$1}123"${S3$1}${S23}66","p${S21}${S23}92","p${S21}":${S0}92"}${S3$1}":${S0}66"}${S2$1}:${S0}21${S1$1}92${S13$1}92${S14$1}specificId"${S11$1}15${S15$1}26"${S3$1}P${S21}":[${S0}123"}]${S4$1}type":${S0}26"}${S16$1}:${S0}15"}${S2$1}:${S0}16${S1$1}54${S13$1}54${S14$1}A_generalization_specific"${S5$1}${S23}1"${S28}[${S0}93"},${S0}81"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}81${S13$1}81${S14$1}generalization${S8$1}1${S11$1}9${S15$1}15"${S6$1}${S23}54"${S3$1}${S23}63"${S6$1}":${S0}54"},"${S9$1}e${S16$1}:${S0}9"}${S3$1}":${S0}63"}${S18$1}:${S0}15"}${S2$1}:${S0}21${S1$1}91${S13$1}91${S14$1}general${S8$1}1${S11$1}15${S15$1}9"${S6$1}${S23}53"${S3$1}${S23}65"${S3$1}":${S0}65"},"${S9$1}e${S6$1}":${S0}53"}${S18$1}:${S0}9"}${S16$1}:${S0}15"}${S2$1}:${S0}22${S1$1}65${S13$1}65"${S18$1}${S35}"${S11$1}15"${S3$1}P${S21}":[${S0}122"}]${S6$1}End":[${S0}91"}]${S16$1}:${S0}15"}${S2$1}:${S0}23${S1$1}122${S13$1}122"${S3$1}${S23}65","p${S21}${S23}90","p${S21}":${S0}90"}${S3$1}":${S0}65"}${S2$1}:${S0}21${S1$1}90${S13$1}90${S14$1}generalId"${S11$1}15${S15$1}26"${S3$1}P${S21}":[${S0}122"}]${S4$1}type":${S0}26"}${S16$1}:${S0}15"}${S2$1}:${S0}16${S1$1}53${S13$1}53${S14$1}A_general_special${S31}${S5$1}${S23}1"${S28}[${S0}91"},${S0}82"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}82${S13$1}82${S14$1}specialization${S8$1}"*"${S11$1}9${S15$1}15"${S6$1}${S23}53"${S3$1}${S23}63"${S6$1}":${S0}53"},"${S9$1}e${S16$1}:${S0}9"}${S3$1}":${S0}63"}${S18$1}:${S0}15"}${S2$1}:${S0}15${S1$1}46${S13$1}46"${S20}${S23}9"${S26}c${S23}12"${S20}":${S0}9"}${S26}c":${S0}12"}${S2$1}:${S0}15${S1$1}47${S13$1}47"${S20}${S23}9"${S26}c${S23}17"${S26}c":${S0}17"}${S20}":${S0}9"}${S2$1}:${S0}15${S1$1}174"${S20}${S23}9"${S26}c${S23}176${S13$1}174"${S20}":${S0}9"}${S26}c":${S0}176"}${S2$1}:${S0}21${S1$1}80${S13$1}80${S14$1}isAbstract"${S11$1}9${S15$1}25"${S18$1}:${S0}25"}${S4$1}${S9$1}e${S16$1}:${S0}9"}${S29}Boolean${S25}:${S0}18${S24}[${S0}80"},${S0}32"},${S0}107"},${S0}108"},${S0}109"}]${S19}${S38}25${S13$1}25${S48}Boolean${S36}BOOL"${S5$1}${S23}2"${S10$1}0${S5$1}":${S0}2"}${S2$1}:${S0}21${S1$1}32${S13$1}32${S14$1}autoGenerate"${S11$1}21${S15$1}25"${S18$1}:${S0}25"}${S4$1}${S9$1}e${S16$1}:${S0}21"}${S2$1}:${S0}21${S1$1}107${S13$1}107${S14$1}autoIncrement"${S11$1}21${S15$1}25"${S18$1}:${S0}25"}${S4$1}${S9$1}e${S16$1}:${S0}21"}${S2$1}:${S0}21${S1$1}108${S13$1}108${S14$1}unsigned"${S11$1}21${S15$1}25"${S18$1}:${S0}25"}${S4$1}${S9$1}e${S16$1}:${S0}21"}${S2$1}:${S0}21${S1$1}109${S13$1}109${S14$1}unique"${S11$1}21${S15$1}25"${S18$1}:${S0}25"}${S4$1}${S9$1}e${S16$1}:${S0}21"}${S2$1}:${S0}13${S1$1}2${S13$1}2${S14$1}PrimitiveTypes","version":"1.0.0","p${S44}${S53}t":[${S0}24"},${S0}26"},${S0}25"},${S0}28"},${S0}27"}]${S5$1}":${S0}1"}${S5$1}${S23}1"${S29}P${S44}${S25}:${S0}12${S24}[${S0}210"},${S0}216"},${S0}78"},${S0}141"},${S0}139"},${S7$1}fg3kkoo${S17$1}42"}]${S19}${S38}13${S13$1}13"${S27}P${S44}${S56}-919,"y":428${S32}756${S30}485${S5$1}${S23}1"${S20}${S31}:${S0}40"}${S54}l${S31}:[${S0}51"}]${S22}[${S0}204"},${S0}212"},${S0}89"},${S0}167"},${S0}166"},${S7$1}fg3kkio${S17$1}16"},${S0}29${S34}85rqj1c${S45}60${S34}${S52}1"}]${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}210${S14$1}${S51}e${S15$1}13"${S4$1}class":${S0}207"}${S11$1}207"${S3$1}":${S0}209"}${S40}10"${S6$1}":${S0}211"},"${S9$1}e${S18$1}:${S0}13"}${S6$1}${S23}211"${S3$1}${S23}209"${S29}P${S44}Import${S25}:${S0}12${S1$1}207","type${S53}t":[${S0}204"},${S0}212"}],"x":-1947,"y":215${S32}572${S30}296${S3$1}":[${S0}215"},${S0}209"}]${S22}[${S0}210"},${S0}216"},${S0}213"},${S0}205"}]${S40}07"${S5$1}${S23}1"${S20}${S31}:${S0}203"}${S27}P${S44}Import"${S33}false${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}204${S14$1}ownedP${S44}Import${S15$1}207${S8$1}"*"${S11$1}13"${S3$1}${S23}63${S13$1}204"${S6$1}":${S0}211"},"${S9$1}e${S18$1}:${S0}207"}${S16$1}:${S0}13"}${S3$1}":${S0}63"}${S6$1}${S23}211"${S2$1}:${S0}16${S1$1}211${S14$1}A_p${S44}Import_${S51}e"${S28}[${S0}210"},${S0}204"}]${S10$1}0${S40}11"${S5$1}${S23}1"${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}212${S14$1}p${S44}Import${S15$1}207${S8$1}"*"${S11$1}13"${S3$1}${S23}63${S13$1}212"${S6$1}":${S0}217"},"${S9$1}e${S18$1}:${S0}207"}${S16$1}:${S0}13"}${S3$1}":${S0}63"}${S6$1}${S23}217"${S2$1}:${S0}16${S1$1}217${S14$1}A_importedP${S44}_p${S44}Import"${S28}[${S0}212"},${S0}216"}]${S10$1}0${S40}17"${S5$1}${S23}1"${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}216${S14$1}importedP${S44}${S15$1}13"${S4$1}class${S23}207"${S3$1}":${S0}215"}${S40}16"${S6$1}${S23}217","${S9$1}e${S6$1}":${S0}217"}${S16$1}:${S0}207"}${S18$1}:${S0}13"}${S3$1}${S23}215"${S2$1}:${S0}22${S1$1}215"${S6$1}End":[${S0}216"}]${S11$1}207"${S18$1}${S35}"${S3$1}P${S21}":[${S0}214"}]${S40}15"${S16$1}:${S0}207"}${S2$1}:${S0}23${S1$1}214","p${S21}":${S0}213"}${S40}14"${S3$1}${S23}215"${S3$1}":${S0}215"},"p${S21}${S23}213"${S2$1}:${S0}21${S1$1}213"${S3$1}P${S21}":[${S0}214"}]${S11$1}207${S14$1}importedP${S44}Id${S15$1}26"${S4$1}id":"213","${S9$1}e${S16$1}:${S0}207"}${S18$1}:${S0}26"}${S2$1}:${S0}22${S1$1}209"${S6$1}End":[${S0}210"}]${S11$1}207"${S18$1}${S35}"${S3$1}P${S21}":[${S0}208"}]${S40}09"${S16$1}:${S0}207"}${S2$1}:${S0}23${S1$1}208","p${S21}":${S0}205"}${S40}08"${S3$1}${S23}209"${S3$1}":${S0}209"},"p${S21}${S23}205"${S2$1}:${S0}21${S1$1}205"${S3$1}P${S21}":[${S0}208"}]${S11$1}207${S14$1}${S51}eId${S15$1}26"${S4$1}id":"205","${S9$1}e${S16$1}:${S0}207"}${S18$1}:${S0}26"}${S2$1}:${S0}15${S1$1}203"${S20}${S23}4"${S26}c${S23}207${S13$1}203"${S26}c":${S0}207"}${S20}":${S0}4"}${S2$1}:${S0}21${S1$1}78${S13$1}78${S14$1}owningP${S44}${S8$1}1${S11$1}6${S15$1}13"${S6$1}${S23}52"${S3$1}${S23}64","${S9$1}e${S6$1}":${S0}52"}${S3$1}":${S0}64"}${S16$1}:${S0}6"}${S18$1}:${S0}13"}${S2$1}:${S0}16${S1$1}52${S13$1}52${S14$1}A_p${S44}${S53}t_owningP${S44}"${S5$1}${S23}1"${S28}[${S0}78"},${S0}89"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}89${S13$1}89${S14$1}p${S44}${S53}t${S8$1}"*"${S11$1}13${S15$1}6"${S6$1}${S23}52"${S3$1}${S23}63","${S9$1}e${S6$1}":${S0}52"}${S18$1}:${S0}6"}${S16$1}:${S0}13"}${S3$1}":${S0}63"}${S2$1}:${S0}22${S1$1}64${S13$1}64"${S18$1}${S35}"${S11$1}6"${S3$1}P${S21}":[${S0}121"}]${S6$1}End":[${S0}78"}]${S16$1}:${S0}6"}${S2$1}:${S0}23${S1$1}121${S13$1}121"${S3$1}${S23}64","p${S21}${S23}77"${S3$1}":${S0}64"},"p${S21}":${S0}77"}${S2$1}:${S0}21${S1$1}77${S13$1}77${S14$1}owningP${S44}Id"${S11$1}6${S15$1}26"${S3$1}P${S21}":[${S0}121"}]${S4$1}${S9$1}e${S16$1}:${S0}6"}${S18$1}:${S0}26"}${S2$1}:${S0}21${S1$1}141${S13$1}141${S14$1}${S50}m${S8$1}1${S11$1}136${S15$1}13"${S6$1}${S23}162"${S3$1}${S23}145"${S6$1}":${S0}162"},"${S9$1}e${S3$1}":${S0}145"}${S16$1}:${S0}136"}${S18$1}:${S0}13"}${S2$1}:${S0}16${S1$1}162${S13$1}162${S14$1}"${S5$1}${S23}1"${S28}[${S0}141"},${S0}167"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}167${S13$1}167${S14$1}upstream${S8$1}"*"${S11$1}13${S15$1}136"${S6$1}${S23}162"${S3$1}${S23}63","${S9$1}e${S6$1}":${S0}162"}${S18$1}:${S0}136"}${S16$1}:${S0}13"}${S3$1}":${S0}63"}${S29}P${S44}${S49}n${S25}:${S0}12${S1$1}136${S13$1}136${S56}-2324,"y":586${S32}527${S30}328${S5$1}${S23}1"${S20}${S31}:${S0}137"}${S22}[${S0}141"},${S0}138"},${S0}139"},${S0}140"},${S0}142${S34}dtbodbr${S46}39"}]${S3$1}":[${S0}143"},${S0}145"}]${S27}P${S44}${S49}n"${S5$1}":${S0}1${S24}[${S0}167"},${S0}166"},${S0}153"}]${S2$1}:${S0}15${S1$1}137${S13$1}137"${S20}${S23}4"${S26}c${S23}136"${S26}c":${S0}136"}${S20}":${S0}4"}${S2$1}:${S0}21${S1$1}138${S13$1}138${S14$1}upstreamId"${S11$1}136${S15$1}26"${S3$1}P${S21}":[${S0}144"}]${S4$1}${S9$1}e${S16$1}:${S0}136"}${S18$1}:${S0}26"}${S2$1}:${S0}23${S1$1}144${S13$1}144"${S3$1}${S23}143","p${S21}${S23}138"${S3$1}":${S0}143"},"p${S21}":${S0}138"}${S2$1}:${S0}22${S1$1}143${S13$1}143"${S18$1}${S35}"${S11$1}136"${S3$1}P${S21}":[${S0}144"}]${S6$1}End":[${S0}139"}]${S16$1}:${S0}136"}${S2$1}:${S0}21${S1$1}139${S13$1}139${S14$1}upstream${S8$1}1${S11$1}136${S15$1}13"${S6$1}${S23}161"${S3$1}${S23}143"${S6$1}":${S0}161"},"${S9$1}e${S3$1}":${S0}143"}${S16$1}:${S0}136"}${S18$1}:${S0}13"}${S2$1}:${S0}16${S1$1}161${S13$1}161${S14$1}"${S5$1}${S23}1"${S28}[${S0}139"},${S0}166"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}166${S13$1}166${S14$1}${S50}m${S8$1}"*"${S11$1}13${S15$1}136"${S6$1}${S23}161"${S3$1}${S23}63","${S9$1}e${S6$1}":${S0}161"}${S18$1}:${S0}136"}${S16$1}:${S0}13"}${S3$1}":${S0}63"}${S2$1}:${S0}21${S1$1}140${S13$1}140${S14$1}${S50}mId"${S11$1}136${S15$1}26"${S3$1}P${S21}":[${S0}146"}]${S4$1}${S9$1}e${S16$1}:${S0}136"}${S18$1}:${S0}26"}${S2$1}:${S0}23${S1$1}146${S13$1}146"${S3$1}${S23}145","p${S21}${S23}140"${S3$1}":${S0}145"},"p${S21}":${S0}140"}${S2$1}:${S0}22${S1$1}145${S13$1}145"${S18$1}${S35}"${S11$1}136"${S3$1}P${S21}":[${S0}146"}]${S6$1}End":[${S0}141"}]${S16$1}:${S0}136"}${S2$1}:${S0}21${S1$1}142${S13$1}142${S14$1}class${S49}n${S8$1}"*"${S11$1}136${S15$1}147"${S6$1}${S23}163"${S3$1}${S23}63"${S16$1}:${S0}136"}${S6$1}":${S0}163"}${S18$1}:${S0}147"}${S3$1}":${S0}63"}${S2$1}:${S0}16${S1$1}163${S13$1}163${S14$1}"${S5$1}${S23}1"${S28}[${S0}142"},${S0}153"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}153${S13$1}153${S14$1}p${S44}${S49}n${S8$1}1${S11$1}147${S15$1}136"${S6$1}${S23}163"${S3$1}${S23}158"${S3$1}":${S0}158"}${S6$1}":${S0}163"}${S18$1}:${S0}136"},"${S9$1}e${S16$1}:${S0}147"}${S2$1}:${S0}22${S1$1}158${S13$1}158"${S18$1}${S35}"${S11$1}147"${S3$1}P${S21}":[${S0}159"}]${S6$1}End":[${S0}153"}]${S16$1}:${S0}147"}${S2$1}:${S0}23${S1$1}159${S13$1}159"${S3$1}${S23}158","p${S21}${S23}160","p${S21}":${S0}160"}${S3$1}":${S0}158"}${S2$1}:${S0}21${S1$1}160${S13$1}160${S14$1}p${S44}${S49}nId"${S11$1}147${S15$1}26"${S3$1}P${S21}":[${S0}159"}]${S4$1}${S9$1}e${S16$1}:${S0}147"}${S18$1}:${S0}26"}${S29}Class${S49}n${S25}:${S0}12${S24}[${S0}142"},${S0}168"},${S0}169"},${S7$1}6qlaqem${S12$1}6o"}]${S19}${S38}147${S13$1}147${S56}-1921,"y":3635${S32}632${S30}408${S5$1}${S23}1"${S20}${S31}:${S0}148"}${S22}[${S0}150"},${S0}153"},${S0}160"},${S0}152"},${S0}151"},${S7$1}6qlaqam${S12$1}6e"},${S0}149${S34}dtbohlc${S46}64"}]${S3$1}":[${S0}158"},${S0}156"},${S0}154"}]${S27}Class${S49}n"${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}168${S14$1}${S50}m${S15$1}147${S8$1}"*"${S6$1}":${S0}164"}${S6$1}${S23}164"${S11$1}12${S13$1}168","${S9$1}e${S3$1}${S23}63"${S18$1}:${S0}147"}${S3$1}":${S0}63"}${S16$1}:${S0}12"}${S2$1}:${S0}16${S1$1}164${S13$1}164${S14$1}"${S5$1}${S23}1"${S28}[${S0}150"},${S0}168"}]${S10$1}0${S33}false${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}169${S14$1}upstream${S15$1}147${S8$1}"*"${S6$1}":${S0}165"}${S6$1}${S23}165"${S11$1}12${S13$1}169"${S3$1}${S23}63","${S9$1}e${S18$1}:${S0}147"}${S3$1}":${S0}63"}${S16$1}:${S0}12"}${S2$1}:${S0}16${S1$1}165${S13$1}165${S14$1}"${S5$1}${S23}1"${S28}[${S0}169"},${S0}152"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}152${S13$1}152${S14$1}${S50}m"${S4$1}class${S23}147${S15$1}12"${S6$1}${S23}165"${S3$1}${S23}156"${S3$1}":${S0}156"},"${S9$1}e${S6$1}":${S0}165"}${S16$1}:${S0}147"}${S18$1}:${S0}12"}${S2$1}:${S0}22${S1$1}156${S13$1}156"${S18$1}${S35}"${S11$1}147"${S3$1}P${S21}":[${S0}157"}]${S6$1}End":[${S0}152"}]${S16$1}:${S0}147"}${S2$1}:${S0}23${S1$1}157${S13$1}157"${S3$1}${S23}156","p${S21}${S23}151","p${S21}":${S0}151"}${S3$1}":${S0}156"}${S2$1}:${S0}21${S1$1}151${S13$1}151${S14$1}${S50}mId"${S11$1}147${S15$1}26"${S3$1}P${S21}":[${S0}157"}]${S4$1}${S9$1}e${S16$1}:${S0}147"}${S18$1}:${S0}26"}${S2$1}:${S0}21"}${S19}1c6qlaqem${S12$1}6o${S13$1}225${S14$1}class${S49}n${S15$1}147"${S4$1}class${S23}206"${S18$1}:${S0}147"}${S16$1}:${S7$1}6ql3un6${S12$1}6e"}${S3$1}":${S7$1}6qlaqf6${S12$1}2t"}${S6$1}":${S7$1}6qlaqo6${S12$1}4s"}${S3$1}${S23}226"${S6$1}${S23}229"${S29}P${S21}${S49}n${S25}:${S0}12"}${S22}[${S7$1}6qlaqem${S12$1}6o"},${S7$1}6qmeil6${S12$1}0o"},${S7$1}6qmeim6${S12$1}84"},${S7$1}6qlaqfm${S12$1}fs"},${S7$1}6qmgo06${S12$1}5f"},${S7$1}6qmgo16${S12$1}33"}]${S3$1}":[${S7$1}6qmeilm${S12$1}77"},${S7$1}6qlaqf6${S12$1}2t"},${S7$1}6qmgo0m${S12$1}0q"}],"type${S53}t":[${S7$1}6qmeifm${S12$1}0h"},${S7$1}6qmgnr6${S12$1}32"},${S7$1}6qlaqam${S12$1}6e"}]${S19}1c6ql3un6${S12$1}6e${S13$1}206${S56}2562,"y":3603${S32}605${S30}420${S5$1}${S23}1"${S5$1}":${S0}1"}${S20}${S31}:${S7$1}6qlnqd6${S12$1}76"}${S2$1}:${S0}21"}${S19}1c6qmeil6${S12$1}0o${S13$1}222${S14$1}upstream${S15$1}21"${S4$1}class${S23}206"${S18$1}:${S0}21"}${S16$1}:${S7$1}6ql3un6${S12$1}6e"}${S3$1}":${S7$1}6qmeilm${S12$1}77"}${S6$1}":${S7$1}6qmeiv6${S12$1}5u"}${S3$1}${S23}230"${S6$1}${S23}233"${S2$1}:${S0}22"}${S3$1}P${S21}":[${S7$1}6qmeim6${S12$1}62"}]${S6$1}End":[${S7$1}6qmeil6${S12$1}0o"}]${S19}1c6qmeilm${S12$1}77${S13$1}230"${S11$1}206"${S18$1}${S35}"${S16$1}:${S7$1}6ql3un6${S12$1}6e"}${S2$1}:${S0}23"}${S19}1c6qmeim6${S12$1}62${S13$1}231"${S3$1}${S23}230","p${S21}":${S7$1}6qmeim6${S12$1}84"}${S3$1}":${S7$1}6qmeilm${S12$1}77"},"p${S21}${S23}232"${S2$1}:${S0}21"}${S3$1}P${S21}":[${S7$1}6qmeim6${S12$1}62"}]${S19}1c6qmeim6${S12$1}84"${S39}1${S13$1}232"${S11$1}206${S14$1}upstreamId${S15$1}26"${S16$1}:${S7$1}6ql3un6${S12$1}6e"}${S18$1}:${S0}26"}${S2$1}:${S0}16"}${S28}[${S7$1}6qmeil6${S12$1}0o"},${S7$1}6qmeifm${S12$1}0h"}]${S19}1c6qmeiv6${S12$1}5u"${S10$1}0${S40}33${S14$1}"${S5$1}${S23}1"${S5$1}":${S0}1"}${S2$1}:${S0}21"}${S19}1c6qmeifm${S12$1}0h${S13$1}220${S14$1}${S50}m${S15$1}206${S8$1}"*"${S11$1}21"${S3$1}${S23}63"${S6$1}${S23}233"${S18$1}:${S7$1}6ql3un6${S12$1}6e"}${S16$1}:${S0}21"}${S3$1}":${S0}63"}${S6$1}":${S7$1}6qmeiv6${S12$1}5u"}${S2$1}:${S0}21"}${S3$1}P${S21}":[${S7$1}6qlaqfm${S12$1}77"}]${S19}1c6qlaqfm${S12$1}fs"${S39}1${S13$1}228"${S11$1}206${S14$1}class${S49}nId${S15$1}26"${S16$1}:${S7$1}6ql3un6${S12$1}6e"}${S18$1}:${S0}26"}${S2$1}:${S0}23"}${S19}1c6qlaqfm${S12$1}77${S13$1}227","p${S21}${S23}228","p${S21}":${S7$1}6qlaqfm${S12$1}fs"}${S3$1}":${S7$1}6qlaqf6${S12$1}2t"}${S3$1}${S23}226"${S2$1}:${S0}22"}${S3$1}P${S21}":[${S7$1}6qlaqfm${S12$1}77"}]${S6$1}End":[${S7$1}6qlaqem${S12$1}6o"}]${S19}1c6qlaqf6${S12$1}2t${S13$1}226"${S11$1}206"${S18$1}${S35}"${S16$1}:${S7$1}6ql3un6${S12$1}6e"}${S2$1}:${S0}21"}${S19}1c6qmgo06${S12$1}5f${S13$1}235${S14$1}${S50}m${S15$1}21"${S4$1}class${S23}206"${S18$1}:${S0}21"}${S16$1}:${S7$1}6ql3un6${S12$1}6e"}${S3$1}":${S7$1}6qmgo0m${S12$1}0q"}${S6$1}":${S7$1}6qmgoam${S12$1}7k"}${S3$1}${S23}236"${S6$1}${S23}239"${S2$1}:${S0}22"}${S3$1}P${S21}":[${S7$1}6qmgo0m${S12$1}d3"}]${S6$1}End":[${S7$1}6qmgo06${S12$1}5f"}]${S19}1c6qmgo0m${S12$1}0q${S13$1}236"${S11$1}206"${S18$1}${S35}"${S16$1}:${S7$1}6ql3un6${S12$1}6e"}${S2$1}:${S0}23"}${S19}1c6qmgo0m${S12$1}d3${S13$1}237"${S3$1}${S23}236","p${S21}":${S7$1}6qmgo16${S12$1}33"}${S3$1}":${S7$1}6qmgo0m${S12$1}0q"},"p${S21}${S23}238"${S2$1}:${S0}21"}${S3$1}P${S21}":[${S7$1}6qmgo0m${S12$1}d3"}]${S19}1c6qmgo16${S12$1}33"${S39}1${S13$1}238"${S11$1}206${S14$1}${S50}mId${S15$1}26"${S16$1}:${S7$1}6ql3un6${S12$1}6e"}${S18$1}:${S0}26"}${S2$1}:${S0}16"}${S28}[${S7$1}6qmgo06${S12$1}5f"},${S7$1}6qmgnr6${S12$1}32"}]${S19}1c6qmgoam${S12$1}7k"${S10$1}0${S40}39${S14$1}"${S5$1}${S23}1"${S5$1}":${S0}1"}${S2$1}:${S0}21"}${S19}1c6qmgnr6${S12$1}32${S13$1}234${S14$1}upstream${S15$1}206${S8$1}"*"${S11$1}21"${S3$1}${S23}63"${S6$1}${S23}239"${S18$1}:${S7$1}6ql3un6${S12$1}6e"}${S16$1}:${S0}21"}${S3$1}":${S0}63"}${S6$1}":${S7$1}6qmgoam${S12$1}7k"}${S2$1}:${S0}21"}${S19}1c6qlaqam${S12$1}6e${S13$1}224${S14$1}p${S21}${S49}n${S15$1}206${S8$1}"*"${S11$1}147"${S3$1}${S23}63"${S18$1}:${S7$1}6ql3un6${S12$1}6e"}${S16$1}:${S0}147"}${S3$1}":${S0}63"}${S6$1}":${S7$1}6qlaqo6${S12$1}4s"}${S6$1}${S23}229"${S2$1}:${S0}16"}${S28}[${S7$1}6qlaqem${S12$1}6o"},${S7$1}6qlaqam${S12$1}6e"}]${S19}1c6qlaqo6${S12$1}4s"${S10$1}0${S40}29${S14$1}"${S5$1}${S23}1"${S5$1}":${S0}1"}${S2$1}:${S0}15"}${S19}1c6qlnqd6${S12$1}76${S13$1}219"${S20}${S23}4"${S26}c${S23}206"${S20}":${S0}4"}${S26}c":${S7$1}6ql3un6${S12$1}6e"}${S2$1}:${S0}15${S1$1}148${S13$1}148"${S20}${S23}4"${S26}c${S23}147"${S26}c":${S0}147"}${S20}":${S0}4"}${S2$1}:${S0}21${S1$1}149${S13$1}149${S14$1}upstreamId"${S11$1}147${S15$1}26"${S3$1}P${S21}":[${S0}155"}]${S4$1}${S9$1}e${S16$1}:${S0}147"}${S18$1}:${S0}26"}${S2$1}:${S0}23${S1$1}155${S13$1}155"${S3$1}${S23}154","p${S21}${S23}149"${S3$1}":${S0}154"},"p${S21}":${S0}149"}${S2$1}:${S0}22${S1$1}154${S13$1}154"${S18$1}${S35}"${S11$1}147"${S3$1}P${S21}":[${S0}155"}]${S6$1}End":[${S0}150"}]${S16$1}:${S0}147"}${S2$1}:${S0}21"}${S19}1dtbohlc${S46}64${S13$1}254${S14$1}status${S15$1}26"${S4$1}class${S23}147"${S18$1}:${S0}26"}${S16$1}:${S0}147"}${S2$1}:${S0}21"}${S19}1dtbodbr${S46}39${S13$1}253${S14$1}status${S15$1}26"${S4$1}class${S23}136"${S18$1}:${S0}26"}${S16$1}:${S0}136"}${S2$1}:${S0}21"}${S19}1cfg3kkoo${S17$1}42${S13$1}242${S14$1}p${S44}"${S18$1}:${S0}13"},"type${S23}13"${S4$1}class":${S7$1}fg1ue48${S17$1}2l"}${S11$1}223"${S3$1}":${S7$1}fg3kkp8${S17$1}3q"}${S6$1}":${S7$1}fg3kl18${S17$1}5i"}${S6$1}${S23}247"${S3$1}${S23}244"${S29}P${S44}Cache${S25}:${S0}12"}${S19}1cfg1ue48${S17$1}2l","type${S53}t":[${S7$1}fg3kkio${S17$1}16"}]${S40}23${S56}-1467,"y":1745${S32}537${S30}320${S3$1}":[${S7$1}fhi4dob${S47}7"},${S7$1}fg3kkp8${S17$1}3q"}]${S22}[${S7$1}fg3kkoo${S17$1}42"},${S7$1}fg3kkpo${S17$1}ak"},${S7$1}fg5uiio${S17$1}71"},${S7$1}fg8qfso${S17$1}37"},${S7$1}fg8qloo${S17$1}4h"},${S7$1}fg92obo${S17$1}07"},${S7$1}${S55}d"}]${S5$1}":${S0}1"}${S5$1}${S23}1"${S2$1}:${S0}21"}${S19}1cfg3kkio${S17$1}16${S13$1}241${S14$1}p${S44}Cache"${S18$1}:${S7$1}fg1ue48${S17$1}2l"},"type${S23}223${S8$1}1${S16$1}:${S0}13"}${S11$1}13"${S3$1}":${S0}63"}${S3$1}${S23}63"${S6$1}":${S7$1}fg3kl18${S17$1}5i"}${S6$1}${S23}247"${S2$1}:${S0}16"}${S19}1cfg3kl18${S17$1}5i"${S10$1}0${S40}47${S14$1}"${S28}[${S7$1}fg3kkoo${S17$1}42"},${S7$1}fg3kkio${S17$1}16"}]${S5$1}":${S0}1"}${S5$1}${S23}1"${S2$1}:${S0}22"}${S19}1cfhi4dob${S47}7"${S3$1}P${S21}":[${S7$1}fhi67pr${S47}l"}]${S40}43"${S18$1}:"primary"${S16$1}:${S7$1}fg1ue48${S17$1}2l"}${S11$1}223"${S2$1}:${S0}23"}${S19}1cfhi67pr${S47}l${S13$1}240"${S3$1}":${S7$1}fhi4dob${S47}7"}${S3$1}${S23}243","p${S21}":${S7$1}fg3kkpo${S17$1}ak"},"p${S21}${S23}246"${S2$1}:${S0}21"}${S19}1cfg3kkpo${S17$1}ak"${S3$1}P${S21}":[${S7$1}fhi67pr${S47}l"},${S7$1}fg3kkpo${S17$1}3f"}]${S39}1${S13$1}246"${S16$1}:${S7$1}fg1ue48${S17$1}2l"}${S11$1}223${S14$1}p${S44}Id"${S18$1}:${S0}26"},"type${S23}26"${S2$1}:${S0}23"}${S19}1cfg3kkpo${S17$1}3f${S13$1}245","p${S21}":${S7$1}fg3kkpo${S17$1}ak"},"p${S21}${S23}246"${S3$1}":${S7$1}fg3kkp8${S17$1}3q"}${S3$1}${S23}244"${S2$1}:${S0}22"}${S19}1cfg3kkp8${S17$1}3q"${S6$1}End":[${S7$1}fg3kkoo${S17$1}42"}]${S40}44"${S16$1}:${S7$1}fg1ue48${S17$1}2l"}${S11$1}223"${S18$1}${S35}"${S3$1}P${S21}":[${S7$1}fg3kkpo${S17$1}3f"}]${S2$1}:${S0}21"}${S19}1cfg5uiio${S17$1}71${S13$1}248${S14$1}json"${S18$1}:${S0}24"},"type${S23}24"${S4$1}class":${S7$1}fg1ue48${S17$1}2l"}${S11$1}223${S36}MEDIUMTEXT"${S2$1}:${S0}21"}${S19}1cfg8qfso${S17$1}37${S13$1}249${S14$1}js"${S18$1}:${S0}24"},"type${S23}24"${S4$1}class":${S7$1}fg1ue48${S17$1}2l"}${S11$1}223${S36}MEDIUMTEXT"${S2$1}:${S0}21"}${S19}1cfg8qloo${S17$1}4h${S13$1}250${S14$1}ts"${S18$1}:${S0}24"},"type${S23}24"${S4$1}class":${S7$1}fg1ue48${S17$1}2l"}${S11$1}223${S36}MEDIUMTEXT"${S2$1}:${S0}21"}${S19}1cfg92obo${S17$1}07${S13$1}251${S14$1}python"${S18$1}:${S0}24"},"type${S23}24"${S4$1}class":${S7$1}fg1ue48${S17$1}2l"}${S11$1}223${S36}MEDIUMTEXT"${S2$1}:${S0}21"}${S19}1c${S55}d${S13$1}252${S14$1}lastModified"${S18$1}:${S0}26"},"type${S23}26"${S4$1}class":${S7$1}fg1ue48${S17$1}2l"}${S11$1}223"${S2$1}:${S0}15${S1$1}40${S13$1}40"${S20}${S23}6"${S26}c${S23}13"${S20}":${S0}6"}${S26}c":${S0}13"}${S2$1}:${S0}15${S1$1}51${S13$1}51"${S20}${S23}13"${S26}c${S23}14"${S20}":${S0}13"}${S26}c":${S0}14"}${S2$1}:${S0}21${S1$1}29${S13$1}29${S14$1}version"${S11$1}13${S15$1}24"${S4$1}${S9$1}e${S16$1}:${S0}13"}${S18$1}:${S0}24"}${S2$1}:${S0}21"}${S19}185rqj1c${S45}60${S14$1}p${S44}AccessList${S8$1}"*"${S11$1}13"${S16$1}:${S0}13"}${S3$1}${S23}63"${S3$1}":${S0}63"},"${S9$1}e${S40}91025169383333888${S15$1}290623399508611072"${S6$1}${S23}291025166497652736"${S2$1}:${S0}21"}${S19}1${S52}1${S14$1}authServerP${S44}ApprovalList${S8$1}"*"${S16$1}:${S0}13"}${S11$1}13"${S3$1}":${S0}63"}${S3$1}${S23}63${S13$1}371195177237278720${S15$1}371195174922022914"${S6$1}${S23}371195174922022913"${S29}UnlimitedNatural${S25}:${S0}18${S24}[${S0}86"}]${S19}${S38}28${S13$1}28${S48}UnlimitedNatural${S36}VARCHAR(3)"${S5$1}${S23}2"${S10$1}0${S5$1}":${S0}2"}${S2$1}:${S0}21${S1$1}86${S13$1}86${S14$1}upperValue${S42}1${S11$1}11${S15$1}28"${S18$1}:${S0}28"}${S4$1}class":${S0}11"}${S29}StructuralFeature${S25}:${S0}12${S1$1}11${S13$1}11"${S27}StructuralFeature"${S33}${S58}2367,"y":791${S32}483${S30}322${S5$1}${S23}1"${S54}l${S31}:[${S0}44"}]${S22}[${S0}86"},${S0}85"}]${S20}${S31}:${S0}43"}${S5$1}":${S0}1"}${S2$1}:${S0}15${S1$1}44${S13$1}44"${S20}${S23}11"${S26}c${S23}21"${S20}":${S0}11"}${S26}c":${S0}21"}${S2$1}:${S0}21${S1$1}85${S13$1}85${S14$1}lowerValue${S42}1${S11$1}11${S15$1}26"${S4$1}class":${S0}11"}${S18$1}:${S0}26"}${S2$1}:${S0}15${S1$1}43${S13$1}43"${S20}${S23}10"${S26}c${S23}11"${S26}c":${S0}11"}${S20}":${S0}10"}${S29}Type${S53}t${S25}:${S0}12${S1$1}10${S13$1}10"${S27}Type${S53}t"${S33}${S58}2386,"y":219${S32}474${S30}285${S5$1}${S23}1"${S20}${S31}:${S0}38"}${S54}l${S31}:[${S0}43"}]${S22}[${S0}83"},${S0}84"}]${S3$1}":[${S0}68"}]${S5$1}":${S0}1${S24}[${S0}79"}]${S2$1}:${S0}15${S1$1}38${S13$1}38"${S20}${S23}5"${S26}c${S23}10"${S20}":${S0}5"}${S26}c":${S0}10"}${S29}Name${S53}t${S25}:${S0}12${S1$1}5${S13$1}5"${S27}Name${S53}t"${S33}${S58}-88,"y":-157${S32}461${S30}229${S5$1}${S23}1"${S54}l${S31}:[${S0}38"},${S0}37"}]${S22}[${S0}76"}]${S20}${S31}:${S0}33"}${S5$1}":${S0}1"}${S2$1}:${S0}15${S1$1}37${S13$1}37"${S20}${S23}5"${S26}c${S23}6"${S20}":${S0}5"}${S26}c":${S0}6"}${S2$1}:${S0}21${S1$1}76${S13$1}76${S14$1}name"${S11$1}5${S15$1}24"${S4$1}${S9$1}e${S16$1}:${S0}5"}${S18$1}:${S0}24"}${S2$1}:${S0}15${S1$1}33${S13$1}33"${S20}${S23}4"${S26}c${S23}5"${S26}c":${S0}5"}${S20}":${S0}4"}${S2$1}:${S0}21${S1$1}83${S13$1}83${S14$1}typeId"${S11$1}10${S15$1}26"${S3$1}P${S21}":[${S0}125"}]${S4$1}class":${S0}10"}${S18$1}:${S0}26"}${S2$1}:${S0}23${S1$1}125${S13$1}125"${S3$1}${S23}68","p${S21}${S23}83"${S3$1}":${S0}68"},"p${S21}":${S0}83"}${S2$1}:${S0}22${S1$1}68${S13$1}68"${S18$1}${S35}"${S11$1}10"${S3$1}P${S21}":[${S0}125"}]${S6$1}End":[${S0}84"}]${S16$1}:${S0}10"}${S2$1}:${S0}21${S1$1}84${S13$1}84${S14$1}type${S8$1}1${S11$1}10${S15$1}8"${S6$1}${S23}55"${S3$1}${S23}68"${S6$1}":${S0}55"}${S3$1}":${S0}68"}${S16$1}:${S0}10"}${S18$1}:${S0}8"}${S2$1}:${S0}16${S1$1}55${S13$1}55${S14$1}A_type_type${S53}t"${S5$1}${S23}1"${S28}[${S0}84"},${S0}79"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}79${S13$1}79${S14$1}type${S53}t${S8$1}"*"${S11$1}8${S15$1}10"${S6$1}${S23}55"${S3$1}${S23}63"${S18$1}:${S0}10"}${S6$1}":${S0}55"},"${S9$1}e${S16$1}:${S0}8"}${S3$1}":${S0}63"}${S29}Real${S25}:${S0}18${S24}[${S0}132"},${S0}133"},${S0}134"},${S0}135"}]${S19}${S38}27${S13$1}27${S48}Number${S36}DOUBLE"${S5$1}${S23}2"${S10$1}0${S5$1}":${S0}2"}${S2$1}:${S0}21${S1$1}132${S13$1}132${S14$1}x${S42}50${S11$1}8${S15$1}27"${S18$1}:${S0}27"}${S4$1}${S9$1}e${S16$1}:${S0}8"}${S2$1}:${S0}21${S1$1}133${S13$1}133${S14$1}y${S42}50${S11$1}8${S15$1}27"${S18$1}:${S0}27"}${S4$1}${S9$1}e${S16$1}:${S0}8"}${S2$1}:${S0}21${S1$1}134${S13$1}134${S14$1}width${S42}350${S11$1}8${S15$1}27"${S18$1}:${S0}27"}${S4$1}${S9$1}e${S16$1}:${S0}8"}${S2$1}:${S0}21${S1$1}135${S13$1}135${S14$1}height${S42}350${S11$1}8${S15$1}27"${S18$1}:${S0}27"}${S4$1}${S9$1}e${S16$1}:${S0}8"}${S2$1}:${S0}21"}${S19}185rqiu8${S45}2s${S14$1}typeAccessList${S8$1}"*"${S11$1}8"${S16$1}:${S0}8"}${S3$1}${S23}63"${S3$1}":${S0}63"},"${S9$1}e${S40}91025169374945280${S15$1}290623399449890816"${S6$1}${S23}291025166329880576"${S2$1}:${S0}21${S1$1}97${S13$1}97${S14$1}e${S59}nId"${S11$1}20${S15$1}26"${S3$1}P${S21}":[${S0}124"}]${S4$1}class":${S0}20"}${S18$1}:${S0}26"}${S2$1}:${S0}23${S1$1}124${S13$1}124"${S3$1}${S23}67","p${S21}${S23}97"${S3$1}":${S0}67"},"p${S21}":${S0}97"}${S2$1}:${S0}22${S1$1}67${S13$1}67"${S18$1}${S35}"${S11$1}20"${S3$1}P${S21}":[${S0}124"}]${S6$1}End":[${S0}98"}]${S16$1}:${S0}20"}${S2$1}:${S0}21${S1$1}98${S13$1}98${S14$1}e${S59}n${S8$1}1${S11$1}20${S15$1}19"${S6$1}${S23}56"${S3$1}${S23}67"${S6$1}":${S0}56"}${S3$1}":${S0}67"}${S16$1}:${S0}20"}${S18$1}:${S0}19"}${S2$1}:${S0}16${S1$1}56${S13$1}56${S14$1}A_e${S59}n_ownedLiteral"${S5$1}${S23}1"${S28}[${S0}96"},${S0}98"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}112${S13$1}112${S14$1}type"${S11$1}22${S15$1}24"${S18$1}:${S0}24"}${S4$1}${S9$1}e${S16$1}:${S0}22"}${S2$1}:${S0}21${S1$1}172${S13$1}172${S14$1}sqlDataType"${S11$1}21${S15$1}24"${S18$1}:${S0}24"}${S4$1}${S9$1}e${S16$1}:${S0}21"}${S2$1}:${S0}21${S1$1}171${S13$1}171${S14$1}metaclass"${S11$1}12${S15$1}24"${S18$1}:${S0}24"}${S4$1}${S9$1}e${S16$1}:${S0}12"}${S2$1}:${S0}21${S1$1}175"${S3$1}P${S21}":[${S0}177"}]${S11$1}21${S14$1}${S43}eId${S15$1}26"${S4$1}id":"175","${S9$1}e${S18$1}:${S0}26"}${S16$1}:${S0}21"}${S2$1}:${S0}23${S1$1}177","p${S21}${S23}175${S13$1}177"${S3$1}":${S0}178"},"p${S21}":${S0}175"}${S3$1}${S23}178"${S2$1}:${S0}22${S1$1}178"${S6$1}End":[${S0}179"}]${S3$1}P${S21}":[${S0}177"}]${S11$1}21"${S18$1}${S35}${S13$1}178"${S16$1}:${S0}21"}${S2$1}:${S0}21${S1$1}179${S14$1}${S43}e${S15$1}176"${S4$1}class${S23}21"${S3$1}${S23}178${S13$1}179"${S6$1}":${S0}180"},"${S9$1}e${S3$1}":${S0}178"}${S18$1}:${S0}176"}${S16$1}:${S0}21"}${S6$1}${S23}180"${S2$1}:${S0}16${S1$1}180"${S28}[${S0}173"},${S0}179"}],"name":"A_ownedAttribute_${S43}e${S13$1}180"${S5$1}${S23}1"${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}190"${S3$1}P${S21}":[${S0}191"}]${S11$1}184${S14$1}contractId${S15$1}26"${S4$1}id":"190","${S9$1}e${S18$1}:${S0}26"}${S16$1}:${S0}184"}${S2$1}:${S0}23${S1$1}191","p${S21}${S23}190${S13$1}191"${S3$1}":${S0}192"},"p${S21}":${S0}190"}${S3$1}${S23}192"${S2$1}:${S0}22${S1$1}192"${S6$1}End":[${S0}193"}]${S3$1}P${S21}":[${S0}191"}]${S11$1}184"${S18$1}${S35}${S13$1}192"${S16$1}:${S0}184"}${S2$1}:${S0}21${S1$1}193${S14$1}contract${S15$1}176"${S4$1}class${S23}184"${S3$1}${S23}192${S13$1}193","${S9$1}e${S6$1}":${S0}194"}${S3$1}":${S0}192"}${S16$1}:${S0}184"}${S18$1}:${S0}176"}${S6$1}${S23}194"${S2$1}:${S0}16${S1$1}194"${S28}[${S0}193"},${S0}189"}],"name":"A_contract_${S43}eImplementation"${S10$1}0,"id":"194"${S5$1}${S23}1"${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}189${S14$1}${S43}eImplementation${S15$1}184${S8$1}"*"${S11$1}176"${S3$1}${S23}63${S13$1}189"${S6$1}${S23}194","${S9$1}e${S6$1}":${S0}194"}${S3$1}":${S0}63"}${S18$1}:${S0}184"}${S16$1}:${S0}176"}${S2$1}:${S0}21${S1$1}197${S14$1}order${S15$1}26"${S4$1}id":"197"${S11$1}184","${S9$1}e${S18$1}:${S0}26"}${S16$1}:${S0}184"}${S2$1}:${S0}21${S1$1}198"${S3$1}P${S21}":[${S0}199"}],"${S9$1}e${S11$1}22"${S4$1}type${S23}26${S14$1}${S43}eId${S13$1}198"${S18$1}:${S0}26"}${S16$1}:${S0}22"}${S2$1}:${S0}23${S1$1}199","p${S21}${S23}198${S13$1}199"${S3$1}":${S0}200"},"p${S21}":${S0}198"}${S3$1}${S23}200"${S2$1}:${S0}22${S1$1}200"${S6$1}End":[${S0}201"}]${S3$1}P${S21}":[${S0}199"}]${S11$1}22"${S18$1}${S35}${S13$1}200"${S16$1}:${S0}22"}${S2$1}:${S0}21${S1$1}99${S13$1}99${S14$1}classId"${S11$1}21${S15$1}26"${S18$1}:${S0}26"}${S3$1}P${S21}":[${S0}126"}]${S4$1}${S9$1}e${S16$1}:${S0}21"}${S2$1}:${S0}23${S1$1}126${S13$1}126"${S3$1}${S23}69","p${S21}${S23}99","p${S21}":${S0}99"}${S3$1}":${S0}69"}${S2$1}:${S0}22${S1$1}69${S13$1}69"${S18$1}${S35}"${S11$1}21"${S3$1}P${S21}":[${S0}126"}]${S6$1}End":[${S0}100"}]${S16$1}:${S0}21"}${S2$1}:${S0}21${S1$1}100${S13$1}100${S14$1}class${S8$1}1${S11$1}21${S15$1}12"${S6$1}${S23}57"${S3$1}${S23}69"${S3$1}":${S0}69"},"${S9$1}e${S6$1}":${S0}57"}${S16$1}:${S0}21"}${S18$1}:${S0}12"}${S2$1}:${S0}16${S1$1}57${S13$1}57${S14$1}A_ownedAttribute_class"${S5$1}${S23}1"${S28}[${S0}100"},${S0}87"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}87${S13$1}87${S14$1}ownedAttribute${S8$1}"*"${S11$1}12${S15$1}21"${S6$1}${S23}57"${S3$1}${S23}63"${S6$1}":${S0}57"},"${S9$1}e${S3$1}":${S0}63"}${S18$1}:${S0}21"}${S16$1}:${S0}12"}${S2$1}:${S0}21${S1$1}110${S13$1}110${S14$1}classId"${S11$1}22${S15$1}26"${S18$1}:${S0}26"}${S3$1}P${S21}":[${S0}129"}]${S4$1}${S9$1}e${S16$1}:${S0}22"}${S2$1}:${S0}23${S1$1}129${S13$1}129"${S3$1}${S23}72","p${S21}${S23}110","p${S21}":${S0}110"}${S3$1}":${S0}72"}${S2$1}:${S0}22${S1$1}72${S13$1}72"${S18$1}${S35}"${S11$1}22"${S3$1}P${S21}":[${S0}129"}]${S6$1}End":[${S0}111"}]${S16$1}:${S0}22"}${S2$1}:${S0}21${S1$1}111${S13$1}111${S14$1}class${S8$1}1${S11$1}22${S15$1}12"${S6$1}${S23}60"${S3$1}${S23}72","${S9$1}e${S3$1}":${S0}72"}${S6$1}":${S0}60"}${S16$1}:${S0}22"}${S18$1}:${S0}12"}${S2$1}:${S0}16${S1$1}60${S13$1}60${S14$1}A_class_i${S41}r"${S5$1}${S23}1"${S28}[${S0}111"},${S0}88"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}88${S13$1}88${S14$1}i${S41}r${S8$1}"*"${S11$1}12${S15$1}22"${S6$1}${S23}60"${S3$1}${S23}63","${S9$1}e${S6$1}":${S0}60"}${S3$1}":${S0}63"}${S18$1}:${S0}22"}${S16$1}:${S0}12"}${S2$1}:${S0}21${S1$1}102${S13$1}102${S14$1}a${S57}nId"${S11$1}21${S15$1}26"${S18$1}:${S0}26"}${S3$1}P${S21}":[${S0}127"}]${S4$1}${S9$1}e${S16$1}:${S0}21"}${S2$1}:${S0}23${S1$1}127${S13$1}127"${S3$1}${S23}70","p${S21}${S23}102","p${S21}":${S0}102"}${S3$1}":${S0}70"}${S2$1}:${S0}22${S1$1}70${S13$1}70"${S18$1}${S35}"${S11$1}21"${S3$1}P${S21}":[${S0}127"}]${S6$1}End":[${S0}103"}]${S16$1}:${S0}21"}${S2$1}:${S0}21${S1$1}103${S13$1}103${S14$1}a${S57}n${S8$1}1${S11$1}21${S15$1}16"${S6$1}${S23}58"${S3$1}${S23}70"${S3$1}":${S0}70"},"${S9$1}e${S6$1}":${S0}58"}${S18$1}:${S0}16"}${S16$1}:${S0}21"}${S2$1}:${S0}16${S1$1}58${S13$1}58${S14$1}A_memberEnd_a${S57}n"${S5$1}${S23}1"${S28}[${S0}103"},${S0}94"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}94${S13$1}94${S14$1}memberEnd","lowerValue":"2","upperValue":2${S11$1}16${S15$1}21"${S6$1}${S23}58"${S3$1}${S23}63"${S6$1}":${S0}58"},"${S9$1}e${S3$1}":${S0}63"}${S16$1}:${S0}16"}${S18$1}:${S0}21"}${S2$1}:${S0}21${S1$1}117${S13$1}117${S14$1}p${S21}Id"${S11$1}23${S15$1}26"${S3$1}P${S21}":[${S0}131"}]${S4$1}${S9$1}e${S18$1}:${S0}26"}${S16$1}:${S0}23"}${S2$1}:${S0}23${S1$1}131${S13$1}131"${S3$1}${S23}74","p${S21}${S23}117","p${S21}":${S0}117"}${S3$1}":${S0}74"}${S2$1}:${S0}22${S1$1}74${S13$1}74"${S18$1}${S35}"${S11$1}23"${S3$1}P${S21}":[${S0}131"}]${S6$1}End":[${S0}118"}]${S16$1}:${S0}23"}${S2$1}:${S0}21${S1$1}118${S13$1}118${S14$1}p${S21}${S8$1}1${S11$1}23${S15$1}21"${S6$1}${S23}62"${S3$1}${S23}74","${S9$1}e${S3$1}":${S0}74"}${S6$1}":${S0}62"}${S16$1}:${S0}23"}${S18$1}:${S0}21"}${S2$1}:${S0}16${S1$1}62${S13$1}62${S14$1}A_p${S21}_i${S41}rP${S21}"${S5$1}${S23}1"${S28}[${S0}118"},${S0}106"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}106${S13$1}106${S14$1}i${S41}rP${S21}${S8$1}"*"${S11$1}21${S15$1}23"${S6$1}${S23}62"${S3$1}${S23}63","${S9$1}e${S6$1}":${S0}62"}${S3$1}":${S0}63"}${S18$1}:${S0}23"}${S16$1}:${S0}21"}${S2$1}:${S0}21${S1$1}104${S13$1}104${S14$1}i${S41}rId"${S11$1}21${S15$1}26"${S18$1}:${S0}26"}${S3$1}P${S21}":[${S0}128"}]${S4$1}${S9$1}e${S16$1}:${S0}21"}${S2$1}:${S0}23${S1$1}128${S13$1}128"${S3$1}${S23}71","p${S21}${S23}104","p${S21}":${S0}104"}${S3$1}":${S0}71"}${S2$1}:${S0}22${S1$1}71${S13$1}71"${S18$1}${S35}"${S11$1}21"${S3$1}P${S21}":[${S0}128"}]${S6$1}End":[${S0}105"}]${S16$1}:${S0}21"}${S2$1}:${S0}21${S1$1}105${S13$1}105${S14$1}i${S41}r${S8$1}1${S11$1}21${S15$1}22"${S6$1}${S23}59"${S3$1}${S23}71"${S3$1}":${S0}71"},"${S9$1}e${S6$1}":${S0}59"}${S18$1}:${S0}22"}${S16$1}:${S0}21"}${S2$1}:${S0}16${S1$1}59${S13$1}59${S14$1}A_i${S41}r_a${S57}nEnd"${S5$1}${S23}1"${S28}[${S0}105"},${S0}113"}]${S10$1}0${S5$1}":${S0}1"}${S2$1}:${S0}21${S1$1}113${S13$1}113${S14$1}a${S57}nEnd${S8$1}"*"${S11$1}22${S15$1}21"${S6$1}${S23}59"${S3$1}${S23}63"${S6$1}":${S0}59"},"${S9$1}e${S3$1}":${S0}63"}${S16$1}:${S0}22"}${S18$1}:${S0}21"}${S2$1}:${S0}21${S1$1}119${S13$1}119${S14$1}order"${S11$1}23${S15$1}26"${S4$1}${S9$1}e${S18$1}:${S0}26"}${S16$1}:${S0}23"}${S2$1}:${S0}176${S1$1}221","${S43}eImplementation":[${S0}218"}],"name":"Identifiable${S56}126,"y":-740${S32}431${S30}202${S3$1}":[${S0}63"}]${S22}[${S0}75"}]${S40}21"${S5$1}${S23}1"${S5$1}":${S0}1"}${S2$1}:${S0}22${S1$1}186"${S11$1}184"${S18$1}${S35}${S13$1}186"${S16$1}:${S0}184"}${S2$1}:${S0}15${S1$1}181"${S20}${S23}4"${S26}c${S23}184${S13$1}181"${S26}c":${S0}184"}${S20}":${S0}4"}${S2$1}:${S0}184"}${S19}1b74sluiihhs8g879qnol0017","${S37}r${S23}4${S13$1}389323065847115776","${S37}r":${S0}4"},"contract${S23}298556358033854464"${S2$1}:${S0}15${S1$1}35${S13$1}35"${S20}${S23}4"${S26}c${S23}22"${S20}":${S0}4"}${S26}c":${S0}22"}${S2$1}:${S0}21${S1$1}101${S13$1}101${S14$1}defaultValue","lowerValue":"0"${S11$1}21","upperValue":1,"${S9$1}e${S16$1}:${S0}21"}${S2$1}:${S0}207"}${S19}12o0f4422m5scuhomhota005c","importedP${S44}${S23}1${S13$1}284186758007709696","importedP${S44}":${S0}1"},"${S51}e${S23}273021921677438976"}]`;

globalThis.__proxy__ = true;

const Metamodel = globalThis.Metamodel = resurrect(json, MetamodelCore);

const Class_prototype = Metamodel.Class.prototype;

const Interface_prototype = Metamodel.Interface.prototype;

const Instance = Metamodel.Instance;

const Instance_prototype = Instance.prototype;

const findAttribute = Metamodel.findAttribute;

const isMany = Metamodel.isMany;

const EXPIRES = 60 * 1e3;

const SYMBOL_PROPERTY_EXPIRES = Symbol.for("propertyExpires");

let S_change = "change";

let S_get = "get";

const jsonapi = JSONAPI({
  baseUrl: "https://schematize.app" + "/jsonapi/",
  toType: id => Metamodel.Type[Symbol.for("Metamodel.cache.primary")][id]
});

Class_prototype.find = Interface_prototype.find = async function(properties) {
  return await jsonapi.find(this, properties);
};

Class_prototype.findById = Interface_prototype.findById = async function(id) {
  return await jsonapi.findById(this, id);
};

Instance_prototype.save = async function() {
  return await jsonapi.save(this);
};

Instance_prototype.delete = async function() {
  return await jsonapi.delete(this);
};

Instance_prototype.$ = async function(propertyName) {
  return await jsonapi.findRelated(this, propertyName);
};

Instance_prototype.on(S_get, (function(evt) {
  let detail = evt.detail, __type__ = detail.__type__, instance = detail.instance, propertyName = detail.property, property, realPropertyName, now = Date.now(), i;
  i = instance.__proxyTarget__ || instance, instance = instance.__proxy__ || instance;
  if (typeof propertyName === "string" && propertyName !== "$" && propertyName.indexOf("$") === 0 && !i[propertyName]) {
    realPropertyName = propertyName.substring(1);
    if ((!i[SYMBOL_PROPERTY_EXPIRES] || !i[SYMBOL_PROPERTY_EXPIRES][realPropertyName] || i[SYMBOL_PROPERTY_EXPIRES][realPropertyName] < now) && (property = findAttribute(realPropertyName, __type__)) && property.association) {
      i[SYMBOL_PROPERTY_EXPIRES] = i[SYMBOL_PROPERTY_EXPIRES] || {};
      i[SYMBOL_PROPERTY_EXPIRES][realPropertyName] = now + EXPIRES;
      i[propertyName] = new Promise((resolve => {
        jsonapi.findRelated(i, realPropertyName).then((value => {
          if (isMany(property.upperValue)) {
            if (value) {
              instance[realPropertyName] = value;
            }
          } else {
            instance[realPropertyName] = value;
          }
          delete i[propertyName];
          resolve(i[realPropertyName]);
        })).catch((() => {
          delete i[propertyName];
          resolve(i[realPropertyName]);
        }));
      }));
    } else {
      i[propertyName] = Promise.resolve().then((() => (delete i[propertyName], i[realPropertyName])));
    }
  }
}));

Instance_prototype.on(S_change, (evt => {
  let detail = evt.detail, propertyName, property;
  for ([propertyName] of detail.changes) {
    property = findAttribute(propertyName, detail.__type__);
    if (property) {
      jsonapi.unclean(detail.instance);
      break;
    }
  }
}));

const S1 = `{"__ref__":"`, S2 = `1g3fotqpvbaf3f770m6q700`, S3 = `","__updated__":16811505730`, S4 = `,"classId":"433329107982770176","`, S5 = `","typeId":"24","lowerValue":"1","upperValue":`, S6 = `pps06cp4ade800`, S7 = `"},"id":"4333291`, S8 = `Metamodel:`, S9 = `"}],"__id__":`, S10 = `baf3f770m6q700`, S11 = `"__type__"`, S12 = `,"identifier`, S13 = `,"acl":`, S14 = `d":"4333291`, S15 = `"name":"`, S16 = `"},"class"`, S17 = `,"_isSelected":`, S18 = `,"owningPackage`, json196343 = `{${S11}:${S1}${S8}13"},"packagedElement":[{${S15}listItem",${S11}:${S1}${S8}12"},"ownedAttribute":[{${S11}:${S1}${S8}21"}${S12}Property":[{${S11}:${S1}${S8}23"}${S13}[${S1}1g3fq4b29${S6}57${S9}"${S2}m2"${S12}I${S14}09840846848","propertyI${S14}10650347520"${S12}":{${S11}:${S1}${S8}22"}${S12}Property":[${S1}${S2}m2"}]${S13}[${S1}1g3fq3r59${S6}1t${S9}"${S2}92","type":"primary"${S4}class":${S1}${S2}6i${S7}09840846848${S3}52},"property":${S1}1g3fotqqf${S10}50${S7}13280176128${S3}57}]${S13}[${S1}1g3fq3ug9${S6}7p${S9}"1g3fotqqf${S10}50","upperValue":1,"lowerValue":"1",${S15}id","typeId":"26","autoGenerate":true${S4}type":${S1}${S8}26${S16}:${S1}${S2}6i${S7}10650347520${S3}54},{${S11}:${S1}${S8}21"}${S13}[${S1}1g3fq428p${S6}11${S9}"1g3fpcu8f${S10}7l",${S15}testName${S5}1${S4}type":${S1}${S8}24${S16}:${S1}${S2}6i${S7}10662930432${S3}54},{${S11}:${S1}${S8}21"}${S13}[${S1}1g3fq43j9${S6}4h${S9}"1g3fpi71f${S10}0e",${S15}testLink${S5}1${S4}type":${S1}${S8}24${S16}:${S1}${S2}6i${S7}10679707648${S3}55},{${S11}:${S1}${S8}21"}${S13}[${S1}1g3fq451p${S6}3e${S9}"1g3fpl4pv${S10}53",${S15}listNum${S5}1${S4}type":${S1}${S8}24${S16}:${S1}${S2}6i${S7}10700679168${S3}55}]${S12}":[${S1}${S2}92"}]${S13}[${S1}1g3fq3o69${S6}3d${S9}"${S2}6i","x":80,"y":80,"width":350,"height":300,"expanded":true${S17}0,"pX":80.03076171875,"pY":80.09051513671875${S18}I${S14}07353624576"${S18}":${S1}1g3foq3rf${S10}80${S7}07982770176${S3}48}]${S13}[${S1}1g3fq3gpp${S6}36${S9}"1g3foq3rf${S10}80","version":"1.0.0"${S17}1,${S15}adbeDash","i${S14}07353624576${S3}63,"packageCache":${S1}1g3fq4efp${S6}0m"},"lastModified":"1681150512030"}`;

const adbeDash = globalThis["adbeDash"] = Metamodel.resurrect(json196343);

export { JSONAPI, Metamodel, adbeDash, jsonapi };
