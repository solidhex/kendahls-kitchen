<?php
/****************************************************************
 * DO NOT DELETE
 ****************************************************************/
if ( STYLESHEETPATH == TEMPLATEPATH ) {
	define('FLOTHEME_PATH', TEMPLATEPATH . '/flotheme');
	define('FLOTHEME_URL', get_bloginfo('template_directory') . '/flotheme');
} else {
	
	define('FLOTHEME_PATH', STYLESHEETPATH . '/flotheme');
	define('FLOTHEME_URL', get_bloginfo('stylesheet_directory') . '/flotheme');
}

require_once FLOTHEME_PATH . '/init.php';

/****************************************************************
 * You can add your functions here.
 * 
 * BE CAREFULL! Functions will dissapear after update.
 * If you want to add custom functions you should do manual
 * updates only.
 ****************************************************************/

function filter_post_query( $qobj ) {
    if( !is_admin() ) :
        //print_r($qobj);    exit;
        
        $per_page_arrow = array('work' => 8, 'study' => 6, 'press' => -1);
        
        if(isset( $qobj->query_vars['post_type']) && !is_array($qobj->query_vars['post_type']) && array_key_exists($qobj->query_vars['post_type'], $per_page_arrow) ) :
            if(!is_front_page() && !is_home())
                $qobj->set( 'posts_per_page', $per_page_arrow[$qobj->query_vars['post_type']] );
            
            if($qobj->query_vars['post_type'] == 'story'){
                $qobj->set( 'orderby', 'menu_order' );
                $qobj->set( 'order', 'ASC' );
            }
            
            
        endif;
    endif;
    return $qobj;
}
add_action( 'pre_get_posts', 'filter_post_query', 10, 1 );

function flo_events_get_items() {
    $query = new WP_Query('post_type=event&order=ASC&post_status=publish&posts_per_page=2');
    
    $entries = array();
    while ($query->have_posts()) : $query->the_post();
        $entry = array(
            'id' => get_the_ID(),
            'title' => get_the_title(),
            'content' => get_the_content(),
            'date' => get_post_meta(get_the_ID(), 'event-date', true),
            'time' => get_post_meta(get_the_ID(), 'event-time', true),
            'location' => get_post_meta(get_the_ID(), 'event-location', true),
            'signup' => get_post_meta(get_the_ID(), 'event-signup', true),
        );
        $entries[] = $entry;
    endwhile;
    wp_reset_query();
    return $entries;
}

add_filter('site_transient_update_plugins', 'dd_remove_update_nag');

function dd_remove_update_nag($value) {
    unset($value->response['subscribe2/subscribe2.php']);
    return $value;
}




if( function_exists('add_term_ordering_support') )
	add_term_ordering_support ('portfolio-category');