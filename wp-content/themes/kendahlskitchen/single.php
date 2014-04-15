<?php get_header(); ?>
<div id="post" class="content">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <?php flo_part('posthead');?>
            <?php flo_part('postpreview');?>
            <?php flo_part('postfull');?>
            <?php flo_part('postfooter');?>
    <?php endwhile; else: ?>
            <?php flo_part('notfound')?>
    <?php endif; ?>
</div>
<?php get_footer(); ?>