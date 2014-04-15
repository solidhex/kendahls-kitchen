<?php
/**
 * Get current theme options
 * 
 * @return array
 */
function flotheme_get_options() {
	$comments_style = array(
		'wp'  => 'Standart',
		'fb'  => 'Facebook Comments',
		'dq'  => 'DISQUS',
		'lf'  => 'Livefyre',
		'off' => 'Disable All Comments',
	);
	
	$imagepath =  FLOTHEME_URL . '/assets/images/';
	
	$options = array();
	
	$options[] = array("name" => "Theme",
						"type" => "heading");
        
        $options[] = array( "name" => "AJAX Comments",
						"desc" => "Use AJAX on comments posting (works only with Standart Comments selected).",
						"id" => "flo_ajax_comments",
						"std" => "1",
						"type" => "checkbox");
        
	$options[] = array( 
                        "name" => "About Kendahl Image",
                        "id" => "flo_about_image",
                        "std" => "",
                        "type" => "upload"
            );
	$options[] = array( 
                        "name" => "About Kendahl Text",
                        "id" => "flo_about_text",
                        "std" => "",
                        "type" => "textarea"
            );
	$options[] = array( 
                        "name" => "The Kitchen Text",
                        "id" => "flo_kitchen_text",
                        "std" => "",
                        "type" => "textarea"
            );
	$options[] = array( 
                        "name" => "New Shop Item Image",
                        "id" => "flo_shop_image",
                        "std" => "",
                        "type" => "upload"
            );
	$options[] = array( 
                        "name" => "New Shop Item Link",
                        "id" => "flo_shop_link",
                        "std" => "",
                        "type" => "text"
            );
	
	$options[] = array( "name" => "Copyrights",
						"desc" => "Your copyright message.",
						"id" => "flo_copyrights",
						"std" => "",
                                                
						"type" => "text");
        
	
	$options[] = array( "name" => "Social",
						"type" => "heading");
	
        $options[] = array( "name" => "Twitter",
						"desc" => "Your twitter username.",
						"id" => "flo_twi",
						"std" => "",
						"type" => "text");
	$options[] = array( "name" => "Facebook",
						"desc" => "Your facebook profile URL.",
						"id" => "flo_fb",
						"std" => "",
						"type" => "text");
	$options[] = array( "name" => "Pinterest",
						"desc" => "Your pinterest profile URL.",
						"id" => "flo_pinterest",
						"std" => "",
						"type" => "text");
	$options[] = array( "name" => "Instagram",
						"desc" => "Your instagram profile URL.",
						"id" => "flo_instagram",
						"std" => "",
						"type" => "text");
	$options[] = array( "name" => "Vimeo",
						"desc" => "Your vimeo profile URL.",
						"id" => "flo_vimeo",
						"std" => "",
						"type" => "text");
	$options[] = array( "name" => "Tumblr",
						"desc" => "Your tumblr profile URL.",
						"id" => "flo_tumblr",
						"std" => "",
						"type" => "text");
	
	$options[] = array( "name" => "Advanced Settings",
						"type" => "heading");
	
	$options[] = array( "name" => "Google Analytics",
						"desc" => "Please insert your Google Analytics code here. Example: <strong>UA-22231623-1</strong>",
						"id" => "flo_ga",
						"std" => "",
						"type" => "text"); 
	
	$options[] = array( "name" => "Footer Code",
						"desc" => "If you have anything else to add in the footer - please add it here.",
						"id" => "flo_footer_info",
						"std" => "",
						"type" => "textarea");
	return $options;
}

/**
 * Add custom scripts to Options Page
 */
function flotheme_options_custom_scripts() {
 ?>

<script type="text/javascript">
jQuery(document).ready(function() {
	
});
</script>

<?php
}

/**
 * Add Metaboxes
 * @param array $meta_boxes
 * @return array 
 */
function flotheme_metaboxes($meta_boxes) {
	
	$meta_boxes = array(
		
		array(
			'id'		=> 'contact_metabox',
			'title'		=> 'Additional',
			'context'	=> 'normal',
			'priority'	=> 'high',
			'show_names'    =>  true,
			'fields'	=> array(
				array(
                                        'name' => 'Office address',
					'id'   => 'contact_office_address',
					'type' => 'textarea_small'
				),
				array(
                                        'name' => 'Mailing address',
					'id'   => 'contact_mailing_address',
					'type' => 'textarea_small'
				),
				array(
                                        'name' => 'Email',
					'id'   => 'contact_email',
					'type' => 'textarea_small'
				),
				array(
                                        'name' => 'Phone',
					'id'   => 'contact_phone',
					'type' => 'textarea_small'
				),
				array(
                                        'name' => 'Partners',
					'id'   => 'contact_partners',
					'type' => 'wysiwyg'
				),
			),
			'pages'		=> array('page'),
                        'show_on'    => array( 'key' => 'page-template', 'value' => array('template-contact.php'))
		),
		
               
                
                array(
			'id'		=> 'post_metabox',
			'title'		=> 'Favorite Post',
			'context'	=> 'side',
			'priority'	=> 'high',
			'show_names'    =>  false,
			'fields'	=> array(
				
				array(
                                        'name' => 'Object html',
					'id'   => 'featured',
					'type' => 'checkbox'
				),
			),
			'pages'		=> array('post'),
		),
                array(
			'id'		=> 'event_metabox',
			'title'		=> 'Additional Information',
			'context'	=> 'normal',
			'priority'	=> 'high',
			'show_names'    =>  true,
			'fields'	=> array(
				array(
                                        'name' => 'Date',
					'id'   => 'event-date',
					'type' => 'text'
				),
				array(
                                        'name' => 'Time',
					'id'   => 'event-time',
					'type' => 'text'
				),
				array(
                                        'name' => 'Location',
					'id'   => 'event-location',
					'type' => 'text'
				),
				array(
                                        'name' => 'Sign Up Url',
					'id'   => 'event-signup',
					'type' => 'text'
				),
			),
			'pages'		=> array('event'),
		),
                
	);
	
	return $meta_boxes;
}

/**
 * Get image sizes for images
 * 
 * @return array
 */
function flotheme_get_images_sizes() {
	return array(
            '_flotheme_slider_' => array(
                    array(
                            'name'		=> 'slider-image',
                            'width'		=> 0,
                            'height'            => 600,
                            'crop'		=> false,
                    ),
            ),
            'press' => array(
                    array(
                            'name'		=> 'press-image',
                            'width'		=> 197,
                            'height'            => 223,
                            'crop'		=> true,
                    ),
            ),
            
        );
}

/**
 * Add post types that are used in the theme 
 * 
 * @return array
 */
function flotheme_get_post_types() {
	return array(
                'event' => array(
			'config' => array(
				'public' => false,
                                'show_ui' => true,
				'exclude_from_search' => false,
				'has_archive'   => false,
				'supports'=> array(
					'title',
                                        'editor',
				),
				'show_in_nav_menus'=> false,
			),
			'singular' => 'Event',
			'multiple' => 'Events'
		),
                
            );
}

/**
 * Add taxonomies that are used in theme
 * 
 * @return array
 */
function flotheme_get_taxonomies() {
	return array(
            'portfolio-category' => array(
                'for' => array('portfolio'),
                'config' => array(
                    'sort' => true,
                    'args' => array('orderby' => 'term_order'),
                    'hierarchical' => true,
                    'rewrite' => array( 'slug' => 'portfolio', 'with_front' => false ),
                    'show_in_nav_menus'=> true,
                ),
                'singular' => 'Category',
                'multiple' => 'Categories',
                'query_var'=>true
            ),
        );
}

/**
 * Add post formats that are used in theme
 * 
 * @return array
 */
function _flotheme_get_post_formats() {
	return array();
}

/**
 * Get sidebars list
 * 
 * @return array
 */
function flotheme_get_sidebars() {
	$sidebars = array();
	return $sidebars;
}

/**
 * Predefine custom sliders
 * @return array
 */
function flotheme_get_sliders() {
	return array(
		'sneak-peek' => array(
			'title'		=> 'Homepage Sneak Peek',
			'width'		=> 900, 
			'height'	=> 600, 
		),
	);
}

/**
 * Post types where metaboxes should show
 * 
 * @return array
 */
function flotheme_get_post_types_with_gallery() {
	return array();
}

/**
 * Add custom fields for media attachments
 * @return array
 */
function flotheme_media_custom_fields() {
	return array(
            array(
                'name' => 'video_url',
				"label" => "Video Url",
				"type" => "textarea"
            )
        );
}

