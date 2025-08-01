
(function() {
  'use strict';

  // Get clinic ID from script tag
  var script = document.currentScript || document.querySelector('script[data-clinic-id]');
  var clinicId = script ? script.getAttribute('data-clinic-id') : 'demo-clinic-123';
  
  // Set global config
  window.DGTL_CHAT_CONFIG = {
    clinicId: clinicId
  };

  // Create and inject the widget iframe
  function createWidget() {
    // Check if widget already exists
    if (document.getElementById('dgtl-chat-widget')) {
      return;
    }

    // Create iframe container
    var iframe = document.createElement('iframe');
    iframe.id = 'dgtl-chat-widget';
    iframe.src = window.location.origin + '/?embedded=true&clinic=' + encodeURIComponent(clinicId);
    iframe.style.cssText = [
      'position: fixed',
      'bottom: 20px',
      'right: 20px',
      'width: 320px',
      'height: 400px',
      'border: none',
      'border-radius: 12px',
      'box-shadow: 0 4px 20px rgba(0,0,0,0.15)',
      'z-index: 2147483647',
      'background: transparent'
    ].join(';');

    // Add iframe to page
    document.body.appendChild(iframe);

    // Handle iframe messages (for resizing, etc.)
    window.addEventListener('message', function(event) {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'DGTL_WIDGET_RESIZE') {
        iframe.style.width = event.data.width + 'px';
        iframe.style.height = event.data.height + 'px';
      }
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
