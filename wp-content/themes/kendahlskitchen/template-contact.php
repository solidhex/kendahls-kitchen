<?php 
/**
 * Template Name: Template Contact
 */
get_header(); ?>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <article <?php post_class(); ?> id="contact" data-page-id="<?php the_ID()?>">
        <section class="entry-content">
            We'd love to hear from you!
            <span>Send Us a Note</span>
        </section>
        <section class="form">
            <?php echo do_shortcode('[contact-form-7 id="106" title="Contact form 1"]')?>
            <div class="required">Required fields marked*</div>
        </section>
        <div class="more"><a href="<?php echo site_url('/')?>">Keep Reading the Blog&raquo;</a></div>
        <div id="contact-result">
            <h2>WE will be in touch shortly.</h2>
            In the meantime, pop over to the <a href="#">SHOP</a> adn keep<br/>
            reading our <a href="<?php echo site_url('/blog/')?>">BLOG</a> for more inspiration and recipes<br/>
            from Kendahl's Kitchen.
            <div class="close"></div>
        </div>
    </article>
<?php endwhile; else: ?>
    <?php flo_part('notfound')?>
<?php endif; ?>
<?php get_footer(); ?>