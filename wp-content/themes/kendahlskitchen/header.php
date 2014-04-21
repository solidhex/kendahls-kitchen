<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" <?php language_attributes(); ?>> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" <?php language_attributes(); ?>> <!--<![endif]-->
<head>
    <title><?php wp_title('|', true, 'right'); bloginfo('name'); ?></title>
    <meta http-equiv="x-ua-compatible" content="IE=8"/>
    <?php wp_head(); ?>
    
</head>
<body <?php body_class(); ?>>
    
        <!--[if lt IE 8]><p class="chromeframe">Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
        <header id="header">
            <h1><a href="<?php echo home_url(); ?>/"><?php bloginfo('name'); ?></a></h1>
            <nav id="menu" role="navigation" class="cf">
                <?php
                wp_nav_menu(array(
                    'menu' => 'Header Menu',
                    'menu_class' => 'menu cf',
                    'walker' => new Flotheme_Nav_Walker(),
                    'container' => '',
                    'theme_location' => 'header_menu'
                ));
                ?>
            </nav>
        </header>
		<?php if (!is_front_page()): ?>
		<div id="wrapper"> 
        <div id="content" role="main">
            <div class="content-wrapper cf">
                <div id="main">
		<?php else: ?>
			<div class="hero">
				<div class="hero-carousel">
					<?php
						$items = get_posts('post_type=post&meta_key=carousel&posts_per_page=-1');
						foreach ($items as $item):
					?>
						<article>
							<a href="<?php echo get_permalink($item->ID); ?>">
								<?php
									$key = get_post_meta($item->ID, 'carousel-label', true);
								?>
								<?php if (!empty($key)): ?>
									<div class="tag"><?php echo $key; ?>»</div>
								<?php endif ?>
								<figure>
									<?php echo get_attached_images($item->ID, "full", null, TRUE); ?>
									<figcaption>
										<section>
										  <div>
											  <h1><?php echo $item->post_title; ?></h1>
											 <p>
											 	<?php echo $item->post_excerpt; ?>
											 </p>
											 <span>READ MORE»</span>
										  </div>
										</section>
									</figcaption>
								</figure>
							</a>
						</article>
					<?php endforeach ?>
				</div>
			</div>
		<script>
		$(document).ready(function() {
	
			var $carousel = $(".hero-carousel");
	
			$carousel.heroCarousel({
				css3pieFix: true,
				onLoad: function () {
					$carousel.animate({"opacity" : 1}, 500);
				},
				onComplete: function () {
					//alert("onComplete callback");
				}
			});
		});
	
		</script>	
		<div id="wrapper"> 
		<?php endif; ?>