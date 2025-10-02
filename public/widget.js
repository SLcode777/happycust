(function () {
  "use strict";

  // Get config from window
  const config = window.HappyCustConfig || {};
  const projectId = config.projectId;
  const locale = config.locale || "en";
  const customTrigger = config.customTrigger || false;
  const happycustUrl = config.happycustUrl || "http://localhost:3000";

  if (!projectId) {
    console.error("HappyCust: projectId is required in HappyCustConfig");
    return;
  }

  // Create iframe for widget
  const iframe = document.createElement("iframe");
  iframe.id = "happycust-iframe";
  iframe.src = `${happycustUrl}/${locale}/widget?projectId=${projectId}`;
  iframe.style.cssText = `
    display: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 420px;
    height: 680px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 999998;
    background: white;
  `;

  // State
  let isOpen = false;

  // Open/close functions
  const openWidget = () => {
    isOpen = true;
    iframe.style.display = "block";
    if (button) button.innerHTML = "✕";
  };

  const closeWidget = () => {
    isOpen = false;
    iframe.style.display = "none";
    if (button) button.innerHTML = "💬";
  };

  const toggleWidget = () => {
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  };

  // Expose global API
  window.HappyCust = {
    open: openWidget,
    close: closeWidget,
    toggle: toggleWidget,
  };

  // Create trigger button only if not using custom trigger
  let button = null;
  if (!customTrigger) {
    const container = document.createElement("div");
    container.id = "happycust-widget-container";
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
    `;

    button = document.createElement("button");
    button.id = "happycust-trigger";
    button.innerHTML = "💬";
    button.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.2s, box-shadow 0.2s;
    `;

    button.onmouseover = () => {
      button.style.transform = "scale(1.1)";
      button.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
    };

    button.onmouseout = () => {
      button.style.transform = "scale(1)";
      button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    };

    button.onclick = toggleWidget;

    container.appendChild(button);
    document.body.appendChild(container);
  }

  // Add iframe to page
  document.body.appendChild(iframe);

  // Handle messages from iframe
  window.addEventListener("message", (event) => {
    if (event.data.type === "happycust-close") {
      closeWidget();
    }
  });
})();
