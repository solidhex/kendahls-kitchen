<?php
// Do not delete these lines for security reasons
if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME'])) {
    die('Please do not load this page directly. Thanks!');
}
?>
<section class="comments">
    <a name="comments"></a>
    <?php if (post_password_required()) : ?>
        <p class="comments-protected"><?php _e('This post is password protected. Enter the password to view comments.', 'flotheme'); ?></p>
        <?php return;
    endif; ?>
    <?php if (have_comments()) : ?>
        <h3><?php _e('Comments', 'flotheme') ?></h3>
        <ol class="list">
            <?php wp_list_comments(array('callback' => 'flotheme_comment', 'max_depth' => 2)); ?>
        </ol>
        <?php if (get_comment_pages_count() > 1 && get_option('page_comments')) : // are there comments to navigate through ?>
            <nav class="comments-nav" class="pager">
                <div class="previous"><?php previous_comments_link(__('&larr; Older comments', 'flotheme')); ?></div>
                <div class="next"><?php next_comments_link(__('Newer comments &rarr;', 'flotheme')); ?></div>
            </nav>
        <?php endif; // check for comment navigation ?>

        <?php if (!comments_open() && !is_page() && post_type_supports(get_post_type(), 'comments')) : ?>
            <p class="comments-closed"><?php _e('Comments are closed.', 'flotheme'); ?></p>
        <?php endif; ?>
    <?php endif; ?>
    <?php if (!have_comments() && !comments_open() && !is_page() && post_type_supports(get_post_type(), 'comments')) : ?>
        <p class="comments-closed"><?php _e('Comments are closed.', 'flotheme'); ?></p>
    <?php endif; ?>
</section>
<?php if (comments_open()) : ?>
    <section class="respond cf">
        <a name="respond"></a>
        <h3><?php _e('Leave a comment', 'flotheme') ?></h3>
        <p class="cancel-comment-reply"><?php cancel_comment_reply_link(); ?></p>
        <?php if (get_option('comment_registration') && !is_user_logged_in()) : ?>
            <p><?php printf(__('You must be <a href="%s">logged in</a> to post a comment.', 'flotheme'), wp_login_url(get_permalink())); ?></p>
        <?php else : ?>
            <form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" class="comment-form cf">
                <p class="error"></p>
                <div class="inputs cf">
                    <div>
                        <label for="author"><?php _e('Your Name*:', 'flotheme'); ?></label>
                        <input type="text" class="text" name="author" id="author" value="<?php echo esc_attr($comment_author); ?>" size="22" tabindex="1" <?php if ($req) echo "aria-required='true'"; ?> required="required">
                    </div>
                    <div>
                        <label for="email"><?php _e('Your Email Address* (will not be published)', 'flotheme'); ?></label>
                        <input type="email" class="text" name="email" id="email" value="<?php echo esc_attr($comment_author_email); ?>" size="22" tabindex="2" <?php if ($req) echo "aria-required='true'"; ?> required="required" email="true">
                    </div>
                    <div>
                        <label for="url"><?php _e('Your Website:', 'flotheme'); ?></label>
                        <input type="text" class="text" name="url" id="url" value="<?php echo esc_attr($comment_author_url); ?>" size="22" tabindex="3">
                    </div>
                </div>
                <div class="area">
                    <label for="comment"><?php _e('Your Comment*:', 'flotheme'); ?></label>
                    <textarea name="comment" id="comment" class="input-xlarge" tabindex="4" rows="5" cols="40" required="required"></textarea>
                </div>
                <p class="required">Required fields marked*</p>
                <div class="button">
                    <input name="submit" class="submit" type="submit" tabindex="5" value="<?php _e('Submit', 'flotheme'); ?>" />
                </div>
                <div class="cf"></div>
            <?php comment_id_fields(); ?>
            <?php do_action('comment_form', $post->ID); ?>
            </form>
    <?php endif; // if registration required and not logged in ?>
            <div id="commments-confirmation">
                <div class="close"></div>
            </div>
    </section>
<?php endif; ?>