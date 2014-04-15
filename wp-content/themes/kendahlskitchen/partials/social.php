<div class="social">
    <ul class="cf">
        <?php if (flo_get_option('pinterest')) : ?><li><a href="<?php flo_option('pinterest');?>" rel="external" class="pinterest">Pinterest</a></li><?php endif; ?>
        <?php if (flo_get_option('instagram')) : ?><li><a href="<?php flo_option('instagram');?>" rel="external" class="instagram">Instagram</a></li><?php endif; ?>
        <?php if (flo_get_option('vimeo')) : ?><li><a href="<?php flo_option('vimeo');?>" rel="external" class="vimeo">Vimeo</a></li><?php endif; ?>
        <?php if (flo_get_option('tumblr')) : ?><li><a href="<?php flo_option('tumblr');?>" rel="external" class="tumblr">Tumblr</a></li><?php endif; ?>
        <?php if (flo_get_option('twi')) : ?><li><a href="http://twitter.com/#!/<?php flo_option('twi');?>" rel="external" class="twitter">Twitter</a></li><?php endif; ?>
        <?php if (flo_get_option('fb')) : ?><li><a href="<?php flo_option('fb');?>" rel="external" class="facebook">Facebook</a></li><?php endif; ?>
    </ul>
</div>