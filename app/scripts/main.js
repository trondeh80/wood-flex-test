(function(){
  var BWOOD = {
    ga: ''
  };

  $(document).ready(documentReady);

  function documentReady(){
    $('.menu-icon').click(toggleMenu);
    $(document).click(closeMenu);
    $('.menu-icon-close').click(closeMenu);
    $('header nav').click(function(e){
        e.stopPropagation();
    });
    setupAnalytics();
  }

  function closeMenu(){
    $('.menuitems').removeClass('is-active');
    $('#overlay').removeClass('is-active');
  }

  function toggleMenu(){
    $('.menuitems').toggleClass('is-active');
    $('#overlay').toggleClass('is-active');
  }

  function setupAnalytics(){
    (function (b, o, i, l, e, r) {
      b.GoogleAnalyticsObject = l;
      b[l] || (b[l] =
        function () {
          (b[l].q = b[l].q || []).push(arguments)
        });
      b[l].l = +new Date;
      e = o.createElement(i);
      r = o.getElementsByTagName(i)[0];
      e.src = 'https://www.google-analytics.com/analytics.js';
      r.parentNode.insertBefore(e, r)
    }(window, document, 'script', 'ga'));
    ga('create', BWOOD.ga);
    ga('send', 'pageview');
  }

})();
