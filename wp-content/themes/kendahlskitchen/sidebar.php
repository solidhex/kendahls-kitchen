<aside id="sidebar">
    <?php flo_part('social')?>
    
    <div class="events">
        <h2>Upcoming Events</h2>
        <?php 
        $events = flo_events_get_items();
        ?>
        <div class="items">
        <?php foreach($events as $event):?>
            <div class="item">
                <?php if(!empty($event['date'])):?>
                <?php echo $event['date']?><br/>
                <?php endif;?>
                <?php if(!empty($event['time'])):?>
                <?php echo $event['time']?><br/>
                <?php endif;?>
                <?php if(!empty($event['location'])):?>
                <?php echo $event['location']?><br/>
                <?php endif;?>
                <h3><?php echo $event['title']?></h3>
                <div class="text"><?php echo $event['content']?></div>
                <?php if(!empty($event['signup'])):?>
                    <a href="<?php echo $event['signup']?>">Sign Up&raquo;</a>
                <?php endif?>
            </div>
        <?php endforeach;?>
        </div>
    </div>
    <div class="about">
        <div class="image"><img src="<?php flo_option('about_image')?>"></div>
        <h2>About Kendahl</h2>
        <div class="text"><?php flo_option('about_text')?></div>
		<a href="<?php echo get_permalink(277); ?>" class="more-link">READ MORE»</a>
    </div>
    <div class="subscribe">
        <?php echo apply_filters('the_content','[subscribe2 hide="unsubscribe"]'); ?>
    </div>
    <div class="search"><?php get_search_form()?></div>
    <div class="filter">
        <div class="categories">
            <div class="wrap">
                <h2>By category</h2>
                <ul><?php wp_list_categories(array('title_li' => ''))?></ul>
            </div>
        </div>
        <div class="archives">
            <div class="wrap">
                <h2>By date</h2>
                <ul><?php wp_get_archives() ?></ul>
            </div>
        </div>
    </div>
    <?php 
        $favorites = flo_get_favorite_post();
        ?>
    <?php if(count($favorites)):?>
    <div class="favorite">
        <h2>Favorite Posts</h2>
        <div class="items">
            <?php foreach($favorites as $item):?>
                <?php if(!empty($item['image'])):?>
                    <div class="item">
                        <?php echo $item['image'];?>
                        <a href="<?php echo $item['link']?>"><span><?php echo $item['title']?></span></a>
                    </div>
                <?php endif;?>
            <?php endforeach;?>
        </div>
    </div>
    <?php endif;?>
    <?php $shop_image = flo_get_option('shop_image');?>
    <?php if(!empty($shop_image)):?>
    <div class="shop">
        <h2>New in the shop</h2>
        <div class="item">
            <a href="<?php flo_option('shop_url')?>"><img src="<?php flo_option('shop_image')?>" /></a>
        </div>
    </div>
    <?php endif;?>
    <a href="#" class="move-top">To the top</a>
</aside>