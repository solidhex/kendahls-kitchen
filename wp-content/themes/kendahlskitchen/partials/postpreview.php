<header class="entry-header">
    <h1>
        <?php if(!is_single()):?><a href="<?php the_permalink() ?>" title="<?php the_title_attribute(); ?>" rel="bookmark"><?php endif;?>
            <?php the_title();?>
        <?php if(!is_single()):?></a><?php endif;?>
    </h1>
    <div class="entry-meta">
        <time pubdate="<?php the_time('c'); ?>"><?php echo get_the_date('d');?><span><?php echo get_the_date('M');?></span></time>
        <?php echo flo_get_post_first_category_link();?>
    </div>
</header>
