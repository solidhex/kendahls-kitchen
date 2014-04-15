<?php 
/**
 * Template Name: Template Coming Soon
 */
get_header(); ?>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <article <?php post_class(); ?> id="coming-soon" data-page-id="<?php the_ID()?>">
        <header class="entry-header">
        <h1 class="entry-title">Coming Soon</h1>
        </header>
        <div class="entry-content">
            <a href="<?php echo site_url('/')?>">Keep Reading the Blog&raquo;</a>
        </div>
    </article>
<?php endwhile; else: ?>
    <?php flo_part('notfound')?>
<?php endif; ?>
<?php get_footer(); ?>