(function($) {
    /** Start sliiide settings (Mobile navigation) **/
    var settings = {
        toggle: "#hamburger", // the selector for the menu toggle, whatever clickable element you want to activate or deactivate the menu. A click listener will be added to this element.
        //exit_selector: ".close", // the selector for an exit button in the div if needed, when the exit element is clicked the menu will deactivate, suitable for an exit element inside the nav menu or the side bar
        animation_duration: "0.5s", //how long it takes to slide the menu
        place: "right", //where is the menu sliding from, possible options are (left | right | top | bottom)
        animation_curve: "cubic-bezier(0.54, 0.01, 0.57, 1.03)", //animation curve for the sliding animation
        body_slide: true, //set it to true if you want to use the effect where the entire page slides and not just the div
        no_scroll: true //set to true if you want the scrolling disabled while the menu is active
    };

    var navigationMobile = $("#navigation-mobile");
    navigationMobile.sliiide(settings); //initialize sliiide

    navigationMobile.find('.navigation-item h4').on('click', selectItem);

    function selectItem(e) {
        var item = $(e.target).parent('.navigation-item');
        navigationMobile.find('.active').removeClass('active');
        item.addClass('active');
    }

    /** End sliiide settings (Mobile navigation) **/

    /** Start Swipe settings (Mobile slider) **/
    if (isLandingPage()) {

        var timeout = null;
        function initSwipeIfSmallScreen() {
            if (timeout) {
                window.clearTimeout(timeout);
            }
            timeout = window.setTimeout(function () {
                if (!isDesktopWidth() && !window.mySwipe) {
                    window.mySwipe = new Swipe(document.getElementById('slider'), {
                        startSlide: 0,
                        speed: 400,
                        auto: 3000,
                        continuous: true,
                        disableScroll: false,
                        stopPropagation: false,
                        callback: changeActiveDot
                    });

                    $('.slider-dots .slider-dot').on('click', goToSlide)

                } else if (isDesktopWidth() && window.mySwipe) {
                    window.mySwipe.kill();
                    window.mySwipe = null;
                    $('.slider-dots .slider-dot').off('click')
                }
            }, 500);
        }
        function changeActiveDot(index) {
            var sliderDotsElems = $('.slider-dots .slider-dot');
            sliderDotsElems.closest('.active').removeClass('active');
            sliderDotsElems.eq(index).addClass('active');
        }

        function goToSlide(e) {
            var index = $(e.target).data('index');
            window.mySwipe.slide(index);
        }

        initSwipeIfSmallScreen();
        $(window).on('resize', initSwipeIfSmallScreen);

    }

    /** End Swipe settings (Mobile slider) **/

    /** Start fixed menu settings **/
    window.setInterval(toggleMenuIfNeeded, 500);

    function toggleMenuIfNeeded() {
        var isScrolled = $('#menu').hasClass('scrolled');
        var top = $(window).scrollTop();
        if (isScrolled && top < 50) {
            showTopMenu();
        } else if (!isScrolled && top >= 50) {
            showScrolledMenu();
        }
    }

    function showScrolledMenu() {
        $('#menu').addClass('scrolled');
    }

    function showTopMenu() {
        $('#menu').removeClass('scrolled');
    }

    /** End fixed menu settings **/

    /** Start section scroll settings **/
    if (isLandingPage()) {
        var sectionScrollActive = false;

        function initSectionScrollIfLargeScreen() {
            var existsContentScrollable = $('.scrollable-section').length;
            if (!sectionScrollActive && existsContentScrollable && isDesktopWidth()) {
                sectionScrollActive = true;
                $('body .container').sectionScroll({easing: 'easeInOutQuart'});
            }
        }

        initSectionScrollIfLargeScreen();
        $(window).on('resize', initSectionScrollIfLargeScreen);
    }

    /** End fixed menu settings (on scroll) **/

    /** Start RSS settings **/
    var feed = "//brain.nekuno.com/client/blog-feed";

    $.ajax(feed, {
        accepts:{
            xml:"application/rss+xml"
        },
        dataType:"xml",
        success:function(data) {
            var articles = $("#blog-posts").find('article');
            $(data).find("item").each(function (index) { // or "item" or whatever suits your feed
                if (index > 2) {
                    return false;
                }
                var el = $(this);
                articles.eq(index).attr('onclick', 'window.location = "' + el.find("link").text() + '"');
                articles.eq(index).find('header h3').html(el.find("title").text());
                articles.eq(index).find('header figure figcaption').html(el.find("category").eq(0).text() || 'Sin categoría');
                articles.eq(index).find('header figure img').attr('src', el.find("image").text() || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
                articles.eq(index).find('time').html(el.find("pubDate").text());
                articles.eq(index).find('p').replaceWith(el.find("description").text());
                articles.eq(index).find('.comments-number').html(el.find("slash:comments").text() || 0);
                return true;
            });
        },
        error: function (jqXHR, status, error) {
            // For debug purposes
            //console.log(status);
            //console.log(error);
        }
    });

    /** End RSS settings **/

    /** Start Show login form if is desktop width **/
    $('.close-login-form').one('click', function() {
        $('.login-fixed-container').removeClass('active');
        $('.container').animate({opacity: 1}, 400);
    });
    $('.facebook-register-button button').on('click', function() {
        // Enable to show login form
        /*if (!isProduction() && !isLandingPage() && isDesktopWidth()) {
            window.location = window.location.pathname.replace(/\/[^\/]+$/, '/?showLoginForm=true');
        }
        else if (isDesktopWidth()) {
            $('.login-fixed-container').addClass('active');
            $('.container').animate({opacity: 0.3}, 400);
            $('.close-login-form').one('click', function() {
                $('.login-fixed-container').removeClass('active');
                $('.container').animate({opacity: 1}, 400);
            });
        } else {
            window.location = 'http://m.nekuno.com';
        }*/
        window.location = 'https://m.nekuno.com/#/?autoLogin=1';
    });
    $('a.request-invitation').on('click', function() {
        var loginButton = $('.login-button a')[0];
        loginButton.click();
        window.setTimeout(function() {
            if ($('.login-fixed-container').is(':hidden')) {
                loginButton.click();
            }
        }, 400);
    });
    /** End Show login form if is desktop width **/

    /** Start ajax login and invitation forms **/
    formAjaxRequest('invitation');
    formAjaxRequest('login');
    setBoxesHeight();

    function formAjaxRequest(formName) {
        var formLayout = $('#' + formName + '-box');
        formLayout.find('form').on('submit', function(e) {
            e.preventDefault();
            var loadingImg = '<img src="/bundles/qnoowapp/images/712.GIF" width="50" height="50" style="margin-left: 90px;">';
            $.ajax($(this).attr('action'), {
                accepts:{
                    json:"application/json"
                },
                dataType:"json",
                data: $(this).serialize(),
                type: 'POST',
                beforeSend: function() {
                    formLayout.find('form').hide(400);
                    formLayout.find('form').after(loadingImg);
                    formLayout.find(".alert-box").text('');
                },
                complete: function() {
                    formLayout.find('form').show(400);
                    window.setTimeout(setBoxesHeight, 400);
                },
                success: function(data) {
                    var text = data.message || '';
                    formLayout.find(".alert-box").text(text);
                    if (formName == 'login') {
                        window.location = window.location.pathname.replace(/\/[^\/]+$/, '/');
                        formLayout.find('form').remove();
                    } else {
                        formLayout.find('form').siblings('img').first().remove();
                    }
                },
                error: function (jqXHR) {
                    formLayout.find('form').siblings('img').first().remove();
                    var text = jqXHR.responseJSON.message || '';
                    formLayout.find(".alert-box").text(text);
                }
            });
        });
    }

    function setBoxesHeight() {
        var boxes = $('#invitation-box, #login-box');
        boxes.height('auto');
        var maxHeight = Math.max($('#invitation-box').height(), $('#login-box').height());
        boxes.height(maxHeight);
    }

    /** End ajax login and invitation forms **/

    /** Start change "About us" rand word **/
    if (isAboutUsPage()) {
        var changingWordsContainer = $('#changing-words');
        var index = 1;
        var currentWord = changingWordsContainer.find('.changing-word-' + index).text();
        var wordElem = $('.changing-word');
        setInterval(function() {
            if(currentWord = changingWordsContainer.find('.changing-word-' + (index + 1)).text()) {
                index++;
            } else {
                index = 1;
                currentWord = changingWordsContainer.find('.changing-word-' + (index)).text()
            }
            wordElem.text(currentWord);
        }, 500)
    }

    /** End change "About us" rand word **/

    /** Start change internet users number **/
    var defaultUsersNum = 3376668;
    var initialTimestamp = 1464264268;
    replaceInternetUsersNum(defaultUsersNum, initialTimestamp);
    setInterval(function() {
        replaceInternetUsersNum(defaultUsersNum, initialTimestamp)
    }, 100000);

    function replaceInternetUsersNum(defaultUsersNum, initialTimestamp) {
        var currentTimestamp = Math.round(new Date().getTime()/1000);
        var totalUsers = defaultUsersNum + Math.round((currentTimestamp - initialTimestamp) / 100);
        $('.internet-users-number').text(numberWithCommas(totalUsers));
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (!Date.now) {
        Date.now = function() { return new Date().getTime(); }
    }

    /** End change internet users number **/

    /** Parallax */
    if (isLandingPage()) {
        $(window).on('scroll', parallaxScroll);
    }

    function parallaxScroll(){
        var scrolled = $(window).scrollTop();
        $('.for-you-background').css('top', (scrolled*.35)+'px');
    }

    /** End Parallax */

    function isDesktopWidth() {
        /** Check media query rule instead of $(window).width, which could cause weird results **/
        return $('#navigation').css('display') == 'block';
    }

    function isLandingPage() {
        return window.location.pathname.match(/$/);
    }
    function isAboutUsPage() {
        return window.location.pathname.match(/\/about-us$/);
    }
    function isProduction() {
        return window.location.hostname === 'nekuno.com';
    }
})(jQuery);
