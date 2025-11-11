// jQuery Assignment Implementation
$(document).ready(function(){
    console.log("jQuery is ready!");
    
    // ======================================
    // PART 1: jQuery Search Features
    // ======================================
    
    // Task 1: Real-time Search and Live Filter
    initRealTimeSearch();
    
    // Task 2: Autocomplete Search Suggestions
    initAutocomplete();
    
    // Task 3: Search Highlighting
    initSearchHighlighting();
    
    // ======================================
    // PART 2: UX Engagement Elements
    // ======================================
    
    // Task 4: Scroll Progress Bar
    initScrollProgressBar();
    
    // Task 5: Animated Number Counter
    initAnimatedCounter();
    
    // Task 6: Loading Spinner on Submit
    initLoadingSpinner();
    
    // ======================================
    // PART 3: Web App Functionality
    // ======================================
    
    // Task 7: Notification System (Toasts)
    initToastNotifications();
    
    // Task 8: Copy to Clipboard
    initCopyToClipboard();
    
    // Task 9: Image Lazy Loading
    initLazyLoading();
});

// Task 1: Real-time Search and Live Filter
function initRealTimeSearch() {
    const $searchBar = $('#real-time-search');
    if ($searchBar.length === 0) return;
    
    const searchableItems = [
        { text: 'Смартфон Pro X', category: 'Смартфоны' },
        { text: 'Ноутбук UltraBook 15', category: 'Ноутбуки' },
        { text: 'Наушники SoundWave', category: 'Аксессуары' },
        { text: 'DevBook Max 16', category: 'Ноутбуки' },
        { text: 'EdgePhone 13', category: 'Смартфоны' },
        { text: 'Nova Compact', category: 'Смартфоны' },
        { text: 'SoundWave Studio', category: 'Аксессуары' },
        { text: 'PulseWatch Pro', category: 'Умные часы' },
        { text: 'Smart Home Kit', category: 'Умный дом' },
        { text: 'Aura Light Bar', category: 'Умный дом' }
    ];
    
    $searchBar.on('keyup', function() {
        const query = $(this).val().toLowerCase();
        const $container = $('#search-results');
        
        if (!query) {
            $container.empty();
            return;
        }
        
        const filtered = searchableItems.filter(item => 
            item.text.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );
        
        $container.empty();
        
        if (filtered.length > 0) {
            filtered.forEach(item => {
                $container.append(`
                    <div class="card mb-2 search-result-item">
                        <div class="card-body py-2">
                            <h6 class="mb-0">${item.text}</h6>
                            <small class="text-muted">${item.category}</small>
                        </div>
                    </div>
                `);
            });
        } else {
            $container.html('<div class="alert alert-info">Ничего не найдено</div>');
        }
    });
}

// Task 2: Autocomplete Search Suggestions
function initAutocomplete() {
    const $autocompleteInput = $('#autocomplete-search');
    if ($autocompleteInput.length === 0) return;
    
    const suggestions = [
        'Смартфон Pro X',
        'Ноутбук UltraBook',
        'Наушники SoundWave',
        'DevBook Max',
        'EdgePhone 13',
        'Nova Compact',
        'SoundWave Studio',
        'PulseWatch Pro',
        'Smart Home Kit',
        'Aura Light Bar',
        'Игровой ноутбук',
        'Беспроводные наушники',
        'Умные часы',
        'Умная подсветка'
    ];
    
    let $suggestionsContainer = $('#autocomplete-suggestions');
    
    $autocompleteInput.on('keyup', function() {
        const query = $(this).val().toLowerCase();
        
        if (!query) {
            $suggestionsContainer.empty();
            return;
        }
        
        const matches = suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(query)
        ).slice(0, 5);
        
        $suggestionsContainer.empty();
        
        matches.forEach(suggestion => {
            $suggestionsContainer.append(`
                <div class="suggestion-item list-group-item list-group-item-action">
                    ${suggestion}
                </div>
            `);
        });
    });
    
    // Handle suggestion click
    $(document).on('click', '.suggestion-item', function() {
        const suggestionText = $(this).text().trim();
        $autocompleteInput.val(suggestionText);
        $suggestionsContainer.empty();
        showToast('Товар выбран: ' + suggestionText, 'success');
    });
}

// Task 3: Search Highlighting
function initSearchHighlighting() {
    const $highlightSearch = $('#highlight-search');
    if ($highlightSearch.length === 0) return;
    
    const $targetContent = $('.searchable-content');
    
    $highlightSearch.on('keyup', function() {
        const query = $(this).val();
        const $content = $targetContent;
        
        // Remove previous highlights
        $content.find('.highlight-mark').each(function() {
            $(this).replaceWith($(this).html());
        });
        
        if (!query) return;
        
        // Highlight matching text using regex
        const regex = new RegExp(`(${query})`, 'gi');
        
        $content.each(function() {
            const html = $(this).html();
            const highlighted = html.replace(regex, '<mark class="highlight-mark bg-warning">$1</mark>');
            $(this).html(highlighted);
        });
    });
}

// Task 4: Scroll Progress Bar
function initScrollProgressBar() {
    // Create progress bar element
    const $progressBar = $('<div class="scroll-progress-bar"></div>');
    $('body').append($progressBar);
    
    $(window).on('scroll', function() {
        const scrollTop = $(window).scrollTop();
        const documentHeight = $(document).height();
        const windowHeight = $(window).height();
        const scrollableHeight = documentHeight - windowHeight;
        const scrolled = (scrollTop / scrollableHeight) * 100;
        
        $progressBar.css('width', scrolled + '%');
    });
}

// Task 5: Animated Number Counter
function initAnimatedCounter() {
    const $counters = $('.animated-counter');
    
    if ($counters.length === 0) return;
    
    $counters.each(function() {
        const $counter = $(this);
        const target = parseInt($counter.data('target')) || 1000;
        const duration = parseInt($counter.data('duration')) || 2000;
        const suffix = $counter.data('suffix') || '';
        
        if ($counter.data('animated')) return;
        
        const animate = () => {
            const current = parseInt($counter.text()) || 0;
            if (current < target) {
                const increment = Math.ceil(target / 50);
                const newValue = Math.min(current + increment, target);
                $counter.text(newValue + suffix);
                setTimeout(animate, duration / 50);
            }
        };
        
        // Start animation when element is visible
        const checkVisibility = () => {
            const elementTop = $counter.offset().top;
            const elementBottom = elementTop + $counter.outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                if (!$counter.data('animated')) {
                    $counter.data('animated', true);
                    animate();
                }
            }
        };
        
        $(window).on('scroll', checkVisibility);
        checkVisibility(); // Check on load
    });
}

// Task 6: Loading Spinner on Submit
function initLoadingSpinner() {
    $('form').on('submit', function(e) {
        const $form = $(this);
        const $submitBtn = $form.find('button[type="submit"], input[type="submit"]');
        
        if ($form[0].checkValidity()) {
            // Simulate server call
            $submitBtn.prop('disabled', true);
            $submitBtn.html('<span class="spinner-border spinner-border-sm me-2"></span>Пожалуйста, подождите...');
            
            // Reset after 3 seconds
            setTimeout(() => {
                $submitBtn.prop('disabled', false);
                $submitBtn.html('Отправить');
                showToast('Форма успешно отправлена!', 'success');
                $form[0].reset();
            }, 10000);
        }
    });
}

// Task 7: Toast Notifications
function initToastNotifications() {
    // Create toast container if it doesn't exist
    if ($('#toast-container').length === 0) {
        $('body').append('<div id="toast-container" class="position-fixed top-0 end-0 p-3" style="z-index: 1080;"></div>');
    }
}

function showToast(message, type = 'success') {
    // Ensure container exists
    initToastNotifications();
    
    const $toast = $('<div class="toast align-items-center text-white bg-' + type + ' border-0" role="alert" aria-live="assertive" aria-atomic="true">' +
        '<div class="d-flex">' +
        '<div class="toast-body">' + message + '</div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>' +
        '</div>' +
        '</div>');
    
    $('#toast-container').append($toast);
    
    const bsToast = new bootstrap.Toast($toast[0], {
        autohide: true,
        delay: 3000
    });
    
    bsToast.show();
    
    // Remove toast element after it's hidden
    $toast.on('hidden.bs.toast', function() {
        $(this).remove();
    });
}

// Task 8: Copy to Clipboard
function initCopyToClipboard() {
    // Add copy buttons to code snippets and text blocks
    $('.copyable-text').each(function() {
        const $textBlock = $(this);
        const $copyBtn = $('<button class="btn btn-sm btn-outline-primary copy-btn"><i class="bi bi-clipboard"></i> Копировать</button>');
        
        $textBlock.after($copyBtn);
    });
    
    $(document).on('click', '.copy-btn', function() {
        const $btn = $(this);
        const textToCopy = $btn.prev('.copyable-text').text();
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            $btn.html('<i class="bi bi-check-circle-fill"></i> Скопировано!');
            $btn.removeClass('btn-outline-primary').addClass('btn-success');
            
            showToast('Текст скопирован в буфер обмена!', 'success');
            
            setTimeout(() => {
                $btn.html('<i class="bi bi-clipboard"></i> Копировать');
                $btn.removeClass('btn-success').addClass('btn-outline-primary');
            }, 2000);
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            showToast('Не удалось скопировать текст', 'error');
        });
    });
}

// Task 9: Image Lazy Loading
function initLazyLoading() {
    // Function to check if image is in viewport
    function isInViewport($img) {
        const elementTop = $img.offset().top;
        const elementBottom = elementTop + $img.outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();
        
        return elementBottom > viewportTop && elementTop < viewportBottom;
    }
    
    // Lazy load images
    function lazyLoadImages() {
        $('img[data-lazy-src]').each(function() {
            const $img = $(this);
            const lazySrc = $img.data('lazy-src');
            
            if (isInViewport($img) && lazySrc && !$img.hasClass('lazy-loaded')) {
                $img.attr('src', lazySrc);
                $img.removeAttr('data-lazy-src');
                $img.addClass('lazy-loaded');
                
                // Show notification
                if (typeof showToast !== 'undefined') {
                    showToast('Изображение загружено', 'info');
                }
            }
        });
    }
    
    // Initial load
    lazyLoadImages();
    
    // Load on scroll with throttling
    let scrollTimeout;
    $(window).on('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(lazyLoadImages, 100);
    });
    
    // Load on resize
    $(window).on('resize', function() {
        lazyLoadImages();
    });
}

// Make showToast globally available
window.showToast = showToast;

