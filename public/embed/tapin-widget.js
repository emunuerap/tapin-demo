;(function(){
  function mount(host){
    var rid = host.getAttribute('data-restaurant') || 'r-otoro'
    var accent = host.getAttribute('data-accent') || 'yuzu'
    var compact = host.getAttribute('data-compact') || '0'
    var src = '/embed/widget?restaurant='+encodeURIComponent(rid)+'&accent='+encodeURIComponent(accent)+'&compact='+encodeURIComponent(compact)
    var iframe = document.createElement('iframe')
    iframe.src = src
    iframe.title = 'TapIn widget'
    iframe.style.width = '100%'
    iframe.style.height = host.getAttribute('data-height') || '560'
    iframe.style.border = '1px solid rgba(255,255,255,.12)'
    iframe.style.borderRadius = '18px'
    iframe.style.background = 'rgba(0,0,0,.25)'
    host.innerHTML = ''
    host.appendChild(iframe)
  }

  function boot(){
    var nodes = document.querySelectorAll('[data-tapin-widget]')
    for (var i=0;i<nodes.length;i++) mount(nodes[i])
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
