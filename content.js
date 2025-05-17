function isOnGTMTagPage() {
    const pattern = /#\/container\/accounts\/\d+\/containers\/\d+\/workspaces\/\d+\/tags/;
    return pattern.test(window.location.href);
  }
  
  function injectTriggerIDs() {
    if (!isOnGTMTagPage()) return;
  
    // Map trigger names → IDs
    const triggerLinks = document.querySelectorAll('a.small-trigger-chip');
    const triggerMap = new Map();
  
    triggerLinks.forEach(link => {
      const href = link.getAttribute('href');
      const match = href?.match(/\/triggers\/(\d+)/);
      const id = match?.[1];
  
      if (id && !link.querySelector('.trigger-id-badge')) {
        const badge = document.createElement('span');
        badge.textContent = ` #${id}`;
        badge.className = 'trigger-id-badge';
        badge.style.cssText = `
          font-weight: bold;
          font-size: 11px;
          margin-left: 4px;
          background: #e0e0e0;
          color: #444;
          padding: 1px 4px;
          border-radius: 4px;
        `;
        link.appendChild(badge);
      }
  
      // Use trigger text as key
      const name = link.textContent.trim().split('\n')[0].trim();
      triggerMap.set(name, id);
    });
  
    // Match and highlight rows in detail section
    const detailRows = document.querySelectorAll('.gtm-entity-picker-row:not(.id-injected)');
  
    detailRows.forEach(row => {
      try {
        const titleDiv = row.querySelector('.gtm-entity-picker-text > div:first-child');
        const triggerName = titleDiv?.textContent?.trim();
  
        if (!titleDiv || !triggerName) return;
  
        const id = triggerMap.get(triggerName);
  
        if (id && !triggerName.includes(`#${id}`)) {
          titleDiv.textContent += `  #${id}`;
  
          // VISUAL highlight
          row.style.setProperty('background-color', '#ffe4e1', 'important');         // light red
          row.style.setProperty('box-shadow', '0 0 0 2px red', 'important');
  
          titleDiv.style.setProperty('background-color', '#e0f7fa', 'important');    // light blue
          titleDiv.style.setProperty('box-shadow', '0 0 0 2px blue', 'important');
        }
  
        row.classList.add('id-injected');
      } catch (e) {
        console.warn('Trigger row match failed:', e);
      }
    });
  }
  
  // Observe dynamic GTM UI changes (SPA)
  const observer = new MutationObserver(() => injectTriggerIDs());
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial run
  injectTriggerIDs();
  