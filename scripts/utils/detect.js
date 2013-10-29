// Detect mobile (by size
var detect = {
  mobileBreakpoint: 480,
  isMobile: function() {
    return (window.innerWidth <= this.mobileBreakpoint)
  }
}