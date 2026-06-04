/* =====================================================
   Salt & Shell - script.js
   Uses jQuery for: smooth scrolling, nav highlight,
   AJAX menu loading, menu filter, gallery lightbox,
   mobile menu toggle and the contact form handler.
   ===================================================== */

$(function () {

    // ---------- Set current year in the footer ----------
    $('#year').text(new Date().getFullYear());

    // ---------- Smooth scroll for in-page nav links ----------
    // Listen for any anchor that points to an ID on this page
    $('a[href^="#"]').on('click', function (e) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();

            // Account for fixed navbar height
            var navHeight = $('.navbar').outerHeight();

            $('html, body').animate({
                scrollTop: target.offset().top - navHeight + 1
            }, 600);

            // Close the mobile menu after a link is clicked
            $('#navLinks').removeClass('open');
        }
    });

    // ---------- Mobile menu toggle ----------
    $('#menuToggle').on('click', function () {
        $('#navLinks').toggleClass('open');
    });

    // ---------- Highlight nav link for the section in view ----------
    var sections = $('section');
    var navLinks = $('.nav-links a');

    $(window).on('scroll', function () {
        var scrollPos = $(window).scrollTop() + $('.navbar').outerHeight() + 10;

        sections.each(function () {
            var top = $(this).offset().top;
            var bottom = top + $(this).outerHeight();

            if (scrollPos >= top && scrollPos < bottom) {
                var id = $(this).attr('id');
                navLinks.removeClass('active');
                $('.nav-links a[href="#' + id + '"]').addClass('active');
            }
        });
    });

    // ---------- AJAX: load menu items from data/menu.json ----------
    // Using $.getJSON which is a jQuery AJAX helper.
    $.getJSON('data/menu.json')
        .done(function (items) {
            renderMenu(items);
        })
        .fail(function () {
            $('#menuGrid').html('<p class="loading">Could not load the menu. Please try again later.</p>');
        });

    // Keep a copy of the loaded items so filters can re-render quickly
    var allItems = [];

    function renderMenu(items) {
        allItems = items;
        showItems('all');
    }

    function showItems(filter) {
        var grid = $('#menuGrid');
        grid.empty();

        // Pick which items to display based on the chosen filter
        var visible = allItems.filter(function (item) {
            return filter === 'all' || item.category === filter;
        });

        if (visible.length === 0) {
            grid.html('<p class="loading">No items in this category.</p>');
            return;
        }

        // Build each card and add it to the grid
        visible.forEach(function (item) {
            var card = $(
                '<div class="menu-card">' +
                    '<div class="info">' +
                        '<h3><span>' + item.name + '</span>' +
                        '<span class="price">' + item.price + '</span></h3>' +
                        '<p class="desc">' + item.desc + '</p>' +
                    '</div>' +
                '</div>'
            );
            grid.append(card);
        });
    }

    // ---------- Menu category filter buttons ----------
    $('.filter-btn').on('click', function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        showItems($(this).data('filter'));
    });

    // ---------- Gallery lightbox ----------
    $('.g-item').on('click', function () {
        $('#lightboxImg').attr('src', $(this).attr('src'));
        $('#lightbox').addClass('open');
    });

    // Close lightbox when the X or the dark backdrop is clicked
    $('#lightboxClose, #lightbox').on('click', function (e) {
        if (e.target.id === 'lightbox' || e.target.id === 'lightboxClose') {
            $('#lightbox').removeClass('open');
        }
    });

    // ---------- Contact form: simple validation + thank-you message ----------
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();

        var name = $('#name').val().trim();
        var email = $('#email').val().trim();

        if (name === '' || email === '') {
            $('#formMsg').css('color', '#b4593a')
                         .text('Please fill in your name and email.');
            return;
        }

        // In a real site this would post to a server.
        // For this coursework demo we just show a confirmation.
        $('#formMsg').css('color', '#2b6e3a')
                     .text('Thank you, ' + name + '! We will be in touch shortly.');
        this.reset();
    });

});
