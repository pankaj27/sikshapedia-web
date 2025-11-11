<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash']; ?>">
<input type="hidden" name="stream_id" id="stream_id" value="<?php echo $stream_id; ?>">


<div class="row">
    
    <div class="col-md-12" id="course_colleges">
        <?php if (!empty($colleges)) { ?>
            <table class="table table-condensed">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Remove</th>
                        <th style="float:left !important;">College Name</th>
                    </tr>
                </thead>
            </table>
            <!-- Scrollable container for the table -->
            <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;"> <!-- Adjust max-height as needed -->
                <table class="table table-condensed" id="stream_colleges">
                    <tbody>
                        <?php foreach ($colleges as $key => $value) { ?>
                            <tr>
                                <td><?php echo ($key+1); ?></td>
                                <td><input type="checkbox" name="stream_colleges[]" value="<?php echo $value->college_id;?>"></td>
                                <td><?php echo $value->college_name; ?></td>
                            </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
        <?php } else { ?>
            <div class="alert alert-info">No college has been tagged</div>
        <?php } ?>
    </div>
</div>