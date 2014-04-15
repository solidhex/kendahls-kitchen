<?php
/**
 * Displays twitter messages 
 * 
 * @param int $limit
 */
function flo_tweets($limit = 1) {
    $messages = flo_get_tweets(flo_get_twitter_name(), $limit);
    
    if (!count($messages)) {
        echo '<span class="empty">No public Twitter messages.</span>';
        return;
    }
    
    foreach ( $messages as $message ) {
        $msg = " ".substr(strstr($message['descr'],': '), 2, strlen($message['descr']))." ";
        $msg = flo_twitter_hyperlinks($msg);
        $msg = flo_twitter_users($msg);
        echo '<span class="tweet">' . $msg .  '</span>';
    }
}


/**
 * Fetch twitter messages for specified user.
 * 
 * @param string $username
 * @return array
 */
function flo_get_tweets($username, $limit = 1) {
    if (!$username) {
        return false;
    }

    require_once(ABSPATH . WPINC . '/class-simplepie.php');
    $pie = new SimplePie('http://twitter.com/statuses/user_timeline/' . $username . '.rss', sys_get_temp_dir());

    $_feed = $pie->get_items(0, $limit);

    $feed = array();
    foreach ($_feed as $f) {
        $feed[] = array(
            'title'     => $f->get_title(),
            'content'   => $f->get_content(),
            'date'      => $f->get_date(),
            'descr'     => $f->get_description(),
            'link'      => $f->get_link(),
        );
    }

    return $feed;
}

/**
 * Parse message and highlight hyperlinks
 * 
 * @param string $text
 * @return string 
 */
function flo_twitter_hyperlinks($text) {
    $text = preg_replace('/\b([a-zA-Z]+:\/\/[\w_.\-]+\.[a-zA-Z]{2,6}[\/\w\-~.?=&%#+$*!]*)\b/i',"<a href=\"$1\" rel=\"external\">$1</a>", $text);
    $text = preg_replace('/\b(?<!:\/\/)(www\.[\w_.\-]+\.[a-zA-Z]{2,6}[\/\w\-~.?=&%#+$*!]*)\b/i',"<a href=\"http://$1\" rel=\"external\">$1</a>", $text);    
    $text = preg_replace("/\b([a-zA-Z][a-zA-Z0-9\_\.\-]*[a-zA-Z]*\@[a-zA-Z][a-zA-Z0-9\_\.\-]*[a-zA-Z]{2,6})\b/i","<a href=\"mailto://$1\">$1</a>", $text);
    $text = preg_replace('/([\.|\,|\:|\>|\{|\(]?)#{1}(\w*)([\.|\,|\:|\!|\?|\>|\}|\)]?)\s/i', "$1<a href=\"http://twitter.com/#search?q=$2\"  rel=\"external\">#$2</a>$3 ", $text);
    return $text;
}

/**
 * Parse message and highlight users
 * 
 * @param string $text
 * @return string 
 */
function flo_twitter_users($text) {
   return preg_replace('/([\.|\,|\:|\>|\{|\(]?)@{1}(\w*)([\.|\,|\:|\!|\?|\>|\}|\)]?)\s/i', "$1<a href=\"http://twitter.com/$2\"  rel=\"external\">@$2</a>$3 ", $text);
}

/**
 * Find twitter username in link to twitter profile
 * 
 * @return string
 */
function flo_get_twitter_name() {
    preg_match('~([^/]+)$~si', flo_get_option('twi'), $matches);
    return $matches[1];
}

/**
 * Display share options
 * 
 * @param string $type 
 */
function flo_share($type = 'fb') {
    echo flo_get_share($type);
}


/**
 * Get link/code for sharing
 * 
 * @param string $type
 * @return string
 */
function flo_get_share($type = 'fb', $permalink = false, $title = false) {
    if (!$permalink) {
        $permalink = get_permalink();
    }
    if (!$title) {
        $title = get_the_title();
    }
    switch ($type) {
        case 'twi':
            return 'http://twitter.com/home?status=' . $title . '+-+' . $permalink;
            break;
        case 'fb':
            return 'http://www.facebook.com/sharer.php?u=' . $permalink . '&t=' . $title;
            break;
        case 'like':
            return '<iframe src="http://www.facebook.com/plugins/like.php?href=' . urlencode($permalink) . '&amp;send=false&amp;layout=button_count&amp;width=80&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:80px; height:21px;" allowTransparency="true"></iframe>';
            break;
        case 'fb-send':
            return '<fb:send href="' . urlencode($permalink) . '"></fb:send>';
            break;
        case 'tweet':
            return '<a href="http://twitter.com/share" class="twitter-share-button" data-url="' . $permalink . '" data-count="horizontal">Tweet</a>';
            break;
        case 'goglp': // Google Plus share in new window
            return 'https://plus.google.com/share?url='. urlencode($permalink);
            break;
        case 'plus1':
            return '<g:plusone size="medium" href="' . $permalink . '"></g:plusone>';
            break;
        case 'pin':
            return '<a href="http://pinterest.com/pin/create/button/?url=' . $permalink.'&media='.flo_get_post_preview_image_src().'"  class="pin-it-button" count-layout="horizontal" always-show-count="true" ><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>';
            break;
        default:
            return '';
    }
}

/**
 * Get twitter URL
 * @return string
 */
function flo_get_twitter() {
	return flo_get_option('twi') ?  'http://twitter.com/#!/' . flo_get_option('twi') : '';
}
function flo_twitter() {
	echo flo_get_twitter();
}