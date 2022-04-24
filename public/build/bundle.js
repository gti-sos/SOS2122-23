
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

    const { Error: Error_1, Object: Object_1, console: console_1$4 } = globals;

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
    function create_if_block$8(ctx) {
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$4];
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
    		id: create_fragment$g.name,
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

    function instance$g($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Router> was created with unknown prop '${key}'`);
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

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$g.name
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

    const file$f = "src\\front\\Home.svelte";

    function create_fragment$f(ctx) {
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
    	let t7;
    	let p1;
    	let t8;
    	let a1;
    	let t10;
    	let p2;
    	let t11;
    	let a2;
    	let t13;
    	let h22;
    	let t15;
    	let h23;
    	let a3;
    	let t18;
    	let h24;
    	let a4;
    	let t21;
    	let h25;
    	let t23;
    	let li0;
    	let a5;
    	let t25;
    	let li1;
    	let a6;
    	let t27;
    	let li2;
    	let a7;
    	let t29;

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
    			p0.textContent = "- [Alberto Martín Martín](https://github.com/albmarmar6)";
    			t7 = space();
    			p1 = element("p");
    			t8 = text("- ");
    			a1 = element("a");
    			a1.textContent = "Fernando Pardo Beltrán";
    			t10 = space();
    			p2 = element("p");
    			t11 = text("- ");
    			a2 = element("a");
    			a2.textContent = "[Antonio Saborido Campos]";
    			t13 = space();
    			h22 = element("h2");
    			h22.textContent = "Project description:";
    			t15 = text(" Relación de deportes entre fútbol (Premier League), tenis y baloncesto (NBA)\r\n        ");
    			h23 = element("h2");
    			h23.textContent = "Repository:";
    			a3 = element("a");
    			a3.textContent = "gti-sos/SOS2122-23";
    			t18 = space();
    			h24 = element("h2");
    			h24.textContent = "URL:";
    			a4 = element("a");
    			a4.textContent = "http://sos2122-23.herokuapp.com";
    			t21 = space();
    			h25 = element("h2");
    			h25.textContent = "APIS:";
    			t23 = space();
    			li0 = element("li");
    			a5 = element("a");
    			a5.textContent = "https://sos2122-23.herokuapp.com/api/v1/premier-league-stats (developed by Alberto Martin Martin)(https://github.com/albmarmar6)";
    			t25 = space();
    			li1 = element("li");
    			a6 = element("a");
    			a6.textContent = "https://sos2122-23.herokuapp.com/api/v1/nba-stats (developed by Fernando Pardo Beltrán)";
    			t27 = space();
    			li2 = element("li");
    			a7 = element("a");
    			a7.textContent = "https://sos2122-23.herokuapp.com/api/v1/tennis/docs";
    			t29 = text(" (developed by Antonio Saborido Campos)");
    			add_location(h1, file$f, 3, 12, 76);
    			attr_dev(div0, "id", "titulo");
    			attr_dev(div0, "class", "svelte-d1sqie");
    			add_location(div0, file$f, 2, 8, 45);
    			attr_dev(a0, "href", "/#/info");
    			add_location(a0, file$f, 5, 12, 125);
    			add_location(h20, file$f, 5, 8, 121);
    			add_location(h21, file$f, 7, 8, 180);
    			add_location(p0, file$f, 8, 8, 203);
    			attr_dev(a1, "href", "https://github.com/Nando13-hub");
    			add_location(a1, file$f, 9, 13, 281);
    			add_location(p1, file$f, 9, 8, 276);
    			attr_dev(a2, "href", "https://github.com/Antoniiosc7");
    			add_location(a2, file$f, 10, 13, 367);
    			add_location(p2, file$f, 10, 8, 362);
    			add_location(h22, file$f, 11, 8, 451);
    			add_location(h23, file$f, 12, 8, 567);
    			attr_dev(a3, "href", "https://github.com/gti-sos/SOS2122-23");
    			add_location(a3, file$f, 12, 28, 587);
    			add_location(h24, file$f, 13, 8, 667);
    			attr_dev(a4, "href", "http://sos2122-23.herokuapp.com");
    			add_location(a4, file$f, 13, 21, 680);
    			add_location(h25, file$f, 14, 8, 768);
    			attr_dev(a5, "href", "https://sos2122-23.herokuapp.com/api/v1/premier-league");
    			add_location(a5, file$f, 15, 12, 796);
    			add_location(li0, file$f, 15, 8, 792);
    			attr_dev(a6, "href", "https://sos2122-23.herokuapp.com/api/v1/nba-stats");
    			add_location(a6, file$f, 16, 12, 1012);
    			add_location(li1, file$f, 16, 8, 1008);
    			attr_dev(a7, "href", "https://sos2122-23.herokuapp.com/api/v1/tennis/docs");
    			add_location(a7, file$f, 18, 12, 1192);
    			add_location(li2, file$f, 18, 8, 1188);
    			attr_dev(div1, "class", "container svelte-d1sqie");
    			add_location(div1, file$f, 1, 4, 12);
    			add_location(main, file$f, 0, 0, 0);
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
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(p1, t8);
    			append_dev(p1, a1);
    			append_dev(div1, t10);
    			append_dev(div1, p2);
    			append_dev(p2, t11);
    			append_dev(p2, a2);
    			append_dev(div1, t13);
    			append_dev(div1, h22);
    			append_dev(div1, t15);
    			append_dev(div1, h23);
    			append_dev(div1, a3);
    			append_dev(div1, t18);
    			append_dev(div1, h24);
    			append_dev(div1, a4);
    			append_dev(div1, t21);
    			append_dev(div1, h25);
    			append_dev(div1, t23);
    			append_dev(div1, li0);
    			append_dev(li0, a5);
    			append_dev(div1, t25);
    			append_dev(div1, li1);
    			append_dev(li1, a6);
    			append_dev(div1, t27);
    			append_dev(div1, li2);
    			append_dev(li2, a7);
    			append_dev(li2, t29);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$f.name
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
    const file$e = "node_modules\\sveltestrap\\src\\Colgroup.svelte";

    function create_fragment$e(ctx) {
    	let colgroup;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			colgroup = element("colgroup");
    			if (default_slot) default_slot.c();
    			add_location(colgroup, file$e, 6, 0, 92);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Colgroup",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\ResponsiveContainer.svelte generated by Svelte v3.47.0 */
    const file$d = "node_modules\\sveltestrap\\src\\ResponsiveContainer.svelte";

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
    function create_if_block$7(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[1]);
    			add_location(div, file$d, 13, 2, 305);
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(13:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$3];
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { responsive: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResponsiveContainer",
    			options,
    			id: create_fragment$d.name
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
    const file$c = "node_modules\\sveltestrap\\src\\TableFooter.svelte";

    function create_fragment$c(ctx) {
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
    			add_location(tr, file$c, 7, 2, 117);
    			set_attributes(tfoot, tfoot_data);
    			add_location(tfoot, file$c, 6, 0, 90);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableFooter",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\TableHeader.svelte generated by Svelte v3.47.0 */
    const file$b = "node_modules\\sveltestrap\\src\\TableHeader.svelte";

    function create_fragment$b(ctx) {
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
    			add_location(tr, file$b, 7, 2, 117);
    			set_attributes(thead, thead_data);
    			add_location(thead, file$b, 6, 0, 90);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHeader",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.47.0 */
    const file$a = "node_modules\\sveltestrap\\src\\Table.svelte";

    function get_each_context$2(ctx, list, i) {
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
    function create_if_block$6(ctx) {
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
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tableheader = new TableHeader({
    			props: {
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*rows*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	tablefooter = new TableFooter({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
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
    			add_location(tbody, file$a, 39, 6, 1057);
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
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(33:4) {#if rows}",
    		ctx
    	});

    	return block;
    }

    // (34:6) <Colgroup>
    function create_default_slot_3$4(ctx) {
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
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(34:6) <Colgroup>",
    		ctx
    	});

    	return block;
    }

    // (37:6) <TableHeader>
    function create_default_slot_2$4(ctx) {
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
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(37:6) <TableHeader>",
    		ctx
    	});

    	return block;
    }

    // (41:8) {#each rows as row}
    function create_each_block$2(ctx) {
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
    			add_location(tr, file$a, 41, 10, 1103);
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(41:8) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    // (47:6) <TableFooter>
    function create_default_slot_1$4(ctx) {
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
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(47:6) <TableFooter>",
    		ctx
    	});

    	return block;
    }

    // (31:0) <ResponsiveContainer {responsive}>
    function create_default_slot$4(ctx) {
    	let table;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
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
    			add_location(table, file$a, 31, 2, 885);
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
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(31:0) <ResponsiveContainer {responsive}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let responsivecontainer;
    	let current;

    	responsivecontainer = new ResponsiveContainer({
    			props: {
    				responsive: /*responsive*/ ctx[0],
    				$$slots: { default: [create_default_slot$4] },
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
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
    			id: create_fragment$a.name
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
    const file$9 = "node_modules\\sveltestrap\\src\\Button.svelte";

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
    			add_location(button, file$9, 54, 2, 1124);
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
    function create_if_block$5(ctx) {
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
    			add_location(a, file$9, 37, 2, 866);
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
    		id: create_if_block$5.name,
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

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block_1];
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$9($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
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
    			id: create_fragment$9.name
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
    const file$8 = "node_modules\\sveltestrap\\src\\Alert.svelte";
    const get_heading_slot_changes = dirty => ({});
    const get_heading_slot_context = ctx => ({});

    // (26:0) {#if isOpen}
    function create_if_block$4(ctx) {
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
    			add_location(div, file$8, 26, 2, 808);
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
    		id: create_if_block$4.name,
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
    			add_location(h4, file$8, 33, 6, 961);
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
    			add_location(button, file$8, 38, 6, 1077);
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

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$4(ctx);

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
    					if_block = create_if_block$4(ctx);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
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
    			id: create_fragment$8.name
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

    const { console: console_1$3 } = globals;
    const file$7 = "src\\front\\tennis\\list.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	return child_ctx;
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

    // (212:1) {:then entries}
    function create_then_block$2(ctx) {
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
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = Array(/*maxPages*/ ctx[7] + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
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
    			add_location(div, file$7, 310, 4, 9906);
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

    			if (dirty[0] & /*checkMSG*/ 2 | dirty[1] & /*$$scope*/ 64) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*from, to, checkMSG*/ 50 | dirty[1] & /*$$scope*/ 64) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*entries, newEntry*/ 257 | dirty[1] & /*$$scope*/ 64) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);

    			if (dirty[0] & /*offset, getEntries, maxPages*/ 704) {
    				each_value = Array(/*maxPages*/ ctx[7] + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(212:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (215:2) {#if checkMSG}
    function create_if_block$3(ctx) {
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(215:2) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (214:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_10$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[1] && create_if_block$3(ctx);

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
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(214:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (230:23) <Button outline color="dark" on:click="{()=>{       if (from == null || to == null) {        window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')       }else{                          checkMSG = "Datos cargados correctamente en ese periodo";        getEntries();       }      }}">
    function create_default_slot_9$1(ctx) {
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
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(230:23) <Button outline color=\\\"dark\\\" on:click=\\\"{()=>{       if (from == null || to == null) {        window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')       }else{                          checkMSG = \\\"Datos cargados correctamente en ese periodo\\\";        getEntries();       }      }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (241:23) <Button outline color="info" on:click="{()=>{       from = null;       to = null;       getEntries();                      checkMSG = "Busqueda limpiada";             }}">
    function create_default_slot_8$1(ctx) {
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
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(241:23) <Button outline color=\\\"info\\\" on:click=\\\"{()=>{       from = null;       to = null;       getEntries();                      checkMSG = \\\"Busqueda limpiada\\\";             }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (219:4) <Table bordered>
    function create_default_slot_7$1(ctx) {
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
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[18]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_8$1] },
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
    			add_location(th0, file$7, 221, 4, 7432);
    			add_location(th1, file$7, 222, 4, 7459);
    			add_location(tr0, file$7, 220, 3, 7422);
    			add_location(thead, file$7, 219, 2, 7410);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "2000");
    			add_location(input0, file$7, 227, 8, 7529);
    			add_location(td0, file$7, 227, 4, 7525);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "2000");
    			add_location(input1, file$7, 228, 8, 7596);
    			add_location(td1, file$7, 228, 4, 7592);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$7, 229, 4, 7657);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$7, 240, 4, 8024);
    			add_location(tr1, file$7, 226, 3, 7515);
    			add_location(tbody, file$7, 225, 2, 7503);
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

    			if (dirty[1] & /*$$scope*/ 64) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
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
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(219:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (278:8) <Button outline color="primary" on:click="{insertEntry}">
    function create_default_slot_6$1(ctx) {
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
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(278:8) <Button outline color=\\\"primary\\\" on:click=\\\"{insertEntry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (290:9) <Button outline color="warning" on:click={function (){        window.location.href = `/#/tennis/${entry.country}/${entry.year}`       }}>
    function create_default_slot_5$1(ctx) {
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
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(290:9) <Button outline color=\\\"warning\\\" on:click={function (){        window.location.href = `/#/tennis/${entry.country}/${entry.year}`       }}>",
    		ctx
    	});

    	return block;
    }

    // (295:9) <Button outline color="danger" on:click={BorrarEntry(entry.country,entry.year)}>
    function create_default_slot_4$1(ctx) {
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
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(295:9) <Button outline color=\\\"danger\\\" on:click={BorrarEntry(entry.country,entry.year)}>",
    		ctx
    	});

    	return block;
    }

    // (283:3) {#each entries as entry}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[34].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[34].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[34].most_grand_slam + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[34].masters_finals + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[34].olympic_gold_medals + "";
    	let t8;
    	let t9;
    	let td5;
    	let button0;
    	let t10;
    	let td6;
    	let button1;
    	let current;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[25](/*entry*/ ctx[34]);
    	}

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", click_handler_2);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*BorrarEntry*/ ctx[12](/*entry*/ ctx[34].country, /*entry*/ ctx[34].year))) /*BorrarEntry*/ ctx[12](/*entry*/ ctx[34].country, /*entry*/ ctx[34].year).apply(this, arguments);
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
    			add_location(td0, file$7, 284, 5, 9114);
    			add_location(td1, file$7, 285, 5, 9145);
    			add_location(td2, file$7, 286, 5, 9173);
    			add_location(td3, file$7, 287, 20, 9227);
    			add_location(td4, file$7, 288, 20, 9280);
    			add_location(td5, file$7, 289, 5, 9323);
    			add_location(td6, file$7, 294, 5, 9501);
    			add_location(tr, file$7, 283, 4, 9103);
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
    			if ((!current || dirty[0] & /*entries*/ 256) && t0_value !== (t0_value = /*entry*/ ctx[34].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t2_value !== (t2_value = /*entry*/ ctx[34].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t4_value !== (t4_value = /*entry*/ ctx[34].most_grand_slam + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t6_value !== (t6_value = /*entry*/ ctx[34].masters_finals + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*entries*/ 256) && t8_value !== (t8_value = /*entry*/ ctx[34].olympic_gold_medals + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
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
    		source: "(283:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (302:8) <Button outline color="success" on:click={LoadEntries}>
    function create_default_slot_3$3(ctx) {
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
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(302:8) <Button outline color=\\\"success\\\" on:click={LoadEntries}>",
    		ctx
    	});

    	return block;
    }

    // (305:8) <Button outline color="danger" on:click={BorrarEntries}>
    function create_default_slot_2$3(ctx) {
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
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(305:8) <Button outline color=\\\"danger\\\" on:click={BorrarEntries}>",
    		ctx
    	});

    	return block;
    }

    // (256:1) <Table bordered>
    function create_default_slot_1$3(ctx) {
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
    				$$slots: { default: [create_default_slot_6$1] },
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
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*LoadEntries*/ ctx[10]);

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_2$3] },
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
    			add_location(th0, file$7, 261, 4, 8415);
    			add_location(th1, file$7, 262, 4, 8434);
    			add_location(th2, file$7, 263, 4, 8452);
    			add_location(th3, file$7, 264, 4, 8486);
    			add_location(th4, file$7, 265, 16, 8533);
    			add_location(th5, file$7, 266, 4, 8566);
    			add_location(th6, file$7, 267, 4, 8581);
    			add_location(tr0, file$7, 259, 3, 8399);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$7, 258, 2, 8372);
    			add_location(input0, file$7, 272, 8, 8643);
    			add_location(td0, file$7, 272, 4, 8639);
    			add_location(input1, file$7, 273, 8, 8697);
    			add_location(td1, file$7, 273, 4, 8693);
    			add_location(input2, file$7, 274, 8, 8748);
    			add_location(td2, file$7, 274, 4, 8744);
    			add_location(input3, file$7, 275, 20, 8822);
    			add_location(td3, file$7, 275, 16, 8818);
    			add_location(input4, file$7, 276, 20, 8895);
    			add_location(td4, file$7, 276, 16, 8891);
    			add_location(td5, file$7, 277, 4, 8957);
    			add_location(tr1, file$7, 271, 3, 8629);
    			add_location(td6, file$7, 301, 4, 9665);
    			add_location(td7, file$7, 304, 4, 9769);
    			add_location(tr2, file$7, 300, 3, 9655);
    			add_location(tbody, file$7, 270, 2, 8617);
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
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[20]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[21]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[22]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[23]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[24])
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

    			if (dirty[1] & /*$$scope*/ 64) {
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

    			if (dirty[1] & /*$$scope*/ 64) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
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
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(256:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (314:3) <Button outline color="secondary" on:click={()=>{      offset = page;      getEntries();     }}>
    function create_default_slot$3(ctx) {
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
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(314:3) <Button outline color=\\\"secondary\\\" on:click={()=>{      offset = page;      getEntries();     }}>",
    		ctx
    	});

    	return block;
    }

    // (312:2) {#each Array(maxPages+1) as _,page}
    function create_each_block$1(ctx) {
    	let button;
    	let t;
    	let current;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[26](/*page*/ ctx[14]);
    	}

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$3] },
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

    			if (dirty[1] & /*$$scope*/ 64) {
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(312:2) {#each Array(maxPages+1) as _,page}",
    		ctx
    	});

    	return block;
    }

    // (210:17)     loading   {:then entries}
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
    		source: "(210:17)     loading   {:then entries}",
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
    	let p;
    	let t3;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
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
    			h1.textContent = "TENNIS API";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Los últimos campeones de los grandes torneos del tenis internacional.";
    			t3 = space();
    			info.block.c();
    			add_location(h1, file$7, 201, 4, 6994);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$7, 200, 2, 6957);
    			add_location(p, file$7, 203, 2, 7034);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$7, 199, 1, 6925);
    			add_location(main, file$7, 198, 0, 6916);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<List> was created with unknown prop '${key}'`);
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

    	const click_handler_2 = function (entry) {
    		window.location.href = `/#/tennis/${entry.country}/${entry.year}`;
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
    		click_handler_2,
    		click_handler_3
    	];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\front\tennis\edit.svelte generated by Svelte v3.47.0 */

    const { console: console_1$2 } = globals;
    const file$6 = "src\\front\\tennis\\edit.svelte";

    // (73:8) {#if errorMsg}
    function create_if_block$2(ctx) {
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(73:8) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (72:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[8] && create_if_block$2(ctx);

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
    		source: "(72:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      export let params = {}
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
    		source: "(1:0) <script>      export let params = {}",
    		ctx
    	});

    	return block;
    }

    // (81:8) {:then entry}
    function create_then_block$1(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$2] },
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
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(81:8) {:then entry}",
    		ctx
    	});

    	return block;
    }

    // (104:24) <Button outline color="primary" on:click="{EditEntry}">
    function create_default_slot_2$2(ctx) {
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
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(104:24) <Button outline color=\\\"primary\\\" on:click=\\\"{EditEntry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (84:8) <Table bordered>
    function create_default_slot_1$2(ctx) {
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
    				$$slots: { default: [create_default_slot_2$2] },
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
    			add_location(th0, file$6, 87, 20, 2953);
    			add_location(th1, file$6, 88, 20, 2988);
    			add_location(th2, file$6, 89, 20, 3022);
    			add_location(th3, file$6, 90, 20, 3072);
    			add_location(th4, file$6, 91, 20, 3123);
    			add_location(th5, file$6, 92, 20, 3172);
    			add_location(th6, file$6, 93, 20, 3203);
    			add_location(tr0, file$6, 85, 16, 2921);
    			add_location(thead, file$6, 84, 12, 2896);
    			add_location(input0, file$6, 98, 24, 3327);
    			add_location(td0, file$6, 98, 20, 3323);
    			add_location(input1, file$6, 99, 24, 3395);
    			add_location(td1, file$6, 99, 20, 3391);
    			add_location(input2, file$6, 100, 24, 3462);
    			add_location(td2, file$6, 100, 20, 3458);
    			add_location(input3, file$6, 101, 24, 3538);
    			add_location(td3, file$6, 101, 20, 3534);
    			add_location(input4, file$6, 102, 24, 3613);
    			add_location(td4, file$6, 102, 20, 3609);
    			add_location(td5, file$6, 103, 20, 3689);
    			add_location(tr1, file$6, 97, 16, 3297);
    			add_location(tbody, file$6, 96, 12, 3272);
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
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(84:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (79:18)       loading          {:then entry}
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
    		source: "(79:18)       loading          {:then entry}",
    		ctx
    	});

    	return block;
    }

    // (113:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$2(ctx) {
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
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(113:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
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
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 9,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entry*/ ctx[9], info);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$2] },
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
    			add_location(h1, file$6, 77, 4, 2726);
    			add_location(main, file$6, 70, 0, 2567);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Edit> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get params() {
    		throw new Error("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\Info.svelte generated by Svelte v3.47.0 */

    const file$5 = "src\\front\\Info.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let br0;
    	let t0;
    	let div4;
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
    	let br1;
    	let t7;
    	let div14;
    	let div7;
    	let div6;
    	let img1;
    	let img1_src_value;
    	let t8;
    	let div5;
    	let h41;
    	let b1;
    	let t10;
    	let p0;
    	let t12;
    	let a1;
    	let button1;
    	let t14;
    	let div10;
    	let div9;
    	let img2;
    	let img2_src_value;
    	let t15;
    	let div8;
    	let h42;
    	let b2;
    	let t17;
    	let p1;
    	let t19;
    	let a2;
    	let button2;
    	let t21;
    	let a3;
    	let button3;
    	let t23;
    	let div13;
    	let div12;
    	let img3;
    	let img3_src_value;
    	let t24;
    	let div11;
    	let h43;
    	let b3;
    	let t26;
    	let p2;
    	let t28;
    	let a4;
    	let button4;
    	let t30;
    	let a5;
    	let button5;
    	let t32;
    	let a6;
    	let button6;
    	let t34;
    	let a7;
    	let button7;
    	let t36;
    	let a8;
    	let button8;
    	let t38;
    	let br2;
    	let t39;
    	let div24;
    	let div17;
    	let div16;
    	let div15;
    	let h44;
    	let b4;
    	let t41;
    	let p3;
    	let t43;
    	let a9;
    	let button9;
    	let t45;
    	let div20;
    	let div19;
    	let div18;
    	let h45;
    	let b5;
    	let t47;
    	let p4;
    	let t49;
    	let a10;
    	let button10;
    	let t51;
    	let div23;
    	let div22;
    	let div21;
    	let h46;
    	let b6;
    	let t53;
    	let p5;
    	let t55;
    	let a11;
    	let button11;

    	const block = {
    		c: function create() {
    			main = element("main");
    			br0 = element("br");
    			t0 = space();
    			div4 = element("div");
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
    			br1 = element("br");
    			t7 = space();
    			div14 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			img1 = element("img");
    			t8 = space();
    			div5 = element("div");
    			h41 = element("h4");
    			b1 = element("b");
    			b1.textContent = "NBA Stats";
    			t10 = space();
    			p0 = element("p");
    			p0.textContent = "Fernando Pardo";
    			t12 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "Link";
    			t14 = space();
    			div10 = element("div");
    			div9 = element("div");
    			img2 = element("img");
    			t15 = space();
    			div8 = element("div");
    			h42 = element("h4");
    			b2 = element("b");
    			b2.textContent = "Premier League";
    			t17 = space();
    			p1 = element("p");
    			p1.textContent = "Alberto Martin Martin";
    			t19 = space();
    			a2 = element("a");
    			button2 = element("button");
    			button2.textContent = "Api";
    			t21 = space();
    			a3 = element("a");
    			button3 = element("button");
    			button3.textContent = "Interfaz";
    			t23 = space();
    			div13 = element("div");
    			div12 = element("div");
    			img3 = element("img");
    			t24 = space();
    			div11 = element("div");
    			h43 = element("h4");
    			b3 = element("b");
    			b3.textContent = "Tennis";
    			t26 = space();
    			p2 = element("p");
    			p2.textContent = "Antonio Saborido Campos";
    			t28 = space();
    			a4 = element("a");
    			button4 = element("button");
    			button4.textContent = "API V1";
    			t30 = space();
    			a5 = element("a");
    			button5 = element("button");
    			button5.textContent = "API V1 Docs";
    			t32 = space();
    			a6 = element("a");
    			button6 = element("button");
    			button6.textContent = "API V2";
    			t34 = space();
    			a7 = element("a");
    			button7 = element("button");
    			button7.textContent = "API V2 Docs";
    			t36 = space();
    			a8 = element("a");
    			button8 = element("button");
    			button8.textContent = "Interfaz";
    			t38 = space();
    			br2 = element("br");
    			t39 = space();
    			div24 = element("div");
    			div17 = element("div");
    			div16 = element("div");
    			div15 = element("div");
    			h44 = element("h4");
    			b4 = element("b");
    			b4.textContent = "Fernando";
    			t41 = space();
    			p3 = element("p");
    			p3.textContent = "Fuente de datos:";
    			t43 = space();
    			a9 = element("a");
    			button9 = element("button");
    			button9.textContent = "#";
    			t45 = space();
    			div20 = element("div");
    			div19 = element("div");
    			div18 = element("div");
    			h45 = element("h4");
    			b5 = element("b");
    			b5.textContent = "Alberto";
    			t47 = space();
    			p4 = element("p");
    			p4.textContent = "Fuente de datos:";
    			t49 = space();
    			a10 = element("a");
    			button10 = element("button");
    			button10.textContent = "#";
    			t51 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			h46 = element("h4");
    			b6 = element("b");
    			b6.textContent = "Antonio Saborido Campos";
    			t53 = space();
    			p5 = element("p");
    			p5.textContent = "Fuente de datos:";
    			t55 = space();
    			a11 = element("a");
    			button11 = element("button");
    			button11.textContent = "#";
    			add_location(br0, file$5, 1, 4, 12);
    			attr_dev(div0, "class", "col-sm-4");
    			add_location(div0, file$5, 4, 8, 59);
    			if (!src_url_equal(img0.src, img0_src_value = "https://logos-world.net/wp-content/uploads/2020/11/GitHub-Emblem.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Avatar");
    			set_style(img0, "width", "100%");
    			add_location(img0, file$5, 9, 16, 181);
    			add_location(b0, file$5, 15, 24, 442);
    			add_location(h40, file$5, 15, 20, 438);
    			attr_dev(button0, "class", "btn btn-primary");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$5, 17, 24, 571);
    			attr_dev(a0, "href", "https://github.com/gti-sos/SOS2122-23");
    			add_location(a0, file$5, 16, 20, 497);
    			attr_dev(div1, "class", "container svelte-110ltv7");
    			add_location(div1, file$5, 14, 16, 393);
    			attr_dev(div2, "class", "card svelte-110ltv7");
    			add_location(div2, file$5, 8, 12, 145);
    			attr_dev(div3, "class", "col-sm-4");
    			add_location(div3, file$5, 7, 8, 109);
    			attr_dev(div4, "class", "row");
    			add_location(div4, file$5, 2, 4, 22);
    			add_location(br1, file$5, 26, 4, 810);
    			if (!src_url_equal(img1.src, img1_src_value = "https://elordenmundial.com/wp-content/uploads/2020/10/NBA-logo-baloncesto-historia-deporte-estados-unidos.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Avatar");
    			set_style(img1, "width", "100%");
    			add_location(img1, file$5, 30, 16, 919);
    			add_location(b1, file$5, 36, 24, 1221);
    			add_location(h41, file$5, 36, 20, 1217);
    			add_location(p0, file$5, 37, 20, 1264);
    			attr_dev(button1, "class", "btn btn-primary");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file$5, 39, 24, 1344);
    			attr_dev(a1, "href", "");
    			add_location(a1, file$5, 38, 20, 1307);
    			attr_dev(div5, "class", "container svelte-110ltv7");
    			add_location(div5, file$5, 35, 16, 1172);
    			attr_dev(div6, "class", "card svelte-110ltv7");
    			add_location(div6, file$5, 29, 12, 883);
    			attr_dev(div7, "class", "col-sm-4");
    			add_location(div7, file$5, 28, 8, 847);
    			if (!src_url_equal(img2.src, img2_src_value = "https://obamabcn.com/wp-content/uploads/2019/11/logo-premier-league.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Avatar");
    			set_style(img2, "width", "100%");
    			add_location(img2, file$5, 48, 16, 1627);
    			add_location(b2, file$5, 54, 24, 1891);
    			add_location(h42, file$5, 54, 20, 1887);
    			add_location(p1, file$5, 55, 20, 1939);
    			attr_dev(button2, "class", "btn btn-primary");
    			attr_dev(button2, "type", "submit");
    			add_location(button2, file$5, 57, 24, 2048);
    			attr_dev(a2, "href", "/api/v1/premier-league");
    			add_location(a2, file$5, 56, 20, 1989);
    			attr_dev(button3, "class", "btn btn-primary");
    			attr_dev(button3, "type", "submit");
    			add_location(button3, file$5, 62, 24, 2264);
    			attr_dev(a3, "href", "/#/premier-league");
    			add_location(a3, file$5, 61, 20, 2210);
    			attr_dev(div8, "class", "container svelte-110ltv7");
    			add_location(div8, file$5, 53, 16, 1842);
    			attr_dev(div9, "class", "card svelte-110ltv7");
    			add_location(div9, file$5, 47, 12, 1591);
    			attr_dev(div10, "class", "col-sm-4");
    			add_location(div10, file$5, 46, 8, 1555);
    			if (!src_url_equal(img3.src, img3_src_value = "https://photoresources.wtatennis.com/photo-resources/2019/08/15/dbb59626-9254-4426-915e-57397b6d6635/tennis-origins-e1444901660593.jpg?width=1200&height=630")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Avatar");
    			set_style(img3, "width", "100%");
    			add_location(img3, file$5, 71, 16, 2551);
    			add_location(b3, file$5, 77, 24, 2900);
    			add_location(h43, file$5, 77, 20, 2896);
    			add_location(p2, file$5, 78, 20, 2940);
    			attr_dev(button4, "class", "btn btn-primary");
    			attr_dev(button4, "type", "submit");
    			add_location(button4, file$5, 80, 24, 3043);
    			attr_dev(a4, "href", "/api/v1/tennis");
    			add_location(a4, file$5, 79, 20, 2992);
    			attr_dev(button5, "class", "btn btn-primary");
    			attr_dev(button5, "type", "submit");
    			add_location(button5, file$5, 85, 24, 3264);
    			attr_dev(a5, "href", "/api/v1/tennis/docs");
    			add_location(a5, file$5, 84, 20, 3208);
    			attr_dev(button6, "class", "btn btn-primary");
    			attr_dev(button6, "type", "submit");
    			add_location(button6, file$5, 90, 24, 3485);
    			attr_dev(a6, "href", "/api/v2/tennis");
    			add_location(a6, file$5, 89, 20, 3434);
    			attr_dev(button7, "class", "btn btn-primary");
    			attr_dev(button7, "type", "submit");
    			add_location(button7, file$5, 95, 24, 3706);
    			attr_dev(a7, "href", "/api/v2/tennis/docs");
    			add_location(a7, file$5, 94, 20, 3650);
    			attr_dev(button8, "class", "btn btn-primary");
    			attr_dev(button8, "type", "submit");
    			add_location(button8, file$5, 100, 24, 3922);
    			attr_dev(a8, "href", "/#/tennis");
    			add_location(a8, file$5, 99, 20, 3876);
    			attr_dev(div11, "class", "container svelte-110ltv7");
    			add_location(div11, file$5, 76, 16, 2851);
    			attr_dev(div12, "class", "card svelte-110ltv7");
    			add_location(div12, file$5, 70, 12, 2515);
    			attr_dev(div13, "class", "col-sm-4");
    			add_location(div13, file$5, 69, 8, 2479);
    			attr_dev(div14, "class", "row");
    			add_location(div14, file$5, 27, 4, 820);
    			add_location(br2, file$5, 108, 4, 4145);
    			add_location(b4, file$5, 113, 24, 4303);
    			add_location(h44, file$5, 113, 20, 4299);
    			add_location(p3, file$5, 114, 20, 4345);
    			attr_dev(button9, "class", "btn btn-primary");
    			attr_dev(button9, "type", "submit");
    			add_location(button9, file$5, 116, 24, 4441);
    			attr_dev(a9, "href", "/api/v1/tennis");
    			add_location(a9, file$5, 115, 20, 4390);
    			attr_dev(div15, "class", "container svelte-110ltv7");
    			add_location(div15, file$5, 112, 16, 4254);
    			attr_dev(div16, "class", "card svelte-110ltv7");
    			add_location(div16, file$5, 111, 12, 4218);
    			attr_dev(div17, "class", "col-sm-4");
    			add_location(div17, file$5, 110, 8, 4182);
    			add_location(b5, file$5, 127, 24, 4792);
    			add_location(h45, file$5, 127, 20, 4788);
    			add_location(p4, file$5, 128, 20, 4833);
    			attr_dev(button10, "class", "btn btn-primary");
    			attr_dev(button10, "type", "submit");
    			add_location(button10, file$5, 130, 24, 4929);
    			attr_dev(a10, "href", "/api/v1/tennis");
    			add_location(a10, file$5, 129, 20, 4878);
    			attr_dev(div18, "class", "container svelte-110ltv7");
    			add_location(div18, file$5, 126, 16, 4743);
    			attr_dev(div19, "class", "card svelte-110ltv7");
    			add_location(div19, file$5, 125, 12, 4707);
    			attr_dev(div20, "class", "col-sm-4");
    			add_location(div20, file$5, 124, 8, 4671);
    			add_location(b6, file$5, 141, 24, 5281);
    			add_location(h46, file$5, 141, 20, 5277);
    			add_location(p5, file$5, 142, 20, 5338);
    			attr_dev(button11, "class", "btn btn-primary");
    			attr_dev(button11, "type", "submit");
    			add_location(button11, file$5, 144, 24, 5434);
    			attr_dev(a11, "href", "/api/v1/tennis");
    			add_location(a11, file$5, 143, 20, 5383);
    			attr_dev(div21, "class", "container svelte-110ltv7");
    			add_location(div21, file$5, 140, 16, 5232);
    			attr_dev(div22, "class", "card svelte-110ltv7");
    			add_location(div22, file$5, 139, 12, 5196);
    			attr_dev(div23, "class", "col-sm-4");
    			add_location(div23, file$5, 138, 8, 5160);
    			attr_dev(div24, "class", "row");
    			add_location(div24, file$5, 109, 4, 4155);
    			add_location(main, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, br0);
    			append_dev(main, t0);
    			append_dev(main, div4);
    			append_dev(div4, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, h40);
    			append_dev(h40, b0);
    			append_dev(div1, t4);
    			append_dev(div1, a0);
    			append_dev(a0, button0);
    			append_dev(main, t6);
    			append_dev(main, br1);
    			append_dev(main, t7);
    			append_dev(main, div14);
    			append_dev(div14, div7);
    			append_dev(div7, div6);
    			append_dev(div6, img1);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div5, h41);
    			append_dev(h41, b1);
    			append_dev(div5, t10);
    			append_dev(div5, p0);
    			append_dev(div5, t12);
    			append_dev(div5, a1);
    			append_dev(a1, button1);
    			append_dev(div14, t14);
    			append_dev(div14, div10);
    			append_dev(div10, div9);
    			append_dev(div9, img2);
    			append_dev(div9, t15);
    			append_dev(div9, div8);
    			append_dev(div8, h42);
    			append_dev(h42, b2);
    			append_dev(div8, t17);
    			append_dev(div8, p1);
    			append_dev(div8, t19);
    			append_dev(div8, a2);
    			append_dev(a2, button2);
    			append_dev(div8, t21);
    			append_dev(div8, a3);
    			append_dev(a3, button3);
    			append_dev(div14, t23);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, img3);
    			append_dev(div12, t24);
    			append_dev(div12, div11);
    			append_dev(div11, h43);
    			append_dev(h43, b3);
    			append_dev(div11, t26);
    			append_dev(div11, p2);
    			append_dev(div11, t28);
    			append_dev(div11, a4);
    			append_dev(a4, button4);
    			append_dev(div11, t30);
    			append_dev(div11, a5);
    			append_dev(a5, button5);
    			append_dev(div11, t32);
    			append_dev(div11, a6);
    			append_dev(a6, button6);
    			append_dev(div11, t34);
    			append_dev(div11, a7);
    			append_dev(a7, button7);
    			append_dev(div11, t36);
    			append_dev(div11, a8);
    			append_dev(a8, button8);
    			append_dev(main, t38);
    			append_dev(main, br2);
    			append_dev(main, t39);
    			append_dev(main, div24);
    			append_dev(div24, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, h44);
    			append_dev(h44, b4);
    			append_dev(div15, t41);
    			append_dev(div15, p3);
    			append_dev(div15, t43);
    			append_dev(div15, a9);
    			append_dev(a9, button9);
    			append_dev(div24, t45);
    			append_dev(div24, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div18, h45);
    			append_dev(h45, b5);
    			append_dev(div18, t47);
    			append_dev(div18, p4);
    			append_dev(div18, t49);
    			append_dev(div18, a10);
    			append_dev(a10, button10);
    			append_dev(div24, t51);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, div21);
    			append_dev(div21, h46);
    			append_dev(h46, b6);
    			append_dev(div21, t53);
    			append_dev(div21, p5);
    			append_dev(div21, t55);
    			append_dev(div21, a11);
    			append_dev(a11, button11);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\front\components\Footer.svelte generated by Svelte v3.47.0 */

    const file$4 = "src\\front\\components\\Footer.svelte";

    function create_fragment$4(ctx) {
    	let footer;
    	let div;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			div.textContent = "https://github.com/gti-sos/SOS2122-23";
    			attr_dev(div, "class", "copyright svelte-p8u2kc");
    			add_location(div, file$4, 1, 4, 14);
    			attr_dev(footer, "class", "svelte-p8u2kc");
    			add_location(footer, file$4, 0, 0, 0);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\front\components\Header.svelte generated by Svelte v3.47.0 */

    const file$3 = "src\\front\\components\\Header.svelte";

    function create_fragment$3(ctx) {
    	let header;
    	let a;
    	let h1;

    	const block = {
    		c: function create() {
    			header = element("header");
    			a = element("a");
    			h1 = element("h1");
    			h1.textContent = "Inicio";
    			attr_dev(h1, "class", "svelte-johono");
    			add_location(h1, file$3, 2, 9, 36);
    			attr_dev(a, "href", "");
    			add_location(a, file$3, 1, 4, 14);
    			attr_dev(header, "class", "svelte-johono");
    			add_location(header, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, a);
    			append_dev(a, h1);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\front\premier-league\premier.svelte generated by Svelte v3.47.0 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\front\\premier-league\\premier.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>        import { onMount }
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
    		source: "(1:0) <script>        import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (289:8) {:then entries}
    function create_then_block(ctx) {
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
    	let div0;
    	let button0;
    	let t6;
    	let br2;
    	let t7;
    	let table1;
    	let t8;
    	let button1;
    	let t9;
    	let button2;
    	let t10;
    	let br3;
    	let t11;
    	let div1;
    	let button3;
    	let t12;
    	let button4;
    	let current;

    	alert_1 = new Alert({
    			props: {
    				color: /*color*/ ctx[3],
    				isOpen: /*visible*/ ctx[1],
    				toggle: /*func*/ ctx[17],
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				responsive: true,
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*search*/ ctx[14](/*sCountry*/ ctx[4], /*sYear*/ ctx[5], /*sAppearences*/ ctx[6], /*sCleanSheets*/ ctx[7], /*sGoals*/ ctx[8]))) /*search*/ ctx[14](/*sCountry*/ ctx[4], /*sYear*/ ctx[5], /*sAppearences*/ ctx[6], /*sCleanSheets*/ ctx[7], /*sGoals*/ ctx[8]).apply(this, arguments);
    	});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				responsive: true,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "success",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*loadStats*/ ctx[10]);

    	button2 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*deleteALL*/ ctx[13]);

    	button3 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*getPreviewPage*/ ctx[16]);

    	button4 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button4.$on("click", /*getNextPage*/ ctx[15]);

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
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t6 = space();
    			br2 = element("br");
    			t7 = space();
    			create_component(table1.$$.fragment);
    			t8 = space();
    			create_component(button1.$$.fragment);
    			t9 = space();
    			create_component(button2.$$.fragment);
    			t10 = space();
    			br3 = element("br");
    			t11 = space();
    			div1 = element("div");
    			create_component(button3.$$.fragment);
    			t12 = space();
    			create_component(button4.$$.fragment);
    			add_location(br0, file$2, 296, 8, 9562);
    			add_location(strong, file$2, 297, 38, 9606);
    			set_style(h4, "text-align", "center");
    			add_location(h4, file$2, 297, 8, 9576);
    			add_location(br1, file$2, 298, 8, 9668);
    			set_style(div0, "text-align", "center");
    			add_location(div0, file$2, 319, 8, 10581);
    			add_location(br2, file$2, 323, 8, 10775);
    			add_location(br3, file$2, 369, 2, 12780);
    			set_style(div1, "text-align", "center");
    			add_location(div1, file$2, 370, 2, 12788);
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
    			insert_dev(target, div0, anchor);
    			mount_component(button0, div0, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(table1, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(button2, target, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(button3, div1, null);
    			append_dev(div1, t12);
    			mount_component(button4, div1, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const alert_1_changes = {};
    			if (dirty[0] & /*color*/ 8) alert_1_changes.color = /*color*/ ctx[3];
    			if (dirty[0] & /*visible*/ 2) alert_1_changes.isOpen = /*visible*/ ctx[1];
    			if (dirty[0] & /*visible*/ 2) alert_1_changes.toggle = /*func*/ ctx[17];

    			if (dirty[0] & /*checkMSG*/ 4 | dirty[1] & /*$$scope*/ 64) {
    				alert_1_changes.$$scope = { dirty, ctx };
    			}

    			alert_1.$set(alert_1_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*sGoals, sCleanSheets, sAppearences, sYear, sCountry*/ 496 | dirty[1] & /*$$scope*/ 64) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*entries, newEntry*/ 513 | dirty[1] & /*$$scope*/ 64) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
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
    			if (detaching) detach_dev(div0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t7);
    			destroy_component(table1, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(button2, detaching);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div1);
    			destroy_component(button3);
    			destroy_component(button4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(289:8) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (292:12) {#if checkMSG}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkMSG*/ 4) set_data_dev(t, /*checkMSG*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(292:12) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (291:8) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_10(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[2] && create_if_block$1(ctx);

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
    			if (/*checkMSG*/ ctx[2]) {
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
    		source: "(291:8) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (300:8) <Table bordered responsive>
    function create_default_slot_9(ctx) {
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
    	let td0;
    	let input0;
    	let t10;
    	let td1;
    	let input1;
    	let t11;
    	let td2;
    	let input2;
    	let t12;
    	let td3;
    	let input3;
    	let t13;
    	let td4;
    	let input4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Búsqueda por país";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Búsqueda por año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Búsqueda por apariciones";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Búsqueda por portería vacía";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Búsqueda por goles";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t10 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t11 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t12 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t13 = space();
    			td4 = element("td");
    			input4 = element("input");
    			add_location(th0, file$2, 302, 12, 9766);
    			add_location(th1, file$2, 303, 12, 9806);
    			add_location(th2, file$2, 304, 12, 9845);
    			add_location(th3, file$2, 305, 12, 9892);
    			add_location(th4, file$2, 306, 12, 9942);
    			attr_dev(tr0, "class", "svelte-1en0vgr");
    			add_location(tr0, file$2, 301, 16, 9748);
    			attr_dev(thead, "class", "svelte-1en0vgr");
    			add_location(thead, file$2, 300, 12, 9723);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "País");
    			attr_dev(input0, "class", "svelte-1en0vgr");
    			add_location(input0, file$2, 311, 20, 10075);
    			add_location(td0, file$2, 311, 16, 10071);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "2020");
    			attr_dev(input1, "class", "svelte-1en0vgr");
    			add_location(input1, file$2, 312, 20, 10166);
    			add_location(td1, file$2, 312, 16, 10162);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "12");
    			attr_dev(input2, "class", "svelte-1en0vgr");
    			add_location(input2, file$2, 313, 20, 10256);
    			add_location(td2, file$2, 313, 16, 10252);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "18");
    			attr_dev(input3, "class", "svelte-1en0vgr");
    			add_location(input3, file$2, 314, 20, 10351);
    			add_location(td3, file$2, 314, 16, 10347);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "7");
    			attr_dev(input4, "class", "svelte-1en0vgr");
    			add_location(input4, file$2, 315, 20, 10446);
    			add_location(td4, file$2, 315, 16, 10442);
    			attr_dev(tr1, "class", "svelte-1en0vgr");
    			add_location(tr1, file$2, 310, 12, 10049);
    			add_location(tbody, file$2, 309, 12, 10028);
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
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*sCountry*/ ctx[4]);
    			append_dev(tr1, t10);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*sYear*/ ctx[5]);
    			append_dev(tr1, t11);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*sAppearences*/ ctx[6]);
    			append_dev(tr1, t12);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*sCleanSheets*/ ctx[7]);
    			append_dev(tr1, t13);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*sGoals*/ ctx[8]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[18]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[19]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[20]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[21]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[22])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sCountry*/ 16 && input0.value !== /*sCountry*/ ctx[4]) {
    				set_input_value(input0, /*sCountry*/ ctx[4]);
    			}

    			if (dirty[0] & /*sYear*/ 32 && to_number(input1.value) !== /*sYear*/ ctx[5]) {
    				set_input_value(input1, /*sYear*/ ctx[5]);
    			}

    			if (dirty[0] & /*sAppearences*/ 64 && to_number(input2.value) !== /*sAppearences*/ ctx[6]) {
    				set_input_value(input2, /*sAppearences*/ ctx[6]);
    			}

    			if (dirty[0] & /*sCleanSheets*/ 128 && to_number(input3.value) !== /*sCleanSheets*/ ctx[7]) {
    				set_input_value(input3, /*sCleanSheets*/ ctx[7]);
    			}

    			if (dirty[0] & /*sGoals*/ 256 && to_number(input4.value) !== /*sGoals*/ ctx[8]) {
    				set_input_value(input4, /*sGoals*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(300:8) <Table bordered responsive>",
    		ctx
    	});

    	return block;
    }

    // (321:12) <Button outline color="primary" on:click="{search (sCountry, sYear, sAppearences, sCleanSheets, sGoals)}">
    function create_default_slot_8(ctx) {
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
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(321:12) <Button outline color=\\\"primary\\\" on:click=\\\"{search (sCountry, sYear, sAppearences, sCleanSheets, sGoals)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (345:60) <Button outline color="primary" on:click={insertEntry}>
    function create_default_slot_7(ctx) {
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
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(345:60) <Button outline color=\\\"primary\\\" on:click={insertEntry}>",
    		ctx
    	});

    	return block;
    }

    // (356:20) <Button outline color="danger" on:click="{deleteStat(entry.country, entry.year)}">
    function create_default_slot_6(ctx) {
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
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(356:20) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteStat(entry.country, entry.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (357:76) <Button outline color="primary">
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
    		source: "(357:76) <Button outline color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (348:8) {#each entries as entry}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let a0;
    	let t0_value = /*entry*/ ctx[34].country + "";
    	let t0;
    	let a0_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[34].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[34].appearences + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[34].cleanSheets + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[34].goals + "";
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
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*deleteStat*/ ctx[12](/*entry*/ ctx[34].country, /*entry*/ ctx[34].year))) /*deleteStat*/ ctx[12](/*entry*/ ctx[34].country, /*entry*/ ctx[34].year).apply(this, arguments);
    	});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_5] },
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
    			attr_dev(a0, "href", a0_href_value = "api/v2/premier-league/" + /*entry*/ ctx[34].country + "/" + /*entry*/ ctx[34].year);
    			add_location(a0, file$2, 350, 20, 11945);
    			add_location(td0, file$2, 350, 16, 11941);
    			add_location(td1, file$2, 351, 16, 12048);
    			add_location(td2, file$2, 352, 16, 12087);
    			add_location(td3, file$2, 353, 16, 12133);
    			add_location(td4, file$2, 354, 16, 12179);
    			add_location(td5, file$2, 355, 16, 12219);
    			attr_dev(a1, "href", a1_href_value = "#/premier-league/" + /*entry*/ ctx[34].country + "/" + /*entry*/ ctx[34].year);
    			add_location(a1, file$2, 356, 20, 12347);
    			add_location(td6, file$2, 356, 16, 12343);
    			attr_dev(tr, "class", "svelte-1en0vgr");
    			add_location(tr, file$2, 348, 12, 11901);
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
    			if ((!current || dirty[0] & /*entries*/ 512) && t0_value !== (t0_value = /*entry*/ ctx[34].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*entries*/ 512 && a0_href_value !== (a0_href_value = "api/v2/premier-league/" + /*entry*/ ctx[34].country + "/" + /*entry*/ ctx[34].year)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if ((!current || dirty[0] & /*entries*/ 512) && t2_value !== (t2_value = /*entry*/ ctx[34].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*entries*/ 512) && t4_value !== (t4_value = /*entry*/ ctx[34].appearences + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*entries*/ 512) && t6_value !== (t6_value = /*entry*/ ctx[34].cleanSheets + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*entries*/ 512) && t8_value !== (t8_value = /*entry*/ ctx[34].goals + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (!current || dirty[0] & /*entries*/ 512 && a1_href_value !== (a1_href_value = "#/premier-league/" + /*entry*/ ctx[34].country + "/" + /*entry*/ ctx[34].year)) {
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(348:8) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (326:8) <Table bordered responsive>
    function create_default_slot_4(ctx) {
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
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertEntry*/ ctx[11]);
    	let each_value = /*entries*/ ctx[9];
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
    			add_location(th0, file$2, 328, 20, 10884);
    			add_location(th1, file$2, 329, 20, 10919);
    			add_location(th2, file$2, 330, 20, 10953);
    			add_location(th3, file$2, 331, 20, 10995);
    			add_location(th4, file$2, 332, 20, 11040);
    			attr_dev(th5, "colspan", "2");
    			add_location(th5, file$2, 333, 20, 11076);
    			attr_dev(tr0, "class", "svelte-1en0vgr");
    			add_location(tr0, file$2, 327, 16, 10858);
    			attr_dev(thead, "class", "svelte-1en0vgr");
    			add_location(thead, file$2, 326, 12, 10833);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Spain");
    			attr_dev(input0, "class", "svelte-1en0vgr");
    			add_location(input0, file$2, 338, 20, 11203);
    			add_location(td0, file$2, 338, 16, 11199);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "2017");
    			attr_dev(input1, "class", "svelte-1en0vgr");
    			add_location(input1, file$2, 339, 20, 11305);
    			add_location(td1, file$2, 339, 16, 11301);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "13");
    			attr_dev(input2, "class", "svelte-1en0vgr");
    			add_location(input2, file$2, 340, 20, 11402);
    			add_location(td2, file$2, 340, 16, 11398);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "18");
    			attr_dev(input3, "class", "svelte-1en0vgr");
    			add_location(input3, file$2, 341, 20, 11509);
    			add_location(td3, file$2, 341, 16, 11505);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "20");
    			attr_dev(input4, "class", "svelte-1en0vgr");
    			add_location(input4, file$2, 342, 20, 11614);
    			add_location(td4, file$2, 342, 16, 11610);
    			attr_dev(td5, "colspan", "2");
    			set_style(td5, "text-align", "center");
    			add_location(td5, file$2, 344, 16, 11709);
    			attr_dev(tr1, "class", "svelte-1en0vgr");
    			add_location(tr1, file$2, 337, 12, 11177);
    			add_location(tbody, file$2, 336, 8, 11156);
    			add_location(br, file$2, 361, 8, 12541);
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
    			set_input_value(input0, /*newEntry*/ ctx[0].country);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newEntry*/ ctx[0].year);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newEntry*/ ctx[0].appearences);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newEntry*/ ctx[0].cleanSheets);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newEntry*/ ctx[0].goals);
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
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[23]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[24]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[25]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[26]),
    					listen_dev(input4, "input", /*input4_input_handler_1*/ ctx[27])
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

    			if (dirty[0] & /*newEntry*/ 1 && to_number(input2.value) !== /*newEntry*/ ctx[0].appearences) {
    				set_input_value(input2, /*newEntry*/ ctx[0].appearences);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && to_number(input3.value) !== /*newEntry*/ ctx[0].cleanSheets) {
    				set_input_value(input3, /*newEntry*/ ctx[0].cleanSheets);
    			}

    			if (dirty[0] & /*newEntry*/ 1 && to_number(input4.value) !== /*newEntry*/ ctx[0].goals) {
    				set_input_value(input4, /*newEntry*/ ctx[0].goals);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty[0] & /*entries, deleteStat*/ 4608) {
    				each_value = /*entries*/ ctx[9];
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
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(326:8) <Table bordered responsive>",
    		ctx
    	});

    	return block;
    }

    // (364:8) <Button color="success" on:click="{loadStats}">
    function create_default_slot_3$1(ctx) {
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
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(364:8) <Button color=\\\"success\\\" on:click=\\\"{loadStats}\\\">",
    		ctx
    	});

    	return block;
    }

    // (367:8) <Button color="danger" on:click="{deleteALL}">
    function create_default_slot_2$1(ctx) {
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
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(367:8) <Button color=\\\"danger\\\" on:click=\\\"{deleteALL}\\\">",
    		ctx
    	});

    	return block;
    }

    // (372:3) <Button outline color="primary" on:click="{getPreviewPage}">
    function create_default_slot_1$1(ctx) {
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(372:3) <Button outline color=\\\"primary\\\" on:click=\\\"{getPreviewPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (375:3) <Button outline color="primary" on:click="{getNextPage}">
    function create_default_slot$1(ctx) {
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(375:3) <Button outline color=\\\"primary\\\" on:click=\\\"{getNextPage}\\\">",
    		ctx
    	});

    	return block;
    }

    // (287:24)               Loading entry stats data...          {:then entries}
    function create_pending_block(ctx) {
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
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(287:24)               Loading entry stats data...          {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
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
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 9,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[9], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Tabla de datos de estadísticas de los jugadores de la Premier League";
    			t1 = space();
    			info.block.c();
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$2, 284, 4, 9166);
    			add_location(main, file$2, 282, 0, 9152);
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

    			if (dirty[0] & /*entries*/ 512 && promise !== (promise = /*entries*/ ctx[9]) && handle_promise(promise, info)) ; else {
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Premier', slots, []);
    	let redStyle = "redTable";
    	let blueStyle = "blueTable";
    	var BASE_API_PATH = "api/v2/premier-league";
    	let entries = [];

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
    	let sCountry = "";
    	let sYear = "";
    	let sAppearences = "";
    	let sCleanSheets = "";
    	let sGoals = "";
    	onMount(getEntries);

    	//GET
    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v2/premier-league");

    		if (res.ok) {
    			console.log("Ok:");
    			const data = await res.json();
    			$$invalidate(9, entries = data);
    			console.log("Received entries: " + entries.length);
    		} else {
    			$$invalidate(2, checkMSG = res.status + ": Recursos no encontrados");
    			console.log("ERROR! no encontrado");
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
    			$$invalidate(9, entries = json);
    			$$invalidate(1, visible = true);
    			totaldata = 20;
    			console.log("Received " + entries.length + " entry data.");
    			$$invalidate(3, color = "success");
    			$$invalidate(2, checkMSG = "Datos cargados correctamente");
    		} else {
    			$$invalidate(3, color = "danger");
    			$$invalidate(2, checkMSG = res.status + ": " + "No se pudo cargar los datos");
    			console.log("ERROR! ");
    		}
    	}

    	//INSERT DATA
    	async function insertEntry() {
    		console.log("Inserting entry....");

    		if (newEntry.country == "" || newEntry.year == null || newEntry.appearences == null || newEntry.cleanSheets == null || newEntry.goals == null) {
    			alert("Los campos no pueden estar vacios");
    		} else {
    			await fetch("/api/v2/premier-league", {
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
    				$$invalidate(1, visible = true);

    				if (res.status == 201) {
    					getEntries();
    					totaldata++;
    					console.log("Data introduced");
    					$$invalidate(3, color = "success");
    					$$invalidate(2, checkMSG = "Entrada introducida correctamente");
    				} else if (res.status == 400) {
    					console.log("ERROR Data was not correctly introduced");
    					$$invalidate(3, color = "success");
    					$$invalidate(2, checkMSG = "Entrada introducida incorrectamente");
    				} else if (res.status == 409) {
    					console.log("ERROR There is already a data with that country and year in the da tabase"); //window.alert("Entrada introducida incorrectamente");
    					$$invalidate(3, color = "success");
    					$$invalidate(2, checkMSG = "Entrada introducida incorrectamente");
    				} //window.alert("Ya existe dicha entrada");
    			});
    		}
    	}

    	//DELETE STAT
    	async function deleteStat(countryD, yearD) {
    		await fetch(BASE_API_PATH + "/" + countryD + "/" + yearD, { method: "DELETE" }).then(function (res) {
    			$$invalidate(1, visible = true);
    			getEntries();

    			if (res.status == 200) {
    				totaldata--;
    				$$invalidate(3, color = "success");
    				$$invalidate(2, checkMSG = "Recurso " + countryD + " " + yearD + " borrado correctamente");
    				console.log("Deleted " + countryD);
    			} else if (res.status == 404) {
    				$$invalidate(3, color = "danger");
    				$$invalidate(2, checkMSG = "No se ha encontrado el objeto " + countryD);
    				console.log("Resource NOT FOUND");
    			} else {
    				$$invalidate(3, color = "danger");
    				$$invalidate(2, checkMSG = res.status + ": " + "No se pudo borrar el recurso");
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
    				$$invalidate(1, visible = true);

    				if (res.ok && totaldata > 0) {
    					totaldata = 0;
    					getEntries();
    					$$invalidate(3, color = "success");
    					$$invalidate(2, checkMSG = "Datos eliminados correctamente");
    					console.log("OK All data erased");
    				} else if (totaldata == 0) {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(2, checkMSG = "¡No hay datos para borrar!");
    				} else {
    					console.log("ERROR Data was not erased");
    					$$invalidate(3, color = "danger");
    					$$invalidate(2, checkMSG = "No se han podido eliminar los datos");
    				}
    			});
    		}
    	}

    	//SEARCH
    	async function search(sCountry, sYear, sAppearences, sCleanSheets, sGoals) {
    		if (sCountry == null) {
    			sCountry = "";
    		}

    		if (sYear == null) {
    			sYear = "";
    		}

    		if (sAppearences == null) {
    			sAppearences = "";
    		}

    		if (sCleanSheets == null) {
    			sCleanSheets = "";
    		}

    		if (sGoals == null) {
    			sGoals = "";
    		}

    		$$invalidate(1, visible = true);
    		const res = await fetch(BASE_API_PATH + "?country=" + sCountry + "&year=" + sYear + "&appearences=" + sAppearences + "&cleanSheets=" + sCleanSheets + "&goals=" + sGoals);

    		if (res.ok) {
    			const json = await res.json();
    			$$invalidate(9, entries = json);
    			console.log("Found " + entries.length + " data");

    			if (entries.length == 1) {
    				$$invalidate(3, color = "success");
    				$$invalidate(2, checkMSG = "Se ha encontrado un dato para tu búsqueda");
    			} else {
    				$$invalidate(3, color = "success");
    				$$invalidate(2, checkMSG = "Se han encontrado " + entries.length + " datos para tu búsqueda");
    			}
    		}
    	}

    	/*-------------------------PAGINACIÓN-------------------------*/
    	//getNextPage (B)
    	async function getNextPage() {
    		console.log(totaldata);

    		if (page + 10 > totaldata) {
    			page = 1;
    		} else {
    			page += 10;
    		}

    		$$invalidate(1, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=" + (-1 + page));

    		//condicional imprime msg
    		$$invalidate(3, color = "success");

    		$$invalidate(2, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 9));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(3, color = "danger");
    			$$invalidate(2, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(9, entries = json);
    			console.log("Received " + entries.length + " resources.");
    		} else {
    			$$invalidate(2, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	//getPreviewPage (B)
    	async function getPreviewPage() {
    		console.log(totaldata);

    		if (page - 10 > 1) {
    			page -= 10;
    		} else page = 1;

    		$$invalidate(1, visible = true);
    		console.log("Charging page... Listing since: " + page);
    		const res = await fetch(BASE_API_PATH + "?limit=10&offset=" + (-1 + page));
    		$$invalidate(3, color = "success");

    		$$invalidate(2, checkMSG = page + 5 > totaldata
    		? "Mostrando elementos " + page + "-" + totaldata
    		: "Mostrando elementos " + page + "-" + (page + 9));

    		if (totaldata == 0) {
    			console.log("ERROR Data was not erased");
    			$$invalidate(3, color = "danger");
    			$$invalidate(2, checkMSG = "¡No hay datos!");
    		} else if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(9, entries = json);
    			console.log("Received " + entries.length + " resources.");
    		} else {
    			$$invalidate(2, checkMSG = res.status + ": " + res.statusText);
    			console.log("ERROR!");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Premier> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visible = false);

    	function input0_input_handler() {
    		sCountry = this.value;
    		$$invalidate(4, sCountry);
    	}

    	function input1_input_handler() {
    		sYear = to_number(this.value);
    		$$invalidate(5, sYear);
    	}

    	function input2_input_handler() {
    		sAppearences = to_number(this.value);
    		$$invalidate(6, sAppearences);
    	}

    	function input3_input_handler() {
    		sCleanSheets = to_number(this.value);
    		$$invalidate(7, sCleanSheets);
    	}

    	function input4_input_handler() {
    		sGoals = to_number(this.value);
    		$$invalidate(8, sGoals);
    	}

    	function input0_input_handler_1() {
    		newEntry.country = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input1_input_handler_1() {
    		newEntry.year = this.value;
    		$$invalidate(0, newEntry);
    	}

    	function input2_input_handler_1() {
    		newEntry.appearences = to_number(this.value);
    		$$invalidate(0, newEntry);
    	}

    	function input3_input_handler_1() {
    		newEntry.cleanSheets = to_number(this.value);
    		$$invalidate(0, newEntry);
    	}

    	function input4_input_handler_1() {
    		newEntry.goals = to_number(this.value);
    		$$invalidate(0, newEntry);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		redStyle,
    		blueStyle,
    		BASE_API_PATH,
    		entries,
    		newEntry,
    		visible,
    		checkMSG,
    		color,
    		page,
    		totaldata,
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
    		search,
    		getNextPage,
    		getPreviewPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('redStyle' in $$props) redStyle = $$props.redStyle;
    		if ('blueStyle' in $$props) blueStyle = $$props.blueStyle;
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('entries' in $$props) $$invalidate(9, entries = $$props.entries);
    		if ('newEntry' in $$props) $$invalidate(0, newEntry = $$props.newEntry);
    		if ('visible' in $$props) $$invalidate(1, visible = $$props.visible);
    		if ('checkMSG' in $$props) $$invalidate(2, checkMSG = $$props.checkMSG);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('page' in $$props) page = $$props.page;
    		if ('totaldata' in $$props) totaldata = $$props.totaldata;
    		if ('sCountry' in $$props) $$invalidate(4, sCountry = $$props.sCountry);
    		if ('sYear' in $$props) $$invalidate(5, sYear = $$props.sYear);
    		if ('sAppearences' in $$props) $$invalidate(6, sAppearences = $$props.sAppearences);
    		if ('sCleanSheets' in $$props) $$invalidate(7, sCleanSheets = $$props.sCleanSheets);
    		if ('sGoals' in $$props) $$invalidate(8, sGoals = $$props.sGoals);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newEntry,
    		visible,
    		checkMSG,
    		color,
    		sCountry,
    		sYear,
    		sAppearences,
    		sCleanSheets,
    		sGoals,
    		entries,
    		loadStats,
    		insertEntry,
    		deleteStat,
    		deleteALL,
    		search,
    		getNextPage,
    		getPreviewPage,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1,
    		input3_input_handler_1,
    		input4_input_handler_1
    	];
    }

    class Premier extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Premier",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\front\premier-league\premierEdit.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;
    const file$1 = "src\\front\\premier-league\\premierEdit.svelte";

    // (82:8) {#if errorMsg}
    function create_if_block(ctx) {
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(82:8) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (81:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorMsg*/ ctx[6] && create_if_block(ctx);

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
    		source: "(81:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (106:20) <Button outline color="primary" on:click={EditEntry}>
    function create_default_slot_2(ctx) {
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(106:20) <Button outline color=\\\"primary\\\" on:click={EditEntry}>",
    		ctx
    	});

    	return block;
    }

    // (88:4) <Table bordered>
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
    				$$slots: { default: [create_default_slot_2] },
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
    			add_location(th0, file$1, 90, 16, 2836);
    			add_location(th1, file$1, 91, 16, 2867);
    			add_location(th2, file$1, 92, 16, 2897);
    			add_location(th3, file$1, 93, 16, 2935);
    			add_location(th4, file$1, 94, 16, 2976);
    			add_location(th5, file$1, 95, 16, 3008);
    			add_location(tr0, file$1, 89, 12, 2814);
    			add_location(thead, file$1, 88, 8, 2793);
    			add_location(td0, file$1, 100, 16, 3115);
    			add_location(td1, file$1, 101, 16, 3158);
    			add_location(input0, file$1, 102, 20, 3202);
    			add_location(td2, file$1, 102, 16, 3198);
    			add_location(input1, file$1, 103, 20, 3270);
    			add_location(td3, file$1, 103, 16, 3266);
    			add_location(input2, file$1, 104, 20, 3338);
    			add_location(td4, file$1, 104, 16, 3334);
    			add_location(td5, file$1, 105, 16, 3396);
    			add_location(tr1, file$1, 99, 12, 3093);
    			add_location(tbody, file$1, 98, 8, 3072);
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

    			if (dirty & /*$$scope*/ 131072) {
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(88:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (111:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot(ctx) {
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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(111:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
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
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot] },
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
    			add_location(h1, file$1, 86, 4, 2691);
    			add_location(main, file$1, 78, 0, 2530);
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

    			if (dirty & /*$$scope, errorMsg*/ 131136) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].year + "")) set_data_dev(t4, t4_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedgoals, updatedcleanSheets, updatedappearences, params*/ 131129) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PremierEdit', slots, []);
    	let { params = {} } = $$props;
    	var BASE_API_PATH = "/api/v2/premier-league";
    	let visible = false;
    	let color = "danger";
    	let entry = {};
    	let updatedCountry = {};
    	let updatedYear = "";
    	let updatedappearences = "";
    	let updatedcleanSheets = "";
    	let updatedgoals = "";
    	let errorMsg = "";
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch(BASE_API_PATH + params.country + "/" + params.year);

    		if (res.ok) {
    			const data = await res.json();
    			entry = data;
    			updatedCountry = entry.country;
    			updatedYear = entry.year;
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

    		await fetch(BASE_API_PATH + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: updatedCountry,
    				year: updatedYear,
    				appearences: updatedappearences,
    				cleanSheets: updatedcleanSheets,
    				goals: updatedgoals
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			$$invalidate(1, visible = true);

    			if (res.status == 200) {
    				getStat();
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<PremierEdit> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PremierEdit",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get params() {
    		throw new Error("<PremierEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<PremierEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
    			add_location(main, file, 29, 0, 670);
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
    		"/tennis": List,
    		"/tennis/:country/:year": Edit,
    		"/premier-league": Premier,
    		"/premier-league/:country/:year": PremierEdit,
    		"/info": Info
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
    		Info,
    		Footer,
    		Header,
    		Premier,
    		PremierEdit,
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
