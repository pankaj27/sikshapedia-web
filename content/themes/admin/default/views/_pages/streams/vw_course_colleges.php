<?php if (!empty($colleges)) { ?>
    <?php foreach ($colleges as $key => $value) { ?>
        <tr>
            <td><?php echo ($key+1); ?></td>
            <td><input type="checkbox" name="stream_colleges[]" value="<?php echo $value->college_id;?>"></td>
            <td><?php echo $value->college_name; ?></td>
        </tr>
    <?php } ?>
<?php } else { ?>
    <tr><td>No college has been tagged</td></tr>
<?php } ?>