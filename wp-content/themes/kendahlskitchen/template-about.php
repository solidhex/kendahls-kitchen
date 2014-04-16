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
	<li><a href="#">upcoming events»</a></li>
	<li><a href="#">hire me for your private event»</a></li>
</ul>
</nav>
<?php get_footer(); ?>