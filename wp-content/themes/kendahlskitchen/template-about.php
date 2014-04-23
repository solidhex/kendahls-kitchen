<?php
/**
 * Template Name: Template About
 */
?>

<?php get_header(); ?>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<img src="<?php bloginfo('template_directory'); ?>/images/bio-pic.png" width="362" height="509" alt="Kendahl" class="bio">
	<div class="entry-content"><?php the_content();?></div>
<?php endwhile; else: ?>
	<?php flo_part('notfound')?>
<?php endif; ?>
<nav class="subnav">
<ul>	
	<li><a href="http://kendahlskitchen.bigcartel.com/" class="more-link">upcoming events»</a></li>
	<li><a href="<?php echo get_permalink(2); ?>" class="more-link">hire me for your private event»</a></li>
</ul>
</nav>
<?php get_footer(); ?>