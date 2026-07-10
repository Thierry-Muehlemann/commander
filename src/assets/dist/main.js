import { filterCommands, runCommand } from "./commands.js";
import { getConfig } from "./config.js";

const config = getConfig();

function el(tagName, className, children = []) {
  const node = document.createElement(tagName);
  if (className) {
    if (Array.isArray(className)) {
      className.forEach((cn) => {
        node.classList.add(cn);
      });
    } else {
      node.classList.add(className);
    }
  }
  if (children.length) {
    node.append(...children);
  }
  return node;
}

function createPlaceholder() {
  const inProd = config.env.toLowerCase().startsWith("prod");

  const infos = el("div", "infos", [
    el("h4", "primarySite", config.siteUrl),
    el("b", inProd ? "warning" : undefined, [
      inProd ? "⚠ Production" : config.env,
    ]),
  ]);

  const ad = el("div", "ad");
  ad.innerHTML = `Commander is a <a target="_blank" href="https://thierry.sh">thierry.sh</a> project.`;

  const placeholder = el("div", "placeholder", [infos, ad]);

  return placeholder;
}

function mountApp() {
  // creating the markup
  const input = el("input");
  input.name = "commander";
  input.placeholder = "Navigate";
  const placeholder = createPlaceholder();
  const results = el("div", "results");
  const panel = el("div", "cmd-panel", [input, results, placeholder]);
  const root = el("div", "commander", [panel]);

  let isOpen = false;
  document.body.appendChild(root);
  root.classList.add("hidden");

  function isTextEntryContext(event) {
    return event.composedPath().some((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      if (element.isContentEditable) {
        return true;
      }

      if (element instanceof HTMLTextAreaElement) {
        return !element.disabled && !element.readOnly;
      }

      if (element instanceof HTMLInputElement) {
        return (
          !element.disabled &&
          !element.readOnly &&
          ![
            "button",
            "checkbox",
            "color",
            "file",
            "hidden",
            "image",
            "radio",
            "range",
            "reset",
            "submit",
          ].includes(element.type)
        );
      }

      const role = element.getAttribute("role");

      return (
        ["textbox", "searchbox", "combobox", "spinbutton"].includes(role) &&
        element.getAttribute("aria-disabled") !== "true" &&
        element.getAttribute("aria-readonly") !== "true"
      );
    });
  }

  // attaching event listeners
  window.addEventListener("keydown", (e) => {
    const hasCommandModifier = e.ctrlKey || e.metaKey;

    if (isTextEntryContext(e) && !hasCommandModifier) {
      return;
    }

    switch (e.key) {
      case "k":
        if (!hasCommandModifier) return;
      case ":":
        e.preventDefault();
        open();
        break;
    }
  });

  input.addEventListener("input", (e) => {
    handleSearch(e.target.value);
  });

  let paletteKeybindings;

  function open() {
    if (isOpen) return;

    isOpen = true;
    paletteKeybindings = new AbortController();

    window.addEventListener("keydown", handlePaletteKeydown, {
      capture: true,
      signal: paletteKeybindings.signal,
    });

    root.classList.remove("hidden");
    input.focus();
  }

  function close() {
    if (!isOpen) return;

    isOpen = false;
    paletteKeybindings?.abort();
    paletteKeybindings = undefined;

    input.blur();
    root.classList.add("hidden");

    input.value = "";
    handleSearch(""); // preload results
  }

  function handlePaletteKeydown(e) {
    const cmdKey = e.ctrlKey || e.metaKey;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        e.stopImmediatePropagation();
        close();
        break;
      case "n":
        if (!cmdKey) break;
      case "ArrowDown":
        e.preventDefault();
        selectNext();
        break;
      case "p":
        if (!cmdKey) break;
      case "ArrowUp":
        e.preventDefault();
        selectPrev();
        break;
      case "Enter":
        if (commands?.length) {
          runCommand(commands[commandIndex], e.ctrlKey);
        }
    }
  }

  let commands;
  let commandIndex = 0;

  function handleSearch(query) {
    results.innerText = null;

    commands = filterCommands(query);

    // display results
    commands.forEach((cmd) => {
      const res = createResult(cmd);
      results.appendChild(res);
    });

    if (commands.length) {
      setSelection(0);
    }
  }

  function createResult(cmd) {
    const res = el("button");
    cmd.title.split(":").forEach((part) => {
      res.appendChild(el("span", undefined, [part]));
    });
    return res;
  }

  function selectNext() {
    setSelection(Math.min(commands.length - 1, commandIndex + 1));
  }

  function selectPrev() {
    setSelection(Math.max(0, commandIndex - 1));
  }

  function setSelection(nextIndex) {
    const old = results.children.item(commandIndex);
    old?.classList.remove("selected");

    commandIndex = nextIndex;

    const selected = results.children.item(commandIndex)
    if (!selected) return;

    selected.classList.add("selected");

    const itemRect = selected.getBoundingClientRect();
    const resultsRect = results.getBoundingClientRect();

    const isVisible =
      itemRect.top >= resultsRect.top &&
      itemRect.bottom <= resultsRect.bottom;

    if (!isVisible) {
      selected.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  }

  handleSearch("");
}

mountApp();
