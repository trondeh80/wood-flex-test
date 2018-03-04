(function () {
  const $ = window.jQuery;
  const imageUrlHash = 'mobelverksted';
  const model = {
    currentIndex: 0,
    images: [],
    GA: 'UA-1139355-43',
    allLoaded: false,
    urlHashRE: /^\#[a-z]+\-/
  };

  $(document).ready(documentReady);

  function documentReady() {
    setupLightbox(); // attach gallery events
    setupAnimation();
    setupAnalytics();
    addEvents();
  }

  /***
   *  Gallery code
   *  - activates only if gallery in dom
   *  - Stores all images in model.images
   *  - Checks url for #image-N
   */
  function setupLightbox() {
    if ($('.gallery, .image-preview').length) {
      model.images = [];
      $('.gallery .gallery-item').each(function(){
        const linkItem = $('a', $(this));
        const galleryItem = createGalleryItem(linkItem.attr('href'), $(this));
        linkItem.click(getSingleImageClickEvent(galleryItem));
        model.images.push(galleryItem);
      });

      if (window.location.hash && window.location.hash.match(model.urlHashRE)) {
        const index = window.location.hash.replace(model.urlHashRE, '');
        if (!isNaN(index)) {
          model.currentIndex = Number(index);
          setLightboxImage(model.images[index]);
          $('#overlay').addClass('open'); // opens the modal
        }
      }

      $(document).keyup((event) => {
        if (event.which ===  27) {
          closeMenu(event);
        }
      });

      $('.nav-left').click(getNavigateListener(-1));
      $('.nav-right').click(getNavigateListener(1));
    }
  }

  function getNavigateListener(direction = 1) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();
      model.currentIndex = getNextIndex(model.currentIndex, direction);
      setLightboxImage(model.images[model.currentIndex]);
    }
  }

  function createGalleryItem(url, imageDom) {
    const galleryItem = {
      galleryItem: imageDom,
      url: url,
      image: new Image(),
      isLoaded: false,
      load: () => {
        galleryItem.image.src = galleryItem.url;
        return new Promise((resolve) => {
          galleryItem.image.addEventListener('load', () => {
            galleryItem.isLoaded = true;
            resolve(galleryItem);
          });
        });
      }
    };
    return galleryItem;
  }

  // Get click listener
  function getSingleImageClickEvent(image) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();
      model.currentIndex = model.images.indexOf(image);
      setLightboxImage(image);
    };
  }

  function setLightboxImage(galleryItem) {
    $('#overlay').addClass('open'); // opens the modal
    $('body').addClass('overlay-open');

    const contentNode = $('.modal > .modal-inner > .content');
    const domImage = $('.modal > .modal-inner > .content .image-full .image-container img');

    if (domImage.length) {
      domImage.remove();
    }

    contentNode.addClass('is-loading');

    if (galleryItem.isLoaded) {
      updateImageData(contentNode, galleryItem);
    } else {
      galleryItem.load().then(() => updateImageData(contentNode, galleryItem));
    }
  }

  function isAllLoaded() {
    return model.allLoaded || (model.allLoaded = model.images.reduce((memo, item) => {
      return memo === true && item.isLoaded;
    }, true));
  }

  // Shows image in view
  // Preloads next 3 images
  // Todo: update texts and og:image
  function updateImageData(contentNode, currentImage) {
    contentNode.removeClass('is-loading');

    $('.image-full .image-container', contentNode).html(`<img class="lb-image fullsize-image" src="${currentImage.url}" />`);

    history.pushState(null, null, `#${imageUrlHash}-${model.currentIndex}`);

    // Preload the next three images.
    if (!isAllLoaded()) {
      preloadItems(3);
    }
  }

  function preloadItems(interval) {
    let c = 0, currentIndex = model.currentIndex;
    while (c <= interval && !isAllLoaded()) {
      currentIndex = getNextIndex(currentIndex);
      const galleryItem = model.images[currentIndex];
      if (!galleryItem.isLoaded) {
        galleryItem.load();
        c++;
      }
    }
  }

  function setNextImage(event) {
    event.preventDefault();
    event.stopPropagation();

    model.currentIndex = getNextIndex();
    const image = model.images[model.currentIndex];
    setLightboxImage(image);
  }

  function getNextIndex(nextIndex = null , dir = 1) {
    const index = nextIndex !== null ? nextIndex : model.currentIndex;
    if (dir > 0) {
      return index < model.images.length - 1 ? index + 1 : 0;
    } else {
      return index > 0 ? index - 1 : model.images.length - 1;
    }
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
    $('body').removeClass('overlay-open');
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

  function reflowPage() {
    const originalBodyStyle = getComputedStyle(document.body).getPropertyValue('display');
    document.body.style.display = 'none';
    setTimeout(() => (document.body.style.display = originalBodyStyle), 10);
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

  function addEvents() {
    $('.menu-icon').click(toggleMenu);
    $('.overlay').click(closeMenu);
    $('.menu-icon-close').click(closeMenu);
    $('.email').html(getEmail());
    $('.email-link').attr('href', `mailto:${getEmail()}`);

    $(document).on('click', '#overlay .modal > .modal-inner > .content img', model, setNextImage);
    window.addEventListener('orientationchange', reflowPage);

    $('form').each(function () {
      addFormValidation($(this));
    });
  }

})();
