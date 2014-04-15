<article <?php post_class(); ?> id="portfolio-video" data-page-id="<?php the_ID()?>">
   
    <header class="entry-header page-header">
        <h1 class="entry-title"><?php the_title()?></h1>
    </header>
    <div class="video"><?php echo get_post_meta(get_the_ID(), 'object', true)?></div>
    <div class="more"><a href="<?php echo flo_portfolio_get_first_category_link(get_the_ID())?>">{ back to videos }</a></div>

    <?php flo_part('social')?>
</article>