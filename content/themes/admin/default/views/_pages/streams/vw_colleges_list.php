<?php if (!empty($colleges)) { ?>
<table class="table table-condensed">
    <thead>
        <tr>
            <th>#</th>
            <th style="float:left !important;">College Name</th>
        </tr>
    </thead>
</table>
<!-- Scrollable container for the table -->
<div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;"> <!-- Adjust max-height as needed -->
    <table class="table table-condensed">
        <tbody>
            <?php foreach ($colleges as $key => $value) { ?>
                <tr>
                    <td><?php echo ($key+1); ?></td>
                    <td><?php echo $value->college_name; ?></td>
                </tr>
            <?php } ?>
        </tbody>
    </table>
</div>
<?php } else { ?>
<div class="alert alert-info">No college has been tagged</div>
<?php } ?>