var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null){
    return null;
  }
  else {
    return decodeURI(results[1]) || 0;
  }
}

var GUI = window.GUI || (function(){
  return {
    init: function(){
      GUI.baseUI($(document));

      AOS.init({ // https://github.com/michalsnik/aos#1-initialize-aos
        duration: 600,
        once: true,
      });
      
      if ($('.menu-wrap').length) {
        GUI.gnbMenu();
      }
    },
    baseUI: function($this){
      var _ = $this;
      var $win = $(window);
      var $wrapper = _.find('#wrapper');
      var $header = _.find('#header');
      var $footer = _.find('#footer');
      var $container = _.find('#container');
      var $search = _.find('.search-top');
      var $input = _.find('.input-base');
      var $tab = _.find('.tab-base');
      var $fix_btn = _.find('.fix-btn-area');
      var $popup = _.find('.popup-wrap');
      var $select = _.find(".select-ui");

      GUI.mainScroll();

      if ($header.length) {
        $header.find('.m-btn-search').on('click', function(e){
          e.preventDefault();
          $('.m-search-area').show();
        });
      }

      if ($footer.length) {
        var footerDt = $footer.find('.address dt');
        footerDt.on('click', function(){
          if (!$(this).hasClass('on')) {
            $(this).addClass('on');
            $(this).next('dd').stop().slideDown(300);
          } else {
            $(this).removeClass('on');
            $(this).next('dd').stop().slideUp(300);
          }
        });
        if (footerDt.hasClass('on')) {
          footerDt.next('dd').show();
        }
        if ($('.content-wrap.main').length) { // 추후 모바일에서 메인이 보여야하는 경우 내용이 추가될 수 있음.
          $wrapper.addClass('ver_main');
        }
      }

      if ($('.my-top').length) {
        $wrapper.addClass('ver_mypage');
      }

      if ($search.length) {
        $container.addClass('ver_search');

        $search.find('.filter-area .label').on('click', function(){
          if (!$(this).closest('.filter-area').hasClass('on')) {
            $(this).closest('.filter-area').addClass('on');
            if ($(window).width() <= 750) {
              $('.search-dimm').show();
            }
          } else {
            $(this).closest('.filter-area').removeClass('on');
            if ($(window).width() <= 750) {
              $('.search-dimm').hide();
            }
          }
        });

        $('.search-dimm').on('click', function(){
          $(this).hide();
          $('.filter-area').removeClass('on');
        });

        $search.find('.filter-area .list li a').on('click', function(e){
          e.preventDefault();
          var $target = $(this).closest('li');
          $('.search-top .filter-area .list').find(`li:nth-child(${$target.index() + 1})`).addClass('on');
          $('.search-top .filter-area .list').find(`li:nth-child(${$target.index() + 1})`).siblings().removeClass('on');

          $('.search-top .filter-area .label').text($(this).text());
          $('.search-top .filter-area').removeClass('on');
          $('.search-dimm').hide();
        });
      }

      if ($input.length) {
        $input.each(function(){
          if ($(this).val().length) {
            $(this).closest('.input-wrap').find('.btn-delete').show();
          }
        })
        $input.on('keyup', function(){
          if ($(this).val().length) {
            $(this).closest('.input-wrap').find('.btn-delete').show();
          } else {
            $(this).closest('.input-wrap').find('.btn-delete').hide();
          }
        });
        $('.input-wrap .btn-delete').on('click', function(e){
          e.preventDefault();
          $(this).hide();
          $(this).closest('.input-wrap').find('.input-base').val('').focus();
        })
      }

      if ($tab.length) {
        if ($('.tab-top').length) {
          $container.addClass('ver_tab');
        }
        $tab.each(function(){
          var target = $(this).find('li.on').find('a').attr('href');
          $(target).show();
        })
        $tab.find('a').on('click', function(e){
          e.preventDefault();
          var target = $(this).attr('href');
          $(this).closest('li').addClass('on');
          $(this).closest('li').siblings().removeClass('on');
          $(target).show();
          $(target).siblings().hide();
        });
      }

      if ($fix_btn.length) {
        if ($fix_btn.find('.btn-base').length == 1) {
          $wrapper.addClass('ver_fix_btn');
        } else if ($fix_btn.find('.btn-base').length == 2) {
          $wrapper.addClass('ver_fix_btn btn_2');
        }
      }

      if ($popup.length) {
        var posY = null;
        var magnificPopupConfiguration = function() {
          return {
            beforeOpen: function() {
              posY = window.pageYOffset;
              $('html').css('overflow', 'hidden');
              $('body').css({'position': 'fixed', 'top': -posY});
            },
            resize: function() {
              if ($('.fix-bottom').length) {
                var $coWrap = $('.fix-bottom .popup-wrap .con-wrap');
                if ($coWrap.hasClass('ws')) {
                  $coWrap.children('div').css('max-height', $win.height() - 202 + 'px');
                }
                if ($coWrap.outerHeight() > $win.height() / 3 * 2.3) {
                  $coWrap.addClass('ws');
                  $coWrap.children('div').css('max-height', $win.height() - 202 + 'px');
                }
              }
            },
            open: function() {},
            beforeClose: function() {
              $('html').css('overflow', '');
              $('body').css({'position': '', 'top': ''});
              window.scrollTo(0, posY);
            }
          }
        }
  
        //팝업 (공통) - jquery magnific 팝업
        _.find('.btn-base.disabled, .all-view.disabled, .add-mylist.disabled').on('click', function (e) { // 비활성화 버튼
          e.preventDefault();
        });
        _.find('.btn-popup-modal a').magnificPopup({
          type: 'inline',
          preloader: false,
          modal: false
        });
        $(document).on('click', '.b-mfp-close', function (e) {
          e.preventDefault();
          $.magnificPopup.close();
        });
        
        _.find('.btn-popup-anim-1:not(.disabled) a, a.btn-popup-anim-1:not(.disabled)').magnificPopup({
          type: 'inline',
          fixedContentPos: true,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'mfp-zin'
        });
        _.find('.btn-popup-anim-2:not(.disabled) a').magnificPopup({
          type: 'inline',
          fixedContentPos: false,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'mfp-slide-b'
        });
        _.find('.btn-popup-anim-3:not(.disabled) a, a.btn-popup-anim-3:not(.disabled)').magnificPopup({
          type: 'inline',
          fixedContentPos: true,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'fade-slideup fix-bottom',
          callbacks: magnificPopupConfiguration()
        });

		    $('.popup-wrap').each(function(){
          if ($(this).data('width')) {
            $(this).css('max-width', $(this).data('width') + 40);
          }
        });
      }

      if ($select.length) {
        $select.children('a').on('click', function(e){
          e.preventDefault();
          var $selectUi = $(this).closest('.select-ui');
          if (!$selectUi.hasClass('on')) {
            $selectUi.addClass('on');
          } else {
            $selectUi.removeClass('on');
          }
        });

        $select.find('li a').on('click', function(e){
          var $selectUi = $(this).closest('.select-ui');
          e.preventDefault();
          $(this).closest('li').addClass('on');
          $(this).closest('li').siblings().removeClass('on');
          $selectUi.children('a').text($(this).text());
          $selectUi.removeClass('on');
        });
      }

      _.on('click', function(e){
        // if (!$(e.target).closest('.select-box .value, .select-box ul').length) {
        // }
      });
    },
    gnbMenu: function(){
      $(window).on('load resize', function(){
        $('.menu-wrap .m-container').each(function(){
          $(this).css({height: $(window).height() - $('.menu-wrap .m-header').outerHeight()});
        });

        if ($(window).width() > 750) {
          closeGNB();
        }
      });

      $('.fm-wrap li.menu a').on('click', function(e){
        e.preventDefault();
        openGNB();
      });

      $('.menu-wrap .btn-close').on('click touchstart', function(e){
        e.preventDefault();
        closeGNB();
      });
    },
    mainScroll: function(){
      var $doc = $(document), $win = $(window);
      var didScroll ,lastScrollTop = 0, delta = 5;
      var $fmWrap = $('.fm-wrap'), $top = $('.btn-top'), $header = $('#header');

      $header.addClass('on');

      $win.on('scroll', function(){
        didScroll = true;
      });
      
      setInterval(function(){
        if (didScroll) {
          hasScrolled();
          didScroll = false;
        }
      }, 250)

      function hasScrolled() {
        var st = $(this).scrollTop();
        if(Math.abs(lastScrollTop - st) <= delta) return;
        if (st > lastScrollTop && st > $fmWrap.outerHeight()){ // Scroll Down
          $fmWrap.addClass('on');
          $top.addClass('on');
          $header.addClass('on');
          if ($('.search-paging').length) {
            $('.search-paging').addClass('on');
          }
        } else {
          if(st + $win.height() < $doc.height()) { // Scroll Up
            $fmWrap.removeClass('on');
            $top.removeClass('on');
            $header.removeClass('on');
            if ($('.search-paging').length) {
              $('.search-paging').removeClass('on');
            }
          }
        }
        if (st === 0) $header.addClass('on');
        lastScrollTop = st;
      }

      $top.on('click', function(){
        $('html, body').stop().animate({ scrollTop: 0 }, 150);
      });
    },
  }
}());

$(function(){
  GUI.init();
});

var rememberY = null;
var openGNB = function() {
  $('.menu-wrap').addClass('on');
  $('.menu-dimm').fadeIn(150);
  $('.m-section#menu-area').addClass('on');
  rememberY = window.pageYOffset;
  $('html').css('overflow', 'hidden');
  $('body').css({'position': 'fixed', 'top': -rememberY});
}
var closeGNB = function(){
  $('.menu-wrap').removeClass('on');
  $('.menu-dimm').fadeOut(150);
  $('html').css('overflow', '');
  $('body').css({'position': '', 'top': ''});
  window.scrollTo(0, rememberY);
}

function getOptions(id, closeOnBgClick) {
  return {
    items: {
      src: id,
      type: 'inline',
    },
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'mfp-zin',
    closeOnBgClick: closeOnBgClick ?? true,
  };
}