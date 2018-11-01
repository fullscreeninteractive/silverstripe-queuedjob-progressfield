<% if Job %>
    <div class="queuedjob__progress progress" data-live="{$Link(jobProgress)}?JobId=$Job.ID&amp;JobSignature=$Job.Signature" data-interval="$CheckInterval">
        <div
            class="progress-bar progress-bar-striped $Status <% if isAnimated %>progress-bar-animated<% end_if %>"
            role="progressbar"
            data-placement="top"
            aria-valuenow="$CompletedSteps"
            style="width: {$Percentage}%"
            aria-valuemin="0"
            aria-valuemax="$TotalSteps"
            title="$PopoverTitle"
            data-content="$PopoverContent">
        </div>
    </div>

    <small style="margin-top: 20px; display: block;"><a href="admin/queuedjobs/Symbiote-QueuedJobs-DataObjects-QueuedJobDescriptor/EditForm/field/QueuedJobDescriptor/item/$ID/edit" style="color: #999">View Job Information</a></small>
<% else %>
    <div class="queuedjob__progress progress" data-live="" data-interval="0">
        <div
            class="progress-bar progress-bar-striped"
            role="progressbar"
            data-placement="top"
            aria-valuenow="0"
            style="width: 0%"
            aria-valuemin="0"
            aria-valuemax="1"
            title="No Job Found"
            data-content="Cannot find scheduled job">
        </div>
    </div>
<% end_if %>
