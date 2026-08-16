window.__ModuleLoader__.load({
	id: "dsh-skill-manager",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region dsh-skill-manager styles
		const CSS = `
.skm-root{display:flex;flex-direction:column;gap:12px;padding:4px 0;}
.skm-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.skm-search{flex:1 1 200px;min-width:150px;padding:7px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1,#444);background:var(--dsw-alias-bg-layer-1,#1e1e1e);color:var(--dsw-alias-label-primary,#eee);font-size:13px;outline:none;}
.skm-search:focus{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-filter{padding:7px 8px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1,#444);background:var(--dsw-alias-bg-layer-1,#1e1e1e);color:var(--dsw-alias-label-primary,#eee);font-size:13px;outline:none;}
.skm-btn{padding:7px 12px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1,#444);background:var(--dsw-alias-bg-layer-1,#1e1e1e);color:var(--dsw-alias-label-primary,#eee);font-size:13px;cursor:pointer;}
.skm-btn:hover{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-count{font-size:12px;color:var(--dsw-alias-label-secondary,#999);}
.skm-hint{padding:18px 10px;text-align:center;font-size:13px;color:var(--dsw-alias-label-secondary,#999);}
.skm-error{padding:12px;border-radius:8px;border:1px solid var(--dsw-alias-state-error-primary,#e5534b);color:var(--dsw-alias-state-error-primary,#e5534b);font-size:12px;white-space:pre-wrap;word-break:break-all;}
.skm-list{display:flex;flex-direction:column;gap:8px;}
.skm-card{border:1px solid var(--dsw-alias-border-l1,#333);border-radius:10px;background:var(--dsw-alias-bg-layer-1,#171717);padding:10px 12px;cursor:pointer;transition:border-color .15s;}
.skm-card:hover{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-card-open{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-card-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.skm-name{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#eee);}
.skm-badge{font-size:11px;line-height:1;padding:3px 7px;border-radius:999px;}
.skm-badge-model{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 18%,transparent);color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-badge-user{background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#3fb950) 16%,transparent);color:var(--dsw-alias-state-success-primary,#3fb950);}
.skm-badge-meta{background:var(--dsw-alias-bg-layer-2,#262626);color:var(--dsw-alias-label-secondary,#999);}
.skm-desc{margin-top:6px;font-size:12px;color:var(--dsw-alias-label-secondary,#bbb);line-height:1.5;}
.skm-detail{margin-top:10px;border-top:1px dashed var(--dsw-alias-border-l1,#333);padding-top:10px;}
.skm-when{font-size:12px;color:var(--dsw-alias-label-secondary,#bbb);margin-bottom:6px;}
.skm-path{font-size:11px;color:var(--dsw-alias-label-secondary,#888);margin-bottom:6px;word-break:break-all;}
.skm-content-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.skm-content-head span{font-size:12px;color:var(--dsw-alias-label-secondary,#999);font-weight:600;}
.skm-copy{padding:4px 10px;font-size:12px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1,#444);background:var(--dsw-alias-bg-layer-2,#262626);color:var(--dsw-alias-label-primary,#eee);cursor:pointer;}
.skm-copy:hover{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-pre{margin:0;padding:10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2,#101010);border:1px solid var(--dsw-alias-border-l1,#333);color:var(--dsw-alias-label-primary,#ddd);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.55;white-space:pre-wrap;word-break:break-word;max-height:380px;overflow:auto;}
`;
		const CSS_ID = "dsh-skill-manager";
		if (typeof document !== "undefined" && document.querySelector(`style[data-plugin-css="${CSS_ID}"]`) === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-skill-manager";
			tag.dataset.pluginCss = CSS_ID;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		//#endregion

		//#region dsh-skill-manager view
		const h = react.createElement;

		function fallbackCopy(text, done) {
			try {
				const ta = document.createElement("textarea");
				ta.value = text;
				ta.setAttribute("readonly", "");
				ta.style.position = "fixed";
				ta.style.opacity = "0";
				document.body.appendChild(ta);
				ta.select();
				document.execCommand("copy");
				document.body.removeChild(ta);
				done();
			} catch (e) {
				console.error("copy failed", e);
			}
		}

		function SkillManager(props) {
			const current = props.useSessions((s) => s.current);
			const [tick, setTick] = react.useState(0);
			const [query, setQuery] = react.useState("");
			const [filter, setFilter] = react.useState("all");
			const [items, setItems] = react.useState([]);
			const [loading, setLoading] = react.useState(true);
			const [error, setError] = react.useState(null);
			const [selected, setSelected] = react.useState(null);
			const [detail, setDetail] = react.useState(null);
			const [detailError, setDetailError] = react.useState(null);
			const [copied, setCopied] = react.useState(false);

			const api = (path, params) => {
				const url = new URL(path, window.location.origin);
				for (const [key, value] of Object.entries(params || {})) {
					if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
				}
				return fetch(url.toString()).then((res) => {
					return res.json().then((body) => {
						if (!res.ok) throw new Error((body && body.error) || `HTTP ${res.status}`);
						return body;
					});
				});
			};

			react.useEffect(() => {
				let alive = true;
				setLoading(true);
				setError(null);
				api("/api/skill-manager/list", { sessionId: current }).then((res) => {
					if (!alive) return;
					setItems(Array.isArray(res && res.items) ? res.items : []);
					setLoading(false);
				}).catch((e) => {
					if (!alive) return;
					setError(e && e.message ? e.message : String(e));
					setItems([]);
					setLoading(false);
				});
				return () => { alive = false; };
			}, [current, tick]);

			const visible = items.filter((s) => {
				if (filter === "model" && !s.modelInvocable) return false;
				if (filter === "user" && !s.userInvocable) return false;
				const q = query.trim().toLowerCase();
				if (!q) return true;
				return (s.name + " " + (s.description || "")).toLowerCase().includes(q);
			});

			const openDetail = (name) => {
				setSelected(name);
				setDetail(null);
				setDetailError(null);
				setCopied(false);
				api("/api/skill-manager/get", { sessionId: current, name }).then((res) => {
					setDetail(res && res.skill ? res.skill : null);
				}).catch((e) => {
					setDetailError(e && e.message ? e.message : String(e));
				});
			};

			const copyContent = (e) => {
				e.stopPropagation();
				if (!detail || !detail.content) return;
				const text = detail.content;
				const done = () => setCopied(true);
				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
				} else {
					fallbackCopy(text, done);
				}
			};

			const toolbar = h("div", { className: "skm-toolbar" },
				h("input", {
					className: "skm-search",
					placeholder: "搜索技能名称或描述…",
					value: query,
					onChange: (e) => setQuery(e.target.value),
				}),
				h("select", {
					className: "skm-filter",
					value: filter,
					onChange: (e) => setFilter(e.target.value),
				},
					h("option", { value: "all" }, "全部"),
					h("option", { value: "model" }, "模型可调用"),
					h("option", { value: "user" }, "用户可调用"),
				),
				h("button", { className: "skm-btn", onClick: () => setTick((t) => t + 1) }, "刷新"),
			);

			const count = h("div", { className: "skm-count" }, "共 " + items.length + " 个技能");

			let body;
			if (loading) {
				body = h("div", { className: "skm-hint" }, "加载中…");
			} else if (error) {
				body = h("div", { className: "skm-error" }, String(error));
			} else if (visible.length === 0) {
				body = h("div", { className: "skm-hint" }, "没有匹配的技能");
			} else {
				body = h("div", { className: "skm-list" }, visible.map((s) => {
					const head = h("div", { className: "skm-card-head" },
						h("span", { className: "skm-name" }, s.name),
						s.modelInvocable && h("span", { className: "skm-badge skm-badge-model" }, "模型"),
						s.userInvocable && h("span", { className: "skm-badge skm-badge-user" }, "用户"),
						h("span", { className: "skm-badge skm-badge-meta" }, s.provider),
						h("span", { className: "skm-badge skm-badge-meta" }, s.source),
					);
					const desc = h("div", { className: "skm-desc" }, s.description);
					let detailNode = null;
					if (selected === s.name) {
						let inner;
						if (detailError) {
							inner = h("div", { className: "skm-error" }, detailError);
						} else if (detail === null) {
							inner = h("div", { className: "skm-hint" }, "加载中…");
						} else {
							const rows = [];
							if (detail.whenToUse) rows.push(h("div", { className: "skm-when", key: "w" }, "适用场景：" + detail.whenToUse));
							if (detail.path) rows.push(h("div", { className: "skm-path", key: "p" }, "路径：" + detail.path));
							rows.push(h("div", { className: "skm-content-head", key: "c" },
								h("span", null, "内容"),
								h("button", { className: "skm-copy", onClick: copyContent }, copied ? "已复制 ✓" : "复制"),
							));
							rows.push(h("pre", { className: "skm-pre", key: "b" }, detail.content));
							inner = h("div", null, rows);
						}
						detailNode = h("div", { className: "skm-detail" }, inner);
					}
					return h("div", {
						key: s.name,
						className: "skm-card" + (selected === s.name ? " skm-card-open" : ""),
						onClick: () => openDetail(s.name),
					}, head, desc, detailNode);
				}));
			}

			return h("div", { className: "skm-root" }, toolbar, count, body);
		}
		//#endregion

		/**
		 * Browser plugin body: register the settings section.
		 */
		function apply(ctx) {
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "skill-manager",
				order: 30,
				label: () => "技能管理"
			}, (props) => react.createElement(SkillManager, { useSessions: props.useSessions })));
		}

		const inject = ["slots"];
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
