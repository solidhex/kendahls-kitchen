<?php get_header(); ?>

<div id="recent" class="welcome">
	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		<h2><?php the_title(); ?></h2>
		<article class="items">
			<?php the_content(); ?>
			<nav>
				<a href="#">upcoming events»</a>
				<a href="http://kendahlskitchen.bigcartel.com/" target="_blank">new in the shop»</a>
				<a href="<?php echo get_permalink(275); ?>">latest posts»</a>
				<a href="<?php echo get_permalink(2); ?>">hire US for your private event»</a>
			</nav>
		</article>
	<?php endwhile; endif; ?>
</div>


<?php get_footer(); ?>