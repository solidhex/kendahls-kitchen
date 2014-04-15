<?php flo_part('postcontent');?>
<?php flo_part('postactions');?>
<?php if (is_single()) : ?>
    <?php comments_template(); ?>
<?php endif; ?>
