<article <?php post_class(); ?> id="portfolio-photo" data-page-id="<?php the_ID()?>">
    <div class="wrapper">
        <div class="content">
            <header class="entry-header">
                <h1 class="entry-title"><?php the_title()?></h1>
            </header>
            <?php $images = flo_get_attached_images(get_the_ID(), false);?>
            <div class="flexslider gallery">
                <ul class="slides">
                    <?php foreach($images as $item): ?>
                    <li><?php echo wp_get_attachment_image($item->ID, 'gallery-image');?> </li>
                    <?php endforeach;?>
                </ul>
            </div>
            <div class="flexslider thumbnails">
                <ul class="slides">
                    <?php foreach($images as $item): ?>
                    <li><?php echo wp_get_attachment_image($item->ID, 'thumbnail');?> </li>
                    <?php endforeach;?>
                </ul>
            </div>
            <div class="control"><a class="toggle">{ hide thumbs }</a></div>
        </div>
    </div>
    <div class="bottom">
        <?php
        $featured = get_post_meta(get_the_ID(), 'portfolio-featured-on', true);
        if(!empty($featured)):
        ?>
        <div class="featured">
            <h2 class="title">Featured on:</h2>
            <div class="text"><?php echo $featured?></div>
        </div>
        <?php endif;?>
        <div class="desc"><?php echo apply_filters('the_content', get_post_meta(get_the_ID(), 'portfolio-description', true))?></div>
        <?php
        $related = flo_portfolio_get_related(get_the_ID());
        //print_r($related);
        if(count($related)):?>
        <div class="related">
            <h2 class="title"><?php echo flo_portfolio_get_first_category_name(get_the_ID())?> list</h2>
            <div class="items">
                <ul class="cf">
                    <?php foreach($related as $item):?>
                    <li><a href="<?php echo $item['link']?>"><?php echo $item['title']?></a></li>
                    <?php endforeach;?>
                </ul>
            </div>
        </div>
        <?php endif;?>
        <?php flo_part('social')?>
    </div>
</article>