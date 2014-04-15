<form role="search" method="get" id="searchform" action="<?php echo esc_url( home_url( '/' ) ) ?>" >
    <div>
    <label for="s">Search</label>
    <input type="text" value="<?php echo get_search_query(); ?>" name="s" id="s" placeholder="" />
    <input type="submit" id="searchsubmit" value="<?php _e('Search', 'flotheme')?>" />
    </div>
</form>