// Links Westminster Standards references (WCF 25.2, WLC 166, WSC 1), OPC Form
// of Government references (FG II.1, Form of Government XXIX.A.3) and Directory
// for Worship references (DPW IV.B.2, DPW IV.B.2.5) in a post to the OPC's text and shows the passage in a pop-up on hover, like the ESV
// CrossReference Tool does for Bible references. The text comes from
// assets/data/westminster-standards.json (built by
// scripts/fetch_westminster_standards.py).
(function () {
  var script = document.currentScript;
  var content = document.querySelector(".post-content");
  if (!content) return;

  var REF = /\b(?:(WCF|WLC|WSC) (\d+)(?:\.(\d+)(?:[-–](\d+))?)?|(FG|Form of Government|DPW) ([IVXL]+)(?:\.(?:([A-Z])\.)?(\d+)(?:[-–](\d+)|\.(\d+))?)?)\b/g;
  var SKIP = "a, code, pre, script, style, .esv-crossref-ignore";
  var PAGES = { WCF: "wcf", WLC: "lc", WSC: "sc", FG: "BCO/FG", DPW: "BCO/DPW" };
  var TOUCH = window.matchMedia("(hover: none)").matches;
  var dataPromise;

  function loadData() {
    dataPromise = dataPromise || fetch(script.dataset.standards).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).catch(function (err) {
      console.error("bco-refs: could not load " + script.dataset.standards, err);
      dataPromise = null;
      throw err;
    });
    return dataPromise;
  }

  function sectionList(ref) {
    if (!ref.section) return [];
    var list = [];
    for (var n = ref.section; n <= (ref.through || ref.section); n++) list.push(n);
    return list;
  }

  // Chapter XXIX of the Form of Government numbers its sections within parts A and B.
  function fgKey(ref, n) {
    return (ref.part ? ref.part + "." : "") + n;
  }

  // Text fragments use "-" and "," as delimiters, so those must be escaped too.
  function fragmentText(text) {
    return encodeURIComponent(text).replace(/-/g, "%2D");
  }

  // The Directory for Worship repeats whole passages (the membership vows appear
  // five times), so a section's opening words may first match elsewhere on the
  // page. Put as many of the preceding words in front as it takes to be unique.
  function dpwFragment(ref, data) {
    var words = [], start;
    Object.keys(data.dpw).forEach(function (num) {
      var sections = data.dpw[num].sections;
      Object.keys(sections).forEach(function (key) {
        var n = key.split(".").pop();
        sections[key].forEach(function (para, i) {
          if (num === ref.num && key === fgKey(ref, ref.section) && i === 0) start = words.length;
          words.push.apply(words, ((i === 0 && /^\d+$/.test(n) ? n + ". " : "") + para).split(" "));
        });
      });
    });
    if (start === undefined) return null;
    var text = words.join(" ");
    var opening = words.slice(start, start + 4).join(" ").replace(/[,;:]$/, "");
    for (var n = 0; n <= start; n++) {
      var prefix = words.slice(start - n, start).join(" ");
      var needle = (prefix ? prefix + " " : "") + opening;
      if (text.indexOf(needle) === text.lastIndexOf(needle)) {
        return (prefix ? fragmentText(prefix) + "-," : "") + fragmentText(opening);
      }
    }
    return fragmentText(opening);
  }

  function hrefFor(ref, data) {
    var base = "https://opc.org/" + PAGES[ref.doc] + ".html";
    if (ref.doc === "DPW") {
      var dpwAnchor = "#Chapter_" + ref.num;
      var dpwText = ref.section && data && dpwFragment(ref, data);
      return base + dpwAnchor + (dpwText ? ":~:text=" + dpwText : "");
    }
    if (ref.doc === "FG") {
      var fgAnchor = "#Chapter_" + ref.num;
      var fgChapter = data && data.fg[ref.num];
      var paras = ref.section && fgChapter && fgChapter.sections[fgKey(ref, ref.section)];
      if (!paras) return base + fgAnchor;
      var fgOpening = ref.section + ". " + paras[0].split(" ").slice(0, 4).join(" ").replace(/[,;:]$/, "");
      return base + fgAnchor + ":~:text=" + encodeURIComponent(fgOpening);
    }
    if (ref.doc !== "WCF") return base + "#:~:text=" + encodeURIComponent("Q. " + ref.num + ".");
    var anchor = "#Chapter_" + (ref.num < 10 ? "0" : "") + ref.num;
    var chapter = data && data.wcf[ref.num];
    var text = ref.section && chapter && chapter.sections[ref.section];
    if (!text) return base + anchor;
    var opening = ref.section + ". " + text.split(" ").slice(0, 4).join(" ").replace(/[,;:]$/, "");
    return base + anchor + ":~:text=" + encodeURIComponent(opening);
  }

  function linkify(node) {
    var text = node.nodeValue;
    REF.lastIndex = 0;
    if (!REF.test(text)) return;
    var frag = document.createDocumentFragment();
    var last = 0;
    text.replace(REF, function (match, doc, num, section, through, bcoDoc, bcoNum, bcoPart, bcoSection, bcoThrough, bcoItem, offset) {
      frag.appendChild(document.createTextNode(text.slice(last, offset)));
      var a = document.createElement("a");
      a.className = "standards-ref";
      a.textContent = match;
      a.target = "_blank";
      a.rel = "noopener";
      a.standardsRef = doc
        ? { doc: doc, num: +num, section: section && +section, through: through && +through }
        : { doc: bcoDoc === "DPW" ? "DPW" : "FG", num: bcoNum, part: bcoPart, section: bcoSection && +bcoSection,
            through: bcoThrough && +bcoThrough, item: bcoItem && +bcoItem };
      a.href = hrefFor(a.standardsRef);
      frag.appendChild(a);
      last = offset + match.length;
    });
    frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }

  var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) { return n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
  });
  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(linkify);

  var links = content.querySelectorAll("a.standards-ref");
  if (!links.length) return;

  // The pop-up carries its own styles so a cached older stylesheet can't hide it.
  var style = document.createElement("style");
  style.textContent = [
    ".standards-popup { position: absolute; z-index: 1000; box-sizing: border-box; max-width: min(420px, calc(100vw - 16px));",
    "  padding: 12px 16px; background: #fff; color: #111; border: 1px solid #e8e8e8; border-radius: 8px;",
    "  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15); font-size: 15px; line-height: 1.5; text-align: left; }",
    ".standards-popup[hidden] { display: none; }",
    ".standards-popup p { margin: 0 0 8px; }",
    ".standards-popup .standards-popup-title { font-weight: bold; }",
    ".standards-popup .standards-popup-question { font-style: italic; }",
    ".standards-popup .standards-popup-source { margin: 0; font-size: 13px; color: #828282; }"
  ].join("\n");
  document.head.appendChild(style);

  var popup = document.createElement("div");
  popup.className = "standards-popup";
  popup.setAttribute("role", "tooltip");
  popup.hidden = true;
  document.body.appendChild(popup);

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function render(ref, data) {
    popup.textContent = "";
    var label = ref.doc + " " + ref.num + (ref.part ? "." + ref.part : "") +
      (ref.section ? "." + ref.section + (ref.through ? "–" + ref.through : "") : "") + (ref.item ? "." + ref.item : "");
    if (ref.doc === "FG" || ref.doc === "DPW") {
      var bcoChapter = data[ref.doc.toLowerCase()][ref.num];
      if (!bcoChapter) return false;
      popup.appendChild(el("p", "standards-popup-title", label + " · " + bcoChapter.title));
      // Chapters VIII and XIX have no numbered sections, so a chapter reference shows their text.
      var keys = ref.section ? sectionList(ref).map(function (n) { return fgKey(ref, n); }) : [""];
      keys.forEach(function (key) {
        (bcoChapter.sections[key] || []).forEach(function (para, i) {
          // An item reference (DPW IV.B.2.5) shows the section's opening and that item.
          if (ref.item && i > 0 && para.indexOf("(" + ref.item + ") ") !== 0) return;
          var n = key.split(".").pop();
          popup.appendChild(el("p", null, (i === 0 && n ? n + ". " : "") + para));
        });
      });
    } else if (ref.doc === "WCF") {
      var chapter = data.wcf[ref.num];
      if (!chapter) return false;
      popup.appendChild(el("p", "standards-popup-title", label + " · " + chapter.title));
      sectionList(ref).forEach(function (n) {
        if (chapter.sections[n]) popup.appendChild(el("p", null, n + ". " + chapter.sections[n]));
      });
    } else {
      var entry = data[ref.doc.toLowerCase()][ref.num];
      if (!entry) return false;
      popup.appendChild(el("p", "standards-popup-title", label));
      popup.appendChild(el("p", "standards-popup-question", "Q. " + entry.q));
      popup.appendChild(el("p", null, "A. " + entry.a));
    }
    var source = el("p", "standards-popup-source", "Text from opc.org");
    if (TOUCH) {
      // On touch screens a tap opens the pop-up, so offer the link from inside it.
      var more = el("a", null, "Read at opc.org");
      more.href = hrefFor(ref, data);
      more.target = "_blank";
      more.rel = "noopener";
      source.textContent = "";
      source.appendChild(more);
    }
    popup.appendChild(source);
    return true;
  }

  function place(link) {
    var r = link.getBoundingClientRect();
    var width = popup.offsetWidth;
    var left = Math.max(8, Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - width - 8));
    var below = r.bottom + 8 + popup.offsetHeight <= window.innerHeight;
    var top = below ? r.bottom + window.scrollY + 8 : r.top + window.scrollY - popup.offsetHeight - 8;
    popup.style.left = left + "px";
    popup.style.top = Math.max(window.scrollY + 8, top) + "px";
  }

  var active = null;

  function show(link) {
    active = link;
    loadData().then(function (data) {
      if (active !== link || !render(link.standardsRef, data)) return;
      link.href = hrefFor(link.standardsRef, data);
      popup.hidden = false;
      place(link);
    }).catch(function () {});
  }

  function hide() {
    active = null;
    popup.hidden = true;
  }

  links.forEach(function (link) {
    if (TOUCH) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (active === link) hide(); else show(link);
      });
    } else {
      link.addEventListener("mouseenter", function () { show(link); });
      link.addEventListener("focus", function () { show(link); });
      link.addEventListener("mouseleave", hide);
      link.addEventListener("blur", hide);
    }
  });
  if (TOUCH) {
    document.addEventListener("click", function (e) {
      if (active && !popup.contains(e.target) && !e.target.closest("a.standards-ref")) hide();
    });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });

  // Fill in the section-level links (text fragments) before anyone clicks.
  loadData().then(function (data) {
    links.forEach(function (link) { link.href = hrefFor(link.standardsRef, data); });
  }).catch(function () {});
})();
