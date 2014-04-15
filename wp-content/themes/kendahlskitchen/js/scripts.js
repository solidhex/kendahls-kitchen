// Modernizr.load loading the right scripts only if you need them
Modernizr.load([
{
    // Let's see if we need to load selectivizr
    test : Modernizr.borderradius,
    // Modernizr.load loads selectivizr and Respond.js for IE6-8
    nope : [flo.template_dir + '/js/libs/selectivizr.min.js', flo.template_dir + '/js/libs/respond.min.js']
},{
    test: Modernizr.touch,
    yep:flo.template_dir + '/css/touch.css'
}
]);

jQuery(function($) {
    var is_single = $('#post').length;
    var posts = $('article.post');
    var is_mobile = parseInt(flo.is_mobile);
	
    var slider_settings = {
        animation: "slide",
        slideshow: false,
        controlNav: false
    }
    
    $('#searchform label').inFieldLabels();
    $('#sidebar .subscribe label').inFieldLabels();
    
    $('#sidebar .move-top').click(function(){
        $.scrollTo($('body'), 'slow');
        return false;
    })
    $('#sidebar .filter h2').click(function(){
        var obj = $(this);

        if(obj.siblings('ul').is(':visible')){
            obj.removeClass('active');
            obj.siblings('ul').slideUp();
        }else{
            obj.addClass('active');
            obj.siblings('ul').slideDown();
        }
        return false;
    })
    $("body").click(function(event) {
        //console.log("clicked: " + event.target.nodeName);
        
        if($('#sidebar .filter ul').is(':visible')){
            $('#sidebar .filter ul').slideUp('slow', function(){
                $(this).siblings('h2').removeClass('active');
            })
        }
    });
    
    $window = $(window);
    $wrapper = $('')

    // open external links in new window
    $("a[rel*=external]").each(function(){
        $(this).attr('target', '_blank');
    });
	
    $.fn.init_posts = function() {
        var init_post = function(data) {
            // close other posts
            data.post.siblings('.open-post').find('.preview a.toggle').trigger('click', {
                hide:true
            });
			
            var loading = data.post.find('span.loading');
			
            if (data.more.is(':empty')) {
                data.post.addClass('post-loading');
                loading.css('visibility', 'visible');
                data.more.load(flo.ajax_load_url, {
                    'action':'flotheme_load_post',
                    'id':data.post.data('post-id')
                }, function(){
                    loading.remove();
                    data.more.slideDown(400, function(){
                        data.post.removeClass('post-loading');
                        data.post.addClass('open-post');
                        //data.toggler.text('Close Post');
                        $('.video', data.more).fitVids();
                        if (data.scroll) {
                            $.scrollTo(data.scroll,'fast');
                        }
                    });
                    init_comments(data.post);
                        
                    $('.more .toggle', data.post).click(function(e){
                        e.preventDefault();
                        $(this).parents('article.post').find('.preview a.toggle').trigger('click');
                    });
                    //$(".respond form label", data.post).inFieldLabels();
                });
            } else {
                data.more.slideDown(400, function(){
                    data.post.addClass('open-post');
                    //data.toggler.text('Close Post');
                    if (data.scroll) {
                        $.scrollTo(data.scroll,'fast');
                        //data.scroll.scrollTo('fast');
                    }
                });
            }
        }

        var load_post = function(e, _opts) {
            e.preventDefault();
            var data  = {
                toggler:$(this),
                scroll:false
            };
            var opts = $.extend({
                comments:false,
                hide:false,
                add_comment:false
            }, _opts);
            data.post = data.toggler.parents('article.post');
            data.more = data.post.find('.more');
			
            if (data.more.is(':visible')) {
                if (opts.hide == true) {
                    // quick hide for multiple posts
                    data.more.hide();
                } else {
                    data.more.slideUp(400);
                    $.scrollTo(data.post,'fast');
                }
                //data.toggler.text('Open Post');
                data.post.removeClass('open-post');
            } else {
                if (typeof(e.originalEvent) != 'undefined' ) {
                    data.scroll = data.post;
                }
                init_post(data);
            }
        }
		
        var init_comments = function(post) {
            var respond = $('section.respond', post);
            var respond_form = $('form', respond);
            var respond_form_error = $('p.error', respond_form);
            var respond_cancel = $('.cancel-comment-reply a', respond);
            var comments = $('section.comments', post);
            var confirmation = $('#commments-confirmation', respond);
            
            $('body').append(confirmation)
            
            confirmation.find('.close').click(function(){
                $(this).parent().fadeOut();
                $('#contact-result-shadow').hide();
                $.scrollTo(comments.find('li:last'));
            })
            
            respond_form.find('label').inFieldLabels();
			
            $('a.comment-reply-link', post).on('click', function(e){
                e.preventDefault();
                var comment = $(this).parents('li.comment');
                comment.find('>div').append(respond);
                respond_cancel.show();
                respond.find('input[name=comment_post_ID]').val(post.data('post-id'));
                respond.find('input[name=comment_parent]').val(comment.data('comment-id'));
                respond.find('input:first').focus();
            }).attr('onclick', '');
			
            respond_cancel.on('click', function(e){
                e.preventDefault();
                comments.after(respond);
                respond.find('input[name=comment_post_ID]').val(post.data('post-id'));
                respond.find('input[name=comment_parent]').val(0);
                $(this).hide();
            });
			
            respond_form.ajaxForm({
                'beforeSubmit':function(){
                    respond_form_error.text('').hide();
                },
                'success':function(_data){
                    var data = $.parseJSON(_data);
                    if (data.error) {
                        respond_form_error.html(data.msg).slideDown('fast');
                        return;
                    }
                    var comment_parent_id = respond.find('input[name=comment_parent]').val();
                    var _comment = $(data.html);
                    var list;
                    _comment.hide();
					
                    if (comment_parent_id == 0) {
                        list = comments.find('ol');
                        if (!list.length) {
                            list = $('<ol class="list"></ol>');
                            comments.append('<h3>Comments</h3>')
                            comments.append(list);
                        }
                    } else {
                        list = $('#comment-' + comment_parent_id).parent().find('ul');
                        if (!list.length) {
                            list = $('<ul class="children"></ul>');
                            $('#comment-' + comment_parent_id).parent().append(list);
                        }
                        respond_cancel.trigger('click');
                    }
                    //console.log(list);
                    list.append(_comment);
                    _comment.fadeIn('fast');
                    
                    respond.find('textarea').clearFields();
                    
                    if(!$('#contact-result-shadow').length){
                        var shadow = $('<div>', {'id' : 'contact-result-shadow'});
                        $('body').append(shadow);
                    }
                    $('#contact-result-shadow').show();
                    $.scrollTo($('body'));
                    confirmation.fadeIn().delay(4000).fadeOut('slow', function(){
                        $('#contact-result-shadow').hide();
                        $.scrollTo(_comment);
                    });
                },
                'error':function(response){
                    var error = response.responseText.match(/\<p\>(.*)<\/p\>/)[1];
                    if (typeof(error) == 'undefined') {
                        error = 'Something went wrong. Please reload the page and try again.';
                    }
                    respond_form_error.html(error).slideDown('fast');
                }
            });
        }
        $(this).each(function(){
            var post = $(this);
          
            // do not init ajax posts & comments for mobile
            if (!is_mobile) {
                // ajax posts enabled
                if (flo.ajax_posts) {
                    $('.preview a.toggle', post).click(load_post);
                    $('.more .close', post).live('click', function(e){
                        e.preventDefault();
                        $(this).parents('article.post').find('a.toggle').trigger('click');
                    });
                }
            }
            
            post.find('img').not('.nopin').pinItButton();
            
            //$('.comments', post).jScrollPane(_scrollPaneSettings);
            //console.log($(".respond form label", post));
            //$(".respond form label", post).inFieldLabels();
        });
        // init ajax comments on a single post if ajax comments are enabled
        if (is_single && parseInt(flo.ajax_comments)) {
            init_comments(posts);	
        }
        // open single post on page
        if ((parseInt(flo.ajax_open_single) && !is_single && posts.length == 1)) {
            posts.find('a.toggle').trigger('click');
        }
        
        if (is_single){
            //$.scrollTo(posts.filter(':first'), 'slow');
        }
        
        
    }
    posts.init_posts();    
     
    
    $.fn.init_contact = function() {
        $(this).each(function(){
            var fn = $(this);
            
            $("form label", fn).inFieldLabels();
            
            var shadow = $('<div>', {'id' : 'contact-result-shadow'});
            var popup = $('#contact-result');
            popup.find('.close').click(function(){
                $(this).parent().fadeOut('slow', function(){
                    $('#contact-result-shadow').hide();
                })
            })
            $('body').append(shadow);
            $('body').append(popup);
            //contact_result();
            
        })
    }
    $('#contact').init_contact();
    
    
});

// HTML5 Fallbacks for older browsers
jQuery(function($) {
    // check placeholder browser support
    if (!Modernizr.input.placeholder) {
        // set placeholder values
        $(this).find('[placeholder]').each(function() {
            $(this).val( $(this).attr('placeholder') );
        });
 
        // focus and blur of placeholders
        $('[placeholder]').focus(function() {
            if ($(this).val() == $(this).attr('placeholder')) {
                $(this).val('');
                $(this).removeClass('placeholder');
            }
        }).blur(function() {
            if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) {
                $(this).val($(this).attr('placeholder'));
                $(this).addClass('placeholder');
            }
        });
 
        // remove placeholders on submit
        $('[placeholder]').closest('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
                if ($(this).val() == $(this).attr('placeholder')) {
                    $(this).val('');
                }
            });
        });
    }
});

function contact_result(){
    var fn = $('#contact');
    $("label", fn).inFieldLabels();
    
    $('#contact-result-shadow').show();
    $('#contact-result').fadeIn('slow'); //.delay(5000).fadeOut();
}