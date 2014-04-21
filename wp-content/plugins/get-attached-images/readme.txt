v1.2 - Added custom rel support on linked images.


Get Attached Images pulls all attached images from a post or page. To use it, simply echo out the function either inside or out side of the loop. 

<?php echo get_attached_images($pageid = FALSE, $size = "thumbnail", $rel="internal", $single = FALSE, $prepend = "", $append = "" ); ?>

$pageid: Use this if you are not pulling images from either the current page or post, or just would like to pull from some other page in general. Defaults to FALSE.

$size: Select "thumbnail", "medium" or "large." Defaults to large.

$rel: Allows you to set the image link to external or internal. Defaults to internal.

$single: If TRUE, this pulls the first image, if FALSE it pulls all images attached. Defaults to FALSE.

$prepend: HTML tag to prepend to the image. 

$append: HTML tag to append to the image.

Additional Notes:

Wrap in the Image in a Link
-----------------------------------------------------------
It's a bit of a hack, but if you enter in a value for Description in the image view, this function will wrap it in a link. For example, Description => http://google.com will create:
<a href='http:///google.com' rel='external'>Description Content</a>

Image Caption
-----------------------------------------------------------
If a caption is entered, this function will automatically append it to the photo, wrapped in a span for you to style as you wish:

<img src="foo.gif" /><span class="get_attached_caption">My Crazy Caption</span>

That's it: ENJOY!