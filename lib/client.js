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
.skm-btn-primary{border-color:var(--dsw-alias-brand-primary,#4c8dff);color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-btn-danger{border-color:var(--dsw-alias-state-error-primary,#e5534b);color:var(--dsw-alias-state-error-primary,#e5534b);}
.skm-btn:disabled{opacity:.5;cursor:default;}
.skm-count{font-size:12px;color:var(--dsw-alias-label-secondary,#999);}
.skm-hint{padding:18px 10px;text-align:center;font-size:13px;color:var(--dsw-alias-label-secondary,#999);}
.skm-error{padding:12px;border-radius:8px;border:1px solid var(--dsw-alias-state-error-primary,#e5534b);color:var(--dsw-alias-state-error-primary,#e5534b);font-size:12px;white-space:pre-wrap;word-break:break-all;}
.skm-list{display:flex;flex-direction:column;gap:8px;}
.skm-card{border:1px solid var(--dsw-alias-border-l1,#333);border-radius:10px;background:var(--dsw-alias-bg-layer-1,#171717);padding:10px 12px;cursor:pointer;transition:border-color .15s;}
.skm-card:hover{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-card-open{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-card-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.skm-name{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#eee);}
.skm-badge-ro{background:var(--dsw-alias-bg-layer-2,#262626);color:var(--dsw-alias-state-warn-primary,#d29922);}
.skm-desc{margin-top:6px;font-size:12px;color:var(--dsw-alias-label-secondary,#bbb);line-height:1.5;}
.skm-detail{margin-top:10px;border-top:1px dashed var(--dsw-alias-border-l1,#333);padding-top:10px;}
.skm-when{font-size:12px;color:var(--dsw-alias-label-secondary,#bbb);margin-bottom:6px;}
.skm-path{font-size:11px;color:var(--dsw-alias-label-secondary,#888);margin-bottom:6px;word-break:break-all;}
.skm-content-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.skm-content-head span{font-size:12px;color:var(--dsw-alias-label-secondary,#999);font-weight:600;}
.skm-copy{padding:4px 10px;font-size:12px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1,#444);background:var(--dsw-alias-bg-layer-2,#262626);color:var(--dsw-alias-label-primary,#eee);cursor:pointer;}
.skm-copy:hover{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-pre{margin:0;padding:10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2,#101010);border:1px solid var(--dsw-alias-border-l1,#333);color:var(--dsw-alias-label-primary,#ddd);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.55;white-space:pre-wrap;word-break:break-word;max-height:380px;overflow:auto;}
.skm-actions{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}
.skm-form{display:flex;flex-direction:column;gap:10px;border:1px solid var(--dsw-alias-border-l1,#333);border-radius:10px;background:var(--dsw-alias-bg-layer-1,#171717);padding:12px;}
.skm-form-title{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#eee);}
.skm-field{display:flex;flex-direction:column;gap:4px;}
.skm-field label{font-size:12px;color:var(--dsw-alias-label-secondary,#999);}
.skm-input{padding:7px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1,#444);background:var(--dsw-alias-bg-layer-2,#101010);color:var(--dsw-alias-label-primary,#eee);font-size:13px;outline:none;font-family:inherit;}
.skm-input:focus{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-textarea{padding:7px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1,#444);background:var(--dsw-alias-bg-layer-2,#101010);color:var(--dsw-alias-label-primary,#eee);font-size:13px;outline:none;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.5;min-height:180px;resize:vertical;}
.skm-textarea:focus{border-color:var(--dsw-alias-brand-primary,#4c8dff);}
.skm-form-actions{display:flex;gap:8px;justify-content:flex-end;}
.skm-form-error{padding:10px;border-radius:8px;border:1px solid var(--dsw-alias-state-error-primary,#e5534b);color:var(--dsw-alias-state-error-primary,#e5534b);font-size:12px;white-space:pre-wrap;word-break:break-all;}
.skm-ok{font-size:12px;color:var(--dsw-alias-state-success-primary,#3fb950);}
.skm-menu-veil{position:fixed;inset:0;z-index:999;background:transparent;}
.skm-menu{position:fixed;z-index:1000;min-width:150px;padding:4px;border-radius:10px;border:1px solid var(--dsw-alias-border-l1,#333);background:var(--dsw-alias-bg-overlay,#1c1c1c);box-shadow:0 6px 20px rgba(0,0,0,.35);}
.skm-menu-item{padding:8px 12px;border-radius:6px;font-size:13px;color:var(--dsw-alias-label-primary,#eee);cursor:pointer;display:flex;align-items:center;gap:8px;}
.skm-menu-item:hover{background:var(--dsw-alias-bg-layer-2,#262626);}
.skm-menu-item-danger{color:var(--dsw-alias-state-error-primary,#e5534b);}
.skm-menu-item-danger:hover{background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e5534b) 12%,transparent);}
.skm-menu-item-disabled{color:var(--dsw-alias-label-secondary,#888);cursor:default;}
.skm-menu-item-disabled:hover{background:transparent;}
.skm-menu-sep{height:1px;margin:4px 6px;background:var(--dsw-alias-border-l1,#333);}
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

		/** One editable field row inside the create/edit form. */
		function Field(props) {
			const common = {
				className: "skm-input",
				value: props.value,
				onChange: props.onChange,
			};
			const control = props.large
				? h("textarea", Object.assign({ className: "skm-textarea" }, common, { rows: props.rows || 10 }))
				: h("input", common);
			return h("div", { className: "skm-field" },
				h("label", null, props.label),
				control,
			);
		}

		/** Create/edit form. `initial` is null for create, or a loaded skill for edit. */
		function SkillForm(props) {
			const editing = props.initial !== null;
			const [name, setName] = react.useState(editing ? props.initial.name : "");
			const [description, setDescription] = react.useState(editing ? (props.initial.description || "") : "");
			const [whenToUse, setWhenToUse] = react.useState(editing ? (props.initial.whenToUse || "") : "");
			const [content, setContent] = react.useState(editing ? (props.initial.content || "") : "");
			const [saving, setSaving] = react.useState(false);
			const [error, setError] = react.useState(null);
			const [done, setDone] = react.useState(null);

			const submit = () => {
				setSaving(true);
				setError(null);
				setDone(null);
				const payload = {
					name: name.trim(),
					description: description.trim(),
					whenToUse: whenToUse.trim(),
					content,
				};
				if (editing) payload.path = props.initial.path;
				const action = editing ? "update" : "create";
				props.api(`/api/skill-manager/${action}`, payload).then((res) => {
					setSaving(false);
					setDone(editing ? "已保存 ✓" : "已创建 ✓");
					if (props.onSaved) props.onSaved(res);
				}).catch((e) => {
					setSaving(false);
					setError(e && e.message ? e.message : String(e));
				});
			};

			const cancel = () => {
				if (props.onCancel) props.onCancel();
			};

			return h("div", { className: "skm-form" },
				h("div", { className: "skm-form-title" }, editing ? "编辑技能" : "新建技能"),
				Field({ label: "名称（小写 kebab-case，如 daily-work-log）", value: name, onChange: (e) => setName(e.target.value) }),
				Field({ label: "描述 description（必填）", value: description, onChange: (e) => setDescription(e.target.value) }),
				Field({ label: "适用场景 whenToUse（可选）", value: whenToUse, onChange: (e) => setWhenToUse(e.target.value) }),
				Field({ label: "正文内容 content（Markdown）", value: content, onChange: (e) => setContent(e.target.value), large: true }),
				error && h("div", { className: "skm-form-error" }, String(error)),
				done && h("div", { className: "skm-ok" }, done),
				h("div", { className: "skm-form-actions" },
					h("button", { className: "skm-btn", onClick: cancel, disabled: saving }, "取消"),
					h("button", { className: "skm-btn skm-btn-primary", onClick: submit, disabled: saving }, saving ? "保存中…" : (editing ? "保存修改" : "创建")),
				),
			);
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
			const [creating, setCreating] = react.useState(false);
			const [editing, setEditing] = react.useState(false);
			const [deleting, setDeleting] = react.useState(false);
			const [menu, setMenu] = react.useState(null);

			const api = (path, params) => {
				const url = new URL(path, window.location.origin);
				const init = {};
				if (params && params.body) {
					init.method = params.method || "POST";
					init.headers = { "content-type": "application/json" };
					init.body = JSON.stringify(params.body);
				} else {
					for (const [key, value] of Object.entries(params || {})) {
						if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
					}
				}
				return fetch(url.toString(), init).then((res) => {
					return res.json().then((body) => {
						if (!res.ok) throw new Error((body && body.error) || `HTTP ${res.status}`);
						return body;
					});
				});
			};

			const reload = () => setTick((t) => t + 1);

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

			const startCreate = () => {
				setCreating(true);
				setEditing(false);
			};

			const startEdit = (e) => {
				e.stopPropagation();
				setEditing(true);
				setCreating(false);
			};

			const confirmDelete = (e) => {
				e.stopPropagation();
				if (!detail) return;
				if (!window.confirm(`确定删除技能「${detail.name}」？\n将删除整个技能目录（含附属文件），此操作不可恢复。`)) return;
				setDeleting(true);
				api("/api/skill-manager/delete", { body: { path: detail.path } }).then(() => {
					setDeleting(false);
					setDetail(null);
					setSelected(null);
					reload();
				}).catch((err) => {
					setDeleting(false);
					setDetailError(err && err.message ? err.message : String(err));
				});
			};

			// Right-click menu: 删除 (only for user-dsh skills)
			const openMenu = (e, skill) => {
				e.preventDefault();
				e.stopPropagation();
				setMenu({ x: e.clientX, y: e.clientY, skill });
			};

			const closeMenu = () => setMenu(null);

			const deleteFromMenu = () => {
				const item = menu && menu.skill;
				if (!item) return;
				closeMenu();
				if (item.source !== "user-dsh") return;
				if (!window.confirm(`确定删除技能「${item.name}」？\n将删除整个技能目录（含附属文件），此操作不可恢复。`)) return;
				setDeleting(true);
				api("/api/skill-manager/get", { sessionId: current, name: item.name }).then((res) => {
					const sk = res && res.skill;
					if (!sk || !sk.path) throw new Error("无法获取技能路径");
					return api("/api/skill-manager/delete", { body: { path: sk.path } });
				}).then(() => {
					setDeleting(false);
					setDetail(null);
					setSelected(null);
					reload();
				}).catch((err) => {
					setDeleting(false);
					setDetailError(err && err.message ? err.message : String(err));
				});
			};

			const afterSaved = () => {
				setCreating(false);
				setEditing(false);
				setDetail(null);
				setSelected(null);
				reload();
			};

			const editable = detail && detail.source === "user-dsh";

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
				h("button", { className: "skm-btn", onClick: reload }, "刷新"),
				h("button", { className: "skm-btn skm-btn-primary", onClick: startCreate }, "新建技能"),
			);

			const count = h("div", { className: "skm-count" }, "共 " + items.length + " 个技能" + (creating || editing ? " · 编辑模式" : ""));

			let body;
			if (loading) {
				body = h("div", { className: "skm-hint" }, "加载中…");
			} else if (error) {
				body = h("div", { className: "skm-error" }, String(error));
			} else {
				body = h("div", { className: "skm-list" },
					creating && h(SkillForm, {
						key: "create",
						initial: null,
						api,
						onSaved: afterSaved,
						onCancel: () => setCreating(false),
					}),
					visible.map((s) => {
						const head = h("div", { className: "skm-card-head" },
							h("span", { className: "skm-name" }, s.name),
						);
						const desc = h("div", { className: "skm-desc" }, s.description);
						let detailNode = null;
						if (selected === s.name) {
							let inner;
							if (detailError) {
								inner = h("div", { className: "skm-error" }, detailError);
							} else if (detail === null) {
								inner = h("div", { className: "skm-hint" }, "加载中…");
							} else if (editing) {
								inner = h(SkillForm, {
									initial: detail,
									api,
									onSaved: afterSaved,
									onCancel: () => setEditing(false),
								});
							} else {
								const rows = [];
								if (detail.whenToUse) rows.push(h("div", { className: "skm-when", key: "w" }, "适用场景：" + detail.whenToUse));
								if (detail.path) rows.push(h("div", { className: "skm-path", key: "p" }, "路径：" + detail.path));
								rows.push(h("div", { className: "skm-content-head", key: "c" },
									h("span", null, "内容"),
									h("button", { className: "skm-copy", onClick: copyContent }, copied ? "已复制 ✓" : "复制"),
								));
								rows.push(h("pre", { className: "skm-pre", key: "b" }, detail.content));
								const actions = [];
								if (editable) {
									actions.push(h("button", { key: "e", className: "skm-btn", onClick: startEdit }, "编辑"));
									actions.push(h("button", { key: "d", className: "skm-btn skm-btn-danger", onClick: confirmDelete, disabled: deleting }, deleting ? "删除中…" : "删除"));
								} else {
									actions.push(h("span", { key: "ro", className: "skm-badge skm-badge-ro" }, "内置/预设技能为只读，如需修改请复制后编辑"));
								}
								rows.push(h("div", { className: "skm-actions", key: "a" }, actions));
								inner = h("div", null, rows);
							}
							detailNode = h("div", { className: "skm-detail" }, inner);
						}
						return h("div", {
							key: s.name,
							className: "skm-card" + (selected === s.name ? " skm-card-open" : ""),
							onClick: () => openDetail(s.name),
							onContextMenu: (e) => openMenu(e, s),
						}, head, desc, detailNode);
					}),
				);
			}

			let menuNode = null;
			if (menu) {
				const isUser = menu.skill.source === "user-dsh";
				const style = { left: Math.min(menu.x, (window.innerWidth || 0) - 170), top: Math.min(menu.y, (window.innerHeight || 0) - 120) };
				menuNode = h("div", null,
					h("div", { className: "skm-menu-veil", onClick: closeMenu, onContextMenu: (e) => { e.preventDefault(); closeMenu(); } }),
					h("div", { className: "skm-menu", style },
						isUser
							? h("div", { className: "skm-menu-item skm-menu-item-danger", onClick: deleteFromMenu }, deleting ? "删除中…" : "删除")
							: h("div", { className: "skm-menu-item skm-menu-item-disabled" }, "只读技能"),
					),
				);
			}

			return h("div", { className: "skm-root" }, toolbar, count, body, menuNode);
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
