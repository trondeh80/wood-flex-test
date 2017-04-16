(function(){
  $(document).ready(documentReady);

  function documentReady(){
    $('.menu-icon').click(toggleMenu);
    $(document).click(closeMenu);
    $('.menu-icon-close').click(closeMenu);
    $('header nav').click(function(e){
        e.stopPropagation();
    });
  }

  function closeMenu(){
    $('.menuitems').removeClass('is-active');
    $('#overlay').removeClass('is-active');
  }

  function toggleMenu(){
    $('.menuitems').toggleClass('is-active');
    $('#overlay').toggleClass('is-active');
  }

})();
