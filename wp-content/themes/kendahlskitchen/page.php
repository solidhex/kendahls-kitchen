<?php get_header(); ?>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<article <?php post_class(); ?> id="page" data-page-id="<?php the_ID()?>">
            <header class="entry-header">
                <h1 class="entry-title page-title"><?php the_title();?></h1>
            </header>
            <div class="entry-content"><?php the_content();?></div>
        </article>
<?php endwhile; else: ?>
	<?php flo_part('notfound')?>
<?php endif; ?>
<?php get_footer(); ?>