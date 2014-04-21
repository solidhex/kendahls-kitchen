<?php
function flo_get_recent_post()
{
    $query = new WP_Query('post_type=post&orderby=post_date&order=DESC&post_status=publish&posts_per_page=1');
    while ($query->have_posts()) :
        $query->the_post();
        $entry = array(
            'id' => get_the_ID(),
            'title' => get_the_title(),
            'link' => get_permalink(),
            'date' => get_the_time('l, d F Y g:i'),
            'excerpt' => get_the_excerpt(),
            'image' => has_post_thumbnail() ? get_the_post_thumbnail(get_the_ID()) : flo_parse_first_image(get_the_content()),
        );
        return $entry;
    endwhile;
    wp_reset_query();
    return array();
}

function flo_get_recent_posts($num=3)
{
    $query = new WP_Query('post_type=post&orderby=post_date&order=DESC&post_status=publish&posts_per_page='.$num);
    $entries = array();
    while ($query->have_posts()) :
        $query->the_post();
        $entry = array(
            'id' => get_the_ID(),
            'title' => get_the_title(),
            'link' => get_permalink(),
            'date' => get_the_date(),
            'category' => flo_get_post_first_category_link(),
            'excerpt' => get_the_excerpt(),
            'image' => flo_get_post_preview_image(null, 'thumbnail'),
            'author' => get_the_author()
        );
        $entries[] = $entry;
    endwhile;
    wp_reset_query();
    return $entries;
}

function flo_get_favorite_post($num = -1) {
    $query = new WP_Query('post_type=post&meta_key=featured&meta_value=on&posts_per_page='.$num);
    
    $entries = array();
    while ($query->have_posts()) : $query->the_post();
        $entry = array(
            'id' => get_the_ID(),
            'title' => get_the_title(),
            'link' => get_permalink(),
            'image' => flo_get_post_preview_image(null, 'thumbnail')
        );
        $entries[] = $entry;
    endwhile;
    wp_reset_query();
    return $entries;
}

function flo_get_post_preview_image($id = null, $size = 'post-thumbnail'){
    if (!$id) {
        $id = get_the_ID();
    }

    $result = array();
    if(has_post_thumbnail ()){
        $result =  get_the_post_thumbnail($id, $size);

    }elseif($first_image = flo_get_first_attached_image($id)){

        if($first_image->ID){
            $result =  wp_get_attachment_image($first_image->ID, $size);
        }
    }elseif($first_image = flo_parse_first_image()){
            $result =  $first_image;
    }

    //print_r($result);
    return $result;
}

function flo_get_post_preview_image_src($id = null, $size = 'post-thumbnail'){
    if (!$id) {
        $id = get_the_ID();
    }

    $result = null;
    if(has_post_thumbnail ()){
        $attachment_id =  get_post_thumbnail_id($id);
        
        $attachment = wp_get_attachment_image_src($attachment_id, $size);
        $result = $attachment[0]; 
    }elseif($first_image = flo_get_first_attached_image($id)){

        if($first_image->ID){
            $attachment =  wp_get_attachment_image_src($first_image->ID, $size);
            $result = $attachment[0]; 
        }
    }
    elseif($first_image = flo_parse_first_image()){
        preg_match('/(?<!_)src=([\'"])?(.*?)\\1/',$first_image, $matches);
        //print_r($matches);
        $result =  $matches[2];
    }

    //print_r($result);
    return $result;
}

function flo_get_post_first_category_link($id = null){
    if (!$id) {
        $id = get_the_ID();
    }
    
    $categories = get_the_category($id);

    if($categories){
        return '<a href="'.get_term_link($categories[0], 'category').'">'.$categories[0]->name.'</a>';
    }
    return '';
}

function flo_get_post_first_category_name($id = null){
    if (!$id) {
        $id = get_the_ID();
    }
    
    $categories = get_the_category($id);

    if($categories){
        return $categories[0]->name;
    }
    return '';
}
function flo_post_get_related() {
    $args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => 3,
        'post__not_in' => array(get_the_ID()),
        'orderby' => 'rand'
    );
    
    $query = new WP_Query($args);
    $entries = array();
    while ($query->have_posts()) : $query->the_post();
            global $post;
            $entry = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'link' => get_permalink(),
                'image' => has_post_thumbnail() ? get_the_post_thumbnail(get_the_ID(), 'thumbnail') : '',
                'author' => get_the_author()
            );
            $entries[] = $entry;
    endwhile;
    wp_reset_query();
    return $entries;
}
?>
