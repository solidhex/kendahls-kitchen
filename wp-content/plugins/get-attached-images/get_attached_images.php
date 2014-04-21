<?php
/*
Plugin Name: Get Attached Images
Plugin URI: http://solidhex.com/get-attached-images
Description: Get Attached Images pulls all attached images from a post or page. To use it, simply echo out the function either inside or out side of the loop. Visit http://solidhex.com/get-attached-images for documentation.
Version: 1.1
Author: patrick@solidhex.com
Author URI: http://solidhex.com

/*  Copyright 2011  Patrick Jackson  (email : patrick@solidhex.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

Updates:
10.17.11 - Added custom rel attribute support to linked images.

*/

function get_attached_images($pageid = FALSE, $size = "thumbnail", $rel = 'internal', $single = FALSE, $prepend = "", $append = "")
{
	$output = "";

	// first check if we've passed in a specific page ID
	if ($pageid != FALSE) {
		$id = $pageid;
	} else {
		global $post;
		$id = $post->ID;
	}
	
	// now, retrieve all the images
	$images = get_children(array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => 'ASC', 'orderby' => 'menu_order ID'));


	if ($images) {
		foreach ($images as $image) {
			$i++;
			
			if ($image->post_excerpt) {
				$caption = '<span class="get_attached_caption">' . $image->post_excerpt . '</span>'; 
			} else {
				$caption = '';
			}
			
			// this is a bit of a hack to see if a link is in the description area
			if ($link = $image->post_content) {
				$output .= "{$prepend}<a href='$link' rel='$rel'>" . wp_get_attachment_image($image->ID, $size)  . "</a>{$caption}{$append}";
			} else {
				$output .= $prepend . wp_get_attachment_image($image->ID, $size) . $caption . $append;
			}
			if ($single == TRUE && $i == 1)  break;
		}

		return $output;

	} else {
		return false;
	}
}

?>