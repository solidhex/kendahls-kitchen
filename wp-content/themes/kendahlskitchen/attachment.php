<?php get_header(); ?>
<div id="main" class="cf">
    <div id="blog-wrapper">
        <div id="blog">
            <div id="attachment" class="<?php flo_option('blog_layout')?> cf">
                    <div class="content">
                            <?php flo_page_title('<a href="' . get_permalink($post->post_parent) . '" rev="attachment">' . get_the_title($post->post_parent) . '</a>') ?>
                            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                                    <?php flo_part('posthead');?>
                                    <header>
                                            <h3><?php the_title(); ?></h3>
                                    </header>
                                    <section class="full">
                                            <section class="story cf">
                                                    <p class="attachment">
                                                            <a href="<?php echo wp_get_attachment_url($post->ID); ?>" rel="external"><?php the_title(); ?></a>
                                                    </p>
                                                    <?php the_content(); ?>
                                            </section>
                                    </section>
                                    <?php flo_part('postfooter');?>
                            <?php endwhile; else: ?>
                                    <?php flo_part('notfound')?>
                            <?php endif; ?>
                    </div>
            </div>
        </div>
    </div>
    <?php get_sidebar()?>
    <div class="cf"></div>
    <?php flo_part('social')?>
<?php get_footer(); ?>