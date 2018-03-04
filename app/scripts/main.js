(function () {

  const $ = window.jQuery;
  const model = {
    currentIndex: 0,
    images: [],
    GA: 'UA-1139355-43'
  };

  $(document).ready(documentReady);

  function documentReady() {
    setupLightbox(); // attach events
    addEvents();
    setupAnimation();
    setupAnalytics();
  }

  function setupLightbox() {
    if ($('.gallery, .image-preview').length) {
      model.images = [];

      // $('#overlay, #close-gallery-btn').click(closeLightbox);
      $('.gallery').each(function () {
        $('.gallery-item', $(this)).each(addImage);
      });

      if (window.location.hash) {
        const index = Number(window.location.hash.replace(/^\#[a-z]+\-/,''));
        model.currentIndex = index;
        setLightboxImage(model.images[index]);
        $('#overlay').addClass('open'); // opens the modal
      }
    }

    function addImage() {
      const linkItem = $('a', $(this));
      const image = {
        galleryItem: $(this),
        url: linkItem.attr('href')
      };
      model.images.push(image);
      linkItem.click(getSingleImageClickEvent(image));
    }
  }

  function addEvents() {
    $('.menu-icon').click(toggleMenu);
    $('.overlay').click(closeMenu);
    $('.menu-icon-close').click(closeMenu);
    $('.email').html(getEmail());
    $('.email-link').attr('href', `mailto:${getEmail()}`);

    $('form').each(function () {
      addFormValidation($(this));
    });

    $(document).on('click', '#overlay .modal > .modal-inner > .content img',
      model,
      setNextImage);
  }

  // Get click listener
  function getSingleImageClickEvent(image) {
    return (event) => {
      model.currentIndex = model.images.indexOf(image);
      event.preventDefault();
      event.stopPropagation();
      setLightboxImage(image);
      $('#overlay').addClass('open'); // opens the modal
    };
  }

  function setLightboxImage(currentImage) {
    const contentNode = $('.modal > .modal-inner > .content');
    const domImage = $('.modal > .modal-inner > .content img');

    $('.previous-image', contentNode).remove();

    if (domImage.length) {
      domImage.remove();
    }
    const html = '<div class="loading"><span>Laster...</span></div>' ;
    contentNode.html(html);

    let image = new Image();
    image.addEventListener('load', () => {
      contentNode
        .html(`<img class="lb-image fullsize-image" src="${currentImage.url}" />`);

      history.pushState(null, null, `#image-${model.currentIndex}`);
    });
    image.src = currentImage.url;

  }

  function setNextImage(event) {

    event.preventDefault();
    event.stopPropagation();

    if (model.currentIndex < model.images.length - 1) {
      model.currentIndex = model.currentIndex + 1;
    } else {
      model.currentIndex = 0;
    }

    const image = model.images[model.currentIndex];

    setLightboxImage(image);
  }

  function isValidEmail(emailAddress) {
    const reggie = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reggie.test(emailAddress);
  }

  function addFormValidation(form) {
    $('input, textarea', form).focus(function () {
      $(this).addClass('touched');
      form.addClass('touched');
    });
    let formIsValid = true;
    $('input, textarea', form).blur(function () {
      let isValid = false;
      let value = $(this).val();
      let inputType = $(this).attr('type');
      if (value.length) {
        if (inputType === 'email') {
          isValid = isValidEmail(value);
        } else {
          isValid = true;
        }
      }
      $(this).toggleClass('valid', isValid);
      $(this).toggleClass('invalid', !isValid);
      if (!isValid) {
        formIsValid = false;
      }

      form.toggleClass('valid', formIsValid);
    });
  }

  function getEmail() {
    return String.fromCharCode(98, 103, 101, 64, 98, 45, 119, 111, 111, 100, 46, 110, 111);
  }

  function closeMenu(event) {
      if ($(event.target).hasClass('lb-image'))
      return;

    event.preventDefault();
    event.stopPropagation();

    $('.menu-activate').removeClass('is-active');
    $('#overlay').removeClass('is-active').removeClass('open');
    history.pushState('',
      document.title,
      window.location.pathname + window.location.search);
    return false;
  }

  function toggleMenu() {
    $('.menu-activate').toggleClass('is-active');
    $('#overlay').toggleClass('is-active');
  }

  function setupAnimation() {
    $('.animated').each(function () {
      const delay = $(this).data('delay');
      if (delay) {
        setTimeout(() => $(this).addClass($(this).data('animate')), delay);
      } else {
        $(this).addClass($(this).data('animate'));
      }
    });
  }

  function setupAnalytics() {
    (function (b, o, i, l, e, r) {
      b.GoogleAnalyticsObject = l;
      b[l] || (b[l] =
        function () {
          (b[l].q = b[l].q || []).push(arguments);
        });
      b[l].l = +new Date;
      e = o.createElement(i);
      r = o.getElementsByTagName(i)[0];
      e.src = 'https://www.google-analytics.com/analytics.js';
      r.parentNode.insertBefore(e, r);
    }(window, document, 'script', 'ga'));
    ga('create', model.GA);
    ga('send', 'pageview');
  }

})();
