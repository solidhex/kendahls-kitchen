<section class="related">
    <h2 class="title">Related <span>posts</span></h2>
    <?php $related = flo_post_get_related();
    //print_r($related);
    ?>
    <div class="items cf">
        <?php foreach($related as $item):?>
        <div class="item">
            <figure class="image"><a href="<?php echo $item['link']?>"><?php echo $item['image']?></a></figure>
            <h3 class="title"><a href="<?php echo $item['link']?>"><?php echo $item['title']?></a></h3>
            <div class="author">posted by: <span><?php echo $item['author']?></span></div>
        </div>
        <?php endforeach;?>
    </div>
</section>