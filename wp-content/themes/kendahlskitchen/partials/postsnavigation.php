<?php 
    global $wp_query;
    //print_r($wp_query);
    //exit;
    ?>
<?php if(get_next_posts_link() || get_previous_posts_link()):?>
<div class="paginator cf">
    <?php if(get_next_posts_link()):?>
    <div class="next"><?php next_posts_link('previous', 0); ?></div>
    <?php endif;?>
    <?php if(get_previous_posts_link()):?>
    <div class="prev"><?php previous_posts_link('next', 0); ?></div>
    <?php endif;?>
</div>
<?php endif;?>