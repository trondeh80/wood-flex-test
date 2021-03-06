(function(){

  const $ = window.jQuery;

  const BWOOD = {
    ga: 'UA-1139355-43'
  };

  $(document).ready(documentReady);

  function documentReady(){
    addEvents();
    setupAnimation();
    setupAnalytics();
  }

  function addEvents(){
    $('.menu-icon').click(toggleMenu);
    $('.overlay').click(closeMenu);
    $('.menu-icon-close').click(closeMenu);
    $('.email').html(getEmail());
    $('.email-link').attr('href', `mailto:${getEmail()}`);
    $('form').each(function(){
      addFormValidation($(this));
    });
  }

  function isValidEmail(emailAddress){
    const reggie = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reggie.test(emailAddress);
  }

  function addFormValidation(form){
    $('input, textarea', form).focus(function(){
      $(this).addClass('touched');
      form.addClass('touched');
    });
    let formIsValid = true;
    $('input, textarea', form).blur(function(){
      let isValid = false;
      let value = $(this).val();
      let inputType = $(this).attr('type');
      if (value.length) {
        if (inputType === 'email'){
          isValid = isValidEmail(value);
        } else {
          isValid = true;
        }
      }
      $(this).toggleClass('valid', isValid);
      $(this).toggleClass('invalid', !isValid);
      if (!isValid){
        formIsValid = false;
      }

      form.toggleClass('valid', formIsValid);
    });
  }

  function getEmail(){
    return String.fromCharCode(98, 103, 101, 64, 98, 45, 119, 111, 111, 100, 46, 110, 111);
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
