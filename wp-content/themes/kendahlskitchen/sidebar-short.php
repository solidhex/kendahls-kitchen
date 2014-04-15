<aside id="sidebar">
    <?php flo_part('social')?>
    <div class="events">
        <h2>Upcoming Events</h2>
        <?php 
        $events = flo_events_get_items();
        ?>
        <div class="items">
        <?php foreach($events as $event):?>
            <div class="item">
                <?php if(!empty($event['date'])):?>
                <?php echo $event['date']?><br/>
                <?php endif;?>
                <?php if(!empty($event['time'])):?>
                <?php echo $event['time']?><br/>
                <?php endif;?>
                <?php if(!empty($event['location'])):?>
                <?php echo $event['location']?><br/>
                <?php endif;?>
                <h3><?php echo $event['title']?></h3>
                <div class="text"><?php echo $event['content']?></div>
                <?php if(!empty($event['signup'])):?>
                    <a href="<?php echo $event['signup']?>">Sign Up&raquo;</a>
                <?php endif?>
            </div>
        <?php endforeach;?>
        </div>
    </div>
</aside>