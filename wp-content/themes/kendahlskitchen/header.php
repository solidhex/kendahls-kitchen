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
    <div id="wrapper"> 
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
        <div id="content" role="main">
            <div class="content-wrapper cf">
                <div id="main">