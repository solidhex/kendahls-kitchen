<section class="entry-content cf">
        <?php add_filter('the_content', 'flo_wrap_images', 1);?>
	<?php the_content('Read More&raquo;'); ?>
        <?php remove_filter('the_content', 'flo_wrap_images', 1);?>
</section>
<?php wp_link_pages(array(
	'before' => '<section class="story-pages"><p>' . __('Pages:', 'flotheme'),
	'after'	 => '</p></section>',
)) ?>