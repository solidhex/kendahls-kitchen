<section class="actions">
    <div class="share cf">
        <h3>Share with a friend</h3>
        <ul>
            <li><?php flo_share('pin')?></li>
            <li><?php flo_share('like')?></li>
            <li><?php flo_share('tweet')?></li>
            <li><?php flo_share('fb-send')?></li>
        </ul>
    </div>
    <div class="conversation cf">
        <h3>Join the conversation</h3>
       <a href="<?php the_permalink()?>#comments"><?php comments_number('<span>0</span> Comments','<span>1</span> Comment','<span>%</span> Comments'); ?></a>
    </div>
</section>
<section class="categories">categories: <?php the_category(', ')?></section>