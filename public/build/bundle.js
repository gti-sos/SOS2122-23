
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.47.0 */

    const { Error: Error_1, Object: Object_1, console: console_1$n } = globals;

    // (251:0) {:else}
    function create_else_block$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$a(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$n.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$B.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\Home.svelte generated by Svelte v3.47.0 */

    const file$A = "src\\front\\Home.svelte";

    function create_fragment$A(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let h20;
    	let a0;
    	let t3;
    	let h21;
    	let t5;
    	let p0;
    	let t6;
    	let a1;
    	let t8;
    	let p1;
    	let t9;
    	let a2;
    	let t11;
    	let p2;
    	let t12;
    	let a3;
    	let t14;
    	let h22;
    	let t16;
    	let h23;
    	let a4;
    	let t19;
    	let h24;
    	let a5;
    	let t22;
    	let hr0;
    	let t23;
    	let h40;
    	let t25;
    	let li0;
    	let a6;
    	let t27;
    	let li1;
    	let a7;
    	let t29;
    	let h41;
    	let t31;
    	let li2;
    	let a8;
    	let t33;
    	let li3;
    	let a9;
    	let t35;
    	let h42;
    	let t37;
    	let li4;
    	let a10;
    	let t39;
    	let p3;
    	let t41;
    	let hr1;
    	let t42;
    	let h43;
    	let t44;
    	let li5;
    	let a11;
    	let t46;
    	let li6;
    	let a12;
    	let t48;
    	let h44;
    	let t50;
    	let li7;
    	let a13;
    	let t52;
    	let li8;
    	let a14;
    	let t54;
    	let h45;
    	let t56;
    	let li9;
    	let a15;
    	let t58;
    	let p4;
    	let t60;
    	let hr2;
    	let t61;
    	let h46;
    	let t63;
    	let li10;
    	let a16;
    	let t65;
    	let li11;
    	let a17;
    	let t67;
    	let h47;
    	let t69;
    	let li12;
    	let a18;
    	let t71;
    	let li13;
    	let a19;
    	let t73;
    	let h48;
    	let t75;
    	let li14;
    	let a20;
    	let t77;
    	let p5;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "SOS2122-23";
    			t1 = space();
    			h20 = element("h2");
    			a0 = element("a");
    			a0.textContent = "Página de Info";
    			t3 = space();
    			h21 = element("h2");
    			h21.textContent = "Team";
    			t5 = space();
    			p0 = element("p");
    			t6 = text("- ");
    			a1 = element("a");
    			a1.textContent = "Alberto Martín Martín";
    			t8 = space();
    			p1 = element("p");
    			t9 = text("- ");
    			a2 = element("a");
    			a2.textContent = "Fernando Pardo Beltrán";
    			t11 = space();
    			p2 = element("p");
    			t12 = text("- ");
    			a3 = element("a");
    			a3.textContent = "[Antonio Saborido Campos]";
    			t14 = space();
    			h22 = element("h2");
    			h22.textContent = "Project description:";
    			t16 = text(" Relación de deportes entre fútbol (Premier League), tenis y baloncesto (NBA)\r\n        ");
    			h23 = element("h2");
    			h23.textContent = "Repository:";
    			a4 = element("a");
    			a4.textContent = "gti-sos/SOS2122-23";
    			t19 = space();
    			h24 = element("h2");
    			h24.textContent = "URL:";
    			a5 = element("a");
    			a5.textContent = "http://sos2122-23.herokuapp.com";
    			t22 = space();
    			hr0 = element("hr");
    			t23 = space();
    			h40 = element("h4");
    			h40.textContent = "DOCS";
    			t25 = space();
    			li0 = element("li");
    			a6 = element("a");
    			a6.textContent = "https://sos2122-23.herokuapp.com/api/v1/tennis/docs";
    			t27 = space();
    			li1 = element("li");
    			a7 = element("a");
    			a7.textContent = "https://sos2122-23.herokuapp.com/api/v2/tennis/docs";
    			t29 = space();
    			h41 = element("h4");
    			h41.textContent = "API";
    			t31 = space();
    			li2 = element("li");
    			a8 = element("a");
    			a8.textContent = "https://sos2122-23.herokuapp.com/api/v1/tennis";
    			t33 = space();
    			li3 = element("li");
    			a9 = element("a");
    			a9.textContent = "https://sos2122-23.herokuapp.com/api/v2/tennis";
    			t35 = space();
    			h42 = element("h4");
    			h42.textContent = "FRONT END";
    			t37 = space();
    			li4 = element("li");
    			a10 = element("a");
    			a10.textContent = "https://sos2122-23.herokuapp.com/#/tennis";
    			t39 = space();
    			p3 = element("p");
    			p3.textContent = "(developed by [Antonio Saborido Campos](https://github.com/Antoniiosc7)";
    			t41 = space();
    			hr1 = element("hr");
    			t42 = space();
    			h43 = element("h4");
    			h43.textContent = "DOCS";
    			t44 = space();
    			li5 = element("li");
    			a11 = element("a");
    			a11.textContent = "https://sos2122-23.herokuapp.com/api/v1/premier-league/docs";
    			t46 = space();
    			li6 = element("li");
    			a12 = element("a");
    			a12.textContent = "https://sos2122-23.herokuapp.com/api/v2/premier-league/docs";
    			t48 = space();
    			h44 = element("h4");
    			h44.textContent = "API";
    			t50 = space();
    			li7 = element("li");
    			a13 = element("a");
    			a13.textContent = "https://sos2122-23.herokuapp.com/api/v1/premier-league";
    			t52 = space();
    			li8 = element("li");
    			a14 = element("a");
    			a14.textContent = "https://sos2122-23.herokuapp.com/api/v2/premier-league";
    			t54 = space();
    			h45 = element("h4");
    			h45.textContent = "FRONT END";
    			t56 = space();
    			li9 = element("li");
    			a15 = element("a");
    			a15.textContent = "https://sos2122-23.herokuapp.com/#/premier-league";
    			t58 = space();
    			p4 = element("p");
    			p4.textContent = "(developed by [Alberto Martín Martín](https://github.com/albmarmar6)";
    			t60 = space();
    			hr2 = element("hr");
    			t61 = space();
    			h46 = element("h4");
    			h46.textContent = "DOCS";
    			t63 = space();
    			li10 = element("li");
    			a16 = element("a");
    			a16.textContent = "https://sos2122-23.herokuapp.com/api/v1/nba-stats/docs";
    			t65 = space();
    			li11 = element("li");
    			a17 = element("a");
    			a17.textContent = "https://sos2122-23.herokuapp.com/api/v2/nba-stats/docs";
    			t67 = space();
    			h47 = element("h4");
    			h47.textContent = "API";
    			t69 = space();
    			li12 = element("li");
    			a18 = element("a");
    			a18.textContent = "https://sos2122-23.herokuapp.com/api/v1/nba-stats";
    			t71 = space();
    			li13 = element("li");
    			a19 = element("a");
    			a19.textContent = "https://sos2122-23.herokuapp.com/api/v2/nba-stats";
    			t73 = space();
    			h48 = element("h4");
    			h48.textContent = "FRONT END";
    			t75 = space();
    			li14 = element("li");
    			a20 = element("a");
    			a20.textContent = "https://sos2122-23.herokuapp.com/#/nba-stats";
    			t77 = space();
    			p5 = element("p");
    			p5.textContent = "(developed by [Fernando Pardo Beltrán](https://github.com/Nando13-hub)";
    			add_location(h1, file$A, 3, 12, 76);
    			attr_dev(div0, "id", "titulo");
    			attr_dev(div0, "class", "svelte-d1sqie");
    			add_location(div0, file$A, 2, 8, 45);
    			attr_dev(a0, "href", "/#/info");
    			add_location(a0, file$A, 5, 12, 125);
    			add_location(h20, file$A, 5, 8, 121);
    			add_location(h21, file$A, 7, 8, 180);
    			attr_dev(a1, "href", "https://github.com/albmarmar6");
    			add_location(a1, file$A, 8, 13, 208);
    			add_location(p0, file$A, 8, 8, 203);
    			attr_dev(a2, "href", "https://github.com/Nando13-hub");
    			add_location(a2, file$A, 9, 13, 292);
    			add_location(p1, file$A, 9, 8, 287);
    			attr_dev(a3, "href", "https://github.com/Antoniiosc7");
    			add_location(a3, file$A, 10, 13, 378);
    			add_location(p2, file$A, 10, 8, 373);
    			add_location(h22, file$A, 11, 8, 462);
    			add_location(h23, file$A, 12, 8, 578);
    			attr_dev(a4, "href", "https://github.com/gti-sos/SOS2122-23");
    			add_location(a4, file$A, 12, 28, 598);
    			add_location(h24, file$A, 13, 8, 678);
    			attr_dev(a5, "href", "http://sos2122-23.herokuapp.com");
    			add_location(a5, file$A, 13, 21, 691);
    			add_location(hr0, file$A, 14, 8, 779);
    			add_location(h40, file$A, 15, 8, 793);
    			attr_dev(a6, "href", "https://sos2122-23.herokuapp.com/api/v1/tennis/docs");
    			add_location(a6, file$A, 16, 12, 820);
    			add_location(li0, file$A, 16, 8, 816);
    			attr_dev(a7, "href", "https://sos2122-23.herokuapp.com/api/v2/tennis/docs");
    			add_location(a7, file$A, 17, 12, 959);
    			add_location(li1, file$A, 17, 8, 955);
    			add_location(h41, file$A, 18, 8, 1094);
    			attr_dev(a8, "href", "https://sos2122-23.herokuapp.com/api/v1/tennis");
    			add_location(a8, file$A, 19, 12, 1120);
    			add_location(li2, file$A, 19, 8, 1116);
    			attr_dev(a9, "href", "https://sos2122-23.herokuapp.com/api/v2/tennis");
    			add_location(a9, file$A, 20, 12, 1249);
    			add_location(li3, file$A, 20, 8, 1245);
    			add_location(h42, file$A, 22, 8, 1384);
    			attr_dev(a10, "href", "https://sos2122-23.herokuapp.com/#/tennis");
    			add_location(a10, file$A, 23, 12, 1416);
    			add_location(li4, file$A, 23, 8, 1412);
    			add_location(p3, file$A, 24, 8, 1531);
    			add_location(hr1, file$A, 25, 8, 1619);
    			add_location(h43, file$A, 27, 8, 1635);
    			attr_dev(a11, "href", "https://sos2122-23.herokuapp.com/api/v1/premier-league/docs");
    			add_location(a11, file$A, 28, 12, 1662);
    			add_location(li5, file$A, 28, 8, 1658);
    			attr_dev(a12, "href", "https://sos2122-23.herokuapp.com/api/v2/premier-league/docs");
    			add_location(a12, file$A, 29, 12, 1817);
    			add_location(li6, file$A, 29, 8, 1813);
    			add_location(h44, file$A, 30, 8, 1968);
    			attr_dev(a13, "href", "https://sos2122-23.herokuapp.com/api/v1/premier-league");
    			add_location(a13, file$A, 31, 12, 1994);
    			add_location(li7, file$A, 31, 8, 1990);
    			attr_dev(a14, "href", "https://sos2122-23.herokuapp.com/api/v2/premier-league");
    			add_location(a14, file$A, 32, 12, 2139);
    			add_location(li8, file$A, 32, 8, 2135);
    			add_location(h45, file$A, 34, 8, 2290);
    			attr_dev(a15, "href", "https://sos2122-23.herokuapp.com/#/premier-league");
    			add_location(a15, file$A, 35, 12, 2322);
    			add_location(li9, file$A, 35, 8, 2318);
    			add_location(p4, file$A, 36, 8, 2453);
    			add_location(hr2, file$A, 37, 8, 2538);
    			add_location(h46, file$A, 39, 8, 2554);
    			attr_dev(a16, "href", "https://sos2122-23.herokuapp.com/api/v1/nba-stats/docs");
    			add_location(a16, file$A, 40, 12, 2581);
    			add_location(li10, file$A, 40, 8, 2577);
    			attr_dev(a17, "href", "https://sos2122-23.herokuapp.com/api/v2/nba-stats/docs");
    			add_location(a17, file$A, 41, 12, 2726);
    			add_location(li11, file$A, 41, 8, 2722);
    			add_location(h47, file$A, 42, 8, 2867);
    			attr_dev(a18, "href", "https://sos2122-23.herokuapp.com/api/v1/nba-stats");
    			add_location(a18, file$A, 43, 12, 2893);
    			add_location(li12, file$A, 43, 8, 2889);
    			attr_dev(a19, "href", "https://sos2122-23.herokuapp.com/api/v2/nba-stats");
    			add_location(a19, file$A, 44, 12, 3028);
    			add_location(li13, file$A, 44, 8, 3024);
    			add_location(h48, file$A, 46, 8, 3169);
    			attr_dev(a20, "href", "https://sos2122-23.herokuapp.com/#/nba-stats");
    			add_location(a20, file$A, 47, 12, 3201);
    			add_location(li14, file$A, 47, 8, 3197);
    			add_location(p5, file$A, 48, 8, 3322);
    			attr_dev(div1, "class", "container svelte-d1sqie");
    			add_location(div1, file$A, 1, 4, 12);
    			add_location(main, file$A, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div1, t1);
    			append_dev(div1, h20);
    			append_dev(h20, a0);
    			append_dev(div1, t3);
    			append_dev(div1, h21);
    			append_dev(div1, t5);
    			append_dev(div1, p0);
    			append_dev(p0, t6);
    			append_dev(p0, a1);
    			append_dev(div1, t8);
    			append_dev(div1, p1);
    			append_dev(p1, t9);
    			append_dev(p1, a2);
    			append_dev(div1, t11);
    			append_dev(div1, p2);
    			append_dev(p2, t12);
    			append_dev(p2, a3);
    			append_dev(div1, t14);
    			append_dev(div1, h22);
    			append_dev(div1, t16);
    			append_dev(div1, h23);
    			append_dev(div1, a4);
    			append_dev(div1, t19);
    			append_dev(div1, h24);
    			append_dev(div1, a5);
    			append_dev(div1, t22);
    			append_dev(div1, hr0);
    			append_dev(div1, t23);
    			append_dev(div1, h40);
    			append_dev(div1, t25);
    			append_dev(div1, li0);
    			append_dev(li0, a6);
    			append_dev(div1, t27);
    			append_dev(div1, li1);
    			append_dev(li1, a7);
    			append_dev(div1, t29);
    			append_dev(div1, h41);
    			append_dev(div1, t31);
    			append_dev(div1, li2);
    			append_dev(li2, a8);
    			append_dev(div1, t33);
    			append_dev(div1, li3);
    			append_dev(li3, a9);
    			append_dev(div1, t35);
    			append_dev(div1, h42);
    			append_dev(div1, t37);
    			append_dev(div1, li4);
    			append_dev(li4, a10);
    			append_dev(div1, t39);
    			append_dev(div1, p3);
    			append_dev(div1, t41);
    			append_dev(div1, hr1);
    			append_dev(div1, t42);
    			append_dev(div1, h43);
    			append_dev(div1, t44);
    			append_dev(div1, li5);
    			append_dev(li5, a11);
    			append_dev(div1, t46);
    			append_dev(div1, li6);
    			append_dev(li6, a12);
    			append_dev(div1, t48);
    			append_dev(div1, h44);
    			append_dev(div1, t50);
    			append_dev(div1, li7);
    			append_dev(li7, a13);
    			append_dev(div1, t52);
    			append_dev(div1, li8);
    			append_dev(li8, a14);
    			append_dev(div1, t54);
    			append_dev(div1, h45);
    			append_dev(div1, t56);
    			append_dev(div1, li9);
    			append_dev(li9, a15);
    			append_dev(div1, t58);
    			append_dev(div1, p4);
    			append_dev(div1, t60);
    			append_dev(div1, hr2);
    			append_dev(div1, t61);
    			append_dev(div1, h46);
    			append_dev(div1, t63);
    			append_dev(div1, li10);
    			append_dev(li10, a16);
    			append_dev(div1, t65);
    			append_dev(div1, li11);
    			append_dev(li11, a17);
    			append_dev(div1, t67);
    			append_dev(div1, h47);
    			append_dev(div1, t69);
    			append_dev(div1, li12);
    			append_dev(li12, a18);
    			append_dev(div1, t71);
    			append_dev(div1, li13);
    			append_dev(li13, a19);
    			append_dev(div1, t73);
    			append_dev(div1, h48);
    			append_dev(div1, t75);
    			append_dev(div1, li14);
    			append_dev(li14, a20);
    			append_dev(div1, t77);
    			append_dev(div1, p5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$A.name
    		});
    	}
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    function getTransitionDuration(element) {
      if (!element) return 0;

      // Get transition-duration of the element
      let { transitionDuration, transitionDelay } =
        window.getComputedStyle(element);

      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];

      return (
        (Number.parseFloat(transitionDuration) +
          Number.parseFloat(transitionDelay)) *
        1000
      );
    }

    /* node_modules\sveltestrap\src\Colgroup.svelte generated by Svelte v3.47.0 */
    const file$z = "node_modules\\sveltestrap\\src\\Colgroup.svelte";

    function create_fragment$z(ctx) {
    	let colgroup;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			colgroup = element("colgroup");
    			if (default_slot) default_slot.c();
    			add_location(colgroup, file$z, 6, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, colgroup, anchor);

    			if (default_slot) {
    				default_slot.m(colgroup, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(colgroup);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Colgroup', slots, ['default']);
    	setContext('colgroup', true);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Colgroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$scope, slots];
    }

    class Colgroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Colgroup",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\ResponsiveContainer.svelte generated by Svelte v3.47.0 */
    const file$y = "node_modules\\sveltestrap\\src\\ResponsiveContainer.svelte";

    // (15:0) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(15:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (13:0) {#if responsive}
    function create_if_block$9(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[1]);
    			add_location(div, file$y, 13, 2, 305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*responsiveClassName*/ 2) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(13:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let responsiveClassName;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ResponsiveContainer', slots, ['default']);
    	let className = '';
    	let { responsive = false } = $$props;
    	const writable_props = ['responsive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ResponsiveContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$props.responsive);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		responsive,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(4, className = $$props.className);
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$props.responsive);
    		if ('responsiveClassName' in $$props) $$invalidate(1, responsiveClassName = $$props.responsiveClassName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			$$invalidate(1, responsiveClassName = classnames(className, {
    				'table-responsive': responsive === true,
    				[`table-responsive-${responsive}`]: typeof responsive === 'string'
    			}));
    		}
    	};

    	return [responsive, responsiveClassName, $$scope, slots];
    }

    class ResponsiveContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { responsive: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResponsiveContainer",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get responsive() {
    		throw new Error("<ResponsiveContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<ResponsiveContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\TableFooter.svelte generated by Svelte v3.47.0 */
    const file$x = "node_modules\\sveltestrap\\src\\TableFooter.svelte";

    function create_fragment$x(ctx) {
    	let tfoot;
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let tfoot_levels = [/*$$restProps*/ ctx[0]];
    	let tfoot_data = {};

    	for (let i = 0; i < tfoot_levels.length; i += 1) {
    		tfoot_data = assign(tfoot_data, tfoot_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			tfoot = element("tfoot");
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$x, 7, 2, 117);
    			set_attributes(tfoot, tfoot_data);
    			add_location(tfoot, file$x, 6, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tfoot, anchor);
    			append_dev(tfoot, tr);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(tfoot, tfoot_data = get_spread_update(tfoot_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tfoot);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableFooter', slots, ['default']);
    	setContext('footer', true);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$restProps, $$scope, slots];
    }

    class TableFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableFooter",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\TableHeader.svelte generated by Svelte v3.47.0 */
    const file$w = "node_modules\\sveltestrap\\src\\TableHeader.svelte";

    function create_fragment$w(ctx) {
    	let thead;
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let thead_levels = [/*$$restProps*/ ctx[0]];
    	let thead_data = {};

    	for (let i = 0; i < thead_levels.length; i += 1) {
    		thead_data = assign(thead_data, thead_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$w, 7, 2, 117);
    			set_attributes(thead, thead_data);
    			add_location(thead, file$w, 6, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(thead, thead_data = get_spread_update(thead_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHeader', slots, ['default']);
    	setContext('header', true);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$restProps, $$scope, slots];
    }

    class TableHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHeader",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.47.0 */
    const file$v = "node_modules\\sveltestrap\\src\\Table.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes_1 = dirty => ({ row: dirty & /*rows*/ 2 });
    const get_default_slot_context_1 = ctx => ({ row: /*row*/ ctx[13] });
    const get_default_slot_changes = dirty => ({ row: dirty & /*rows*/ 2 });
    const get_default_slot_context = ctx => ({ row: /*row*/ ctx[13] });

    // (50:4) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if rows}
    function create_if_block$8(ctx) {
    	let colgroup;
    	let t0;
    	let tableheader;
    	let t1;
    	let tbody;
    	let t2;
    	let tablefooter;
    	let current;

    	colgroup = new Colgroup({
    			props: {
    				$$slots: { default: [create_default_slot_3$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tableheader = new TableHeader({
    			props: {
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*rows*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	tablefooter = new TableFooter({
    			props: {
    				$$slots: { default: [create_default_slot_1$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(colgroup.$$.fragment);
    			t0 = space();
    			create_component(tableheader.$$.fragment);
    			t1 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(tablefooter.$$.fragment);
    			add_location(tbody, file$v, 39, 6, 1057);
    		},
    		m: function mount(target, anchor) {
    			mount_component(colgroup, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tableheader, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t2, anchor);
    			mount_component(tablefooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const colgroup_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				colgroup_changes.$$scope = { dirty, ctx };
    			}

    			colgroup.$set(colgroup_changes);
    			const tableheader_changes = {};

    			if (dirty & /*$$scope, rows*/ 4098) {
    				tableheader_changes.$$scope = { dirty, ctx };
    			}

    			tableheader.$set(tableheader_changes);

    			if (dirty & /*$$scope, rows*/ 4098) {
    				each_value = /*rows*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const tablefooter_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				tablefooter_changes.$$scope = { dirty, ctx };
    			}

    			tablefooter.$set(tablefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colgroup.$$.fragment, local);
    			transition_in(tableheader.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(tablefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colgroup.$$.fragment, local);
    			transition_out(tableheader.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(tablefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(colgroup, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tableheader, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tablefooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(33:4) {#if rows}",
    		ctx
    	});

    	return block;
    }

    // (34:6) <Colgroup>
    function create_default_slot_3$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$6.name,
    		type: "slot",
    		source: "(34:6) <Colgroup>",
    		ctx
    	});

    	return block;
    }

    // (37:6) <TableHeader>
    function create_default_slot_2$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, rows*/ 4098)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(37:6) <TableHeader>",
    		ctx
    	});

    	return block;
    }

    // (41:8) {#each rows as row}
    function create_each_block$9(ctx) {
    	let tr;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context_1);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			t = space();
    			add_location(tr, file$v, 41, 10, 1103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, rows*/ 4098)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(41:8) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    // (47:6) <TableFooter>
    function create_default_slot_1$c(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$c.name,
    		type: "slot",
    		source: "(47:6) <TableFooter>",
    		ctx
    	});

    	return block;
    }

    // (31:0) <ResponsiveContainer {responsive}>
    function create_default_slot$e(ctx) {
    	let table;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*rows*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if_block.c();
    			set_attributes(table, table_data);
    			add_location(table, file$v, 31, 2, 885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			if_blocks[current_block_type_index].m(table, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(table, null);
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(31:0) <ResponsiveContainer {responsive}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let responsivecontainer;
    	let current;

    	responsivecontainer = new ResponsiveContainer({
    			props: {
    				responsive: /*responsive*/ ctx[0],
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(responsivecontainer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(responsivecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const responsivecontainer_changes = {};
    			if (dirty & /*responsive*/ 1) responsivecontainer_changes.responsive = /*responsive*/ ctx[0];

    			if (dirty & /*$$scope, $$restProps, classes, rows*/ 4110) {
    				responsivecontainer_changes.$$scope = { dirty, ctx };
    			}

    			responsivecontainer.$set(responsivecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(responsivecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(responsivecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(responsivecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","size","bordered","borderless","striped","dark","hover","responsive","rows"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { size = '' } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;
    	let { rows = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('size' in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ('bordered' in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ('borderless' in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ('striped' in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ('dark' in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ('hover' in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ('responsive' in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ('rows' in $$new_props) $$invalidate(1, rows = $$new_props.rows);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		Colgroup,
    		ResponsiveContainer,
    		TableFooter,
    		TableHeader,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		rows,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('size' in $$props) $$invalidate(5, size = $$new_props.size);
    		if ('bordered' in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ('borderless' in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ('striped' in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ('dark' in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ('hover' in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ('rows' in $$props) $$invalidate(1, rows = $$new_props.rows);
    		if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			$$invalidate(2, classes = classnames(className, 'table', size ? 'table-' + size : false, bordered ? 'table-bordered' : false, borderless ? 'table-borderless' : false, striped ? 'table-striped' : false, dark ? 'table-dark' : false, hover ? 'table-hover' : false));
    		}
    	};

    	return [
    		responsive,
    		rows,
    		classes,
    		$$restProps,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		slots,
    		$$scope
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0,
    			rows: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.47.0 */
    const file$u = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (54:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$u, 54, 2, 1124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[23](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*children, $$scope*/ 262146)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (37:0) {#if href}
    function create_if_block$7(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$u, 37, 2, 866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			/*a_binding*/ ctx[22](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			/*a_binding*/ ctx[22](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(37:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(68:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (66:6) {#if children}
    function create_if_block_2$1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(66:6) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    // (65:10)        
    function fallback_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(65:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (50:4) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (48:4) {#if children}
    function create_if_block_1$1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(48:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$u(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","inner","outline","size","style","value","white"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { href = '' } = $$props;
    	let { inner = undefined } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;
    	let { white = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$new_props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$new_props) $$invalidate(17, white = $$new_props.white);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		inner,
    		outline,
    		size,
    		style,
    		value,
    		white,
    		defaultAriaLabel,
    		classes,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$props) $$invalidate(17, white = $$new_props.white);
    		if ('defaultAriaLabel' in $$props) $$invalidate(6, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('ariaLabel' in $$props) $$invalidate(8, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(8, ariaLabel = $$props['aria-label']);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active, white*/ 261120) {
    			$$invalidate(7, classes = classnames(className, close ? 'btn-close' : 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, {
    				active,
    				'btn-close-white': close && white
    			}));
    		}

    		if ($$self.$$.dirty & /*close*/ 8192) {
    			$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		inner,
    		children,
    		disabled,
    		href,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		close,
    		color,
    		outline,
    		size,
    		white,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 1,
    			close: 13,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			inner: 0,
    			outline: 15,
    			size: 16,
    			style: 4,
    			value: 5,
    			white: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get white() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set white(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules\sveltestrap\src\Alert.svelte generated by Svelte v3.47.0 */
    const file$t = "node_modules\\sveltestrap\\src\\Alert.svelte";
    const get_heading_slot_changes = dirty => ({});
    const get_heading_slot_context = ctx => ({});

    // (26:0) {#if isOpen}
    function create_if_block$6(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block2;
    	let div_transition;
    	let current;
    	let if_block0 = (/*heading*/ ctx[3] || /*$$slots*/ ctx[10].heading) && create_if_block_3(ctx);
    	let if_block1 = /*showClose*/ ctx[5] && create_if_block_2(ctx);
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let div_levels = [/*$$restProps*/ ctx[9], { class: /*classes*/ ctx[7] }, { role: "alert" }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if_block2.c();
    			set_attributes(div, div_data);
    			add_location(div, file$t, 26, 2, 808);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*heading*/ ctx[3] || /*$$slots*/ ctx[10].heading) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*heading, $$slots*/ 1032) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*showClose*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				{ role: "alert" }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(26:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if heading || $$slots.heading}
    function create_if_block_3(ctx) {
    	let h4;
    	let t;
    	let current;
    	const heading_slot_template = /*#slots*/ ctx[18].heading;
    	const heading_slot = create_slot(heading_slot_template, ctx, /*$$scope*/ ctx[17], get_heading_slot_context);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(/*heading*/ ctx[3]);
    			if (heading_slot) heading_slot.c();
    			attr_dev(h4, "class", "alert-heading");
    			add_location(h4, file$t, 33, 6, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);

    			if (heading_slot) {
    				heading_slot.m(h4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*heading*/ 8) set_data_dev(t, /*heading*/ ctx[3]);

    			if (heading_slot) {
    				if (heading_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						heading_slot,
    						heading_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(heading_slot_template, /*$$scope*/ ctx[17], dirty, get_heading_slot_changes),
    						get_heading_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (heading_slot) heading_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(33:4) {#if heading || $$slots.heading}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if showClose}
    function create_if_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[2]);
    			add_location(button, file$t, 38, 6, 1077);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleToggle*/ ctx[8])) /*handleToggle*/ ctx[8].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*closeClassNames*/ 64) {
    				attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			}

    			if (dirty & /*closeAriaLabel*/ 4) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(38:4) {#if showClose}",
    		ctx
    	});

    	return block;
    }

    // (48:4) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(48:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if children}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(46:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let showClose;
    	let handleToggle;
    	let classes;
    	let closeClassNames;

    	const omit_props_names = [
    		"class","children","color","closeClassName","closeAriaLabel","dismissible","heading","isOpen","toggle","fade","transition"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alert', slots, ['heading','default']);
    	const $$slots = compute_slots(slots);
    	let { class: className = '' } = $$props;
    	let { children = undefined } = $$props;
    	let { color = 'success' } = $$props;
    	let { closeClassName = '' } = $$props;
    	let { closeAriaLabel = 'Close' } = $$props;
    	let { dismissible = false } = $$props;
    	let { heading = undefined } = $$props;
    	let { isOpen = true } = $$props;
    	let { toggle = undefined } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { transition = { duration: fade$1 ? 400 : 0 } } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(11, className = $$new_props.class);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('color' in $$new_props) $$invalidate(12, color = $$new_props.color);
    		if ('closeClassName' in $$new_props) $$invalidate(13, closeClassName = $$new_props.closeClassName);
    		if ('closeAriaLabel' in $$new_props) $$invalidate(2, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('dismissible' in $$new_props) $$invalidate(14, dismissible = $$new_props.dismissible);
    		if ('heading' in $$new_props) $$invalidate(3, heading = $$new_props.heading);
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('toggle' in $$new_props) $$invalidate(15, toggle = $$new_props.toggle);
    		if ('fade' in $$new_props) $$invalidate(16, fade$1 = $$new_props.fade);
    		if ('transition' in $$new_props) $$invalidate(4, transition = $$new_props.transition);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fadeTransition: fade,
    		classnames,
    		className,
    		children,
    		color,
    		closeClassName,
    		closeAriaLabel,
    		dismissible,
    		heading,
    		isOpen,
    		toggle,
    		fade: fade$1,
    		transition,
    		closeClassNames,
    		showClose,
    		classes,
    		handleToggle
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(11, className = $$new_props.className);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('color' in $$props) $$invalidate(12, color = $$new_props.color);
    		if ('closeClassName' in $$props) $$invalidate(13, closeClassName = $$new_props.closeClassName);
    		if ('closeAriaLabel' in $$props) $$invalidate(2, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('dismissible' in $$props) $$invalidate(14, dismissible = $$new_props.dismissible);
    		if ('heading' in $$props) $$invalidate(3, heading = $$new_props.heading);
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('toggle' in $$props) $$invalidate(15, toggle = $$new_props.toggle);
    		if ('fade' in $$props) $$invalidate(16, fade$1 = $$new_props.fade);
    		if ('transition' in $$props) $$invalidate(4, transition = $$new_props.transition);
    		if ('closeClassNames' in $$props) $$invalidate(6, closeClassNames = $$new_props.closeClassNames);
    		if ('showClose' in $$props) $$invalidate(5, showClose = $$new_props.showClose);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('handleToggle' in $$props) $$invalidate(8, handleToggle = $$new_props.handleToggle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dismissible, toggle*/ 49152) {
    			$$invalidate(5, showClose = dismissible || toggle);
    		}

    		if ($$self.$$.dirty & /*toggle*/ 32768) {
    			$$invalidate(8, handleToggle = toggle || (() => $$invalidate(0, isOpen = false)));
    		}

    		if ($$self.$$.dirty & /*className, color, showClose*/ 6176) {
    			$$invalidate(7, classes = classnames(className, 'alert', `alert-${color}`, { 'alert-dismissible': showClose }));
    		}

    		if ($$self.$$.dirty & /*closeClassName*/ 8192) {
    			$$invalidate(6, closeClassNames = classnames('btn-close', closeClassName));
    		}
    	};

    	return [
    		isOpen,
    		children,
    		closeAriaLabel,
    		heading,
    		transition,
    		showClose,
    		closeClassNames,
    		classes,
    		handleToggle,
    		$$restProps,
    		$$slots,
    		className,
    		color,
    		closeClassName,
    		dismissible,
    		toggle,
    		fade$1,
    		$$scope,
    		slots
    	];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			class: 11,
    			children: 1,
    			color: 12,
    			closeClassName: 13,
    			closeAriaLabel: 2,
    			dismissible: 14,
    			heading: 3,
    			isOpen: 0,
    			toggle: 15,
    			fade: 16,
    			transition: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get class() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeClassName() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeClassName(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dismissible() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dismissible(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\tennis\list.svelte generated by Svelte v3.47.0 */

    const { console: console_1$m } = globals;
    const file$s = "src\\front\\tennis\\list.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$a(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$a.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (212:1) {:then entries}
    function create_then_block$a(ctx) {
    	let alert_1;
    	let t0;
    	let table0;
    	let t1;
    	let table1;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[3],
    				isOpen: /*visible*/ ctx[2],
    				toggle: /*func*/ ctx[15],
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			create_component(table0.$$.fragment);
    			t1 = space();
    			create_component(table1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(table1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_1_changes = {};
    			if (dirty[0] & /*color*/ 8) alert_1_changes.color = /*color*/ ctx[3];
    			if (dirty[0] & /*visible*/ 4) alert_1_changes.isOpen = /*visible*/ ctx[2];
    			if (dirty[0] & /*visible*/ 4) alert_1_changes.toggle = /*func*/ ctx[15];

    			if (dirty[0] & /*checkMSG*/ 2 | dirty[1] & /*$$scope*/ 512) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*from, to, checkMSG*/ 50 | dirty[1] & /*$$scope*/ 512) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*entries, newEntry*/ 257 | dirty[1] & /*$$scope*/ 512) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(table1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$a.name,
    		type: "then",
    		source: "(212:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (215:2) {#if checkMSG}
    function create_if_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkMSG*/ 2) set_data_dev(t, /*checkMSG*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(215:2) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (214:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_13(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(214:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (231:23) <Button outline color="dark" on:click="{()=>{       if (from == null || to == null) {        window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')       }else{                          checkMSG = "Datos cargados correctamente en ese periodo";        getEntries();       }      }}">
    function create_default_slot_12$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(231:23) <Button outline color=\\\"dark\\\" on:click=\\\"{()=>{       if (from == null || to == null) {        window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')       }else{                          checkMSG = \\\"Datos cargados correctamente en ese periodo\\\";        getEntries();       }      }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (242:23) <Button outline color="info" on:click="{()=>{       from = null;       to = null;       getEntries();                      checkMSG = "Busqueda limpiada";             }}">
    function create_default_slot_11$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar Búsqueda");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(242:23) <Button outline color=\\\"info\\\" on:click=\\\"{()=>{       from = null;       to = null;       getEntries();                      checkMSG = \\\"Busqueda limpiada\\\";             }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (256:5) <Button color="success" on:click={function (){        window.location.href = `/#/tennis/chart`       }}>
    function create_default_slot_10$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica 1");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(256:5) <Button color=\\\"success\\\" on:click={function (){        window.location.href = `/#/tennis/chart`       }}>",
    		ctx
    	});

    	return block;
    }

    // (263:5) <Button color="success" on:click={function (){        window.location.href = `/#/tennis/chart2`       }}>
    function create_default_slot_9$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica 2");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(263:5) <Button color=\\\"success\\\" on:click={function (){        window.location.href = `/#/tennis/chart2`       }}>",
    		ctx
    	});

    	return block;
    }

    // (219:4) <Table bordered>
    function create_default_slot_8$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t4;
    	let td1;
    	let input1;
    	let t5;
    	let td2;
    	let button0;
    	let t6;
    	let td3;
    	let button1;
    	let t7;
    	let td4;
    	let button2;
    	let t8;
    	let td5;
    	let button3;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "dark",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[18]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[19]);

    	button2 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*click_handler_2*/ ctx[20]);

    	button3 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*click_handler_3*/ ctx[21]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Fecha inicio";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Fecha fin";
    			t3 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t4 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t5 = space();
    			td2 = element("td");
    			create_component(button0.$$.fragment);
    			t6 = space();
    			td3 = element("td");
    			create_component(button1.$$.fragment);
    			t7 = space();
    			td4 = element("td");
    			create_component(button2.$$.fragment);
    			t8 = space();
    			td5 = element("td");
    			create_component(button3.$$.fragment);
    			add_location(th0, file$s, 221, 4, 7432);
    			add_location(th1, file$s, 222, 4, 7459);
    			add_location(tr0, file$s, 220, 3, 7422);
    			add_location(thead, file$s, 219, 2, 7410);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "2000");
    			add_location(input0, file$s, 228, 8, 7535);
    			add_location(td0, file$s, 228, 4, 7531);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "2000");
    			add_location(input1, file$s, 229, 8, 7602);
    			add_location(td1, file$s, 229, 4, 7598);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$s, 230, 4, 7663);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$s, 241, 4, 8030);
    			attr_dev(td4, "align", "center");
    			add_location(td4, file$s, 254, 4, 8326);
    			attr_dev(td5, "align", "center");
    			add_location(td5, file$s, 261, 4, 8506);
    			add_location(tr1, file$s, 227, 3, 7521);
    			add_location(tbody, file$s, 226, 2, 7509);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*from*/ ctx[4]);
    			append_dev(tr1, t4);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*to*/ ctx[5]);
    			append_dev(tr1, t5);
    			append_dev(tr1, td2);
    			mount_component(button0, td2, null);
    			append_dev(tr1, t6);
    			append_dev(tr1, td3);
    			mount_component(button1, td3, null);
    			append_dev(tr1, t7);
    			append_dev(tr1, td4);
    			mount_component(button2, td4, null);
    			append_dev(tr1, t8);
    			append_dev(tr1, td5);
    			mount_component(button3, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[16]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[17])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*from*/ 16 && to_number(input0.value) !== /*from*/ ctx[4]) {
    				set_input_value(input0, /*from*/ ctx[4]);
    			}

    			if (dirty[0] & /*to*/ 32 && to_number(input1.value) !== /*to*/ ctx[5]) {
    				set_input_value(input1, /*to*/ ctx[5]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    			destroy_component(button3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(219:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (295:8) <Button outline color="primary" on:click="{insertEntry}">
    function create_default_slot_7$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(295:8) <Button outline color=\\\"primary\\\" on:click=\\\"{insertEntry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (307:9) <Button outline color="warning" on:click={function (){        window.location.href = `/#/tennis/${entry.country}/${entry.year}`       }}>
    function create_default_slot_6$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(307:9) <Button outline color=\\\"warning\\\" on:click={function (){        window.location.href = `/#/tennis/${entry.country}/${entry.year}`       }}>",
    		ctx
    	});

    	return block;
    }

    // (312:9) <Button outline color="danger" on:click={BorrarEntry(entry.country,entry.year)}>
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(312:9) <Button outline color=\\\"danger\\\" on:click={BorrarEntry(entry.country,entry.year)}>",
    		ctx
    	});

    	return block;
    }

    // (300:3) {#each entries as entry}
    function create_each_block_1$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[37].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[37].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[37].most_grand_slam + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[37].masters_finals + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[37].olympic_gold_medals + "";
    	let t8;
    	let t9;
    	let td5;
    	let button0;
    	let t10;
    	let td6;
    	let button1;
    	let current;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[27](/*entry*/ ctx[37]);
    	}

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", click_handler_4);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*BorrarEntry*/ ctx[12](/*entry*/ ctx[37].country, /*entry*/ ctx[37].year))) /*BorrarEntry*/ ctx[12](/*entry*/ ctx[37].country, /*entry*/ ctx[37].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(td0, file$s, 301, 5, 9492);
    			add_location(td1, file$s, 302, 5, 9523);
    			add_location(td2, file$s, 303, 5, 9551);
    			add_location(td3, file$s, 304, 20, 9605);
    			add_location(td4, file$s, 305, 20, 9658);
    			add_location(td5, file$s, 306, 5, 9701);
    			add_location(td6, file$s, 311, 5, 9879);
    			add_location(tr, file$s, 300, 4, 9481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button0, td5, null);
    			append_dev(td5, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*entries*/ 256) && t0_value !== (t0_value = /*entry*/ ctx[37].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t2_value !== (t2_value = /*entry*/ ctx[37].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t4_value !== (t4_value = /*entry*/ ctx[37].most_grand_slam + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t6_value !== (t6_value = /*entry*/ ctx[37].masters_finals + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t8_value !== (t8_value = /*entry*/ ctx[37].olympic_gold_medals + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(300:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (319:8) <Button outline color="success" on:click={LoadEntries}>
    function create_default_slot_4$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(319:8) <Button outline color=\\\"success\\\" on:click={LoadEntries}>",
    		ctx
    	});

    	return block;
    }

    // (322:8) <Button outline color="danger" on:click={BorrarEntries}>
    function create_default_slot_3$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(322:8) <Button outline color=\\\"danger\\\" on:click={BorrarEntries}>",
    		ctx
    	});

    	return block;
    }

    // (273:1) <Table bordered>
    function create_default_slot_2$5(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t10;
    	let th6;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t12;
    	let td1;
    	let input1;
    	let t13;
    	let td2;
    	let input2;
    	let t14;
    	let td3;
    	let input3;
    	let t15;
    	let td4;
    	let input4;
    	let t16;
    	let td5;
    	let button0;
    	let t17;
    	let t18;
    	let tr2;
    	let td6;
    	let button1;
    	let t19;
    	let td7;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*insertEntry*/ ctx[11]);
    	let each_value_1 = /*entries*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*LoadEntries*/ ctx[10]);

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*BorrarEntries*/ ctx[13]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Grand Slams Ganados";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Masters 1000 Ganados";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Medallas Olimpicas";
    			t9 = space();
    			th5 = element("th");
    			t10 = space();
    			th6 = element("th");
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t18 = space();
    			tr2 = element("tr");
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t19 = space();
    			td7 = element("td");
    			create_component(button2.$$.fragment);
    			add_location(th0, file$s, 278, 4, 8793);
    			add_location(th1, file$s, 279, 4, 8812);
    			add_location(th2, file$s, 280, 4, 8830);
    			add_location(th3, file$s, 281, 4, 8864);
    			add_location(th4, file$s, 282, 16, 8911);
    			add_location(th5, file$s, 283, 4, 8944);
    			add_location(th6, file$s, 284, 4, 8959);
    			add_location(tr0, file$s, 276, 3, 8777);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$s, 275, 2, 8750);
    			add_location(input0, file$s, 289, 8, 9021);
    			add_location(td0, file$s, 289, 4, 9017);
    			add_location(input1, file$s, 290, 8, 9075);
    			add_location(td1, file$s, 290, 4, 9071);
    			add_location(input2, file$s, 291, 8, 9126);
    			add_location(td2, file$s, 291, 4, 9122);
    			add_location(input3, file$s, 292, 20, 9200);
    			add_location(td3, file$s, 292, 16, 9196);
    			add_location(input4, file$s, 293, 20, 9273);
    			add_location(td4, file$s, 293, 16, 9269);
    			add_location(td5, file$s, 294, 4, 9335);
    			add_location(tr1, file$s, 288, 3, 9007);
    			add_location(td6, file$s, 318, 4, 10043);
    			add_location(td7, file$s, 321, 4, 10147);
    			add_location(tr2, file$s, 317, 3, 10033);
    			add_location(tbody, file$s, 287, 2, 8995);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t10);
    			append_dev(tr0, th6);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newEntry*/ ctx[0].country);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newEntry*/ ctx[0].year);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newEntry*/ ctx[0].most_grand_slam);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newEntry*/ ctx[0].masters_finals);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newEntry*/ ctx[0].olympic_gold_medals);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button0, td5, null);
    			append_dev(tbody, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t18);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td6);
    			mount_component(button1, td6, null);
    			append_dev(tr2, t19);
    			append_dev(tr2, td7);
    			mount_component(button2, td7, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[22]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[23]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[24]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[25]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[26])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newEntry*/ 1 && input0.value !== /*newEntry*/ ctx[0].country) {
    				set_input_value(input0, /*newEntry*/ ctx[0].country);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input1.value !== /*newEntry*/ ctx[0].year) {
    				set_input_value(input1, /*newEntry*/ ctx[0].year);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input2.value !== /*newEntry*/ ctx[0].most_grand_slam) {
    				set_input_value(input2, /*newEntry*/ ctx[0].most_grand_slam);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input3.value !== /*newEntry*/ ctx[0].masters_finals) {
    				set_input_value(input3, /*newEntry*/ ctx[0].masters_finals);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input4.value !== /*newEntry*/ ctx[0].olympic_gold_medals) {
    				set_input_value(input4, /*newEntry*/ ctx[0].olympic_gold_medals);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (dirty[0] & /*BorrarEntry, entries*/ 4352) {
    				each_value_1 = /*entries*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t18);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button1);
    			destroy_component(button2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(273:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (210:17)     loading   {:then entries}
    function create_pending_block$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$a.name,
    		type: "pending",
    		source: "(210:17)     loading   {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (333:8) <Button outline color="secondary" on:click={()=>{              offset = page;              getEntries();          }}>
    function create_default_slot_1$b(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*page*/ ctx[14]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$b.name,
    		type: "slot",
    		source: "(333:8) <Button outline color=\\\"secondary\\\" on:click={()=>{              offset = page;              getEntries();          }}>",
    		ctx
    	});

    	return block;
    }

    // (331:4) {#each Array(maxPages+1) as _,page}
    function create_each_block$8(ctx) {
    	let button;
    	let t;
    	let current;

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[28](/*page*/ ctx[14]);
    	}

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_1$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", click_handler_5);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    			t = text(" ");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(331:4) {#each Array(maxPages+1) as _,page}",
    		ctx
    	});

    	return block;
    }

    // (339:4) <Button outline color="secondary" on:click={()=>{          getEntries();      }}>
    function create_default_slot$d(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar nº de página");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(339:4) <Button outline color=\\\"secondary\\\" on:click={()=>{          getEntries();      }}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let promise;
    	let t4;
    	let div;
    	let t5;
    	let button;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$a,
    		then: create_then_block$a,
    		catch: create_catch_block$a,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[8], info);
    	let each_value = Array(/*maxPages*/ ctx[7] + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_6*/ ctx[29]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "TENNIS API";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Los últimos campeones de los grandes torneos del tenis internacional.";
    			t3 = space();
    			info.block.c();
    			t4 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$s, 201, 4, 6994);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$s, 200, 2, 6957);
    			add_location(p, file$s, 203, 2, 7034);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$s, 199, 1, 6925);
    			attr_dev(div, "align", "center");
    			add_location(div, file$s, 329, 0, 10293);
    			add_location(main, file$s, 198, 0, 6916);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t4;
    			append_dev(main, t4);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t5);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*entries*/ 256 && promise !== (promise = /*entries*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			if (dirty[0] & /*offset, getEntries, maxPages*/ 704) {
    				each_value = Array(/*maxPages*/ ctx[7] + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t5);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_each(each_blocks, detaching);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, []);
    	var BASE_API_PATH = "/api/v2/tennis";
    	let entries = [];

    	let newEntry = {
    		country: "",
    		year: "",
    		most_grand_slam: "",
    		masters_finals: "",
    		olympic_gold_medals: ""
    	};

    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";
    	let page = 1;
    	let totaldata = 6;
    	let from = null;
    	let to = null;
    	let offset = 0;
    	let limit = 10;
    	let maxPages = 0;
    	let numEntries;
    	onMount(getEntries);

    	//GET
    	async function getEntries() {
    		console.log("Fetching entries....");
    		let cadena = `/api/v2/tennis?limit=${limit}&&offset=${offset * 10}&&`;

    		if (from != null) {
    			cadena = cadena + `from=${from}&&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}&&`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset * 10}`);
    			maxPagesFunction(cadenaPag[0] + cadenaPag[1]);
    			const data = await res.json();
    			$$invalidate(8, entries = data);
    			numEntries = entries.length;
    			console.log("Received entries: " + entries.length);
    		} else {
    			Errores(res.status);
    		}
    	}

    	/*
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/tennis"); 
        if(res.ok){
            console.log("Ok:");
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }else {
                checkMSG= res.status + ": Recursos no encontrados ";
                console.log("ERROR! no encontrado");
            }
    }*/
    	//GET INITIALDATA
    	async function LoadEntries() {
    		console.log("Fetching entry data...");
    		await fetch(BASE_API_PATH + "/loadInitialData");
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(8, entries = json);
    			$$invalidate(2, visible = true);
    			totaldata = 6;
    			console.log("Received " + entries.length + " entry data.");
    			$$invalidate(3, color = "success");
    			$$invalidate(1, checkMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(3, color = "danger");
    			$$invalidate(1, checkMSG = res.status + ": " + "No se pudo cargar los datos");
    			console.log("ERROR! ");
    		}
    	}

    	//INSERT DATA
    	async function insertEntry() {
    		console.log("Inserting resources...");

    		if (newEntry.country == "" || newEntry.year == null || newEntry.most_grand_slam == null || newEntry.masters_finals == null || newEntry.olympic_gold_medals == null) {
    			alert("Los campos no pueden estar vacios");
    		} else {
    			await fetch(BASE_API_PATH, {
    				method: "POST",
    				body: JSON.stringify({
    					country: newEntry.country,
    					year: parseInt(newEntry.year),
    					most_grand_slam: parseFloat(newEntry.most_grand_slam),
    					masters_finals: parseFloat(newEntry.masters_finals),
    					olympic_gold_medals: parseFloat(newEntry.olympic_gold_medals)
    				}),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(2, visible = true);

    				if (res.status == 201) {
    					getEntries();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(3, color = "success");
    					$$invalidate(1, checkMSG = "Entrada introducida correctamente a la base de datos");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Los datos de la entrada no fueron introducidos correctamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that country and year in the da tabase");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Ya existe una entrada en la base de datos con el pais y el año introducido");
    				}
    			});
    		}
    	}

    	//DELETE STAT
    	async function BorrarEntry(countryD, yearD) {
    		await fetch(BASE_API_PATH + "/" + countryD + "/" + yearD, { method: "DELETE" }).then(function (res) {
    			$$invalidate(2, visible = true);
    			getEntries();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(3, color = "success");
    				$$invalidate(1, checkMSG = "Recurso " + countryD + " " + yearD + " borrado correctamente");
    				console.log("Deleted " + countryD);
    			} else if (res.status == 404) {
    				$$invalidate(3, color = "danger");
    				$$invalidate(1, checkMSG = "No se ha encontrado el objeto " + countryD);
    				console.log("Resource NOT FOUND");
    			} else {
    				$$invalidate(3, color = "danger");
    				$$invalidate(1, checkMSG = res.status + ": " + "No se pudo borrar el recurso");
    				console.log("ERROR!");
    			}
    		});
    	}

    	//DELETE ALL STATS
    	async function BorrarEntries() {
    		console.log("Deleting entry data...");

    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			console.log("Deleting all entry data...");

    			await fetch(BASE_API_PATH, { method: "DELETE" }).then(function (res) {
    				$$invalidate(2, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getEntries();
    					$$invalidate(3, color = "success");
    					$$invalidate(1, checkMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//Función auxiliar para obtener el número máximo de páginas que se pueden ver
    	async function maxPagesFunction(cadena) {
    		const res = await fetch(cadena, { method: "GET" });

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(7, maxPages = Math.floor(data.length / 10));

    			if (maxPages === data.length / 10) {
    				$$invalidate(7, maxPages = maxPages - 1);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$m.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(2, visible = false);

    	function input0_input_handler() {
    		from = to_number(this.value);
    		$$invalidate(4, from);
    	}

    	function input1_input_handler() {
    		to = to_number(this.value);
    		$$invalidate(5, to);
    	}

    	const click_handler = () => {
    		if (from == null || to == null) {
    			window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos');
    		} else {
    			$$invalidate(1, checkMSG = "Datos cargados correctamente en ese periodo");
    			getEntries();
    		}
    	};

    	const click_handler_1 = () => {
    		$$invalidate(4, from = null);
    		$$invalidate(5, to = null);
    		getEntries();
    		$$invalidate(1, checkMSG = "Busqueda limpiada");
    	};

    	const click_handler_2 = function () {
    		window.location.href = `/#/tennis/chart`;
    	};

    	const click_handler_3 = function () {
    		window.location.href = `/#/tennis/chart2`;
    	};

    	function input0_input_handler_1() {
    		newEntry.country = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input1_input_handler_1() {
    		newEntry.year = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input2_input_handler() {
    		newEntry.most_grand_slam = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input3_input_handler() {
    		newEntry.masters_finals = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input4_input_handler() {
    		newEntry.olympic_gold_medals = this.value;
    		$$invalidate(0, newEntry);
    	}

    	const click_handler_4 = function (entry) {
    		window.location.href = `/#/tennis/${entry.country}/${entry.year}`;
    	};

    	const click_handler_5 = page => {
    		$$invalidate(6, offset = page);
    		getEntries();
    	};

    	const click_handler_6 = () => {
    		getEntries();
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		BASE_API_PATH,
    		entries,
    		newEntry,
    		checkMSG,
    		visible,
    		color,
    		page,
    		totaldata,
    		from,
    		to,
    		offset,
    		limit,
    		maxPages,
    		numEntries,
    		getEntries,
    		LoadEntries,
    		insertEntry,
    		BorrarEntry,
    		BorrarEntries,
    		maxPagesFunction
    	});

    	$$self.$inject_state = $$props => {
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('entries' in $$props) $$invalidate(8, entries = $$props.entries);
    		if ('newEntry' in $$props) $$invalidate(0, newEntry = $$props.newEntry);
    		if ('checkMSG' in $$props) $$invalidate(1, checkMSG = $$props.checkMSG);
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('page' in $$props) $$invalidate(14, page = $$props.page);
    		if ('totaldata' in $$props) totaldata = $$props.totaldata;
    		if ('from' in $$props) $$invalidate(4, from = $$props.from);
    		if ('to' in $$props) $$invalidate(5, to = $$props.to);
    		if ('offset' in $$props) $$invalidate(6, offset = $$props.offset);
    		if ('limit' in $$props) limit = $$props.limit;
    		if ('maxPages' in $$props) $$invalidate(7, maxPages = $$props.maxPages);
    		if ('numEntries' in $$props) numEntries = $$props.numEntries;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newEntry,
    		checkMSG,
    		visible,
    		color,
    		from,
    		to,
    		offset,
    		maxPages,
    		entries,
    		getEntries,
    		LoadEntries,
    		insertEntry,
    		BorrarEntry,
    		BorrarEntries,
    		page,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6
    	];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\front\tennis\edit.svelte generated by Svelte v3.47.0 */

    const { console: console_1$l } = globals;
    const file$r = "src\\front\\tennis\\edit.svelte";

    // (73:8) {#if errorMsg}
    function create_if_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*errorMsg*/ ctx[8]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 256) set_data_dev(t, /*errorMsg*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(73:8) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (72:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[8] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*errorMsg*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(72:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      export let params = {}
    function create_catch_block$9(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$9.name,
    		type: "catch",
    		source: "(1:0) <script>      export let params = {}",
    		ctx
    	});

    	return block;
    }

    // (81:8) {:then entry}
    function create_then_block$9(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedolympic_gold_medals, updatedmasters_finals, updatedmost_grand_slam, updatedYear, updatedCountry*/ 262392) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$9.name,
    		type: "then",
    		source: "(81:8) {:then entry}",
    		ctx
    	});

    	return block;
    }

    // (104:24) <Button outline color="primary" on:click="{EditEntry}">
    function create_default_slot_2$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(104:24) <Button outline color=\\\"primary\\\" on:click=\\\"{EditEntry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (84:8) <Table bordered>
    function create_default_slot_1$a(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t10;
    	let th6;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t12;
    	let td1;
    	let input1;
    	let t13;
    	let td2;
    	let input2;
    	let t14;
    	let td3;
    	let input3;
    	let t15;
    	let td4;
    	let input4;
    	let t16;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*EditEntry*/ ctx[10]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Grand Slams Ganados";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Masters 1000 Ganados";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Medallas Olimpicas";
    			t9 = space();
    			th5 = element("th");
    			t10 = space();
    			th6 = element("th");
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$r, 87, 20, 2953);
    			add_location(th1, file$r, 88, 20, 2988);
    			add_location(th2, file$r, 89, 20, 3022);
    			add_location(th3, file$r, 90, 20, 3072);
    			add_location(th4, file$r, 91, 20, 3123);
    			add_location(th5, file$r, 92, 20, 3172);
    			add_location(th6, file$r, 93, 20, 3203);
    			add_location(tr0, file$r, 85, 16, 2921);
    			add_location(thead, file$r, 84, 12, 2896);
    			add_location(input0, file$r, 98, 24, 3327);
    			add_location(td0, file$r, 98, 20, 3323);
    			add_location(input1, file$r, 99, 24, 3395);
    			add_location(td1, file$r, 99, 20, 3391);
    			add_location(input2, file$r, 100, 24, 3462);
    			add_location(td2, file$r, 100, 20, 3458);
    			add_location(input3, file$r, 101, 24, 3538);
    			add_location(td3, file$r, 101, 20, 3534);
    			add_location(input4, file$r, 102, 24, 3613);
    			add_location(td4, file$r, 102, 20, 3609);
    			add_location(td5, file$r, 103, 20, 3689);
    			add_location(tr1, file$r, 97, 16, 3297);
    			add_location(tbody, file$r, 96, 12, 3272);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t10);
    			append_dev(tr0, th6);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*updatedCountry*/ ctx[3]);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*updatedYear*/ ctx[4]);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*updatedmost_grand_slam*/ ctx[5]);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*updatedmasters_finals*/ ctx[6]);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*updatedolympic_gold_medals*/ ctx[7]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[14]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[15]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*updatedCountry*/ 8 && input0.value !== /*updatedCountry*/ ctx[3]) {
    				set_input_value(input0, /*updatedCountry*/ ctx[3]);
    			}

    			if (dirty & /*updatedYear*/ 16 && input1.value !== /*updatedYear*/ ctx[4]) {
    				set_input_value(input1, /*updatedYear*/ ctx[4]);
    			}

    			if (dirty & /*updatedmost_grand_slam*/ 32 && input2.value !== /*updatedmost_grand_slam*/ ctx[5]) {
    				set_input_value(input2, /*updatedmost_grand_slam*/ ctx[5]);
    			}

    			if (dirty & /*updatedmasters_finals*/ 64 && input3.value !== /*updatedmasters_finals*/ ctx[6]) {
    				set_input_value(input3, /*updatedmasters_finals*/ ctx[6]);
    			}

    			if (dirty & /*updatedolympic_gold_medals*/ 128 && input4.value !== /*updatedolympic_gold_medals*/ ctx[7]) {
    				set_input_value(input4, /*updatedolympic_gold_medals*/ ctx[7]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$a.name,
    		type: "slot",
    		source: "(84:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (79:18)       loading          {:then entry}
    function create_pending_block$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$9.name,
    		type: "pending",
    		source: "(79:18)       loading          {:then entry}",
    		ctx
    	});

    	return block;
    }

    // (113:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$c(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(113:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let main;
    	let alert;
    	let t0;
    	let h1;
    	let t1;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let t4_value = /*params*/ ctx[0].year + "";
    	let t4;
    	let t5;
    	let t6;
    	let promise;
    	let t7;
    	let button;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[2],
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[11],
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$9,
    		then: create_then_block$9,
    		catch: create_catch_block$9,
    		value: 9,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entry*/ ctx[9], info);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text("Editar entrada \"");
    			t2 = text(t2_value);
    			t3 = text("\",\"");
    			t4 = text(t4_value);
    			t5 = text("\"");
    			t6 = space();
    			info.block.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$r, 77, 4, 2726);
    			add_location(main, file$r, 70, 0, 2567);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			append_dev(h1, t5);
    			append_dev(main, t6);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t7;
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const alert_changes = {};
    			if (dirty & /*color*/ 4) alert_changes.color = /*color*/ ctx[2];
    			if (dirty & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty & /*visible*/ 2) alert_changes.toggle = /*func*/ ctx[11];

    			if (dirty & /*$$scope, errorMsg*/ 262400) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].year + "")) set_data_dev(t4, t4_value);
    			info.ctx = ctx;

    			if (dirty & /*entry*/ 512 && promise !== (promise = /*entry*/ ctx[9]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Edit', slots, []);
    	let { params = {} } = $$props;
    	let visible = false;
    	let color = "danger";
    	let entry = {};
    	let updatedCountry;
    	let updatedYear;
    	let updatedmost_grand_slam;
    	let updatedmasters_finals;
    	let updatedolympic_gold_medals;
    	let errorMsg = "";
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v2/tennis/" + params.country + "/" + params.year);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(9, entry = data);
    			$$invalidate(3, updatedCountry = entry.country);
    			$$invalidate(4, updatedYear = entry.year);
    			$$invalidate(5, updatedmost_grand_slam = entry.most_grand_slam);
    			$$invalidate(6, updatedmasters_finals = entry.masters_finals);
    			$$invalidate(7, updatedolympic_gold_medals = entry.olympic_gold_medals);
    		} else {
    			$$invalidate(1, visible = true);
    			$$invalidate(2, color = "danger");
    			$$invalidate(8, errorMsg = "Error " + res.status + " : " + "Ningún recurso con los parametros " + params.country + " " + params.year);
    			console.log("ERROR" + errorMsg);
    		}
    	}

    	async function EditEntry() {
    		console.log("Updating entry...." + updatedCountry);

    		await fetch("/api/v2/tennis/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: updatedCountry,
    				year: parseInt(updatedYear),
    				most_grand_slam: parseFloat(updatedmost_grand_slam),
    				masters_finals: parseFloat(updatedmasters_finals),
    				olympic_gold_medals: parseFloat(updatedolympic_gold_medals)
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			$$invalidate(1, visible = true);

    			if (res.status == 200) {
    				getEntries();
    				console.log("Data introduced");
    				$$invalidate(2, color = "success");
    				$$invalidate(8, errorMsg = "Recurso actualizado correctamente");
    			} else {
    				console.log("Data not edited");
    				$$invalidate(2, color = "danger");
    				$$invalidate(8, errorMsg = "Compruebe los campos");
    			}
    		});
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$l.warn(`<Edit> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input0_input_handler() {
    		updatedCountry = this.value;
    		$$invalidate(3, updatedCountry);
    	}

    	function input1_input_handler() {
    		updatedYear = this.value;
    		$$invalidate(4, updatedYear);
    	}

    	function input2_input_handler() {
    		updatedmost_grand_slam = this.value;
    		$$invalidate(5, updatedmost_grand_slam);
    	}

    	function input3_input_handler() {
    		updatedmasters_finals = this.value;
    		$$invalidate(6, updatedmasters_finals);
    	}

    	function input4_input_handler() {
    		updatedolympic_gold_medals = this.value;
    		$$invalidate(7, updatedolympic_gold_medals);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		params,
    		pop,
    		onMount,
    		Button,
    		Table,
    		Alert,
    		visible,
    		color,
    		entry,
    		updatedCountry,
    		updatedYear,
    		updatedmost_grand_slam,
    		updatedmasters_finals,
    		updatedolympic_gold_medals,
    		errorMsg,
    		getEntries,
    		EditEntry
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('visible' in $$props) $$invalidate(1, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('entry' in $$props) $$invalidate(9, entry = $$props.entry);
    		if ('updatedCountry' in $$props) $$invalidate(3, updatedCountry = $$props.updatedCountry);
    		if ('updatedYear' in $$props) $$invalidate(4, updatedYear = $$props.updatedYear);
    		if ('updatedmost_grand_slam' in $$props) $$invalidate(5, updatedmost_grand_slam = $$props.updatedmost_grand_slam);
    		if ('updatedmasters_finals' in $$props) $$invalidate(6, updatedmasters_finals = $$props.updatedmasters_finals);
    		if ('updatedolympic_gold_medals' in $$props) $$invalidate(7, updatedolympic_gold_medals = $$props.updatedolympic_gold_medals);
    		if ('errorMsg' in $$props) $$invalidate(8, errorMsg = $$props.errorMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		visible,
    		color,
    		updatedCountry,
    		updatedYear,
    		updatedmost_grand_slam,
    		updatedmasters_finals,
    		updatedolympic_gold_medals,
    		errorMsg,
    		entry,
    		EditEntry,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class Edit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get params() {
    		throw new Error("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\tennis\chart.svelte generated by Svelte v3.47.0 */

    const { console: console_1$k, document: document_1$2 } = globals;
    const file$q = "src\\front\\tennis\\chart.svelte";

    function create_fragment$q(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let h2;
    	let t2;
    	let h4;
    	let t4;
    	let a;
    	let t6;
    	let canvas;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Más torneos ganados";
    			t2 = space();
    			h4 = element("h4");
    			h4.textContent = "Biblioteca: Chart.js";
    			t4 = space();
    			a = element("a");
    			a.textContent = "Volver";
    			t6 = space();
    			canvas = element("canvas");
    			if (!src_url_equal(script.src, script_src_value = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$q, 61, 4, 2295);
    			attr_dev(h2, "class", "svelte-1f1idld");
    			add_location(h2, file$q, 67, 4, 2455);
    			attr_dev(h4, "class", "svelte-1f1idld");
    			add_location(h4, file$q, 68, 4, 2489);
    			attr_dev(a, "href", "/#/tennis");
    			attr_dev(a, "class", "btn btn-primary btn-lg active");
    			attr_dev(a, "role", "button");
    			attr_dev(a, "aria-pressed", "true");
    			add_location(a, file$q, 71, 4, 2686);
    			attr_dev(canvas, "id", "myChart");
    			add_location(canvas, file$q, 73, 4, 2796);
    			add_location(main, file$q, 66, 0, 2443);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1$2.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t2);
    			append_dev(main, h4);
    			append_dev(main, t4);
    			append_dev(main, a);
    			append_dev(main, t6);
    			append_dev(main, canvas);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*loadGraph*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let data = [];
    	let stats_country_date = [];
    	let stats_most_grand_slam = [];
    	let stats_masters_finals = [];
    	let stats_olympic_gold_medals = [];

    	async function getStats() {
    		console.log("Fetching stats....");
    		const res = await fetch("/api/v2/tennis");

    		if (res.ok) {
    			const data = await res.json();
    			console.log("Estadísticas recibidas: " + data.length);

    			data.forEach(stat => {
    				stats_country_date.push(stat.country + "-" + stat.year);
    				stats_most_grand_slam.push(stat["most_grand_slam"]);
    				stats_masters_finals.push(stat["masters_finals"]);
    				stats_olympic_gold_medals.push(stat["olympic_gold_medals"]);
    			});

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		var ctx = document.getElementById("myChart").getContext("2d");

    		new Chart(ctx,
    		{
    				type: "bar",
    				data: {
    					labels: stats_country_date,
    					datasets: [
    						{
    							label: "Grandslams ganados",
    							backgroundColor: "rgb(0, 128, 128)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_most_grand_slam
    						},
    						{
    							label: "Masters ganados",
    							backgroundColor: "rgb(255, 0 ,0)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_masters_finals
    						},
    						{
    							label: "Medallas olimpicas",
    							backgroundColor: "rgb(255, 255, 0)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_olympic_gold_medals
    						}
    					]
    				},
    				options: {}
    			});
    	}

    	onMount(getStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$k.warn(`<Chart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		data,
    		stats_country_date,
    		stats_most_grand_slam,
    		stats_masters_finals,
    		stats_olympic_gold_medals,
    		getStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) data = $$props.data;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('stats_most_grand_slam' in $$props) stats_most_grand_slam = $$props.stats_most_grand_slam;
    		if ('stats_masters_finals' in $$props) stats_masters_finals = $$props.stats_masters_finals;
    		if ('stats_olympic_gold_medals' in $$props) stats_olympic_gold_medals = $$props.stats_olympic_gold_medals;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class Chart_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_1",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\front\tennis\chart2.svelte generated by Svelte v3.47.0 */

    const { console: console_1$j } = globals;
    const file$p = "src\\front\\tennis\\chart2.svelte";

    function create_fragment$p(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t;
    	let main;
    	let figure;
    	let div;

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$p, 92, 4, 2918);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$p, 93, 4, 2990);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$p, 94, 4, 3072);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$p, 95, 4, 3151);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$p, 96, 4, 3231);
    			attr_dev(div, "id", "container");
    			add_location(div, file$p, 103, 8, 3391);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$p, 102, 4, 3347);
    			add_location(main, file$p, 101, 0, 3335);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chart2', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let stats = [];
    	let stats_country_date = [];
    	let stats_most_grand_slam = [];
    	let stats_olympic_gold_medals = [];
    	let stats_masters_finals = [];

    	async function getPEStats() {
    		console.log("Fetching stats....");
    		const res = await fetch("/api/v2/tennis");

    		if (res.ok) {
    			const data = await res.json();
    			stats = data;
    			console.log("Estadísticas recibidas: " + stats.length);

    			//inicializamos los arrays para mostrar los datos
    			stats.forEach(stat => {
    				stats_country_date.push(stat.country + "-" + stat.year);
    				stats_most_grand_slam.push(stat["most_grand_slam"]);
    				stats_masters_finals.push(stat["masters_finals"]);
    				stats_olympic_gold_medals.push(stat["olympic_gold_medals"]);
    			});

    			//esperamos para que se carrguen los datos 
    			await delay(500);

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart('container', {
    			chart: { type: 'area' },
    			title: { text: 'Más torneos ganados' },
    			subtitle: { text: 'Biblioteca: Highcharts' },
    			yAxis: { title: { text: 'Valor' } },
    			xAxis: {
    				title: { text: "País-Año" },
    				categories: stats_country_date
    			},
    			legend: {
    				layout: 'vertical',
    				align: 'right',
    				verticalAlign: 'middle'
    			},
    			series: [
    				{
    					name: 'Más grand slams',
    					data: stats_most_grand_slam
    				},
    				{
    					name: 'Finales de masters',
    					data: stats_masters_finals
    				},
    				{
    					name: 'Medallas olimpicas',
    					data: stats_olympic_gold_medals
    				}
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: 'horizontal',
    								align: 'center',
    								verticalAlign: 'bottom'
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getPEStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$j.warn(`<Chart2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		stats,
    		stats_country_date,
    		stats_most_grand_slam,
    		stats_olympic_gold_medals,
    		stats_masters_finals,
    		getPEStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('stats' in $$props) stats = $$props.stats;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('stats_most_grand_slam' in $$props) stats_most_grand_slam = $$props.stats_most_grand_slam;
    		if ('stats_olympic_gold_medals' in $$props) stats_olympic_gold_medals = $$props.stats_olympic_gold_medals;
    		if ('stats_masters_finals' in $$props) stats_masters_finals = $$props.stats_masters_finals;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Chart2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart2",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\front\tennis\twitch.svelte generated by Svelte v3.47.0 */

    const { console: console_1$i } = globals;
    const file$o = "src\\front\\tennis\\twitch.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (32:2) <Button color="success" on:click={function (){     window.location.href = `/#/tennis/twitchchart`    }}>
    function create_default_slot_1$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica visitas");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(32:2) <Button color=\\\"success\\\" on:click={function (){     window.location.href = `/#/tennis/twitchchart`    }}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>        import { onMount }
    function create_catch_block$8(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$8.name,
    		type: "catch",
    		source: "(1:0) <script>        import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (40:1) {:then entries}
    function create_then_block$8(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 65) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$8.name,
    		type: "then",
    		source: "(40:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (55:3) {#each entries as entry}
    function create_each_block$7(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[3].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[3].view_count + "";
    	let t2;
    	let t3;
    	let td2;
    	let iframe;
    	let iframe_src_value;
    	let t4;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			iframe = element("iframe");
    			t4 = space();
    			add_location(td0, file$o, 56, 5, 1139);
    			add_location(td1, file$o, 57, 5, 1168);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[3].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "360");
    			attr_dev(iframe, "width", "640");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$o, 59, 6, 1229);
    			add_location(td2, file$o, 58, 20, 1217);
    			add_location(tr, file$o, 55, 4, 1128);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, iframe);
    			append_dev(tr, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[3].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[3].view_count + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[3].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(55:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (41:1) <Table bordered>
    function create_default_slot$b(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let tbody;
    	let tr1;
    	let t6;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Numero de visitas";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Clip";
    			t5 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$o, 46, 4, 971);
    			add_location(th1, file$o, 47, 4, 992);
    			add_location(th2, file$o, 48, 4, 1024);
    			add_location(tr0, file$o, 44, 3, 955);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$o, 43, 2, 928);
    			add_location(tr1, file$o, 52, 3, 1077);
    			add_location(tbody, file$o, 51, 2, 1065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(41:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (38:16)   loading   {:then entries}
    function create_pending_block$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$8.name,
    		type: "pending",
    		source: "(38:16)   loading   {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let td;
    	let button;
    	let t2;
    	let promise;
    	let current;

    	button = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[1]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$8,
    		then: create_then_block$8,
    		catch: create_catch_block$8,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Clips: Twitch";
    			t1 = space();
    			td = element("td");
    			create_component(button.$$.fragment);
    			t2 = space();
    			info.block.c();
    			add_location(h1, file$o, 26, 4, 622);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$o, 25, 2, 585);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$o, 24, 1, 553);
    			attr_dev(td, "align", "center");
    			add_location(td, file$o, 30, 3, 684);
    			add_location(main, file$o, 22, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			append_dev(main, td);
    			mount_component(button, td, null);
    			append_dev(main, t2);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Twitch', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/tennis-twitch");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$i.warn(`<Twitch> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		window.location.href = `/#/tennis/twitchchart`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries, click_handler];
    }

    class Twitch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Twitch",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\front\tennis\twitchchart.svelte generated by Svelte v3.47.0 */

    const { console: console_1$h, document: document_1$1 } = globals;
    const file$n = "src\\front\\tennis\\twitchchart.svelte";

    function create_fragment$n(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let h2;
    	let t2;
    	let h4;
    	let t4;
    	let a;
    	let t6;
    	let canvas;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Más visitas";
    			t2 = space();
    			h4 = element("h4");
    			h4.textContent = "Biblioteca: Chart.js";
    			t4 = space();
    			a = element("a");
    			a.textContent = "Volver";
    			t6 = space();
    			canvas = element("canvas");
    			if (!src_url_equal(script.src, script_src_value = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$n, 50, 4, 1572);
    			attr_dev(h2, "class", "svelte-1f1idld");
    			add_location(h2, file$n, 56, 4, 1728);
    			attr_dev(h4, "class", "svelte-1f1idld");
    			add_location(h4, file$n, 57, 4, 1754);
    			attr_dev(a, "href", "/#/integrations");
    			attr_dev(a, "class", "btn btn-primary btn-lg active");
    			attr_dev(a, "role", "button");
    			attr_dev(a, "aria-pressed", "true");
    			add_location(a, file$n, 60, 4, 1951);
    			attr_dev(canvas, "id", "myChart");
    			add_location(canvas, file$n, 67, 4, 2109);
    			add_location(main, file$n, 55, 0, 1716);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1$1.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t2);
    			append_dev(main, h4);
    			append_dev(main, t4);
    			append_dev(main, a);
    			append_dev(main, t6);
    			append_dev(main, canvas);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*loadGraph*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Twitchchart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let data = [];
    	let stats_title = [];
    	let stats_views = [];

    	async function getStats() {
    		console.log("Fetching stats....");
    		const res = await fetch("api/v1/tennis-twitch");

    		if (res.ok) {
    			const data = await res.json();
    			console.log("Estadísticas recibidas: " + data.length);

    			data.forEach(stat => {
    				stats_title.push(stat.title);
    				stats_views.push(stat["view_count"]);
    			});

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		var ctx = document.getElementById("myChart").getContext("2d");

    		new Chart(ctx,
    		{
    				type: "bar",
    				data: {
    					labels: stats_title,
    					datasets: [
    						{
    							label: "Visitas",
    							backgroundColor: "rgba(255, 99, 132, 0.2)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_views
    						}
    					]
    				},
    				options: { scales: { y: { beginAtZero: true } } }
    			});
    	}

    	onMount(getStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$h.warn(`<Twitchchart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		data,
    		stats_title,
    		stats_views,
    		getStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) data = $$props.data;
    		if ('stats_title' in $$props) stats_title = $$props.stats_title;
    		if ('stats_views' in $$props) stats_views = $$props.stats_views;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class Twitchchart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Twitchchart",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\front\tennis\apitennislist.svelte generated by Svelte v3.47.0 */

    const { console: console_1$g } = globals;
    const file$m = "src\\front\\tennis\\apitennislist.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (32:2) <Button color="success" on:click={function (){     window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apitennischart`    }}>
    function create_default_slot_1$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(32:2) <Button color=\\\"success\\\" on:click={function (){     window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apitennischart`    }}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>        import { onMount }
    function create_catch_block$7(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$7.name,
    		type: "catch",
    		source: "(1:0) <script>        import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (40:1) {:then entries}
    function create_then_block$7(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 65) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$7.name,
    		type: "then",
    		source: "(40:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (57:3) {#each entries as entry}
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[3].Rank + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[3].Name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[3].Age + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[3].Points + "";
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			add_location(td0, file$m, 58, 5, 1221);
    			add_location(td1, file$m, 59, 5, 1249);
    			add_location(td2, file$m, 60, 20, 1292);
    			add_location(td3, file$m, 61, 5, 1319);
    			add_location(tr, file$m, 57, 4, 1210);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[3].Rank + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[3].Name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*entries*/ 1 && t4_value !== (t4_value = /*entry*/ ctx[3].Age + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[3].Points + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(57:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (41:1) <Table bordered>
    function create_default_slot$a(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let tr1;
    	let t8;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Ranking";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Nombre";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Edad";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Puntos";
    			t7 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$m, 46, 4, 1014);
    			add_location(th1, file$m, 47, 4, 1036);
    			add_location(th2, file$m, 48, 4, 1057);
    			add_location(th3, file$m, 49, 16, 1088);
    			add_location(tr0, file$m, 44, 3, 998);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$m, 43, 2, 971);
    			add_location(tr1, file$m, 54, 3, 1159);
    			add_location(tbody, file$m, 53, 2, 1147);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(41:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (38:16)   loading   {:then entries}
    function create_pending_block$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$7.name,
    		type: "pending",
    		source: "(38:16)   loading   {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let td;
    	let button;
    	let t2;
    	let promise;
    	let current;

    	button = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[1]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$7,
    		then: create_then_block$7,
    		catch: create_catch_block$7,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "API: public-expenditure-stats";
    			t1 = space();
    			td = element("td");
    			create_component(button.$$.fragment);
    			t2 = space();
    			info.block.c();
    			add_location(h1, file$m, 26, 4, 622);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$m, 25, 2, 585);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$m, 24, 1, 553);
    			attr_dev(td, "align", "center");
    			add_location(td, file$m, 30, 3, 700);
    			add_location(main, file$m, 22, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			append_dev(main, td);
    			mount_component(button, td, null);
    			append_dev(main, t2);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apitennislist', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/tennis-apiext");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$g.warn(`<Apitennislist> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apitennischart`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries, click_handler];
    }

    class Apitennislist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apitennislist",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\front\tennis\apitennislistchart.svelte generated by Svelte v3.47.0 */

    const { console: console_1$f, document: document_1 } = globals;
    const file$l = "src\\front\\tennis\\apitennislistchart.svelte";

    function create_fragment$l(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let h2;
    	let t2;
    	let h4;
    	let t4;
    	let a;
    	let t6;
    	let canvas;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Ranking ATP";
    			t2 = space();
    			h4 = element("h4");
    			h4.textContent = "Biblioteca: Chart.js";
    			t4 = space();
    			a = element("a");
    			a.textContent = "Volver";
    			t6 = space();
    			canvas = element("canvas");
    			if (!src_url_equal(script.src, script_src_value = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$l, 51, 4, 1607);
    			attr_dev(h2, "class", "svelte-1f1idld");
    			add_location(h2, file$l, 57, 4, 1763);
    			attr_dev(h4, "class", "svelte-1f1idld");
    			add_location(h4, file$l, 58, 4, 1789);
    			attr_dev(a, "href", "/#/integrations");
    			attr_dev(a, "class", "btn btn-primary btn-lg active");
    			attr_dev(a, "role", "button");
    			attr_dev(a, "aria-pressed", "true");
    			add_location(a, file$l, 61, 4, 1986);
    			attr_dev(canvas, "id", "myChart");
    			add_location(canvas, file$l, 68, 4, 2144);
    			add_location(main, file$l, 56, 0, 1751);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t2);
    			append_dev(main, h4);
    			append_dev(main, t4);
    			append_dev(main, a);
    			append_dev(main, t6);
    			append_dev(main, canvas);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*loadGraph*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apitennislistchart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let data = [];
    	let stats_name = [];
    	let stats_points = [];

    	async function getStats() {
    		console.log("Fetching stats....");
    		const res = await fetch("api/v1/tennis-apiext");

    		if (res.ok) {
    			const data = await res.json();
    			console.log("Estadísticas recibidas: " + data.length);

    			data.forEach(stat => {
    				stats_name.push(stat.Name);
    				stats_points.push(stat["Rank"]);
    			});

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		var ctx = document.getElementById("myChart").getContext("2d");

    		new Chart(ctx,
    		{
    				type: "radar",
    				data: {
    					labels: stats_name.slice(0, 10),
    					datasets: [
    						{
    							label: "Ranking",
    							backgroundColor: "rgba(255, 99, 132, 0.2)",
    							borderColor: "rgb(255, 255, 255)",
    							data: stats_points.slice(0, 10)
    						}
    					]
    				},
    				options: { scales: { y: { beginAtZero: true } } }
    			});
    	}

    	onMount(getStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$f.warn(`<Apitennislistchart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		data,
    		stats_name,
    		stats_points,
    		getStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) data = $$props.data;
    		if ('stats_name' in $$props) stats_name = $$props.stats_name;
    		if ('stats_points' in $$props) stats_points = $$props.stats_points;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class Apitennislistchart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apitennislistchart",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\front\tennis\apiext3list.svelte generated by Svelte v3.47.0 */

    const { console: console_1$e } = globals;
    const file$k = "src\\front\\tennis\\apiext3list.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (34:8) <Button              color="success"              on:click={function () {                  window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apiext3chart`;              }}          >
    function create_default_slot_1$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(34:8) <Button              color=\\\"success\\\"              on:click={function () {                  window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apiext3chart`;              }}          >",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$6(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$6.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (45:4) {:then entries}
    function create_then_block$6(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 65) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$6.name,
    		type: "then",
    		source: "(45:4) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (58:16) {#each entries as entry}
    function create_each_block$5(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[3].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[3].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[3].public_expenditure + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[3].pe_to_gdp + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[3].pe_on_defence + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			add_location(td0, file$k, 59, 24, 1816);
    			add_location(td1, file$k, 60, 24, 1866);
    			add_location(td2, file$k, 61, 24, 1913);
    			add_location(td3, file$k, 62, 24, 1974);
    			add_location(td4, file$k, 63, 24, 2026);
    			add_location(tr, file$k, 58, 20, 1786);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[3].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[3].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*entries*/ 1 && t4_value !== (t4_value = /*entry*/ ctx[3].public_expenditure + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[3].pe_to_gdp + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[3].pe_on_defence + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(58:16) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (46:8) <Table bordered>
    function create_default_slot$9(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let t10;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Country";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Year";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Public Expenditure";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "PE to GDP";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "PE on Defence";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$k, 48, 20, 1448);
    			add_location(th1, file$k, 49, 20, 1486);
    			add_location(th2, file$k, 50, 20, 1521);
    			add_location(th3, file$k, 51, 20, 1570);
    			add_location(th4, file$k, 52, 20, 1610);
    			add_location(tr0, file$k, 47, 16, 1422);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$k, 46, 12, 1382);
    			add_location(tr1, file$k, 56, 16, 1716);
    			add_location(tbody, file$k, 55, 12, 1691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(46:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (43:20)           loading      {:then entries}
    function create_pending_block$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$6.name,
    		type: "pending",
    		source: "(43:20)           loading      {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let td;
    	let button;
    	let t2;
    	let promise;
    	let current;

    	button = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[1]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$6,
    		then: create_then_block$6,
    		catch: create_catch_block$6,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "API: public-expenditure-stats";
    			t1 = space();
    			td = element("td");
    			create_component(button.$$.fragment);
    			t2 = space();
    			info.block.c();
    			add_location(h1, file$k, 29, 12, 922);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$k, 28, 8, 877);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$k, 27, 4, 839);
    			attr_dev(td, "align", "center");
    			add_location(td, file$k, 32, 4, 1004);
    			add_location(main, file$k, 26, 0, 827);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			append_dev(main, td);
    			mount_component(button, td, null);
    			append_dev(main, t2);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apiext3list', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		const res1 = await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/loadinitialdata");

    		if (res1.ok) {
    			console.log("Fetching entries....");
    			const res = await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats");

    			if (res.ok) {
    				const data = await res.json();
    				$$invalidate(0, entries = data);
    				console.log("Received entries: " + entries.length);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$e.warn(`<Apiext3list> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apiext3chart`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries, click_handler];
    }

    class Apiext3list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apiext3list",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\front\tennis\apiext3chart.svelte generated by Svelte v3.47.0 */

    const { console: console_1$d } = globals;
    const file$j = "src\\front\\tennis\\apiext3chart.svelte";

    function create_fragment$j(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t;
    	let main;
    	let figure;
    	let div;

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$j, 100, 4, 3364);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$j, 101, 4, 3435);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$j, 102, 4, 3516);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$j, 103, 4, 3594);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$j, 104, 4, 3674);
    			attr_dev(div, "id", "container");
    			add_location(div, file$j, 109, 8, 3826);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$j, 108, 4, 3782);
    			add_location(main, file$j, 107, 0, 3770);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apiext3chart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let stats = [];
    	let stats_country_date = [];
    	let stats_public_expenditure = [];
    	let stats_pe_on_defence = [];
    	let stats_pe_to_gdp = [];

    	async function getPEStats() {
    		console.log("Fetching stats....");
    		const res1 = await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/loadinitialdata");

    		if (res1.ok) {
    			const res = await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats");

    			if (res.ok) {
    				const data = await res.json();
    				stats = data;
    				console.log("Estadísticas recibidas: " + stats.length);

    				//inicializamos los arrays para mostrar los datos
    				stats.forEach(stat => {
    					stats_country_date.push(stat.country + "-" + stat.year);
    					stats_public_expenditure.push(stat["public_expenditure"]);
    					stats_pe_to_gdp.push(stat["pe_to_gdp"]);
    					stats_pe_on_defence.push(stat["pe_on_defence"]);
    				});

    				//esperamos para que se carrguen los datos
    				await delay(500);

    				loadGraph();
    			} else {
    				console.log("Error cargando los datos");
    			}
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			chart: { type: "column" },
    			title: { text: "Estadísticas de gasto público" },
    			subtitle: { text: "API Integrada 3" },
    			yAxis: { title: { text: "Valor" } },
    			xAxis: {
    				title: { text: "País-Año" },
    				categories: stats_country_date
    			},
    			legend: {
    				layout: "vertical",
    				align: "right",
    				verticalAlign: "middle"
    			},
    			series: [
    				{
    					name: "Gasto público",
    					data: stats_public_expenditure
    				},
    				{
    					name: "% de gasto público respecto a PIB",
    					data: stats_pe_to_gdp
    				},
    				{
    					name: "% destinado a defensa en GP",
    					data: stats_pe_on_defence
    				}
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: "horizontal",
    								align: "center",
    								verticalAlign: "bottom"
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getPEStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$d.warn(`<Apiext3chart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		stats,
    		stats_country_date,
    		stats_public_expenditure,
    		stats_pe_on_defence,
    		stats_pe_to_gdp,
    		getPEStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('stats' in $$props) stats = $$props.stats;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('stats_public_expenditure' in $$props) stats_public_expenditure = $$props.stats_public_expenditure;
    		if ('stats_pe_on_defence' in $$props) stats_pe_on_defence = $$props.stats_pe_on_defence;
    		if ('stats_pe_to_gdp' in $$props) stats_pe_to_gdp = $$props.stats_pe_to_gdp;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Apiext3chart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apiext3chart",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\front\tennis\apiext4list.svelte generated by Svelte v3.47.0 */

    const { console: console_1$c } = globals;
    const file$i = "src\\front\\tennis\\apiext4list.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (34:8) <Button              color="success"              on:click={function () {                  window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apiext4chart`;              }}          >
    function create_default_slot_1$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(34:8) <Button              color=\\\"success\\\"              on:click={function () {                  window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apiext4chart`;              }}          >",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$5(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$5.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (45:4) {:then entries}
    function create_then_block$5(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 65) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$5.name,
    		type: "then",
    		source: "(45:4) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (58:16) {#each entries as entry}
    function create_each_block$4(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[3].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[3].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[3].productions + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[3].exports + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[3].consumption + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			add_location(td0, file$i, 59, 24, 1765);
    			add_location(td1, file$i, 60, 24, 1815);
    			add_location(td2, file$i, 61, 24, 1862);
    			add_location(td3, file$i, 62, 24, 1916);
    			add_location(td4, file$i, 63, 24, 1966);
    			add_location(tr, file$i, 58, 20, 1735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[3].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[3].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*entries*/ 1 && t4_value !== (t4_value = /*entry*/ ctx[3].productions + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[3].exports + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[3].consumption + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(58:16) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (46:8) <Table bordered>
    function create_default_slot$8(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let t10;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Country";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Year";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Productions";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Exports";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Consumptions";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$i, 48, 20, 1407);
    			add_location(th1, file$i, 49, 20, 1445);
    			add_location(th2, file$i, 50, 20, 1480);
    			add_location(th3, file$i, 51, 20, 1522);
    			add_location(th4, file$i, 52, 20, 1560);
    			add_location(tr0, file$i, 47, 16, 1381);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$i, 46, 12, 1341);
    			add_location(tr1, file$i, 56, 16, 1665);
    			add_location(tbody, file$i, 55, 12, 1640);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(46:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (43:20)           loading      {:then entries}
    function create_pending_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$5.name,
    		type: "pending",
    		source: "(43:20)           loading      {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let td;
    	let button;
    	let t2;
    	let promise;
    	let current;

    	button = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[1]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$5,
    		then: create_then_block$5,
    		catch: create_catch_block$5,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "API: coal-stats";
    			t1 = space();
    			td = element("td");
    			create_component(button.$$.fragment);
    			t2 = space();
    			info.block.c();
    			add_location(h1, file$i, 29, 12, 895);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$i, 28, 8, 850);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$i, 27, 4, 812);
    			attr_dev(td, "align", "center");
    			add_location(td, file$i, 32, 4, 963);
    			add_location(main, file$i, 26, 0, 800);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			append_dev(main, td);
    			mount_component(button, td, null);
    			append_dev(main, t2);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apiext4list', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		const res1 = await fetch("https://sos2122-22.herokuapp.com/api/v2/coal-stats/loadinitialdata");

    		if (res1.ok) {
    			console.log("Fetching entries....");
    			const res = await fetch("https://sos2122-22.herokuapp.com/api/v2/coal-stats/");

    			if (res.ok) {
    				const data = await res.json();
    				$$invalidate(0, entries = data);
    				console.log("Received entries: " + entries.length);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$c.warn(`<Apiext4list> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		window.location.href = `https://sos2122-23.herokuapp.com/#/tennis/apiext4chart`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries, click_handler];
    }

    class Apiext4list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apiext4list",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\front\tennis\apiext4chart.svelte generated by Svelte v3.47.0 */

    const { console: console_1$b } = globals;
    const file$h = "src\\front\\tennis\\apiext4chart.svelte";

    function create_fragment$h(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t;
    	let main;
    	let figure;
    	let div;

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$h, 111, 4, 3587);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$h, 112, 4, 3658);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$h, 113, 4, 3739);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$h, 114, 4, 3817);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$h, 115, 4, 3897);
    			attr_dev(div, "id", "container");
    			add_location(div, file$h, 120, 8, 4049);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$h, 119, 4, 4005);
    			add_location(main, file$h, 118, 0, 3993);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apiext4chart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let stats = [];
    	let stats_country_date = [];
    	let stats_productions = [];
    	let stats_consumption = [];
    	let stats_exports = [];

    	async function getCoalStats() {
    		console.log("Fetching stats....");
    		const res1 = await fetch("https://sos2122-22.herokuapp.com/api/v2/coal-stats/loadinitialdata");

    		if (res1.ok) {
    			const res = await fetch("https://sos2122-22.herokuapp.com/api/v2/coal-stats/");

    			if (res.ok) {
    				const data = await res.json();
    				stats = data;
    				console.log("Estadísticas recibidas: " + stats.length);

    				//inicializamos los arrays para mostrar los datos
    				stats.forEach(stat => {
    					stats_country_date.push(stat.country + "-" + stat.year);
    					stats_productions.push(stat["productions"]);
    					stats_exports.push(stat["exports"]);
    					stats_consumption.push(stat["consumption"]);
    				});

    				//esperamos para que se carrguen los datos
    				await delay(500);

    				loadGraph();
    			} else {
    				console.log("Error cargando los datos");
    			}
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			chart: { type: "pie" },
    			title: { text: "Estadísticas de coal stats" },
    			subtitle: { text: "API Integrada 4" },
    			yAxis: { title: { text: "Valor" } },
    			xAxis: {
    				title: { text: "País-Año" },
    				categories: stats_country_date
    			},
    			plotOptions: {
    				pie: {
    					allowPointSelect: true,
    					cursor: 'pointer',
    					dataLabels: {
    						enabled: true,
    						format: ' {point.percentage:.1f} %'
    					}
    				}
    			},
    			legend: {
    				layout: "vertical",
    				align: "right",
    				verticalAlign: "middle"
    			},
    			series: [
    				{
    					name: "Gasto público",
    					data: stats_productions,
    					sliced: true
    				},
    				{
    					name: "% de gasto público respecto a PIB",
    					data: stats_exports
    				},
    				{
    					name: "% destinado a defensa en GP",
    					data: stats_consumption
    				}
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: "horizontal",
    								align: "center",
    								verticalAlign: "bottom"
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getCoalStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$b.warn(`<Apiext4chart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		stats,
    		stats_country_date,
    		stats_productions,
    		stats_consumption,
    		stats_exports,
    		getCoalStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('stats' in $$props) stats = $$props.stats;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('stats_productions' in $$props) stats_productions = $$props.stats_productions;
    		if ('stats_consumption' in $$props) stats_consumption = $$props.stats_consumption;
    		if ('stats_exports' in $$props) stats_exports = $$props.stats_exports;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Apiext4chart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apiext4chart",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\front\Info.svelte generated by Svelte v3.47.0 */

    const file$g = "src\\front\\Info.svelte";

    function create_fragment$g(ctx) {
    	let main;
    	let br0;
    	let t0;
    	let div7;
    	let div0;
    	let t1;
    	let div3;
    	let div2;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div1;
    	let h40;
    	let b0;
    	let t4;
    	let a0;
    	let button0;
    	let t6;
    	let div6;
    	let div5;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let div4;
    	let h41;
    	let b1;
    	let t9;
    	let a1;
    	let button1;
    	let t11;
    	let br1;
    	let t12;
    	let div17;
    	let div10;
    	let div9;
    	let img2;
    	let img2_src_value;
    	let t13;
    	let div8;
    	let h42;
    	let b2;
    	let t15;
    	let p0;
    	let t17;
    	let a2;
    	let button2;
    	let t19;
    	let a3;
    	let button3;
    	let t21;
    	let a4;
    	let button4;
    	let t23;
    	let a5;
    	let button5;
    	let t25;
    	let div13;
    	let div12;
    	let img3;
    	let img3_src_value;
    	let t26;
    	let div11;
    	let h43;
    	let b3;
    	let t28;
    	let p1;
    	let t30;
    	let a6;
    	let button6;
    	let t32;
    	let a7;
    	let button7;
    	let t34;
    	let a8;
    	let button8;
    	let t36;
    	let a9;
    	let button9;
    	let t38;
    	let a10;
    	let button10;
    	let t40;
    	let div16;
    	let div15;
    	let img4;
    	let img4_src_value;
    	let t41;
    	let div14;
    	let h44;
    	let b4;
    	let t43;
    	let p2;
    	let t45;
    	let a11;
    	let button11;
    	let t47;
    	let a12;
    	let button12;
    	let t49;
    	let a13;
    	let button13;
    	let t51;
    	let a14;
    	let button14;
    	let t53;
    	let a15;
    	let button15;
    	let t55;
    	let a16;
    	let button16;
    	let t57;
    	let a17;
    	let button17;
    	let t59;
    	let br2;
    	let t60;
    	let div27;
    	let div20;
    	let div19;
    	let div18;
    	let h45;
    	let b5;
    	let t62;
    	let p3;
    	let t64;
    	let a18;
    	let button18;
    	let t66;
    	let div23;
    	let div22;
    	let div21;
    	let h46;
    	let b6;
    	let t68;
    	let p4;
    	let t70;
    	let a19;
    	let button19;
    	let t72;
    	let div26;
    	let div25;
    	let div24;
    	let h47;
    	let b7;
    	let t74;
    	let p5;

    	const block = {
    		c: function create() {
    			main = element("main");
    			br0 = element("br");
    			t0 = space();
    			div7 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img0 = element("img");
    			t2 = space();
    			div1 = element("div");
    			h40 = element("h4");
    			b0 = element("b");
    			b0.textContent = "Repositorio de github";
    			t4 = space();
    			a0 = element("a");
    			button0 = element("button");
    			button0.textContent = "Enlace";
    			t6 = space();
    			div6 = element("div");
    			div5 = element("div");
    			img1 = element("img");
    			t7 = space();
    			div4 = element("div");
    			h41 = element("h4");
    			b1 = element("b");
    			b1.textContent = "Gráfica Grupal";
    			t9 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "Enlace";
    			t11 = space();
    			br1 = element("br");
    			t12 = space();
    			div17 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			img2 = element("img");
    			t13 = space();
    			div8 = element("div");
    			h42 = element("h4");
    			b2 = element("b");
    			b2.textContent = "NBA";
    			t15 = space();
    			p0 = element("p");
    			p0.textContent = "Fernando Pardo Beltrán";
    			t17 = space();
    			a2 = element("a");
    			button2 = element("button");
    			button2.textContent = "API v1";
    			t19 = space();
    			a3 = element("a");
    			button3 = element("button");
    			button3.textContent = "API v2";
    			t21 = space();
    			a4 = element("a");
    			button4 = element("button");
    			button4.textContent = "Docs";
    			t23 = space();
    			a5 = element("a");
    			button5 = element("button");
    			button5.textContent = "Interfaz";
    			t25 = space();
    			div13 = element("div");
    			div12 = element("div");
    			img3 = element("img");
    			t26 = space();
    			div11 = element("div");
    			h43 = element("h4");
    			b3 = element("b");
    			b3.textContent = "Premier League";
    			t28 = space();
    			p1 = element("p");
    			p1.textContent = "Alberto Martín Martín";
    			t30 = space();
    			a6 = element("a");
    			button6 = element("button");
    			button6.textContent = "API V1";
    			t32 = space();
    			a7 = element("a");
    			button7 = element("button");
    			button7.textContent = "API V1 Docs";
    			t34 = space();
    			a8 = element("a");
    			button8 = element("button");
    			button8.textContent = "API V2";
    			t36 = space();
    			a9 = element("a");
    			button9 = element("button");
    			button9.textContent = "API V2 Docs";
    			t38 = space();
    			a10 = element("a");
    			button10 = element("button");
    			button10.textContent = "Interfaz";
    			t40 = space();
    			div16 = element("div");
    			div15 = element("div");
    			img4 = element("img");
    			t41 = space();
    			div14 = element("div");
    			h44 = element("h4");
    			b4 = element("b");
    			b4.textContent = "Tennis";
    			t43 = space();
    			p2 = element("p");
    			p2.textContent = "Antonio Saborido Campos";
    			t45 = space();
    			a11 = element("a");
    			button11 = element("button");
    			button11.textContent = "API V1";
    			t47 = space();
    			a12 = element("a");
    			button12 = element("button");
    			button12.textContent = "API V1 Docs";
    			t49 = space();
    			a13 = element("a");
    			button13 = element("button");
    			button13.textContent = "API V2";
    			t51 = space();
    			a14 = element("a");
    			button14 = element("button");
    			button14.textContent = "API V2 Docs";
    			t53 = space();
    			a15 = element("a");
    			button15 = element("button");
    			button15.textContent = "Interfaz";
    			t55 = space();
    			a16 = element("a");
    			button16 = element("button");
    			button16.textContent = "Gráfica 1";
    			t57 = space();
    			a17 = element("a");
    			button17 = element("button");
    			button17.textContent = "Gráfica 2";
    			t59 = space();
    			br2 = element("br");
    			t60 = space();
    			div27 = element("div");
    			div20 = element("div");
    			div19 = element("div");
    			div18 = element("div");
    			h45 = element("h4");
    			b5 = element("b");
    			b5.textContent = "Fernando Pardo Beltrán";
    			t62 = space();
    			p3 = element("p");
    			p3.textContent = "Fuente de datos:";
    			t64 = space();
    			a18 = element("a");
    			button18 = element("button");
    			button18.textContent = "#";
    			t66 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			h46 = element("h4");
    			b6 = element("b");
    			b6.textContent = "Alberto";
    			t68 = space();
    			p4 = element("p");
    			p4.textContent = "Fuente de datos:";
    			t70 = space();
    			a19 = element("a");
    			button19 = element("button");
    			button19.textContent = "#";
    			t72 = space();
    			div26 = element("div");
    			div25 = element("div");
    			div24 = element("div");
    			h47 = element("h4");
    			b7 = element("b");
    			b7.textContent = "Antonio Saborido Campos";
    			t74 = space();
    			p5 = element("p");
    			p5.textContent = "Fuente de datos: Tennis";
    			add_location(br0, file$g, 1, 4, 12);
    			attr_dev(div0, "class", "col-sm-2");
    			add_location(div0, file$g, 4, 8, 59);
    			if (!src_url_equal(img0.src, img0_src_value = "https://logos-world.net/wp-content/uploads/2020/11/GitHub-Emblem.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Avatar");
    			set_style(img0, "width", "100%");
    			add_location(img0, file$g, 9, 16, 181);
    			add_location(b0, file$g, 15, 24, 442);
    			add_location(h40, file$g, 15, 20, 438);
    			attr_dev(button0, "class", "btn btn-primary");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$g, 17, 24, 571);
    			attr_dev(a0, "href", "https://github.com/gti-sos/SOS2122-23");
    			add_location(a0, file$g, 16, 20, 497);
    			attr_dev(div1, "class", "container svelte-110ltv7");
    			add_location(div1, file$g, 14, 16, 393);
    			attr_dev(div2, "class", "card svelte-110ltv7");
    			add_location(div2, file$g, 8, 12, 145);
    			attr_dev(div3, "class", "col-sm-4");
    			add_location(div3, file$g, 7, 8, 109);
    			if (!src_url_equal(img1.src, img1_src_value = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx7LjsiVGVT5pTCSj0ANMAoaJ0ELqh5hmygZv2q3YeM2VQLkm8FGeA8Cr_DeZQI_4o1Ps&usqp=CAU")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Avatar");
    			set_style(img1, "width", "100%");
    			add_location(img1, file$g, 27, 16, 874);
    			add_location(b1, file$g, 33, 24, 1199);
    			add_location(h41, file$g, 33, 20, 1195);
    			attr_dev(button1, "class", "btn btn-primary");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file$g, 35, 24, 1297);
    			attr_dev(a1, "href", "/#/groupgraph");
    			add_location(a1, file$g, 34, 20, 1247);
    			attr_dev(div4, "class", "container svelte-110ltv7");
    			add_location(div4, file$g, 32, 16, 1150);
    			attr_dev(div5, "class", "card svelte-110ltv7");
    			add_location(div5, file$g, 26, 12, 838);
    			attr_dev(div6, "class", "col-sm-4");
    			add_location(div6, file$g, 25, 8, 802);
    			attr_dev(div7, "class", "row");
    			add_location(div7, file$g, 2, 4, 22);
    			add_location(br1, file$g, 44, 4, 1539);
    			if (!src_url_equal(img2.src, img2_src_value = "https://elordenmundial.com/wp-content/uploads/2020/10/NBA-logo-baloncesto-historia-deporte-estados-unidos.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Avatar");
    			set_style(img2, "width", "100%");
    			add_location(img2, file$g, 48, 16, 1648);
    			add_location(b2, file$g, 54, 24, 1950);
    			add_location(h42, file$g, 54, 20, 1946);
    			add_location(p0, file$g, 55, 20, 1987);
    			attr_dev(button2, "class", "btn btn-primary");
    			attr_dev(button2, "type", "submit");
    			add_location(button2, file$g, 57, 24, 2091);
    			attr_dev(a2, "href", "api/v1/nba-stats");
    			add_location(a2, file$g, 56, 20, 2038);
    			attr_dev(button3, "class", "btn btn-primary");
    			attr_dev(button3, "type", "submit");
    			add_location(button3, file$g, 61, 24, 2283);
    			attr_dev(a3, "href", "api/v2/nba-stats");
    			add_location(a3, file$g, 60, 20, 2230);
    			attr_dev(button4, "class", "btn btn-primary");
    			attr_dev(button4, "type", "submit");
    			add_location(button4, file$g, 65, 24, 2480);
    			attr_dev(a4, "href", "api/v2/nba-stats/docs");
    			add_location(a4, file$g, 64, 20, 2422);
    			attr_dev(button5, "class", "btn btn-primary");
    			attr_dev(button5, "type", "submit");
    			add_location(button5, file$g, 69, 24, 2666);
    			attr_dev(a5, "href", "/#/nba-stats");
    			add_location(a5, file$g, 68, 20, 2617);
    			attr_dev(div8, "class", "container svelte-110ltv7");
    			add_location(div8, file$g, 53, 16, 1901);
    			attr_dev(div9, "class", "card svelte-110ltv7");
    			add_location(div9, file$g, 47, 12, 1612);
    			attr_dev(div10, "class", "col-sm-4");
    			add_location(div10, file$g, 46, 8, 1576);
    			if (!src_url_equal(img3.src, img3_src_value = "https://obamabcn.com/wp-content/uploads/2019/11/logo-premier-league.jpg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Avatar");
    			set_style(img3, "width", "100%");
    			add_location(img3, file$g, 77, 16, 2927);
    			add_location(b3, file$g, 83, 24, 3191);
    			add_location(h43, file$g, 83, 20, 3187);
    			add_location(p1, file$g, 84, 20, 3239);
    			attr_dev(button6, "class", "btn btn-primary");
    			attr_dev(button6, "type", "submit");
    			add_location(button6, file$g, 86, 24, 3348);
    			attr_dev(a6, "href", "/api/v1/premier-league");
    			add_location(a6, file$g, 85, 20, 3289);
    			attr_dev(button7, "class", "btn btn-primary");
    			attr_dev(button7, "type", "submit");
    			add_location(button7, file$g, 91, 24, 3577);
    			attr_dev(a7, "href", "/api/v1/premier-league/docs");
    			add_location(a7, file$g, 90, 20, 3513);
    			attr_dev(button8, "class", "btn btn-primary");
    			attr_dev(button8, "type", "submit");
    			add_location(button8, file$g, 96, 24, 3806);
    			attr_dev(a8, "href", "/api/v2/premier-league");
    			add_location(a8, file$g, 95, 20, 3747);
    			attr_dev(button9, "class", "btn btn-primary");
    			attr_dev(button9, "type", "submit");
    			add_location(button9, file$g, 101, 24, 4035);
    			attr_dev(a9, "href", "/api/v2/premier-league/docs");
    			add_location(a9, file$g, 100, 20, 3971);
    			attr_dev(button10, "class", "btn btn-primary");
    			attr_dev(button10, "type", "submit");
    			add_location(button10, file$g, 106, 24, 4259);
    			attr_dev(a10, "href", "/#/premier-league");
    			add_location(a10, file$g, 105, 20, 4205);
    			attr_dev(div11, "class", "container svelte-110ltv7");
    			add_location(div11, file$g, 82, 16, 3142);
    			attr_dev(div12, "class", "card svelte-110ltv7");
    			add_location(div12, file$g, 76, 12, 2891);
    			attr_dev(div13, "class", "col-sm-4");
    			add_location(div13, file$g, 75, 8, 2855);
    			if (!src_url_equal(img4.src, img4_src_value = "https://photoresources.wtatennis.com/photo-resources/2019/08/15/dbb59626-9254-4426-915e-57397b6d6635/tennis-origins-e1444901660593.jpg?width=1200&height=630")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Avatar");
    			set_style(img4, "width", "100%");
    			add_location(img4, file$g, 115, 16, 4546);
    			add_location(b4, file$g, 121, 24, 4895);
    			add_location(h44, file$g, 121, 20, 4891);
    			add_location(p2, file$g, 122, 20, 4935);
    			attr_dev(button11, "class", "btn btn-primary");
    			attr_dev(button11, "type", "submit");
    			add_location(button11, file$g, 124, 24, 5038);
    			attr_dev(a11, "href", "/api/v1/tennis");
    			add_location(a11, file$g, 123, 20, 4987);
    			attr_dev(button12, "class", "btn btn-primary");
    			attr_dev(button12, "type", "submit");
    			add_location(button12, file$g, 129, 24, 5259);
    			attr_dev(a12, "href", "/api/v1/tennis/docs");
    			add_location(a12, file$g, 128, 20, 5203);
    			attr_dev(button13, "class", "btn btn-primary");
    			attr_dev(button13, "type", "submit");
    			add_location(button13, file$g, 134, 24, 5480);
    			attr_dev(a13, "href", "/api/v2/tennis");
    			add_location(a13, file$g, 133, 20, 5429);
    			attr_dev(button14, "class", "btn btn-primary");
    			attr_dev(button14, "type", "submit");
    			add_location(button14, file$g, 139, 24, 5701);
    			attr_dev(a14, "href", "/api/v2/tennis/docs");
    			add_location(a14, file$g, 138, 20, 5645);
    			attr_dev(button15, "class", "btn btn-primary");
    			attr_dev(button15, "type", "submit");
    			add_location(button15, file$g, 144, 24, 5917);
    			attr_dev(a15, "href", "/#/tennis");
    			add_location(a15, file$g, 143, 20, 5871);
    			attr_dev(button16, "class", "btn btn-primary");
    			attr_dev(button16, "type", "submit");
    			add_location(button16, file$g, 149, 24, 6136);
    			attr_dev(a16, "href", "/#/tennis/chart");
    			add_location(a16, file$g, 148, 20, 6084);
    			attr_dev(button17, "class", "btn btn-primary");
    			attr_dev(button17, "type", "submit");
    			add_location(button17, file$g, 154, 24, 6357);
    			attr_dev(a17, "href", "/#/tennis/chart2");
    			add_location(a17, file$g, 153, 20, 6304);
    			attr_dev(div14, "class", "container svelte-110ltv7");
    			add_location(div14, file$g, 120, 16, 4846);
    			attr_dev(div15, "class", "card svelte-110ltv7");
    			add_location(div15, file$g, 114, 12, 4510);
    			attr_dev(div16, "class", "col-sm-4");
    			add_location(div16, file$g, 113, 8, 4474);
    			attr_dev(div17, "class", "row");
    			add_location(div17, file$g, 45, 4, 1549);
    			add_location(br2, file$g, 162, 4, 6581);
    			add_location(b5, file$g, 167, 24, 6739);
    			add_location(h45, file$g, 167, 20, 6735);
    			add_location(p3, file$g, 168, 20, 6795);
    			attr_dev(button18, "class", "btn btn-primary");
    			attr_dev(button18, "type", "submit");
    			add_location(button18, file$g, 170, 24, 6894);
    			attr_dev(a18, "href", "/api/v2/nba-stats");
    			add_location(a18, file$g, 169, 20, 6840);
    			attr_dev(div18, "class", "container svelte-110ltv7");
    			add_location(div18, file$g, 166, 16, 6690);
    			attr_dev(div19, "class", "card svelte-110ltv7");
    			add_location(div19, file$g, 165, 12, 6654);
    			attr_dev(div20, "class", "col-sm-4");
    			add_location(div20, file$g, 164, 8, 6618);
    			add_location(b6, file$g, 181, 24, 7245);
    			add_location(h46, file$g, 181, 20, 7241);
    			add_location(p4, file$g, 182, 20, 7286);
    			attr_dev(button19, "class", "btn btn-primary");
    			attr_dev(button19, "type", "submit");
    			add_location(button19, file$g, 184, 24, 7390);
    			attr_dev(a19, "href", "/api/v2/premier-league");
    			add_location(a19, file$g, 183, 20, 7331);
    			attr_dev(div21, "class", "container svelte-110ltv7");
    			add_location(div21, file$g, 180, 16, 7196);
    			attr_dev(div22, "class", "card svelte-110ltv7");
    			add_location(div22, file$g, 179, 12, 7160);
    			attr_dev(div23, "class", "col-sm-4");
    			add_location(div23, file$g, 178, 8, 7124);
    			add_location(b7, file$g, 195, 24, 7742);
    			add_location(h47, file$g, 195, 20, 7738);
    			add_location(p5, file$g, 196, 20, 7799);
    			attr_dev(div24, "class", "container svelte-110ltv7");
    			add_location(div24, file$g, 194, 16, 7693);
    			attr_dev(div25, "class", "card svelte-110ltv7");
    			add_location(div25, file$g, 193, 12, 7657);
    			attr_dev(div26, "class", "col-sm-4");
    			add_location(div26, file$g, 192, 8, 7621);
    			attr_dev(div27, "class", "row");
    			add_location(div27, file$g, 163, 4, 6591);
    			add_location(main, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, br0);
    			append_dev(main, t0);
    			append_dev(main, div7);
    			append_dev(div7, div0);
    			append_dev(div7, t1);
    			append_dev(div7, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, h40);
    			append_dev(h40, b0);
    			append_dev(div1, t4);
    			append_dev(div1, a0);
    			append_dev(a0, button0);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, img1);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, h41);
    			append_dev(h41, b1);
    			append_dev(div4, t9);
    			append_dev(div4, a1);
    			append_dev(a1, button1);
    			append_dev(main, t11);
    			append_dev(main, br1);
    			append_dev(main, t12);
    			append_dev(main, div17);
    			append_dev(div17, div10);
    			append_dev(div10, div9);
    			append_dev(div9, img2);
    			append_dev(div9, t13);
    			append_dev(div9, div8);
    			append_dev(div8, h42);
    			append_dev(h42, b2);
    			append_dev(div8, t15);
    			append_dev(div8, p0);
    			append_dev(div8, t17);
    			append_dev(div8, a2);
    			append_dev(a2, button2);
    			append_dev(div8, t19);
    			append_dev(div8, a3);
    			append_dev(a3, button3);
    			append_dev(div8, t21);
    			append_dev(div8, a4);
    			append_dev(a4, button4);
    			append_dev(div8, t23);
    			append_dev(div8, a5);
    			append_dev(a5, button5);
    			append_dev(div17, t25);
    			append_dev(div17, div13);
    			append_dev(div13, div12);
    			append_dev(div12, img3);
    			append_dev(div12, t26);
    			append_dev(div12, div11);
    			append_dev(div11, h43);
    			append_dev(h43, b3);
    			append_dev(div11, t28);
    			append_dev(div11, p1);
    			append_dev(div11, t30);
    			append_dev(div11, a6);
    			append_dev(a6, button6);
    			append_dev(div11, t32);
    			append_dev(div11, a7);
    			append_dev(a7, button7);
    			append_dev(div11, t34);
    			append_dev(div11, a8);
    			append_dev(a8, button8);
    			append_dev(div11, t36);
    			append_dev(div11, a9);
    			append_dev(a9, button9);
    			append_dev(div11, t38);
    			append_dev(div11, a10);
    			append_dev(a10, button10);
    			append_dev(div17, t40);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, img4);
    			append_dev(div15, t41);
    			append_dev(div15, div14);
    			append_dev(div14, h44);
    			append_dev(h44, b4);
    			append_dev(div14, t43);
    			append_dev(div14, p2);
    			append_dev(div14, t45);
    			append_dev(div14, a11);
    			append_dev(a11, button11);
    			append_dev(div14, t47);
    			append_dev(div14, a12);
    			append_dev(a12, button12);
    			append_dev(div14, t49);
    			append_dev(div14, a13);
    			append_dev(a13, button13);
    			append_dev(div14, t51);
    			append_dev(div14, a14);
    			append_dev(a14, button14);
    			append_dev(div14, t53);
    			append_dev(div14, a15);
    			append_dev(a15, button15);
    			append_dev(div14, t55);
    			append_dev(div14, a16);
    			append_dev(a16, button16);
    			append_dev(div14, t57);
    			append_dev(div14, a17);
    			append_dev(a17, button17);
    			append_dev(main, t59);
    			append_dev(main, br2);
    			append_dev(main, t60);
    			append_dev(main, div27);
    			append_dev(div27, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div18, h45);
    			append_dev(h45, b5);
    			append_dev(div18, t62);
    			append_dev(div18, p3);
    			append_dev(div18, t64);
    			append_dev(div18, a18);
    			append_dev(a18, button18);
    			append_dev(div27, t66);
    			append_dev(div27, div23);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, h46);
    			append_dev(h46, b6);
    			append_dev(div21, t68);
    			append_dev(div21, p4);
    			append_dev(div21, t70);
    			append_dev(div21, a19);
    			append_dev(a19, button19);
    			append_dev(div27, t72);
    			append_dev(div27, div26);
    			append_dev(div26, div25);
    			append_dev(div25, div24);
    			append_dev(div24, h47);
    			append_dev(h47, b7);
    			append_dev(div24, t74);
    			append_dev(div24, p5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\front\components\Footer.svelte generated by Svelte v3.47.0 */

    const file$f = "src\\front\\components\\Footer.svelte";

    function create_fragment$f(ctx) {
    	let footer;
    	let div;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			div.textContent = "https://github.com/gti-sos/SOS2122-23";
    			attr_dev(div, "class", "copyright svelte-p8u2kc");
    			add_location(div, file$f, 1, 4, 14);
    			attr_dev(footer, "class", "svelte-p8u2kc");
    			add_location(footer, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\front\components\Header.svelte generated by Svelte v3.47.0 */

    const file$e = "src\\front\\components\\Header.svelte";

    function create_fragment$e(ctx) {
    	let header;
    	let div11;
    	let div0;
    	let a0;
    	let h2;
    	let t1;
    	let div10;
    	let div1;
    	let a1;
    	let h50;
    	let t3;
    	let div2;
    	let a2;
    	let h51;
    	let t5;
    	let div3;
    	let a3;
    	let h52;
    	let t7;
    	let div4;
    	let a4;
    	let h53;
    	let t9;
    	let div5;
    	let a5;
    	let h54;
    	let t11;
    	let div6;
    	let t13;
    	let div7;
    	let a6;
    	let h55;
    	let t15;
    	let div8;
    	let a7;
    	let h56;
    	let t17;
    	let div9;
    	let a8;
    	let h57;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div11 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			h2 = element("h2");
    			h2.textContent = "INICIO";
    			t1 = space();
    			div10 = element("div");
    			div1 = element("div");
    			a1 = element("a");
    			h50 = element("h5");
    			h50.textContent = "About";
    			t3 = space();
    			div2 = element("div");
    			a2 = element("a");
    			h51 = element("h5");
    			h51.textContent = "Analytics";
    			t5 = space();
    			div3 = element("div");
    			a3 = element("a");
    			h52 = element("h5");
    			h52.textContent = "Integrations";
    			t7 = space();
    			div4 = element("div");
    			a4 = element("a");
    			h53 = element("h5");
    			h53.textContent = "Info";
    			t9 = space();
    			div5 = element("div");
    			a5 = element("a");
    			h54 = element("h5");
    			h54.textContent = "GroupGraph";
    			t11 = text("\r\n            `\r\n            ");
    			div6 = element("div");
    			div6.textContent = "|";
    			t13 = space();
    			div7 = element("div");
    			a6 = element("a");
    			h55 = element("h5");
    			h55.textContent = "PremierLeague";
    			t15 = space();
    			div8 = element("div");
    			a7 = element("a");
    			h56 = element("h5");
    			h56.textContent = "Tennis";
    			t17 = space();
    			div9 = element("div");
    			a8 = element("a");
    			h57 = element("h5");
    			h57.textContent = "NBA";
    			add_location(h2, file$e, 3, 23, 89);
    			attr_dev(a0, "href", "");
    			attr_dev(a0, "class", "svelte-i43apv");
    			add_location(a0, file$e, 3, 12, 78);
    			attr_dev(div0, "id", "titulo");
    			add_location(div0, file$e, 2, 8, 47);
    			attr_dev(h50, "class", "svelte-i43apv");
    			add_location(h50, file$e, 8, 35, 221);
    			attr_dev(a1, "href", "/#/about");
    			attr_dev(a1, "class", "svelte-i43apv");
    			add_location(a1, file$e, 8, 16, 202);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$e, 7, 12, 167);
    			attr_dev(h51, "class", "svelte-i43apv");
    			add_location(h51, file$e, 11, 39, 331);
    			attr_dev(a2, "href", "/#/analytics");
    			attr_dev(a2, "class", "svelte-i43apv");
    			add_location(a2, file$e, 11, 16, 308);
    			attr_dev(div2, "class", "col");
    			add_location(div2, file$e, 10, 12, 273);
    			attr_dev(h52, "class", "svelte-i43apv");
    			add_location(h52, file$e, 14, 42, 448);
    			attr_dev(a3, "href", "/#/integrations");
    			attr_dev(a3, "class", "svelte-i43apv");
    			add_location(a3, file$e, 14, 16, 422);
    			attr_dev(div3, "class", "col");
    			add_location(div3, file$e, 13, 12, 387);
    			attr_dev(h53, "class", "svelte-i43apv");
    			add_location(h53, file$e, 17, 34, 560);
    			attr_dev(a4, "href", "/#/info");
    			attr_dev(a4, "class", "svelte-i43apv");
    			add_location(a4, file$e, 17, 16, 542);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$e, 16, 12, 507);
    			attr_dev(h54, "class", "svelte-i43apv");
    			add_location(h54, file$e, 20, 40, 670);
    			attr_dev(a5, "href", "/#/groupgraph");
    			attr_dev(a5, "class", "svelte-i43apv");
    			add_location(a5, file$e, 20, 16, 646);
    			attr_dev(div5, "class", "col");
    			add_location(div5, file$e, 19, 12, 611);
    			attr_dev(div6, "class", "col svelte-i43apv");
    			attr_dev(div6, "id", "negro");
    			add_location(div6, file$e, 23, 12, 742);
    			attr_dev(h55, "class", "svelte-i43apv");
    			add_location(h55, file$e, 25, 44, 854);
    			attr_dev(a6, "href", "/#/premier-league");
    			attr_dev(a6, "class", "svelte-i43apv");
    			add_location(a6, file$e, 25, 16, 826);
    			attr_dev(div7, "class", "col");
    			add_location(div7, file$e, 24, 12, 791);
    			attr_dev(h56, "class", "svelte-i43apv");
    			add_location(h56, file$e, 28, 36, 969);
    			attr_dev(a7, "href", "/#/tennis");
    			attr_dev(a7, "class", "svelte-i43apv");
    			add_location(a7, file$e, 28, 16, 949);
    			attr_dev(div8, "class", "col");
    			add_location(div8, file$e, 27, 12, 914);
    			attr_dev(h57, "class", "svelte-i43apv");
    			add_location(h57, file$e, 31, 39, 1080);
    			attr_dev(a8, "href", "/#/nba-stats");
    			attr_dev(a8, "class", "svelte-i43apv");
    			add_location(a8, file$e, 31, 16, 1057);
    			attr_dev(div9, "class", "col");
    			add_location(div9, file$e, 30, 12, 1022);
    			attr_dev(div10, "class", "row svelte-i43apv");
    			add_location(div10, file$e, 6, 8, 136);
    			attr_dev(div11, "class", "container svelte-i43apv");
    			add_location(div11, file$e, 1, 4, 14);
    			attr_dev(header, "class", "svelte-i43apv");
    			add_location(header, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div11);
    			append_dev(div11, div0);
    			append_dev(div0, a0);
    			append_dev(a0, h2);
    			append_dev(div11, t1);
    			append_dev(div11, div10);
    			append_dev(div10, div1);
    			append_dev(div1, a1);
    			append_dev(a1, h50);
    			append_dev(div10, t3);
    			append_dev(div10, div2);
    			append_dev(div2, a2);
    			append_dev(a2, h51);
    			append_dev(div10, t5);
    			append_dev(div10, div3);
    			append_dev(div3, a3);
    			append_dev(a3, h52);
    			append_dev(div10, t7);
    			append_dev(div10, div4);
    			append_dev(div4, a4);
    			append_dev(a4, h53);
    			append_dev(div10, t9);
    			append_dev(div10, div5);
    			append_dev(div5, a5);
    			append_dev(a5, h54);
    			append_dev(div10, t11);
    			append_dev(div10, div6);
    			append_dev(div10, t13);
    			append_dev(div10, div7);
    			append_dev(div7, a6);
    			append_dev(a6, h55);
    			append_dev(div10, t15);
    			append_dev(div10, div8);
    			append_dev(div8, a7);
    			append_dev(a7, h56);
    			append_dev(div10, t17);
    			append_dev(div10, div9);
    			append_dev(div9, a8);
    			append_dev(a8, h57);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\front\GroupGraph.svelte generated by Svelte v3.47.0 */

    const { console: console_1$a } = globals;
    const file$d = "src\\front\\GroupGraph.svelte";

    // (204:4) <Button outline color="secondary" href="/">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(204:4) <Button outline color=\\\"secondary\\\" href=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let div0;
    	let h2;
    	let t2;
    	let figure;
    	let div1;
    	let t3;
    	let p;
    	let t4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				href: "/",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Gráfica conjunta SOS2122-23";
    			t2 = space();
    			figure = element("figure");
    			div1 = element("div");
    			t3 = space();
    			p = element("p");
    			t4 = space();
    			create_component(button.$$.fragment);
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$d, 178, 4, 6047);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$d, 179, 4, 6140);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$d, 180, 4, 6243);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$d, 181, 4, 6343);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$d, 182, 4, 6445);
    			add_location(h2, file$d, 191, 8, 6618);
    			add_location(div0, file$d, 190, 4, 6603);
    			attr_dev(div1, "id", "container");
    			add_location(div1, file$d, 197, 8, 6744);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$d, 198, 8, 6780);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$d, 196, 4, 6700);
    			attr_dev(main, "class", "svelte-dh8p91");
    			add_location(main, file$d, 185, 2, 6573);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h2);
    			append_dev(main, t2);
    			append_dev(main, figure);
    			append_dev(figure, div1);
    			append_dev(figure, t3);
    			append_dev(figure, p);
    			append_dev(main, t4);
    			mount_component(button, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(script0, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script1, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script2, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script3, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script4, "load", /*loadGraph*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GroupGraph', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));

    	//Tennis
    	let tennisData = [];

    	let tennisChartCountryYear = [];
    	let tennisChartmost_grand_slam = [];
    	let tennisChartmasters_finals = [];
    	let tennisChartolympic_gold_medals = [];

    	//Premier
    	let premierStats = [];

    	let premier_country_year = [];
    	let premier_appearences = [];
    	let premier_cleanSheets = [];
    	let premier_goals = [];

    	//Nba
    	let nbaStats = [];

    	let nba_country_year = [];
    	let nba_mostpoints = [];
    	let nba_fieldgoals = [];
    	let nba_efficiency = [];

    	async function gettennisData() {
    		console.log("Fetching stats....");
    		const res = await fetch("/api/v2/tennis");

    		if (res.ok) {
    			const data = await res.json();
    			tennisData = data;
    			console.log("Estadísticas recibidas: " + tennisData.length);

    			//inicializamos los arrays para mostrar los datos
    			tennisData.forEach(stat => {
    				//tennisChartCountryYear.push(stat.country+"-"+stat.year);
    				tennisChartCountryYear.push(stat.year);

    				tennisChartmost_grand_slam.push(parseFloat(stat.most_grand_slam));
    				tennisChartolympic_gold_medals.push(parseFloat(stat.olympic_gold_medals));
    				tennisChartmasters_finals.push(parseFloat(stat.masters_finals));
    			});

    			await delay(500);
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function getpremierStats() {
    		console.log("Fetching stats....");
    		const res = await fetch("/api/v2/premier-league");

    		if (res.ok) {
    			const data = await res.json();
    			premierStats = data;
    			console.log("Estadísticas recibidas: " + premierStats.length);

    			//inicializamos los arrays para mostrar los datos
    			premierStats.forEach(stat => {
    				premier_country_year.push(stat.country + "-" + stat.year);
    				premier_appearences.push(parseFloat(stat.appearences));
    				premier_cleanSheets.push(parseFloat(stat.cleanSheets));
    				premier_goals.push(parseFloat(stat.goals));
    			});

    			await delay(500);
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function getnbaStats() {
    		console.log("Fetching stats....");
    		const res = await fetch("/api/v2/nba-stats");

    		if (res.ok) {
    			const data = await res.json();
    			nbaStats = data;
    			console.log("Estadísticas recibidas: " + nbaStats.length);

    			//inicializamos los arrays para mostrar los datos
    			nbaStats.forEach(stat => {
    				nba_country_year.push(stat.country + "-" + stat.year);
    				nba_mostpoints.push(parseFloat(stat.mostpoints));
    				nba_fieldgoals.push(parseFloat(stat.fieldgoals));
    				nba_efficiency.push(parseFloat(stat.efficiency));
    			});

    			await delay(500);
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart('container', {
    			chart: { type: 'line' },
    			title: { text: 'Grafica conjunta grupo 23' },
    			yAxis: { title: { text: 'Valor' } },
    			xAxis: {
    				title: { text: "Year" },
    				categories: tennisChartCountryYear
    			},
    			/*
    xAxis: {
        title: {
            text: "Country-Year",
        },
        categories: premier_country_year,
    },
    */
    			legend: {
    				layout: 'vertical',
    				align: 'right',
    				verticalAlign: 'middle'
    			},
    			series: [
    				{
    					name: 'most_grandslams',
    					data: tennisChartmost_grand_slam
    				},
    				{
    					name: 'olympic_gold_medals',
    					data: tennisChartolympic_gold_medals
    				},
    				{
    					name: 'masters_finals',
    					data: tennisChartmasters_finals
    				},
    				//premier STATS
    				{
    					name: 'partidos jugados',
    					data: premier_appearences
    				},
    				{
    					name: 'portería vacía',
    					data: premier_cleanSheets
    				},
    				{ name: 'goles', data: premier_goals },
    				//nba-stats
    				{ name: 'mostpoints', data: nba_mostpoints },
    				{ name: 'fieldgoals', data: nba_fieldgoals },
    				{ name: 'efficiency', data: nba_efficiency }
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: 'horizontal',
    								align: 'center',
    								verticalAlign: 'bottom'
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(gettennisData);
    	onMount(getpremierStats);
    	onMount(getnbaStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$a.warn(`<GroupGraph> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Button,
    		delay,
    		tennisData,
    		tennisChartCountryYear,
    		tennisChartmost_grand_slam,
    		tennisChartmasters_finals,
    		tennisChartolympic_gold_medals,
    		premierStats,
    		premier_country_year,
    		premier_appearences,
    		premier_cleanSheets,
    		premier_goals,
    		nbaStats,
    		nba_country_year,
    		nba_mostpoints,
    		nba_fieldgoals,
    		nba_efficiency,
    		gettennisData,
    		getpremierStats,
    		getnbaStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('tennisData' in $$props) tennisData = $$props.tennisData;
    		if ('tennisChartCountryYear' in $$props) tennisChartCountryYear = $$props.tennisChartCountryYear;
    		if ('tennisChartmost_grand_slam' in $$props) tennisChartmost_grand_slam = $$props.tennisChartmost_grand_slam;
    		if ('tennisChartmasters_finals' in $$props) tennisChartmasters_finals = $$props.tennisChartmasters_finals;
    		if ('tennisChartolympic_gold_medals' in $$props) tennisChartolympic_gold_medals = $$props.tennisChartolympic_gold_medals;
    		if ('premierStats' in $$props) premierStats = $$props.premierStats;
    		if ('premier_country_year' in $$props) premier_country_year = $$props.premier_country_year;
    		if ('premier_appearences' in $$props) premier_appearences = $$props.premier_appearences;
    		if ('premier_cleanSheets' in $$props) premier_cleanSheets = $$props.premier_cleanSheets;
    		if ('premier_goals' in $$props) premier_goals = $$props.premier_goals;
    		if ('nbaStats' in $$props) nbaStats = $$props.nbaStats;
    		if ('nba_country_year' in $$props) nba_country_year = $$props.nba_country_year;
    		if ('nba_mostpoints' in $$props) nba_mostpoints = $$props.nba_mostpoints;
    		if ('nba_fieldgoals' in $$props) nba_fieldgoals = $$props.nba_fieldgoals;
    		if ('nba_efficiency' in $$props) nba_efficiency = $$props.nba_efficiency;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class GroupGraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GroupGraph",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\front\premier-league\premier.svelte generated by Svelte v3.47.0 */

    const { console: console_1$9 } = globals;
    const file$c = "src\\front\\premier-league\\premier.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>        import { onMount }
    function create_catch_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$4.name,
    		type: "catch",
    		source: "(1:0) <script>        import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (332:8) {:then entries}
    function create_then_block$4(ctx) {
    	let alert_1;
    	let t0;
    	let br0;
    	let t1;
    	let h4;
    	let strong;
    	let t3;
    	let br1;
    	let t4;
    	let table0;
    	let t5;
    	let br2;
    	let t6;
    	let table1;
    	let t7;
    	let button0;
    	let t8;
    	let button1;
    	let t9;
    	let button2;
    	let t10;
    	let br3;
    	let t11;
    	let div;
    	let button3;
    	let t12;
    	let button4;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[5],
    				isOpen: /*visible*/ ctx[3],
    				toggle: /*func*/ ctx[14],
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				responsive: true,
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*loadStats*/ ctx[8]);

    	button1 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*deleteALL*/ ctx[11]);

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*click_handler_2*/ ctx[24]);

    	button3 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*getPreviewPage*/ ctx[13]);

    	button4 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button4.$on("click", /*getNextPage*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			br0 = element("br");
    			t1 = space();
    			h4 = element("h4");
    			strong = element("strong");
    			strong.textContent = "Búsqueda general de parámetros";
    			t3 = space();
    			br1 = element("br");
    			t4 = space();
    			create_component(table0.$$.fragment);
    			t5 = space();
    			br2 = element("br");
    			t6 = space();
    			create_component(table1.$$.fragment);
    			t7 = space();
    			create_component(button0.$$.fragment);
    			t8 = space();
    			create_component(button1.$$.fragment);
    			t9 = space();
    			create_component(button2.$$.fragment);
    			t10 = space();
    			br3 = element("br");
    			t11 = space();
    			div = element("div");
    			create_component(button3.$$.fragment);
    			t12 = space();
    			create_component(button4.$$.fragment);
    			add_location(br0, file$c, 339, 8, 10798);
    			add_location(strong, file$c, 340, 38, 10842);
    			set_style(h4, "text-align", "center");
    			add_location(h4, file$c, 340, 8, 10812);
    			add_location(br1, file$c, 341, 8, 10904);
    			add_location(br2, file$c, 421, 8, 14260);
    			add_location(br3, file$c, 472, 2, 16434);
    			set_style(div, "text-align", "center");
    			add_location(div, file$c, 473, 2, 16442);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, strong);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(button2, target, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(button3, div, null);
    			append_dev(div, t12);
    			mount_component(button4, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_1_changes = {};
    			if (dirty[0] & /*color*/ 32) alert_1_changes.color = /*color*/ ctx[5];
    			if (dirty[0] & /*visible*/ 8) alert_1_changes.isOpen = /*visible*/ ctx[3];
    			if (dirty[0] & /*visible*/ 8) alert_1_changes.toggle = /*func*/ ctx[14];

    			if (dirty[0] & /*checkMSG*/ 16 | dirty[1] & /*$$scope*/ 4096) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*from, to, checkMSG*/ 19 | dirty[1] & /*$$scope*/ 4096) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*entries, newEntry*/ 68 | dirty[1] & /*$$scope*/ 4096) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t4);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t6);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(button2, detaching);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div);
    			destroy_component(button3);
    			destroy_component(button4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$4.name,
    		type: "then",
    		source: "(332:8) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (335:12) {#if checkMSG}
    function create_if_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkMSG*/ 16) set_data_dev(t, /*checkMSG*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(335:12) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (334:8) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_12(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[4] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(334:8) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (395:39) <Button outline color="dark" on:click="{()=>{                          if (from == null || to == null) {                              window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')                          }else{                              checkMSG = "Datos cargados correctamente en ese periodo";                              getEntries();                          }                      }}">
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(395:39) <Button outline color=\\\"dark\\\" on:click=\\\"{()=>{                          if (from == null || to == null) {                              window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')                          }else{                              checkMSG = \\\"Datos cargados correctamente en ese periodo\\\";                              getEntries();                          }                      }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (406:39) <Button outline color="info" on:click="{()=>{                          from = null;                          to = null;                          getEntries();                          checkMSG = "Busqueda limpiada";                                                }}">
    function create_default_slot_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar Búsqueda");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(406:39) <Button outline color=\\\"info\\\" on:click=\\\"{()=>{                          from = null;                          to = null;                          getEntries();                          checkMSG = \\\"Busqueda limpiada\\\";                                                }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (382:8) <Table bordered>
    function create_default_slot_9$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t4;
    	let th3;
    	let t5;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t6;
    	let td1;
    	let input1;
    	let t7;
    	let td2;
    	let button0;
    	let t8;
    	let td3;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "dark",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[17]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[18]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Fecha inicio";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Fecha fin";
    			t3 = space();
    			th2 = element("th");
    			t4 = space();
    			th3 = element("th");
    			t5 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t6 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t7 = space();
    			td2 = element("td");
    			create_component(button0.$$.fragment);
    			t8 = space();
    			td3 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$c, 384, 20, 12788);
    			add_location(th1, file$c, 385, 20, 12831);
    			add_location(th2, file$c, 386, 20, 12871);
    			add_location(th3, file$c, 387, 20, 12902);
    			attr_dev(tr0, "class", "svelte-1en0vgr");
    			add_location(tr0, file$c, 383, 16, 12762);
    			attr_dev(thead, "class", "svelte-1en0vgr");
    			add_location(thead, file$c, 382, 12, 12737);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "2000");
    			attr_dev(input0, "class", "svelte-1en0vgr");
    			add_location(input0, file$c, 392, 24, 13025);
    			add_location(td0, file$c, 392, 20, 13021);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "2000");
    			attr_dev(input1, "class", "svelte-1en0vgr");
    			add_location(input1, file$c, 393, 24, 13108);
    			add_location(td1, file$c, 393, 20, 13104);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$c, 394, 20, 13185);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$c, 405, 20, 13743);
    			attr_dev(tr1, "class", "svelte-1en0vgr");
    			add_location(tr1, file$c, 391, 16, 12995);
    			add_location(tbody, file$c, 390, 12, 12970);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t4);
    			append_dev(tr0, th3);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*from*/ ctx[0]);
    			append_dev(tr1, t6);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*to*/ ctx[1]);
    			append_dev(tr1, t7);
    			append_dev(tr1, td2);
    			mount_component(button0, td2, null);
    			append_dev(tr1, t8);
    			append_dev(tr1, td3);
    			mount_component(button1, td3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*from*/ 1 && to_number(input0.value) !== /*from*/ ctx[0]) {
    				set_input_value(input0, /*from*/ ctx[0]);
    			}

    			if (dirty[0] & /*to*/ 2 && to_number(input1.value) !== /*to*/ ctx[1]) {
    				set_input_value(input1, /*to*/ ctx[1]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(382:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (443:60) <Button outline color="primary" on:click={insertEntry}>
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(443:60) <Button outline color=\\\"primary\\\" on:click={insertEntry}>",
    		ctx
    	});

    	return block;
    }

    // (454:20) <Button outline color="danger" on:click="{deleteStat(entry.country, entry.year)}">
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(454:20) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteStat(entry.country, entry.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (455:76) <Button outline color="primary">
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(455:76) <Button outline color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (446:8) {#each entries as entry}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let a0;
    	let t0_value = /*entry*/ ctx[40].country + "";
    	let t0;
    	let a0_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[40].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[40].appearences + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[40].cleanSheets + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[40].goals + "";
    	let t8;
    	let t9;
    	let td5;
    	let button0;
    	let t10;
    	let td6;
    	let a1;
    	let button1;
    	let a1_href_value;
    	let t11;
    	let current;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*deleteStat*/ ctx[10](/*entry*/ ctx[40].country, /*entry*/ ctx[40].year))) /*deleteStat*/ ctx[10](/*entry*/ ctx[40].country, /*entry*/ ctx[40].year).apply(this, arguments);
    	});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a0 = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t11 = space();
    			attr_dev(a0, "href", a0_href_value = "api/v2/premier-league/" + /*entry*/ ctx[40].country + "/" + /*entry*/ ctx[40].year);
    			add_location(a0, file$c, 448, 20, 15430);
    			add_location(td0, file$c, 448, 16, 15426);
    			add_location(td1, file$c, 449, 16, 15533);
    			add_location(td2, file$c, 450, 16, 15572);
    			add_location(td3, file$c, 451, 16, 15618);
    			add_location(td4, file$c, 452, 16, 15664);
    			add_location(td5, file$c, 453, 16, 15704);
    			attr_dev(a1, "href", a1_href_value = "#/premier-league/" + /*entry*/ ctx[40].country + "/" + /*entry*/ ctx[40].year);
    			add_location(a1, file$c, 454, 20, 15832);
    			add_location(td6, file$c, 454, 16, 15828);
    			attr_dev(tr, "class", "svelte-1en0vgr");
    			add_location(tr, file$c, 446, 12, 15386);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a0);
    			append_dev(a0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button0, td5, null);
    			append_dev(tr, t10);
    			append_dev(tr, td6);
    			append_dev(td6, a1);
    			mount_component(button1, a1, null);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*entries*/ 64) && t0_value !== (t0_value = /*entry*/ ctx[40].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*entries*/ 64 && a0_href_value !== (a0_href_value = "api/v2/premier-league/" + /*entry*/ ctx[40].country + "/" + /*entry*/ ctx[40].year)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if ((!current || dirty[0] & /*entries*/ 64) && t2_value !== (t2_value = /*entry*/ ctx[40].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*entries*/ 64) && t4_value !== (t4_value = /*entry*/ ctx[40].appearences + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*entries*/ 64) && t6_value !== (t6_value = /*entry*/ ctx[40].cleanSheets + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*entries*/ 64) && t8_value !== (t8_value = /*entry*/ ctx[40].goals + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (!current || dirty[0] & /*entries*/ 64 && a1_href_value !== (a1_href_value = "#/premier-league/" + /*entry*/ ctx[40].country + "/" + /*entry*/ ctx[40].year)) {
    				attr_dev(a1, "href", a1_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(446:8) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (424:8) <Table bordered responsive>
    function create_default_slot_5$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t12;
    	let td1;
    	let input1;
    	let t13;
    	let td2;
    	let input2;
    	let t14;
    	let td3;
    	let input3;
    	let t15;
    	let td4;
    	let input4;
    	let t16;
    	let td5;
    	let button;
    	let t17;
    	let t18;
    	let br;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertEntry*/ ctx[9]);
    	let each_value = /*entries*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Pais";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Apariciones";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Portería vacía";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Goles";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t18 = space();
    			br = element("br");
    			add_location(th0, file$c, 426, 20, 14369);
    			add_location(th1, file$c, 427, 20, 14404);
    			add_location(th2, file$c, 428, 20, 14438);
    			add_location(th3, file$c, 429, 20, 14480);
    			add_location(th4, file$c, 430, 20, 14525);
    			attr_dev(th5, "colspan", "2");
    			add_location(th5, file$c, 431, 20, 14561);
    			attr_dev(tr0, "class", "svelte-1en0vgr");
    			add_location(tr0, file$c, 425, 16, 14343);
    			attr_dev(thead, "class", "svelte-1en0vgr");
    			add_location(thead, file$c, 424, 12, 14318);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Spain");
    			attr_dev(input0, "class", "svelte-1en0vgr");
    			add_location(input0, file$c, 436, 20, 14688);
    			add_location(td0, file$c, 436, 16, 14684);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "2017");
    			attr_dev(input1, "class", "svelte-1en0vgr");
    			add_location(input1, file$c, 437, 20, 14790);
    			add_location(td1, file$c, 437, 16, 14786);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "13");
    			attr_dev(input2, "class", "svelte-1en0vgr");
    			add_location(input2, file$c, 438, 20, 14887);
    			add_location(td2, file$c, 438, 16, 14883);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "18");
    			attr_dev(input3, "class", "svelte-1en0vgr");
    			add_location(input3, file$c, 439, 20, 14994);
    			add_location(td3, file$c, 439, 16, 14990);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "20");
    			attr_dev(input4, "class", "svelte-1en0vgr");
    			add_location(input4, file$c, 440, 20, 15099);
    			add_location(td4, file$c, 440, 16, 15095);
    			attr_dev(td5, "colspan", "2");
    			set_style(td5, "text-align", "center");
    			add_location(td5, file$c, 442, 16, 15194);
    			attr_dev(tr1, "class", "svelte-1en0vgr");
    			add_location(tr1, file$c, 435, 12, 14662);
    			add_location(tbody, file$c, 434, 8, 14641);
    			add_location(br, file$c, 459, 8, 16026);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newEntry*/ ctx[2].country);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newEntry*/ ctx[2].year);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newEntry*/ ctx[2].appearences);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newEntry*/ ctx[2].cleanSheets);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newEntry*/ ctx[2].goals);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t18, anchor);
    			insert_dev(target, br, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[19]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[20]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[22]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[23])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newEntry*/ 4 && input0.value !== /*newEntry*/ ctx[2].country) {
    				set_input_value(input0, /*newEntry*/ ctx[2].country);
    			}

    			if (dirty[0] & /*newEntry*/ 4 && input1.value !== /*newEntry*/ ctx[2].year) {
    				set_input_value(input1, /*newEntry*/ ctx[2].year);
    			}

    			if (dirty[0] & /*newEntry*/ 4 && to_number(input2.value) !== /*newEntry*/ ctx[2].appearences) {
    				set_input_value(input2, /*newEntry*/ ctx[2].appearences);
    			}

    			if (dirty[0] & /*newEntry*/ 4 && to_number(input3.value) !== /*newEntry*/ ctx[2].cleanSheets) {
    				set_input_value(input3, /*newEntry*/ ctx[2].cleanSheets);
    			}

    			if (dirty[0] & /*newEntry*/ 4 && to_number(input4.value) !== /*newEntry*/ ctx[2].goals) {
    				set_input_value(input4, /*newEntry*/ ctx[2].goals);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty[0] & /*entries, deleteStat*/ 1088) {
    				each_value = /*entries*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(br);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(424:8) <Table bordered responsive>",
    		ctx
    	});

    	return block;
    }

    // (462:8) <Button color="success" on:click="{loadStats}">
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos inciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(462:8) <Button color=\\\"success\\\" on:click=\\\"{loadStats}\\\">",
    		ctx
    	});

    	return block;
    }

    // (465:8) <Button color="danger" on:click="{deleteALL}">
    function create_default_slot_3$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eliminar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(465:8) <Button color=\\\"danger\\\" on:click=\\\"{deleteALL}\\\">",
    		ctx
    	});

    	return block;
    }

    // (468:8) <Button color="info" on:click={function (){              window.location.href = `/#/premier-league/charts`          }}>
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(468:8) <Button color=\\\"info\\\" on:click={function (){              window.location.href = `/#/premier-league/charts`          }}>",
    		ctx
    	});

    	return block;
    }

    // (475:3) <Button outline color="primary" on:click="{getPreviewPage}">
    function create_default_slot_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Anterior");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(475:3) <Button outline color=\\\"primary\\\" on:click=\\\"{getPreviewPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (478:3) <Button outline color="primary" on:click="{getNextPage}">
    function create_default_slot$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Páguina Siguiente");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(478:3) <Button outline color=\\\"primary\\\" on:click=\\\"{getNextPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (330:24)               Loading entry stats data...          {:then entries}
    function create_pending_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading entry stats data...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$4.name,
    		type: "pending",
    		source: "(330:24)               Loading entry stats data...          {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$4,
    		then: create_then_block$4,
    		catch: create_catch_block$4,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[6], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Tabla de datos de estadísticas de los jugadores de la Premier League";
    			t1 = space();
    			info.block.c();
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$c, 327, 4, 10402);
    			add_location(main, file$c, 325, 0, 10388);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*entries*/ 64 && promise !== (promise = /*entries*/ ctx[6]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Premier', slots, []);
    	let redStyle = "redTable";
    	let blueStyle = "blueTable";
    	var BASE_API_PATH = "api/v2/premier-league";
    	let entries = [];
    	let from = null;
    	let to = null;

    	let newEntry = {
    		country: "",
    		year: "",
    		appearences: "",
    		cleanSheets: "",
    		goals: ""
    	};

    	let visible = false;
    	let checkMSG = "";
    	let color = "danger";
    	let page = 1;
    	let totaldata = 20;
    	let offset = 0;
    	let limit = 10;
    	let maxPages = 0;
    	let numEntries;
    	let sCountry = "";
    	let sYear = "";
    	let sAppearences = "";
    	let sCleanSheets = "";
    	let sGoals = "";
    	onMount(getEntries);

    	//GET
    	/*async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/premier-league"); 
        if(res.ok){
    			console.log("Ok:");
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }
    		else{
    			checkMSG = res.status + ": Recursos no encontrados";
    			console.log("ERROR! no encontrado");
    		}
    }*/
    	//GET
    	async function getEntries() {
    		console.log("Fetching entries....");
    		let cadena = `/api/v2/premier-league?limit=${limit}&&offset=${offset * 10}&&`;

    		if (from != null) {
    			cadena = cadena + `from=${from}&&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset * 10}`);
    			maxPagesFunction(cadenaPag[0] + cadenaPag[1]);
    			const data = await res.json();
    			$$invalidate(6, entries = data);
    			numEntries = entries.length;
    			console.log("Received entries: " + entries.length);
    		} else {
    			Errores(res.status);
    		}
    	}

    	//GET INITIAL DATA
    	async function loadStats() {
    		console.log("Fetching entry data...");
    		await fetch(BASE_API_PATH + "/loadInitialData");
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(6, entries = json);
    			$$invalidate(3, visible = true);
    			totaldata = 20;
    			console.log("Received " + entries.length + " entry data.");
    			$$invalidate(5, color = "success");
    			$$invalidate(4, checkMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(5, color = "danger");
    			$$invalidate(4, checkMSG = res.status + ": " + "No se pudo cargar los datos");
    			console.log("ERROR! ");
    		}
    	}

    	//INSERT DATA
    	async function insertEntry() {
    		console.log("Inserting entry....");

    		if (newEntry.country == "" || newEntry.year == null || newEntry.appearences == null || newEntry.cleanSheets == null || newEntry.goals == null) {
    			alert("Los campos no pueden estar vacios");
    		} else {
    			await fetch("/api/v2/premier-league/", {
    				method: "POST",
    				body: JSON.stringify({
    					country: newEntry.country,
    					year: parseInt(newEntry.year),
    					appearences: parseInt(newEntry.appearences),
    					cleanSheets: parseInt(newEntry.cleanSheets),
    					goals: parseInt(newEntry.goals)
    				}),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(3, visible = true);

    				if (res.status == 201) {
    					getEntries();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(5, color = "success");
    					$$invalidate(4, checkMSG = "Entrada introducida correctamente");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(5, color = "success");
    					$$invalidate(4, checkMSG = "Entrada introducida incorrectamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that country and year in the da tabase"); //window.alert("Entrada introducida incorrectamente");
    					$$invalidate(5, color = "success");
    					$$invalidate(4, checkMSG = "Entrada introducida incorrectamente");
    				} //window.alert("Ya existe dicha entrada");
    			});
    		}
    	}

    	//DELETE STAT
    	async function deleteStat(countryD, yearD) {
    		await fetch(BASE_API_PATH + "/" + countryD + "/" + yearD, { method: "DELETE" }).then(function (res) {
    			$$invalidate(3, visible = true);
    			getEntries();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(5, color = "success");
    				$$invalidate(4, checkMSG = "Recurso " + countryD + " " + yearD + " borrado correctamente");
    				console.log("Deleted " + countryD);
    			} else if (res.status == 404) {
    				$$invalidate(5, color = "danger");
    				$$invalidate(4, checkMSG = "No se ha encontrado el objeto " + countryD);
    				console.log("Resource NOT FOUND");
    			} else {
    				$$invalidate(5, color = "danger");
    				$$invalidate(4, checkMSG = res.status + ": " + "No se pudo borrar el recurso");
    				console.log("ERROR!");
    			}
    		});
    	}

    	//DELETE ALL
    	async function deleteALL() {
    		console.log("Deleting entry data...");

    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			console.log("Deleting all entry data...");

    			await fetch(BASE_API_PATH, { method: "DELETE" }).then(function (res) {
    				$$invalidate(3, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getEntries();
    					$$invalidate(5, color = "success");
    					$$invalidate(4, checkMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(5, color = "danger");
    					$$invalidate(4, checkMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(5, color = "danger");
    					$$invalidate(4, checkMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//SEARCH
    	/*async function search (sCountry, sYear, sAppearences, sCleanSheets, sGoals){
                
                if(sCountry==null){
                    sCountry="";
                }
                if(sYear==null){
                    sYear="";
                }
                if(sAppearences==null){
                    sAppearences="";
                }
                if(sCleanSheets==null){
                    sCleanSheets="";
                }
                if(sGoals==null){
                    sGoals="";
                }
                visible = true;
                const res = await fetch(BASE_API_PATH + "?country="+sCountry
                +"&year="+sYear
                +"&appearences="+sAppearences
                +"&cleanSheets="+sCleanSheets
                +"&goals="+sGoals
                )
                if (res.ok){
                    const json = await res.json();
                    entries = json;
                    console.log("Found "+ entries.length + " data");
                    if(entries.length==1){
                        color = "success"
                        checkMSG = "Se ha encontrado un dato para tu búsqueda";
                    }else{
                        color = "success"
                        checkMSG = "Se han encontrado " + entries.length + " datos para tu búsqueda";
                    }
                }
        }*/
    	/*-------------------------PAGINACIÓN-------------------------*/
    	//getNextPage (B)
    	async function getNextPage() {
    		console.log(totaldata);

    		if (page + 10 > totaldata) {
    			page = 1;
    		} else {
    			page += 10;
    		}

    		$$invalidate(3, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=" + (-1 + page));

    		//condicional imprime msg
    		$$invalidate(5, color = "success");

    		$$invalidate(4, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 9));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(5, color = "danger");
    			$$invalidate(4, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(6, entries = json);
    			console.log("Received " + entries.length + " resources.");
    		} else {
    			$$invalidate(4, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//getPreviewPage (B)
    	async function getPreviewPage() {
    		console.log(totaldata);

    		if (page - 10 > 1) {
    			page -= 10;
    		} else page = 1;

    		$$invalidate(3, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=" + (-1 + page));
    		$$invalidate(5, color = "success");

    		$$invalidate(4, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 9));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(5, color = "danger");
    			$$invalidate(4, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(6, entries = json);
    			console.log("Received " + entries.length + " resources.");
    		} else {
    			$$invalidate(4, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//Función auxiliar para obtener el número máximo de páginas que se pueden ver
    	async function maxPagesFunction(cadena) {
    		const res = await fetch(cadena, { method: "GET" });

    		if (res.ok) {
    			const data = await res.json();
    			maxPages = Math.floor(data.length / 10);

    			if (maxPages === data.length / 10) {
    				maxPages = maxPages - 1;
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<Premier> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(3, visible = false);

    	function input0_input_handler() {
    		from = to_number(this.value);
    		$$invalidate(0, from);
    	}

    	function input1_input_handler() {
    		to = to_number(this.value);
    		$$invalidate(1, to);
    	}

    	const click_handler = () => {
    		if (from == null || to == null) {
    			window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos');
    		} else {
    			$$invalidate(4, checkMSG = "Datos cargados correctamente en ese periodo");
    			getEntries();
    		}
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, from = null);
    		$$invalidate(1, to = null);
    		getEntries();
    		$$invalidate(4, checkMSG = "Busqueda limpiada");
    	};

    	function input0_input_handler_1() {
    		newEntry.country = this.value;
    		$$invalidate(2, newEntry);
    	}

    	function input1_input_handler_1() {
    		newEntry.year = this.value;
    		$$invalidate(2, newEntry);
    	}

    	function input2_input_handler() {
    		newEntry.appearences = to_number(this.value);
    		$$invalidate(2, newEntry);
    	}

    	function input3_input_handler() {
    		newEntry.cleanSheets = to_number(this.value);
    		$$invalidate(2, newEntry);
    	}

    	function input4_input_handler() {
    		newEntry.goals = to_number(this.value);
    		$$invalidate(2, newEntry);
    	}

    	const click_handler_2 = function () {
    		window.location.href = `/#/premier-league/charts`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		redStyle,
    		blueStyle,
    		BASE_API_PATH,
    		entries,
    		from,
    		to,
    		newEntry,
    		visible,
    		checkMSG,
    		color,
    		page,
    		totaldata,
    		offset,
    		limit,
    		maxPages,
    		numEntries,
    		sCountry,
    		sYear,
    		sAppearences,
    		sCleanSheets,
    		sGoals,
    		getEntries,
    		loadStats,
    		insertEntry,
    		deleteStat,
    		deleteALL,
    		getNextPage,
    		getPreviewPage,
    		maxPagesFunction
    	});

    	$$self.$inject_state = $$props => {
    		if ('redStyle' in $$props) redStyle = $$props.redStyle;
    		if ('blueStyle' in $$props) blueStyle = $$props.blueStyle;
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('entries' in $$props) $$invalidate(6, entries = $$props.entries);
    		if ('from' in $$props) $$invalidate(0, from = $$props.from);
    		if ('to' in $$props) $$invalidate(1, to = $$props.to);
    		if ('newEntry' in $$props) $$invalidate(2, newEntry = $$props.newEntry);
    		if ('visible' in $$props) $$invalidate(3, visible = $$props.visible);
    		if ('checkMSG' in $$props) $$invalidate(4, checkMSG = $$props.checkMSG);
    		if ('color' in $$props) $$invalidate(5, color = $$props.color);
    		if ('page' in $$props) page = $$props.page;
    		if ('totaldata' in $$props) totaldata = $$props.totaldata;
    		if ('offset' in $$props) offset = $$props.offset;
    		if ('limit' in $$props) limit = $$props.limit;
    		if ('maxPages' in $$props) maxPages = $$props.maxPages;
    		if ('numEntries' in $$props) numEntries = $$props.numEntries;
    		if ('sCountry' in $$props) sCountry = $$props.sCountry;
    		if ('sYear' in $$props) sYear = $$props.sYear;
    		if ('sAppearences' in $$props) sAppearences = $$props.sAppearences;
    		if ('sCleanSheets' in $$props) sCleanSheets = $$props.sCleanSheets;
    		if ('sGoals' in $$props) sGoals = $$props.sGoals;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		from,
    		to,
    		newEntry,
    		visible,
    		checkMSG,
    		color,
    		entries,
    		getEntries,
    		loadStats,
    		insertEntry,
    		deleteStat,
    		deleteALL,
    		getNextPage,
    		getPreviewPage,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler_2
    	];
    }

    class Premier extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Premier",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\front\premier-league\premierEdit.svelte generated by Svelte v3.47.0 */

    const { console: console_1$8 } = globals;
    const file$b = "src\\front\\premier-league\\premierEdit.svelte";

    // (80:8) {#if errorMsg}
    function create_if_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*errorMsg*/ ctx[6]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 64) set_data_dev(t, /*errorMsg*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(80:8) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (79:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[6] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*errorMsg*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(79:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (104:20) <Button outline color="primary" on:click={EditEntry}>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(104:20) <Button outline color=\\\"primary\\\" on:click={EditEntry}>",
    		ctx
    	});

    	return block;
    }

    // (86:4) <Table bordered>
    function create_default_slot_1$4(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12_value = /*params*/ ctx[0].country + "";
    	let t12;
    	let t13;
    	let td1;
    	let t14_value = /*params*/ ctx[0].year + "";
    	let t14;
    	let t15;
    	let td2;
    	let input0;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*EditEntry*/ ctx[7]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Apariciones";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Portería Vacía";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "goles";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$b, 88, 16, 2784);
    			add_location(th1, file$b, 89, 16, 2815);
    			add_location(th2, file$b, 90, 16, 2845);
    			add_location(th3, file$b, 91, 16, 2883);
    			add_location(th4, file$b, 92, 16, 2924);
    			add_location(th5, file$b, 93, 16, 2956);
    			add_location(tr0, file$b, 87, 12, 2762);
    			add_location(thead, file$b, 86, 8, 2741);
    			add_location(td0, file$b, 98, 16, 3063);
    			add_location(td1, file$b, 99, 16, 3106);
    			add_location(input0, file$b, 100, 20, 3150);
    			add_location(td2, file$b, 100, 16, 3146);
    			add_location(input1, file$b, 101, 20, 3218);
    			add_location(td3, file$b, 101, 16, 3214);
    			add_location(input2, file$b, 102, 20, 3286);
    			add_location(td4, file$b, 102, 16, 3282);
    			add_location(td5, file$b, 103, 16, 3344);
    			add_location(tr1, file$b, 97, 12, 3041);
    			add_location(tbody, file$b, 96, 8, 3020);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updatedappearences*/ ctx[3]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedcleanSheets*/ ctx[4]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatedgoals*/ ctx[5]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*params*/ 1) && t12_value !== (t12_value = /*params*/ ctx[0].country + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*params*/ 1) && t14_value !== (t14_value = /*params*/ ctx[0].year + "")) set_data_dev(t14, t14_value);

    			if (dirty & /*updatedappearences*/ 8 && input0.value !== /*updatedappearences*/ ctx[3]) {
    				set_input_value(input0, /*updatedappearences*/ ctx[3]);
    			}

    			if (dirty & /*updatedcleanSheets*/ 16 && input1.value !== /*updatedcleanSheets*/ ctx[4]) {
    				set_input_value(input1, /*updatedcleanSheets*/ ctx[4]);
    			}

    			if (dirty & /*updatedgoals*/ 32 && input2.value !== /*updatedgoals*/ ctx[5]) {
    				set_input_value(input2, /*updatedgoals*/ ctx[5]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(86:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (109:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atrás");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(109:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let alert;
    	let t0;
    	let h1;
    	let t1;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let t4_value = /*params*/ ctx[0].year + "";
    	let t4;
    	let t5;
    	let t6;
    	let table;
    	let t7;
    	let button;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[2],
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[8],
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text("Recurso '");
    			t2 = text(t2_value);
    			t3 = text(" , ");
    			t4 = text(t4_value);
    			t5 = text(" ' listo para editar");
    			t6 = space();
    			create_component(table.$$.fragment);
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$b, 84, 4, 2639);
    			add_location(main, file$b, 76, 0, 2478);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			append_dev(h1, t5);
    			append_dev(main, t6);
    			mount_component(table, main, null);
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const alert_changes = {};
    			if (dirty & /*color*/ 4) alert_changes.color = /*color*/ ctx[2];
    			if (dirty & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty & /*visible*/ 2) alert_changes.toggle = /*func*/ ctx[8];

    			if (dirty & /*$$scope, errorMsg*/ 262208) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].year + "")) set_data_dev(t4, t4_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedgoals, updatedcleanSheets, updatedappearences, params*/ 262201) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert);
    			destroy_component(table);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PremierEdit', slots, []);
    	let { params = {} } = $$props;
    	var BASE_API_PATH = "/api/v2/premier-league";
    	let visible = false;
    	let color = "danger";
    	let entry = {};
    	let colorMsg = "danger";
    	let updatedCountry = {};
    	let updatedYear = "";
    	let updatedappearences = "";
    	let updatedcleanSheets = "";
    	let updatedgoals = "";
    	let errorMsg = "";
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch(BASE_API_PATH + "/" + params.country + "/" + params.year);

    		if (res.ok) {
    			await res.json();
    			$$invalidate(3, updatedappearences = entry.appearences);
    			$$invalidate(4, updatedcleanSheets = entry.cleanSheets);
    			$$invalidate(5, updatedgoals = entry.goals);
    			console.log("Recived data");
    		} else {
    			$$invalidate(1, visible = true);
    			$$invalidate(2, color = "danger");
    			colorMsg = "Error " + res.status + " : " + " Ningun recurso con los parametros " + params.country + " " + params.year;
    			console.log("ERROR" + errorMsg);
    		}
    	}

    	async function EditEntry() {
    		console.log("Updating entry...." + updatedCountry);

    		await fetch("api/v2/premier-league/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: params.country,
    				year: parseInt(params.year),
    				appearences: updatedappearences,
    				cleanSheets: updatedcleanSheets,
    				goals: updatedgoals
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			$$invalidate(1, visible = true);

    			if (res.status == 200) {
    				getEntries();
    				console.log("Data introduced");
    				$$invalidate(2, color = "success");
    				$$invalidate(6, errorMsg = "Recurso actualizado correctamente");
    			} else {
    				console.log("Data not edited");
    				$$invalidate(6, errorMsg = "Rellene todos los campos");
    			}
    		});
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<PremierEdit> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input0_input_handler() {
    		updatedappearences = this.value;
    		$$invalidate(3, updatedappearences);
    	}

    	function input1_input_handler() {
    		updatedcleanSheets = this.value;
    		$$invalidate(4, updatedcleanSheets);
    	}

    	function input2_input_handler() {
    		updatedgoals = this.value;
    		$$invalidate(5, updatedgoals);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		pop,
    		onMount,
    		Button,
    		Table,
    		getTransitionDuration,
    		Alert,
    		params,
    		BASE_API_PATH,
    		visible,
    		color,
    		entry,
    		colorMsg,
    		updatedCountry,
    		updatedYear,
    		updatedappearences,
    		updatedcleanSheets,
    		updatedgoals,
    		errorMsg,
    		getEntries,
    		EditEntry
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('visible' in $$props) $$invalidate(1, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('entry' in $$props) entry = $$props.entry;
    		if ('colorMsg' in $$props) colorMsg = $$props.colorMsg;
    		if ('updatedCountry' in $$props) updatedCountry = $$props.updatedCountry;
    		if ('updatedYear' in $$props) updatedYear = $$props.updatedYear;
    		if ('updatedappearences' in $$props) $$invalidate(3, updatedappearences = $$props.updatedappearences);
    		if ('updatedcleanSheets' in $$props) $$invalidate(4, updatedcleanSheets = $$props.updatedcleanSheets);
    		if ('updatedgoals' in $$props) $$invalidate(5, updatedgoals = $$props.updatedgoals);
    		if ('errorMsg' in $$props) $$invalidate(6, errorMsg = $$props.errorMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		visible,
    		color,
    		updatedappearences,
    		updatedcleanSheets,
    		updatedgoals,
    		errorMsg,
    		EditEntry,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class PremierEdit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PremierEdit",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get params() {
    		throw new Error("<PremierEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<PremierEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\premier-league\premierCharts.svelte generated by Svelte v3.47.0 */

    const { console: console_1$7 } = globals;
    const file$a = "src\\front\\premier-league\\premierCharts.svelte";

    function create_fragment$a(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let h2;
    	let t2;
    	let h4;
    	let t4;
    	let div;
    	let t5;
    	let a;

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Gráfica de datos sobre la Premier-League";
    			t2 = space();
    			h4 = element("h4");
    			h4.textContent = "Biblioteca: Plotly";
    			t4 = space();
    			div = element("div");
    			t5 = space();
    			a = element("a");
    			a.textContent = "Volver";
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.plot.ly/plotly-2.11.1.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$a, 60, 4, 1789);
    			attr_dev(h2, "class", "svelte-poqm9v");
    			add_location(h2, file$a, 64, 4, 1885);
    			attr_dev(h4, "class", "svelte-poqm9v");
    			add_location(h4, file$a, 65, 4, 1940);
    			attr_dev(div, "id", "myDiv");
    			add_location(div, file$a, 66, 4, 1973);
    			attr_dev(a, "href", "/#/premier-league");
    			attr_dev(a, "class", "btn btn-primary btn-lg active");
    			attr_dev(a, "role", "button");
    			attr_dev(a, "aria-pressed", "true");
    			add_location(a, file$a, 67, 4, 2052);
    			add_location(main, file$a, 63, 0, 1873);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t2);
    			append_dev(main, h4);
    			append_dev(main, t4);
    			append_dev(main, div);
    			append_dev(main, t5);
    			append_dev(main, a);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PremierCharts', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let data = [];
    	let stats_country_date = [];
    	let appearences = [];
    	let cleanSheets = [];
    	let goals = [];

    	async function getPEStats() {
    		console.log("Fetching stats....");
    		const res = await fetch("/api/v2/premier-league");

    		if (res.ok) {
    			const data = await res.json();
    			console.log("Estadísticas recibidas: " + data.length);

    			//inicializamos los arrays para mostrar los datos
    			data.forEach(stat => {
    				stats_country_date.push(stat.country + "-" + stat.year);
    				appearences.push(stat["appearences"]);
    				cleanSheets.push(stat["cleanSheets"]);
    				goals.push(stat["goals"]);
    			});

    			//esperamos a que se carguen 
    			await delay(500);

    			loadGraph();
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		var trace_appearences = {
    			x: stats_country_date,
    			y: appearences,
    			type: 'bar',
    			name: 'Apariciones'
    		};

    		var trace_cleanSheets = {
    			x: stats_country_date,
    			y: cleanSheets,
    			type: 'bar',
    			name: 'Portería vacía'
    		};

    		var trace_goals = {
    			x: stats_country_date,
    			y: goals,
    			type: 'bar',
    			name: 'Goles'
    		};

    		var dataPlot = [trace_appearences, trace_cleanSheets, trace_goals];
    		Plotly.newPlot('myDiv', dataPlot);
    	}

    	onMount(getPEStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<PremierCharts> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		data,
    		stats_country_date,
    		appearences,
    		cleanSheets,
    		goals,
    		getPEStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) data = $$props.data;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('appearences' in $$props) appearences = $$props.appearences;
    		if ('cleanSheets' in $$props) cleanSheets = $$props.cleanSheets;
    		if ('goals' in $$props) goals = $$props.goals;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class PremierCharts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PremierCharts",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\front\premier-league\apiext1list.svelte generated by Svelte v3.47.0 */

    const { console: console_1$6 } = globals;
    const file$9 = "src\\front\\premier-league\\apiext1list.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (34:8) <Button              color="success"              on:click={function () {                  window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apiext1chart`;              }}          >
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(34:8) <Button              color=\\\"success\\\"              on:click={function () {                  window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apiext1chart`;              }}          >",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (45:4) {:then entries}
    function create_then_block$3(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 65) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(45:4) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (58:16) {#each entries as entry}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[3].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[3].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[3].veh_comm + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[3].veh_pass + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[3].veh_annprod + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			add_location(td0, file$9, 59, 24, 1841);
    			add_location(td1, file$9, 60, 24, 1891);
    			add_location(td2, file$9, 61, 24, 1938);
    			add_location(td3, file$9, 62, 24, 1989);
    			add_location(td4, file$9, 63, 24, 2040);
    			add_location(tr, file$9, 58, 20, 1811);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[3].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[3].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*entries*/ 1 && t4_value !== (t4_value = /*entry*/ ctx[3].veh_comm + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[3].veh_pass + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[3].veh_annprod + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(58:16) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (46:8) <Table bordered>
    function create_default_slot$4(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let t10;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Country";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Year";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Vehículos comerciales";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Vehículos pasajeros";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Producción anual de vehículos";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$9, 48, 20, 1444);
    			add_location(th1, file$9, 49, 20, 1482);
    			add_location(th2, file$9, 50, 20, 1517);
    			add_location(th3, file$9, 51, 20, 1569);
    			add_location(th4, file$9, 52, 20, 1619);
    			add_location(tr0, file$9, 47, 16, 1418);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$9, 46, 12, 1378);
    			add_location(tr1, file$9, 56, 16, 1741);
    			add_location(tbody, file$9, 55, 12, 1716);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(46:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (43:20)           loading      {:then entries}
    function create_pending_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(43:20)           loading      {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let td;
    	let button;
    	let t2;
    	let promise;
    	let current;

    	button = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[1]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "API: productions-vehicles";
    			t1 = space();
    			td = element("td");
    			create_component(button.$$.fragment);
    			t2 = space();
    			info.block.c();
    			add_location(h1, file$9, 29, 12, 914);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$9, 28, 8, 869);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$9, 27, 4, 831);
    			attr_dev(td, "align", "center");
    			add_location(td, file$9, 32, 4, 992);
    			add_location(main, file$9, 26, 0, 819);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			append_dev(main, td);
    			mount_component(button, td, null);
    			append_dev(main, t2);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apiext1list', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		const res1 = await fetch("https://sos2122-21.herokuapp.com/api/v1/productions-vehicles/loadInitialData");

    		if (res1.ok) {
    			console.log("Fetching entries....");
    			const res = await fetch("https://sos2122-21.herokuapp.com/api/v1/productions-vehicles");

    			if (res.ok) {
    				const data = await res.json();
    				$$invalidate(0, entries = data);
    				console.log("Received entries: " + entries.length);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Apiext1list> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apiext1chart`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries, click_handler];
    }

    class Apiext1list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apiext1list",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\front\premier-league\apiext1chart.svelte generated by Svelte v3.47.0 */

    const { console: console_1$5 } = globals;
    const file$8 = "src\\front\\premier-league\\apiext1chart.svelte";

    function create_fragment$8(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t;
    	let main;
    	let figure;
    	let div;

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$8, 100, 4, 3310);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$8, 101, 4, 3381);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$8, 102, 4, 3462);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$8, 103, 4, 3540);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$8, 104, 4, 3620);
    			attr_dev(div, "id", "container");
    			add_location(div, file$8, 109, 8, 3772);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$8, 108, 4, 3728);
    			add_location(main, file$8, 107, 0, 3716);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apiext1chart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let stats = [];
    	let stats_country_date = [];
    	let stats_veh_comm = [];
    	let stats_veh_pass = [];
    	let stats_veh_annprod = [];

    	async function getPEStats() {
    		console.log("Fetching stats....");
    		const res1 = await fetch("https://sos2122-21.herokuapp.com/api/v1/productions-vehicles/loadinitialdata");

    		if (res1.ok) {
    			const res = await fetch("https://sos2122-21.herokuapp.com/api/v1/productions-vehicles");

    			if (res.ok) {
    				const data = await res.json();
    				stats = data;
    				console.log("Estadísticas recibidas: " + stats.length);

    				//inicializamos los arrays para mostrar los datos
    				stats.forEach(stat => {
    					stats_country_date.push(stat.country + "-" + stat.year);
    					stats_veh_comm.push(stat["veh_comm"]);
    					stats_veh_pass.push(stat["veh_pass"]);
    					stats_veh_annprod.push(stat["veh_annprod"]);
    				});

    				//esperamos para que se carrguen los datos
    				await delay(500);

    				loadGraph();
    			} else {
    				console.log("Error cargando los datos");
    			}
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			chart: { type: "column" },
    			title: {
    				text: "Estadísticas de producción de vehículos"
    			},
    			subtitle: { text: "API Integrada 1" },
    			yAxis: { title: { text: "Valor" } },
    			xAxis: {
    				title: { text: "País-Año" },
    				categories: stats_country_date
    			},
    			legend: {
    				layout: "vertical",
    				align: "right",
    				verticalAlign: "middle"
    			},
    			series: [
    				{
    					name: "Vehículos comerciales",
    					data: stats_veh_comm
    				},
    				{
    					name: "Vehículos pasajeros",
    					data: stats_veh_pass
    				},
    				{
    					name: "Producción anual de vehículos",
    					data: stats_veh_annprod
    				}
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: "horizontal",
    								align: "center",
    								verticalAlign: "bottom"
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getPEStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Apiext1chart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		stats,
    		stats_country_date,
    		stats_veh_comm,
    		stats_veh_pass,
    		stats_veh_annprod,
    		getPEStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('stats' in $$props) stats = $$props.stats;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('stats_veh_comm' in $$props) stats_veh_comm = $$props.stats_veh_comm;
    		if ('stats_veh_pass' in $$props) stats_veh_pass = $$props.stats_veh_pass;
    		if ('stats_veh_annprod' in $$props) stats_veh_annprod = $$props.stats_veh_annprod;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Apiext1chart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apiext1chart",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\front\premier-league\apiext2list.svelte generated by Svelte v3.47.0 */

    const { console: console_1$4 } = globals;
    const file$7 = "src\\front\\premier-league\\apiext2list.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (34:8) <Button              color="success"              on:click={function () {                  window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apiext2chart`;              }}          >
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráfica");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(34:8) <Button              color=\\\"success\\\"              on:click={function () {                  window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apiext2chart`;              }}          >",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (45:4) {:then entries}
    function create_then_block$2(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 65) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(45:4) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (60:16) {#each entries as entry}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[3].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[3].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[3].spen_mill_eur + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[3].public_percent + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[3].pib_percent + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*entry*/ ctx[3].per_capita + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12_value = /*entry*/ ctx[3].var + "";
    	let t12;
    	let t13;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			add_location(td0, file$7, 61, 24, 1881);
    			add_location(td1, file$7, 62, 24, 1931);
    			add_location(td2, file$7, 63, 24, 1978);
    			add_location(td3, file$7, 64, 24, 2034);
    			add_location(td4, file$7, 65, 24, 2091);
    			add_location(td5, file$7, 66, 24, 2145);
    			add_location(td6, file$7, 67, 24, 2198);
    			add_location(tr, file$7, 60, 20, 1851);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			append_dev(td6, t12);
    			append_dev(tr, t13);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[3].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[3].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*entries*/ 1 && t4_value !== (t4_value = /*entry*/ ctx[3].spen_mill_eur + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[3].public_percent + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[3].pib_percent + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*entries*/ 1 && t10_value !== (t10_value = /*entry*/ ctx[3].per_capita + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*entries*/ 1 && t12_value !== (t12_value = /*entry*/ ctx[3].var + "")) set_data_dev(t12, t12_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(60:16) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (46:8) <Table bordered>
    function create_default_slot$3(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let tbody;
    	let tr1;
    	let t14;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Country";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Year";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Gasto en millones";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "% gasto público";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "% PIB";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Per capita";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Var";
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t14 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$7, 48, 20, 1441);
    			add_location(th1, file$7, 49, 20, 1479);
    			add_location(th2, file$7, 50, 20, 1514);
    			add_location(th3, file$7, 51, 20, 1562);
    			add_location(th4, file$7, 52, 20, 1608);
    			add_location(th5, file$7, 53, 20, 1644);
    			add_location(th6, file$7, 54, 20, 1685);
    			add_location(tr0, file$7, 47, 16, 1415);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$7, 46, 12, 1375);
    			add_location(tr1, file$7, 58, 16, 1781);
    			add_location(tbody, file$7, 57, 12, 1756);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t14);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(46:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (43:20)           loading      {:then entries}
    function create_pending_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(43:20)           loading      {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let td;
    	let button;
    	let t2;
    	let promise;
    	let current;

    	button = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[1]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "API: defense-spent-stats";
    			t1 = space();
    			td = element("td");
    			create_component(button.$$.fragment);
    			t2 = space();
    			info.block.c();
    			add_location(h1, file$7, 29, 12, 912);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$7, 28, 8, 867);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$7, 27, 4, 829);
    			attr_dev(td, "align", "center");
    			add_location(td, file$7, 32, 4, 989);
    			add_location(main, file$7, 26, 0, 817);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			append_dev(main, td);
    			mount_component(button, td, null);
    			append_dev(main, t2);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apiext2list', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		const res1 = await fetch("https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats/loadInitialData");

    		if (res1.ok) {
    			console.log("Fetching entries....");
    			const res = await fetch("https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats");

    			if (res.ok) {
    				const data = await res.json();
    				$$invalidate(0, entries = data);
    				console.log("Received entries: " + entries.length);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Apiext2list> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		window.location.href = `https://sos2122-23.herokuapp.com/#/premier-league/apiext2chart`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries, click_handler];
    }

    class Apiext2list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apiext2list",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\front\premier-league\apiext2chart.svelte generated by Svelte v3.47.0 */

    const { console: console_1$3 } = globals;
    const file$6 = "src\\front\\premier-league\\apiext2chart.svelte";

    function create_fragment$6(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t;
    	let main;
    	let figure;
    	let div;

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$6, 112, 4, 3709);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$6, 113, 4, 3780);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$6, 114, 4, 3861);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$6, 115, 4, 3939);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$6, 116, 4, 4019);
    			attr_dev(div, "id", "container");
    			add_location(div, file$6, 121, 8, 4171);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$6, 120, 4, 4127);
    			add_location(main, file$6, 119, 0, 4115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Apiext2chart', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let stats = [];
    	let stats_country_date = [];
    	let stats_spen_mill_eur = [];
    	let stats_public_percent = [];
    	let stats_pib_percent = [];
    	let stats_per_capita = [];
    	let stats_var = [];

    	async function getPEStats() {
    		console.log("Fetching stats....");
    		const res1 = await fetch("https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats/loadInitialData");

    		if (res1.ok) {
    			const res = await fetch("https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats");

    			if (res.ok) {
    				const data = await res.json();
    				stats = data;
    				console.log("Estadísticas recibidas: " + stats.length);

    				//inicializamos los arrays para mostrar los datos
    				stats.forEach(stat => {
    					stats_country_date.push(stat.country + "-" + stat.year);
    					stats_spen_mill_eur.push(stat["spen_mill_eur"]);
    					stats_public_percent.push(stat["public_percent"]);
    					stats_pib_percent.push(stat["pib_percent"]);
    					stats_per_capita.push(stat["per_capita"]);
    					stats_var.push(stat["var"]);
    				});

    				//esperamos para que se carrguen los datos
    				await delay(500);

    				loadGraph();
    			} else {
    				console.log("Error cargando los datos");
    			}
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			chart: { type: "column" },
    			title: { text: "Estadísticas de defensa" },
    			subtitle: { text: "API Integrada 2" },
    			yAxis: { title: { text: "Valor" } },
    			xAxis: {
    				title: { text: "País-Año" },
    				categories: stats_country_date
    			},
    			legend: {
    				layout: "vertical",
    				align: "right",
    				verticalAlign: "middle"
    			},
    			series: [
    				{
    					name: "Gasto en millones",
    					data: stats_spen_mill_eur
    				},
    				{
    					name: "% gasto público",
    					data: stats_public_percent
    				},
    				{ name: "%PIB", data: stats_pib_percent },
    				{
    					name: "Per capita",
    					data: stats_per_capita
    				},
    				{ name: "Var", data: stats_var }
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: "horizontal",
    								align: "center",
    								verticalAlign: "bottom"
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getPEStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Apiext2chart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		delay,
    		stats,
    		stats_country_date,
    		stats_spen_mill_eur,
    		stats_public_percent,
    		stats_pib_percent,
    		stats_per_capita,
    		stats_var,
    		getPEStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('stats' in $$props) stats = $$props.stats;
    		if ('stats_country_date' in $$props) stats_country_date = $$props.stats_country_date;
    		if ('stats_spen_mill_eur' in $$props) stats_spen_mill_eur = $$props.stats_spen_mill_eur;
    		if ('stats_public_percent' in $$props) stats_public_percent = $$props.stats_public_percent;
    		if ('stats_pib_percent' in $$props) stats_pib_percent = $$props.stats_pib_percent;
    		if ('stats_per_capita' in $$props) stats_per_capita = $$props.stats_per_capita;
    		if ('stats_var' in $$props) stats_var = $$props.stats_var;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Apiext2chart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Apiext2chart",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\front\nba-stats\nbaList.svelte generated by Svelte v3.47.0 */

    const { console: console_1$2 } = globals;
    const file$5 = "src\\front\\nba-stats\\nbaList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (200:1) {:then entries}
    function create_then_block$1(ctx) {
    	let alert_1;
    	let t0;
    	let table0;
    	let t1;
    	let table1;
    	let t2;
    	let div;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[3],
    				isOpen: /*visible*/ ctx[2],
    				toggle: /*func*/ ctx[15],
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = Array(/*maxPages*/ ctx[7] + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			create_component(table0.$$.fragment);
    			t1 = space();
    			create_component(table1.$$.fragment);
    			t2 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "align", "center");
    			add_location(div, file$5, 301, 4, 9435);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_1_changes = {};
    			if (dirty[0] & /*color*/ 8) alert_1_changes.color = /*color*/ ctx[3];
    			if (dirty[0] & /*visible*/ 4) alert_1_changes.isOpen = /*visible*/ ctx[2];
    			if (dirty[0] & /*visible*/ 4) alert_1_changes.toggle = /*func*/ ctx[15];

    			if (dirty[0] & /*checkMSG*/ 2 | dirty[1] & /*$$scope*/ 128) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*from, to, checkMSG*/ 50 | dirty[1] & /*$$scope*/ 128) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*entries, newEntry*/ 257 | dirty[1] & /*$$scope*/ 128) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);

    			if (dirty[0] & /*offset, getEntries, maxPages*/ 704) {
    				each_value = Array(/*maxPages*/ ctx[7] + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(200:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (203:2) {#if checkMSG}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkMSG*/ 2) set_data_dev(t, /*checkMSG*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(203:2) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (202:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_10(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(202:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (218:23) <Button outline color="dark" on:click="{()=>{       if (from == null || to == null) {        window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')       }else{                          checkMSG = "Datos cargados correctamente en ese periodo";        getEntries();       }      }}">
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(218:23) <Button outline color=\\\"dark\\\" on:click=\\\"{()=>{       if (from == null || to == null) {        window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')       }else{                          checkMSG = \\\"Datos cargados correctamente en ese periodo\\\";        getEntries();       }      }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (229:23) <Button outline color="info" on:click="{()=>{       from = null;       to = null;       getEntries();                      checkMSG = "Busqueda limpiada";             }}">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar Búsqueda");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(229:23) <Button outline color=\\\"info\\\" on:click=\\\"{()=>{       from = null;       to = null;       getEntries();                      checkMSG = \\\"Busqueda limpiada\\\";             }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (207:4) <Table bordered>
    function create_default_slot_7(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t4;
    	let td1;
    	let input1;
    	let t5;
    	let td2;
    	let button0;
    	let t6;
    	let td3;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "dark",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[18]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[19]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Fecha inicio";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Fecha fin";
    			t3 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t4 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t5 = space();
    			td2 = element("td");
    			create_component(button0.$$.fragment);
    			t6 = space();
    			td3 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$5, 209, 4, 6882);
    			add_location(th1, file$5, 210, 4, 6909);
    			add_location(tr0, file$5, 208, 3, 6872);
    			add_location(thead, file$5, 207, 2, 6860);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "2000");
    			add_location(input0, file$5, 215, 8, 6979);
    			add_location(td0, file$5, 215, 4, 6975);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "2000");
    			add_location(input1, file$5, 216, 8, 7046);
    			add_location(td1, file$5, 216, 4, 7042);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$5, 217, 4, 7107);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$5, 228, 4, 7474);
    			add_location(tr1, file$5, 214, 3, 6965);
    			add_location(tbody, file$5, 213, 2, 6953);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*from*/ ctx[4]);
    			append_dev(tr1, t4);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*to*/ ctx[5]);
    			append_dev(tr1, t5);
    			append_dev(tr1, td2);
    			mount_component(button0, td2, null);
    			append_dev(tr1, t6);
    			append_dev(tr1, td3);
    			mount_component(button1, td3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[16]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[17])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*from*/ 16 && to_number(input0.value) !== /*from*/ ctx[4]) {
    				set_input_value(input0, /*from*/ ctx[4]);
    			}

    			if (dirty[0] & /*to*/ 32 && to_number(input1.value) !== /*to*/ ctx[5]) {
    				set_input_value(input1, /*to*/ ctx[5]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(207:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (268:8) <Button outline color="primary" on:click="{insertEntry}">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(268:8) <Button outline color=\\\"primary\\\" on:click=\\\"{insertEntry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (281:9) <Button outline color="warning" on:click={function (){        window.location.href = `/#/nba-stats/${entry.country}/${entry.year}`       }}>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(281:9) <Button outline color=\\\"warning\\\" on:click={function (){        window.location.href = `/#/nba-stats/${entry.country}/${entry.year}`       }}>",
    		ctx
    	});

    	return block;
    }

    // (286:9) <Button outline color="danger" on:click={BorrarEntry(entry.country,entry.year)}>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(286:9) <Button outline color=\\\"danger\\\" on:click={BorrarEntry(entry.country,entry.year)}>",
    		ctx
    	});

    	return block;
    }

    // (273:3) {#each entries as entry}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[35].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[35].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[35].name + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[35].mostpoints + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[35].fieldgoals + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*entry*/ ctx[35].efficiency + "";
    	let t10;
    	let t11;
    	let td6;
    	let button0;
    	let t12;
    	let td7;
    	let button1;
    	let current;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[26](/*entry*/ ctx[35]);
    	}

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", click_handler_2);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*BorrarEntry*/ ctx[12](/*entry*/ ctx[35].country, /*entry*/ ctx[35].year))) /*BorrarEntry*/ ctx[12](/*entry*/ ctx[35].country, /*entry*/ ctx[35].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			create_component(button0.$$.fragment);
    			t12 = space();
    			td7 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(td0, file$5, 274, 5, 8615);
    			add_location(td1, file$5, 275, 5, 8646);
    			add_location(td2, file$5, 276, 20, 8689);
    			add_location(td3, file$5, 277, 5, 8717);
    			add_location(td4, file$5, 278, 20, 8766);
    			add_location(td5, file$5, 279, 20, 8815);
    			add_location(td6, file$5, 280, 5, 8849);
    			add_location(td7, file$5, 285, 5, 9030);
    			add_location(tr, file$5, 273, 4, 8604);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			mount_component(button0, td6, null);
    			append_dev(td6, t12);
    			append_dev(tr, td7);
    			mount_component(button1, td7, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*entries*/ 256) && t0_value !== (t0_value = /*entry*/ ctx[35].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t2_value !== (t2_value = /*entry*/ ctx[35].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t4_value !== (t4_value = /*entry*/ ctx[35].name + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t6_value !== (t6_value = /*entry*/ ctx[35].mostpoints + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t8_value !== (t8_value = /*entry*/ ctx[35].fieldgoals + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t10_value !== (t10_value = /*entry*/ ctx[35].efficiency + "")) set_data_dev(t10, t10_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(273:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (293:8) <Button outline color="success" on:click={LoadEntries}>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(293:8) <Button outline color=\\\"success\\\" on:click={LoadEntries}>",
    		ctx
    	});

    	return block;
    }

    // (296:8) <Button outline color="danger" on:click={BorrarEntries}>
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(296:8) <Button outline color=\\\"danger\\\" on:click={BorrarEntries}>",
    		ctx
    	});

    	return block;
    }

    // (244:1) <Table bordered>
    function create_default_slot_1$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t12;
    	let th7;
    	let t13;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t14;
    	let td1;
    	let input1;
    	let t15;
    	let td2;
    	let input2;
    	let t16;
    	let td3;
    	let input3;
    	let t17;
    	let td4;
    	let input4;
    	let t18;
    	let td5;
    	let input5;
    	let t19;
    	let td6;
    	let button0;
    	let t20;
    	let t21;
    	let tr2;
    	let td7;
    	let button1;
    	let t22;
    	let td8;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*insertEntry*/ ctx[11]);
    	let each_value_1 = /*entries*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*LoadEntries*/ ctx[10]);

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*BorrarEntries*/ ctx[13]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Nombre";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Puntos";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Tiros de campo";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Eficiencia";
    			t11 = space();
    			th6 = element("th");
    			t12 = space();
    			th7 = element("th");
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t18 = space();
    			td5 = element("td");
    			input5 = element("input");
    			t19 = space();
    			td6 = element("td");
    			create_component(button0.$$.fragment);
    			t20 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t21 = space();
    			tr2 = element("tr");
    			td7 = element("td");
    			create_component(button1.$$.fragment);
    			t22 = space();
    			td8 = element("td");
    			create_component(button2.$$.fragment);
    			add_location(th0, file$5, 249, 4, 7865);
    			add_location(th1, file$5, 250, 4, 7884);
    			add_location(th2, file$5, 251, 4, 7902);
    			add_location(th3, file$5, 252, 4, 7923);
    			add_location(th4, file$5, 253, 16, 7956);
    			add_location(th5, file$5, 254, 16, 7997);
    			add_location(th6, file$5, 255, 4, 8022);
    			add_location(th7, file$5, 256, 4, 8037);
    			add_location(tr0, file$5, 247, 3, 7849);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$5, 246, 2, 7822);
    			add_location(input0, file$5, 261, 8, 8099);
    			add_location(td0, file$5, 261, 4, 8095);
    			add_location(input1, file$5, 262, 8, 8153);
    			add_location(td1, file$5, 262, 4, 8149);
    			add_location(input2, file$5, 263, 20, 8216);
    			add_location(td2, file$5, 263, 16, 8212);
    			add_location(input3, file$5, 264, 8, 8267);
    			add_location(td3, file$5, 264, 4, 8263);
    			add_location(input4, file$5, 265, 20, 8336);
    			add_location(td4, file$5, 265, 16, 8332);
    			add_location(input5, file$5, 266, 20, 8405);
    			add_location(td5, file$5, 266, 16, 8401);
    			add_location(td6, file$5, 267, 4, 8458);
    			add_location(tr1, file$5, 260, 3, 8085);
    			add_location(td7, file$5, 292, 4, 9194);
    			add_location(td8, file$5, 295, 4, 9298);
    			add_location(tr2, file$5, 291, 3, 9184);
    			add_location(tbody, file$5, 259, 2, 8073);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			append_dev(tr0, t12);
    			append_dev(tr0, th7);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newEntry*/ ctx[0].country);
    			append_dev(tr1, t14);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newEntry*/ ctx[0].year);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newEntry*/ ctx[0].name);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newEntry*/ ctx[0].mostpoints);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newEntry*/ ctx[0].fieldgoals);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			append_dev(td5, input5);
    			set_input_value(input5, /*newEntry*/ ctx[0].efficiency);
    			append_dev(tr1, t19);
    			append_dev(tr1, td6);
    			mount_component(button0, td6, null);
    			append_dev(tbody, t20);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t21);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td7);
    			mount_component(button1, td7, null);
    			append_dev(tr2, t22);
    			append_dev(tr2, td8);
    			mount_component(button2, td8, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[20]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[21]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[22]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[23]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[24]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[25])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newEntry*/ 1 && input0.value !== /*newEntry*/ ctx[0].country) {
    				set_input_value(input0, /*newEntry*/ ctx[0].country);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input1.value !== /*newEntry*/ ctx[0].year) {
    				set_input_value(input1, /*newEntry*/ ctx[0].year);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input2.value !== /*newEntry*/ ctx[0].name) {
    				set_input_value(input2, /*newEntry*/ ctx[0].name);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input3.value !== /*newEntry*/ ctx[0].mostpoints) {
    				set_input_value(input3, /*newEntry*/ ctx[0].mostpoints);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input4.value !== /*newEntry*/ ctx[0].fieldgoals) {
    				set_input_value(input4, /*newEntry*/ ctx[0].fieldgoals);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && input5.value !== /*newEntry*/ ctx[0].efficiency) {
    				set_input_value(input5, /*newEntry*/ ctx[0].efficiency);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (dirty[0] & /*BorrarEntry, entries*/ 4352) {
    				each_value_1 = /*entries*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t21);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button1);
    			destroy_component(button2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(244:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (305:3) <Button outline color="secondary" on:click={()=>{      offset = page;      getEntries();     }}>
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*page*/ ctx[14]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(305:3) <Button outline color=\\\"secondary\\\" on:click={()=>{      offset = page;      getEntries();     }}>",
    		ctx
    	});

    	return block;
    }

    // (303:2) {#each Array(maxPages+1) as _,page}
    function create_each_block(ctx) {
    	let button;
    	let t;
    	let current;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[27](/*page*/ ctx[14]);
    	}

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", click_handler_3);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    			t = text(" ");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(303:2) {#each Array(maxPages+1) as _,page}",
    		ctx
    	});

    	return block;
    }

    // (198:17)     loading   {:then entries}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(198:17)     loading   {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[8], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "NBA API";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Estadísticas de jugadores en la mejor liga de baloncesto del mundo";
    			t3 = space();
    			info.block.c();
    			add_location(h1, file$5, 190, 4, 6523);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$5, 189, 2, 6486);
    			add_location(p, file$5, 192, 2, 6560);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$5, 188, 1, 6454);
    			add_location(main, file$5, 187, 0, 6445);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*entries*/ 256 && promise !== (promise = /*entries*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NbaList', slots, []);
    	var BASE_API_PATH = "/api/v2/nba-stats";
    	let entries = [];

    	let newEntry = {
    		country: "",
    		year: "",
    		name: "",
    		mostpoints: "",
    		fieldgoals: "",
    		efficiency: ""
    	};

    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";
    	let page = 1;
    	let totaldata = 6;
    	let from = null;
    	let to = null;
    	let offset = 0;
    	let limit = 10;
    	let maxPages = 0;
    	let numEntries;
    	onMount(getEntries);

    	//GET
    	async function getEntries() {
    		console.log("Fetching entries....");
    		let cadena = `/api/v2/nba-stats?limit=${limit}&&offset=${offset * 10}&&`;

    		if (from != null) {
    			cadena = cadena + `from=${from}&&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}&&`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset * 10}`);
    			maxPagesFunction(cadenaPag[0] + cadenaPag[1]);
    			const data = await res.json();
    			$$invalidate(8, entries = data);
    			numEntries = entries.length;
    			console.log("Received entries: " + entries.length);
    		} else {
    			Errores(res.status);
    		}
    	}

    	//GET INITIALDATA
    	async function LoadEntries() {
    		console.log("Fetching entry data...");
    		await fetch(BASE_API_PATH + "/loadInitialData");
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(8, entries = json);
    			$$invalidate(2, visible = true);
    			totaldata = 6;
    			console.log("Received " + entries.length + " entry data.");
    			$$invalidate(3, color = "success");
    			$$invalidate(1, checkMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(3, color = "danger");
    			$$invalidate(1, checkMSG = res.status + ": " + "No se pudo cargar los datos");
    			console.log("ERROR! ");
    		}
    	}

    	//INSERT DATA
    	async function insertEntry() {
    		console.log("Inserting resources...");

    		if (newEntry.country == "" || newEntry.year == null || newEntry.name == "" || newEntry.mostpoints == null || newEntry.fieldgoals == null || newEntry.efficiency == null) {
    			alert("Los campos no pueden estar vacios");
    		} else {
    			await fetch(BASE_API_PATH, {
    				method: "POST",
    				body: JSON.stringify({
    					country: newEntry.country,
    					year: parseInt(newEntry.year),
    					name: newEntry.name,
    					mostpoints: parseFloat(newEntry.mostpoints),
    					fieldgoals: parseFloat(newEntry.fieldgoals),
    					efficiency: parseFloat(newEntry.efficiency)
    				}),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				$$invalidate(2, visible = true);

    				if (res.status == 201) {
    					getEntries();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(3, color = "success");
    					$$invalidate(1, checkMSG = "Entrada introducida correctamente a la base de datos");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Los datos de la entrada no fueron introducidos correctamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that country and year in the da tabase");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "Ya existe una entrada en la base de datos con el pais y el año introducido");
    				}
    			});
    		}
    	}

    	//DELETE STAT
    	async function BorrarEntry(countryD, yearD) {
    		await fetch(BASE_API_PATH + "/" + countryD + "/" + yearD, { method: "DELETE" }).then(function (res) {
    			$$invalidate(2, visible = true);
    			getEntries();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(3, color = "success");
    				$$invalidate(1, checkMSG = "Recurso " + countryD + " " + yearD + " borrado correctamente");
    				console.log("Deleted " + countryD);
    			} else if (res.status == 404) {
    				$$invalidate(3, color = "danger");
    				$$invalidate(1, checkMSG = "No se ha encontrado el objeto " + countryD);
    				console.log("Resource NOT FOUND");
    			} else {
    				$$invalidate(3, color = "danger");
    				$$invalidate(1, checkMSG = res.status + ": " + "No se pudo borrar el recurso");
    				console.log("ERROR!");
    			}
    		});
    	}

    	//DELETE ALL STATS
    	async function BorrarEntries() {
    		console.log("Deleting entry data...");

    		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")) {
    			console.log("Deleting all entry data...");

    			await fetch(BASE_API_PATH, { method: "DELETE" }).then(function (res) {
    				$$invalidate(2, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getEntries();
    					$$invalidate(3, color = "success");
    					$$invalidate(1, checkMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(1, checkMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//Función auxiliar para obtener el número máximo de páginas que se pueden ver
    	async function maxPagesFunction(cadena) {
    		const res = await fetch(cadena, { method: "GET" });

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(7, maxPages = Math.floor(data.length / 10));

    			if (maxPages === data.length / 10) {
    				$$invalidate(7, maxPages = maxPages - 1);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<NbaList> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(2, visible = false);

    	function input0_input_handler() {
    		from = to_number(this.value);
    		$$invalidate(4, from);
    	}

    	function input1_input_handler() {
    		to = to_number(this.value);
    		$$invalidate(5, to);
    	}

    	const click_handler = () => {
    		if (from == null || to == null) {
    			window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos');
    		} else {
    			$$invalidate(1, checkMSG = "Datos cargados correctamente en ese periodo");
    			getEntries();
    		}
    	};

    	const click_handler_1 = () => {
    		$$invalidate(4, from = null);
    		$$invalidate(5, to = null);
    		getEntries();
    		$$invalidate(1, checkMSG = "Busqueda limpiada");
    	};

    	function input0_input_handler_1() {
    		newEntry.country = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input1_input_handler_1() {
    		newEntry.year = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input2_input_handler() {
    		newEntry.name = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input3_input_handler() {
    		newEntry.mostpoints = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input4_input_handler() {
    		newEntry.fieldgoals = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input5_input_handler() {
    		newEntry.efficiency = this.value;
    		$$invalidate(0, newEntry);
    	}

    	const click_handler_2 = function (entry) {
    		window.location.href = `/#/nba-stats/${entry.country}/${entry.year}`;
    	};

    	const click_handler_3 = page => {
    		$$invalidate(6, offset = page);
    		getEntries();
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		BASE_API_PATH,
    		entries,
    		newEntry,
    		checkMSG,
    		visible,
    		color,
    		page,
    		totaldata,
    		from,
    		to,
    		offset,
    		limit,
    		maxPages,
    		numEntries,
    		getEntries,
    		LoadEntries,
    		insertEntry,
    		BorrarEntry,
    		BorrarEntries,
    		maxPagesFunction
    	});

    	$$self.$inject_state = $$props => {
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('entries' in $$props) $$invalidate(8, entries = $$props.entries);
    		if ('newEntry' in $$props) $$invalidate(0, newEntry = $$props.newEntry);
    		if ('checkMSG' in $$props) $$invalidate(1, checkMSG = $$props.checkMSG);
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('page' in $$props) $$invalidate(14, page = $$props.page);
    		if ('totaldata' in $$props) totaldata = $$props.totaldata;
    		if ('from' in $$props) $$invalidate(4, from = $$props.from);
    		if ('to' in $$props) $$invalidate(5, to = $$props.to);
    		if ('offset' in $$props) $$invalidate(6, offset = $$props.offset);
    		if ('limit' in $$props) limit = $$props.limit;
    		if ('maxPages' in $$props) $$invalidate(7, maxPages = $$props.maxPages);
    		if ('numEntries' in $$props) numEntries = $$props.numEntries;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newEntry,
    		checkMSG,
    		visible,
    		color,
    		from,
    		to,
    		offset,
    		maxPages,
    		entries,
    		getEntries,
    		LoadEntries,
    		insertEntry,
    		BorrarEntry,
    		BorrarEntries,
    		page,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class NbaList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NbaList",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\front\nba-stats\nbaEdit.svelte generated by Svelte v3.47.0 */

    const { console: console_1$1 } = globals;
    const file$4 = "src\\front\\nba-stats\\nbaEdit.svelte";

    // (76:8) {#if errorMsg}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*errorMsg*/ ctx[9]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 512) set_data_dev(t, /*errorMsg*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(76:8) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (75:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[9] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*errorMsg*/ ctx[9]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(75:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      export let params = {}
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>      export let params = {}",
    		ctx
    	});

    	return block;
    }

    // (84:8) {:then entry}
    function create_then_block(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedEfficiency, updatedFieldgoals, updatedMostpoints, updatedName, updatedYear, updatedCountry*/ 1049080) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(84:8) {:then entry}",
    		ctx
    	});

    	return block;
    }

    // (109:24) <Button outline color="primary" on:click="{EditEntry}">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(109:24) <Button outline color=\\\"primary\\\" on:click=\\\"{EditEntry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (87:8) <Table bordered>
    function create_default_slot_1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t12;
    	let th7;
    	let t13;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t14;
    	let td1;
    	let input1;
    	let t15;
    	let td2;
    	let input2;
    	let t16;
    	let td3;
    	let input3;
    	let t17;
    	let td4;
    	let input4;
    	let t18;
    	let td5;
    	let input5;
    	let t19;
    	let td6;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*EditEntry*/ ctx[11]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Nombre";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Puntos";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Tiros de campo";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Eficiencia";
    			t11 = space();
    			th6 = element("th");
    			t12 = space();
    			th7 = element("th");
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t18 = space();
    			td5 = element("td");
    			input5 = element("input");
    			t19 = space();
    			td6 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$4, 90, 20, 2970);
    			add_location(th1, file$4, 91, 20, 3005);
    			add_location(th2, file$4, 92, 20, 3039);
    			add_location(th3, file$4, 93, 20, 3076);
    			add_location(th4, file$4, 94, 20, 3113);
    			add_location(th5, file$4, 95, 20, 3158);
    			add_location(th6, file$4, 96, 20, 3199);
    			add_location(th7, file$4, 97, 20, 3230);
    			add_location(tr0, file$4, 88, 16, 2938);
    			add_location(thead, file$4, 87, 12, 2913);
    			add_location(input0, file$4, 102, 24, 3354);
    			add_location(td0, file$4, 102, 20, 3350);
    			add_location(input1, file$4, 103, 24, 3422);
    			add_location(td1, file$4, 103, 20, 3418);
    			add_location(input2, file$4, 104, 24, 3489);
    			add_location(td2, file$4, 104, 20, 3485);
    			add_location(input3, file$4, 105, 24, 3556);
    			add_location(td3, file$4, 105, 20, 3552);
    			add_location(input4, file$4, 106, 24, 3627);
    			add_location(td4, file$4, 106, 20, 3623);
    			add_location(input5, file$4, 107, 24, 3698);
    			add_location(td5, file$4, 107, 20, 3694);
    			add_location(td6, file$4, 108, 20, 3765);
    			add_location(tr1, file$4, 101, 16, 3324);
    			add_location(tbody, file$4, 100, 12, 3299);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			append_dev(tr0, t12);
    			append_dev(tr0, th7);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*updatedCountry*/ ctx[3]);
    			append_dev(tr1, t14);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*updatedYear*/ ctx[4]);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*updatedName*/ ctx[5]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*updatedMostpoints*/ ctx[6]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*updatedFieldgoals*/ ctx[7]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			append_dev(td5, input5);
    			set_input_value(input5, /*updatedEfficiency*/ ctx[8]);
    			append_dev(tr1, t19);
    			append_dev(tr1, td6);
    			mount_component(button, td6, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[15]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[16]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[17]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[18])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*updatedCountry*/ 8 && input0.value !== /*updatedCountry*/ ctx[3]) {
    				set_input_value(input0, /*updatedCountry*/ ctx[3]);
    			}

    			if (dirty & /*updatedYear*/ 16 && input1.value !== /*updatedYear*/ ctx[4]) {
    				set_input_value(input1, /*updatedYear*/ ctx[4]);
    			}

    			if (dirty & /*updatedName*/ 32 && input2.value !== /*updatedName*/ ctx[5]) {
    				set_input_value(input2, /*updatedName*/ ctx[5]);
    			}

    			if (dirty & /*updatedMostpoints*/ 64 && input3.value !== /*updatedMostpoints*/ ctx[6]) {
    				set_input_value(input3, /*updatedMostpoints*/ ctx[6]);
    			}

    			if (dirty & /*updatedFieldgoals*/ 128 && input4.value !== /*updatedFieldgoals*/ ctx[7]) {
    				set_input_value(input4, /*updatedFieldgoals*/ ctx[7]);
    			}

    			if (dirty & /*updatedEfficiency*/ 256 && input5.value !== /*updatedEfficiency*/ ctx[8]) {
    				set_input_value(input5, /*updatedEfficiency*/ ctx[8]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(87:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (82:18)       loading          {:then entry}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(82:18)       loading          {:then entry}",
    		ctx
    	});

    	return block;
    }

    // (118:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(118:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let alert;
    	let t0;
    	let h1;
    	let t1;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let t4_value = /*params*/ ctx[0].year + "";
    	let t4;
    	let t5;
    	let t6;
    	let promise;
    	let t7;
    	let button;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[2],
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[12],
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 10,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entry*/ ctx[10], info);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(alert.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text("Editar entrada \"");
    			t2 = text(t2_value);
    			t3 = text("\",\"");
    			t4 = text(t4_value);
    			t5 = text("\"");
    			t6 = space();
    			info.block.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$4, 80, 4, 2743);
    			add_location(main, file$4, 73, 0, 2584);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(alert, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			append_dev(h1, t5);
    			append_dev(main, t6);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t7;
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const alert_changes = {};
    			if (dirty & /*color*/ 4) alert_changes.color = /*color*/ ctx[2];
    			if (dirty & /*visible*/ 2) alert_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty & /*visible*/ 2) alert_changes.toggle = /*func*/ ctx[12];

    			if (dirty & /*$$scope, errorMsg*/ 1049088) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].year + "")) set_data_dev(t4, t4_value);
    			info.ctx = ctx;

    			if (dirty & /*entry*/ 1024 && promise !== (promise = /*entry*/ ctx[10]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NbaEdit', slots, []);
    	let { params = {} } = $$props;
    	let visible = false;
    	let color = "danger";
    	let entry = {};
    	let updatedCountry;
    	let updatedYear;
    	let updatedName;
    	let updatedMostpoints;
    	let updatedFieldgoals;
    	let updatedEfficiency;
    	let errorMsg = "";
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v2/nba-stats/" + params.country + "/" + params.year);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(10, entry = data);
    			$$invalidate(3, updatedCountry = entry.country);
    			$$invalidate(4, updatedYear = entry.year);
    			$$invalidate(5, updatedName = entry.name);
    			$$invalidate(6, updatedMostpoints = entry.mostpoints);
    			$$invalidate(7, updatedFieldgoals = entry.fieldgoals);
    			$$invalidate(8, updatedEfficiency = entry.efficiency);
    		} else {
    			$$invalidate(1, visible = true);
    			$$invalidate(2, color = "danger");
    			$$invalidate(9, errorMsg = "Error " + res.status + " : " + "Ningún recurso con los parametros " + params.country + " " + params.year);
    			console.log("ERROR" + errorMsg);
    		}
    	}

    	async function EditEntry() {
    		console.log("Updating entry...." + updatedCountry);

    		await fetch("/api/v2/nba-stats/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: updatedCountry,
    				year: parseInt(updatedYear),
    				name: updatedName,
    				mostpoints: parseFloat(updatedMostpoints),
    				fieldgoals: parseFloat(updatedFieldgoals),
    				efficiency: parseFloat(updatedEfficiency)
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			$$invalidate(1, visible = true);

    			if (res.status == 200) {
    				getEntries();
    				console.log("Data introduced");
    				$$invalidate(2, color = "success");
    				$$invalidate(9, errorMsg = "Recurso actualizado correctamente");
    			} else {
    				console.log("Data not edited");
    				$$invalidate(2, color = "danger");
    				$$invalidate(9, errorMsg = "Compruebe los campos");
    			}
    		});
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<NbaEdit> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input0_input_handler() {
    		updatedCountry = this.value;
    		$$invalidate(3, updatedCountry);
    	}

    	function input1_input_handler() {
    		updatedYear = this.value;
    		$$invalidate(4, updatedYear);
    	}

    	function input2_input_handler() {
    		updatedName = this.value;
    		$$invalidate(5, updatedName);
    	}

    	function input3_input_handler() {
    		updatedMostpoints = this.value;
    		$$invalidate(6, updatedMostpoints);
    	}

    	function input4_input_handler() {
    		updatedFieldgoals = this.value;
    		$$invalidate(7, updatedFieldgoals);
    	}

    	function input5_input_handler() {
    		updatedEfficiency = this.value;
    		$$invalidate(8, updatedEfficiency);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		params,
    		pop,
    		onMount,
    		Button,
    		Table,
    		Alert,
    		visible,
    		color,
    		entry,
    		updatedCountry,
    		updatedYear,
    		updatedName,
    		updatedMostpoints,
    		updatedFieldgoals,
    		updatedEfficiency,
    		errorMsg,
    		getEntries,
    		EditEntry
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('visible' in $$props) $$invalidate(1, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('entry' in $$props) $$invalidate(10, entry = $$props.entry);
    		if ('updatedCountry' in $$props) $$invalidate(3, updatedCountry = $$props.updatedCountry);
    		if ('updatedYear' in $$props) $$invalidate(4, updatedYear = $$props.updatedYear);
    		if ('updatedName' in $$props) $$invalidate(5, updatedName = $$props.updatedName);
    		if ('updatedMostpoints' in $$props) $$invalidate(6, updatedMostpoints = $$props.updatedMostpoints);
    		if ('updatedFieldgoals' in $$props) $$invalidate(7, updatedFieldgoals = $$props.updatedFieldgoals);
    		if ('updatedEfficiency' in $$props) $$invalidate(8, updatedEfficiency = $$props.updatedEfficiency);
    		if ('errorMsg' in $$props) $$invalidate(9, errorMsg = $$props.errorMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		visible,
    		color,
    		updatedCountry,
    		updatedYear,
    		updatedName,
    		updatedMostpoints,
    		updatedFieldgoals,
    		updatedEfficiency,
    		errorMsg,
    		entry,
    		EditEntry,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler
    	];
    }

    class NbaEdit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NbaEdit",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get params() {
    		throw new Error("<NbaEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<NbaEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\Analytics.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;
    const file$3 = "src\\front\\Analytics.svelte";

    // (204:4) <Button outline color="secondary" href="/">
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(204:4) <Button outline color=\\\"secondary\\\" href=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let div0;
    	let h2;
    	let t2;
    	let figure;
    	let div1;
    	let t3;
    	let p;
    	let t4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				href: "/",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Visualizacion conjunta SOS2122-23";
    			t2 = space();
    			figure = element("figure");
    			div1 = element("div");
    			t3 = space();
    			p = element("p");
    			t4 = space();
    			create_component(button.$$.fragment);
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$3, 178, 4, 6047);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$3, 179, 4, 6140);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$3, 180, 4, 6243);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$3, 181, 4, 6343);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$3, 182, 4, 6445);
    			add_location(h2, file$3, 191, 8, 6618);
    			add_location(div0, file$3, 190, 4, 6603);
    			attr_dev(div1, "id", "container");
    			add_location(div1, file$3, 197, 8, 6750);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$3, 198, 8, 6786);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$3, 196, 4, 6706);
    			attr_dev(main, "class", "svelte-dh8p91");
    			add_location(main, file$3, 185, 2, 6573);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h2);
    			append_dev(main, t2);
    			append_dev(main, figure);
    			append_dev(figure, div1);
    			append_dev(figure, t3);
    			append_dev(figure, p);
    			append_dev(main, t4);
    			mount_component(button, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(script0, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script1, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script2, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script3, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script4, "load", /*loadGraph*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Analytics', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));

    	//Tennis
    	let tennisData = [];

    	let tennisChartCountryYear = [];
    	let tennisChartmost_grand_slam = [];
    	let tennisChartmasters_finals = [];
    	let tennisChartolympic_gold_medals = [];

    	//Premier
    	let premierStats = [];

    	let premier_country_year = [];
    	let premier_appearences = [];
    	let premier_cleanSheets = [];
    	let premier_goals = [];

    	//Nba
    	let nbaStats = [];

    	let nba_country_year = [];
    	let nba_mostpoints = [];
    	let nba_fieldgoals = [];
    	let nba_efficiency = [];

    	async function gettennisData() {
    		console.log("Fetching stats....");
    		const res = await fetch("/api/v2/tennis");

    		if (res.ok) {
    			const data = await res.json();
    			tennisData = data;
    			console.log("Estadísticas recibidas: " + tennisData.length);

    			//inicializamos los arrays para mostrar los datos
    			tennisData.forEach(stat => {
    				//tennisChartCountryYear.push(stat.country+"-"+stat.year);
    				tennisChartCountryYear.push(stat.year);

    				tennisChartmost_grand_slam.push(parseFloat(stat.most_grand_slam));
    				tennisChartolympic_gold_medals.push(parseFloat(stat.olympic_gold_medals));
    				tennisChartmasters_finals.push(parseFloat(stat.masters_finals));
    			});

    			await delay(500);
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function getpremierStats() {
    		console.log("Fetching stats....");
    		const res = await fetch("/api/v2/premier-league");

    		if (res.ok) {
    			const data = await res.json();
    			premierStats = data;
    			console.log("Estadísticas recibidas: " + premierStats.length);

    			//inicializamos los arrays para mostrar los datos
    			premierStats.forEach(stat => {
    				premier_country_year.push(stat.country + "-" + stat.year);
    				premier_appearences.push(parseFloat(stat.appearences));
    				premier_cleanSheets.push(parseFloat(stat.cleanSheets));
    				premier_goals.push(parseFloat(stat.goals));
    			});

    			await delay(500);
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function getnbaStats() {
    		console.log("Fetching stats....");
    		const res = await fetch("/api/v2/nba-stats");

    		if (res.ok) {
    			const data = await res.json();
    			nbaStats = data;
    			console.log("Estadísticas recibidas: " + nbaStats.length);

    			//inicializamos los arrays para mostrar los datos
    			nbaStats.forEach(stat => {
    				nba_country_year.push(stat.country + "-" + stat.year);
    				nba_mostpoints.push(parseFloat(stat.mostpoints));
    				nba_fieldgoals.push(parseFloat(stat.fieldgoals));
    				nba_efficiency.push(parseFloat(stat.efficiency));
    			});

    			await delay(500);
    		} else {
    			console.log("Error cargando los datos");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart('container', {
    			chart: { type: 'line' },
    			title: { text: 'Grafica conjunta grupo 23' },
    			yAxis: { title: { text: 'Valor' } },
    			xAxis: {
    				title: { text: "Year" },
    				categories: tennisChartCountryYear
    			},
    			/*
    xAxis: {
        title: {
            text: "Country-Year",
        },
        categories: premier_country_year,
    },
    */
    			legend: {
    				layout: 'vertical',
    				align: 'right',
    				verticalAlign: 'middle'
    			},
    			series: [
    				{
    					name: 'most_grandslams',
    					data: tennisChartmost_grand_slam
    				},
    				{
    					name: 'olympic_gold_medals',
    					data: tennisChartolympic_gold_medals
    				},
    				{
    					name: 'masters_finals',
    					data: tennisChartmasters_finals
    				},
    				//premier STATS
    				{
    					name: 'partidos jugados',
    					data: premier_appearences
    				},
    				{
    					name: 'portería vacía',
    					data: premier_cleanSheets
    				},
    				{ name: 'goles', data: premier_goals },
    				//nba-stats
    				{ name: 'mostpoints', data: nba_mostpoints },
    				{ name: 'fieldgoals', data: nba_fieldgoals },
    				{ name: 'efficiency', data: nba_efficiency }
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: 'horizontal',
    								align: 'center',
    								verticalAlign: 'bottom'
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(gettennisData);
    	onMount(getpremierStats);
    	onMount(getnbaStats);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Analytics> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Button,
    		delay,
    		tennisData,
    		tennisChartCountryYear,
    		tennisChartmost_grand_slam,
    		tennisChartmasters_finals,
    		tennisChartolympic_gold_medals,
    		premierStats,
    		premier_country_year,
    		premier_appearences,
    		premier_cleanSheets,
    		premier_goals,
    		nbaStats,
    		nba_country_year,
    		nba_mostpoints,
    		nba_fieldgoals,
    		nba_efficiency,
    		gettennisData,
    		getpremierStats,
    		getnbaStats,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('tennisData' in $$props) tennisData = $$props.tennisData;
    		if ('tennisChartCountryYear' in $$props) tennisChartCountryYear = $$props.tennisChartCountryYear;
    		if ('tennisChartmost_grand_slam' in $$props) tennisChartmost_grand_slam = $$props.tennisChartmost_grand_slam;
    		if ('tennisChartmasters_finals' in $$props) tennisChartmasters_finals = $$props.tennisChartmasters_finals;
    		if ('tennisChartolympic_gold_medals' in $$props) tennisChartolympic_gold_medals = $$props.tennisChartolympic_gold_medals;
    		if ('premierStats' in $$props) premierStats = $$props.premierStats;
    		if ('premier_country_year' in $$props) premier_country_year = $$props.premier_country_year;
    		if ('premier_appearences' in $$props) premier_appearences = $$props.premier_appearences;
    		if ('premier_cleanSheets' in $$props) premier_cleanSheets = $$props.premier_cleanSheets;
    		if ('premier_goals' in $$props) premier_goals = $$props.premier_goals;
    		if ('nbaStats' in $$props) nbaStats = $$props.nbaStats;
    		if ('nba_country_year' in $$props) nba_country_year = $$props.nba_country_year;
    		if ('nba_mostpoints' in $$props) nba_mostpoints = $$props.nba_mostpoints;
    		if ('nba_fieldgoals' in $$props) nba_fieldgoals = $$props.nba_fieldgoals;
    		if ('nba_efficiency' in $$props) nba_efficiency = $$props.nba_efficiency;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class Analytics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Analytics",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\front\About.svelte generated by Svelte v3.47.0 */

    const file$2 = "src\\front\\About.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let div5;
    	let div0;
    	let h1;
    	let t1;
    	let div4;
    	let div1;
    	let h50;
    	let t3;
    	let hr0;
    	let t4;
    	let div2;
    	let h51;
    	let t6;
    	let hr1;
    	let t7;
    	let div3;
    	let h52;
    	let t9;
    	let hr2;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Videos";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Antonio Saborido Campos";
    			t3 = space();
    			hr0 = element("hr");
    			t4 = space();
    			div2 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Alberto Martin Martin";
    			t6 = space();
    			hr1 = element("hr");
    			t7 = space();
    			div3 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Fernando";
    			t9 = space();
    			hr2 = element("hr");
    			add_location(h1, file$2, 3, 12, 76);
    			attr_dev(div0, "id", "titulo");
    			attr_dev(div0, "class", "svelte-1811j4m");
    			add_location(div0, file$2, 2, 8, 45);
    			attr_dev(h50, "id", "titulo");
    			attr_dev(h50, "class", "svelte-1811j4m");
    			add_location(h50, file$2, 7, 16, 185);
    			add_location(hr0, file$2, 8, 16, 247);
    			attr_dev(div1, "class", "col-4");
    			add_location(div1, file$2, 6, 12, 148);
    			attr_dev(h51, "id", "titulo");
    			attr_dev(h51, "class", "svelte-1811j4m");
    			add_location(h51, file$2, 14, 16, 374);
    			add_location(hr1, file$2, 15, 16, 434);
    			attr_dev(div2, "class", "col-4");
    			add_location(div2, file$2, 13, 12, 337);
    			attr_dev(h52, "id", "titulo");
    			attr_dev(h52, "class", "svelte-1811j4m");
    			add_location(h52, file$2, 18, 16, 511);
    			add_location(hr2, file$2, 19, 16, 558);
    			attr_dev(div3, "class", "col-4");
    			add_location(div3, file$2, 17, 12, 474);
    			attr_dev(div4, "class", "row");
    			add_location(div4, file$2, 5, 8, 117);
    			attr_dev(div5, "class", "container svelte-1811j4m");
    			add_location(div5, file$2, 1, 4, 12);
    			add_location(main, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div0);
    			append_dev(div0, h1);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, h50);
    			append_dev(div1, t3);
    			append_dev(div1, hr0);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div2, h51);
    			append_dev(div2, t6);
    			append_dev(div2, hr1);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, h52);
    			append_dev(div3, t9);
    			append_dev(div3, hr2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\front\Integrations.svelte generated by Svelte v3.47.0 */

    const file$1 = "src\\front\\Integrations.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div5;
    	let div0;
    	let h1;
    	let t1;
    	let div4;
    	let div1;
    	let h50;
    	let t3;
    	let hr0;
    	let t4;
    	let h60;
    	let t6;
    	let ul0;
    	let a0;
    	let li0;
    	let t8;
    	let a1;
    	let li1;
    	let t10;
    	let a2;
    	let li2;
    	let t12;
    	let h61;
    	let t14;
    	let ul1;
    	let a3;
    	let li3;
    	let t16;
    	let a4;
    	let li4;
    	let t18;
    	let a5;
    	let li5;
    	let t20;
    	let h62;
    	let t22;
    	let ul2;
    	let a6;
    	let li6;
    	let t24;
    	let a7;
    	let li7;
    	let t26;
    	let a8;
    	let li8;
    	let t28;
    	let h63;
    	let t30;
    	let ul3;
    	let a9;
    	let li9;
    	let t32;
    	let a10;
    	let li10;
    	let t34;
    	let a11;
    	let li11;
    	let t36;
    	let div2;
    	let h51;
    	let t38;
    	let hr1;
    	let t39;
    	let h64;
    	let t41;
    	let ul4;
    	let a12;
    	let li12;
    	let t43;
    	let a13;
    	let li13;
    	let t45;
    	let a14;
    	let li14;
    	let t47;
    	let h65;
    	let t49;
    	let ul5;
    	let a15;
    	let li15;
    	let t51;
    	let a16;
    	let li16;
    	let t53;
    	let a17;
    	let li17;
    	let t55;
    	let div3;
    	let h52;
    	let t57;
    	let hr2;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Integraciones";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Antonio Saborido Campos";
    			t3 = space();
    			hr0 = element("hr");
    			t4 = space();
    			h60 = element("h6");
    			h60.textContent = "Integración Externa 1 (Twitch API)";
    			t6 = space();
    			ul0 = element("ul");
    			a0 = element("a");
    			li0 = element("li");
    			li0.textContent = "Archivo JSON";
    			t8 = space();
    			a1 = element("a");
    			li1 = element("li");
    			li1.textContent = "Vista tabla con reproductor";
    			t10 = space();
    			a2 = element("a");
    			li2 = element("li");
    			li2.textContent = "Grafica visitas";
    			t12 = space();
    			h61 = element("h6");
    			h61.textContent = "Integración Externa 2 (Ultimate Tennis)";
    			t14 = space();
    			ul1 = element("ul");
    			a3 = element("a");
    			li3 = element("li");
    			li3.textContent = "Archivo JSON";
    			t16 = space();
    			a4 = element("a");
    			li4 = element("li");
    			li4.textContent = "Vista en tabla";
    			t18 = space();
    			a5 = element("a");
    			li5 = element("li");
    			li5.textContent = "Grafica visitas";
    			t20 = space();
    			h62 = element("h6");
    			h62.textContent = "Integración Externa 3 (SOS2122-27: public-expenditure-stats)";
    			t22 = space();
    			ul2 = element("ul");
    			a6 = element("a");
    			li6 = element("li");
    			li6.textContent = "Archivo JSON";
    			t24 = space();
    			a7 = element("a");
    			li7 = element("li");
    			li7.textContent = "Vista en tabla";
    			t26 = space();
    			a8 = element("a");
    			li8 = element("li");
    			li8.textContent = "Gráfica";
    			t28 = space();
    			h63 = element("h6");
    			h63.textContent = "Integración Externa 4 (SOS2122-22: coal-stats)";
    			t30 = space();
    			ul3 = element("ul");
    			a9 = element("a");
    			li9 = element("li");
    			li9.textContent = "Archivo JSON";
    			t32 = space();
    			a10 = element("a");
    			li10 = element("li");
    			li10.textContent = "Vista en tabla";
    			t34 = space();
    			a11 = element("a");
    			li11 = element("li");
    			li11.textContent = "Gráfica";
    			t36 = space();
    			div2 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Alberto Martin Martin";
    			t38 = space();
    			hr1 = element("hr");
    			t39 = space();
    			h64 = element("h6");
    			h64.textContent = "Integración Externa 1 (SOS2122-21: productions-vehicles)";
    			t41 = space();
    			ul4 = element("ul");
    			a12 = element("a");
    			li12 = element("li");
    			li12.textContent = "Archivo JSON";
    			t43 = space();
    			a13 = element("a");
    			li13 = element("li");
    			li13.textContent = "Vista en tabla";
    			t45 = space();
    			a14 = element("a");
    			li14 = element("li");
    			li14.textContent = "Grafica";
    			t47 = space();
    			h65 = element("h6");
    			h65.textContent = "Integración Externa 2 (SOS2122-26: defense-spent-stats)";
    			t49 = space();
    			ul5 = element("ul");
    			a15 = element("a");
    			li15 = element("li");
    			li15.textContent = "Archivo JSON";
    			t51 = space();
    			a16 = element("a");
    			li16 = element("li");
    			li16.textContent = "Vista en tabla";
    			t53 = space();
    			a17 = element("a");
    			li17 = element("li");
    			li17.textContent = "Grafica";
    			t55 = space();
    			div3 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Fernando";
    			t57 = space();
    			hr2 = element("hr");
    			add_location(h1, file$1, 3, 12, 76);
    			attr_dev(div0, "id", "titulo");
    			attr_dev(div0, "class", "svelte-1811j4m");
    			add_location(div0, file$1, 2, 8, 45);
    			attr_dev(h50, "id", "titulo");
    			attr_dev(h50, "class", "svelte-1811j4m");
    			add_location(h50, file$1, 7, 16, 192);
    			add_location(hr0, file$1, 8, 16, 254);
    			add_location(h60, file$1, 9, 16, 278);
    			attr_dev(li0, "type", "circle");
    			add_location(li0, file$1, 11, 56, 405);
    			attr_dev(a0, "href", "/api/v1/tennis-twitch");
    			add_location(a0, file$1, 11, 24, 373);
    			attr_dev(li1, "type", "circle");
    			add_location(li1, file$1, 12, 51, 498);
    			attr_dev(a1, "href", "/#/tennis/twitch");
    			add_location(a1, file$1, 12, 24, 471);
    			attr_dev(li2, "type", "circle");
    			add_location(li2, file$1, 13, 56, 611);
    			attr_dev(a2, "href", "/#/tennis/twitchchart");
    			add_location(a2, file$1, 13, 24, 579);
    			add_location(ul0, file$1, 10, 20, 343);
    			add_location(h61, file$1, 15, 16, 699);
    			attr_dev(li3, "type", "circle");
    			add_location(li3, file$1, 17, 56, 831);
    			attr_dev(a3, "href", "/api/v1/tennis-apiext");
    			add_location(a3, file$1, 17, 24, 799);
    			attr_dev(li4, "type", "circle");
    			add_location(li4, file$1, 18, 58, 931);
    			attr_dev(a4, "href", "/#/tennis/apitennislist");
    			add_location(a4, file$1, 18, 24, 897);
    			attr_dev(li5, "type", "circle");
    			add_location(li5, file$1, 19, 59, 1034);
    			attr_dev(a5, "href", "/#/tennis/apitennischart");
    			add_location(a5, file$1, 19, 24, 999);
    			add_location(ul1, file$1, 16, 20, 769);
    			add_location(h62, file$1, 21, 16, 1122);
    			attr_dev(li6, "type", "circle");
    			add_location(li6, file$1, 25, 50, 1309);
    			attr_dev(a6, "href", "/api/v1/apiext3");
    			add_location(a6, file$1, 25, 24, 1283);
    			attr_dev(li7, "type", "circle");
    			add_location(li7, file$1, 26, 56, 1407);
    			attr_dev(a7, "href", "/#/tennis/apiext3list");
    			add_location(a7, file$1, 26, 24, 1375);
    			attr_dev(li8, "type", "circle");
    			add_location(li8, file$1, 27, 57, 1508);
    			attr_dev(a8, "href", "/#/tennis/apiext3chart");
    			add_location(a8, file$1, 27, 24, 1475);
    			add_location(ul2, file$1, 24, 20, 1253);
    			add_location(h63, file$1, 29, 16, 1589);
    			attr_dev(li9, "type", "circle");
    			add_location(li9, file$1, 31, 50, 1722);
    			attr_dev(a9, "href", "/api/v1/apiext4");
    			add_location(a9, file$1, 31, 24, 1696);
    			attr_dev(li10, "type", "circle");
    			add_location(li10, file$1, 32, 56, 1820);
    			attr_dev(a10, "href", "/#/tennis/apiext4list");
    			add_location(a10, file$1, 32, 24, 1788);
    			attr_dev(li11, "type", "circle");
    			add_location(li11, file$1, 33, 57, 1921);
    			attr_dev(a11, "href", "/#/tennis/apiext4chart");
    			add_location(a11, file$1, 33, 24, 1888);
    			add_location(ul3, file$1, 30, 20, 1666);
    			attr_dev(div1, "class", "col-4");
    			add_location(div1, file$1, 6, 12, 155);
    			attr_dev(h51, "id", "titulo");
    			attr_dev(h51, "class", "svelte-1811j4m");
    			add_location(h51, file$1, 38, 16, 2069);
    			add_location(hr1, file$1, 39, 16, 2129);
    			add_location(h64, file$1, 40, 16, 2153);
    			attr_dev(li12, "type", "circle");
    			add_location(li12, file$1, 42, 50, 2296);
    			attr_dev(a12, "href", "/api/v1/apiext1");
    			add_location(a12, file$1, 42, 24, 2270);
    			attr_dev(li13, "type", "circle");
    			add_location(li13, file$1, 43, 64, 2402);
    			attr_dev(a13, "href", "/#/premier-league/apiext1list");
    			add_location(a13, file$1, 43, 24, 2362);
    			attr_dev(li14, "type", "circle");
    			add_location(li14, file$1, 44, 65, 2511);
    			attr_dev(a14, "href", "/#/premier-league/apiext1chart");
    			add_location(a14, file$1, 44, 24, 2470);
    			add_location(ul4, file$1, 41, 20, 2240);
    			add_location(h65, file$1, 46, 16, 2591);
    			attr_dev(li15, "type", "circle");
    			add_location(li15, file$1, 48, 50, 2733);
    			attr_dev(a15, "href", "/api/v1/apiext2");
    			add_location(a15, file$1, 48, 24, 2707);
    			attr_dev(li16, "type", "circle");
    			add_location(li16, file$1, 49, 64, 2839);
    			attr_dev(a16, "href", "/#/premier-league/apiext2list");
    			add_location(a16, file$1, 49, 24, 2799);
    			attr_dev(li17, "type", "circle");
    			add_location(li17, file$1, 50, 65, 2948);
    			attr_dev(a17, "href", "/#/premier-league/apiext2chart");
    			add_location(a17, file$1, 50, 24, 2907);
    			add_location(ul5, file$1, 47, 20, 2677);
    			attr_dev(div2, "class", "col-4");
    			add_location(div2, file$1, 37, 12, 2032);
    			attr_dev(h52, "id", "titulo");
    			attr_dev(h52, "class", "svelte-1811j4m");
    			add_location(h52, file$1, 54, 16, 3081);
    			add_location(hr2, file$1, 55, 16, 3128);
    			attr_dev(div3, "class", "col-4");
    			add_location(div3, file$1, 53, 12, 3044);
    			attr_dev(div4, "class", "row");
    			add_location(div4, file$1, 5, 8, 124);
    			attr_dev(div5, "class", "container svelte-1811j4m");
    			add_location(div5, file$1, 1, 4, 12);
    			add_location(main, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div0);
    			append_dev(div0, h1);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, h50);
    			append_dev(div1, t3);
    			append_dev(div1, hr0);
    			append_dev(div1, t4);
    			append_dev(div1, h60);
    			append_dev(div1, t6);
    			append_dev(div1, ul0);
    			append_dev(ul0, a0);
    			append_dev(a0, li0);
    			append_dev(ul0, t8);
    			append_dev(ul0, a1);
    			append_dev(a1, li1);
    			append_dev(ul0, t10);
    			append_dev(ul0, a2);
    			append_dev(a2, li2);
    			append_dev(div1, t12);
    			append_dev(div1, h61);
    			append_dev(div1, t14);
    			append_dev(div1, ul1);
    			append_dev(ul1, a3);
    			append_dev(a3, li3);
    			append_dev(ul1, t16);
    			append_dev(ul1, a4);
    			append_dev(a4, li4);
    			append_dev(ul1, t18);
    			append_dev(ul1, a5);
    			append_dev(a5, li5);
    			append_dev(div1, t20);
    			append_dev(div1, h62);
    			append_dev(div1, t22);
    			append_dev(div1, ul2);
    			append_dev(ul2, a6);
    			append_dev(a6, li6);
    			append_dev(ul2, t24);
    			append_dev(ul2, a7);
    			append_dev(a7, li7);
    			append_dev(ul2, t26);
    			append_dev(ul2, a8);
    			append_dev(a8, li8);
    			append_dev(div1, t28);
    			append_dev(div1, h63);
    			append_dev(div1, t30);
    			append_dev(div1, ul3);
    			append_dev(ul3, a9);
    			append_dev(a9, li9);
    			append_dev(ul3, t32);
    			append_dev(ul3, a10);
    			append_dev(a10, li10);
    			append_dev(ul3, t34);
    			append_dev(ul3, a11);
    			append_dev(a11, li11);
    			append_dev(div4, t36);
    			append_dev(div4, div2);
    			append_dev(div2, h51);
    			append_dev(div2, t38);
    			append_dev(div2, hr1);
    			append_dev(div2, t39);
    			append_dev(div2, h64);
    			append_dev(div2, t41);
    			append_dev(div2, ul4);
    			append_dev(ul4, a12);
    			append_dev(a12, li12);
    			append_dev(ul4, t43);
    			append_dev(ul4, a13);
    			append_dev(a13, li13);
    			append_dev(ul4, t45);
    			append_dev(ul4, a14);
    			append_dev(a14, li14);
    			append_dev(div2, t47);
    			append_dev(div2, h65);
    			append_dev(div2, t49);
    			append_dev(div2, ul5);
    			append_dev(ul5, a15);
    			append_dev(a15, li15);
    			append_dev(ul5, t51);
    			append_dev(ul5, a16);
    			append_dev(a16, li16);
    			append_dev(ul5, t53);
    			append_dev(ul5, a17);
    			append_dev(a17, li17);
    			append_dev(div4, t55);
    			append_dev(div4, div3);
    			append_dev(div3, h52);
    			append_dev(div3, t57);
    			append_dev(div3, hr2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Integrations', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Integrations> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Integrations extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Integrations",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\front\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\front\\App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let router;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(router.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			add_location(main, file, 82, 0, 2674);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const routes = {
    		"/": Home,
    		"/groupgraph": GroupGraph,
    		"/info": Info,
    		"/about": About,
    		"/analytics": Analytics,
    		"/integrations": Integrations,
    		"/tennis": List,
    		"/tennis/:country/:year": Edit,
    		"/tennis/chart": Chart_1,
    		"/tennis/chart2": Chart2,
    		"/tennis/twitch": Twitch,
    		"/tennis/twitchchart": Twitchchart,
    		"/tennis/apitennislist": Apitennislist,
    		"/tennis/apitennischart": Apitennislistchart,
    		"/tennis/apiext3list": Apiext3list,
    		"/tennis/apiext3chart": Apiext3chart,
    		"/tennis/apiext4list": Apiext4list,
    		"/tennis/apiext4chart": Apiext4chart,
    		"/premier-league": Premier,
    		"/premier-league/:country/:year": PremierEdit,
    		"/premier-league/charts": PremierCharts,
    		"/premier-league/apiext1list": Apiext1list,
    		"/premier-league/apiext1chart": Apiext1chart,
    		"/premier-league/apiext2list": Apiext2list,
    		"/premier-league/apiext2chart": Apiext2chart,
    		"/nba-stats": NbaList,
    		"/nba-stats/:country/:year": NbaEdit
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Home,
    		List,
    		Edit,
    		Chart: Chart_1,
    		Chart2,
    		Twitch,
    		TwitchChart: Twitchchart,
    		ApitennisList: Apitennislist,
    		ApitennisChart: Apitennislistchart,
    		apiext3list: Apiext3list,
    		apiext3chart: Apiext3chart,
    		apiext4list: Apiext4list,
    		apiext4chart: Apiext4chart,
    		Info,
    		Footer,
    		Header,
    		GroupGraph,
    		Premier,
    		PremierEdit,
    		PremierChart: PremierCharts,
    		apiext1list: Apiext1list,
    		apiext1chart: Apiext1chart,
    		apiext2list: Apiext2list,
    		apiext2chart: Apiext2chart,
    		NbaList,
    		NbaEdit,
    		Analytics,
    		About,
    		Integrations,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Grupo 23'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
