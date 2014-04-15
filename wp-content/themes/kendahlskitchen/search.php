<?php get_header(); ?>
<?php flo_page_title(sprintf( __( 'Search Results for: %s', 'flotheme' ), '<span>' . get_search_query() . '</span>' )) ?>
<?php if (have_posts()) :?>
     <div id="posts">
        <?php while (have_posts()) : the_post(); ?>
            <?php flo_part('posthead');?>
            <?php flo_part('postpreview' );?>
            <?php flo_part('postfull');?>
            <?php flo_part('postfooter');?>
    <?php endwhile;  ?>
    </div>
    <?php flo_part('postsnavigation')?>
<?php else: ?>
	<?php flo_part('notfound')?>
<?php endif; ?>
<?php get_footer(); ?>