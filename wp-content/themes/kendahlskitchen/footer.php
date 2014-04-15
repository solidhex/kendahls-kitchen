                </div>
                <?php get_sidebar(is_page() || is_404() ? 'short' : '')?>
            </div>
        </div><!-- /#content -->
        <div id="recent">
            <h2>More From The Kitchen</h2>
            <?php 
            //$recent = flo_get_recent_posts(4);
            $recent = taxonomy_images_plugin_get_terms(array(),array('taxonomy'=>'category', term_args => array( 'hide_empty' => false, 'exclude' => array(1) )));
            
            //print_r($recent);
            ?>
            <div class="items cf">
                <?php foreach($recent as $item):?>
                <div class="item">
                    <div class="image"><a href="<?php echo get_term_link($item)?>"><?php echo wp_get_attachment_image($item->image_id, 'full');?></a></div>
                    <h3><a href="<?php echo get_term_link($item)?>"><?php echo $item->name?></a></h3>
                </div>
                <?php endforeach;?>
            </div>
        </div>
        <footer id="footer" role="contentinfo">
                <?php flo_part('social');?>
                <?php if (flo_get_option('copyrights')) : ?>
                        <span class="copy"><?php flo_option('copyrights'); ?></span>
                <?php else: ?>
                        <span class="copy">&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?></span>
                <?php endif; ?>
                <div class="made">Site Design by <a href="http://www.hidesignhouse.com/" rel="external">Hi Design</a> | Identity Design by <a href="http://thoughtfulday.com/" rel="external">Thoughtful Day</a> | Coded by <a href="http://flosites.com/" rel="external">Flo</a></div>
            
        </footer>
    </div>
    <?php wp_footer(); ?>
</body>
</html>