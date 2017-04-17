(function(){

  const BWOOD = {
    ga: 'UA-1139355-43'
  };

  $(document).ready(documentReady);

  function documentReady(){
    $('.menu-icon').click(toggleMenu);
    $('.overlay').click(closeMenu);
    $('.menu-icon-close').click(closeMenu);
    setupAnimation();
    setupAnalytics();
    $('.email').html(getEmail());
  }

  function getEmail(){
    const domain = 'b-wood.no';
    return `bge@${domain}`;
  }

  function closeMenu(){
    $('.menu-activate').removeClass('is-active');
    $('#overlay').removeClass('is-active');
  }

  function toggleMenu(){
    $('.menu-activate').toggleClass('is-active');
    $('#overlay').toggleClass('is-active');
  }

  function setupAnimation(){
    $('.animated').each(function(){
      const delay = $(this).data('delay') ;
      if (delay){
        setTimeout(() => $(this).addClass($(this).data('animate')), delay);
      } else {
        $(this).addClass($(this).data('animate'));
      }
    });
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
