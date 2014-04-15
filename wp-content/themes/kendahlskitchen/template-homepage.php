<?php
/*
  Template Name: Template Homepage
 */
?>
<?php get_header(); ?>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <section id="homepage">
            <?php $slider = flo_sliders_get_slider('sneak-peek'); 
            //print_r($slider);
            ?>
            <div class="flexslider">
                <ul class="slides">
                    <?php if ($slider): ?>
                        <?php foreach ($slider['slides'] as $slide) : ?>
                            <?php if ($slide['image']) : ?>
                            <li>
                                <?php echo $slide['image'] ?>
                                <div class="over" style="background-image: url(<?php echo $slide['image_src']?>)"></div>
                                <?php if(!empty($slide['title'])):?>
                                <div class="info">
                                    <div class="title-wrap">
                                        <div class="title">
                                            <?php echo $slide['title']?>
                                            <span><?php echo $slide['description']?></span>
                                        </div>
                                        <?php if(!empty($slide['url'])):?>
                                            <a href="<?php echo $slide['url']?>" class="link">Open Post</a>
                                        <?php endif;?>
                                    </div>
                                </div>
                                <?php endif;?>
                            </li>
                            <?php endif; ?>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </ul>
            </div>
            <div class="galleries">
                <h2>Featured Galleries</h2>
                <?php $featured = flo_portfolio_get_featured();
                //print_r($featured);
                ?>
                <div class="items cf">
                    <?php foreach($featured as $item):?>
                    <div class="wrapper">
                        <div class="item">
                            <div class="image">
                                <?php echo $item['image']?>
                                <a href="<?php echo $item['link']?>" class="over"><span><?php echo $item['category']?></span></a>
                            </div>
                            <h3><a href="<?php echo $item['link']?>"><?php echo $item['title']?></a></h3>
                            <div class="desc"><?php echo $item['description']?></div>
                        </div>
                    </div>
                    <?php endforeach;?>
                </div>
            </div>
            <?php flo_part('social')?>
            
        </section>
    <?php endwhile;
else:
    ?>
    <?php flo_part('notfound') ?>
<?php endif; ?>
<?php get_footer(); ?>