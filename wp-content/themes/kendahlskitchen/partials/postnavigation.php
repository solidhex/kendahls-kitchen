<?php if(get_next_post() || get_previous_post()):?>
<div class="post-paginator cf">
    <?php 
    if(get_next_post()):?>
    <div class="next"><?php next_post('%', 'Previous', 'no'); ?></div>
    <?php endif;?>
    <?php if(get_previous_post()):?>
    <div class="prev"><?php previous_post('%', 'Next', 'no'); ?></div>
    <?php endif;?>
</div>
<?php endif;?>